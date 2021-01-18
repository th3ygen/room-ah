const createHouse = (imgUrl, owner, address, value, since, payments) => {
    let list = '';

    for(const payment of payments) {
        list += `<div class="${(payment.paid) ? 'paid' : 'unpaid'}">${payment.date}<div class="value">RM${utils.putComma(payment.amount)}</div></div>`
    }

    return `
    <div class="item">
        <div class="brief">
            <div class="img" style="background-image:url('${imgUrl}'"></div>
            <div class="details">
                <div class="item">
                    <div class="label">Owner:</div>
                    <div class="value">${owner}</div>
                </div>
                <div class="item">
                    <div class="label">Address:</div>
                    <div class="value">${address}</div>
                </div>
                <div class="item">
                    <div class="label">Value:</div>
                    <div class="value">RM${utils.putComma(value)}</div>
                </div>
                <div class="item">
                    <div class="label">Since:</div>
                    <div class="value">${since}</div>
                </div>
            </div>
        </div>
        <div class="stats">
            <div class="payments">
                <div class="heading">Payments history</div>
                <div class="display">${list}</div>
            </div>
        </div>
    </div>`;
};

(async () => {
    await pageload();

    /* house list */
    const houseListElement = document.querySelector('#houses > .content > .list');

    for(let x = 0; x < 4; x++) {
        let payments = [];
        for (let y = 0; y < 25; y++) {
            payments.push({
                paid: (utils.rnd(0, 1)),
                date: 'Test 2073',
                amount: utils.rnd(300, 600)
            });
        }

        houseListElement.innerHTML += createHouse('https://preview.colorlib.com/theme/homey/images/property_1.jpg', 'Edel syaz', '2 Zwar Place, Florey', utils.rnd(650403, 5342311), '3 Jan 2021', payments);
    }
})();