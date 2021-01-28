const createHouse = async (id, pricing, imgUrl, owner, address, since, renter, bookingRequest) => {
    let renterBrief = '';
    let paymentBrief = '';
    let totalPaid = 0;

    /* get payments details */
    const { payments } = await requestWithToken('POST', '/api/house/payments', { houseId: id });
    const latestPayment = payments[payments.length - 1]
    
    for (const p of payments) {
        totalPaid += p.paidAmount;
    }

    if (payments.length > 0) {
        if (latestPayment.paid) {
            paymentBrief = `<div class="value">Latest payments has been approved</div>`;
        } else {
            paymentBrief = `
            <div class="value">Latest payment due is RM${utils.putComma(latestPayment.amount)}, paid RM${utils.putComma(latestPayment.paidAmount)}</div>
            <div class="btn" data-id="${latestPayment.id}" data-amount="${latestPayment.amount}" data-paid-amount="${latestPayment.paidAmount}">Approve payment</div>`;
        }
    }

    if (renter.username === '') {
        renterBrief = `
        <div class="no-renter">
            <div class="svg"></div>
            <div class="text">
                No one...
            </div>
        </div>`;
    } else {
        renterBrief += `
            <div class="renter">
                <div class="photo">
                    <div class="img" style="background-image: url('${renter.photoUrl}')">
                    </div>
                </div>
                <div class="brief">
                    <div class="item">
                        <div class="label">Name</div>
                        <div class="value">${renter.username}</div>
                    </div>
                    <div class="item">
                        <div class="label">Email</div>
                        <div class="value">${renter.contact.email}</div>
                    </div>
                    <div class="item">
                        <div class="label">Phone number</div>
                        <div class="value">${renter.contact.phoneNum}</div>
                    </div>
                    <div class="item">
                        <div class="label">Total paid</div>
                        <div class="value">RM${utils.putComma(totalPaid)}</div>
                    </div>
                </div>
        </div>`;
    }
    
    if (bookingRequest.username !== '') {
        renterBrief = `
        <div class="new-booking">
            <div class="heading">
                Someone requesting for booking!
            </div>
            <div class="actions">
                <div class="action decline" data-id="${id}">
                    Decline
                </div>
                <div class="action accept" data-id="${id}">
                    Accept
                </div>
            </div>
        </div>
        `;
    } 

    return `
    <div class="item">
        <div class="edits">
            <div class="tick">
                <input type="checkbox" data-id="${id}">
            </div>
        </div>
        <div class="brief">
            <div class="heading">Details</div>
            <div class="house-info">
                <div class="img" style="background-image:url('${imgUrl}')"></div>
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
                        <div class="label">Deposit:</div>
                        <div class="value">RM${utils.putComma(pricing.deposit)}</div>
                    </div>
                    <div class="item">
                        <div class="label">Monthly:</div>
                        <div class="value">RM${utils.putComma(pricing.rate)}</div>
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
                </div>
            </div>
        </div>
        <div class="stats">
            <div class="renter-info">
                <div class="display btn-confirm-pay">
                    ${paymentBrief}
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
    const emptyElement = housesElement.querySelector('#houses > .empty');
    const editActions = document.querySelector('#editActions');
    const editAction = editActions.querySelector('.edit');
    const delAction = editActions.querySelector('.del');

    /* load houses */
    const houses = await requestWithToken('GET', '/api/house/list');

    if (houses.length > 0) {
        let totalRented = 0;
        let totalBooked = 0;
        let monthlyRev = 0;

        const d = new Date(Date.now()).toString().split(' ').splice(1, 3);
        const thisMonth = [d[0], d[2]].join(' ');

        document.querySelector('#totalHouse').innerHTML = houses.length;

        emptyElement.classList.remove('visible');
        for (const house of houses) {
            totalRented += (house.isRented) ? 1 : 0;
            totalBooked += (house.isBooked) ? 1 : 0;

            /* get all payments */
            const { payments } = await requestWithToken('POST', '/api/house/payments', {
                houseId: house._id
            });
            for (const p of payments) {
                if (p.date === thisMonth) monthlyRev += p.paidAmount;
            }

            housesElement.innerHTML += await createHouse(
                house._id,
                house.pricing,
                house.mediaFiles[0],
                house.owner.username, house.address,
                new Date(house.createdAt).toString().split(' ').splice(1, 3).join(' '), house.rentData, house.bookingData
            );
        }

        document.querySelector('#totalRented').innerHTML = totalRented;
        document.querySelector('#totalBooked').innerHTML = totalBooked;
        document.querySelector('#monthRevenue').innerHTML = `RM${utils.putComma(monthlyRev)}`;
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

    const deleteSelectedBtn = document.querySelector('#deleteSelected');
    const editSelectedBtn = document.querySelector('#editSelected');

    deleteSelectedBtn.onclick = async () => {
        const selected = Array.from(document.querySelectorAll('.tick > input')).filter(i => (i.checked));

        if (selected.length > 0) {
            if (selected.length === 1) {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                });

                const form = await swalWithBootstrapButtons.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'No, cancel!',
                    reverseButtons: true
                });

                if (form.isConfirmed) {
                    try {
                        await requestWithToken('POST', '/api/house/delete', {
                            houseId: selected[0].dataset.id
                        });
    
                        await Swal.fire({
                            icon: 'success',
                            title: 'Deleted',
                            text: 'Selected house is no more'
                        });
                    } catch(e) {
                        await Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Can\'t find given id in our database'
                        });
                    }

                    window.location.reload();
                }
            }
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Select atleast one item'
            });
        }
    };

    editSelectedBtn.onclick = async () => {
        const selected = Array.from(document.querySelectorAll('.tick > input')).filter(i => (i.checked));
    
        if (selected.length === 1) {
            const form = await Swal.mixin({
                input: 'number',
                confirmButtonText: 'Next',
                showCancelButton: true,
                progressSteps: ['1', '2', '3']
            }).queue([
                {
                    title: 'Enter new deposit value (RM)',
                    text: 'Skip if changes is not required here'
                },
                {
                    title: 'Enter new monthly rate (RM)',
                    text: 'Skip if changes is not required here'
                }
            ]);

            const pricing = {};

            if (form.value[0] !== '') {
                pricing['deposit'] = form.value[0];
            }
            if (form.value[1] !== '') {
                pricing['rate'] = form.value[1];
            }

            try {
                await requestWithToken('POST', '/api/house/edit', {
                    houseId: selected[0].dataset.id,
                    pricing
                });

                await Swal.fire({
                    icon: 'success',
                    title: 'Pricing updated',
                    text: 'New deposit and rate for the house!'
                });

                window.location.reload();
            } catch(e) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Can\'t find given id in our database'
                });
            }
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Select only one item'
            });
        }
    };

    const approvePaymentBtns = document.querySelectorAll('.btn-confirm-pay > .btn');
    for (const btn of approvePaymentBtns) {
        btn.onclick = async () => {
            const max = parseFloat(btn.dataset.amount) - parseFloat(btn.dataset.paidAmount);
            const amount = await Swal.fire({
                title: `Enter payment amount, must be less than RM${utils.putComma(max)}`,
                input: 'number',
                showCancelButton: true,
                confirmButtonText: 'Submit'
            });

            const val = parseFloat(amount.value);

            if (val > max) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Given amount exceeds RM${utils.putComma(max)}`
                });
            } else if(val > 0) {
                try {
                    await requestWithToken('POST', '/api/house/payments/approve', {
                        paymentId: btn.dataset.id,
                        amount: val
                    });
                    await Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: `RM${utils.putComma(val)} has been approved`
                    });
                } catch(e) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong'
                    });
                }
                window.location.reload();
            }
        };
    }

    const bookingAcceptBtn = document.querySelectorAll('.new-booking > .actions > .accept');
    const bookingDeclineBtn = document.querySelectorAll('.new-booking > .actions > .decline');

    for (const btn of bookingAcceptBtn) {
        btn.onclick = async () => {
            const confirm = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                reverseButtons: true
            });

            if (confirm.isConfirmed) {
                try {
                    await requestWithToken('POST', '/api/house/book/accept', {
                        houseId: btn.dataset.id
                    });

                    await Swal.fire({
                        icon: 'success',
                        title: 'Accepted',
                        text: 'The house has been rented'
                    });

                    window.location.reload();
                } catch(e) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong'
                    });
                }
                
            }
        };
    }
    for (const btn of bookingDeclineBtn) {
        btn.onclick = async () => {
            const confirm = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                reverseButtons: true
            });

            if (confirm.isConfirmed) {
                try {
                    await requestWithToken('POST', '/api/house/book/reject', {
                        houseId: btn.dataset.id
                    });

                    await Swal.fire({
                        icon: 'success',
                        title: 'Declined',
                        text: 'The house has been rented'
                    });

                    window.location.reload();
                } catch(e) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong'
                    });
                }
                
            }
        };
    }
})();