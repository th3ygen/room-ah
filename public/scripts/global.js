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
    }
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
        path: 'homepage'
    },
    rent: {
        label: 'Rent',
        path: 'rent'
    },
    about: {
        label: 'About',
        path: 'about'
    },
    contact: {
        label: 'Contact us',
        path: 'contact'
    }
};

const navigateTo = path => {
    window.location.href = `http://127.0.0.1:5500/public/routes/guest/${path}.html`;
};

const createNavItem = (label, path) => (
    `
    <div class="item" onClick="navigateTo('${path}')">
        <span>${label}</span>
    </div>
    `
);

(async () => {
    await pageload();

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
    document.querySelector('.loading-screen-container').setAttribute('style', 'left: -100vw');
})();

