const colorize = (() => {
    let matched;

    const colors = new Array('#E2007A', '#7398CA', '#E2007A', '#7398CA', '#41291B');
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

    const leftBulbImages = ['left-bulb-pink.png', 'left-bulb-brown.png', 'left-bulb-blue.png'];
    const rightBulbImages = ['right-bulb-pink.png', 'right-bulb-brown.png', 'right-bulb-blue.png'];
    const getRandomImage = id => {
        const randomIndex = Math.floor(Math.random() * leftBulbImages.length);
        const randomImage = id == 'pink-bulb' ? rightBulbImages[randomIndex] : leftBulbImages[randomIndex];
        
        if(currentColor == '#7398CA'){
            matched = randomImage == 'right-bulb-blue.png';
        }else{
            matched = randomImage == 'left-bulb-pink.png';
        } 

        return randomImage;
    }

    let maxScore = document.getElementById('max-score');
    let colorizables = [];
    const getElements = () => {
        colorizables = Array.from(document.getElementsByClassName('colorize'));
        maxScore.textContent = colorizables.length - 1;
    }

    const playBtn = document.getElementById('play-btn'); 
    const playNav = document.getElementById('play-nav');
    let colorMode = false;
    const manageListeners = (e) => {
        if(colorMode){
            colorMode = false;
            colorizables.forEach(colorizable => {
                colorizable.removeEventListener('mouseover', changeColor);
            });

            playNav.classList.remove('active');
        }else{
            colorMode = true;
            colorizables.forEach(colorizable => {
                colorizable.addEventListener('mouseover', changeColor);
            });

            playNav.classList.add('active');
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