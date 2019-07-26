const profile = (() =>{

    let labels = document.getElementById('labels-container').children;
    let inputs = document.getElementById('inputs-container').children;
    let profilePhoto = document.getElementById('chosen-image');
    let userBtn = document.getElementById('user-btn');

    let isAuth = () => localStorage.getItem('Authorization') != null;
    // if (isAuth()) {
    //     inputs[0].value = localStorage.getItem('firstName')
    //     inputs[1].value = localStorage.getItem('lastName');
    //     inputs[2].value = localStorage.getItem('age');
    //     inputs[3].value = localStorage.getItem('country');
    //     profilePhoto.src = localStorage.getItem('profilePic') != 'undefined' ? remote.getBase() + localStorage.getItem('profilePic') : '#'; 

    //     userBtn.style.display = 'block';
    //     userBtn.textContent = 'logout';
    // }

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
        userBtn.textContent = newState.id == 'login-btn' ? 'login' : 'next';
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
                labels[i].textContent = currentLabels[i];
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
        switch(userBtn.textContent){
            case 'login':
                login();
                break;
            case 'register':
                register()
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
        userBtn.textContent = '';

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
                const user = res.data;
                currentLabels = labelsTexts[2];
                resetInputs(currentLabels)

                userBtn.textContent = 'logout';
                inputs[0].value = user.firstName;
                inputs[1].value = user.lastName;
                inputs[2].value = user.age;
                inputs[3].value = user.country;
                profilePhoto.src = user.profilePicture ? remote.getBase() + user.profilePicture : '#'; 
    
                localStorage.setItem('Authorization', user.token);
                localStorage.setItem('firstName', user.firstMame);
                localStorage.setItem('profilePic', user.profilePicture);
                localStorage.setItem('lastName', user.lastName);
                localStorage.setItem('age', user.age);
                localStorage.setItem('country', user.country);
                currentBtn.classList.remove('active');
            })
    }

    const userRegister = {
        username: undefined,
        password: undefined,
        repeatPassword: undefined,
        firstName: undefined,
        lastName: undefined,
        country: undefined,
        age: undefined
    }
    const register = () => {
        userRegister.firstName =  inputs[0].value;
        userRegister.lastName =  inputs[1].value;
        userRegister.age =  inputs[2].value;
        userRegister.country =  inputs[3].value;
        formData.append('user', JSON.stringify(userRegister));

        remote.register(formData);
    }

    const nextInputs = () => {
        userRegister.username =  inputs[0].value;
        userRegister.password =  inputs[1].value;
        userRegister.repeatPassword =  inputs[2].value;

        currentLabels = labelsTexts[2];
        userBtn.textContent = 'register';

        resetInputs(); 
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => profilePhoto.src = event.target.result);
    
    const formData = new FormData();
    const addProfilePhoto = () => {
        const input = event.target;
    
        if (input.files && input.files[0]) {
            const image = input.files[0];
            reader.readAsDataURL(image);

            formData.append('photo', image);
            if(isAuth()){
                remote.setProfilePicture(formData);
            }
        }
    }


    return{
        changeInputView,
        userAction,
        isAuth,
        register,
        addProfilePhoto
    }

})();