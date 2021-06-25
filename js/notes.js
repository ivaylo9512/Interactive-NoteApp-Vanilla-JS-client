const notes = (() => {
    const body = document.body;
    const noteSection = document.getElementById('note-section');
    const noteHolders = document.getElementById('note-animation');
    const leftNotesContainer = document.getElementById('left-notes');
    const rightNotesContainer = document.getElementById('right-notes');
    const cloudContainer = document.getElementById('cloud-headers');
    const cloudHeader = document.getElementById('cloud-header');
    const cloudSvg = document.getElementById('cloud');

    let userNotes = []; 
    const getNotes = (date) => {
        userNotes = [];
        const albumNumber = app.getCurrentAlbumNumber();
        remote.getNotes(date, albumNumber).then(
            res => {
                userNotes = res.data;
                appendNotes();
            }).catch(e => {
                console.log(e);
        })
    }

    const noteContainer = (() =>{
        const container = document.createElement('button');
        container.className = 'user-note-container';
        container.id = 'user-note-container';

        const noteName = document.createElement('input');
        noteName.name = 'user-note-name';
        noteName.id = 'user-note-name';

        const updateBtn = document.createElement('button');
        updateBtn.className = 'note-update-btn';
        updateBtn.id = 'note-update-btn';

        const xml = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(xml, 'svg');
        svg.setAttribute("viewBox", "0 0 409.96 254.59"); 
        svg.appendChild(cloudSvg.cloneNode(true));

        container.appendChild(noteName);
        container.appendChild(updateBtn);
        container.appendChild(svg);
        
        return container;
    })();

    const leftNotesFragment = document.createDocumentFragment();
    const rightNotesFragment = document.createDocumentFragment();
    let photoFragment = document.createDocumentFragment();

    let delay = 0;
    let notesCount = 0;
    const appendNotes = () => {
        notesCount = userNotes.length;
        delay = notesCount * 0.2;

        noteSection.classList.add('appended');

        resetNotes();
        addHeaders();

        app.getIsFullMode ?
            window.scrollTo(0, body.scrollHeight - 849) :
                window.scrollTo(0, body.scrollHeight - 2749);
                
        userNotes.forEach((userNote, i) => {
            const note = noteContainer.cloneNode(true);
            const noteName = note.children[0];
            const updateBtn = note.children[1];
            
            noteName.value = userNote.name;
            note.id = userNote.id + 'note';

            userNote.files.forEach(photo => 
                photoFragment.appendChild(app.findUserPhoto(photo.id)));
            note.appendChild(photoFragment);

            note.style.animationDelay = delay + 's';

            delay -= 0.2;
            if(i % 2 == 0) {
                leftNotesFragment.appendChild(note);
            }else{
                rightNotesFragment.appendChild(note);
            }
            
            const noteInfo = {i, note, userNote, updateBtn};
            note.addEventListener('mousedown', () => showUserNote(noteInfo));
        })
        rightNotesContainer.appendChild(rightNotesFragment);
        leftNotesContainer.appendChild(leftNotesFragment);
    }

    let isTransitionFinished = true;
    let isHideNote;
    let rotate;
    let focusedNote;
    let removeDrag;
    let transitionEvent;
    const showUserNote = (noteInfo) => {
        let {i, note, userNote, updateBtn} = noteInfo;

        if(noteInfo != focusedNote && isTransitionFinished){
            isTransitionFinished = false;
            isHideNote = false;
            hideUserNote();
            focusedNote = noteInfo;
            
            let cloudIndex = Math.floor(i / 2);
            if(i >= userNotes.length - 2){
                cloudIndex = cloudHeaders.length - 1;
            }else if(userNotes.length % 2 != 0 && note.parentElement == rightNotesContainer){
                cloudIndex++;
            }

            const focusedCloud = cloudHeaders[cloudIndex];
            focusedNote.cloud = focusedCloud;
            
            userNote.name = note.children[0];
            userNote.note = focusedCloud.children[0];
            userNote.note.value = userNote.note;

            note.classList.add('active');
            focusedCloud.classList.add('translate');   
            
            focusedCloud.addEventListener('mousedown', checkIfHideable);
            window.addEventListener('mousedown', hideUserNoteEvent);
            
            removeDrag = dragElement({target:focusedCloud.children[1], dragCallback:addParentShadow, closeCallback:resetHeader});                
            transitionEvent = setTimeout(() => {
                isTransitionFinished = true;

                focusedCloud.addEventListener('mouseenter', addShadow)
                updateBtn.addEventListener('mouseover', updateNote);
                
            }, 3000);

            app.setfocusedNote(note);
            rotate = 360;
        }else{
            isHideNote = false;
        }
    }

    const checkIfHideable = () => {
        if(focusedNote.cloud == event.currentTarget){
            isHideNote = false;
        } 
    }

    const hideUserNoteEvent = () => { 
        const target = event.target;
        const parent = target.parentElement;
        const className = parent && parent.className;
        
        if(isHideNote && !className.includes('user-photo')){          
            hideUserNote();
            isTransitionFinished = true;
            clearTimeout(transitionEvent);
        }
        isHideNote = true;
    }

    const hideUserNote = () => {
        if(focusedNote){
            const cloud = focusedNote.cloud;

            cloud.classList.remove('box-shadow');
            cloud.classList.remove('translate');        
            cloud.firstElementChild.classList.remove('active');
            cloud.removeEventListener('mouseenter', addShadow);
            cloud.removeEventListener('mousedown', checkIfHideable);

            focusedNote.note.classList.remove('active');
            focusedNote.updateBtn.removeEventListener('mouseover', updateNote);
            window.removeEventListener('mousedown', hideUserNoteEvent);

            removeDrag();
            app.setfocusedNote(null);

            const draggedStyle = cloud.children[1].style;
            draggedStyle.top = draggedStyle.left = draggedStyle.transition = focusedNote = null; 
        }
    }

    const addShadow = () => {
        focusedNote.cloud.classList.add('box-shadow');
    }

    const addParentShadow = ({node}) => {
        const parent = node.parentElement;
        if(parent.className.includes('box-shadow')) parent.classList.add('box-shadow'); 
    }

    const resetHeader = ({node:header, offsetLeft, offsetTop, dragged}) => {
        if(!dragged){
            return;
        }
        
        const textArea = focusedCloud.firstElementChild; 
        const headerWidth = focusedCloud.offsetWidth;
        const headerHeight = focusedCloud.offsetHeight;
        if(Math.abs(offsetLeft) < headerWidth * 0.7 && Math.abs(offsetTop) < headerHeight * 0.7){
            focusedCloud.classList.remove('translate');
            textArea.classList.remove('active');
            
            header.style.transition = '1.5s';
            header.style.left = null;
            header.style.top = null;
        }else if(textArea.className != 'active')
            textArea.className = 'active';
    }

    const updateNote = (e) => {
        const updateNote = {
            id: focusedNote.id,
            name: focusedNote.name.value,
            note: focusedNote.note.value,
        }
        remote.updateNote(updateNote);
        //same catch as submit i da dam else koito izliza prozorec s error ako e drug

        rotateBtn(e.target);
    }

    const rotateBtn = (btn) => {
        btn.style.transform = 'rotate(' + rotate + 'deg)';
        rotate = rotate + 360;
    }

    const resetNotes = () => {
        while (cloudContainer.children.length > 1) {
            cloudContainer.removeChild(cloudContainer.firstChild)
        }

        while (leftNotesContainer.firstChild) {
            leftNotesContainer.removeChild(leftNotesContainer.lastChild)
        }

        while (rightNotesContainer.firstChild) {
            rightNotesContainer.removeChild(rightNotesContainer.lastChild)
        }

        cloudHeaders = [];
    }

    const cloudsFragment = document.createDocumentFragment();
    let cloudHeaders = [cloudHeader];
    const addHeaders = () => {
        const cloudsCount = (notesCount - 4) / 2
        for (let i = 0; i < cloudsCount; i++) {
            const cloudHeaderCopy = cloudHeader.cloneNode(true);
            cloudHeaders.push(cloudHeaderCopy);
            cloudsFragment.appendChild(cloudHeaderCopy);
        }
        cloudHeaders.push(cloudHeader)
        cloudContainer.insertBefore(cloudsFragment, cloudContainer.firstChild);
    }

    const inputNote = document.getElementById('input-note');
    const animationNote = document.getElementById('animation-note');
    const unpopNote = () => {
        inputNote.classList.remove('active');
        inputNote.style.top = null;
        inputNote.style.left = null;
        inputNote.addEventListener('click', popNote);
    }
    
    const popNote = () => {
        inputNote.classList.add('active');
        inputNote.removeEventListener('click', popNote);
    }

    const bindNote = () => {
        event.stopPropagation();
        if(!app.getIsFullMode() && !isNoteViewActivated){
            noteHolders.addEventListener('click', unbindNote);
            animationNote.style.display = 'block';
        }
        unpopNote();
    }

    const unbindNote = (e) => {
        if(animate.getIsBalloonAnimated() || e.currentTarget.id == 'input-note-btn') {
            if(!isNoteViewActivated){
                animationNote.style.display = 'none';
                noteHolders.removeEventListener('click', unbindNote);    
            }
            popNote();
        }
    }

    let isNoteViewActivated;
    const resetNoteView = () => {
        if(!isNoteViewActivated){
            notesCount = delay = 0;
            userNotes = [];
          
            resetNotes();
            unpopNote();
            date.resetDate();
        }
    } 

    const showTopAnimations = () => {
        if (animate.getIsBalloonAnimated()) {
            noteSection.classList.remove('animate');
        }
    }

    const hideTopAnimations = () => {
        if (animate.getIsBalloonAnimated()) {
            noteSection.classList.add('animate');
        }
    }

    const noteHeader = document.getElementById('notes-header');
    const showNoteView = () => {
        if (animate.getIsBalloonAnimated() && !app.getIsFullMode()) {
            noteSection.classList.remove('animate');

            noteHeader.removeEventListener('mouseout', hideTopAnimations);
            noteHeader.removeEventListener('mouseover', showTopAnimations);
            noteHeader.removeEventListener('click', showNoteView);

            isNoteViewActivated = true;
            setTimeout(() => {
                noteSection.classList.add('animated');
            }, 1600);
        }
    }

    const inputName = inputNote.children[0];
    const inputText = inputNote.children[1];
    const submitNote = () => {
        remote.submitNote(inputName.value, inputText.value).then(
            res =>{
                inputName.classList.remove('error');
                inputName.placeholder = '';

                inputName.value = '';
                inputText.value = '';
            }
        ).catch(e => {
            if(e.response.data.message == 'Note must have a name'){
                inputName.classList.add('error');
                inputName.placeholder = 'Note must have a name';
            }
        });
    }
    const checkPointPosition = ({offsetLeft, offsetTop}, closeDrag) => {
        if (offsetLeft > window.innerWidth / 25) {
            date.showMonths();
            closeDrag();
        } else if (offsetTop < -window.innerHeight / 15) {
            date.showYears();
            closeDrag();
        }
    }    
    
    const start = () => {
        dragElement({target: document.getElementById('move-note'), isParent:true});
        dragElement({target:document.getElementById('point'), isTransform: true, dragCallback: checkPointPosition});

        noteHolders.addEventListener('click', unbindNote);
        noteHeader.addEventListener('mouseover', showTopAnimations);
        noteHeader.addEventListener('mouseout', hideTopAnimations);
        noteHeader.addEventListener('click', showNoteView);
        inputNote.addEventListener('click', popNote);
        document.getElementById('submit-btn').addEventListener('click', submitNote);
        document.getElementById('input-note-btn').addEventListener('click', unbindNote)
        document.getElementById('close-btn').addEventListener('click', bindNote)
    }

    return {
        start,
        bindNote,
        unpopNote,
        resetNoteView,
        resetHeader,
        getNotes
    }
})();