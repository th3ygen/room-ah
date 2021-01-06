const SLIDER_HOUSE = price => {
    return `<li class="splide__slide">
    <div class="preview-container">
        <div class="details">
            <div class="price">
                <div class="discounted">
                    $${price}
                </div>
                <div class="origin">
                    $720
                </div>
            </div>
            <div class="address">
                62/1 Braybrooke Street, Bruce
            </div>
        </div>
        <div class="main-img"></div>
        <div class="overlay"></div>
    </div>
    </li>`;
};

document.addEventListener('DOMContentLoaded', function () {
    /* slider content */
    const housesSlider = document.querySelector('.houses-slide');
    for(let x = 0; x < 5; x++) {
        housesSlider.innerHTML += SLIDER_HOUSE(399 + x);
    }

    /* init slider */
    new Splide('.splide', {
        focus: 'center',
        perPage: 2,
        trimSpace: false
    }).mount();
} );