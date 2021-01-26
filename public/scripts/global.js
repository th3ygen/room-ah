const utils = {
    sleep: ms => (
        new Promise((resolve, reject) => {
            setTimeout(() => resolve(), ms);
        })
    ),
    putComma: value => {
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
    },
    rnd: (min, max) => {
        return Math.round(Math.random() * (max - min) + min);
    },
    getParams: () => (
        window.location.search.replace('?', '').split('&').map(o => {
            const item = o.split('=');
            return {
                [item[0]]: item[1]
            }
        }).reduce((res, obj) => {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    res[key] = obj[key];
                }
            }
    
            return res;
        })
    )
};

let pageloaded = false;
const pageload = () => (
    new Promise((resolve, reject) => {
        if (!pageloaded) {
            window.onload = () => {
                pageloaded = true;
                return resolve();
            };
        }
        resolve();
    })
);

const topnav = {
    home: {
        label: 'Home',
        path: 'home'
    },
    rent: {
        label: 'Rent',
        path: 'rent'
    },
    about: {
        label: 'About',
        path: ''
    },
    contact: {
        label: 'Contact us',
        path: ''
    }
};

const navigateTo = path => {
    window.location.pathname = path;
};

const navOnClick = (label, path) => {
    if (path === '') {
        window.scrollTo(0, document.body.scrollHeight);
    } else if (window.location.pathname.replace('/', '') === path) {
        window.scrollTo(0, 0);
    } else {
        navigateTo(path);
    }
};

const createNavItem = (label, path) => {
    return `
    <div class="item" onClick="navOnClick('${label}', '${path}')">
        <span>${label}</span>
    </div>
    `
};

(async () => {
    await pageload();

    /* sign up, login */
    const authoriz = document.querySelectorAll('.authoriz > div');
    for(const a of authoriz) {
        a.onclick = () => {
            console.log(a.dataset.path, a);
            /* if logged in */
            try {
                const token = localStorage.getItem('token');

                if (token) {
                    return navigateTo('user/dashboard');
                }
            } catch(e) {}

            navigateTo(a.dataset.path)
        };
    }

    /* loading screen */
    const loadingTextWrapper = document.querySelector('.ml11 .letters');
    if (loadingTextWrapper) {
        loadingTextWrapper.innerHTML = loadingTextWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");
    
        anime.timeline({loop: true})
        .add({
            targets: '.ml11 .line',
            scaleY: [0,1],
            opacity: [0.5,1],
            easing: "easeOutExpo",
            duration: 700
        })
        .add({
            targets: '.ml11 .line',
            translateX: [0, document.querySelector('.ml11 .letters').getBoundingClientRect().width + 10],
            easing: "easeOutExpo",
            duration: 700,
            delay: 100
        }).add({
            targets: '.ml11 .letter',
            opacity: [0,1],
            easing: "easeOutExpo",
            duration: 600,
            offset: '-=775',
            delay: (el, i) => 34 * (i+1)
        }).add({
            targets: '.ml11',
            opacity: 0,
            duration: 1000,
            easing: "easeOutExpo",
            delay: 1000
        });
    }

    /* top navbar */
    try {
        const navbar = document.querySelector('.top-navbar');
        const navItems = navbar.querySelector('.nav-items');

        for(const item of Object.values(topnav)) {
            navItems.innerHTML += createNavItem(item.label, item.path);
        }

        window.onscroll = () => {
            if (window.scrollY > 0) {
                navbar.setAttribute('style', 'padding: 25px 50px; box-shadow: 0 -3px 10px 1px rgba(0, 0, 0, 0.5);');
            } else {
                navbar.setAttribute('style', 'padding: 50px; box-shadow: 0 -3px 10px 1px rgba(0, 0, 0, 0);');
            }
        };

    } catch(e) {}

    /* close loading screen */
    await utils.sleep(300);
    try {
        document.querySelector('.loading-screen-container').setAttribute('style', 'left: -100vw');
    } catch(e) {}

})();

