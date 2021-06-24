const dragElement = ({target, isTransform, isParent, mouseDownCallback, dragCallback, closeCallback}) => {
    target.addEventListener('mousedown', onMouseDown);
    
    let pos1 = 0,
        pos2 = 0;

    let className;
    let node = target;
    let offsetTop;
    let offsetLeft;

    let dragged;
    function onMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;

        if(mouseDownCallback){
            if(!mouseDownCallback(target)) return;
        }

        if(isParent) node = target.parentElement;
       
        node.style.pointerEvents = 'none';
        node.style.transition = '0s';

        pos1 = e.pageX;
        pos2 = e.pageY;            
        offsetTop = parseFloat(window.getComputedStyle(node).top)
        offsetLeft = parseFloat(window.getComputedStyle(node).left);
    

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
        
        if(isTransform){
            node.style.mozTransform = `translate(${offsetLeft}px, ${offsetTop}px)`;
            node.style.webkitTransform = `translate(${offsetLeft}px, ${offsetTop}px)`;
            node.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`; 
        }else{
            node.style.left = offsetLeft + 'px';
            node.style.top = offsetTop + 'px';
        }

        if(dragCallback){
            dragCallback(pos1, pos2, offsetLeft, offsetTop)
        }
        
        switch (className) {
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
            target,
            node,
            offsetLeft,
            offsetTop,
            clientX: event.clientX,
            clientY: event.clientY,
        }

        if(closeCallback){
            closeCallback(dragObject);
        }

        node.style.pointerEvents = 'all';
        node.style.transition = null;

        if(isTransform){
            node.style.transform = null;
            node.style.mozTransform = null;
            node.style.webkitTransform = null;
        }


        switch (className) {
            case 'move-btn':
                app.resetMoveButtons();
                break;
            case 'clouds-container':
                dragged && notes.resetHeader(node, offsetLeft, offsetTop);
                break;
        }
    }

    const addBoxShadow = () => {
        const parent = node.parentElement;
        !parent.className.includes('box-shadow') && parent.classList.add('box-shadow'); 
    }

    return () => {
        target.removeEventListener('mousedown', onMouseDown);
    }
}
