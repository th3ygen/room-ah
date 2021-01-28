const SLIDER_HOUSE = house => {
    return `<li class="splide__slide">
    <div class="preview-container">
        <div class="details">
            <div class="price">
                <div class="discounted">
                    RM${house.pricing.rate}/month
                </div>
                <div class="origin">
                    RM${house.pricing.deposit} as deposit
                </div>
            </div>
            <div class="address">
                ${house.address}
            </div>
        </div>
        <div class="main-img" style="background-image: url('${house.mediaFiles[0]}')"></div>
        <div class="overlay"></div>
    </div>
    </li>`;
};

(async () => {
    await pageload();

    /* slider content */
    const housesSlider = document.querySelector('.houses-slide');

    const { houses } = await $.ajax({
        url: '/api/house/public/list', type: 'get',
        contentType: 'application/json',
        dataType: 'json'
    });
    
    for (const house of houses) {
        housesSlider.innerHTML += SLIDER_HOUSE(house);
    }

    /* init slider */
    new Splide('.splide', {
        focus: 'center',
        perPage: 2,
        trimSpace: false
    }).mount();

    AOS.init();
})();