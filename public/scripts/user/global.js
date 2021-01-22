const navs = {
    dashboard: {
        icon: 'fas fa-laptop-house',
        label: "Dashboard",
        path: '/dashboard',
        active: false
    },
    owned: {
        icon: 'fas fa-house-user',
        label: "Owned",
        path: '/owned',
        active: false
    },
    rented: {
        icon: 'fas fa-couch',
        label: "Renting",
        path: '/renting',
        active: false
    },
    profile: {
        icon: 'fas fa-user-cog',
        label: "Profile",
        path: '/profile',
        active: false
    }
};

const notiPopup = ``;

const createNav = data => (
    `<div class="nav ${(data.active ? 'active': '')}" onClick="navigateTo('/user${data.path}')">
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

let user = null;
const pagedataload = () => (
    new Promise(async (resolve, reject) => {
        await pageload();

        try {
            if (user === null) {
                user = await $.ajax({
                    url: '/api/user/profile',
                    type: 'GET',
                    headers: {
                        'auth-token': `Token ${localStorage.getItem('token')}`
                    },
                    dataType: 'json'
                });
        
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
    await pagedataload();

    /* verify user token */
    if (!localStorage.getItem('token')) {
        window.location.href = '/login';
        return;
    }

    verifyToken();
    
    const userImg = document.querySelector('#userImg');
    const username = document.querySelector('#username');

    

    const userElem = document.querySelector('.side-navbar > .user');
    const navElem = document.querySelector('.side-navbar > .navs');
    
    navs[navElem.dataset.active].active = true;
    
    for (const nav of Object.values(navs)) {
        navElem.innerHTML += createNav(nav);
    }
})();

