const animate = (() => {
    let scrollY;
    const getScrollY = () => scrollY;

    const decideEvent = () => {
        const height = document.body.scrollHeight;
        scrollY = window.pageYOffset;

        if (scrollY < 800) {
            balloonAnimation();
        }

        if (scrollY < height - 1139 && deltaDir < 0 && hiding) {
            showCircles();
        }
    
        if (scrollY > height - 1139 && deltaDir > 0 && !hiding) {
            hideCircles();
        }
    
        if (scrollY <= height - 446 && !treeAnimated && deltaDir < 0) {
            treeAnimation();
        }

        if (scrollY < height - 446 && !pointerHidden && deltaDir < 0) {
            hidePointer();
        }

        if(animationIsPlaying){
            event.preventDefault();
        }
    }

    const scrollToProfile = () => {
        document.getElementById('shrink-seconde').classList.toggle('animate');
    }

    const scrollToAlbum = () => {
        const height = document.body.scrollHeight;
        const scroll = height - 1100 - scrollY;
        deltaDir = -1;        

        smoothScroll(scroll, 1000);
        showCircles();
    }

    const smoothScroll = (y, durration) => {
        const startPos = scrollY;
        let startTime = null;

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

    let deltaDir = 0;
    const setDelta = () => {
        deltaDir = Math.sign(event.deltaY);
        if(animationIsPlaying){
            event.preventDefault();
        }
    }

    const circles = [];
    const circle = document.createElement('span');
    const circlesFragment = document.createDocumentFragment();
    const circleContainer = document.getElementById('circles-container');
    const maxCircles = 25;
    const createCircles = () => {
        for (let i = 1; i < maxCircles; i++) {
            const circleCopy = circle.cloneNode(true);
            circleCopy.className = `colorize circle${i}`;

            circles.push(circleCopy);
            circlesFragment.appendChild(circleCopy);
        }
        circleContainer.appendChild(circlesFragment);  
    }
    
    const photos = document.getElementsByClassName('onLoad-photo');

    let hiding = true;

    const showCircles = () => {
        const delay = 100;
        let current = 0;
        hiding = false;
        
        showLoop();
        function showLoop() {
            setTimeout(() => {

                if(current == circles.length || hiding){
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
        hiding = true;
        let current = circles.length - 1;

        hideLoop();
        function hideLoop() {
            setTimeout(() => {
                if(current < 0 || !hiding){
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

    let treeAnimated = false;
    const treeAnimation = () => {
        document.getElementById('tree').src = 'resources/tree-animation.gif';
        treeAnimated = true;
        setTimeout(() => document.getElementById('onload-nav').classList.add('nav-show'), 2300);
    }

    let pointerHidden = false;
    const hidePointer = () => {
        document.getElementById('pointer').style.display = 'none';
        pointerHidden = true;
    }

    
    let balloonPlayed = false;
    let animationIsPlaying = false;

    const brushAnimation = document.getElementById('brush-animation');
    const balloon = document.getElementById('balloon');
    const balloonLeft = document.getElementById('balloon-left');
    const balloonRight = document.getElementById('balloon-right');

    const balloonAnimation = () => {
        if (!balloonPlayed && app.isInitialLoad()) {
            balloonPlayed = true;
            animationIsPlaying = true;

            window.scrollTo(0, 800);
            smoothScroll(100, 3100);
            setTimeout(() => smoothScroll(-900, 3500), 3100);

            balloon.style.display = 'block';
            setTimeout(() => {
                balloonLeft.style.display = 'block';
                balloonRight.style.display = 'block';
            }, 1250);

            setTimeout(() => {
                balloonLeft.src = 'resources/first-balloon-second-animation.gif';
                noteSectionAnimation();
            }, 3500);
        }
    }
    const noteSection = document.getElementById('note-section');

    const noteSectionAnimation = () => {
        setTimeout(() => {
            animationIsPlaying = false;
            balloonLeft.classList.add('hide');
            noteSection.classList.add('animate');

            setTimeout(() => {
                brushAnimation.style.display = 'block';
                notes.setBrushAnimated();
                balloonLeft.style.display = 'none';
            }, 1100);

        }, 5050);
    }
    
    const skipAnimations = () => {
        if(!balloonPlayed){
            balloonPlayed = true;

            balloon.style.display = 'block';
            balloonRight.style.display = 'block';

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
        window.addEventListener('wheel', setDelta, {passive: false});
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