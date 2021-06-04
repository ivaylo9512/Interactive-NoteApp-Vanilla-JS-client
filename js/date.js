const date = (() => {     
    const timelineMonths = document.getElementById('timeline-months');
    const timelineYears = document.getElementById('timeline-years').children[0];
   
    const months = Array.from(timelineMonths.getElementsByTagName('LI'));
    const years = [];
   
    const maxYear = 1995;
    const currentYear = new Date().getFullYear();
    const yearsCount = currentYear - maxYear;
     
    function appendYears(){
        const yearsFragment = document.createDocumentFragment();

        for(let i = 0; i <= yearsCount ; i++){
            const year = document.createElement('LI');
            const yearLabel = document.createElement('P');
            const point = document.createElement('SPAN');
            
            point.className = 'point';
            yearLabel.textContent = maxYear + i;
            yearLabel.className = 'colorizable';
    
            year.appendChild(yearLabel);
            year.appendChild(point);
            years.push(year);
            yearsFragment.appendChild(year)
        }

        timelineYears.appendChild(yearsFragment);
    }

    let isYearsHidden;
    const showMonths = () => {
        isYearsHidden = true;
        hideYears();
        timelineMonths.classList.add('show');
    }

    const hideMonths = () => {
        timelineMonths.classList.remove('show');
    }

    let showInterval;
    const showYears = () => {
        if(hideInterval){
            clearInterval(hideInterval);
        }

        hideMonths();
        timelineYears.classList.add('show');

        let current = years.length - 1;
        showInterval = setInterval(() => { 
            if(current < 0){
                clearInterval(showInterval);
                return;
            }
            const year = years[current];
            year.classList.add('bounce-year');
            year.classList.remove('reverse-year');

            current--;
        }, 70)
    }

    let hideInterval;
    const hideYears = () => {
        if(showInterval){
            clearInterval(showInterval);
        }

        let current = 0;        
        hideInterval = setInterval(() => {
            if(current == years.length){
                clearInterval(hideInterval);
                timelineYears.classList.remove('show');
                return;
            }
            const year = years[current];
            year.classList.add('reverse-year');
            year.classList.remove('bounce-year');

            current++;
        }, 70);

    }

    const daysContainer = document.getElementById('days');

    const chosenMonth = document.getElementById('chosen-month');
    const chosenYear = document.getElementById('chosen-year');
    const chosenDay = document.getElementById('chosen-day');

    let day, 
        year, 
        month;

    let monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const setMonth = (monthIndex, monthName) => {
        chosenMonth.textContent = monthName;
        month = monthIndex + 1;

        setDaysCount(monthsDays[monthIndex]);
        checkDate();
    }

    const setDaysCount = () => {
        daysContainer.className = 'days visible count' + daysCount;
    }

    const setYear = (clickedYear) => {
        year = clickedYear;
        chosenYear.textContent = clickedYear;
        isYearsHiding = true;
        
        hideYears();
        showMonths();
        checkDate();
    }

    function setDay() {
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
            notes.getNotes(date);
        }
    }

    const resetDate = () => {
        day = year = month = null;
        chosenMonth.textContent = '';
        chosenYear.textContent = '';
        chosenDay.textContent = '';

        hideYears();
        hideMonths();
    }
    
    const initialize = () => {
        appendYears()
        months.forEach(month => month.addEventListener('click',() => setMonth(months.indexOf(month), month.children[0].textContent)));
        years.forEach(year => year.addEventListener('click', () => setYear(year.children[0].textContent)));
        daysContainer.addEventListener('click', setDay);  
    }

    return {
        showMonths,
        showYears,
        resetDate,
        initialize
    }
})();
