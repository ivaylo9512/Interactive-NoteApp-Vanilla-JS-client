const app = (() =>{

    let currentAlbum;
    let albumImages = [];
    const getAlbumImages = (e) => {
        const id = e.target.id

        remote.getAlbumImages(id)
            .then(function (response) {
                currentAlbum = id
                albumImages = response.data
            })
            .catch(function (error) {
            })
    }
    const animateAlbumPhotos = (currentAlbum) => {
        for (let i = 0; i < appendedPhotos.length; i++) {
            appendedPhotos[i].style.display = 'none';
            if(i < currentAlbum.length){
                setTimeout(() => {
                    appendedPhotos[i].style.display = 'block';
                    appendedPhotos[i].style.opacity = 1;
                    appendedPhotos[i].id = currentAlbum[i]['id'];
                    appendedPhotos[i].src = currentAlbum[i]['location'];
                    appendedPhotos[i].style.width = currentAlbum[i]['width'];
                    appendedPhotos[i].style.transform = 'rotate(' + currentAlbum[i]['rotation'] + 'deg)';
                    appendedPhotos[i].style.left = currentAlbum[i]['left'];
                    appendedPhotos[i].style.top = currentAlbum[i]['top'];

                    let noteId = currentAlbum[i]['noteId'] + "note";
                    if(currentAlbum[i]['noteId'] != null){
                        appendedPhotos[i].style.display = "none";
                    }

                    if(appendedPhotos[i].parentElement.className == "user-note" && appendedPhotos[i].parentElement.id != noteId){
                        appendedPhotosSection.appendChild(appendedPhotos[i]);
                    }

                    if(document.getElementById(noteId)){
                        document.getElementById(noteId).appendChild(appendedPhotos[i]);
                    }
        
                    setTimeout(() => {
                        currentAlbum[i]['left'] = window.getComputedStyle(appendedPhotos[i]).left;
                        currentAlbum[i]['top'] = window.getComputedStyle(appendedPhotos[i]).top;
                    }, 40)
                }, i * 80)
            }
        }
    }
    const start = () => {
        window.scrollTo(0, document.body.scrollHeight);
        window.onbeforeunload = function () {
            window.scrollTo(0, document.body.scrollHeight);
        }

        setTimeout(() => {
            document.getElementById("pink-bulb").src = "resources/pink-bulb.gif";
            document.getElementById("blue-bulb").src = "resources/blue-bulb.gif";            
        }, 500);

        animate.createCircles();
        window.addEventListener('scroll', animate.decideEvent);
        window.addEventListener("wheel", animate.setDelta, {passive: false});

        document.getElementById('album-btns').addEventListener('mousedown', getAlbumImages);

        colorize.getElements();
        document.getElementById('play').addEventListener('mousedown', colorize.manageListeners);
        document.getElementById('pink-bulb-btn').addEventListener("mousedown", () => colorize.setCurrentColor('#E2007A'));
        document.getElementById("blue-bulb-btn").addEventListener("mousedown", () => colorize.setCurrentColor('#7398CA'));

        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        loginBtn.addEventListener('mousedown', () => profile.changeInputView(loginBtn, registerBtn));
        registerBtn.addEventListener('mousedown', () => profile.changeInputView(registerBtn, loginBtn));
        document.getElementById('user-btn').addEventListener('click', profile.userAction);

        noteAnimation = document.getElementById('note-animation');
        noteAnimation.addEventListener('mouseover', animate.noteAnimation);
        noteAnimation.addEventListener('mousedown', animate.noteAppend);
    }

    return {
        start
    }
})();
app.start();

