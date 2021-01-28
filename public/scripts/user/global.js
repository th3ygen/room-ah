const functions = {
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/home';
    }
};

const navs = {
    dashboard: {
        icon: 'fas fa-laptop-house',
        label: "Dashboard",
        path: '/user/dashboard',
        active: false
    },
    owned: {
        icon: 'fas fa-house-user',
        label: "Owned",
        path: '/user/owned',
        active: false
    },
    rented: {
        icon: 'fas fa-couch',
        label: "Renting",
        path: '/user/renting',
        active: false
    },
    profile: {
        icon: 'fas fa-user-cog',
        label: "Profile",
        path: '/user/profile',
        active: false
    },
    home: {
        icon: 'fas fa-home',
        label: "Back to home",
        path: '/home',
        active: false
    }
};

const notiPopup = ``;

const createNav = data => (
    `<div class="nav ${(data.active ? 'active': '')}" onClick="navigateTo('${data.path}')">
        <div class="icon">
            <i class="${data.icon}"></i>
        </div>
        <div class="label">
            ${data.label}
        </div>
    </div>`
);

const verifyToken = async () => {
    try {
        const res = await $.ajax({
            url: '/api/auth/verify',
            type: 'post',
            data: JSON.stringify({
                token: localStorage.getItem('token')
            }),
            contentType: 'application/json',
            dataType: 'json'
        });

        return res;
    } catch(e) {
        window.location.href = '/login';
    }
};

const requestWithToken = (type, url, data) => (
    new Promise(async (resolve, reject) => {
        try {
            let res;
            if (type === 'GET') {
                res = await $.ajax({
                    url, type,
                    headers: {
                        'auth-token': `Token ${localStorage.getItem('token')}`
                    },
                    dataType: 'json'
                });
            } else {
                res = await $.ajax({
                    url, type, data: JSON.stringify(data),
                    headers: {
                        'auth-token': `Token ${localStorage.getItem('token')}`
                    },
                    contentType: 'application/json',
                    dataType: 'json'
                });
            }

            resolve(res);
        } catch(e) {
            console.error(e);
            reject();
        }
    })
);

let user = null;
const dataload = () => (
    new Promise(async (resolve, reject) => {
        try {
            if (user === null) {
                user = await requestWithToken('GET', '/api/user/profile');
                username.innerHTML = user.username;
        
                if (user.photoUrl) {
                    userImg.style.backgroundImage = `url("${user.photoUrl}")`;
                }
            }

            resolve(user);
        } catch(e) {
            console.log('error', e);
            alert('Failed to retrieve user info');
        }
    })
);

(async () => {
    await pageload();

    await verifyToken();

    await dataload();

    /* verify user token */
    
    const userImg = document.querySelector('#userImg');
    const username = document.querySelector('#username');

    const userElem = document.querySelector('.side-navbar > .user');
    const navElem = document.querySelector('.side-navbar > .navs');
    
    navs[navElem.dataset.active].active = true;
    
    for (const nav of Object.values(navs)) {
        navElem.innerHTML += createNav(nav);
    }

    /* topbar tools */
    const notiBtn = document.querySelector('.popup.noti').parentElement;
    const settBtn = document.querySelector('.popup.settings').parentElement;

    notiBtn.children[0].onclick = () => {
        const popup = notiBtn.querySelector('.popup');

        if (popup.classList.contains('active')) {
            popup.classList.remove('active');
        } else {
            popup.classList.add('active');
        }
        
    };
    settBtn.children[0].onclick = () => {
        const popup = settBtn.querySelector('.popup');

        if (popup.classList.contains('active')) {
            popup.classList.remove('active');
        } else {
            popup.classList.add('active');
        }
    };
})();


