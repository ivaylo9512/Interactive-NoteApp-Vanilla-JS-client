const app = (() =>{
    const body = document.body;
    const userPhotosContainer = document.getElementById('user-photos');
    const appendedPhotos = Array.from(userPhotosContainer.children);
    const albums = []

    let currentAlbumNumber;
    const getCurrentAlbumNumber = () => currentAlbumNumber;

    const windowHeight = window.innerHeight; // if resize?
    const getAlbumImages = (e) => {
        const albumNumber = +e.target.id;

        if(!albums[albumNumber]){
            
            remote.getAlbumImages(albumNumber).then(res => {
                animate.smoothScroll(body.offsetHeight - animate.getScrollY() - windowHeight - 450, 1500);
                albums[albumNumber] = res.data;

                currentAlbumNumber = albumNumber
                
                showButtons();
                appendAlbumPhotos(albums[albumNumber]);
            })
            .catch(e => {
                console.log(e);
            })
        }else{
            currentAlbumNumber = albumNumber

            showButtons();            
            animate.smoothScroll(body.offsetHeight - animate.getScrollY() - windowHeight - 450, 1500);
            appendAlbumPhotos(albums[albumNumber])
        }
    }

    const appendAlbumPhotos = (currentAlbum) => {
        for(const [i, photo] of appendedPhotos.entries()) {
            if(isFullMode){
                return;
            }

            const style = photo.style;

            photo.classList.remove('visible');
            style.width = style.transform = style.top = style.left = null;

            if(i < currentAlbum.length){
                photo.classList.add('visible');
                photo.id = currentAlbum[i].id;
                photo.children[0].src = remote.base + currentAlbum[i].location;
                
                currentAlbum[i].widthUnits == currentAlbum.widthUnits == undefined ? '%' : 'px';

                style.transform = `rotate(${currentAlbum[i].rotation}deg)`;
                style.left = currentAlbum[i].leftPosition + 'px';
                style.top = currentAlbum[i].topPosition + 'px';
                style.width = currentAlbum[i].width + currentAlbum.widthUnits;

                let noteId = currentAlbum[i].note + 'note';
                if(currentAlbum[i].note){
                    photo.classList.remove('visible');
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

    let isMoving;
    let resizable; //??
    let isResizing;
    let isRotating;
    
    const moveEditablePhoto = (pos1, pos2) => {
        if (isEditMode) {
            isMoving = true;
            rotateButton.style.display = 'none';
            resizeButton.style.display = 'none';

            currentPhoto.top = currentPhoto.top - pos2;
            currentPhoto.left = currentPhoto.left - pos1;
            //TODO:
            if (currentPhoto.node.parentElement.className == 'user-note' && currentPhoto.node.getBoundingClientRect().top + animate.getScrollY() > 30000) {
                currentPhoto.top = currentPhoto.node.getBoundingClientRect().top + animate.getScrollY() - secondSection.offsetTop;
                currentPhoto.left = currentPhoto.left + focusedNote.offsetLeft + parseFloat(window.getComputedStyle(notesContainer).marginLeft) - secondSection.offsetLeft + noteContainer.offsetLeft;
                currentPhoto.node.style.top = currentPhoto.top + 'px';
                currentPhoto.node.style.left = currentPhoto.left + 'px';
                currentPhoto.node.style.width = (currentPhoto.width / parseFloat(window.getComputedStyle(secondSection).width)) * 100 + '%';
                currentPhoto.node.classList.add('visible');
                currentPhoto.node.style.opacity = 1;
                
                rotateButton.src = 'resources/rotate.png'
                userPhotosContainer.appendChild(currentPhoto.node);
            }
        }
    }
    
    const resetMoveButtons = () => {
        rotateButton.style.display = 'block';
        resizeButton.style.display = 'block';
        isMoving = false;
    }

    let posX;
    let isLeftResize;
    const checkIfResizable = (e) => {
        if (isEditMode) {
            if (e.offsetX < currentPhoto.width / 7) {
                isResizing = true;
                isLeftResize = true;
            }else if (e.offsetX > currentPhoto.width / 1.2) {
                isResizing = true;
                isLeftResize = false;
            }
            posX = e.clientX;
            if(isResizing){
                window.addEventListener('mousemove', resize);
                window.addEventListener('mouseup', stopResize)
            }
        }
    }
    // TODO: max(x,y)
    const resize = (e) => {
        moveButton.style.display = 'none';
        rotateButton.style.display = 'none';

        const nextPosX = e.clientX;
        const minWidth = currentPhoto.width - 80;
        let minPosX;
        let minLeft = minWidth;
        let resize;
        let moveLeft;
        if(isLeftResize){
            resize = posX - nextPosX;
            moveLeft = nextPosX - posX;
            minPosX = posX + minWidth;
        }else{
            resize = nextPosX - posX;
            moveLeft = 0;
            minLeft = 0;
            minPosX = posX - minWidth;
        }

        if(currentPhoto.width + resize > 80){
            currentPhoto.left = currentPhoto.left + moveLeft;
            currentPhoto.node.style.left = currentPhoto.left + 'px';

            currentPhoto.width = currentPhoto.width + resize;  
            currentPhoto.node.style.width = currentPhoto.width + 'px';
            
            posX = nextPosX;
        }else{
            if(minWidth > 0){
                currentPhoto.left = currentPhoto.left + minLeft;
                currentPhoto.node.style.left = currentPhoto.left + 'px';

                currentPhoto.width = currentPhoto.width - minWidth;
                currentPhoto.node.style.width = currentPhoto.width + 'px';

                posX = minPosX;
            }
        }
}

    function stopResize(e) {
        isResizing = false;

        if (e.target != currentPhoto.node && e.target.parentElement != currentPhoto.node) {
            resizeButton.style.display = 'none'
            currentPhoto.node.style.zIndex = currentPhoto.zIndex;
        }else{
            moveButton.style.display = 'block';
            rotateButton.style.display = 'block';
        }

        window.removeEventListener('mousemove', resize);
        window.removeEventListener('mouseup', stopResize);
    }

    const hideAppendedPhotos = () => appendedPhotos.forEach(photo => photo.classList.remove('visible'));
    
    let focusedNote;
    let notesContainer;
    let noteContainer;
    const setfocusedNote = (note) => {
        focusedNote = note;

        if(focusedNote){
            notesContainer = focusedNote.parentElement;
            noteContainer = notesContainer.parentElement;
        }
    }

    let isEditMode;
    const editButton = document.getElementById('speech-bubble-right');
    const saveButton = document.getElementById('speech-bubble-left');
    const editButtonLabel = editButton.children[0];
    
    const changeLabels = () => {
        if (!isEditMode) {
            editButtonLabel.textContent = 'Cancel';
        } else {
            editButtonLabel.textContent = 'Edit';
            rotateButton.style.display = 'none';
            resizeButton.style.display = 'none';
            moveButton.style.display = 'none';
            resetEdits();
        }
        isEditMode = !isEditMode;
    }

    const resetEdits = () => {
        const album = albums[currentAlbumNumber];
        album.forEach((photo, i) => resetPhoto(photo, i));
    }

    const resetPhoto = (photo, i) => {
        const appendedPhoto = appendedPhotos[i];
        const style = appendPhoto.style;

        style.width = style.transform = style.top = style.left = null;

        style.width = photo.widthSize + photo.widthUnits;
        photo.width = photo.widthSize;
        style.left = photo.leftPosition + 'px';
        photo.left = photo.leftPosition;
        style.top = photo.topPosition + 'px';
        photo.top = photo.topPosition;
        style.transform = `rotate(${photo.rotation}deg)`;

        const note = document.getElementById(photo.note + 'note');
        if(note){
            note.appendChild(appendedPhoto);
            appendedPhoto.classList.remove('visible');
        }else if(appendedPhoto.parentElement.className == 'user-note' && !photo.note){
            appendedPhoto.classList.add('visible');
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

    //TODO:
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
        photo.addEventListener('dragstart', (e) => e.preventDefault());
        photo.addEventListener('mousedown', checkIfResizable);
        photo.addEventListener('mouseenter', () => focusPhoto(photo));
        photo.addEventListener('mouseleave', resetPhotoButtons);
    }
    
    const moveButton = document.getElementById('move-btn');
    const resizeButton = document.getElementById('resize-btn');
    const rotateButton = document.getElementById('rotate-btn');
    const secondSection = document.getElementById('notebook');
    const noteSection = document.getElementById('note-section');

    let currentPhoto;
    const focusPhoto = (photo) => {
        if (!isMoving && !isResizing && isEditMode && !isRotating) {
            currentPhoto = albums[currentAlbumNumber][appendedPhotos.indexOf(photo)];
            currentPhoto.node = photo;

            if(!currentPhoto.focused){
                currentPhoto.focused = true;

                const styles = window.getComputedStyle(photo);
                currentPhoto.zIndex = styles.zIndex;
                currentPhoto.left = parseFloat(styles.left);
                currentPhoto.leftPosition = currentPhoto.left;
                currentPhoto.top = parseFloat(styles.top);
                currentPhoto.topPosition = currentPhoto.top;
                currentPhoto.width = parseFloat(styles.width);
                currentPhoto.widthSize = currentPhoto.width;
                currentPhoto.widthUnits = 'px';
            }

            photo.appendChild(resizeButton);
            photo.appendChild(rotateButton);
            photo.appendChild(moveButton);
            
            photo.style.zIndex = 4;
            currentPhoto.node.parentElement.className == 'user-note' ? rotateButton.src = 'resources/rotate-pinned.png'
                : rotateButton.src = 'resources/rotate.png';
            

            rotateButton.style.display = 'block';
            resizeButton.style.display = 'block';
            moveButton.style.display = 'block';

        }
    }

    const resetPhotoButtons = () => {
        if (!isMoving && !isResizing && !isRotating && isEditMode) {
            moveButton.style.display = 'none';
            resizeButton.style.display = 'none';
            rotateButton.style.display = 'none';
            currentPhoto.node.style.zIndex = currentPhoto.zIndex;
            rotateButton.style.pointerEvents = 'all';
        }
    }

    let centerX, centerY;
    const startRotate = (e) => {
        e.stopPropagation();
        isRotating = true;
        resizeButton.style.display = 'none';
        moveButton.style.display = 'none';

        const photo = currentPhoto.node;
        
        const clientRect = photo.getBoundingClientRect();
        centerX = clientRect.left + (clientRect.right - clientRect.left) /2;
        centerY = clientRect.top + window.scrollY + (clientRect.bottom - clientRect.top) /2;

        window.addEventListener('mousemove', rotate);
        window.addEventListener('mouseup', stopRotate);
    }

    const rotate = () => {
        if (isEditMode) {
            var mouseX = event.pageX;
            var mouseY = event.pageY;

            var radians = Math.atan2(mouseX - centerX, mouseY - centerY);
            var degree = (radians * (180 / Math.PI) * -1) + 180;
    
            currentPhoto.node.style.transform = `rotate(${degree}deg)`;
        }
    }
    
    const stopRotate = (e) => {
        isRotating = false;

        if(e.target != currentPhoto.node && e.target.parentElement != currentPhoto.node){
            rotateButton.style.display = 'none';
            currentPhoto.node.style.zIndex = currentPhoto.zIndex;
        }else{
            moveButton.style.display = 'block';
            resizeButton.style.display = 'block';
            rotateButton.style.display = 'block';
            currentPhoto.node.style.zIndex = 4;
        }

        window.removeEventListener('mousemove', rotate);
    }

    const attachPhoto = (e) => {
        if(e.ctrlKey && focusedNote){
            if(currentPhoto.node.parentElement.className == 'user-note'){
                detachFromNote();
            }else if (currentPhoto.top < -900) {
                attachToNote();
            }
        }
    }
    const detachFromNote = () => {
        const style = currentPhoto.node.style;
      
        currentPhoto.node.classList.add('visible');
        currentPhoto.top = currentPhoto.node.getBoundingClientRect().top + animate.getScrollY() - secondSection.offsetTop;
        currentPhoto.left = currentPhoto.left + focusedNote.offsetLeft + parseFloat(window.getComputedStyle(notesContainer).marginLeft) - secondSection.offsetLeft + noteContainer.offsetLeft;
       
        style.top = currentPhoto.top + 'px';
        style.left = currentPhoto.left + 'px';
        style.width = currentPhoto.width / parseFloat(window.getComputedStyle(secondSection).width) * 100 + '%';

        rotateButton.src = 'resources/rotate.png'
        userPhotosContainer.appendChild(currentPhoto.node);
    }

    const attachToNote = () => {
        const style = currentPhoto.node.style;

        currentPhoto.node.classList.remove('visible');
        currentPhoto.top = currentPhoto.top - focusedNote.offsetTop + secondSection.offsetTop - (noteContainer.offsetTop + noteSection.offsetTop + notesContainer.offsetTop);
        currentPhoto.left = currentPhoto.left - focusedNote.offsetLeft + secondSection.offsetLeft - parseFloat(window.getComputedStyle(notesContainer).marginLeft) - noteContainer.offsetLeft;
       
        style.top = currentPhoto.top + 'px';
        style.left = currentPhoto.left + 'px';
        style.width = currentPhoto.width / parseFloat(window.getComputedStyle(focusedNote.children[0]).width) * 100 + '%';

        rotateButton.src = 'resources/rotate-pinned.png'
        focusedNote.children[0].appendChild(currentPhoto.node);
    }
    
    const fullModeNav = document.getElementById('full-mode-nav');
    const fullMode = document.getElementById('full-mode');
    const photosContainer = document.getElementById('photos-container-full-mode');
    const playNav = document.getElementById('play-nav');

    let isFullMode;
    const getIsFullMode = () => isFullMode;

    const fullModeToggle = () => {
        if(isFullMode){ 
            notes.resetNoteView();
            fullModeReset();
            clearPlacedPhotos();
            setTimeout(() => window.scrollTo(0, body.scrollHeight),0);   
        }else{
            animate.skipAnimations();
            notes.bindNote();
            if(currentAlbumNumber){
                hideButtons();
                hideAppendedPhotos();
            }
            playNav.classList.remove('fixed');
        }
        body.classList.toggle('full-mode-active');
        currentAlbumNumber = null;
        isFullMode = !isFullMode;
    }

    let isLoaded;
    const getIsLoaded = () => isLoaded;

    const initialLoading = () => {
        document.getElementById('user-form').reset();
        body.classList.remove("remove-transitions-on-load-up");
        
        setTimeout(() => {
            window.scrollTo(0, body.scrollHeight)
            setTimeout(() => {
                isLoaded = true
            }, 100);
        }, 100);

        setTimeout(() => {
            document.getElementById('pink-bulb').src = 'resources/pink-bulb.gif';
            document.getElementById('blue-bulb').src = 'resources/blue-bulb.gif';
        }, 600);
    }

    const menuCircle = document.getElementById('menu-circle');
    const fullModeNavToggle = () => {
        if(!menuCircle.classList.contains('active')) {
            fullModeReset();
            notes.unpopNote();
        }
        fullMode.classList.add('nav-toggle');
    }

    const fullModeReset = () => {
        menuCircle.classList.add('active');
        body.classList.remove("note-section-active")
        fullMode.classList.remove('nav-toggle');
        fullMode.classList.remove("photo-section-active");
    }
    
    const fullScreenNavEvents = () => {
        if(event.target.tagName == 'LI'){
            fullMode.classList.remove('nav-toggle');
            menuCircle.classList.remove('active');
            notes.unpopNote();

            switch(event.target.textContent){
                case 'Notes':
                    showFullScreenNotes();
                    break;
                case 'Photos':
                    showPhotoSection();
                    break;
                case 'Play':        
                    break;
            }
        }
    }

    const showFullScreenNotes = () => {
        body.classList.add('note-section-active')
        window.scrollTo(0, body.scrollHeight);
    }

    const fixatePlayNav = () => playNav.classList.toggle('fixed');
    
    let playBoxHoverTimeout;
    const setPlayBoxHover = (e) => {
        if(playBoxHoverTimeout) clearTimeout(playBoxHoverTimeout);        

        playNav.classList.add('play-box-hovered');           
        playBoxHoverTimeout = setTimeout(() => {
            playNav.classList.add('play-box-transitioned');           
        }, 1500);
    }  

    const removePlayBoxHover = (e) => {
        clearTimeout(playBoxHoverTimeout);
        playNav.classList.remove('play-box-hovered');           
        playNav.classList.remove('play-box-transitioned')            
    }  

    const photoContainer = (() => { 
        const container = document.createElement('div');
        container.className = 'drag-photo-container';

        const photo = document.createElement('div');
        photo.className = 'drag-photo';
        
        container.appendChild(photo);
        return container;
    })();

    const photosFragment = document.createDocumentFragment();
    const showPhotoSection = () => {
        fullMode.classList.add("photo-section-active");
        
        if(photosContainer.children.length == 0){
            remote.getAlbumImages(0).then(
                res => {
                    const images = res.data;

                    images.forEach((image) => {
                        const containerCopy = photoContainer.cloneNode(true);
                        const photoCopy = containerCopy.children[0];

                        photoCopy.id = image.id;
                        photoCopy.style.backgroundImage = `url('${remote.getBase() + image.location}')`;
                        
                        dragElement(photoCopy);                    
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
            currentAlbumNumber = +number.id;

            currentAlbumNumber == 2 ? albumNumbersContainer.classList.add('middle') : albumNumbersContainer.classList.remove('middle');

            albumNumbersContainer.classList.add('active');
            number.classList.add('slide-middle');

            appendPlacePhotos();

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
                    photo.removeChild(photo.lastChild);
                }
            })

            albumNumbersContainer.classList.remove('active');
            number.classList.remove('slide-middle');
            number = null;
        }
    }

    const photo = document.createElement('div');
    photo.className = 'appended';
    const appendPlacePhotos = async() => {
        
        let album = albums[currentAlbumNumber];
        if(!album){
            await remote.getAlbumImages(currentAlbumNumber).then(res => {
                album = albums[currentAlbumNumber] = res.data;
            }).catch(e => {
                console.log(e);
            })
        }

        album.forEach((image, i) => {
            if(number){
                const photoCopy = photo.cloneNode(false);
                
                photoCopy.id = image.id;
                photoCopy.style.backgroundImage = `url('${remote.getBase() + image.location}')`;
                
                placePhotos[i].appendChild(photoCopy);
                placePhotos[i].className = 'placed-photo';
                
                dragElement(photoCopy);
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
                
                dragElement(photoCopy);
                photosContainer.insertBefore(containerCopy, photosContainer.firstChild);
            })
        }
    }

    const updateChosenPhoto = (id, elementFromPoint) => { 
        const album = albums[currentAlbumNumber]

        return remote.updatePhotoAlbum(id, currentAlbumNumber).then(res => {
            album.push(res.data);
            const index = album.length - 1

            placePhotos[placePhotos.indexOf(elementFromPoint)] = placePhotos[index];
            placePhotos[index] = elementFromPoint;
        })
        
    }

    const exchangePhotos = (placedPhoto, currentPhoto, newPhoto) => {
        const index = placePhotos.indexOf(placedPhoto);
        const album = albums[currentAlbumNumber];

        return remote.exchangePhotos(currentPhoto, newPhoto).then(res => {
            const image = res.data;
            album[index] = image
            
            const photos = placePhotos.filter(placePhoto => {
                if(placePhoto.children[0]) {
                    if(placePhoto.children[0].id == currentPhoto) return placePhoto 
                }
            })
            if(photos.length > 0){
                photos[0].firstChild.src = remote.getBase() + image.location;
                photos[0].firstChild.id = image.id;
                photos[0].className = 'place-photo';
            }

        })
    }

    const clearPhoto = (photo, node) => {
        let photoContainer = document.createElement('DIV');
        photoContainer.appendChild(photo);
        
        photoContainer.className = 'drag-photo-container';
        photo.className = 'drag-photo loading';
        node.className = 'place-photo loading';

        photosContainer.appendChild(photoContainer);

        let album = albums[currentAlbumNumber];
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
            node.classList.remove('loading');
            photo.classList.remove('loading');

        })
    }

    const savePhotos = () => {
        const album = albums[currentAlbumNumber];

        album.forEach((photo, i) => {
            const appendedPhoto = appendedPhotos[i];
            const className = appendedPhoto.className;
            const computedStyles = window.getComputedStyle(appendedPhoto);

            photo.node = null;
            appendedPhoto.classList.add('visible');
            
            if(appendedPhoto.style.width){
                const computedWidth = computedStyles.width
                photo.width = computedWidth.includes('%') ? parseFloat(computedWidth) : parseFloat(computedWidth) / parseFloat(window.getComputedStyle(appendedPhoto.parentElement).width) * 100;
                photo.widthUnits = '%';
            }

            if(appendedPhoto.style.left) photo.leftPosition = parseFloat(computedStyles.left);
            if(appendedPhoto.style.top) photo.topPosition = parseFloat(computedStyles.top);

            photo.rotation = getRotation(appendedPhoto);
            appendedPhoto.className = className;
            
            if(appendedPhoto.classList.contains('visible')) photo.note = null;
            //TODO:
            if(appendedPhoto.parentElement.className == 'user-note'){
                const noteId = appendedPhoto.parentElement.id;
                photo.note = noteId.substring(0, noteId.length - 4);
            }
            if(!photo.note && appendedPhoto.offsetTop < -1710){
                photo.topPosition = '-1710px';
                appendedPhoto.style.top = '-1710px';
            }
        })

        remote.updateAlbumPhotos(album).then(
            res => {
                editButtonLabel.textContent = 'Edit';
                rotateButton.style.display = 'none';
                isEditMode = false;
            }
        );
    }
        
    const start = () => {
        window.addEventListener('load', () => {
            initialLoading();   
            profile.initialize();
            animate.initialize();
            date.initialize();        
            colorize.start();
            notes.start();
        
            dragElement(document.getElementById('move-note'));
            dragElement(document.getElementById('point'));
            dragElement(moveButton);

            document.getElementById('play-box').addEventListener('mouseover', setPlayBoxHover);
            document.getElementById('play-box').addEventListener('mouseleave', removePlayBoxHover);
            document.getElementById('fixate-btn').addEventListener('click', fixatePlayNav);
            document.getElementById('album-btns').addEventListener('click', getAlbumImages);
            document.getElementById('full-mode-btn').addEventListener('click', fullModeToggle);
            menuCircle.addEventListener('click', fullModeNavToggle);
            fullModeNav.addEventListener('click', fullScreenNavEvents);

            document.getElementById('input-photo').addEventListener('input', appendPhoto);

            saveButton.addEventListener('mouseover', () => editButton.classList.add('rotate'));
            saveButton.addEventListener('mouseout', () => editButton.classList.remove('rotate'));
            saveButton.addEventListener('click', savePhotos);
            editButton.addEventListener('click', changeLabels); 
            
            moveButton.addEventListener('click', attachPhoto);
            rotateButton.addEventListener('dragstart', (e) => e.preventDefault());
            rotateButton.addEventListener('mousedown', startRotate);

            appendedPhotos.forEach(photo =>{
                userPhotoListeners(photo);
            })
        });
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
        findUserPhoto,
        getIsFullMode,
        getIsLoaded
    }
})();
app.start();

