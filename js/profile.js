const profile = (() => {

    const loginBtn = document.getElementById('login-view');
    const registerBtn = document.getElementById('register-view');
    const view = [
        {
            labels:['Username', 'Password'],
            menuBtn: loginBtn,
            action: 'login'   
        }, 
        {
            labels:['Username', 'Password', 'Repeat'],
            menuBtn: registerBtn,
            action: 'next'   
        },
        {
            labels:['First Name','Age','Last Name','Country'],
            action: 'logout'   
        },
        {
            labels:['First Name','Age','Last Name','Country'],
            menuBtn: registerBtn,
            action: 'register'   
        }
    ];

    const userAction = (e) => {
        e.preventDefault();
        const action = e.target == userBtn ? userBtn.textContent : e.target.id; 
        switch(action){
            case 'login-view':
                resetView(view[0]);
                break;
            case 'register-view':
                resetView(view[1]);
                break;
            case 'logout':
                logout();
                resetView(view[2]);  
                break; 
            case 'login':
                login().then(res => {
                    setUserInfo(res.data);
                    resetView(view[2], Object.values(res.data));
                });
                break;
            case 'register':
                saveInputs();
                register().then(res => {
                    setUserInfo(res.data);
                    resetView(view[2], Object.values(res.data));
                });
                break;
            case 'next':
                saveInputs();
                resetView(view[3]);  
                break;    
        }
    }

    function setUserInfo(user) {
        userBtn.textContent = 'logout';

        profilePhoto.src = user.profilePicture ? remote.getBase() + user.profilePicture : '#'; 
        
        localStorage.setItem('Authorization', user.token);
        localStorage.setItem('firstName', user.firstName);
        localStorage.setItem('profilePic', user.profilePicture);
        localStorage.setItem('lastName', user.lastName);
        localStorage.setItem('age', user.age);
        localStorage.setItem('country', user.country);
    }

    let profilePhoto = document.getElementById('chosen-image');
    let userInfo = document.getElementById('user-info');
    let labelNodes = userInfo.getElementsByTagName('label');
    let inputNodes = userInfo.getElementsByTagName('input');
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

    let currentBtn;
    const resetView = (view, inputs) => {
        for(let i = 0; i < inputNodes.length; i++){
            const labelInfo = view.labels[i];
            const input = inputNodes[i]; 
            const label = labelNodes[i];

            if(labelInfo){
                input.value = inputs == undefined ? '' : inputs[i];
                input.style.display = 'inline-block';
                label.textContent = labelInfo;
                label.style.display = 'inline-block';
            }else{
                input.value = '';
                input.style.display = 'none';
                label.textContent = '';
                label.style.display = 'none';
            }
        }

        const newBtn = view.menuBtn;
        currentBtn && currentBtn.classList.remove('active');        
        newBtn && newBtn.classList.add('active');
        currentBtn = newBtn;

        if(view.action){
            userBtn.textContent = view.action;
            userBtn.style.display = 'block'
        }else{
            userBtn.textContent = '';
            userBtn.style.display = 'none'

        }
    }

    const logout = () => {
        localStorage.removeItem('Authorization');
        profilePhoto.src = '';

        userBtn.style.display = 'none';
        userBtn.textContent = '';
    }

    function login() {
        let username = inputNodes[0].value;
        let password = inputNodes[1].value;
        let user = {
            username,
            password,
        }
        return remote.login(user);
    }

    const userRegister = {
        username: undefined,
        password: undefined,
        repeat: undefined,
        firstName: undefined,
        lastName: undefined,
        country: undefined,
        age: undefined
    }

    const saveInputs = () => {
        for(let i = 0; i < inputNodes.length; i++){
            if(labelNodes[i].style.display == 'none')
                break;

            const label = labelNodes[i].textContent.toLowerCase();
            const input = inputNodes[i].value;                
            userRegister[label] = input; 
        }
    }

    const register = () => {
        userRegister.firstName =  inputs[0].value;
        userRegister.lastName =  inputs[1].value;
        userRegister.age =  inputs[2].value;
        userRegister.country =  inputs[3].value;

        formData.append('user', JSON.stringify(userRegister));
        return remote.register(formData);
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