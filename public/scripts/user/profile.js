const createOtherDoc = items => {
    let list = '';
    for (const item of items) {
        list += `<option value="">${item}</option>`
    }

    return `<div class="value" data-label="email">
        <select name="" id="" disabled="true">
            ${list}
        </select>
        <div class="btn-edit visible">
            <i class="fas fa-edit"></i>
        </div>
        <div class="btn-save">
            <i class="fas fa-save"></i>
        </div>
        <div class="btn-del">
            <i class="fas fa-trash"></i>
        </div>
    </div>`
};

(async () => {
    const userData = await pagedataload();

    const photoElement = document.querySelector('.photo > .img');

    const fullname = document.querySelector('#fullname');
    const email = document.querySelector('#email');
    const phone = document.querySelector('#phone');
    const bankHolderName = document.querySelector('#bankHolderName');
    const bankName = document.querySelector('#bankName');
    const bankAccNumber = document.querySelector('#bankAccNumber');
    const photoEdit = document.querySelector('#photoEdit');
    const photoRemove = document.querySelector('#photoRemove');

    photoEdit.onclick = async () => {
        const newUrl = window.prompt('Enter image URL', '');

        try {
            await $.
        }
    };

    if (userData.fullname) {
        fullname.value = userData.fullname;
    } else {
        fullname.value = '';
    }

    email.value = userData.contact.email;
    phone.value = userData.contact.phoneNum;
    
    if (userData.bankDetails.name) {
        bankHolderName.value = userData.bankDetails.name;
    } else {
        bankHolderName.value = '';
    }
    if (userData.bankDetails.bankName) {
        bankName.value = userData.bankDetails.bankName;
    } else {
        bankName.value = '';
    }
    if (userData.bankDetails.accountNum) {
        bankAccNumber.value = userData.bankDetails.accountNum;
    } else {
        bankAccNumber.value = '';
    }

    if (userData.photoUrl) {
        photoElement.style.backgroundImage = `url("${userData.photoUrl}")`;
    }

    const editBtns = document.querySelectorAll('.btn-edit');
    const saveBtns = document.querySelectorAll('.btn-save');
    const delBtns = document.querySelectorAll('.btn-del');
    const addBtn = document.querySelector('.others-add');

    for (const editBtn of editBtns) {
        editBtn.onclick = () => {
            const p = editBtn.parentElement;
            
            const input = p.querySelector('input, select')
            const prevValue = input.value;

            editBtn.classList.remove('visible')
            p.querySelector('.btn-save').classList.add('visible');
            try {
                p.querySelector('.btn-del').classList.add('visible');
            } catch(e) {}
            try {
                p.querySelector('.btn-undo').classList.add('visible');
            } catch(e) {}

            input.disabled = false;
            input.select();

            p.classList.add('edit');

            const undoBtn = p.querySelector('.btn-undo');
            undoBtn.onclick = () => {
                input.value = prevValue;

                p.querySelector('.btn-edit').classList.add('visible');
                p.querySelector('.btn-save').classList.remove('visible');
                try {
                    p.querySelector('.btn-del').classList.remove('visible');
                } catch(e) {}
                try {
                    p.querySelector('.btn-undo').classList.remove('visible');
                } catch(e) {}

                p.classList.remove('edit');
            };
        };
    }
    for await (const saveBtn of saveBtns) {
        saveBtn.onclick = async () => {
            const p = saveBtn.parentElement;

            switch(p.dataset.label) {
                case 'fullname':
                    try {
                        await $.ajax({
                            url: '/api/user/update',
                            type: 'post',
                            data: JSON.stringify({
                                payload: {
                                    fullname: fullname.value
                                }
                            }),
                            headers: {
                                'auth-token': `Token ${localStorage.getItem('token')}`
                            },
                            contentType: 'application/json',
                            dataType: 'json'
                        });
                        
                    } catch(e) {
                        alert('Update failure');
                    }
                    
                    break;
                case 'email':
                    try {
                        await $.ajax({
                            url: '/api/user/update',
                            type: 'post',
                            data: JSON.stringify({
                                payload: {
                                    contact: {
                                        email: email.value
                                    }
                                }
                            }),
                            headers: {
                                'auth-token': `Token ${localStorage.getItem('token')}`
                            },
                            contentType: 'application/json',
                            dataType: 'json'
                        });
                        
                    } catch(e) {
                        alert('Update failure');
                    }
                    
                    break;
                case 'phone':
                case 'bankHolderName':
                    try {
                        await $.ajax({
                            url: '/api/user/update',
                            type: 'post',
                            data: JSON.stringify({
                                payload: {
                                    bankDetails: {
                                        name: bankHolderName.value
                                    }
                                }
                            }),
                            headers: {
                                'auth-token': `Token ${localStorage.getItem('token')}`
                            },
                            contentType: 'application/json',
                            dataType: 'json'
                        });
                        
                    } catch(e) {
                        alert('Update failure');
                    }
                    
                    break;
                case 'bankName':
                    try {
                        await $.ajax({
                            url: '/api/user/update',
                            type: 'post',
                            data: JSON.stringify({
                                payload: {
                                    bankDetails: {
                                        bankName: bankName.value
                                    }
                                }
                            }),
                            headers: {
                                'auth-token': `Token ${localStorage.getItem('token')}`
                            },
                            contentType: 'application/json',
                            dataType: 'json'
                        });
                        
                    } catch(e) {
                        alert('Update failure');
                    }
                    
                    break;
                case 'bankAccNumber':
                    try {
                        await $.ajax({
                            url: '/api/user/update',
                            type: 'post',
                            data: JSON.stringify({
                                payload: {
                                    bankDetails: {
                                        accountNum: bankAccNumber.value
                                    }
                                }
                            }),
                            headers: {
                                'auth-token': `Token ${localStorage.getItem('token')}`
                            },
                            contentType: 'application/json',
                            dataType: 'json'
                        });
                        
                    } catch(e) {
                        alert('Update failure');
                    }
                    
                    break;
                default: break;
            }
            window.location.reload();
        };
    }
    for (const delBtn of delBtns) {
        delBtn.onclick = () => {
            delBtn.parentElement.remove();
        };
    }


})();