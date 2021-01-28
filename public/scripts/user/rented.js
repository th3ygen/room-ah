const createHouse = (house, payments) => {
    let list = '';
    
    for(const payment of payments) {
        list += `
        <div class="${(payment.paid) ? 'paid' : 'unpaid'}">
            ${payment.date}
            <div class="value">
                <div class="item">
                    <div class="label">Total:</div>
                    <div class="val">RM${utils.putComma(payment.amount)}</div>
                </div>
                <div class="item">
                    <div class="label">Paid:</div>
                    <div class="val">RM${utils.putComma(payment.paidAmount)}</div>
                </div>
            </div>
        </div>`
    }

    return `
    <div class="item">
        <div class="brief">
            <div class="img" style="background-image:url('${house.mediaFiles[0]}')"></div>
            <div class="details">
                <div class="item">
                    <div class="label">Owner:</div>
                    <div class="value">${house.owner.username}</div>
                </div>
                <div class="item">
                    <div class="label">Address:</div>
                    <div class="value">${house.address}</div>
                </div>
                <div class="item">
                    <div class="label">Email:</div>
                    <div class="value">${house.owner.contact.email}</div>
                </div>
                <div class="item">
                    <div class="label">Phone:</div>
                    <div class="value">${house.owner.contact.phoneNum}</div>
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

    let totalPaid = 0;
    let totalNeedToPay = 0;
    let status = 'Paid';

    /* get all rented houses */
    const { houses } = await requestWithToken('GET', '/api/house/rented');
    console.log(houses);
    const emptyElement = document.querySelector('#houses > .empty');
    const houseListElement = document.querySelector('#houses > .content > .list');

    if (houses.length > 0) {
        emptyElement.classList.remove('visible');

        for await (const house of houses) {
            const { payments } = await requestWithToken('POST', '/api/house/payments', { houseId: house._id });
        
            for (const payment of payments) {
                totalPaid += payment.paidAmount;
                totalNeedToPay += payment.amount - payment.paidAmount;
                status = (!payment.paid) ? 'Unpaid' : status;
            }

            houseListElement.innerHTML += createHouse(house, payments);
        }

        document.querySelector('#totalHouse').innerHTML = houses.length;
        document.querySelector('#totalPaid').innerHTML = `RM${utils.putComma(totalPaid)}`;
        document.querySelector('#totalNeedToPay').innerHTML = `RM${utils.putComma(totalNeedToPay)}`;
        document.querySelector('#status').innerHTML = status;
    }

    
})();