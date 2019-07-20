const app = (() =>{

    const userPhotosContainer = document.getElementById('user-photos');
    const appendedPhotos = Array.from(userPhotosContainer.children);
    
    let firstAlbum = [];
    let secondAlbum = [];
    let thirdAlbum = [];

    let currentAlbumNumber;
    const getAlbumImages = (e) => {
        const id = e.target.id

        remote.getAlbumImages(id).then(res => {
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
        .catch(e => {
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
    const photoSection = document.getElementById('photo-section-full-mode')
    const photosContainer = document.getElementById('photos-container-full-mode');
  
    let fullModeOn = false;
    let initialLoad = false;
    const fullModeToggle = () => {
        if(fullModeOn){ 
            initialLoad = false;
            initialAnimation();
            notes.resetNote();
            notes.resetNoteView();

            clearPlacedPhotos();

            fullModeBtn.classList.remove('active');
            inputNote.classList.remove('inactive');
            fullMode.style.display = 'none';
            document.body.classList.remove('full-mode-active');
        }else{
            inputNote.style.display = 'none';
            document.body.classList.add('full-mode-active');
            fullModeReset();
        }
        currentAlbumNumber = null;
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

        if(menuCircle.classList.contains('inactive')) fullModeReset();
        
        fullModeNav.classList.add('active');
        fullModeBtn.classList.add('active');
   
    }

    const fullModeReset = () => {
        menuCircle.classList.remove('inactive');
        fullMode.style.display = 'block';
        photoSection.style.display = 'none';
        inputNote.classList.add('inactive')
        notes.hideFullScreenNotes();
        fullModeNav.classList.remove('active');
    }

    const navHoverAnimations = () => {
        if(event.target.tagName == 'LI'){
            switch(event.target.innerHTML){
                case 'Notes':
                    notes.showNote();
                    break;
                case 'Photos':
                    notes.hideNote();
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
                    showPhotoSection();
                    break;
                case 'Play':        
                    break;
            }
        }
    }

    const photoContainer = (() => { 
        const container = document.createElement('div');
        container.className = 'drag-photo-container';

        const photo = document.createElement('img');
        photo.className = 'drag-photo';
        
        container.appendChild(photo);
        return container;
    })();

    const photosFragment = document.createDocumentFragment();
    const showPhotoSection = () => {
        photoSection.style.display = 'block';
        
        remote.getAlbumImages(0).then(
            res => {
                const images = res.data;

                images.forEach((image) => {
                    const containerCopy = photoContainer.cloneNode(true);
                    const photoCopy = containerCopy.children[0];

                    photoCopy.id = image.id;
                    photoCopy.src = remote.getBase() + image.location;

                    draggables.dragElement(photoCopy);                    
                    photosFragment.insertBefore(containerCopy, photosFragment.firstChild);
                });
                photosContainer.insertBefore(photosFragment, photosContainer.firstChild);

            }
        )
    }

    const placePhotos = Array.from(document.getElementsByClassName('place-photo'));
    const albumNumbersContainer = document.getElementById('album-numbers');
    const albumNumbers = Array.from(albumNumbersContainer.children);
    let number;
    const chooseAlbumNumber = () => {
        
        if(event.target != event.currentTarget && !number){
            number = event.target;
            const index = albumNumbers.indexOf(number) + 1; 
            index == 2 ? albumNumbersContainer.classList.add('middle') : albumNumbersContainer.classList.remove('middle');

            albumNumbersContainer.classList.add('active');
            number.classList.add('slide-middle');

            appendPlacePhotos(index);

        }else {
            clearPlacedPhotos();
            currentAlbumNumber = null;
        }
    }

    const clearPlacedPhotos = () => {
        if(number){
            placePhotos.forEach(photo => {
                if (photo.firstChild) {
                    photo.className = 'place-photo';
                    photo.removeChild(photo.firstChild);
                }
            })

            albumNumbersContainer.classList.remove('active');
            number.classList.remove('slide-middle');
            number = null;
        }
    }

    const appendPlacePhotos = (index) => {
        remote.getAlbumImages(index).then(res => {
            const images = res.data;
            
            switch(index){
                case 1:
                    currentAlbumNumber = 1;
                    firstAlbum = images;
                    break;
                case 2:
                    currentAlbumNumber = 2;
                    secondAlbum = images;
                    break;
                case 3:
                    currentAlbumNumber = 3;
                    thirdAlbum = images;
                    break;    
            }
            let photo = document.createElement('img');
            photo.className = 'appended';

            images.forEach((image, i) => {
                const photoCopy = photo.cloneNode(false);
                
                const base = remote.getBase

                photoCopy.id = image.id;
                photoCopy.src = base() + image.location;
                
                placePhotos[i].appendChild(photoCopy);
                placePhotos[i].className = 'placed-photo';

                draggables.dragElement(photoCopy);
            })
        })
    }

    const appendPhoto = () => {
        const input = event.target;
    
        if (input.files && input.files[0]) {
            const image = input.files[0];
            
            const imageData = new FormData();
            imageData.append('photo', image);

            remote.submitImage(imageData).then(res => {
                const image = res.data;
                
                const containerCopy = photoContainer.cloneNode(true);
                const photoCopy = containerCopy.children[0];

                photoCopy.id = image.id;
                photoCopy.src = remote.getBase() + image.location;
                
                draggables.dragElement(photoCopy);
                photosContainer.insertBefore(containerCopy, photosContainer.firstChild);
            })
        }
    }

    const updateChosenPhoto = (id, elementFromPoint) => { 
        return remote.updatePhotoAlbum(id, currentAlbumNumber).then(res => {
            let index;
            switch (currentAlbumNumber) {
                case 1:
                    index = firstAlbum.length;
                    firstAlbum.push(res);
                    break;
                case 2:
                    index = secondAlbum.length;
                    secondAlbum.push(res);
                    break;
                case 3:
                    index = thirdAlbum.length;
                    thirdAlbum.push(res);
                    break
            }
            placePhotos[placePhotos.indexOf(elementFromPoint)] = placePhotos[index];
            placePhotos[index] = elementFromPoint;
        })
    }

    const exchangePhotos = (placedPhoto, currentPhoto, newPhoto) => {
        const index = placePhotos.indexOf(placedPhoto);

        return remote.exchangePhotos(currentPhoto, newPhoto).then(res => {
            const image = res.data;
            switch (currentAlbumNumber) {
                case 1:
                    firstAlbum[index] = image;
                    break;
                case 2:
                    secondAlbum[index] = image;
                    break;
                case 3:
                    thirdAlbum[index] = image;
                    break;
            }
        }
        )
    }

    const clearPhoto = (photo, node) => {
        let photoContainer = document.createElement('DIV');
        photoContainer.appendChild(photo);
        
        photoContainer.className = 'drag-photo-container';
        photo.className = 'drag-photo disabled';
        node.className = 'place-photo disabled';

        photosContainer.appendChild(photoContainer);

        remote.updatePhotoAlbum(photo.id, 0).then(res => {
            let album;
            let index = placePhotos.indexOf(node);
            
            switch (currentAlbumNumber) {
                case 1:
                    album = firstAlbum;
                    break;
                case 2:
                    album = secondAlbum;
                    break;
                case 3:
                    album = thirdAlbum;
                    break;
            }
            
            const lastElement = album.pop();
            placePhotos[index] = placePhotos[album.length - 1];
            placePhotos[thirdAlbum.length - 1] = node;                            
            album[index] = lastElement;
        })
        .catch(e =>{
            photosContainer.removeChild(photoContainer);
            node.appendChild(photo);

            photoContainer.className = 'drag-photo-container';
            node.className = 'placed-photo';
            photo.className = 'appended';
            console.log(e);
        })
        .finally(() =>{
            node.classList.remove('disabled');
            photo.classList.remove('disabled');

        })
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
        document.getElementById('submit-note').addEventListener('click', notes.submitNote);

        albumNumbersContainer.addEventListener('click', chooseAlbumNumber);

        document.getElementById('input-photo').addEventListener('input', appendPhoto);

    }

    return {
        start,
        getCurrentAlbumNumber,
        updateChosenPhoto,
        exchangePhotos,
        clearPhoto
    }
})();
app.start();

