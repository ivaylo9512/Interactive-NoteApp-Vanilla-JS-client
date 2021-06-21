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

    const playBtn = document.getElementById('play-btn'); 
    const playNav = document.getElementById('play-nav');
    let isColorMode;
    const manageListeners = (e) => {
        if(isColorMode) { 
            resetColors();
            colorizables.forEach(colorizable => {
                colorizable.removeEventListener('mouseover', changeColor);
            })
        }else{
            colorizables.forEach(colorizable => {
                colorizable.addEventListener('mouseover', changeColor);
            });
        }

        isColorMode = !isColorMode;
        playNav.classList.toggle('play');
    }

    let onloadAnimation = document.getElementById('onload-animation');
    const changeblobImages = () => {
        onloadAnimation.classList.add('play');
    }

    let currentColor;
    const setCurrentColor = (color) => {
        if(currentColor){
            resetColors();
        }
        currentColor = color;
    }

    const resetColors = () => {
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
        playNav.classList.toggle("color-game");
    }

    const start = () => {
        getElements();
        playBtn.addEventListener('click', manageListeners);
        playBtn.addEventListener('click', changeblobImages, {once: true});
        document.getElementById('second-game-btn').addEventListener("click", toggleScore);
        document.getElementById('pink-blob-score').addEventListener('click', () => setCurrentColor('#E2007A'));
        document.getElementById('blue-blob-score').addEventListener('click', () => setCurrentColor('#8bb1e5'));   
    }

    return {
        start
    };
})();