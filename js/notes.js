const notes = (() => {
    let cloudsAnimated = false;

    const timelineMonths = document.getElementById('timeline-months');
    const timelineYears = document.getElementById('timeline-years');
    const months = timelineMonths.getElementsByTagName('LI');

    const setCloudsAnimated = () => {
        cloudsAnimated = true;
    }

    const showMonths = () => {
        hideYears();
        timelineMonths.classList.add('show');
    }
    const hideMonths = () => {
        timelineMonths.classList.remove('show');
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

    const showYears = () => {
        hideMonths();
        years.forEach((year, i) => {
            setTimeout(() => years[years.length - 1 - i].style.opacity = '1', 70 * i)
        })
    }

    const hideYears = () => {
        years.forEach((year, i) => {
            setTimeout(() => year.style.opacity = '0', 70 * i)
        })
}

    return {
        setCloudsAnimated,
        showMonths,
        showYears
    }
})();