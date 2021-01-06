/* sticky navbar */
const navbar = document.querySelector('.top-navbar');

window.onscroll = () => {
    if (window.scrollY > 0) {
        navbar.setAttribute('style', 'padding: 25px 50px; box-shadow: 0 -3px 10px 1px rgba(0, 0, 0, 0.5);');
    } else {
        navbar.setAttribute('style', 'padding: 50px; box-shadow: 0 -3px 10px 1px rgba(0, 0, 0, 0);');
    }
};