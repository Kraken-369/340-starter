/**
 *  Toggle Menu to responsive mobile screen 
 */

document.getElementById('current-year').innerText = new Date().getFullYear();

const menu = document.getElementById('main-menu');
const hamburgerButton = document.querySelector('.hamburger-button');

const toggleMenu = () => {
  if (menu.classList.contains('show-menu')) {
    menu.classList.remove('show-menu');
  } else {
    menu.classList.add('show-menu');
  }

}

hamburgerButton.addEventListener('click', toggleMenu);