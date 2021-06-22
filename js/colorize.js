const colorize = (() => {
    let isMatched;

    const colors = new Array('#E2007A', '#8bb1e5', '#E2007A', '#8bb1e5', '#41291B');
    function getRandomColor() {
        const randomNumber = Math.floor(Math.random() * colors.length);
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

    const playBtn = document.getElementById('second-game-btn'); 
    const playNav = document.getElementById('play-nav');
    const stopBtn = document.getElementById('stop-btn');
    let isColorMode;

    let onloadAnimation = document.getElementById('onload-animation');
    const changeblobImages = () => {
        onloadAnimation.classList.add('play');
        playBtn.removeEventListener('click', changeblobImages);
    }

    let currentColor;
    const setCurrentColor = (color) => {
        if(currentColor){
            resetColors();
        }
        currentColor = color;
    }

    const startGame = (color) => {
        playNav.classList.add('play');
        setCurrentColor(color);
        stopBtn.addEventListener('click', stopGame);
        
        if(!isColorMode) { 
            isColorMode = true;
            colorizables.forEach(colorizable => {
                colorizable.addEventListener('mouseover', changeColor);
            });
        }
    }

    const stopGame = () => {
        playNav.classList.remove('play');
        playNav.classList.remove('color-game');
        stopBtn.removeEventListener('click', stopGame);
        resetColors();

        colorizables.forEach(colorizable => {
            colorizable.addEventListener('mouseover', changeColor);
        });
    }

    const resetColors = () => {
        colorizables.forEach(colorizable => {
            colorizable.style.color = null;
            colorizable.style.fill = null;
            colorizable.dataset.isCounted = '';
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

            setScore(node);
        }
    }

    let amountCounted = 0;
    let score = document.getElementById('score');
    const setScore = (node) => {
        if (node.dataset.isCounted && !isMatched) {
            amountCounted--;
            node.dataset.isCounted = '';
        }else if (isMatched && !node.dataset.isCounted) {
            amountCounted++;
            node.dataset.isCounted = true;
        }
        score.textContent = amountCounted;
    }

    const toggleScore = () => {
        playNav.classList.toggle('color-game');
    }

    const start = () => {
        getElements();
        playBtn.addEventListener('click', toggleScore);
        playBtn.addEventListener('click', changeblobImages);
        document.getElementById('pink-blob-score').addEventListener('click', () => startGame('#E2007A'));
        document.getElementById('blue-blob-score').addEventListener('click', () => startGame('#8bb1e5'));   
    }

    return {
        start
    };
})();