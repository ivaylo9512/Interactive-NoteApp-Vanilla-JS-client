const draggables = (() =>{

    const dragElement = (node) => {
        node.addEventListener('mousedown', onMouseDown)
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;

        let className;

        function onMouseDown(e) {
            e.preventDefault();
            pos3 = e.pageX;
            pos4 = e.pageY;            
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', closeDrag);

            className = node.className
            if (className == 'move-note') node = node.parentElement;
        }

        function onDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.pageX;
            pos2 = pos4 - e.pageY;
            pos3 = e.pageX;
            pos4 = e.pageY;

            node.style.top = node.offsetTop - pos2 + 'px';
            node.style.left = node.offsetLeft - pos1 + 'px';
        }

        function closeDrag(e) {
            mouseDown = false;
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', closeDrag);
        }
    }
    return {
        dragElement
    }
    
})();
