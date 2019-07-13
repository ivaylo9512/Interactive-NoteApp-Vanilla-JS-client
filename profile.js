const profile = (() =>{

    let labels = document.getElementById('labels-container').children;
    let inputs = document.getElementById('inputs-container').children;
    let profilePhoto = document.getElementById("choosen-image");
    let userBtn = document.getElementById('user-btn');

    let isAuth = () => localStorage.getItem('Authorization') != null;
    if (isAuth()) {
        inputs[0].value = localStorage.getItem('firstName')
        inputs[1].value = localStorage.getItem('lastName');
        inputs[2].value = localStorage.getItem('age');
        inputs[3].value = localStorage.getItem('country');
        profilePhoto.src = localStorage.getItem('profilePic') != 'undefined' ? localStorage.getItem('profilePic') : '#'; 

        userBtn.style.display = "block";
        userBtn.innerHTML = "logout";
    }

    const labelsTexts = [
        ['Username', 'Password'], 
        ['Username', 'Password', 'Repeat'],
        ['First Name', 'Last Name', 'Age', 'Country'],
    ];
    
    let currentLabels;
    let currentBtn;
    const changeInputView = (newState, oldState) => {
        oldState.classList.remove('active');
        newState.classList.add('active');
        
        userBtn.style.display = 'block';
        userBtn.innerHTML = newState.id == 'login-btn' ? 'login' : 'next';
        currentLabels = newState.id == 'login-btn' ? labelsTexts[0] : labelsTexts[1];
        currentBtn = newState;

        resetInputs();
    }

    const resetInputs = () => {
        for (let i = 0; i < 4; i++) {
            if (currentLabels.length <= i) {
                labels[i].style.display = 'none';
                inputs[i].style.display = 'none';
            } else {
                labels[i].style.display = 'block';
                inputs[i].style.display = 'block';
                labels[i].innerHTML = currentLabels[i];
                inputs[i].value = '';
                inputs[i].type = 'text';
    
                if (currentLabels[i] == 'Password' || currentLabels[i] == 'Repeat') {
                    inputs[i].type = 'password'
                }
            }
        }
    }

    const userAction = (e) => {
        e.preventDefault();
        switch(userBtn.innerHTML){
            case 'login':
                login();
                break;
            case 'register':
                break;
            case 'logout':
                logout();
                break;  
            case 'next':
                nextInputs();
                break;    
        }
        
    }

    const logout = () => {
        localStorage.removeItem('Authorization');
        
        profilePhoto.src = '';
        userBtn.style.display =  'none';
        userBtn.innerHTML = '';

        currentLabels = labelsTexts[2];
        resetInputs();  
    }

    const login = () => {
        let username = inputs[0].value;
        let password = inputs[1].value;
        let user = {
            username,
            password,
        }
        remote.login(user).then(
            res => {
                currentLabels = labelsTexts[2];
                resetInputs(currentLabels)

                userBtn.innerHTML = "logout";
                inputs[0].value = res['firstname'];
                inputs[1].value = res['lastname'];
                inputs[2].value = res['age'];
                inputs[3].value = res['country'];
                profilePhoto.src = res['profilePicture'] ? localStorage.getItem('profilePicture') : '#'; 
    
                localStorage.setItem('Authorization', res['token']);
                localStorage.setItem('firstName', res['firstname']);
                localStorage.setItem('profilePic', res['profilePicture']);
                localStorage.setItem('lastName', res['lastname']);
                localStorage.setItem('age', res['age']);
                localStorage.setItem('country', res['country']);
                currentBtn.classList.remove("active");
            })
    }

    const nextInputs = () => {
        currentLabels = labelsTexts[2];
        userBtn.innerHTML = 'register';
        resetInputs(); 
    }

    return{
        changeInputView,
        userAction,
        isAuth
    }

})();