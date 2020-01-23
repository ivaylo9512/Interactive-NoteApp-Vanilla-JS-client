const app = (() =>{

    const userPhotosContainer = document.getElementById('user-photos');
    const appendedPhotos = Array.from(userPhotosContainer.children);
    const albums = []

    let currentAlbumNumber;
    const windowHeight = window.innerHeight;
    const getAlbumImages = (e) => {
        const albumNumber = +e.target.id;;

        if(!albums[albumNumber]){
            
            remote.getAlbumImages(albumNumber).then(res => {
                animate.smoothScroll(document.body.offsetHeight - animate.getScrollY() - windowHeight - 450, 1500);
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
            animate.smoothScroll(document.body.offsetHeight - animate.getScrollY() - windowHeight - 450, 1500);
            appendAlbumPhotos(albums[albumNumber])
        }
    }

    const appendAlbumPhotos = (currentAlbum) => {
        for(const [i, photo] of appendedPhotos.entries()) {
            if(fullModeOn){
                return;
            }

            photo.classList.remove('visible');
            photo.style.width = null;
            photo.style.transform = null;
            photo.style.top = null;
            photo.style.left = null;

            if(i < currentAlbum.length){
                photo.classList.add('visible');
                photo.id = currentAlbum[i].id;
                photo.children[0].src = 'http://localhost:8000/' + currentAlbum[i].location;
                photo.style.transform = `rotate(${currentAlbum[i].rotation}deg)`;
                photo.style.left = currentAlbum[i].leftPosition + 'px';
                photo.style.top = currentAlbum[i].topPosition + 'px';
                currentAlbum[i].widthUnits == currentAlbum.widthUnits == undefined ? '%' : 'px';
                photo.style.width = currentAlbum[i].width + currentAlbum.widthUnits;

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

    let moving = false;
    let resizable = false;
    let resizing = false;
    let rotating = false;
    
    const moveEditablePhoto = (pos1, pos2) => {
        if (editMode) {
            moving = true;
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
        moving = false;
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
    // TODO: max(x,y)
    const resize = (e) => {
            moveButton.style.display = 'none';
            rotateButton.style.display = 'none';
            resizing = true;

            if (leftResize && currentPhoto.width + currentMousePosition - e.clientX > 80) {
                currentPhoto.node.style.width = (currentPhoto.width + currentMousePosition - e.clientX) / parseFloat(window.getComputedStyle(currentPhoto.node.parentElement).width) * 100 + '%';
                currentPhoto.node.style.left = currentPhoto.left + e.clientX - currentMousePosition + 'px';
            } else if (!leftResize && currentPhoto.width + e.clientX - currentMousePosition > 80) {
                currentPhoto.node.style.width = currentPhoto.width + e.clientX - currentMousePosition + 'px';
            }
    }

    function stopResize(e) {
        resizing = false;
        resizable = false;
        currentPhoto.left = currentPhoto.node.offsetLeft;
        currentPhoto.top = currentPhoto.node.offsetTop;
        currentPhoto.width = parseFloat(window.getComputedStyle(currentPhoto.node).width);
        currentPhoto.height = parseFloat(window.getComputedStyle(currentPhoto.node).height);

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
        const album = albums[currentAlbumNumber];
        album.forEach((photo, i) => resetPhoto(photo, i));
    }

    const resetPhoto = (photo, i) => {
        const appendedPhoto = appendedPhotos[i];

        appendedPhoto.style.width = null;
        appendedPhoto.style.transform = null;
        appendedPhoto.style.top = null;
        appendedPhoto.style.left = null;

        appendedPhoto.style.width = photo.width + photo.widthUnits;
        appendedPhoto.style.left = photo.leftPosition + 'px';
        appendedPhoto.style.top = photo.topPosition + 'px';
        appendedPhoto.style.transform = `rotate(${photo.rotation}deg)`;

        let note = document.getElementById(photo.note + 'note')
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
    const secondSection = document.getElementById('second-section');


    //TODO:?
    let notesContainer;
    let noteContainer;
    let noteSection;

    let currentPhoto;
    const focusPhoto = (photo) => {
        if (!moving && !resizing && editMode && !rotating) {
            currentPhoto = albums[currentAlbumNumber][appendedPhotos.indexOf(photo)];
            currentPhoto.node = photo;

            if(!currentPhoto.focused){
                currentPhoto.focused = true;

                const styles = window.getComputedStyle(photo);
                currentPhoto.zIndex = styles.zIndex;
                currentPhoto.height = parseFloat(styles.height);
                currentPhoto.left = parseFloat(styles.left);
                currentPhoto.top = parseFloat(styles.top);
                currentPhoto.width = parseFloat(styles.width);
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
        if (!moving && !resizing && !rotating && editMode) {
            moveButton.style.display = 'none';
            resizeButton.style.display = 'none';
            rotateButton.style.display = 'none';
            currentPhoto.node.style.zIndex = currentPhoto.zIndex;
            rotateButton.style.pointerEvents = 'all';
        }
    }

    let centerX;
    let centerY;
    const startRotate = (e) => {
        e.stopPropagation();
        rotating = true;
        resizeButton.style.display = 'none';
        moveButton.style.display = 'none';

        const photo = currentPhoto.node;
        centerX = photo.getBoundingClientRect().left + (photo.getBoundingClientRect().right - photo.getBoundingClientRect().left) /2;
        centerY = photo.getBoundingClientRect().top + window.scrollY + (photo.getBoundingClientRect().bottom - photo.getBoundingClientRect().top) /2;

        window.addEventListener('mousemove', rotate);
        window.addEventListener('mouseup', stopRotate);
    }

    const rotate = () => {
        if (editMode) {
            var mouseX = event.pageX;
            var mouseY = event.pageY;

            var radians = Math.atan2(mouseX - centerX, mouseY - centerY);
            var degree = (radians * (180 / Math.PI) * -1) + 180;
    
            currentPhoto.node.style.transform = `rotate(${degree}deg)`;
        }
    }
    
    const stopRotate = (e) => {
        rotating = false;

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
    // TODO:
    const attachPhoto = (e) => {
        if(e.ctrlKey){
            if (focusedNote && currentPhoto.node.parentElement.className != 'user-note' && currentPhoto.top < -900) {
                currentPhoto.top = currentPhoto.top - focusedNote.offsetTop + secondSection.offsetTop - (noteContainer.offsetTop + noteSection.offsetTop + notesContainer.offsetTop);
                currentPhoto.left = currentPhoto.left - focusedNote.offsetLeft + secondSection.offsetLeft - parseFloat(window.getComputedStyle(notesContainer).marginLeft) - noteContainer.offsetLeft;
                currentPhoto.node.style.top = currentPhoto.top + 'px';
                currentPhoto.node.style.left = currentPhoto.left + 'px';
                currentPhoto.node.style.width = currentPhoto.width / parseFloat(window.getComputedStyle(focusedNote.children[0]).width) * 100 + '%';
                currentPhoto.node.classList.remove('visible');

                rotateButton.src = 'resources/rotate-pinned.png'
                focusedNote.children[0].appendChild(currentPhoto.node);
            }else if(focusedNote && currentPhoto.node.parentElement.className == 'user-note'){
                currentPhoto.node.classList.add('visible');
                currentPhoto.top = currentPhoto.node.getBoundingClientRect().top + animate.getScrollY() - secondSection.offsetTop;
                currentPhoto.left = currentPhoto.left + focusedNote.offsetLeft + parseFloat(window.getComputedStyle(notesContainer).marginLeft) - secondSection.offsetLeft + noteContainer.offsetLeft;
                currentPhoto.node.style.top = currentPhoto.top + 'px';
                currentPhoto.node.style.left = currentPhoto.left + 'px';
                currentPhoto.node.style.width = currentPhoto.width / parseFloat(window.getComputedStyle(secondSection).width) * 100 + '%';

                rotateButton.src = 'resources/rotate.png'
                userPhotosContainer.appendChild(currentPhoto.node);
            }
        }
    }
    
    const getCurrentAlbumNumber = () => currentAlbumNumber;

    const fullModeNav = document.getElementById('full-mode-nav');
    const fullMode = document.getElementById('full-mode');
    const inputNote = document.getElementById('input-note');
    const photoSection = document.getElementById('photo-section-full-mode')
    const photosContainer = document.getElementById('photos-container-full-mode');
    const playNav = document.getElementById('play-nav');
    const addPhoto = document.getElementById('add-photo');

    let fullModeOn = false;
    let initialLoad = false;
    const fullModeToggle = () => {
        if(fullModeOn){ 
            initialLoad = false;
            notes.resetNote();
            notes.resetNoteView();

            clearPlacedPhotos();

            playNav.classList.remove('active');
            addPhoto.style.display = 'none';
            inputNote.classList.remove('inactive');
            fullMode.style.display = 'none';

            setTimeout(() => window.scrollTo(0, document.body.scrollHeight),0);   
            
        }else{
            animate.skipAnimations();
            if(currentAlbumNumber){
                hideButtons();
                hideAppendedPhotos();
            }
            inputNote.style.display = 'none';
            playNav.classList.remove('active');
            fullModeReset();
        }
        document.body.classList.toggle('full-mode-active');
        currentAlbumNumber = null;
        fullModeOn = !fullModeOn;
    }

    const isFullMode = () => fullModeOn;
    const isInitialLoad = () => initialLoad;

    const initialLoading = () => {
        document.getElementById('user-form').reset();
        
        setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);

        setTimeout(() => {
            document.getElementById('pink-bulb').src = 'resources/pink-bulb.gif';
            document.getElementById('blue-bulb').src = 'resources/blue-bulb.gif';
            initialLoad = true;            
        }, 600);
    }

    const menuCircle = document.getElementById('menu-circle');
    const fullModeNavToggle = () => {

        if(menuCircle.classList.contains('inactive')) fullModeReset();
        playNav.classList.add('active');
        setTimeout(() => 
            fullModeNav.classList.add('active')
        , 0);
        
    }

    const fullModeReset = () => {
        menuCircle.classList.remove('inactive');
        fullMode.style.display = 'block';
        addPhoto.style.display = 'none';
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
                        notes.bindNote();
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
            playNav.classList.remove('active');
            
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

    const fixatePlayNav = () => playNav.classList.toggle('active');
    
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
        photoSection.style.display = 'block';
        addPhoto.style.display = 'block';
        
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
                    photo.removeChild(photo.firstChild);
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
                editMode = false;
            }
        );
    }
        
    const start = () => {
        window.addEventListener('load', () => {
            initialLoading();   
            profile.start();
        });
        
        animate.start();
        colorize.start();
        notes.start();
        
        dragElement(document.getElementById('move-note'));
        dragElement(document.getElementById('point'));
        dragElement(document.getElementById('timeline-years'))
        dragElement(moveButton);

        document.getElementById('fixate-btn').addEventListener('click', fixatePlayNav)
        document.getElementById('album-btns').addEventListener('click', getAlbumImages);
        document.getElementById('full-mode-btn').addEventListener('click', fullModeToggle);
        menuCircle.addEventListener('click', fullModeNavToggle);
        fullModeNav.addEventListener('mouseover', navHoverAnimations);
        fullModeNav.addEventListener('click', fullScreenNavEvents);

        albumNumbersContainer.addEventListener('click', chooseAlbumNumber);

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
        isFullMode,
        isInitialLoad
    }
})();
app.start();

