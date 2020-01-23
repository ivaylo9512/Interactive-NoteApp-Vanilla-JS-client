const notes = (() => {

    const timelineMonths = document.getElementById('timeline-months');
    const timelineYears = document.getElementById('timeline-years').children[0];
    const months = Array.from(timelineMonths.getElementsByTagName('LI'));

    const maxYear = 1995;
    const currentYear = new Date().getFullYear();
    const yearsCount = currentYear - maxYear;
    
    const yearsFragment = document.createDocumentFragment();
    const years = [];
    for(let i = 0; i <= yearsCount ; i++){
        const year = document.createElement('LI');
        const yearLabel = document.createElement('P');
        const point = document.createElement('SPAN');
        point.className = 'point';
        yearLabel.textContent = maxYear + i;

        year.appendChild(yearLabel);
        year.appendChild(point);
        years.push(year);
        yearsFragment.appendChild(year)
        
        if(i < yearsCount - 7) year.style.marginTop = '-69px';
        else if(i == yearsCount - 7) year.style.marginTop = '-32px';
    }
    timelineYears.appendChild(yearsFragment);

    let slideYear = yearsCount - 7;
    const slideYears = (pos) => {
        const currentYear = years[slideYear];
        yearMargin = parseFloat(window.getComputedStyle(currentYear).marginTop);
        const nextMargin = yearMargin - pos;

        if(slideYear == yearsCount - 7 && nextMargin < -32){
            currentYear.style.marginTop = '-32px';
            return;
        }
        if(slideYear == 0 && nextMargin > 32){
            currentYear.style.marginTop = '32px'
            return;
        }

        if(nextMargin > 0 && slideYear != 0){
            currentYear.style.marginTop = '0px';
            slideYear--;
        }else if(nextMargin < -69){
            currentYear.style.marginTop = '-69px';
            slideYear++;
        }else{
            currentYear.style.marginTop = nextMargin + 'px';
        }
    }

    yearsHiding = false;
    const showMonths = () => {
        yearsHiding = true;
        hideYears();
        timelineMonths.classList.add('show');
    }

    const hideMonths = () => {
        timelineMonths.classList.remove('show');
    }

    const showYears = () => {
        yearsHiding = false;
        hideMonths();

        let current = years.length - 1;
        showLoop()
        function showLoop(){

            setTimeout(() => { 
                if(current < 0 || yearsHiding){
                    return;
                }
                years[current].style.opacity = '1';
                current--;
                showLoop();
            }, 70)

        }
    }

    const hideYears = () => {

        let current = 0;        
        hideLoop();
        function hideLoop(){

            setTimeout(() => { 
                if(current == years.length || !yearsHiding){
                    return;
                }
                years[current].style.opacity = '0';
                current++;
                hideLoop();
            }, 70)

        }
    }

    const daysContainer = document.getElementById('days');

    const chosenMonth = document.getElementById('chosen-month');
    const chosenYear = document.getElementById('chosen-year');
    const chosenDay = document.getElementById('chosen-day');

    let day;
    let year;
    let month;
    let daysCount;

    const getMonth = (clickedMonth) => {
            if (clickedMonth != '') {
                
                chosenMonth.textContent = clickedMonth;

                switch (clickedMonth) {
                    case 'January':
                        month = 1;
                        daysCount = 31;
                        break;
                    case 'February':
                        month = 2;
                        daysCount = 28;
                        break;
                    case 'March':
                        month = 3;
                        daysCount = 31;
                        break;
                    case 'April':
                        month = 4;
                        daysCount = 30;
                        break;
                    case 'May':
                        month = 5;
                        daysCount = 31;
                        break;
                    case 'June':
                        month = 6;
                        daysCount = 30;
                        break;
                    case 'July':
                        month = 7;
                        daysCount = 31;
                        break;
                    case 'August':
                        month = 8;
                        daysCount = 31;
                        break;
                    case 'September':
                        month = 9;
                        daysCount = 30;
                        break;
                    case 'October':
                        month = 10;
                        daysCount = 31;
                        break;
                    case 'November':
                        month = 11;
                        daysCount = 30;
                        break;
                    case 'December':
                        month = 12;
                        daysCount = 31;
                        break;
                }

                resetDays();
                checkDate();
            }
    }

    const dayNode = document.createElement('a');
    const daysFragment = document.createDocumentFragment();
    const resetDays = () => {
        while (daysContainer.firstChild) {
            daysContainer.removeChild(daysContainer.firstChild);
        }

        for (i = 1; i <= daysCount; i++) {
            const dayCopy = dayNode.cloneNode(true);
            dayCopy.textContent = i;

            daysFragment.appendChild(dayCopy);
        }
        daysContainer.appendChild(daysFragment);

    }

    const getYear = (clickedYear) => {

            year = clickedYear;
            chosenYear.textContent = clickedYear;
            yearsHiding = true;
            hideYears();
            showMonths();

            checkDate();
    }

    function getDay() {
        if (event.target.tagName == 'A') {
            day = event.target.textContent;
            chosenDay.textContent = day;

            checkDate();
        }
    }

    const checkDate = () => {
        if (month && year && day) {
            month = month.toString().length > 1 ? month : '0' + month;
            day = day.length > 1 ? day : '0' + day;

            let date = year + '-' + month + '-' + day;
            getNotes(date);
        }
    }

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

    const body = document.body;

    const noteSection = document.getElementById('note-section');
    const leftNotesContainer = document.getElementById('left-notes');
    const rightNotesContainer = document.getElementById('right-notes');
    
    const cloudContainer = document.getElementById('cloud-headers');
    const cloudHeader = document.getElementById('cloud-header');
    let headerWidth;
    let headerHeight = cloudHeader.offsetHeight;
    
    const leftNotesFragment = document.createDocumentFragment();
    const rightNotesFragment = document.createDocumentFragment();

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

        container.appendChild(noteName);
        container.appendChild(updateBtn);

        return container;
    })();

    let delay = 0;
    let notesCount = 0;
    const appendNotes = () => {
        isTopNote = false;
        notesCount = userNotes.length;
        delay = notesCount * 0.2;

        noteSection.classList.add('appended');

        resetNotes();
        addHeaders();

        document.body.className == 'full-mode-active' ?
            window.scrollTo(0, body.scrollHeight - 849) :
                window.scrollTo(0, body.scrollHeight - 2749);
                
        userNotes.forEach((userNote, i) => {
            const note = noteContainer.cloneNode(true);
            const noteName = note.children[0];
            const updateBtn = note.children[1];
            
            noteName.value = userNote.name;
            note.id = userNote.id + 'note';

            //TODO:
            userNote.files.forEach(file => 
                note.appendChild(app.findUserPhoto(file.id)));

            note.style.animationDelay = delay + 's';

            delay -= 0.2;
            if(i % 2 == 0) {
                leftNotesFragment.appendChild(note);
            }else{
                rightNotesFragment.appendChild(note);
            }
 
            note.addEventListener('mousedown', () => showUserNote(i, note, userNote, updateBtn));
        })
        rightNotesContainer.appendChild(rightNotesFragment);
        leftNotesContainer.appendChild(leftNotesFragment);
    }

    let rotate;
    let transitionFinished = true;
    let focusedNote;
    let focusedCloud;
    const showUserNote = (index, note, noteInfo, updateBtn) => {
        let removeDrag;
        let draggedCloud;
        let textArea;
        let nameInput;
        if(noteInfo != focusedNote && transitionFinished){
            focusedNote = noteInfo;
            transitionFinished = false;

            let cloudIndex = Math.floor(index / 2);
            if(index >= userNotes.length - 2){
                cloudIndex = cloudHeaders.length - 1;
            }else if(userNotes.length % 2 != 0 && note.parentElement == rightNotesContainer){
                cloudIndex++;
            }

            focusedCloud = cloudHeaders[cloudIndex];
            draggedCloud = cloud.children[1];
            nameInput = note.children[0];

            textArea = cloud.children[0]; 
            textArea.value = noteInfo.note;

            textArea.addEventListener('input', update);
            nameInput.addEventListener('input', update);

            note.classList.add('active');
            cloud.classList.add('translate');        
            setTimeout(() => cloud.classList.add('border-radius'), 0);
            setTimeout(() => {
                transitionFinished = true;

                cloud.addEventListener('mouseover', addShadow, { once: true})
                updateBtn.addEventListener('mouseover', updateNote);
                
                removeDrag = dragElement(draggedCloud);                
                hideUserNote();
            
            }, 3000);
            !headerWidth && (headerWidth = cloud.offsetWidth);
            
            app.setfocusedNote(note);
            rotate = 360;
        }
        
        function hideUserNote(){ 
            window.addEventListener('mousedown',  function hideUserNote(){
                const target = event.target;
                const parent = target.parentElement;
                const className = parent && parent.className;
                
                if(target != note && parent != note && !className.includes('user-photo') && target != draggedCloud && target.tagName != 'TEXTAREA'){
                    cloud.classList.remove('box-shadow');
                    cloud.classList.remove('translate');        
                    cloud.classList.remove('border-radius');
                    cloud.firstElementChild.classList.remove('active');
                    note.classList.remove('active');
                    
                    draggedCloud.style.top = null;
                    draggedCloud.style.left = null;
                    draggedCloud.style.transition = null;

                    focusedNote = null;
                    app.setfocusedNote(null);
                    
                    removeDrag();
                    textArea.removeEventListener('input', update);
                    nameInput.removeEventListener('input', update);
                    cloud.removeEventListener('mouseover', addShadow);
                    updateBtn.removeEventListener('mouseover', updateNote);
                    window.removeEventListener('mousedown', hideUserNote, true);
                }
            }, true);
        }
    }
    const addShadow = () => {
        focusedCloud.classList.add('box-shadow');
    }
    const update = (e) => {
        const target = e.target
        const value = target.value;
        target.tagName == 'TEXTAREA' ? focusedNote.note = value : focusedNote.name = value;
    }
    const resetHeader = (header, offsetLeft, offsetTop) => {
        const cloud = header.parentElement;
        const textArea = cloud.firstElementChild; 
        if(Math.abs(offsetLeft) < headerWidth && Math.abs(offsetTop) < headerHeight){
            cloud.classList.remove('translate');
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
            name: focusedNote.name,
            note: focusedNote.note,
        }
        remote.updateNote(updateNote);

        e.target.style.transform = 'rotate(' + rotate + 'deg)';
        rotate = rotate + 360;
    }

    const resetNotes = () => {
        while (cloudContainer.children.length > 1) {
            cloudContainer.removeChild(cloudContainer.firstChild)
        }

        while (leftNotesContainer.firstChild) {
            leftNotesContainer.removeChild(leftNotesContainer.firstChild)
        }

        while (rightNotesContainer.firstChild) {
            rightNotesContainer.removeChild(rightNotesContainer.firstChild)
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
    const bindNote = () => {
        inputNote.style.display = 'block';
        inputNote.classList.add('inactive');
        inputNote.classList.remove('bounce');    
        inputNote.style.left = null;
        inputNote.style.top = null;
        inputNote.classList.remove('hide');
        inputNote.parentElement.style.display = 'block';
    
    }

    const windowWidth = window.innerWidth;     
    const windowHeight = window.innerWidth;     
    function popNote(e){
        noteAppend(e.currentTarget.id);

        inputNote.style.top = windowHeight / 2 - windowWidth * 0.1325 + animate.getScrollY() + 'px';
        inputNote.style.left = windowWidth / 2 - windowWidth * 0.135 + 'px';
    }

    const unpopNote = () => {
        if(app.isFullMode()){
            bindNote();
        }else{
            noteIsAnimated = false;
            inputNote.style.left = null;
            inputNote.style.top = null;
            inputNote.style.display = 'none';
            animationNote.style.display = 'block';
            noteHolders.addEventListener('click', noteAppend);
        }   
    }

    const hideNote = () => {
        inputNote.style.display = 'none';
    }


    const activateNote = () => {
        inputNote.classList.remove('inactive');
        inputNote.classList.add('bounce');
    }

    const showFullScreenNotes = () => {
        inputNote.style.display = 'none';
        noteSection.style.display = 'block';
        window.scrollTo(0, document.body.scrollHeight);
    }

    const hideFullScreenNotes = () => {
        noteSection.style.display = 'none';     
    }

    let noteViewActivated = false;
    const resetNoteView = () => {
        if(!noteViewActivated){
            daysCount = 0;
            day = null;
            year = null;
            month = null;

            isTopNote = false;
            delay = 0;

            userNotes = [];
            notesCount = 0;
            resetNotes();
            resetDays();

            chosenMonth.textContent = '';
            chosenYear.textContent = '';
            chosenDay.textContent = '';

            hideYears();
            hideMonths();

        }
        noteSection.style.display = 'block'; 

    } 

    let brushAnimated = false;
    let noteIsAnimated = false;
    const setBrushAnimated = () => {
        brushAnimated = true;
    }

    const resetNote = () => {
        noteIsAnimated 
            ? inputNote.style.display = 'block'
            : inputNote.style.display = 'none';
    }

    
    const noteHolders = document.getElementById('note-animation-container');

    const noteAppend = (currentTarget) => {
        
        if ((brushAnimated && event.target.id != 'note-animation-container') || currentTarget == 'input-note-btn') {
            noteIsAnimated = true;
            inputNote.style.display = 'block';
            animationNote.style.display = 'none';
            noteHolders.removeEventListener('click', noteAppend);
        }
    }

    const showTopAnimations = () => {
        if (brushAnimated) {
            noteSection.classList.remove('animate');
        }
    }

    const hideTopAnimations = () => {
        if (brushAnimated) {
            noteSection.classList.add('animate');
        }
    }

    const noteHeader = document.getElementById('notes-header');
    const showNoteView = () => {
        if (brushAnimated && document.body.className != 'full-mode-active') {
            noteSection.classList.remove('animate');

            noteHeader.removeEventListener('mouseout', hideTopAnimations);
            noteHeader.removeEventListener('mouseover', showTopAnimations);
            noteHeader.removeEventListener('click', showNoteView);

            noteViewActivated = true;
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
    
    months.forEach(month => month.addEventListener('click',() => getMonth(month.children[0].textContent)));
    years.forEach(year => year.addEventListener('click', () => getYear(year.children[0].textContent)));
    
    const start = () => {
        noteHolders.addEventListener('click', noteAppend);
        noteHeader.addEventListener('mouseover', showTopAnimations);
        noteHeader.addEventListener('mouseout', hideTopAnimations);
        noteHeader.addEventListener('click', showNoteView);
        inputNote.addEventListener('mousedown', activateNote);
        document.getElementById('submit-btn').addEventListener('click', submitNote);
        document.getElementById('input-note-btn').addEventListener('click', popNote)
        document.getElementById('close-btn').addEventListener('click', unpopNote)
        daysContainer.addEventListener('click', getDay);
    }

    return {
        start,
        showMonths,
        showYears,
        slideYears,
        bindNote,
        hideNote,
        showFullScreenNotes,
        hideFullScreenNotes,
        resetNoteView,
        resetNote,
        setBrushAnimated,
        resetHeader
    }
})();