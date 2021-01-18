const housesElem = document.querySelector('.houses');

const createHouse = (imageUrl, price) => (`
<div class="house">
    <div class="image" style="background-image: url('${imageUrl}');"></div>
    <div class="details">
        <div class="price">
            <div class="currency">RM</div>
            <div class="value">${price}</div>
        </div>
        <div class="attr">
            <div class="item">
                <div class="icon">
                    <i class="fas fa-bath"></i>
                </div>
                <div class="value">2</div>
            </div>
            <div class="item">
                <div class="icon">
                    <i class="fas fa-bed"></i>
                </div>
                <div class="value">4</div>
            </div>
            <div class="item">
                <div class="icon">
                    <i class="fas fa-vector-square"></i>
                </div>
                <div class="value">120x120</div>
            </div>
        </div>
        <div class="address">
            62/1 Braybrooke Street, Bruce
        </div>
        <div class="actions">
            <div class="proceed">
                <i class="fas fa-arrow-right"></i>
            </div>
        </div>
    </div>
    
</div>`);

const 

for(let x = 0; x < 10; x++) {
    const val = Math.round(utils.rnd(420000, 9969696));
    const str = utils.putComma(val);

    if (Math.round(rnd(0, 10)) < 5) {
        housesElem.innerHTML += createHouse('https://preview.colorlib.com/theme/homey/images/property_1.jpg', str);
    } else {
        housesElem.innerHTML += createHouse('https://www.interorossmoor.com/assets/images/no-image-found.png', str);
    }

}
