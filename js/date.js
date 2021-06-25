const date = (() => {     
    const timelineMonths = document.getElementById('timeline-months');
    const timelineYears = document.getElementById('timeline-years');
    const timelineYearsList = timelineYears.getElementsByTagName("OL")[0];

    const monthNodes = Array.from(timelineMonths.getElementsByTagName('LI'));
    const months = monthNodes.filter((el, index) => index != 6);
    const years = [];
   
    const minYear = 1995;
    const currentYear = new Date().getFullYear();
     
    const appendYears = () => {
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

    const showMonths = () => {
        if(hideMonthsInterval){
            clearInterval(hideMonthsInterval)
        }
        if(!isHidingMonths){
            return;
        }
        hideYears();
        isHidingMonths = false;
        
        (function showLoop(delay, current){
            return setTimeout(() => {
                if(current == monthNodes.length || isHidingMonths){
                    return;
                }
                const month = monthNodes[current];
                month.classList.remove('reverse-bounce')
                month.classList.add('bounce')

                showLoop(100, ++current)
            }, delay);
        })(500, 0)
        timelineMonths.classList.add('show');
    }

    let hideMonthsInterval;
    let isHidingMonths = true;
    const hideMonths = () => {
        if(isHidingMonths){
            return;
        }
        isHidingMonths = true;
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
        if(hideYearsInterval){
            clearInterval(hideYearsInterval);
        }
        if(!isHidingYears){
            return;
        }

        isHidingYears = false;
        hideMonths();
        timelineYears.classList.add('show');

        const startingIndex = getScrolledYearIndex();
        
        showYersInterval = function interval(current, delay){ 
            return setTimeout(() => { 
                if(current < 0 || isHidingYears){
                    return;
                }
                const year = years[current];
                year.classList.add('bounce');
                year.classList.remove('reverse-bounce');

                interval(--current, 70)
            }, delay)
        }(startingIndex, 400);

        for (let i = startingIndex + 1; i <= years.length - 1; i++) {
            const year = years[i];
            year.classList.add('bounce');
            year.classList.remove('reverse-bounce');
        }
    }

    let hideYearsInterval;
    let isHidingYears = true;
    const hideYears = () => {
        if(showYersInterval){
            clearInterval(showYersInterval);
        }
        if(isHidingYears){
            return;
        }
        isHidingYears = true;
        
        const startingIndex = getScrolledMonthIndex();
        
        let current = startingIndex;
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

        for(let i = startingIndex; i > 0; i--){
            const year = years[current];
            year.classList.add('reverse-bounce');
            year.classList.remove('bounce');
        }
    }

    const getScrolledMonthIndex = () => {
        const liHeight = getLiHeight(timelineYearsList);
        const safeExceed = 2;
        return parseInt(Math.max(timelineYearsList.scrollTop  / liHeight - safeExceed, 0))
    }
    const getScrolledYearIndex = () => {
        const liHeight = getLiHeight(timelineYearsList);
        const scrolledAmount = timelineYearsList.scrollTop + timelineYearsList.clientHeight - timelineYearsList.scrollHeight;

        const safeExceed = 2;
        const yearsLength = years.length - 1;
        const scrolledYears = parseInt(Math.abs(scrolledAmount / liHeight));
        
        return Math.min(yearsLength - scrolledYears + safeExceed, yearsLength);
    }

    const getLiHeight = (list) => {
        const li = list.children[0];
        return li.clientHeight + parseFloat(window.getComputedStyle(li).marginBottom); 
    }

    const daysContainer = document.getElementById('days-container');
    const daysBtn = document.getElementById('days-btn');
    const chosenMonth = document.getElementById('chosen-month');
    const chosenYear = document.getElementById('chosen-year');
    const chosenDay = document.getElementById('chosen-day');

    let day, 
        year, 
        month;

    let monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const setMonth = (monthIndex) => {
        const pIndex = monthIndex < 6 ? 1 : 0;
        chosenMonth.textContent = event.currentTarget.children[pIndex].textContent;
        
        month = monthIndex + 1;
        setDaysCount(monthsDays[monthIndex]);
        daysBtn.classList.add('active');
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

    const setDay = () => {
        if (event.target.tagName == 'A') {
            day = event.target.textContent;
            chosenDay.textContent = day;
            daysBtn.classList.remove('active');
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
        months.forEach(month => month.addEventListener('click',() => setMonth(months.indexOf(month))));
        years.forEach(year => year.addEventListener('click', () => setYear(year.children[0].textContent)));
        daysContainer.addEventListener('click', setDay);  
        daysBtn.addEventListener('click', () => daysBtn.classList.toggle('active'));

    }

    return {
        showMonths,
        showYears,
        resetDate,
        initialize
    }
})();
