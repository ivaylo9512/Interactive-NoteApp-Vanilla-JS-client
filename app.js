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

    const setScrollEvents = (() => {

        const decideEvent = () =>{

            if (window.scrollY < 300) {
                showCircles();
            }
        
            if (window.scrollY > 300) {
                hideCircles();
            }
        
            if (window.scrollY <= 446 && treeAnimated == false) {
                treeAnimation();
            }

            if (window.scrollY < 446 && pointerHidden == false) {
                hidePointer();
            }
        }
        let circlesAnimated = false;
        const showCircles = () => {
            const delay = 100;

            for (let i = 0; i < circles.length; i++) {
                setTimeout(() => {
                    
                    const circle = circles[i];            
                    if(i >= 4 && i <= 9){
                        const photo = photos[i - 4];
                        photo.classList.add("animate");
                    }
                    circle.classList.add("animate");

                }, delay * i);
            }
            circlesAnimated = true;

        }
        const hideCircles = () => {
            let delay = 50;

            for (let i = circles.length - 1; i >= 0; i--) {
                setTimeout(() => {
                    
                    const circle = circles[i];            
                    if(i >= 4 && i <= 9){
                        const photo = photos[i - 4];
                        photo.classList.remove("animate");
                        delay = 120;
                    }
                    circle.classList.remove("animate");

                }, delay * i);

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

    const start = () => {
        createCircles()
        
        window.addEventListener('scroll', setScrollEvents.decideEvent);

    }

    return {
        start
    }
})();
app.start();

