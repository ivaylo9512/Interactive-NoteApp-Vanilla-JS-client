const animate = (() => {
    const decideEvent = () => {
        const height = document.body.scrollHeight;
        const scrollY = window.pageYOffset;

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
        const height = document.body.scrollHeight;
        const scroll = height - 1400 - window.pageYOffset;
        deltaDir = -1;
        
        smoothScroll(scroll, 1000);
        showCircles();
    }

    const scrollToAlbum = () => {
        const height = document.body.scrollHeight;
        const scroll = height - 1100 - window.pageYOffset;
        deltaDir = -1;        

        smoothScroll(scroll, 1000);
        showCircles();
    }

    const smoothScroll = (y, durration) => {
        const startPos = window.pageYOffset;
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
    const createCircles = () => {
        const circleContainer = document.getElementById('circles-container');
        const circlesFragment = document.createDocumentFragment();
        const circle = document.createElement('span');
        const maxCircles = 25;
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
    let brushAnimated = false;

    const brushAnimation = document.getElementById('brush-animation');
    const cloud = document.getElementById('cloud');
    const cloud1 = document.getElementById('cloud1');
    const cloud2 = document.getElementById('cloud2');
    const balloonsContainer = document.getElementById('balloons-container');
    const balloon = document.getElementById('balloon');
    const balloonLeft = document.getElementById('balloon-left');
    const balloonRight = document.getElementById('balloon-right');
    const noteHolders = document.getElementById('note-animation');
    const brushAnimationContainer = document.getElementById('right-notes');
    const noteContainer = document.getElementById('note-container');

    const balloonAnimation = () => {
        if (!balloonPlayed) {
            balloonPlayed = true;
            animationIsPlaying = true;

            window.scrollTo(0, 800);
            smoothScroll(100, 3100);
            setTimeout(() => smoothScroll(-900, 3500), 3100);

            balloon.src = 'resources/balloon.gif';
            setTimeout(() => {
                balloonLeft.style.display = 'block';
                balloonRight.style.display = 'block';
            }, 1250);

            setTimeout(() => {
                balloonLeft.src = 'resources/first-balloon-second-animation.gif';
                setTimeout(() => {
                    animationIsPlaying = false;
                    noteHolders.classList.add('show');
                    balloonLeft.classList.add('hide');

                    cloud.classList.add('hide');
                    setTimeout(() => {
                        cloud2.classList.add('hide');
                    }, 150);

                    setTimeout(() => {
                        cloud1.classList.add('hide');
                    }, 300);

                    setTimeout(() => {
                        brushAnimation.style.display = 'block';
                        brushAnimationContainer.appendChild(brushAnimation);
                        brushAnimated = true;
                        balloonLeft.style.display = 'none';
                    }, 1100);

                }, 5050);
            }, 3500);
        }

    }
    
    const noteAnimation = () => {
        if (brushAnimated) {
            noteHolders.src = 'resources/note-animation.gif';
        }
    }

    const noteAppend = () => {
        if (brushAnimated) {
            noteContainer.style.display = 'block';
            noteHolders.src = 'resources/note-animation-static-open.png';
            noteHolders.removeEventListener('mouseover', noteAnimation);
            noteHolders.removeEventListener('click', noteAppend);
        }
    }

    const showTopAnimations = () => {
        if (brushAnimated) {
            noteHolders.classList.remove('show');
            brushAnimation.classList.add('hide');
            noteContainer.classList.add('hide');
        }
    }

    const hideTopAnimations = () => {
        if (brushAnimated) {
            noteHolders.classList.add('show');
            brushAnimation.classList.remove('hide');
            noteContainer.classList.remove('hide');
        }
    }

    const showNoteView = () => {
        if (brushAnimated) {
            noteHolders.classList.remove('show');
            brushAnimation.classList.add('hide');
            noteContainer.classList.add('hide');
            
            const noteHeader = document.getElementById('notes-header');
            noteHeader.removeEventListener('mouseout', hideTopAnimations);
            noteHeader.removeEventListener('mouseout', showTopAnimations);

            app.setIsAnimated();
            setTimeout(() => {

                setTimeout(() => {
                    cloud2.classList.add('show');
                }, 200);

                setTimeout(() => {
                    cloud.classList.add('show');
                }, 400);

                setTimeout(() => {
                    cloud1.classList.add('show');
                }, 600);

                setTimeout(() => {
                    noteContainer.style.display = 'none';
                    noteHolders.style.display = 'none';
                    brushAnimation.style.display = 'none';

                    document.getElementById('timeline-months-container').style.display = 'block';
                    document.getElementById('timeline-years').style.display = 'block';
                }, 1500);

            }, 100);
        }
    }
    return {
        decideEvent,
        setDelta,
        createCircles,
        noteAnimation,
        noteAppend,
        showTopAnimations,
        hideTopAnimations,
        showNoteView,
        scrollToProfile,
        scrollToAlbum
    };
})();