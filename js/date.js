const date = (() => {     
    const timelineMonths = document.getElementById('timeline-months');
   
    const months = Array.from(timelineMonths.getElementsByTagName('LI'));
    const years = [];
   
    const maxYear = 1995;
    const currentYear = new Date().getFullYear();
    const yearsCount = currentYear - maxYear;
     
    function appendYears(){
        const timelineYears = document.getElementById('timeline-years').children[0];
        const yearsFragment = document.createDocumentFragment();

        for(let i = 0; i <= yearsCount ; i++){
            const year = document.createElement('LI');
            const yearLabel = document.createElement('P');
            const point = document.createElement('SPAN');
            
            point.className = 'point';
            yearLabel.textContent = maxYear + i;
            yearsLabel.className = 'colorizable';
    
            year.appendChild(yearLabel);
            year.appendChild(point);
            years.push(year);
            yearsFragment.appendChild(year)
            
            if(i < yearsCount - 7) year.style.marginTop = '-69px';
            else if(i == yearsCount - 7) year.style.marginTop = '-32px';
        }

        timelineYears.appendChild(yearsFragment);
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

    let isYearsHidden;
    const showMonths = () => {
        isYearsHidden = true;
        hideYears();
        timelineMonths.classList.add('show');
    }

    const hideMonths = () => {
        timelineMonths.classList.remove('show');
    }

    const showYears = () => {
        isYearsHidden = false;
        hideMonths();
        timelineYears.classList.add('show');

        let current = years.length - 1;
        const interval = setInterval(() => { 
            if(current < 0 || isYearsHidden){
                clearInterval(interval);
                return;
            }
            const year = years[current];
            year.classList.add('bounce-year');
            year.classList.remove('reverse-year');

            current--;
        }, 70)
    }

    const hideYears = () => {
        let current = 0;        
        const interval = setInterval(() => {
            if(!isYearsHidden){
                clearInterval(interval);
                return;
            }else if(current == years.length){
                clearInterval(interval);
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
            if (clickedMonth != '') {
                chosenMonth.textContent = monthName;
                month = monthIndex + 1;

                setDaysCount(monthsDays[monthIndex]);
                checkDate();
            }
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
