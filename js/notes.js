const notes = (() => {
    let cloudsAnimated = false;

    const setCloudsAnimated = () => {
        cloudsAnimated = true;
    }

    return {
        setCloudsAnimated
    }
})();