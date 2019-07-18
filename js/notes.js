const notes = (() => {
    let cloudsAnimated = false;

    const timelineMonths = document.getElementById('timeline-months');
    const timelineYears = document.getElementById('timeline-years');
    const months = Array.from(timelineMonths.getElementsByTagName('LI'));

    const setCloudsAnimated = () => {
        cloudsAnimated = true;
    }

    const maxYear = 1995;
    const currentYear = new Date().getFullYear();
    const yearsCount = currentYear - maxYear;
    const years = [];
    for(let i = 0; i <= yearsCount ; i++){
        const year = document.createElement('LI');
        const yearLabel = document.createElement('P');
        const point = document.createElement('SPAN');
        point.className = 'point';
        yearLabel.innerHTML = maxYear + i;

        year.appendChild(yearLabel);
        year.appendChild(point);
        years.push(year);
        timelineYears.children[0].appendChild(year);
        
        if(i < yearsCount - 7){
            year.style.marginTop = '-69px';
        }
        if(i == yearsCount - 7){
            year.style.marginTop = '-49px';
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
                
                chosenMonth.innerHTML = clickedMonth;
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

    const resetDays = () => {
        while (daysContainer.firstChild) {
            daysContainer.removeChild(daysContainer.firstChild);
        }

        for (i = 1; i <= daysCount; i++) {
            let a = document.createElement('a');
            a.innerHTML = i;
            daysContainer.appendChild(a);
        }
    }
    const getYear = (clickedYear) => {

            year = clickedYear;
            chosenYear.innerHTML = clickedYear;
            cloud2.src = 'resources/cloud-filled.png';

            yearsHiding = true;
            hideYears();
            showMonths();

            checkDate();
    }

    function getDay() {
        if (event.target.tagName == 'A') {
            cloud1.src = 'resources/cloud-filled.png';
            day = event.target.innerHTML;
            chosenDay.innerHTML = day;

            checkDate();
        }
    }

    const checkDate = () => {
        if (month && year && day) {
            month = month.length > 1 ? month : '0' + month;
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

    const body = document.body;
    const playMode = document.getElementById('play-mode');

    const cloudContainer = document.getElementById('cloud-headers');
    const cloudHeader = document.getElementById('cloud-header');
    const leftNotesContainer = document.getElementById('left-notes-container');
    const rightNotesContainer = document.getElementById('right-notes-container');

    const leftNotesFragment = document.createDocumentFragment();
    const rightNotesFragment = document.createDocumentFragment();

    let isTopNote = false;
    let delay = 0;
    const appendNotes = () => {
        let notesCount = userNotes.length;
        delay = notesCount * 0.2;
        resetNotes();

        addBuffers(notesCount);
        window.scrollTo(0, body.scrollHeight - 2749);

        const noteContainer = createNote();

        userNotes.forEach((userNote, i) => {
            const containerCopy = noteContainer.cloneNode(true);
            const note = containerCopy.children[0];
            const noteText = note.children[0];
            const noteName = note.children[2];
            
            noteText.innerHTML = userNote.note;
            noteName.value = userNote.name;
            note.id = userNote.id + 'note';

            containerCopy.style.animationDelay = delay + 's';
            noteText.style.marginTop = isTopNote ? '38px' : '-366px';   

            delay -= 0.2;
            if(i % 2 == 0) {
                noteText.style.marginLeft = '280.5px';
                leftNotesFragment.appendChild(containerCopy);
            }else{
                isTopNote = !isTopNote;
                noteText.style.marginLeft = '-401.5px';
                rightNotesFragment.appendChild(containerCopy);
            }
        })



        rightNotesContainer.appendChild(rightNotesFragment);
        leftNotesContainer.appendChild(leftNotesFragment);
        
    }

    const resetNotes = () => {
        while (cloudContainer.children.length > 1) {
            cloudContainer.removeChild(cloudContainer.firstChild)

        }
        while (playMode.firstChild.className == 'buffer') {
            playMode.removeChild(playMode.firstChild)
        }

        while (leftNotesContainer.lastChild.id == 'user-note-container') {
            leftNotesContainer.removeChild(leftNotesContainer.lastChild)
        }
        while (rightNotesContainer.lastChild.id == 'user-note-container') {
            rightNotesContainer.removeChild(rightNotesContainer.lastChild)
        }

        userNotes.length > 0 ? cloudHeader.style.marginBottom = '150px' : cloudHeader.style.marginBottom = '0px';
        
    }

    const createNote = () =>{
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

        const noteUpdateButton = document.createElement('button');
        noteUpdateButton.className = 'note-update-button';
        noteUpdateButton.id = 'note-update-button';

        note.appendChild(noteInput);
        note.appendChild(noteUpdateButton);
        note.appendChild(noteName);
        userNoteContainer.appendChild(note);

        return userNoteContainer;
    }

    const updateNote = () => {
        const id = userNotes[i]['id'],
            name = noteName.value,
            note = noteInput.value,
            owner = userNotes[i]['owner'],
            date = userNotes[i]['date']

        const updateNote = {
            id,
            name,
            note,
            owner,
            date
        }
        remote.updateNote(updateNote).then(
            res => {

            }
        )
        updateButton.style.transform = "rotate(" + rotate + "deg)";
        rotate = rotate + 360;
    }

    const bufferFragment = document.createDocumentFragment();
    const cloudsFragment = document.createDocumentFragment();
    let buffers = [];

    const addBuffers = (notesCount) => {
        buffers = [];

        if(notesCount > 0){
            const buffer = document.createElement('div');
            buffer.className = 'buffer';
            buffer.style.height = '210px';
            bufferFragment.appendChild(buffer);

            if(notesCount > 4){
                for (let i = 0; i < notesCount  / 4; i++) {
                    const bufferCopy = buffer.cloneNode(true);
                    const cloudHeaderCopy = cloudHeader.cloneNode(true);
                    
                    bufferCopy.style.height = '400px';                    
                    cloudHeader.style.marginBottom = '120px';

                    cloudsFragment.appendChild(cloudHeaderCopy);
                    bufferFragment.appendChild(bufferCopy);
                }
            }
        }

        playMode.insertBefore(bufferFragment, playMode.firstChild);
        cloudContainer.insertBefore(cloudsFragment, cloudContainer.firstChild);
    }


    months.forEach(month => month.addEventListener('click',() => getMonth(month.children[0].innerHTML)));
    years.forEach(year => year.addEventListener('click', () => getYear(year.children[0].innerHTML)));
    daysContainer.addEventListener('click', getDay);
    
    return {
        setCloudsAnimated,
        showMonths,
        showYears
    }
})();