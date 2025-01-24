console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains('home');

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'contact/', title: 'Contact' },
  { url: 'https://github.com/nathansso', title: 'GitHub Profile', external: true }
];

let nav = document.createElement('nav');
document.body.prepend(nav)

for (let p of pages) {
  let url = p.url;
  
  url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = p.title;
  
  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );
  
  nav.append(a);

}