const dragElement = ({target, isTransform, isParent, mouseDownCallback, dragCallback, closeCallback}) => {
    target.addEventListener('mousedown', onMouseDown);
    
    let pos1 = 0,
        pos2 = 0,
        offsetTop,
        offsetLeft;

    let node = target;
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

        const dragObject = {
            target,
            node,
            offsetLeft,
            offsetTop,
            pos1,
            pos2,
        }

        if(dragCallback){
            dragCallback(dragObject, closeDrag)
        }
        
    }

    function closeDrag() {        
        window.removeEventListener('mousemove', onDrag);
        window.removeEventListener('mouseup', closeDrag);

        const dragObject = {
            target,
            node,
            offsetLeft,
            offsetTop,
            clientX: event.clientX,
            clientY: event.clientY,
            dragged
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
    }

    return () => {
        target.removeEventListener('mousedown', onMouseDown);
    }
}
