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
    for(let i = 0; i < yearsCount ; i++){
        const year = document.createElement('LI');
        const yearLabel = document.createElement('P');
        const point = document.createElement('SPAN');
        point.className = 'point';
        yearLabel.innerHTML = maxYear + i;

        year.appendChild(yearLabel);
        year.appendChild(point);
        years.push(year);
        timelineYears.children[0].appendChild(year);
        
        if(i < yearsCount - 8){
            year.style.marginTop = '-69px';
        }
        if(i == yearsCount - 8){
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

    const getMonth = (clickedMonth) => {
            if (clickedMonth != '') {
                
                chosenMonth.innerHTML = clickedMonth;
                cloud.src = 'resources/cloud-filled.png';

                let daysCount;
                switch (clickedMonth) {
                    case 'January':
                        monthNumber = 1;
                        daysCount = 31;
                        break;
                    case 'February':
                        monthNumber = 2;
                        daysCount = 28;
                        break;
                    case 'March':
                        monthNumber = 3;
                        daysCount = 31;
                        break;
                    case 'April':
                        monthNumber = 4;
                        daysCount = 30;
                        break;
                    case 'May':
                        monthNumber = 5;
                        daysCount = 31;
                        break;
                    case 'June':
                        monthNumber = 6;
                        daysCount = 30;
                        break;
                    case 'July':
                        monthNumber = 7;
                        daysCount = 31;
                        break;
                    case 'August':
                        monthNumber = 8;
                        daysCount = 31;
                        break;
                    case 'September':
                        monthNumber = 9;
                        daysCount = 30;
                        break;
                    case 'October':
                        monthNumber = 10;
                        daysCount = 31;
                        break;
                    case 'November':
                        monthNumber = 11;
                        daysCount = 30;
                        break;
                    case 'December':
                        monthNumber = 12;
                        daysCount = 31;
                        break;
                }

                if (showMonth.innerHTML != '' && showYear.innerHTML != '' && showDay.innerHTML != '') {
                    let date = showDay.innerHTML + '-' + monthNumber + '-' + showYear.innerHTML
                    remote.findNoteByDate(date, currentAlbumNumber).then(
                        res => {
                            userNotes = res;
                            appendNotes();
                        }).catch(e => {
                    })
                }

                while (daysContainer.firstChild) {
                    daysContainer.removeChild(daysContainer.firstChild);
                }

                for (i = 1; i <= daysCount; i++) {
                    let a = document.createElement('a');
                    a.innerHTML = i;
                    daysContainer.appendChild(a);
                }
            }
    }
    const getYear = (clickedYear) => {

            chosenYear.innerHTML = clickedYear;
            cloud2.src = 'resources/cloud-filled.png';

            if (showMonth.innerHTML != '' && showYear.innerHTML != '' && showDay.innerHTML != '') {
                let date = showDay.innerHTML + '-' + monthNumber + '-' + showYear.innerHTML
                remote.findNoteByDate(date, currentAlbumNumber).then(
                    res => {
                        userNotes = res;
                        appendNotes();
                    }
                ).catch(e => {
                })
            }
            yearsHiding = true;
            hideYears();
    }

    const getDay = () => {
        if (event.target.tagName == 'A') {

            cloud1.src = 'resources/cloud-filled.png';
            chosenDay.innerHTML = event.target.innerHTML;

            if (showMonth.innerHTML != '' && showYear.innerHTML != '' && showDay.innerHTML != '') {
                let date = showDay.innerHTML + '-' + monthNumber + '-' + showYear.innerHTML
                remote.findNoteByDate(date, currentAlbumNumber).then(
                    res => {
                        userNotes = res;
                        appendNotes();
                    }
                ).catch(e => {
                })
            }
        }
    }

    months.forEach(month => month.addEventListener('mousedown',() => getMonth(month.children[0].innerHTML)))
    years.forEach(year => year.addEventListener('mousedown', () => getYear(year.children[0].innerHTML)));
    daysContainer.addEventListener('mousedown', getDay);
    
    return {
        setCloudsAnimated,
        showMonths,
        showYears
    }
})();