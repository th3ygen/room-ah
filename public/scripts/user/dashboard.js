const navs = [
    {
        icon: 'fas fa-laptop-house',
        label: "Dashboard",
        path: '/dashboard',
        active: true
    },
    {
        icon: 'fas fa-house-user',
        label: "Owned",
        path: '/owned',
        active: false
    },
    {
        icon: 'fas fa-couch',
        label: "Rented",
        path: '/rented',
        active: false
    },
    {
        icon: 'fas fa-user-cog',
        label: "Profile",
        path: '/profile',
        active: false
    }
];

const createNav = data => (
    `<div class="nav ${(data.active ? 'active': '')}">
        <div class="icon">
            <i class="${data.icon}"></i>
        </div>
        <div class="label">
            ${data.label}
        </div>
    </div>`
);

const userElem = document.querySelector('.side-navbar > .user');
const navElem = document.querySelector('.side-navbar > .navs');

userElem.querySelector('.img').style.backgroundImage = 'url("https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/4af3e5d8-3352-49bd-9570-de2aef8972b9/eric-bailey-profile.jpg")';

for (const nav of navs) {
    navElem.innerHTML += createNav(nav);
}
