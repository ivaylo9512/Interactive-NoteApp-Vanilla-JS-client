const draggables = (() =>{

    const dragElement = (node) => {
        node.addEventListener('mousedown', onMouseDown);
    }

    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    let className;
    let node;
    let elementFromPoint;

    function onMouseDown(e) {
        node = e.currentTarget;
        e.preventDefault();
        pos3 = e.pageX;
        pos4 = e.pageY;            
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', closeDrag);
        
        node.style.transition = '0s';
        className = node.className;
        
        if (className == 'move-note' || className == 'drag-photo') node = node.parentElement;
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
            case 'move-photo':
                break;
            case 'drag-photo':
                makeContainerDraggable();
                break;
            case 'nav-point':
                checkPointPosition();
                break;
        }
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

    function closeDrag() {
        let x = event.clientX;
        let y = event.clientY;
        elementFromPoint = document.elementFromPoint(x, y);
        
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', closeDrag);
        
        switch (className) {
            case 'move-photo':
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

    const choosePhoto = () => {
        node.parentElement.removeChild(node);

        const photo = node.children[0];
        photo.className = 'appended';
        photo.style.opacity = 1;
        photo.style.transition = 'opacity 1s'
       
        elementFromPoint.appendChild(photo);
        elementFromPoint.className = 'placed-photo';

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
    return {
        dragElement
    }
    
})();
