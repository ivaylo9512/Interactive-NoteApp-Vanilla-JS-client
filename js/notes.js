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

    const getMonth = (clickedMonth) => {
            if (clickedMonth != '') {
                
                chosenMonth.innerHTML = clickedMonth;
                cloud.src = 'resources/cloud-filled.png';

                let daysCount;
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

                while (daysContainer.firstChild) {
                    daysContainer.removeChild(daysContainer.firstChild);
                }

                for (i = 1; i <= daysCount; i++) {
                    let a = document.createElement('a');
                    a.innerHTML = i;
                    daysContainer.appendChild(a);
                }

                checkDate();

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
        const albumNumber = app.getCurrentAlbumNumber();
        remote.getNotes(date, albumNumber).then(
            res => {
                userNotes = res;
                appendNotes();
            }).catch(e => {
        })
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