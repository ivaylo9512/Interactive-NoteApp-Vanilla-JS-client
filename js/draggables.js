const dragElement = (target, transform, dragParent, isStopPropagation, mouseDownCallback) => {
    target.addEventListener('mousedown', onMouseDown);
    
    let pos1 = 0,
        pos2 = 0;

    let className;
    let elementFromPoint;

    let node = target;
    let offsetTop;
    let offsetLeft;

    let dragged;
    function onMouseDown(e) {
        e.preventDefault();
        dragged = false;

        className = target.className;        
        if(mouseDownCallback){
            if(!mouseDownCallback()) return;
        }
        if (className == 'appended') {
            node = target.parentElement;
            app.clearPhoto(target, node);
            return;
        }
        if(isStopPropagation) e.stopPropagation();
        if(className.includes('loading')) return;
        if(dragParent) node = target.parentElement;

        pos1 = e.pageX;
        pos2 = e.pageY;            
        offsetTop = parseFloat(window.getComputedStyle(node).top)
        offsetLeft = parseFloat(window.getComputedStyle(node).left);
        node.style.pointerEvents = 'none';
    

        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', closeDrag);
    }
    function onDrag(e) {
        e.preventDefault();
        dragged = true;

        offsetLeft -= pos1 - e.pageX;
        offsetTop -= pos2 - e.pageY;
        pos1 = e.pageX;
        pos2 = e.pageY;
        
        if(transform){
            node.style.mozTransform = `translate(${offsetLeft}px, ${offsetTop}px)`;
            node.style.webkitTransform = `translate(${offsetLeft}px, ${offsetTop}px)`;
            node.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`; 
        }else{
            node.style.left = offsetLeft + 'px';
            node.style.top = offsetTop + 'px';
        }
        
        switch (className) {
            case 'move-btn':
                app.moveEditablePhoto(pos1, pos2);
                break;
            case 'point':
                checkPointPosition();
                break;
            case 'clouds-container':
                addBoxShadow();
                break;
        }
        
    }

    function closeDrag() {        
        window.removeEventListener('mousemove', onDrag);
        window.removeEventListener('mouseup', closeDrag);
        
        switch (className) {
            case 'move-btn':
                app.resetMoveButtons();
                break;
            case 'drag-photo':
                elementFromPoint = document.elementFromPoint(event.clientX, event.clientY);
                photoEndDrag();
                break;
            case 'point':
                resetNavPoint();
                break;
            case 'clouds-container':
                dragged && notes.resetHeader(node, offsetLeft, offsetTop);
                break;
        }
    }

    function photoEndDrag() {
        switch (elementFromPoint.className) {
            case 'place-photo':
                choosePhoto();
                break;
            case 'appended':
                exchangePhotos();
                break;
            default:
                resetPhoto();
                break;
        }
        node.style.zIndex = 'auto';
        node.style.pointerEvents = 'auto';
    }

    const checkPointPosition = () => {
        if (offsetLeft > window.innerWidth / 25) {
            date.showMonths();
            closeDrag();
        } else if (offsetTop < -window.innerHeight / 15) {
            date.showYears();
            closeDrag();
        }
    }

    const choosePhoto = async () => {

        if(!app.getCurrentAlbumNumber()){
            resetPhoto();
            return;
        }

        const photo = target;

        photo.style.opacity = 1;
        photo.style.transition = 'opacity 1s'
        photo.classList.add('loading');
    
        elementFromPoint.appendChild(photo);
        node.style.display = 'none';

        
        try{
            await app.updateChosenPhoto(photo.id, elementFromPoint);
        }catch(e){
            node.appendChild(photo);
            node.style.display = 'block';

            console.log(e);
            resetPhoto(node);
            return;
        }finally{
            photo.classList.remove('loading');
        }

        photo.className = 'appended';
        elementFromPoint.className = 'placed-photo';
        node.parentElement.removeChild(node);
    }
    
    async function exchangePhotos() {
        const currentPhoto = elementFromPoint;
        const currentPhotoId = Number(currentPhoto.id);
        const currentPhotoSrc = currentPhoto.src;

        const photo = target;
        const newPhotoId = Number(photo.id);
        const newPhotoSrc = photo.src;

        photo.classList.add('loading');
        currentPhoto.classList.add('loading');

        resetPhoto();
        currentPhoto.src = newPhotoSrc;
        photo.src = currentPhotoSrc;


        try{
            await app.exchangePhotos(currentPhoto.parentElement, currentPhotoId, newPhotoId);
        }catch(e){
            photo.src = newPhotoSrc;
            currentPhoto.src = currentPhotoSrc;
            console.log(e);
            return;
        }finally{
            photo.classList.remove('loading');
            currentPhoto.classList.remove('loading');
        }

        currentPhoto.id = newPhotoId;
        photo.id = currentPhotoId;

    }

    const resetPhoto = () => {
        node.style.webkitTransform = null;
        node.style.mozTransform = null;
        node.style.transform = null;
    }

    const resetNavPoint = () => {
        node.style.transition = null;
        node.style.left = 0;
        node.style.top = 0;
    }    

    const addBoxShadow = () => {
        const parent = node.parentElement;
        !parent.className.includes('box-shadow') && parent.classList.add('box-shadow'); 
    }

    return () => {
        target.removeEventListener('mousedown', onMouseDown);
    }
}
