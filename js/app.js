const app = (() =>{

    const userPhotosContainer = document.getElementById('user-photos');
    const appendedPhotos = Array.from(userPhotosContainer.children);
    
    let firstAlbum = [];
    let secondAlbum = [];
    let thirdAlbum = [];

    let currentAlbumNumber;
    const getAlbumImages = (e) => {
        const id = e.target.id

        remote.getAlbumImages(id)
            .then(function (response) {
                switch(+id){
                    case 1:
                        currentAlbumNumber = 1;
                        firstAlbum = response.data;
                        appendAlbumPhotos(firstAlbum);
                        break;
                    case 2:
                        currentAlbumNumber = 2;
                        secondAlbum = response.data;
                        appendAlbumPhotos(secondAlbum);
                        break;
                    case 3:
                        currentAlbumNumber = 3;
                        thirdAlbum = response.data;
                        appendAlbumPhotos(thirdAlbum);
                        break; 
                }
                albumImages = response.data;
            })
            .catch(function (error) {
            })
    }

    const appendAlbumPhotos = (currentAlbum) => {
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

    const getCurrentAlbumNumber = () => currentAlbumNumber;

    const fullModeNav = document.getElementById('full-mode-nav');
    const fullModeBtn = document.getElementById('full-mode-btn');
    const fullMode = document.getElementById('full-mode');
    const inputNote = document.getElementById('input-note');
    let fullModeOn = false;
    let initialLoad = false;
    const fullModeToggle = () => {
        if(fullModeOn){ 
            initialLoad = false;
            initialAnimation();
            notes.resetNote();
            notes.resetNoteView();

            fullModeBtn.classList.remove('active');
            inputNote.classList.remove('inactive');
            fullModeNav.classList.remove('active');
            document.body.classList.remove('full-mode-active');
        }else{

            inputNote.classList.add('inactive')
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

    const menuCircle = document.getElementById('menu-circle');
    const fullModeNavToggle = () => {
        if(menuCircle.classList.contains('inactive')){
            menuCircle.classList.remove('inactive');
            
            fullMode.style.display = 'block';
            fullModeReset();
        }
        fullModeNav.classList.add('active');
        fullModeBtn.classList.add('active');
    }
    const fullModeReset = () => {
        notes.hideFullScreenNotes();
    }
    const navHoverAnimations = () => {
        if(event.target.tagName == 'LI'){
            switch(event.target.innerHTML){
                case 'Notes':
                    notes.showNote();
                    break;
                case 'Photos':
                    break;
                case 'Play':        
                    break;
            }
        }
    }
    const fullScreenNavEvents = () => {
        if(event.target.tagName == 'LI'){
            menuCircle.classList.add('inactive');
            fullModeNav.classList.remove('active')
            fullModeBtn.classList.remove('active');
            
            switch(event.target.innerHTML){
                case 'Notes':
                    fullMode.style.display = 'none';
                    notes.showFullScreenNotes();
                    break;
                case 'Photos':
                    break;
                case 'Play':        
                    break;
            }
        }
    }

    const start = () => {
        initialAnimation();

        animate.createCircles();
        window.addEventListener('scroll', () => !fullModeOn && initialLoad && animate.decideEvent());

        window.addEventListener('wheel', animate.setDelta, {passive: false});

        document.getElementById('profile-btn').addEventListener('click', animate.scrollToProfile);
        document.getElementById('album-btn').addEventListener('click', animate.scrollToAlbum);
        document.getElementById('album-btns').addEventListener('click', getAlbumImages);

        colorize.getElements();
        document.getElementById('play-btn').addEventListener('click', colorize.manageListeners);
        document.getElementById('pink-bulb-btn').addEventListener('click', () => colorize.setCurrentColor('#E2007A'));
        document.getElementById('blue-bulb-btn').addEventListener('click', () => colorize.setCurrentColor('#7398CA'));

        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        loginBtn.addEventListener('click', () => profile.changeInputView(loginBtn, registerBtn));
        registerBtn.addEventListener('click', () => profile.changeInputView(registerBtn, loginBtn));
        document.getElementById('user-btn').addEventListener('click', profile.userAction);

        const noteAnimation = document.getElementById('note-animation');
        const noteHeader = document.getElementById('notes-header');
        noteAnimation.addEventListener('mouseover', notes.noteAnimation);
        noteAnimation.addEventListener('click', notes.noteAppend);
        noteHeader.addEventListener('mouseover', notes.showTopAnimations);
        noteHeader.addEventListener('mouseout', notes.hideTopAnimations);
        noteHeader.addEventListener('click', notes.showNoteView);

        draggables.dragElement(document.getElementById('move-note'));
        draggables.dragElement(document.getElementById('point'));

        fullModeBtn.addEventListener('click', fullModeToggle);
        menuCircle.addEventListener('click', fullModeNavToggle);

        fullModeNav.addEventListener('mouseover', navHoverAnimations);
        fullModeNav.addEventListener('click', fullScreenNavEvents);

        inputNote.addEventListener('mousedown', notes.activateNote);

    }

    return {
        start,
        getCurrentAlbumNumber
    }
})();
app.start();

