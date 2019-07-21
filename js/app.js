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
            showButtons();
            switch(+id){
                case 1:
                    currentAlbumNumber = 1;
                    appendAlbumPhotos(firstAlbum = res.data);
                    break;
                case 2:
                    currentAlbumNumber = 2;
                    appendAlbumPhotos(secondAlbum = res.data);
                    break;
                case 3:
                    currentAlbumNumber = 3;
                    appendAlbumPhotos(thirdAlbum = res.data);
                    break; 
            }
        })
        .catch(e => {
        })
    }

    const appendAlbumPhotos = (currentAlbum) => {
        appendedPhotos.forEach((photo, i) =>{
            photo.style.display = 'none';
            if(i < currentAlbum.length){
                photo.style.display = 'block';
                photo.style.opacity = 1;
                photo.id = currentAlbum[i].id;
                photo.src = 'http://localhost:8000/' + currentAlbum[i].location;
                photo.style.width = currentAlbum[i].width;
                photo.style.transform = `rotate(${currentAlbum[i].rotation}deg)`;
                photo.style.right = currentAlbum[i].rightPosition;
                photo.style.bottom = currentAlbum[i].bottomPosition;

                let noteId = currentAlbum[i]['noteId'] + 'note';
                if(currentAlbum[i]['noteId'] != null){
                    photo.style.display = 'none';
                }

                if(photo.parentElement.className == 'user-note' && photo.parentElement.id != noteId){
                    appendedPhotosSection.appendChild(photo);
                }
                if(document.getElementById(noteId)){
                    document.getElementById(noteId).appendChild(photo);
                }

            }
        })
    }

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
                moveButton.style.left = currentPhoto.left + focusedNoteContainer.offsetLeft + parseFloat(window.getComputedStyle(moveButton).width) + 'px';
                moveButton.style.top = currentPhoto.top + focusedNoteContainer.offsetTop - secondSection.offsetTop + ((currentPhoto.height - parseFloat(window.getComputedStyle(moveButton).height)) / 2) + 'px';
            } else {
                moveButton.style.left = currentPhoto.left + parseFloat(window.getComputedStyle(moveButton).width) + 'px';
                moveButton.style.top = currentPhoto.top + ((currentPhoto.height - parseFloat(window.getComputedStyle(moveButton).height)) / 2) + 'px';
            }
            if (currentPhoto.node.parentElement.className == 'user-note' && (parseFloat(window.getComputedStyle(focusedNoteContainer.parentElement.parentElement).height) - (focusedNoteContainer.offsetTop + focusedNoteContainer.parentElement.offsetTop + currentPhoto.top) < 0)) {
                currentPhoto.top = currentPhoto.top + focusedNoteContainer.offsetTop - secondSection.offsetTop;
                currentPhoto.left = currentPhoto.left + focusedNoteContainer.offsetLeft;
                currentPhoto.node.style.top = currentPhoto.top + 'px';
                currentPhoto.node.style.left = currentPhoto.left + 'px';
                currentPhoto.node.style.width = (currentPhoto.width / parseFloat(window.getComputedStyle(secondSection).width)) * 100 + '%';
                currentPhoto.node.style.display = 'block'
                currentPhoto.node.style.opacity = 1;
                rotateButton.src = 'resources/rotate.png'
                appendedPhotosSection.appendChild(currentPhoto.node);
            }
        }
    }
    
    const resetMoveButtons = () => {
        rotateButton.style.display = 'block';
        resizeButton.style.display = 'block';
        moving = false;
        if (currentPhoto.node.parentElement.className == 'user-note') {
            rotateButton.style.height = currentPhoto.height * 1.75 + 'px';
            rotateButton.style.left = currentPhoto.left + focusedNoteContainer.offsetLeft + ((currentPhoto.width - parseFloat(window.getComputedStyle(rotateButton).width)) / 2) + 'px';
            rotateButton.style.top = currentPhoto.top + focusedNoteContainer.offsetTop - secondSection.offsetTop + ((currentPhoto.height - parseFloat(window.getComputedStyle(rotateButton).height)) / 2) + 'px';

            resizeButton.style.width = currentPhoto.width + 'px';
            resizeButton.style.left = currentPhoto.left + focusedNoteContainer.offsetLeft + 'px';
            resizeButton.style.top = currentPhoto.top + focusedNoteContainer.offsetTop - secondSection.offsetTop + ((currentPhoto.height - parseFloat(window.getComputedStyle(resizeButton).height)) / 2) + 'px';
        } else {
            rotateButton.style.height = parseFloat(currentPhoto.height) * 1.75 + 'px';
            rotateButton.style.left = currentPhoto.node.offsetLeft + ((currentPhoto.width - parseFloat(window.getComputedStyle(rotateButton).width)) / 2) + 'px';
            rotateButton.style.top = currentPhoto.node.offsetTop + ((currentPhoto.height - parseFloat(window.getComputedStyle(rotateButton).height)) / 2) + 'px';
            resizeButton.style.left = currentPhoto.node.offsetLeft + 'px';
            resizeButton.style.top = currentPhoto.node.offsetTop + ((currentPhoto.height - parseFloat(window.getComputedStyle(resizeButton).height)) / 2) + 'px';
        }
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
                document.addEventListener('mousemove', resize);
                document.addEventListener('mouseup', stopResize)
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
            resizeButton.style.width = currentPhoto.node.width + 'px';
            resizeButton.style.left = currentPhoto.node.offsetLeft + 'px';
            resizeButton.style.top = currentPhoto.node.offsetTop + ((currentPhoto.node.height - parseFloat(window.getComputedStyle(resizeButton).height)) / 2) + 'px';
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
        
        if (currentPhoto.node.parentElement.className == 'user-note') {
            moveButton.style.display = 'block';
            moveButton.style.width = currentPhoto.width / 3 + 'px';
            moveButton.style.left = (currentPhoto.left + focusedNoteContainer.offsetLeft + parseFloat(window.getComputedStyle(moveButton).width)) + 'px';
            moveButton.style.top = (currentPhoto.top + focusedNoteContainer.offsetTop - secondSection.offsetTop) + ((currentPhoto.height - parseFloat(window.getComputedStyle(moveButton).height)) / 2) + 'px';

            rotateButton.style.height = currentPhoto.height * 1.75 + 'px';
            rotateButton.style.left = currentPhoto.left + focusedNoteContainer.offsetLeft + ((currentPhoto.width - parseFloat(window.getComputedStyle(rotateButton).width)) / 2) + 'px';
            rotateButton.style.top = (currentPhoto.top + focusedNoteContainer.offsetTop - secondSection.offsetTop) + ((currentPhoto.height - parseFloat(window.getComputedStyle(rotateButton).height)) / 2) + 'px';

            resizeButton.style.width = currentPhoto.width + 'px';
            resizeButton.style.left = currentPhoto.left + focusedNoteContainer.offsetLeft + 'px';
            resizeButton.style.top = (currentPhoto.top + focusedNoteContainer.offsetTop - secondSection.offsetTop) + ((currentPhoto.height - parseFloat(window.getComputedStyle(resizeButton).height)) / 2) + 'px';
        } else {
            moveButton.style.width = currentPhoto.width / 3 + 'px';
            moveButton.style.left = currentPhoto.left + parseFloat(window.getComputedStyle(moveButton).width) + 'px';
            moveButton.style.top = currentPhoto.top + ((currentPhoto.height - parseFloat(window.getComputedStyle(moveButton).height)) / 2) + 'px';
            rotateButton.style.height = currentPhoto.height * 1.75 + 'px';
            rotateButton.style.left = currentPhoto.left + ((currentPhoto.width - parseFloat(window.getComputedStyle(rotateButton).width)) / 2) + 'px';
            rotateButton.style.top = currentPhoto.top + ((currentPhoto.height - parseFloat(window.getComputedStyle(rotateButton).height)) / 2) + 'px';
        }

        if (e.target != currentPhoto.node) {
            moveButtonFocused = false;
            moveButton.style.display = 'none';
            resizeButton.style.display = 'none'
        }

        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }

    const hideAppendedPhotos = () => appendedPhotos.forEach(photo => photo.style.display = 'none');
    

    let editMode = false;
    const editButton = document.getElementById('speech-bubble-right');
    const saveButton = document.getElementById('speech-bubble-left');
    const editButtonLabel = editButton.children[0];
    
    const changeLabels = () => {
        if (!editMode) {
            editButtonLabel.innerHTML = 'Cancel';
        } else {
            editButtonLabel.innerHTML = 'Edit';
            rotateButton.style.display = 'none';
            resizeButton.style.display = 'none';
            moveButton.style.display = 'none';
            resetEdits();
        }
        editMode = !editMode;
    }

    const resetEdits = () => {
        let album;
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
        album.forEach((photo, i) => resetPhoto(photo, i));
    }

    const resetPhoto = (photo, i) => {
        appendedPhotos[i].style.width = photo.width;
        appendedPhotos[i].style.right = photo.right;
        appendedPhotos[i].style.bottom = photo.bottom;
        appendedPhotos[i].style.transform = `rotate(${photo.rotation}deg)`;

        let note = document.getElementById(photo.noteId + 'note')
        if(note){
            note.appendChild(appendedPhotos[i]);
        }else if(appendedPhotos[i].parentElement.className == 'user-note' && photo['noteId'] == null){
            secondSection.appendChild(appendedPhotos[i]);
        }
    }

    const showButtons = () => {
        editButton.classList.add('scale');
        saveButton.classList.add('scale');
    }

    //https://css-tricks.com/get-value-of-css-rotation-through-javascript/
    const getRotation = () =>  {
        const styles = window.getComputedStyle(currentPhoto.node, null);
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

        photo.addEventListener('mousedown', checkIfResizable);
        photo.addEventListener('mouseover', () => arrangePhotoButtons(photo));
        photo.addEventListener('mouseout', resetPhotoButtons);

    }

    
    const moveButton = document.getElementById('move-btn');
    const resizeButton = document.getElementById('resize-btn');
    const rotateButton = document.getElementById('rotate-btn');
    const secondSection = document.getElementById('second-section-btn');

    let currentPhoto = {
        node: undefined,
        zIndex: undefined,
        rotation: undefined,
        width: undefined,
        height: undefined,
        left: undefined,
        top: undefined,
    };
    
    const arrangePhotoButtons = (photo) => {
        if (!moving && !resizing && editMode && !rotating && !moveButtonFocused) {

            currentPhoto.node = photo;
            currentPhoto.zIndex = window.getComputedStyle(photo).zIndex;
            currentPhoto.rotation = getRotation();
            currentPhoto.width = parseFloat(window.getComputedStyle(photo).width);
            currentPhoto.height = parseFloat(window.getComputedStyle(photo).height);
            currentPhoto.left = photo.offsetLeft;
            currentPhoto.top = photo.offsetTop;
            
            photo.style.zIndex = 4;
            rotateButton.style.pointerEvents = 'none';
            rotateButton.style.display = 'block';
            resizeButton.style.display = 'block';

            if (currentPhoto.node.parentElement.className == 'user-note') {
                moveButton.style.display = 'block';
                moveButton.style.width = currentPhoto.width / 3 + 'px';
                moveButton.style.left = (currentPhoto.left + focusedNoteContainer.offsetLeft + parseFloat(window.getComputedStyle(moveButton).width)) + 'px';
                moveButton.style.top = (currentPhoto.top + focusedNoteContainer.offsetTop - secondSection.offsetTop) + ((currentPhoto.height - parseFloat(window.getComputedStyle(moveButton).height)) / 2) + 'px';

                rotateButton.style.height = currentPhoto.height * 1.75 + 'px';
                rotateButton.style.left = currentPhoto.left + focusedNoteContainer.offsetLeft + ((currentPhoto.width - parseFloat(window.getComputedStyle(rotateButton).width)) / 2) + 'px';
                rotateButton.style.top = (currentPhoto.top + focusedNoteContainer.offsetTop - secondSection.offsetTop) + ((currentPhoto.height - parseFloat(window.getComputedStyle(rotateButton).height)) / 2) + 'px';
                rotateButton.src = 'resources-finale/rotate-pinned.png';

                resizeButton.style.width = currentPhoto.width + 'px';
                resizeButton.style.left = currentPhoto.left + focusedNoteContainer.offsetLeft + 'px';
                resizeButton.style.top = (currentPhoto.top + focusedNoteContainer.offsetTop - secondSection.offsetTop) + ((currentPhoto.height - parseFloat(window.getComputedStyle(resizeButton).height)) / 2) + 'px';
            } else {
                moveButton.style.display = 'block';
                moveButton.style.width = currentPhoto.width / 3 + 'px';
                moveButton.style.left = (currentPhoto.left + parseFloat(window.getComputedStyle(moveButton).width)) + 'px';
                moveButton.style.top = currentPhoto.top + ((currentPhoto.height - parseFloat(window.getComputedStyle(moveButton).height)) / 2) + 'px';

                rotateButton.style.height = currentPhoto.height * 1.75 + 'px';
                rotateButton.style.left = currentPhoto.left + ((currentPhoto.width - parseFloat(window.getComputedStyle(rotateButton).width)) / 2) + 'px';
                rotateButton.style.top = currentPhoto.top + ((currentPhoto.height - parseFloat(window.getComputedStyle(rotateButton).height)) / 2) + 'px';
                rotateButton.src = 'resources/rotate.png';

                resizeButton.style.width = currentPhoto.width + 'px';
                resizeButton.style.left = currentPhoto.left + 'px';
                resizeButton.style.top = currentPhoto.top + ((currentPhoto.height - parseFloat(window.getComputedStyle(resizeButton).height)) / 2) + 'px';
            }
            resizeButton.style.transform = 'rotate(' + currentPhoto.rotation + 'deg)';
            rotateButton.style.transform = 'rotate(' + currentPhoto.rotation + 'deg)';
            moveButton.style.transform = 'rotate(' + currentPhoto.rotation + 'deg)';

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
            if(currentAlbumNumber > 0){
                editButton.classList.remove('speech-bubble-active');
                saveButton.classList.remove('speech-bubble-active');
                hideAppendedPhotos();
            }
            inputNote.style.display = 'none';
            fullModeReset();
        }
        document.body.classList.toggle('full-mode-active');
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
        draggables.dragElement(moveButton);

        fullModeBtn.addEventListener('click', fullModeToggle);
        menuCircle.addEventListener('click', fullModeNavToggle);

        fullModeNav.addEventListener('mouseover', navHoverAnimations);
        fullModeNav.addEventListener('click', fullScreenNavEvents);

        inputNote.addEventListener('mousedown', notes.activateNote);
        document.getElementById('submit-note').addEventListener('click', notes.submitNote);

        albumNumbersContainer.addEventListener('click', chooseAlbumNumber);

        document.getElementById('input-photo').addEventListener('input', appendPhoto);

        saveButton.addEventListener('mouseover', () => editButton.classList.add('moved'));
        saveButton.addEventListener('mouseout', () => editButton.classList.remove('moved'));
        editButton.addEventListener('mousedown', changeLabels); 
        
        moveButton.addEventListener('mouseover', focusMoveButton);

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
        resetMoveButtons
    }
})();
app.start();

