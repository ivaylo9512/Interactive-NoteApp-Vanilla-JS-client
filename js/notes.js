const notes = (() => {

    const timelineMonths = document.getElementById('timeline-months');
    const timelineYears = document.getElementById('timeline-years');
    const months = Array.from(timelineMonths.getElementsByTagName('LI'));
    let noteViewActivated = false;

    const maxYear = 1995;
    const currentYear = new Date().getFullYear();
    const yearsCount = currentYear - maxYear;
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
        timelineYears.children[0].appendChild(year);
        
        if(i < yearsCount - 7) year.style.marginTop = '-69px';
        else if(i == yearsCount - 7) year.style.marginTop = '-32px';
    }

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
                cloud.src = 'resources/cloud-filled.png';

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
            cloud2.src = 'resources/cloud-filled.png';

            yearsHiding = true;
            hideYears();
            showMonths();

            checkDate();
    }

    function getDay() {
        if (event.target.tagName == 'A') {
            cloud1.src = 'resources/cloud-filled.png';
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
        })
    }

    const updateNote = (e) => {
        const userNote = focusedNote.children[0];
            noteText = userNote.children[0],
            noteName = userNote.children[2],
            name = noteName.value,
            note = noteText.value
            
        const id = userNote.id.substring(0, userNote.id.length - 4);    
        const updateNote = {
            id,
            name,
            note,
        }
        remote.updateNote(updateNote);

        e.target.style.transform = 'rotate(' + rotate + 'deg)';
        rotate = rotate + 360;
    }

    const body = document.body;
    const buffersContainer = document.getElementById('buffers-container');

    const noteSection = document.getElementById('note-section');
    const cloudContainer = document.getElementById('cloud-headers');
    const cloudHeader = document.getElementById('cloud-header');
    const leftNotesContainer = document.getElementById('left-notes');
    const rightNotesContainer = document.getElementById('right-notes');

    const leftNotesFragment = document.createDocumentFragment();
    const rightNotesFragment = document.createDocumentFragment();

    const noteContainer = (() =>{
        const userNoteContainer = document.createElement('div');
        userNoteContainer.className = 'user-note-container';
        userNoteContainer.id = 'user-note-container';

        const note = document.createElement('button');
        note.className = 'user-note';

        const noteInput = document.createElement('textarea');
        noteInput.name = 'user-note-input';
        noteInput.id = 'user-note-input';

        const noteName = document.createElement('input');
        noteName.name = 'user-note-name';
        noteName.id = 'user-note-name';

        const updateBtn = document.createElement('button');
        updateBtn.className = 'note-update-btn';
        updateBtn.id = 'note-update-btn';

        note.appendChild(noteInput);
        note.appendChild(updateBtn);
        note.appendChild(noteName);
        userNoteContainer.appendChild(note);

        return userNoteContainer;
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
            const containerCopy = noteContainer.cloneNode(true);
            const note = containerCopy.children[0];
            const noteText = note.children[0];
            const updateBtn = note.children[1];
            const noteName = note.children[2];
            
            noteText.textContent = userNote.note;
            noteName.value = userNote.name;
            note.id = userNote.id + 'note';

            userNote.files.forEach(file => 
                note.appendChild(app.findUserPhoto(file.id)));

            containerCopy.style.animationDelay = delay + 's';
            noteText.style.marginTop = (i == 0 && userNotes.length > 2) || (i == 1 && userNotes.length > 3) ? '41px' : '-366px';   

            delay -= 0.2;
            if(i % 2 == 0) {
                noteText.style.marginLeft = '280.5px';
                leftNotesFragment.appendChild(containerCopy);
            }else{
                noteText.style.marginLeft = '-401.5px';
                rightNotesFragment.appendChild(containerCopy);
            }

            updateBtn.addEventListener('mouseover', updateNote);
            containerCopy.addEventListener('mousedown', () => showUserNote(containerCopy));
        })
        rightNotesContainer.appendChild(rightNotesFragment);
        leftNotesContainer.appendChild(leftNotesFragment);
        
    }
    
    let rotate;
    let focusedNote;
    const showUserNote = (note) => {
        focusedNote = note;
        focusedNote.classList.add('active');
        app.setfocusedNote(focusedNote);
        rotate = 360;
        window.addEventListener('mousedown',  () => hideUserNote(), {
            once: true,
            passive: true,
            capture: true
        });
    } 
    // TODO:
    const hideUserNote = () => { 
        const parent = event.target.parentElement;
        const className = parent && parent.className;
        if(className.includes('user-photo')){
            window.addEventListener('mousedown',  () => hideUserNote(), {
                once: true,
                passive: true,
                capture: true
            }); 
        }else{
            focusedNote.classList.remove('active');
            focusedNote = null;
            app.setfocusedNote(null);
        }
    }

    const resetNotes = () => {
        while (cloudContainer.children.length > 1) {
            cloudContainer.removeChild(cloudContainer.firstChild)

        }
        
        while (buffersContainer.firstChild) {
            buffersContainer.removeChild(buffersContainer.firstChild)
        }

        while (leftNotesContainer.firstChild) {
            leftNotesContainer.removeChild(leftNotesContainer.firstChild)
        }

        while (rightNotesContainer.firstChild) {
            rightNotesContainer.removeChild(rightNotesContainer.firstChild)
        }

        userNotes.length > 0 ? cloudHeader.style.marginBottom = '150px' : cloudHeader.style.marginBottom = '0px';
        
    }

    const cloudsFragment = document.createDocumentFragment();

    const addHeaders = () => {
        const cloudsCount = (notesCount - 4) / 2
            for (let i = 0; i < cloudsCount; i++) {
                const cloudHeaderCopy = cloudHeader.cloneNode(true);
                cloudsFragment.appendChild(cloudHeaderCopy);
        }

        cloudContainer.insertBefore(cloudsFragment, cloudContainer.firstChild);
    }

    const inputNote = document.getElementById('input-note');
    const bindNote = () => {
        inputNote.style.display = 'block';
        inputNote.classList.add('inactive');
        inputNote.classList.remove('bounce');    
        inputNote.style.left = null;
        inputNote.style.top = null;
        inputNote.classList.remove('hide');
        inputNote.parentElement.style.display = 'block';
    
    }

    function popNote(e){
        noteAppend(e.currentTarget.id);

        const windowWidth = window.innerWidth;     
        inputNote.style.top = window.innerHeight / 2 - windowWidth * 0.1325 + window.pageYOffset + 'px';
        inputNote.style.left = window.innerWidth / 2 - windowWidth * 0.135 + 'px';
    }

    const unpopNote = () => {
        if(app.isFullMode()){
            bindNote();
        }else{
            noteIsAnimated = false;
            inputNote.style.left = null;
            inputNote.style.top = null;
            inputNote.style.display = 'none';
            noteHolders.src = 'resources/note-animation-static.png';
            noteHolders.addEventListener('mouseover', noteAnimation);
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
        buffersContainer.style.display = 'block';

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

    
    const noteHolders = document.getElementById('note-animation');

    const noteAnimation = () => {
        if (brushAnimated) {
            noteHolders.src = 'resources/note-animation.gif';
        }
    }

    const noteAppend = (target) => {
        if (brushAnimated || target == 'input-note-btn') {
            noteIsAnimated = true;
            inputNote.style.display = 'block';
            noteHolders.src = 'resources/note-animation-static-open.png';
            noteHolders.removeEventListener('mouseover', noteAnimation);
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
            noteHolders.classList.remove('show');

            noteHeader.removeEventListener('mouseout', hideTopAnimations);
            noteHeader.removeEventListener('mouseout', showTopAnimations);

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
    daysContainer.addEventListener('click', getDay);
    
    const start = () => {
        noteHolders.addEventListener('mouseover', noteAnimation);
        noteHolders.addEventListener('click', noteAppend);
        noteHeader.addEventListener('mouseover', showTopAnimations);
        noteHeader.addEventListener('mouseout', hideTopAnimations);
        noteHeader.addEventListener('click', showNoteView);
        inputNote.addEventListener('mousedown', activateNote);
        document.getElementById('submit-btn').addEventListener('click', submitNote);
        document.getElementById('input-note-btn').addEventListener('click', popNote)
        document.getElementById('close-btn').addEventListener('click', unpopNote)
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
    }
})();