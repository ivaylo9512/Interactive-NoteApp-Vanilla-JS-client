const profile = (() => {
    const userForm = document.getElementById('user-form');
    const profilePhoto = document.getElementById('chosen-image');
    const userInputs = [...document.getElementById('user-info').getElementsByTagName('input'), 
        ...document.getElementById('username-view').getElementsByTagName('input')];

    let userInfo;
    const setUserInfo = (user) => {
        userForm.className = "logged-view";

        userInfo = {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            country: user.country,
            profilePicture : user.profilePicture
        }

        userInputs[0].value = user.firstName;
        userInputs[1].value = user.lastName;
        userInputs[2].value = user.age;
        userInputs[3].value = user.country;

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

    const login = (e) => {
        e.preventDefault();

        let username = userInputs[0].value;
        let password = userInputs[1].value;
        let user = {
            username,
            password,
        }
        remote.login(user).then(res => setUserInfo(res.data));
    }

    const logout = () => {
        localStorage.removeItem('Authorization');
        localStorage.removeItem('User');
        profilePhoto.src = '';
        userForm.className = '';

        userInputs.forEach(el => el.value = '');
    }

    const userRegister = {};
    const register = (e) => {
        e.preventDefault();

        userInputs.forEach(el => userRegister[el.name] = el.value);
        formData.append('user', JSON.stringify(userRegister));
        remote.register(formData).then(res => setUserInfo(res));
    }

    const displayView = (e) => {
        e.preventDefault();
        userForm.className = e.target.name + '-view';
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

    const initialize = () => { 
        if (isAuth()) {
            userInfo = JSON.parse(localStorage.getItem('User'));
            setUserInfo(userInfo);
        }
        
        document.getElementById('login-btn').addEventListener('click', displayView);
        document.getElementById('register-btn').addEventListener('click', displayView);
        document.getElementById('next').addEventListener('click', displayView);
        document.getElementById('logout-btn').addEventListener('click', logout);
        document.getElementById('send-login').addEventListener('click', login);
        document.getElementById('send-register').addEventListener("click", register)
        document.getElementById('profile-photo').addEventListener('input', addProfilePhoto);    
    }

    return{
        isAuth,
        initialize
    }

})();