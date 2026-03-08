let lastScroll = 0;
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 80) {
      header.style.top = '-110px';
    } else {
      header.style.top = '0';
    }
    lastScroll = currentScroll;
  });
}

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
}

['dropdownLebensmomente','dropdownProduktwelten'].forEach((id) => {
  const dropdown = document.getElementById(id);
  if (!dropdown) return;
  const button = dropdown.querySelector('.dropbtn');
  if (!button) return;
  button.addEventListener('click', (e) => {
    if (window.innerWidth <= 900) {
      e.preventDefault();
      dropdown.classList.toggle('open');
    }
  });
});
