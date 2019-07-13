const app = (() =>{
    const photos = document.getElementsByClassName("onLoad-photo");
    
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

    let deltaDir = 0;
    const setDelta = () => {
        deltaDir = Math.sign(event.deltaY);
    }

    const setScrollEvents = (() => {
        const decideEvent = () => {
            const height = document.body.scrollHeight;
            
            if (window.scrollY < 920 && animated == false) {
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
            brushAnimation.setAttribute('src', 'resources/brush.gif');
            brushAnimation.setAttribute('width', '30%');
            brushAnimation.setAttribute('position', 'absolute');
            brushAnimation.className = 'brush-animation';
            brushAnimation.id = 'brush-animation';

        const cloud = document.getElementById("cloud");
        const cloud1 = document.getElementById("cloud1");
        const cloud2 = document.getElementById("cloud2");
        const balloonsContainer = document.getElementById('balloons-container');
        const balloonLeft = document.createElement("IMG");
        const balloonrRight = document.createElement('IMG');

        const balloonAnimation = () => {
            if (balloonPlayed == false) {
                balloonPlayed = true;
                document.getElementById("balloon").src = "resources-finale/balloon.gif";

                setTimeout(() => {
                    balloonLeft.classList.add('balloon2');
                    balloonLeft.setAttribute('src', 'resources-finale/left-balloon.gif');
                    balloonLeft.id = 'balloon3';
        
                    balloonrRight.classList.add('balloon1');
                    balloonrRight.setAttribute('src', 'resources/right-balloon.gif');
        
                    balloonsContainer.appendChild(balloon);
                    balloonsContainer.appendChild(balloon2);
                }, 1250);
            }
            setTimeout(() => {
                balloon.src = 'resources-finale/balloon-first-second-animation4.gif';
                setTimeout(() => {
                    document.getElementById('note-animation').classList.add('animate');
                    balloon.classList.add('hide');
    
                    cloud.classList.add('hide');
                    setTimeout(() => {
                        cloud2.classList.add('hide');
                    }, 150);
                    setTimeout(() => {
                        cloud1.classList.add('hide');
                    }, 300);
                    setTimeout(() => {
                        document.getElementById('brush-animation-container').appendChild(brushAnimation);
                        balloon.style.display = 'none';
                        loginButtonsContainer.style.opacity = 1;
                    }, 1100);
                    setTimeout(() => {
                        brushAnimated = true;
                    }, 2400);
                }, 5050);
            }, 4550);
        }
        

        return {
            decideEvent
        };
    })();

    let currentAlbum;
    let albumImages = [];
    const getAlbumImages = (e) => {
        const id = e.target.id

        remote.getAlbumImages(id)
            .then(function (response) {
                currentAlbum = id
                albumImages = response.data
            })
            .catch(function (error) {
            })
    }

    const start = () => {
        window.scrollTo(0, document.body.scrollHeight);
        window.onbeforeunload = function () {
            window.scrollTo(0, document.body.scrollHeight);
        }

        createCircles();
        window.addEventListener('scroll', setScrollEvents.decideEvent);
        window.addEventListener("wheel", setDelta);

        document.getElementById('album-btns').addEventListener('mousedown', getAlbumImages);

        colorize.getElements();
        document.getElementById('play').addEventListener('mousedown', colorize.manageListeners);
        document.getElementById('pink-bulb-btn').addEventListener("mousedown", () => colorize.setCurrentColor('#E2007A'));
        document.getElementById("blue-bulb-btn").addEventListener("mousedown", () => colorize.setCurrentColor('#7398CA'));

        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        loginBtn.addEventListener('mousedown', () => profile.changeInputView(loginBtn, registerBtn));
        registerBtn.addEventListener('mousedown', () => profile.changeInputView(registerBtn, loginBtn));
        document.getElementById('user-btn').addEventListener('click', profile.userAction);

        setTimeout(() => {
            document.getElementById("pink-bulb").src = "resources/pink-bulb.gif";
            document.getElementById("blue-bulb").src = "resources/blue-bulb.gif";            
        }, 500);

    }

    return {
        start
    }
})();
app.start();

