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
            
            if (window.scrollY < height - 1139 && deltaDir < 0) {
                showCircles();
            }
        
            if (window.scrollY > height - 1139 && deltaDir > 0) {
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

    const profile = (() =>{

        let isAuth = localStorage.getItem('Authorization') != null;

        let labels = document.getElementById('labels-container').children;
        let inputs = document.getElementById('inputs-container').children;
        let profilePhoto = document.getElementById("choosen-image");
        let userBtn = document.getElementById('user-btn');

        const labelsTexts = [
            ['Username', 'Password'], 
            ['Username', 'Password', 'Repeat'],
            ['First Name', 'Last Name', 'Age', 'Country'],
        ];
        let currentLabels;
        let currentBtn;
        const changeInputView = (newState, oldState) => {
            oldState.classList.remove('active');
            newState.classList.add('active');
            
            userBtn.style.display = 'block';
            userBtn.innerHTML = newState.id == 'login-btn' ? 'login' : 'next';
            currentLabels = newState.id == 'login-btn' ? labelsTexts[0] : labelsTexts[1];
            currentBtn = newState;

            resetInputs();
        }

        const resetInputs = () => {
            for (let i = 0; i < 4; i++) {
                if (currentLabels.length <= i) {
                    labels[i].style.display = 'none';
                    inputs[i].style.display = 'none';
                } else {
                    labels[i].style.display = 'block';
                    inputs[i].style.display = 'block';
                    labels[i].innerHTML = currentLabels[i];
                    inputs[i].value = '';
                    inputs[i].type = 'text';
        
                    if (currentLabels[i] == 'Password' || currentLabels[i] == 'Repeat') {
                        inputs[i].type = 'password'
                    }
                }
            }
        }

        const userAction = (e) => {
            e.preventDefault();
            switch(userBtn.innerHTML){
                case 'login':
                    login();
                    break;
                case 'register':
                    break;
                case 'logout':
                    logout();
                    break;  
                case 'next':
                    currentLabels = labelsTexts[2];
                    userBtn.innerHTML = 'register';
                    resetInputs(); 
                    break;    
            }
            
        }

        const logout = () => {
            localStorage.removeItem('Authorization');
            
            profilePhoto.src = '';
            userBtn.style.display =  'none';
            userBtn.innerHTML = '';

            currentLabels = labelsTexts[2];
            resetInputs();  
        }

        const login = () => {
            let username = inputs[0].value;
            let password = inputs[1].value;
            let user = {
                username,
                password,
            }
            remote.login(user).then(
                res => {
                    console.log(res);
                    currentLabels = labelsTexts[2];
                    resetInputs(currentLabels)

                    userBtn.innerHTML = "logout";
                    inputs[0].value = res['firstname'];
                    inputs[1].value = res['lastname'];
                    inputs[2].value = res['age'];
                    inputs[3].value = res['country'];
                    profilePhoto.src = res['profilePicture'];
        
                    localStorage.setItem('Authorization', res['token']);
                    localStorage.setItem('firstName', res['firstname']);
                    localStorage.setItem('profilePic', res['profilePicture']);
                    localStorage.setItem('lastName', res['lastname']);
                    localStorage.setItem('age', res['age']);
                    localStorage.setItem('country', res['country']);
                    currentBtn.classList.remove("active");
                })
        }
        return{
            changeInputView,
            userAction
        }

    })();

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
        loginBtn.addEventListener('mousedown', () => profile.changeInputView(loginBtn, registerBtn))
        registerBtn.addEventListener('mousedown', () => profile.changeInputView(registerBtn, loginBtn))
        document.getElementById('user-btn').addEventListener('click', profile.userAction)
        
    }

    return {
        start
    }
})();
app.start();

