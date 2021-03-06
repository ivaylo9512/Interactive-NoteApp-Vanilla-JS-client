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
            labels:['First Name','Last Name','Age','Country'],
            action: 'logout'   
        },
        {
            labels:['First Name','Last Name','Age','Country'],
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
                    resetView(view[2], Object.values(userInfo));
                })
                break;
            case 'register':
                saveInputs();
                register().then(res => {
                    setUserInfo(res.data);
                    resetView(view[2], Object.values(userRegister));
                })
                break;
            case 'next':
                saveInputs();
                resetView(view[3]);  
                break;    
        }
    }

    let profilePhoto = document.getElementById('chosen-image');
    let userContainer = document.getElementById('user-info');
    let labelNodes = userContainer.getElementsByTagName('label');
    let inputNodes = userContainer.getElementsByTagName('input');
    let userBtn = document.getElementById('user-btn');
    
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

    let userInfo;
    function setUserInfo(user) {
        userBtn.textContent = 'logout';

        userInfo = {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            country: user.country,
            profilePicture : user.profilePicture
        }

        profilePhoto.src = user.profilePicture ? remote.getBase() + user.profilePicture : '#'; 
        localStorage.setItem('Authorization', user.token);
        localStorage.setItem('User', JSON.stringify(userInfo));
    }

    let isAuth = () => {
        try{
            return localStorage.getItem('Authorization') != null
        }catch(e){ //Gives me error in Edge and IE when server is on localHost 
            return false;
        }
    };

    function login() {
        let username = inputNodes[0].value;
        let password = inputNodes[1].value;
        let user = {
            username,
            password,
        }
        return remote.login(user);
    }

    const logout = () => {
        localStorage.removeItem('Authorization');
        localStorage.removeItem('User');
        profilePhoto.src = '';

        userBtn.style.display = 'none';
        userBtn.textContent = '';
    }

    const userRegister = {};
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

    const start = () => { 

        if (isAuth()) {
            userInfo = JSON.parse(localStorage.getItem('User'));
            resetView(view[2], Object.values(userInfo));
    
            profilePhoto.src = userInfo.profilePicture != 'undefined' ? remote.getBase() + userInfo.profilePicture : '#'; 
        }
        
        loginBtn.addEventListener('click', userAction);
        registerBtn.addEventListener('click', userAction);
        document.getElementById('user-btn').addEventListener('click', userAction);
        document.getElementById('profile-photo').addEventListener('input', addProfilePhoto);    
    }

    return{
        isAuth,
        start
    }

})();