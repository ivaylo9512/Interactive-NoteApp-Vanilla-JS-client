const animate = (() => {
    let scrollY = window.pageYOffset;
    const getScrollY = () => scrollY;

    const decideEvent = () => {
        if(!app.isFullMode()){
            return;
        }
        
        const height = document.body.scrollHeight;
        const nextY = window.pageYOffset;
        
        deltaDir = Math.sign(nextY - scrollY);
        scrollY = nextY

        if (scrollY < 800 && !isBalloonPlayed && app.isInitialLoad()) {
            balloonAnimation();
        }

        if (scrollY < height - 1139 && deltaDir < 0 && isHidden) {
            showCircles();
        }
    
        if (scrollY > height - 1139 && deltaDir > 0 && !isHidden) {
            hideCircles();
        }
    
        if (scrollY <= height - 446 && !isTreeAnimated && deltaDir < 0) {
            animateTree();
        }
    }

    const scrollToProfile = () => {
        const height = document.body.scrollHeight;
        const scroll = height - 1400 - scrollY;
        deltaDir = -1;

        smoothScroll(scroll, 1000, scrollY);
        showCircles();
    }

    const scrollToAlbum = () => {
        const height = document.body.scrollHeight;
        const scroll = height - 1100 - scrollY;
        deltaDir = -1;        

        smoothScroll(scroll, 1000, scrollY);
        showCircles();
    }

    const smoothScroll = (y, durration, startPos) => {
        let startTime = null;
        
        document.documentElement.style.overflow = 'hidden'
        setTimeout(() => {
            document.documentElement.style.overflow = 'visible'
        }, durration);

        const scroll = (currentTime) => {
            if(!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;

            const amount = linearTween(timeElapsed, startPos, y, durration);
            window.scrollTo(0, amount);

            if(timeElapsed < durration) requestAnimationFrame(scroll);
        }

        const linearTween = (t, b, c, d) =>  c*t/d + b;

        requestAnimationFrame(scroll);
    }

    const circles = document.getElementsByClassName('circle');
    const photos = document.getElementsByClassName('onLoad-photo');
    let isHidden = true;

    const showCircles = () => {
        isHidden = false;
     
        const delay = 100;
        let current = 0;
        
        showLoop();
        function showLoop() {
            setTimeout(() => {

                if(current == circles.length || isHidden){
                    return;
                }
                
                const circle = circles[current];            
                if(current >= 4 && current <= 9){
                    const photo = photos[current - 4];
                    photo.classList.add('animate');
                }
                circle.classList.add('animate');

                current++;
                showLoop();

            }, delay);
        };
    }

    const hideCircles = () => {
        isHidden = true;
       
        let delay = 50;
        let current = circles.length - 1;

        hideLoop();
        function hideLoop() {
            setTimeout(() => {
                if(current < 0 || !isHidden){
                    return;
                }

                const circle = circles[current];            
                if(current >= 4 && current <= 9){
                    const photo = photos[current - 4];
                    photo.classList.remove('animate');
                    delay = 120;
                }
                circle.classList.remove('animate');
                
                current--;
                hideLoop();
            }, delay);
        }
    }

    let isTreeAnimated;
    const animateTree = () => {
        isTreeAnimated = true;

        document.getElementById('tree').src = 'resources/tree-animation.gif';
        document.getElementById('onload-animation').classList.add('animate');
    }

    let isBalloonPlayed;
    const balloonsContainer = document.getElementById('balloons-container');

    const balloonAnimation = () => {
        isBalloonPlayed = true;

        window.scrollTo(0, 800);
        smoothScroll(100, 3100, 800);
        setTimeout(() => smoothScroll(-900, 3500, scrollY), 3100);

        balloonsContainer.classList.add('animate');
        setTimeout(() => {
            notes.setBalloonAnimated();
        }, 3500);
    }

    const skipAnimations = () => {
        if(!isBalloonPlayed){
            isBalloonPlayed = true;

            balloonsContainer.classList.add('animated');

            notes.setBalloonAnimated();
            animateTree();
            hidePointer();
        }
    }

    const start = () => {
        createCircles();
        window.addEventListener('scroll', decideEvent);
        document.getElementById('profile-btn').addEventListener('click', scrollToProfile);
        document.getElementById('album-btn').addEventListener('click', scrollToAlbum);
    }

    return {
        start,
        smoothScroll,
        skipAnimations,
        getScrollY
    };
})();