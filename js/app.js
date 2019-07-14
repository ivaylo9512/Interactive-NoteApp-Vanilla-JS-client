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

    const start = () => {
        window.scrollTo(0, document.body.scrollHeight);
        window.onbeforeunload = function () {
            window.scrollTo(0, document.body.scrollHeight);
        }

        animate.createCircles();
        window.addEventListener('scroll', animate.decideEvent);
        window.addEventListener("wheel", animate.setDelta);

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

        setTimeout(() => {
            document.getElementById("pink-bulb").src = "resources/pink-bulb.gif";
            document.getElementById("blue-bulb").src = "resources/blue-bulb.gif";            
        }, 500);

    }

    return {
        start
    }
})();
app.start();

