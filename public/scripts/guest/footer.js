(async () => {
    await pageload();

    /* feedback btn */
    const feedbackBtn = document.querySelector('#feedbackBtn');

    feedbackBtn.onclick = async () => {
        try {
            const popup = await Swal.mixin({
                input: 'text',
                confirmButtonText: 'Next',
                showCancelButton: true,
                progressSteps: ['1', '2', '3']
            }).queue([
                {
                    title: 'Email address',
                    text: 'First, please provide your email address so we can send a reply'
                },
                {
                    title: 'Topic',
                    text: 'What is your feedback is about?'
                },
                {
                    title: 'Your words',
                    text: 'Briefly explain your feedback in the provided textbox'
                }
            ]);
    
            /* submit feedback */
        } catch(e) {
            console.error(e);
        }
        
    };

    /* social media */
    const socialMedia = document.querySelectorAll('#socialMedia > div');

    for(const sm of socialMedia) {
        try {
            const url = sm.dataset.url;
            sm.onclick = () => {
                window.location.href = url;
            };
        } catch(e) {
            console.error(e);
        }
    }
})();