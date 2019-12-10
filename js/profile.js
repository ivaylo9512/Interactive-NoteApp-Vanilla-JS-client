const profile = (() =>{

    let userInfo = document.getElementById('user-info');
    let labelNodes = userInfo.getElementsByTagName('label');
    let inputNodes = userInfo.getElementsByTagName('input');
    let profilePhoto = document.getElementById('chosen-image');
    let userBtn = document.getElementById('user-btn');

    let isAuth = () => localStorage.getItem('Authorization') != null;
    // if (isAuth()) {
    //     inputNodes[0].value = localStorage.getItem('firstName')
    //     inputNodes[1].value = localStorage.getItem('lastName');
    //     inputNodes[2].value = localStorage.getItem('age');
    //     inputNodes[3].value = localStorage.getItem('country');
    //     profilePhoto.src = localStorage.getItem('profilePic') != 'undefined' ? remote.getBase() + localStorage.getItem('profilePic') : '#'; 

    //     userBtn.style.display = 'block';
    //     userBtn.textContent = 'logout';
    // }

    const labels = [
        [{label:'Username', display:'block'}, {label:'Password', display:'block'},{label:'', display:'none'}, {label:'', display:'none'}], 
        [{label:'Username', display:'block'}, {label:'Password', display:'none'}, {label:'Repeat', display:'block'},{label:'', display:'none'}],
        [{label:'First Name', display:'block'},{label:'Age', display:'block'},{label:'Last Name', display:'block'}, {label:'Country', display:'block'}],
    ];
    
    let currentBtn;
    const changeInputView = (newState, oldState) => {
        oldState.classList.remove('active');
        newState.classList.add('active');
        
        userBtn.style.display = 'block';
        userBtn.textContent = newState.id == 'login-btn' ? 'login' : 'next';
        currentLabels = newState.id == 'login-btn' ? ()=> {resetInputs(labels[0]) } : ()=> {resetInputs(labels[0]) };
        currentBtn = newState;

        resetInputs();
    }

    const resetInputs = (currentLabels) => {
        inputNodes[0].value = '';
        inputNodes[1].value = '';
        inputNodes[2].value = '';
        inputNodes[3].value = '';

        inputNodes[0].display = currentLabels[0].display;
        inputNodes[1].display = currentLabels[1].display;
        inputNodes[2].display = currentLabels[2].display;
        inputNodes[3].display = currentLabels[3].display;

        labelNodes[0].textContent = currentLabels[0].label;
        labelNodes[1].textContent = currentLabels[1].label;
        labelNodes[2].textContent = currentLabels[2].label;
        labelNodes[3].textContent = currentLabels[3].label;

        labelNodes[0].style.display = currentLabels[0].display;
        labelNodes[1].style.display = currentLabels[1].display;
        labelNodes[2].style.display = currentLabels[2].display;
        labelNodes[3].style.display = currentLabels[3].display;

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

    const setInputs = (inputs) => {

        inputs = inputs[0][display];
        inputs
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
                localStorage.setItem('firstName', user.firstName);
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