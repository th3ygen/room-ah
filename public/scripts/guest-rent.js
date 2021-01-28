const createHouse = (id, imageUrl, address, depo, rate) => (`
    <div class="house">
        <div class="image" style="background-image: url('${imageUrl}');"></div>
        <div class="details">
            <div class="price">
                <div class="currency">RM</div>
                <div class="value">${rate}<span>/month</span></div>
            </div>
            <div class="price" style="padding: 10px 0;padding-bottom: 25px; font-size: .9rem;">
                <div class="currency">RM</div>
                <div class="value">${depo}<span> as deposit</span></div>
            </div>
            
            <div class="address" >
                ${address}
            </div>
            <div class="actions">
                <div class="proceed" data-id="${id}">
                    <i class="fas fa-arrow-right"></i>
                </div>
            </div>
        </div>
        
    </div>`);


    /* <div class="attr">
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
            </div> */
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
(async () => {
    await pageload();

    const housesElem = document.querySelector('.houses');

    /* load houses */
    const { houses } = await requestWithoutToken('GET', '/api/house/public/list');

    for (const house of houses) {
        housesElem.innerHTML += createHouse(house._id, house.mediaFiles[0], house.address, putComma(house.pricing.rate), putComma(house.pricing.deposit));
    }

    const proceedBtns = document.querySelectorAll('.actions > .proceed');
    for (const btn of proceedBtns) {
        btn.onclick = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                return Swal.fire({
                    icon: 'error',
                    title: 'No!',
                    text: 'Please login first'
                });
            }

            const profile = await $.ajax({
                url: '/api/user/profile', type: 'GET',
                headers: {
                    'auth-token': `Token ${token}`
                },
                dataType: 'json'
            });

            const confirm = await Swal.fire({
                title: 'Book this house?',
                text: "We will notify the house owner of your booking",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, book it'
            });

            if (confirm.isConfirmed) {
                try {
                    await $.ajax({
                        url: '/api/house/book', type: 'POST',
                        data: JSON.stringify({
                            houseId: btn.dataset.id,
                            enterDate: Date.now()
                        }),
                        headers: {
                            'auth-token': `Token ${token}`
                        },
                        contentType: 'application/json',
                        dataType: 'json'
                    });

                    Swal.fire({
                        icon: 'success',
                        title: 'Booked!',
                        text: 'You rent will be available once the owner approves'
                    });
                } catch(e) {
                    return Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Something went wrong'
                    });
                }
            }
        };
    }
})();
