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
            
            node.style.transition = '0s';
            className = node.className;
            
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

            switch (className) {
                case "move-photo":
                    break;
                case "drag-photo":
                    break;
                case "nav-point":
                    checkPointPosition();
                    break;
            }
        }

        const checkPointPosition = () => {
            if (pos3 > 100) {
                closeDrag();

            } else if (node.parentElement.getBoundingClientRect().top - event.clientY > 44) {
                closeDrag();
            }
        }

        function closeDrag(e) {
            mouseDown = false;
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', closeDrag);

            switch (className) {
                case "move-photo":
                    break;
                case "drag-photo":
                    break;
                case "nav-point":
                    resetNavPoint();
                    break;
            }
        }

        const resetNavPoint = () => {
            node.style.transition = "2s"
                node.style.left = "23px";
                node.style.top = "-7px"
        }
    }
    return {
        dragElement
    }
    
})();
