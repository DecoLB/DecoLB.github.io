
const btn = document.getElementById('langToggle');
let lang = 'pt';
btn.addEventListener('click', () => {
  lang = lang === 'pt' ? 'en' : 'pt';
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-pt][data-en]').forEach(el => {
    el.textContent = el.dataset[lang];
  });
  btn.textContent = lang === 'pt' ? 'EN' : 'PT';
});
