console.log("IT’S ALIVE!");

// Define the base path explicitly for GitHub Pages
const BASE_PATH = "/portfolio/";

// Helper function to handle links
function resolvePath(url) {
  // For external links, return as-is
  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }
  // For internal links, prepend the BASE_PATH
  return `${BASE_PATH}${url}`;
}

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains("home");

let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "resume/", title: "Resume" },
  { url: "contact/", title: "Contact" },
  { url: "https://github.com/nathansso", title: "GitHub", external: true },
];

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
  let url = resolvePath(p.url); // Use resolvePath to prepend BASE_PATH
  url = !ARE_WE_HOME && !url.startsWith("http") ? "../" + url : url;

  let a = document.createElement("a");
  a.href = url;
  a.textContent = p.title;

  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );

  nav.append(a);
}

// Add other parts of the script below this point
document.body.insertAdjacentHTML(
  "afterbegin",
  `
	<label class="color-scheme">
		Theme:
		<select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>		</select>
	</label>`
);

const select = document.querySelector(".color-scheme select");

function updateColorScheme(scheme) {
  document.documentElement.style.setProperty("color-scheme", scheme);
  localStorage.colorScheme = scheme;
}

function updateAutomaticText() {
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const automaticOption = select.querySelector('option[value="light dark"]');
  automaticOption.textContent = `Automatic (${isDarkMode ? "Dark" : "Light"})`;
}

select.addEventListener("input", function (event) {
  updateColorScheme(event.target.value);
});

updateAutomaticText();
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addListener(updateAutomaticText);

if ("colorScheme" in localStorage) {
  updateColorScheme(localStorage.colorScheme);
  select.value = localStorage.colorScheme;
} else {
  updateColorScheme("light dark");
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".contact-form");

  form?.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = new FormData(form);
    let url = form.action + "?";

    for (let [name, value] of data) {
      if (url.slice(-1) !== "?") {
        url += "&";
      }
      url += `${name}=${encodeURIComponent(value)}`;
    }

    location.href = url;
  });
});
