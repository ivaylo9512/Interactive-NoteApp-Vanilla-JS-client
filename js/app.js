const app = (() =>{

    const userPhotosContainer = document.getElementById('user-photos');
    const appendedPhotos = Array.from(userPhotosContainer.children);
    const albums = {
        firstAlbum: undefined,
        secondAlbum: undefined,
        thirdAlbum: undefined
    }

    let currentAlbumNumber;
    let currentAlbumString;
    const getAlbumImages = (e) => {
        const id = e.target.id.split(' ');

        const albumNumber = +id[0];
        const albumString = id[1];

        if(!albums[albumNumber]){
            
            remote.getAlbumImages(albumNumber).then(res => {
                animate.smoothScroll(document.body.offsetHeight - window.pageYOffset - window.innerHeight - 450, 1500);
                albums[albumString] = res.data;

                currentAlbumNumber = albumNumber
                currentAlbumString = albumString
                
                showButtons();
                appendAlbumPhotos(albums[albumString]);
            })
            .catch(e => {
                console.log(e);
            })
        }else{
            currentAlbumNumber = albumNumber
            currentAlbumString = albumString

            showButtons();            
            animate.smoothScroll(document.body.offsetHeight - window.pageYOffset - window.innerHeight - 450, 1500);
            appendAlbumPhotos(albums[albumString])
        }
    }

    const appendAlbumPhotos = (currentAlbum) => {
        for(const [i, photo] of appendedPhotos.entries()) {
            if(fullModeOn){
                return;
            }

            photo.style.display = 'none';
            photo.style.width = null;
            photo.style.transform = null;
            photo.style.top = null;
            photo.style.left = null;
            photo.style.bottom = null;
            photo.style.right = null;

            if(i < currentAlbum.length){
                photo.style.display = 'block';
                photo.id = currentAlbum[i].id;
                photo.src = 'http://localhost:8000/' + currentAlbum[i].location;
                photo.style.width = currentAlbum[i].width + 'px';
                photo.style.transform = `rotate(${currentAlbum[i].rotation}deg)`;
                photo.style.left = currentAlbum[i].leftPosition + 'px';
                photo.style.top = currentAlbum[i].topPosition + 'px';

                let noteId = currentAlbum[i].note + 'note';

                if(currentAlbum[i].note){
                    photo.style.display = 'none';
                }

                if(document.getElementById(noteId)){
                    document.getElementById(noteId).appendChild(photo);
                }

                if(photo.parentElement.className == 'user-note' && photo.parentElement.id != noteId){
                    userPhotosContainer.appendChild(photo);
                }

            }
        }
    }

    const findUserPhoto = (id) => appendedPhotos.find(photo => photo.id == id);

    let moving = false;
    let resizable = false;
    let resizing = false;
    let rotating = false;
    let moveButtonFocused = false;
    
    const moveEditablePhoto = (pos1, pos2) => {
        if (editMode) {
            moving = true;
            resizeButton.style.display = 'none';
            rotateButton.style.display = 'none';
            currentPhoto.top = currentPhoto.top - pos2;
            currentPhoto.left = currentPhoto.left - pos1;
            currentPhoto.node.style.top = currentPhoto.top + 'px';
            currentPhoto.node.style.left = currentPhoto.left + 'px';
            if (currentPhoto.node.parentElement.className == 'user-note') {
                moveButton.style.left = currentPhoto.left + focusedNote.offsetLeft + parseFloat(window.getComputedStyle(moveButton).width) + parseFloat(window.getComputedStyle(notesContainer).marginLeft) - secondSection.offsetLeft + 'px';
                moveButton.style.top = currentPhoto.top + focusedNote.offsetTop - secondSection.offsetTop + noteContainer.offsetTop + noteSection.offsetTop + notesContainer.offsetTop + ((currentPhoto.height - parseFloat(window.getComputedStyle(moveButton).height)) / 2) + 'px';
            } else {
                moveButton.style.left = currentPhoto.left + parseFloat(window.getComputedStyle(moveButton).width) + 'px';
                moveButton.style.top = currentPhoto.top + ((currentPhoto.height - parseFloat(window.getComputedStyle(moveButton).height)) / 2) + 'px';
            }
            if (currentPhoto.node.parentElement.className == 'user-note' && (parseFloat(window.getComputedStyle(focusedNote.parentElement.parentElement).height) - (focusedNote.offsetTop + focusedNote.parentElement.offsetTop + currentPhoto.top) < 0)) {
                currentPhoto.top = currentPhoto.top + focusedNote.offsetTop - secondSection.offsetTop;
                currentPhoto.left = currentPhoto.left + focusedNote.offsetLeft;
                currentPhoto.node.style.top = currentPhoto.top + 'px';
                currentPhoto.node.style.left = currentPhoto.left + 'px';
                currentPhoto.node.style.width = (currentPhoto.width / parseFloat(window.getComputedStyle(secondSection).width)) * 100 + '%';
                currentPhoto.node.style.display = 'block'
                currentPhoto.node.style.opacity = 1;
                rotateButton.src = 'resources/rotate.png'
                userPhotosContainer.appendChild(currentPhoto.node);
            }
        }
    }
    
    const resetMoveButtons = () => {
        rotateButton.style.display = 'block';
        resizeButton.style.display = 'block';
        moving = false;
        moveButtons();
    }

    let currentMousePosition;
    const checkIfResizable = (e) => {
        if (editMode) {
            if (e.offsetX < currentPhoto.width / 7) {
                resizable = true;
                leftResize = true;
            }else if (e.offsetX > currentPhoto.width / 1.2) {
                resizable = true;
                leftResize = false;
            }
            currentMousePosition = e.clientX;
            if(resizable){
                window.addEventListener('mousemove', resize);
                window.addEventListener('mouseup', stopResize)
            }
        }
    }
    const resize = (e) => {
            moveButton.style.display = 'none';
            rotateButton.style.display = 'none';
            resizing = true;

            if (leftResize && currentPhoto.width + (currentMousePosition - e.clientX) > 80) {
                currentPhoto.node.style.width = ((currentPhoto.width + currentMousePosition - e.clientX) / parseFloat(window.getComputedStyle(currentPhoto.node.parentElement).width)) * 100 + '%';
                currentPhoto.node.style.left = currentPhoto.left + (e.clientX - currentMousePosition) + 'px';
            } else if (leftResize == false && currentPhoto.width + (e.clientX - currentMousePosition) > 80) {
                currentPhoto.node.style.width = currentPhoto.width + (e.clientX - currentMousePosition) + 'px';
                currentPhoto.node.style.left = currentPhoto.left + 'px';
            }
            
            if(e.target.parentElement.className == 'user-note'){
                resizeButton.style.width = currentPhoto.node.width + 'px';
                resizeButton.style.left = currentPhoto.node.offsetLeft + focusedNote.offsetLeft + parseFloat(window.getComputedStyle(notesContainer).marginLeft) - secondSection.offsetLeft + 'px';
                resizeButton.style.top = currentPhoto.node.offsetTop + focusedNote.offsetTop - secondSection.offsetTop + noteContainer.offsetTop + noteSection.offsetTop + notesContainer.offsetTop + ((currentPhoto.node.height - parseFloat(window.getComputedStyle(resizeButton).height)) / 2) + 'px';
            }else{
                resizeButton.style.width = currentPhoto.node.width + 'px';
                resizeButton.style.left = currentPhoto.node.offsetLeft + 'px';
                resizeButton.style.top = currentPhoto.node.offsetTop + ((currentPhoto.node.height - parseFloat(window.getComputedStyle(resizeButton).height)) / 2) + 'px';
            }
    }

    function stopResize(e) {
        resizing = false;
        resizable = false;
        currentPhoto.left = currentPhoto.node.offsetLeft;
        currentPhoto.top = currentPhoto.node.offsetTop;
        currentPhoto.width = parseFloat(window.getComputedStyle(currentPhoto.node).width);
        currentPhoto.height = parseFloat(window.getComputedStyle(currentPhoto.node).height);

        moveButton.style.display = 'block';
        rotateButton.style.display = 'block';
        currentPhoto.node.style.zIndex = currentPhoto.zIndex;
        
        moveButtons();

        if (e.target != currentPhoto.node) {
            moveButtonFocused = false;
            moveButton.style.display = 'none';
            resizeButton.style.display = 'none'
        }

        window.removeEventListener('mousemove', resize);
        window.removeEventListener('mouseup', stopResize);
    }

    const hideAppendedPhotos = () => appendedPhotos.forEach(photo => photo.style.display = 'none');
    
    let focusedNote;
    const setfocusedNote = (note) => {
        focusedNote = note;

        if(focusedNote){
            notesContainer = focusedNote.parentElement;
            noteContainer = notesContainer.parentElement;
            noteSection = noteContainer.parentElement;
        }
    }

    let editMode = false;
    const editButton = document.getElementById('speech-bubble-right');
    const saveButton = document.getElementById('speech-bubble-left');
    const editButtonLabel = editButton.children[0];
    
    const changeLabels = () => {
        if (!editMode) {
            editButtonLabel.textContent = 'Cancel';
        } else {
            editButtonLabel.textContent = 'Edit';
            rotateButton.style.display = 'none';
            resizeButton.style.display = 'none';
            moveButton.style.display = 'none';
            resetEdits();
        }
        editMode = !editMode;
    }

    const resetEdits = () => {
        const album = albums[currentAlbumString];
        album.forEach((photo, i) => resetPhoto(photo, i));
    }

    const resetPhoto = (photo, i) => {
        const appendedPhoto = appendedPhotos[i];

        appendedPhoto.style.width = photo.width;
        appendedPhoto.style.left = photo.leftPosition + 'px';
        appendedPhoto.style.top = photo.topPosition + 'px';
        appendedPhoto.style.transform = `rotate(${photo.rotation}deg)`;

        let note = document.getElementById(photo.note + 'note')
        if(note){
            note.appendChild(appendedPhoto);
            appendedPhoto.style.display = 'none';
        }else if(appendedPhoto.parentElement.className == 'user-note' && !photo.note){
            secondSection.appendChild(appendedPhoto);
        }
    }

    const showButtons = () => {
        editButton.classList.add('scale');
        saveButton.classList.add('scale');
    }

    const hideButtons = () => {
        editButton.classList.remove('scale');
        saveButton.classList.remove('scale');
    }

    //https://css-tricks.com/get-value-of-css-rotation-through-javascript/
    const getRotation = (photo) =>  {
        const styles = window.getComputedStyle(photo, null);
        const transform = styles.getPropertyValue('-webkit-transform') ||
            styles.getPropertyValue('-moz-transform') ||
            styles.getPropertyValue('-ms-transform') ||
            styles.getPropertyValue('-o-transform') ||
            styles.getPropertyValue('transform') ||
            'none';

        if (transform == 'none') return 0;

        const values = transform.split('(')[1].split(')')[0].split(',');
        const a = values[0];
        const b = values[1];
    
        const scale = Math.sqrt(a * a + b * b);
        const sin = b / scale;
    
        return Math.atan2(b, a) * (180 / Math.PI);
    
    }

    const userPhotoListeners = (photo) => {
        photo.ondragstart = () => false;

        photo.addEventListener('mousedown', checkIfResizable, true);
        photo.addEventListener('mouseover', () => arrangePhotoButtons(photo));
        photo.addEventListener('mouseout', resetPhotoButtons);

    }

    
    const moveButton = document.getElementById('move-btn');
    const resizeButton = document.getElementById('resize-btn');
    const rotateButton = document.getElementById('rotate-btn');
    const secondSection = document.getElementById('second-section');

    let currentPhoto = {
        node: undefined,
        zIndex: undefined,
        rotation: undefined,
        width: undefined,
        height: undefined,
        left: undefined,
        top: undefined,
    };
    
    let notesContainer;
    let noteContainer;
    let noteSection;
    const arrangePhotoButtons = (photo) => {

        if (!moving && !resizing && editMode && !rotating && !moveButtonFocused) {
            currentPhoto.node = photo;
            currentPhoto.zIndex = window.getComputedStyle(photo).zIndex;
            currentPhoto.rotation = getRotation(currentPhoto.node);
            currentPhoto.width = parseFloat(window.getComputedStyle(photo).width);
            currentPhoto.height = parseFloat(window.getComputedStyle(photo).height);
            currentPhoto.left = photo.offsetLeft;
            currentPhoto.top = photo.offsetTop;
            
            photo.style.zIndex = 4;
            rotateButton.style.pointerEvents = 'none';
            rotateButton.style.display = 'block';
            resizeButton.style.display = 'block';

            moveButtons();

            resizeButton.style.transform = 'rotate(' + currentPhoto.rotation + 'deg)';
            rotateButton.style.transform = 'rotate(' + currentPhoto.rotation + 'deg)';
            moveButton.style.transform = 'rotate(' + currentPhoto.rotation + 'deg)';

        }
    }

    const moveButtons = () => {
        if (currentPhoto.node.parentElement.className == 'user-note') {
            moveButton.style.display = 'block';
            moveButton.style.width = currentPhoto.width / 3 + 'px';
            moveButton.style.left = currentPhoto.left + focusedNote.offsetLeft + parseFloat(window.getComputedStyle(moveButton).width) + parseFloat(window.getComputedStyle(notesContainer).marginLeft) - secondSection.offsetLeft + noteContainer.offsetLeft + 'px';
            moveButton.style.top = currentPhoto.top + focusedNote.offsetTop - secondSection.offsetTop + noteContainer.offsetTop + noteSection.offsetTop + notesContainer.offsetTop + ((currentPhoto.height - parseFloat(window.getComputedStyle(moveButton).height)) / 2) + 'px';

            rotateButton.style.height = currentPhoto.height * 1.75 + 'px';
            rotateButton.style.left = currentPhoto.left + focusedNote.offsetLeft + parseFloat(window.getComputedStyle(notesContainer).marginLeft) - secondSection.offsetLeft + noteContainer.offsetLeft + ((currentPhoto.width - parseFloat(window.getComputedStyle(rotateButton).width)) / 2) + 'px';
            rotateButton.style.top = currentPhoto.top + focusedNote.offsetTop - secondSection.offsetTop + noteContainer.offsetTop + noteSection.offsetTop + notesContainer.offsetTop + ((currentPhoto.height - parseFloat(window.getComputedStyle(rotateButton).height)) / 2) + 'px';
            rotateButton.src = 'resources/rotate-pinned.png';

            resizeButton.style.width = currentPhoto.width + 'px';
            resizeButton.style.left = currentPhoto.left + focusedNote.offsetLeft + parseFloat(window.getComputedStyle(notesContainer).marginLeft) - secondSection.offsetLeft + noteContainer.offsetLeft + 'px';
            resizeButton.style.top = currentPhoto.top + focusedNote.offsetTop - secondSection.offsetTop + noteContainer.offsetTop + noteSection.offsetTop + notesContainer.offsetTop + ((currentPhoto.height - parseFloat(window.getComputedStyle(resizeButton).height)) / 2) + 'px';
        } else {
            moveButton.style.display = 'block';
            moveButton.style.width = currentPhoto.width / 3 + 'px';
            moveButton.style.left = currentPhoto.left + parseFloat(window.getComputedStyle(moveButton).width) + 'px';
            moveButton.style.top = currentPhoto.top + ((currentPhoto.height - parseFloat(window.getComputedStyle(moveButton).height)) / 2) + 'px';
            
            rotateButton.src = 'resources/rotate.png';
            rotateButton.style.height = currentPhoto.height * 1.75 + 'px';
            rotateButton.style.left = currentPhoto.left + ((currentPhoto.width - parseFloat(window.getComputedStyle(rotateButton).width)) / 2) + 'px';
            rotateButton.style.top = currentPhoto.top + ((currentPhoto.height - parseFloat(window.getComputedStyle(rotateButton).height)) / 2) + 'px';

            resizeButton.style.width = currentPhoto.width + 'px';
            resizeButton.style.left = currentPhoto.left + 'px';
            resizeButton.style.top = currentPhoto.top + ((currentPhoto.height - parseFloat(window.getComputedStyle(resizeButton).height)) / 2) + 'px';
        }
    }

    const resetPhotoButtons = () => {
        if (!moving && !resizing && editMode) {
            moveButton.style.display = 'none';
            resizeButton.style.display = 'none';
            currentPhoto.node.style.zIndex = currentPhoto.zIndex;
            moveButtonFocused = false;
            rotateButton.style.pointerEvents = 'all';
        }
    }

    const focusMoveButton = () => {
        moveButton.style.display = 'block';
        resizeButton.style.display = 'block';
        rotateButton.style.pointerEvents = 'none';
        currentPhoto.node.style.zIndex = 4;
        movePhotoButtonFocused = true;
    }
    
    const attachPhoto = (e) => {
        if(e.ctrlKey){
            if (focusedNote && currentPhoto.node.parentElement.className != 'user-note' && currentPhoto.top < -900) {
                currentPhoto.top = currentPhoto.top - focusedNote.offsetTop + secondSection.offsetTop - (noteContainer.offsetTop + noteSection.offsetTop + notesContainer.offsetTop);
                currentPhoto.left = currentPhoto.left - focusedNote.offsetLeft + secondSection.offsetLeft - parseFloat(window.getComputedStyle(notesContainer).marginLeft) - noteContainer.offsetLeft;
                currentPhoto.node.style.top = currentPhoto.top + 'px';
                currentPhoto.node.style.left = currentPhoto.left + 'px';
                currentPhoto.node.style.width = (currentPhoto.width / parseFloat(window.getComputedStyle(focusedNote.children[0]).width)) * 100 + '%';
                focusedNote.children[0].appendChild(currentPhoto.node);
                rotateButton.src = 'resources/rotate-pinned.png'
            }else if(focusedNote && currentPhoto.node.parentElement.className == 'user-note'){
                currentPhoto.node.style.display = 'block';
                rotateButton.src = 'resources/rotate.png'
                currentPhoto.top = currentPhoto.top + focusedNote.offsetTop - secondSection.offsetTop + noteContainer.offsetTop + noteSection.offsetTop + notesContainer.offsetTop;
                currentPhoto.left = currentPhoto.left + focusedNote.offsetLeft + parseFloat(window.getComputedStyle(notesContainer).marginLeft) - secondSection.offsetLeft + noteContainer.offsetLeft;
                currentPhoto.node.style.top = currentPhoto.top + 'px';
                currentPhoto.node.style.left = currentPhoto.left + 'px';
                currentPhoto.node.style.width = (currentPhoto.width / parseFloat(window.getComputedStyle(secondSection).width)) * 100 + '%';
                userPhotosContainer.appendChild(currentPhoto.node);
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
        }else{
            if(currentAlbumNumber){
                hideButtons();
                hideAppendedPhotos();
            }
            inputNote.style.display = 'none';
            fullModeReset();
        }
        document.body.classList.toggle('full-mode-active');
        currentAlbumNumber = null;
        currentAlbumString = null;
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
        if(fullModeNav.classList.contains('active')){
            if(event.target.tagName == 'LI'){
                
                switch(event.target.textContent){
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
    }
    
    const fullScreenNavEvents = () => {
        if(event.target.tagName == 'LI'){
            menuCircle.classList.add('inactive');
            fullModeNav.classList.remove('active')
            fullModeBtn.classList.remove('active');
            
            switch(event.target.textContent){
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
        
        if(photosContainer.children.length == 0){
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
    }

    const placePhotos = Array.from(document.getElementsByClassName('place-photo'));
    const albumNumbersContainer = document.getElementById('album-numbers');
    let number;
    const chooseAlbumNumber = () => {
        
        if(event.target != event.currentTarget && !number){
            number = event.target;
            
            const id = number.id.split('-');
            currentAlbumNumber = id[0];
            currentAlbumString = id[1];

            currentAlbumNumber == 2 ? albumNumbersContainer.classList.add('middle') : albumNumbersContainer.classList.remove('middle');

            albumNumbersContainer.classList.add('active');
            number.classList.add('slide-middle');

            appendPlacePhotos();

        }else {
            clearPlacedPhotos();
            currentAlbumNumber = null;
            currentAlbumString = null;
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

    const photo = document.createElement('img');
    photo.className = 'appended';
    const appendPlacePhotos = async() => {
        
        let album;
        if(!albums[currentAlbumString]){

            await remote.getAlbumImages(currentAlbumNumber).then(res => {
                album = albums[currentAlbumString] = res.data;
            }).catch(e => {
                console.log(e);
            })
        
        }else{
            album = albums[currentAlbumString];
        }

        album.forEach((image, i) => {
            if(number){
                const photoCopy = photo.cloneNode(false);
                
                photoCopy.id = image.id;
                photoCopy.src = remote.getBase() + image.location;
                
                placePhotos[i].appendChild(photoCopy);
                placePhotos[i].className = 'placed-photo';

                draggables.dragElement(photoCopy);
            }
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
        const album = albums[currentAlbumString]

        return remote.updatePhotoAlbum(id, currentAlbumNumber).then(res => {
            album.push(res.data);
            const index = album.length - 1

            placePhotos[placePhotos.indexOf(elementFromPoint)] = placePhotos[index];
            placePhotos[index] = elementFromPoint;
        })
        
    }

    const exchangePhotos = (placedPhoto, currentPhoto, newPhoto) => {
        const index = placePhotos.indexOf(placedPhoto);
        const album = albums[currentAlbumString];

        return remote.exchangePhotos(currentPhoto, newPhoto).then(res => {
            const image = res.data;
            album[index] = image
            
            const photos = placePhotos.filter(placePhoto => {
                if(placePhoto.children[0]) {
                    if(placePhoto.children[0].id == currentPhoto) return placePhoto 
                }
            })
            if(photos.length > 0){
                photos[0].firstChild.src = image.src;
                photos[0].firstChild.id = image.location;
                photos[0].className = 'place-photo';
            }

        })
    }

    const clearPhoto = (photo, node) => {
        let photoContainer = document.createElement('DIV');
        photoContainer.appendChild(photo);
        
        photoContainer.className = 'drag-photo-container';
        photo.className = 'drag-photo disabled';
        node.className = 'place-photo disabled';

        photosContainer.appendChild(photoContainer);

        let album = albums[currentAlbumString];
        remote.updatePhotoAlbum(photo.id, 0).then(res => {
            let index = placePhotos.indexOf(node);
            
            placePhotos[index] = placePhotos[album.length - 1];
            placePhotos[album.length - 1] = node;                            

            const lastElement = album.pop();
            if(index != album.length) album[index] = lastElement;


            const photos = placePhotos.filter(placePhoto => {
                if(placePhoto.children[0]) {
                    if(placePhoto.children[0].id == photo.id) return placePhoto 
                }
            })
            if(photos.length > 0){
                photos[0].removeChild(photos[0].firstChild);
                photos[0].className = 'place-photo';
            }

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

    const savePhotos = () => {
        const album = albums[currentAlbumString];
        album.forEach((photo, i) => {
            photo.width = appendedPhotos[i].style.width;
            photo.leftPosition = appendedPhotos[i].style.left;
            photo.topPosition = appendedPhotos[i].style.top;

            const photoDisplay = appendedPhotos[i].style.display;
            appendedPhotos[i].style.display = 'block';
            photo.rotation = getRotation(appendedPhotos[i]);
            appendedPhotos[i].style.display = photoDisplay;
            
            if(appendedPhotos[i].style.display != 'none'){
                photo.note = null;
            }
            if(appendedPhotos[i].parentElement.className == 'user-note'){
                const noteId = appendedPhotos[i].parentElement.id;
                photo.note = noteId.substring(0, noteId.length - 4);
            }
            if(!photo.note && appendedPhotos[i].offsetTop < -1710){
                photo.topPosition = '-1710px';
                appendedPhotos[i].style.top = '-1710px';
            }
        })

        console.log(album)
        remote.updateAlbumPhotos(album).then(
            res => {
                editButtonLabel.textContent = 'Edit';
                rotateButton.style.display = 'none';
                editMode = false;
            }
        );
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
        draggables.dragElement(moveButton);

        fullModeBtn.addEventListener('click', fullModeToggle);
        menuCircle.addEventListener('click', fullModeNavToggle);

        fullModeNav.addEventListener('mouseover', navHoverAnimations);
        fullModeNav.addEventListener('click', fullScreenNavEvents);

        inputNote.addEventListener('mousedown', notes.activateNote);
        document.getElementById('submit-note').addEventListener('click', notes.submitNote);

        albumNumbersContainer.addEventListener('click', chooseAlbumNumber);

        document.getElementById('input-photo').addEventListener('input', appendPhoto);
        document.getElementById('profile-photo').addEventListener('input', profile.addProfilePhoto);

        saveButton.addEventListener('mouseover', () => editButton.classList.add('rotate'));
        saveButton.addEventListener('mouseout', () => editButton.classList.remove('rotate'));
        saveButton.addEventListener('click', savePhotos);
        editButton.addEventListener('click', changeLabels); 
        
        moveButton.addEventListener('mouseover', focusMoveButton);
        moveButton.addEventListener('click', attachPhoto);

        appendedPhotos.forEach(photo =>{
            userPhotoListeners(photo);
        })
    }

    return {
        start,
        getCurrentAlbumNumber,
        updateChosenPhoto,
        exchangePhotos,
        clearPhoto,
        moveEditablePhoto,
        resetMoveButtons,
        setfocusedNote,
        findUserPhoto
    }
})();
app.start();

