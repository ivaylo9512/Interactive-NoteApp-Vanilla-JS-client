const draggables = (() =>{

    const dragElement = (elmnt) => {
        elmnt.addEventListener('mousedown', onMouseDown)
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;

        function onMouseDown(e) {
            e.preventDefault();
            pos3 = e.pageX;
            pos4 = e.pageY;
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', closeDrag);
        }

        function onDrag(e) {
            e.preventDefault();
            console.log('hey');
            pos1 = pos3 - e.pageX;
            pos2 = pos4 - e.pageY;
            pos3 = e.pageX;
            pos4 = e.pageY;
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
