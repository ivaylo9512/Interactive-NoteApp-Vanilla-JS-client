const profile = (() => {

    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

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

    const view = [
        {
            labels:[{label:'Username', display: 'inline-block'}, {label:'Password', display:'inline-block'},{label:'', display:'none'}, {label:'', display:'none'}],
            button:{label:'login', display: 'block'}   
        }, 
        {
            labels:[{label:'Username', display:'inline-block'}, {label:'Password', display:'none'}, {label:'Repeat', display:'inline-block'},{label:'', display:'none'}],
            button:{labels:'next', display: 'block'}
        },
        {
            labels:[{label:'First Name', display:'inline-block'},{label:'Age', display:'inline-block'},{label:'Last Name', display:'inline-block'}, {label:'Country', display:'inline-block'}],
            button:{labels:'', display: 'none'}        
        }
    ];
    
    let currentBtn;
    const resetView = (currentLabels, inputs) => {
        for(let i = 0; i < inputNodes.length; i++){
            inputNodes[i].value = inputs == undefined ? '' : inputs[i];
            inputNodes[i].style.display = currentLabels.labels[i].display;
            labelNodes[i].textContent = currentLabels.labels[i].label;
            labelNodes[i].style.display = currentLabels.labels[i].display;
        }
        currentBtn.classList.remove('active');
        newBtn.classList.add('active');
        currentBtn = newBtn;
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

        resetView(view[2]);  
    }

    function login() {
        let username = inputNodes[0].value;
        let password = inputNodes[1].value;
        let user = {
            username,
            password,
        }
        remote.login(user).then(
            res => {
                const user = res.data;
                resetView(view[2])

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

        resetView(); 
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

    (function addListeners(){
        loginBtn.addEventListener('click', userAction);
        registerBtn.addEventListener('click', userAction);
        document.getElementById('user-btn').addEventListener('click', userAction);
        document.getElementById('profile-photo').addEventListener('input', addProfilePhoto);    
    })();

    return{
        isAuth,
    }

})();