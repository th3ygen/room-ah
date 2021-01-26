(async () => {
    await pageload();

    const username = document.querySelector('#username');
    const password = document.querySelector('#password');
    const submit = document.querySelector('#submit');

    const validate = () => {
        if (username.value === '') {
            alertify.error('Please enter username');
            return false;
        }
        if (password.value === '') {
            alertify.error('Please enter password');
            return false;
        }

        return true;
    };

    submit.onclick = async () => {
        if (!validate()) return;

        try {
            const res = await $.ajax({
                url: '/api/auth/login',
                type: 'post',
                data: JSON.stringify({
                    username: username.value,
                    password: password.value
                }),
                contentType: 'application/json',
                dataType: 'json'
            });

            localStorage.setItem('token', res);

            window.location.href = '/user/dashboard';
        } catch(e) {
            alertify.error('Wrong username or password');
            console.log('error', e);
        }
    };

})();