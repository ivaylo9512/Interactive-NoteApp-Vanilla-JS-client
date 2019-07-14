const animate = (() => {
    const decideEvent = () => {
        const height = document.body.scrollHeight;
        
        if (window.scrollY < 920) {
            balloonAnimation();
        }

        if (window.scrollY < height - 1139 && deltaDir < 0) {
            showCircles();
        }
    
        if (window.scrollY > height - 1139 && deltaDir > 0) {
            hideCircles();
        }
    
        if (window.scrollY <= height - 446 && treeAnimated == false && deltaDir < 0) {
            treeAnimation();
        }

        if (window.scrollY < height - 446 && pointerHidden == false && deltaDir < 0) {
            hidePointer();
        }

    }

    let deltaDir = 0;
    const setDelta = () => {
        deltaDir = Math.sign(event.deltaY);
    }

    const circles = [];
    const createCircles = () => {
        const circleContainer = document.getElementById('circles-container');
        const maxCircles = 25;
        for (let i = 1; i < maxCircles; i++) {
            const circle = document.createElement('span');
            
            circle.className = `colorize circle${i}`;
            circles.push(circle);
              
            circleContainer.appendChild(circle);  
        }
    }
    const photos = document.getElementsByClassName("onLoad-photo");

    let hiding = false;

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
                    photo.classList.add("animate");
                }
                circle.classList.add("animate");

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
                    photo.classList.remove("animate");
                    delay = 120;
                }
                circle.classList.remove("animate");
                
                current--;
                hideLoop();
            }, delay);
        }
        circlesAnimated = true;
    }

    var treeAnimated = false;
    const treeAnimation = () => {
        document.getElementById("tree").src = "resources/tree-animation.gif";
        treeAnimated = true;
        setTimeout(
            function showNav() {
                document.getElementById("onload-nav").classList.add("nav-show");
            }, 2300);
    }

    let pointerHidden = false;
    const hidePointer = () => {
        document.getElementById("pointer").style.display = "none";
        pointerHidden = true;
    }

    
    let balloonPlayed = false;
    const brushAnimation = document.createElement("IMG");
        brushAnimation.setAttribute('src', 'resources/brush-reveal.gif');
        brushAnimation.setAttribute('width', '30%');
        brushAnimation.setAttribute('position', 'absolute');
        brushAnimation.className = 'brush-animation';
        brushAnimation.id = 'brush-animation';

    const cloud = document.getElementById('cloud');
    const cloud1 = document.getElementById('cloud1');
    const cloud2 = document.getElementById('cloud2');
    const balloonsContainer = document.getElementById('balloons-container');
    const balloonLeft = document.createElement('IMG');
    const balloonrRight = document.createElement('IMG');

    const balloonAnimation = () => {
        if (balloonPlayed == false) {
            balloonPlayed = true;
            document.getElementById("balloon").src = 'resources/balloon.gif';

            setTimeout(() => {
                balloonLeft.classList.add('balloon2');
                balloonLeft.setAttribute('src', 'resources/left-balloon-first-animation.gif');
                balloonLeft.id = 'balloon3';
    
                balloonrRight.classList.add('balloon1');
                balloonrRight.setAttribute('src', 'resources/right-balloon-second-animation.gif');
    
                balloonsContainer.appendChild(balloonLeft);
                balloonsContainer.appendChild(balloonrRight);
            }, 1250);

            setTimeout(() => {
                balloonLeft.src = 'resources/first-balloon-second-animation.gif';
                setTimeout(() => {
                    document.getElementById('note-animation').classList.add('animate');
                    balloonLeft.classList.add('hide');

                    cloud.classList.add('hide');
                    setTimeout(() => {
                        cloud2.classList.add('hide');
                    }, 150);

                    setTimeout(() => {
                        cloud1.classList.add('hide');
                    }, 300);

                    setTimeout(() => {
                        document.getElementById('brush-animation-container').appendChild(brushAnimation);
                        balloonLeft.style.display = 'none';
                        loginButtonsContainer.style.opacity = 1;
                    }, 1100);

                    setTimeout(() => {
                        brushAnimated = true;
                    }, 2400);

                }, 5050);
            }, 4550);
        }

    }
    

    return {
        decideEvent,
        setDelta,
        createCircles
    };
})();