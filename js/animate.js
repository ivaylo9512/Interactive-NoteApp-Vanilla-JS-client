const animate = (() => {
    let scrollY = window.pageYOffset;
    const getScrollY = () => scrollY;

    const decideEvent = () => {
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
            treeAnimation();
        }

        if (scrollY < height - 446 && !pointerHidden && deltaDir < 0) {
            hidePointer();
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

    const circles = [];
    const circle = document.createElement('span');
    const circlesFragment = document.createDocumentFragment();
    const circleContainer = document.getElementById('circles-container');
    const maxCircles = 25;
    const createCircles = () => {
        for (let i = 1; i < maxCircles; i++) {
            const circleCopy = circle.cloneNode(true);
            circleCopy.className = 'colorizable circle' + i;

            circles.push(circleCopy);
            circlesFragment.appendChild(circleCopy);
        }
        circleContainer.appendChild(circlesFragment);  
    }
    
    const photos = document.getElementsByClassName('onLoad-photo');

    let isHidden = true;

    const showCircles = () => {
        const delay = 100;
        let current = 0;
        isHidden = false;
        
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
        let delay = 50;
        isHidden = true;
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
        circlesAnimated = true;
    }

    let isTreeAnimated;
    const treeAnimation = () => {
        document.getElementById('tree').src = 'resources/tree-animation.gif';
        isTreeAnimated = true;
        setTimeout(() => document.getElementById('onload-nav').classList.add('nav-show'), 2300);
    }

    let pointerHidden = false;
    const hidePointer = () => {
        document.getElementById('pointer').style.display = 'none';
        pointerHidden = true;
    }

    let isBalloonPlayed;
    const brushAnimation = document.getElementById('brush-animation');
    const balloons = document.getElementById('balloons-container').children;

    const balloonAnimation = () => {
        isBalloonPlayed = true;
        animationIsPlaying = true;

        window.scrollTo(0, 800);
        smoothScroll(100, 3100, 800);
        setTimeout(() => smoothScroll(-900, 3500, scrollY), 3100);

        balloons[1].style.display = 'inline-block';
        setTimeout(() => {
            balloons[0].style.display = 'inline-block';
            balloons[2].style.display = 'inline-block';
        }, 1250);

        setTimeout(() => {
            balloons[0].src = 'resources/first-balloon-second-animation.gif';
            noteSectionAnimation();
        }, 3500);
    }
    const noteSection = document.getElementById('note-section');

    const noteSectionAnimation = () => {
        setTimeout(() => {
            animationIsPlaying = false;
            balloons[0].classList.add('hide');
            noteSection.classList.add('animate');

            setTimeout(() => {
                brushAnimation.style.display = 'block';
                notes.setBrushAnimated();
                balloons[0].style.display = 'none';
            }, 1100);

        }, 5050);
    }
    
    const skipAnimations = () => {
        if(!isBalloonPlayed){
            isBalloonPlayed = true;

            balloons[1].style.display = 'inline-block';
            balloons[2].style.display = 'inline-block';

            brushAnimation.style.display = 'block';
            noteSection.classList.add('animate');
            notes.setBrushAnimated();

            treeAnimation();
            hidePointer();
        }
    }

    const start = () => {
        createCircles();
        window.addEventListener('scroll', () => !app.isFullMode() && decideEvent());
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