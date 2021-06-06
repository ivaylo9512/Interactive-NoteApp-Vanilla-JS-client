const date = (() => {     
    const timelineMonths = document.getElementById('timeline-months');
    const timelineYears = document.getElementById('timeline-years');
   
    const monthNodes = Array.from(timelineMonths.getElementsByTagName('LI'));
    const months = monthNodes.filter((el, index) => index != 6);
    const years = [];
   
    const minYear = 1995;
    const currentYear = new Date().getFullYear();
     
    function appendYears(){
        const yearsFragment = document.createDocumentFragment();

        for(let i = currentYear; i >= minYear; i--){
            const year = document.createElement('LI');
            const yearLabel = document.createElement('P');
            const point = document.createElement('SPAN');
            
            point.className = 'point';
            yearLabel.textContent = i;
            yearLabel.className = 'colorizable';
    
            year.appendChild(yearLabel);
            year.appendChild(point);
            years.push(year);
            yearsFragment.appendChild(year)
        }

        timelineYears.children[0].appendChild(yearsFragment);
    }

    let showMonthsInterval;
    const showMonths = () => {
        if(hideMonthsInterval){
            clearInterval(hideMonthsInterval)
        }
        hideYears();

        showMonthsInterval = function interval(delay, current){
            return setTimeout(() => {
                if(current == monthNodes.length){
                    return;
                }
                const month = monthNodes[current];
                month.classList.remove('reverse-bounce')
                month.classList.add('bounce')

                interval(100, ++current)
            }, delay);
        }(500, 0)
        timelineMonths.classList.add('show');
    }

    let hideMonthsInterval
    const hideMonths = () => {
        if(showMonthsInterval){
            clearInterval(showMonthsInterval)
        }

        let current = monthNodes.length - 1; 
        hideMonthsInterval = setInterval(() => {
            if(current < 0){
                clearInterval(hideMonthsInterval)
                timelineMonths.classList.remove('show');
                return;
            }
            const month = monthNodes[current];
            month.classList.remove('bounce');
            month.classList.add('reverse-bounce');

            current--;
        }, 50)
    }

    let showYersInterval;
    const showYears = () => {
        if(showYersInterval){
            clearInterval(showYersInterval);
        }

        hideMonths();
        timelineYears.classList.add('show');

        showYersInterval = function interval(current, delay){ 
            return setTimeout(() => { 
                if(current < 0){
                    return;
                }
                const year = years[current];
                year.classList.add('bounce');
                year.classList.remove('reverse-bounce');

                interval(--current, 70)
            }, delay)
        }(years.length - 1, 1200)
    }

    let hideYearsInterval;
    const hideYears = () => {
        if(hideYearsInterval){
            clearInterval(hideYearsInterval);
        }

        let current = 0;        
        hideYearsInterval = setInterval(() => {
            if(current == years.length){
                clearInterval(hideYearsInterval);
                timelineYears.classList.remove('show');
                return;
            }
            const year = years[current];
            year.classList.add('reverse-bounce');
            year.classList.remove('bounce');

            current++;
        }, 70);

    }

    const daysContainer = document.getElementById('days-container');

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

    const setDaysCount = (daysCount) => {
        daysContainer.className = 'days-container visible count' + daysCount;
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
        daysContainer.className = 'days-container';

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
