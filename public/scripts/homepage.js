document.addEventListener('DOMContentLoaded', function () {
    new Splide('.splide', {
        focus: 'center',
        perPage: 2,
        trimSpace: false,
        gap: '5rem'
    }).mount();
} );