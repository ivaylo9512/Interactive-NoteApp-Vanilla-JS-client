const colorize = (() => {
    let matched;

    const colors = new Array('#E2007A', '#8bb1e5', '#E2007A', '#8bb1e5', '#41291B');
    function getRandomColor() {
        const randomNumber = Math.floor(Math.random() * 5);
        const randomColor = colors[randomNumber];

        matched = currentColor == randomColor ? true : false 

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
    let colorMode = false;
    const manageListeners = (e) => {
        changeBulbImages()

        if(colorMode){
            colorMode = false;
            colorizables.forEach(colorizable => {
                colorizable.removeEventListener('mouseover', changeColor);
            });

            playNav.classList.remove('play');
        }else{
            colorMode = true;
            colorizables.forEach(colorizable => {
                colorizable.addEventListener('mouseover', changeColor);
            });

            playNav.classList.add('play');
        }
    }

    let changed;
    let onloadAnimation = document.getElementById('onload-animation');
    const changeBulbImages = () => {
        if(!changed){
            onloadAnimation.classList.add('swaped')
        }
    }

    let currentColor = '';
    const setCurrentColor = (color) => {
        if(currentColor != ''){
            resetNodes();
        }

        currentColor = color;
    }

    const resetNodes = () => {

        colorizables.forEach(colorizeable => {
            colorizeable.style.color = '#41291B';
            colorizeable.removeAttribute('color');
        })
        amountCounted = 0;
        score.textContent = 0;

    }
    const changeColor = () => {
        const node = event.target; 
        if (currentColor != '') {

            if(node.tagName === 'IMG' && ((currentColor == '#7398CA' && node.id == 'pink-bulb') || (currentColor == '#E2007A' && node.id == 'blue-bulb'))){
                const randomImage = getRandomImage(node.id);
                node.src = 'resources/' + randomImage;
                calculate(node);
            }else if(node.tagName !== 'IMG'){
                const randomColor = getRandomColor();
                node.style.color = randomColor;
                node.style.borderColor = randomColor;
                calculate(node);
            }


        }
    }

    let amountCounted = 0;
    let score = document.getElementById('score');
    const calculate = (node) => {
        if (node.getAttribute('color') == 'marked' && !matched) {
            amountCounted--;
            node.setAttribute('color', 'unmarked');
        } else if (matched && (node.getAttribute('color') == 'unmarked' || node.getAttribute('color') === null)) {
            amountCounted++;
            node.setAttribute('color', 'marked');
        }
        score.textContent = amountCounted;
    }
    const start = () => {
        getElements();
        playBtn.addEventListener('click', manageListeners);
        document.getElementById('pink-bulb-btn').addEventListener('click', () => setCurrentColor('#E2007A'));
        document.getElementById('blue-bulb-btn').addEventListener('click', () => setCurrentColor('#7398CA'));   
    }

    return {
        start
    };
})();