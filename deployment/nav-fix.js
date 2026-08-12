function fixAuthNav() {
  const links = document.querySelectorAll('.nav-links a');
  if (links.length >= 4) {
    links[2].textContent = 'Đăng ký';
    links[2].setAttribute('href', '/register');
    links[3].textContent = 'Đăng nhập';
    links[3].setAttribute('href', '/login');
  }
}

const renderWithBrand = render;
render = function () {
  renderWithBrand();
  fixAuthNav();
};

fixAuthNav();
