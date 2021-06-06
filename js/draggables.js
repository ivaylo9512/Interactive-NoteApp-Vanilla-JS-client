const dragElement = (target) => {
    target.addEventListener('mousedown', onMouseDown);
    
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

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
        
        if(className == 'move-btn') e.stopPropagation();
        pos3 = e.pageX;
        pos4 = e.pageY;            

        if(className.includes('loading')) return;
            else if (className == 'move-note' || className == 'drag-photo' || className == 'move-btn') node = target.parentElement;

        node.style.transition = '0s';
        offsetTop = parseFloat(window.getComputedStyle(node).top)
        offsetLeft = parseFloat(window.getComputedStyle(node).left);
        
        if (className == 'appended') {
            node = target.parentElement;
            app.clearPhoto(target, node);
            return;
        }

        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', closeDrag);
    }
    function onDrag(e) {
        e.preventDefault();
        dragged = true;

        offsetLeft -= pos3 - e.pageX;
        offsetTop -= pos4 - e.pageY;
        pos3 = e.pageX;
        pos4 = e.pageY;
         
        node.style.left = offsetLeft + 'px';
        node.style.top = offsetTop + 'px';
        
        switch (className) {
            case 'move-btn':
                app.moveEditablePhoto(pos1, pos2);
                break;
            case 'drag-photo':
                makeContainerDraggable();
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
        let x = event.clientX;
        let y = event.clientY;
        
        window.removeEventListener('mousemove', onDrag);
        window.removeEventListener('mouseup', closeDrag);
        
        switch (className) {
            case 'move-btn':
                app.resetMoveButtons();
                break;
            case 'drag-photo':
                elementFromPoint = document.elementFromPoint(x, y);
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

    const makeContainerDraggable = () => {
        node.style.marginLeft = '0px';
        node.style.marginTop = '0px';
        node.style.position = 'absolute';
        node.style.zIndex = 2;
        node.style.pointerEvents = 'none';
    }

    const checkPointPosition = () => {
        if (pos3 > 100) {
            date.showMonths();
            closeDrag();
        } else if (node.parentElement.getBoundingClientRect().top - event.clientY > 35) {
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
        node.style.top = '0px';
        node.style.left = '0px';
        node.style.marginLeft = '0.1vw';
        node.style.marginRight = '0.1vw';
        node.style.marginBottom = '0.2vw';
        node.style.position = 'relative';
    }

    const resetNavPoint = () => {
        node.style.transition = '2s';
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
