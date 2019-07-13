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

            if (window.scrollY == 0 && deltaDir < 0) {
                showCircles();
            }
        
            if (window.scrollY > 0 && deltaDir > 0) {
                hideCircles();
            }
        
            if (window.scrollY <= 446 && treeAnimated == false && deltaDir < 0) {
                treeAnimation();
            }

            if (window.scrollY < 446 && pointerHidden == false && deltaDir < 0) {
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

    const colorize = (() => {
        const colors = new Array('#E2007A', '#7398CA', '#E2007A', '#7398CA', '#41291B');
        let colorizables = [];

        let matched;
        function getRandomColor() {
            const randomNumber = Math.floor(Math.random() * 5);
            const randomColor = colors[randomNumber];
        
            if (currentColor == randomColor) {
                matched = true;
            } else {
                matched = false;
            }
            return randomColor;
        }
        
        var currentColor = '';
        const getElements = () => {
            colorizables = Array.from(document.getElementsByClassName('colorize'))
        }

        let colorMode = false;
        const manageListeners = () => {

            if(colorMode){
                colorMode = false;
                colorizables.forEach(colorizable => {
                    colorizable.removeEventListener("mouseover", changeColor);
                });
            }else{
                colorMode = true;
                colorizables.forEach(colorizable => {
                    colorizable.addEventListener("mouseover", changeColor);
                });    
            }
        }

        const setCurrentColor = (color) =>{
            currentColor = color;
        }

        const changeColor = () => {
            const node = event.target; 
            if (currentColor != '') {
                if(node.tagName === 'SPAN'){
                    const randomColor = getRandomColor();
                    calculate(node)
                    node.style.color = randomColor;
                }
            }
        }

        let amountCounted = 0;
        let score = document.getElementById('score');
        const calculate = (node) => {
            if (node.getAttribute('value') == 'marked' && matched == false) {
                amountCounted--;
                node.setAttribute('value', 'unmarked');
            } else if (matched == true && (node.getAttribute('value') == "unmarked" || node.getAttribute("value") == null)) {
                amountCounted++;
                node.setAttribute("value", 'marked');
            }
            score.innerHTML = amountCounted;
        }
        
        return {
            manageListeners,
            setCurrentColor,
            getElements
        };
    })();
    const start = () => {
        window.scrollTo(0, window.innerHeight);
        window.onbeforeunload = function () {
            window.scrollTo(0, window.innerHeight);
        }

        createCircles();
        window.addEventListener('scroll', setScrollEvents.decideEvent);
        window.addEventListener("wheel", setDelta);

        document.getElementById('album-btns').addEventListener('mousedown', getAlbumImages);

        colorize.getElements();
        document.getElementById('play').addEventListener('mousedown', colorize.manageListeners);
        document.getElementById('pink-bulb').addEventListener("mousedown", () => colorize.setCurrentColor('#E2007A'))
        document.getElementById("blue-bulb").addEventListener("mousedown", () => colorize.setCurrentColor('#7398CA'))
    }

    return {
        start
    }
})();
app.start();

