const animate = (() => {
    let scrollY = window.pageYOffset;
    const getScrollY = () => scrollY;

    const decideEvent = () => {
        if(app.getIsFullMode() || !app.getIsLoaded()){
            return;
        }

        const height = document.body.scrollHeight;
        const nextY = window.pageYOffset;
        
        deltaDir = Math.sign(nextY - scrollY);
        scrollY = nextY

        if (scrollY < 800 && !isBalloonPlayed) {
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

    const circles = Array.from(document.getElementsByClassName('circles-container'))
        .flatMap(n => Array.from(n.children));
    const photos = document.getElementById('onload-photos').children;
    let isHidden = true;

    const showCircles = () => {
        isHidden = false;
        let current = 0;
     
        const interval = setInterval(() => {
            if(current == circles.length - 1 || isHidden){
                clearInterval(interval);
            }

            const circle = circles[current];            
            if(current >= 4 && current <= 9){
                const photo = photos[current - 4];
                photo.classList.add('animate');
            }
            circle.classList.add('animate');

            current++;
        }, 100);
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
        document.getElementById('play-mode').classList.add('tree-animation');
    }

    let isBalloonPlayed;
    let isBalloonAnimated
    const getIsBalloonAnimated = () => isBalloonAnimated;
    const balloonsContainer = document.getElementById('balloons-container');

    const balloonAnimation = () => {
        isBalloonPlayed = true;

        window.scrollTo(0, 800);
        smoothScroll(100, 3100, 800);
        setTimeout(() => smoothScroll(-900, 3500, scrollY), 3100);

        balloonsContainer.classList.add('animate');
        setTimeout(() => {
            isBalloonAnimated = true
        }, 3500);
    }

    const skipAnimations = () => {
        if(!isBalloonPlayed){
            isBalloonPlayed = true;
            isBalloonAnimated = true;
            balloonsContainer.classList.add('animated');
            animateTree();
        }
    }

    const initialize = () => {
        window.addEventListener('scroll', decideEvent);
        document.getElementById('profile-btn').addEventListener('click', scrollToProfile);
        document.getElementById('album-btn').addEventListener('click', scrollToAlbum);
    }

    return {
        initialize,
        smoothScroll,
        skipAnimations,
        getIsBalloonAnimated,
        getScrollY
    };
})();