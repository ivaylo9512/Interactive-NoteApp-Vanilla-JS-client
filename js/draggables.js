const dragElement = ({target, transform, dragParent, isStopPropagation, mouseDownCallback, closeCallBack}) => {
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

        let dragObject = {
            node,
            offsetLeft,
            offsetTop,
            clientX: event.clientX,
            clientY: event.clientY,
        }

        if(closeCallBack){
            closeCallBack(dragObject);
        }

        switch (className) {
            case 'move-btn':
                app.resetMoveButtons();
                break;
            case 'point':
                resetNavPoint();
                break;
            case 'clouds-container':
                dragged && notes.resetHeader(node, offsetLeft, offsetTop);
                break;
        }
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
