const createHouse = (imgUrl, owner, address, value, since, renter) => {
    let renterBrief = '';

    renterBrief += `
        <div class="renter">
            <div class="photo">
                <div class="img">
                </div>
            </div>
            <div class="brief">
                <div class="item">
                    <div class="label">Name</div>
                    <div class="value">${renter.name}</div>
                </div>
                <div class="item">
                    <div class="label">Email</div>
                    <div class="value">${renter.email}</div>
                </div>
                <div class="item">
                    <div class="label">Phone number</div>
                    <div class="value">${renter.phone}</div>
                </div>
                <div class="item">
                    <div class="label">Total paid</div>
                    <div class="value">RM${utils.putComma(123092)}</div>
                </div>
            </div>
    </div>`;

    return `
    <div class="item">
        <div class="edits">
            <div class="tick">
                <input type="checkbox" name="" id="">
            </div>
        </div>
        <div class="brief">
            <div class="heading">Details</div>
            <div class="house-info">
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
        </div>
        <div class="stats">
            <div class="renter-info">
                <div class="heading">Renter</div>
                <div class="display">
                    ${renterBrief}
                    <div class="no-renter">
                        <div class="svg"></div>
                        <div class="text">
                            No one rented this house
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
};

(async () => {
    await pageload();

    const actionBtnAdd = document.querySelector('#actionAdd');
    const actionBtnEdit = document.querySelector('#actionEdit');

    const housesElement = document.querySelector('#houses');
    const editActions = document.querySelector('#editActions');
    const editAction = editActions.querySelector('.edit');
    const delAction = editActions.querySelector('.del');

    for(let x = 0; x < 4; x++) {
        housesElement.innerHTML += createHouse(
            'https://preview.colorlib.com/theme/homey/images/property_1.jpg',
            'Edel syaz', '2 Zwar Place, Florey', utils.rnd(650403, 5342311),
            '3 Jan 2021', {
                name: 'Test renter',
                email: 'test@renter.com',
                phone: '+6013497946'
            }
        );
    }

    const housesItemElement = housesElement.querySelectorAll('.item');
    for (const item of housesItemElement) {
        item.onclick = () => {
            if (housesElement.classList.contains('edit-mode')) {
                const checkbox = item.querySelector('.tick > input');
                checkbox.checked = !checkbox.checked;
            }
        };
    }

    actionBtnAdd.onclick = () => {

    };
    actionBtnEdit.onclick = () => {
        if (housesElement.dataset.active !== 'true') {
            housesElement.dataset.active = 'true';
            actionBtnEdit.innerHTML = 'Exit edit mode';

            housesElement.classList.add('edit-mode');
            editActions.classList.add('visible');
            actionBtnAdd.classList.add('disabled');
        } else {
            housesElement.dataset.active = 'false';
            actionBtnEdit.innerHTML = 'Edit house';

            housesElement.classList.remove('edit-mode');
            editActions.classList.remove('visible');
            actionBtnAdd.classList.remove('disabled');
        }
        
    };
})();