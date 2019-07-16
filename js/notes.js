const notes = (() => {
    let cloudsAnimated = false;

    const timelineMonths = document.getElementById('timeline-months')
    const months = timelineMonths.getElementsByTagName('LI');

    const setCloudsAnimated = () => {
        cloudsAnimated = true;
    }

    const showMonths = () => {
        timelineMonths.classList.add('show');
    }
    const hideMonths = () => {
        timelineMonths.classList.remove('show');
    }

    return {
        setCloudsAnimated,
        showMonths
    }
})();