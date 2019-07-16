const app = (() =>{

    const userPhotosContainer = document.getElementById('user-photos');
    const appendedPhotos = Array.from(userPhotosContainer.children);
    
    let firstAlbum = [];
    let secondAlbum = [];
    let thirdAlbum = [];

    const getAlbumImages = (e) => {
        const id = e.target.id

        remote.getAlbumImages(id)
            .then(function (response) {
                switch(+id){
                    case 1:
                        firstAlbum = response.data;
                        animateAlbumPhotos(firstAlbum);
                        break;
                    case 2:
                        secondAlbum = response.data;
                        animateAlbumPhotos(secondAlbum);
                        break;
                    case 3:
                        thirdAlbum = response.data;
                        animateAlbumPhotos(thirdAlbum);
                        break; 
                }
                albumImages = response.data;
            })
            .catch(function (error) {
            })
    }

    const animateAlbumPhotos = (currentAlbum) => {
        for (let i = 0; i < appendedPhotos.length; i++) {
            appendedPhotos[i].style.display = 'none';

            if(i < currentAlbum.length){
                setTimeout(() => {
                    appendedPhotos[i].style.display = 'block';
                    appendedPhotos[i].style.opacity = 1;
                    appendedPhotos[i].id = currentAlbum[i]['id'];
                    appendedPhotos[i].src = 'http://localhost:8000/' + currentAlbum[i]['location'];
                    appendedPhotos[i].style.width = currentAlbum[i]['width'];
                    appendedPhotos[i].style.transform = 'rotate(' + currentAlbum[i]['rotation'] + 'deg)';
                    appendedPhotos[i].style.left = currentAlbum[i]['left'];
                    appendedPhotos[i].style.top = currentAlbum[i]['top'];

                    let noteId = currentAlbum[i]['noteId'] + 'note';
                    if(currentAlbum[i]['noteId'] != null){
                        appendedPhotos[i].style.display = 'none';
                    }

                    if(appendedPhotos[i].parentElement.className == 'user-note' && appendedPhotos[i].parentElement.id != noteId){
                        appendedPhotosSection.appendChild(appendedPhotos[i]);
                    }

                    if(document.getElementById(noteId)){
                        document.getElementById(noteId).appendChild(appendedPhotos[i]);
                    }
        
                    setTimeout(() => {
                        currentAlbum[i]['left'] = window.getComputedStyle(appendedPhotos[i]).left;
                        currentAlbum[i]['top'] = window.getComputedStyle(appendedPhotos[i]).top;
                    }, 40)

                }, i * 80)
            }
        }
    }

    const fullModeNav = document.getElementById('full-mode-nav');
    const fullModeBtn = document.getElementById('full-mode-btn');
    let fullModeOn = false;
    let fullModeNavOn = false;
    let initialLoad = false;
    const fullModeToggle = () => {
        if(fullModeOn){ 
            initialLoad = false;
            initialAnimation();

            if(!isAnimated){
                animate.hideTopAnimations();
            }
            document.body.classList.remove('full-mode-active');
        }else{
            if(!isAnimated){
                animate.showTopAnimations();
            }
            document.body.classList.add('full-mode-active');
        }
        fullModeOn = !fullModeOn;
    }

    const initialAnimation = () => {
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        },800);
        
        setTimeout(() => {
            document.getElementById('pink-bulb').src = 'resources/pink-bulb.gif';
            document.getElementById('blue-bulb').src = 'resources/blue-bulb.gif';
            initialLoad = true;            
        }, 600);
    }

    const play = document.getElementById('play-box');
    const fullModeNavToggle = () => {
        if(fullModeNavOn){
            fullModeNav.classList.remove('active')
            fullModeBtn.style.marginTop = '0%';
        }else{
            fullModeNav.classList.add('active');
            fullModeBtn.style.marginTop = '9%';
        }
        fullModeNavOn = !fullModeNavOn;
    }

    let isAnimated = false;
    const setIsAnimated = () => {
        isAnimated = true;
    }

    const start = () => {
        initialAnimation();

        animate.createCircles();
        window.addEventListener('scroll', () => !fullModeOn && initialLoad && animate.decideEvent());

        window.addEventListener('wheel', animate.setDelta, {passive: false});

        document.getElementById('profile-btn').addEventListener('mousedown', animate.scrollToProfile);
        document.getElementById('album-btn').addEventListener('mousedown', animate.scrollToAlbum);
        document.getElementById('album-btns').addEventListener('mousedown', getAlbumImages);

        colorize.getElements();
        document.getElementById('play-btn').addEventListener('mousedown', colorize.manageListeners);
        document.getElementById('pink-bulb-btn').addEventListener('mousedown', () => colorize.setCurrentColor('#E2007A'));
        document.getElementById('blue-bulb-btn').addEventListener('mousedown', () => colorize.setCurrentColor('#7398CA'));

        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        loginBtn.addEventListener('mousedown', () => profile.changeInputView(loginBtn, registerBtn));
        registerBtn.addEventListener('mousedown', () => profile.changeInputView(registerBtn, loginBtn));
        document.getElementById('user-btn').addEventListener('click', profile.userAction);

        const noteAnimation = document.getElementById('note-animation');
        const noteHeader = document.getElementById('notes-header');
        noteAnimation.addEventListener('mouseover', animate.noteAnimation);
        noteAnimation.addEventListener('mousedown', animate.noteAppend);
        noteHeader.addEventListener('mouseover', animate.showTopAnimations);
        noteHeader.addEventListener('mouseout', animate.hideTopAnimations);
        noteHeader.addEventListener('mousedown', animate.showNoteView);

        draggables.dragElement(document.getElementById('move-note'));
        draggables.dragElement(document.getElementById('point'));

        fullModeBtn.addEventListener('mousedown', fullModeToggle)
        document.getElementById('menu-circle').addEventListener('mousedown', fullModeNavToggle)
    }

    return {
        start,
        setIsAnimated
    }
})();
app.start();

