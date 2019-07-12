const app = (() =>{

    const circles = [];
    const createCircles = () => {
        const maxCircles = 25;
        const circleContainer = document.getElementById('circles-container');

        for (let i = 0; i < maxCircles; i++) {
            const circle = document.createElement('span');
            
            circle.className = `colorize circle${i}`;
            circles.push(circle);
              
            circleContainer.appendChild(circle);  
        }
    } 

    const start = () => {
        createCircles()
    }

    return {
        start
    }
})();
app.start();

