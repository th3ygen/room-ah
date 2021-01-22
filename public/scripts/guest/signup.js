const sleep = ms => (
    new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms);
    })
);

const validateEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validatePhone = number => {
    return number.trim().match(/^\d+$/) || number.split('').length > 9;
};

(async () => {
    await pageload();

    const inputUsername = document.querySelector('#username');
    const inputEmail = document.querySelector('#email');
    const inputPhone = document.querySelector('#phone');
    const inputPassword = document.querySelector('#password');
    const inputPassword2 = document.querySelector('#password2');

    const inputsElement = document.querySelectorAll('.inputs > .item');
    const registerBtn = document.querySelector('#registerBtn');
    
    const validate = async () => {
        inputUsername.parentElement.parentElement.classList.remove('success');
        inputUsername.parentElement.parentElement.classList.remove('error');
        inputEmail.parentElement.parentElement.classList.remove('success');
        inputEmail.parentElement.parentElement.classList.remove('error');
        inputPhone.parentElement.parentElement.classList.remove('success');
        inputPhone.parentElement.parentElement.classList.remove('error');
        inputPassword.parentElement.parentElement.classList.remove('success');
        inputPassword.parentElement.parentElement.classList.remove('error');
        inputPassword2.parentElement.parentElement.classList.remove('success');
        inputPassword2.parentElement.parentElement.classList.remove('error');

        const { v: res } = await $.ajax({
            url: '/api/auth/validate',
            type: 'post',
            data: JSON.stringify({
                payload: {
                    username: inputUsername.value,
                    email: inputEmail.value
                }
            }),
            contentType: 'application/json',
            dataType: 'json'
        });

        let valid = true;

        if (inputUsername.value === '') {
            inputUsername.parentElement.parentElement.classList.add('error');
            inputUsername.parentElement.parentElement.querySelector('.validation-text').innerHTML = "Username is required";
        
            valid = false;
        } else {
            try {
                const u = res.find(q => ( q.label === 'username' ));
    
                if (u) {
                    inputUsername.parentElement.parentElement.classList.add('error');
                    inputUsername.parentElement.parentElement.querySelector('.validation-text').innerHTML = u.message;
    
                    valid = false;
                } else {
                    inputUsername.parentElement.parentElement.classList.add('success');
                    inputUsername.parentElement.parentElement.querySelector('.validation-text').innerHTML = 'Username looks good';
                }
            } catch(e) {
                console.log('error', e);
            }
        }
        if (inputEmail.value === '') {
            inputEmail.parentElement.parentElement.classList.add('error');
            inputEmail.parentElement.parentElement.querySelector('.validation-text').innerHTML = "Email is required";
        
            valid = false;
        } else {
            if (validateEmail(inputEmail.value)) {
                try {
                    const u = res.find(q => ( q.label === 'email' ));
        
                    if (u) {
                        inputEmail.parentElement.parentElement.classList.add('error');
                        inputEmail.parentElement.parentElement.querySelector('.validation-text').innerHTML = u.message;
    
                        valid = false;
                    } else {
                        inputEmail.parentElement.parentElement.classList.add('success');
                        inputEmail.parentElement.parentElement.querySelector('.validation-text').innerHTML = 'Email looks good';
                    }
                } catch(e) {
                    console.log('error', e);
                }
            } else {
                inputEmail.parentElement.parentElement.classList.add('error');
                inputEmail.parentElement.parentElement.querySelector('.validation-text').innerHTML = "Invalid email";
                
                valid = false;
            }
        }
        if (inputPhone.value === '') {
            inputPhone.parentElement.parentElement.classList.add('error');
            inputPhone.parentElement.parentElement.querySelector('.validation-text').innerHTML = "Phone number is required";
        
            valid = false;
        } else {
            if (!validatePhone(inputPhone.value)) {
                inputPhone.parentElement.parentElement.classList.add('error');
                inputPhone.parentElement.parentElement.querySelector('.validation-text').innerHTML = "Invalid phone number";
            
                valid = false;
            } else {
                inputPhone.parentElement.parentElement.classList.add('success');
                inputPhone.parentElement.parentElement.querySelector('.validation-text').innerHTML = 'Phone number looks good';
            }

        }
        if (inputPassword.value === '') {
            inputPassword.parentElement.parentElement.classList.add('error');
            inputPassword.parentElement.parentElement.querySelector('.validation-text').innerHTML = "Password is required";
        
            valid = false;
        } else {
            if (inputPassword.value.split('').length < 8) {
                inputPassword.parentElement.parentElement.classList.add('error');
                inputPassword.parentElement.parentElement.querySelector('.validation-text').innerHTML = "Password must atleast consist of 8 characters";
            } else {
                inputPassword.parentElement.parentElement.classList.add('success');
                inputPassword.parentElement.parentElement.querySelector('.validation-text').innerHTML = 'Password looks good';
            }
        }
        if (inputPassword2.value === '') {
            inputPassword2.parentElement.parentElement.classList.add('error');
            inputPassword2.parentElement.parentElement.querySelector('.validation-text').innerHTML = "Please confirm your password";
        
            valid = false;
        } else {
            if (inputPassword.value !== inputPassword2.value) {
                inputPassword2.parentElement.parentElement.classList.add('error');
                inputPassword2.parentElement.parentElement.querySelector('.validation-text').innerHTML = "Passwords does not match";
            } else {
                inputPassword2.parentElement.parentElement.classList.add('success');
                inputPassword2.parentElement.parentElement.querySelector('.validation-text').innerHTML = 'Passwords match';
            }
        }

        return valid;
    };

    for (const el of inputsElement) {
        el.querySelector('input').addEventListener('focusout', e => {
            validate();
        });
    }

    registerBtn.onclick = async () => {
        const valid = await validate();

        if (valid) {
            try {
                const user = await $.ajax({
                    url: '/api/auth/register',
                    type: 'post',
                    data: JSON.stringify({
                        payload: {
                            username: inputUsername.value,
                            password: inputPassword.value,
                            contact: {
                                phoneNum: inputPhone.value,
                                email: inputEmail.value
                            }
                        }
                    }),
                    contentType: 'application/json',
                    dataType: 'json'
                });
        
                alert('Account created');

                window.location.href = '/login';
            } catch(e) {
                console.log('error', e);
            }
        }
        
    };
})();