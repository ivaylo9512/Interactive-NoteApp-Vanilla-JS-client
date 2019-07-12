const app = (() =>{

    const photos = document.getElementsByClassName("onLoad-photo");
    
    const circles = [];
    const createCircles = () => {
        const maxCircles = 25;
        const circleContainer = document.getElementById('circles-container');

        for (let i = 1; i < maxCircles; i++) {
            const circle = document.createElement('span');
            
            circle.className = `colorize circle${i}`;
            circles.push(circle);
              
            circleContainer.appendChild(circle);  
        }
    }

    const setScrollEvents = (() => {

        const decideEvent = () =>{
            if (window.scrollY < 446 && pointerHidden == false) {
                hidePointer();
            }
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

