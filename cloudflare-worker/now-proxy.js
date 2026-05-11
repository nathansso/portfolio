/**
 * Cloudflare Worker: now-proxy
 *
 * Handles all three activity sources server-side, keeping every API key off
 * the client. Deploy to Cloudflare Workers (free tier: 100k req/day).
 *
 * Environment variables (Cloudflare dashboard → Worker Settings → Variables):
 *   LASTFM_API_KEY  — last.fm/api/account/create
 *   LASTFM_USER     — your Last.fm username
 *   STEAM_API_KEY   — store.steampowered.com/dev/apikey
 *   STEAM_ID        — 64-bit SteamID (resolve vanity name at steamid.io)
 *   GH_TOKEN        — GitHub PAT (Settings → Developer Settings → PAT classic),
 *                     scopes: read:user + repo
 *   GH_USER         — your GitHub username (e.g. "nathansso")
 *   ALLOWED_ORIGIN  — your portfolio domain, e.g. "nathansso.github.io"
 *                     (optional — omit to allow all origins during dev)
 *
 * Response shape:
 *   {
 *     music:  { active, track, artist, artUrl },
 *     steam:  { active, game, artUrl },
 *     github: { active, repo, pushedAt }
 *   }
 */

const LASTFM_API = 'https://ws.audioscrobbler.com/2.0';
const STEAM_API  = 'https://api.steampowered.com';
const STEAM_CDN  = 'https://cdn.akamai.steamstatic.com/steam/apps';
const GITHUB_API = 'https://api.github.com';

export default {
  async fetch(request, env) {
    // Origin guard — blocks other sites from burning your Cloudflare quota.
    // Defaults to the portfolio's GitHub Pages domain; override via ALLOWED_ORIGIN env var.
    const ALLOWED_ORIGIN = env.ALLOWED_ORIGIN ?? 'nathansso.github.io';
    const origin  = request.headers.get('Origin')  ?? '';
    const referer = request.headers.get('Referer') ?? '';
    const ok = !origin                           // same-origin request (no Origin header)
             || origin === 'null'                // file:// or localhost in some browsers
             || origin.includes(ALLOWED_ORIGIN)
             || referer.includes(ALLOWED_ORIGIN);
    if (!ok) {
      return new Response('Forbidden', { status: 403 });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(env) });
    }

    const [musicResult, steamResult, githubResult] = await Promise.allSettled([
      fetchMusic(env),
      fetchSteam(env),
      fetchGitHub(env),
    ]);

    const music  = musicResult.status  === 'fulfilled' ? musicResult.value  : { active: false, track: null, artist: null, artUrl: null };
    const steam  = steamResult.status  === 'fulfilled' ? steamResult.value  : { active: false, game: null, artUrl: null };
    const github = githubResult.status === 'fulfilled' ? githubResult.value : { active: false, repo: null, pushedAt: null };

    return new Response(JSON.stringify({ music, steam, github }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        ...corsHeaders(env),
      },
    });
  },
};

async function fetchMusic(env) {
  if (!env.LASTFM_API_KEY || !env.LASTFM_USER) {
    return { active: false, track: null, artist: null, artUrl: null };
  }

  const url = `${LASTFM_API}/?method=user.getrecenttracks`
            + `&user=${encodeURIComponent(env.LASTFM_USER)}`
            + `&api_key=${env.LASTFM_API_KEY}&format=json&limit=1`;
  const res  = await fetch(url);
  if (!res.ok) throw new Error(`lastfm ${res.status}`);

  const json   = await res.json();
  const tracks = json?.recenttracks?.track;
  const top    = Array.isArray(tracks) ? tracks[0] : tracks;
  if (!top) return { active: false, track: null, artist: null, artUrl: null };

  const nowPlaying = top?.['@attr']?.nowplaying === 'true';
  const artUrl     = top?.image?.[3]?.['#text'] || top?.image?.[2]?.['#text'] || null;

  return {
    active: nowPlaying,
    track:  top?.name                 ?? null,
    artist: top?.artist?.['#text']    ?? null,
    artUrl: artUrl && artUrl !== '' ? artUrl : null,
  };
}

async function fetchSteam(env) {
  if (!env.STEAM_API_KEY || !env.STEAM_ID) {
    return { active: false, game: null, artUrl: null };
  }

  const url = `${STEAM_API}/ISteamUser/GetPlayerSummaries/v2/`
            + `?key=${env.STEAM_API_KEY}&steamids=${env.STEAM_ID}`;
  const res  = await fetch(url);
  if (!res.ok) throw new Error(`steam ${res.status}`);

  const json   = await res.json();
  const player = json?.response?.players?.[0];
  if (!player)  return { active: false, game: null, artUrl: null };

  const inGame = Boolean(player.gameid);
  if (inGame) {
    return {
      active: true,
      game:   player.gameextrainfo ?? null,
      artUrl: `${STEAM_CDN}/${player.gameid}/header.jpg`,
    };
  }

  // Not currently in-game — fetch most recently played for hover preview
  const recentUrl = `${STEAM_API}/IPlayerService/GetRecentlyPlayedGames/v1/`
                  + `?key=${env.STEAM_API_KEY}&steamid=${env.STEAM_ID}&count=1`;
  const recentRes  = await fetch(recentUrl);
  if (!recentRes.ok) return { active: false, game: null, artUrl: null };
  const recentJson = await recentRes.json();
  const lastGame   = recentJson?.response?.games?.[0];

  return {
    active: false,
    game:   lastGame?.name ?? null,
    artUrl: lastGame ? `${STEAM_CDN}/${lastGame.appid}/header.jpg` : null,
  };
}

async function fetchGitHub(env) {
  const user  = env.GH_USER;
  const token = env.GH_TOKEN;
  if (!user) {
    return { active: false, repo: null, pushedAt: null };
  }

  const headers = {
    'Accept':               'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent':           'now-proxy-worker',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const url = `${GITHUB_API}/users/${user}/events?per_page=30`;
  const res  = await fetch(url, { headers });
  if (!res.ok) throw new Error(`github ${res.status}`);

  const events = await res.json();
  const push   = events.find(e => e.type === 'PushEvent');
  if (!push) return { active: false, repo: null, pushedAt: null };

  const pushedAt = push.created_at;
  const hoursAgo = (Date.now() - new Date(pushedAt)) / 3_600_000;
  const repoName = (push.repo?.name ?? '').replace(`${user}/`, '');

  return {
    active:   hoursAgo < 48,
    repo:     repoName || null,
    pushedAt,
  };
}

function corsHeaders(env) {
  const domain = env.ALLOWED_ORIGIN ?? 'nathansso.github.io';
  return {
    'Access-Control-Allow-Origin':  `https://${domain}`,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age':       '86400',
  };
}
