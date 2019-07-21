const draggables = (() =>{

    const dragElement = (target) => {
        target.addEventListener('mousedown', onMouseDown);
        
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;

        let className;
        let elementFromPoint;

        let node = target;
        function onMouseDown(e) {
            e.preventDefault();
            pos3 = e.pageX;
            pos4 = e.pageY;            
            
            className = target.className;
            if(className.includes('disabled')) return;

            node.style.transition = '0s';
            
            if (className == 'move-note' || className == 'drag-photo') node = target.parentElement;

            if (className == 'appended') {
                node = target.parentElement;
                clearAppendedPhoto();
                return;
            }

            window.addEventListener('mousemove', onDrag);
            window.addEventListener('mouseup', closeDrag);
        }

        function onDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.pageX;
            pos2 = pos4 - e.pageY;
            pos3 = e.pageX;
            pos4 = e.pageY;
    
            node.style.top = node.offsetTop - pos2 + 'px';
            node.style.left = node.offsetLeft - pos1 + 'px';
    
            switch (className) {
                case 'move-btn':
                    moveEditablePhoto(pos1, pos2);
                    break;
                case 'drag-photo':
                    makeContainerDraggable();
                    break;
                case 'nav-point':
                    checkPointPosition();
                    break;
            }
            
        }
    
        function closeDrag() {
            let x = event.clientX;
            let y = event.clientY;
            elementFromPoint = document.elementFromPoint(x, y);
            
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', closeDrag);
            
            switch (className) {
                case 'move-btn':
                    app.resetMoveButtons();
                    break;
                case 'drag-photo':

                    photoEndDrag();
                    break;
                case 'nav-point':
                    resetNavPoint();
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
                notes.showMonths();
                closeDrag();
            } else if (node.parentElement.getBoundingClientRect().top - event.clientY > 35) {
                notes.showYears();
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
            photo.classList.add('disabled');
        
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
                photo.classList.remove('disabled');
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

            photo.classList.add('disabled');
            currentPhoto.classList.add('disabled');

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
                photo.classList.remove('disabled');
                currentPhoto.classList.remove('disabled');
            }

            currentPhoto.id = newPhotoId;
            photo.id = currentPhotoId;

        }

        const resetPhoto = () => {
            node.style.top = '0px';
            node.style.left = '0px';
            node.style.marginLeft = '2px';
            node.style.marginTop = '2px';
            node.style.position = 'relative';
        }

        
        const resetNavPoint = () => {
            node.style.transition = '2s';
            node.style.left = '24px';
            node.style.top = '33px';
        }    

        const clearAppendedPhoto = () => {
            app.clearPhoto(target, node);
        }

        const moveEditablePhoto = () => {
            app.moveEditablePhoto(pos1, pos2);
        }
    }
    return {
        dragElement
    }
    
})();
