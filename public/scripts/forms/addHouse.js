(async () => {
    await pageload();

    const form = document.querySelector('.add-house-form');
    const addBtn = document.querySelector('#actionAdd');

    addBtn.onclick = () => {
        form.classList.remove('hidden');
        form.scrollTo(0, 0);
    };

    /* all inputs */
    const inputs = document.querySelectorAll('.form input, .form textarea');
    
    const inputsAsObj = Array.from(inputs)
    .map(el => ({
        [el.id]: el
    })).reduce((res, els) => {
        for (const id in els) {
            if (els.hasOwnProperty(id)) {
                if (id.toString().includes('aImg')) {
                    if (res.additionalImages) {
                        res.additionalImages.push(els[id]);
                    } else {
                        res['additionalImages'] = [els[id]];
                    }
                } else {
                    res[id] = els[id];
                }
            }
        }

        return res;
    });

    const getAllValues = () => {
        const res = {};
        for (const key in inputsAsObj) {
            if (inputsAsObj[key] instanceof Array) {
                res[key] = inputsAsObj[key].map(o => (
                    o.value
                ));
            } else {
                res[key] = inputsAsObj[key].value;
            }
            
        }

        return res;
    };

    /* set value for owner details */
    const userData = await dataload();
    inputsAsObj.username.value = userData.username;
    inputsAsObj.email.value = userData.contact.email;
    inputsAsObj.phone.value = userData.contact.phoneNum;

    const cancelBtn = document.querySelector('.actions > .cancel');
    const submitBtn = document.querySelector('.actions > .submit');

    /* clear and close form on cancel */
    const closeForm = () => {
        form.classList.add('hidden');
    };

    cancelBtn.onclick = closeForm;
    document.onkeyup = e => {
        e = e || window.event;
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeForm();
        }
    };

    /* on submit, validate all value */
    submitBtn.onclick = async () => {
        const values = getAllValues();
        const payload = {
            title: values.label,
            details: values.brief,
            address: values.address,
            pricing: {
                deposit: values.deposit,
                rate: values.rate
            },
            gps: {
                lon: values.lon,
                lat: values.lat
            },
            mediaFiles: [values.mainImg, ...values.additionalImages],
            owner: {
                username: values.username
            }
        };

        try {
            await requestWithToken('POST', '/api/house/add', payload);

            await Swal.fire('House added', 'Your house has been added into our database!', 'success');

            closeForm();
            window.location.reload();
        } catch(e) {
            await Swal.fire('Error occured', 'Don\'t worry, it is our fault', 'error');

            closeForm();
            window.location.reload();
        }
    };
})();