const housesElem = document.querySelector('.houses');

const house = (imageUrl, price) => (`
<div class="house">
    <div class="image" style="background-image: url('${imageUrl}');"></div>
    <div class="details">
        <div class="price">
            <div class="currency">RM</div>
            <div class="value">${price}<span>/month</span></div>
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

const rnd = (min, max) => {
    return Math.random() * (max - min) + min;
};

const putComma = value => {
    let d = 1;
    let res = [];
    const chars = value.toString().split('').reverse();

    for(const c of chars) {
        res.push(c);
        if (d % 3 === 0 && d !== chars.length) {
            res.push(',');
        }
        d++;
    }

    return res.reverse().join('');
};

for(let x = 0; x < 10; x++) {
    const val = Math.round(rnd(96, 420));
    const str = putComma(val);

    if (Math.round(rnd(0, 10)) < 5) {
        housesElem.innerHTML += house('https://preview.colorlib.com/theme/homey/images/property_1.jpg', str);
    } else {
        housesElem.innerHTML += house('https://www.interorossmoor.com/assets/images/no-image-found.png', str);
    }

}
