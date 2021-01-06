const utils = {
    sleep: ms => (
        new Promise((resolve, reject) => {
            setTimeout(() => resolve(), ms);
        })
    )
}

document.addEventListener('DOMContentLoaded', async () => {
    /* loading screen */
    const loadingTextWrapper = document.querySelector('.ml11 .letters');
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

    /* sticky navbar */
    const navbar = document.querySelector('.top-navbar');
    
    window.onscroll = () => {
        if (window.scrollY > 0) {
            navbar.setAttribute('style', 'padding: 25px 50px; box-shadow: 0 -3px 10px 1px rgba(0, 0, 0, 0.5);');
        } else {
            navbar.setAttribute('style', 'padding: 50px; box-shadow: 0 -3px 10px 1px rgba(0, 0, 0, 0);');
        }
    };

    /* close loading screen */
    await utils.sleep(1000);
    document.querySelector('.loading-screen-container').setAttribute('style', 'left: -100vw');
});

