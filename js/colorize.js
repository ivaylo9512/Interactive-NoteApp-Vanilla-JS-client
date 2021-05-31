const colorize = (() => {
    let isMatched;

    const colors = new Array('#E2007A', '#8bb1e5', '#E2007A', '#8bb1e5', '#41291B');
    function getRandomColor() {
        const randomNumber = Math.floor(Math.random() * 5);
        const randomColor = colors[randomNumber];

        isMatched = currentColor == randomColor

        return randomColor;
    }

    let maxScore = document.getElementById('max-score');
    let colorizables = [];
    const getElements = () => {
        colorizables = Array.from(document.getElementsByClassName('colorizable'));
        maxScore.textContent = colorizables.length - 1;
    }

    const playBtn = document.getElementById('play-btn'); 
    const playNav = document.getElementById('play-nav');
    let isColorMode;
    const manageListeners = (e) => {
        changeBulbImages()

        isColorMode ? 
            colorizables.forEach(colorizable => {
                colorizable.removeEventListener('mouseover', changeColor);
            }) :
            colorizables.forEach(colorizable => {
                colorizable.addEventListener('mouseover', changeColor);
            });

        isColorMode = !isColorMode;
        playNav.classList.toggle('play');

    }

    let isChanged;
    let onloadAnimation = document.getElementById('onload-animation');
    const changeBulbImages = () => {
        if(!isChanged){
            isChanged = true;
            onloadAnimation.classList.add('play');
        }
    }

    let currentColor;
    const setCurrentColor = (color) => {
        if(currentColor){
            resetNodes();
        }
        currentColor = color;
    }

    const resetNodes = () => {
        colorizables.forEach(colorizable => {
            colorizable.style.color = '';
            colorizable.style.fill = '';
            colorizable.removeAttribute('color');
        })
        amountCounted = 0;
        score.textContent = 0;
    }

    const changeColor = () => {
        const node = event.currentTarget; 
        if (currentColor) {
            const randomColor = getRandomColor();

            node.style.fill = randomColor;
            node.style.color = randomColor;

            calculate(node);
        }
    }

    let amountCounted = 0;
    let score = document.getElementById('score');
    const calculate = (node) => {
        if (node.getAttribute('color') == 'marked' && !isMatched) {
            amountCounted--;
            node.setAttribute('color', 'unmarked');
        } else if (isMatched && (node.getAttribute('color') == 'unmarked' || node.getAttribute('color') === null)) {
            amountCounted++;
            node.setAttribute('color', 'marked');
        }
        score.textContent = amountCounted;
    }

    const start = () => {
        getElements();
        playBtn.addEventListener('click', manageListeners);
        document.getElementById('pink-bulb-btn').addEventListener('click', () => setCurrentColor('#E2007A'));
        document.getElementById('blue-bulb-btn').addEventListener('click', () => setCurrentColor('#8bb1e5'));   
    }

    return {
        start
    };
})();