const remote = (() => {

    const base = 'http://127.0.0.1:8000/'
    
    const getAlbumImages = (album) => axios.get(`${base}api/images/findAlbumImages/${album}`,{
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        }
    })

    const login = (user) => axios.post(base+ 'api/login', user);

    const register = (user) => axios.post(base + 'api/register', user);

    const setProfilePicture = (photo) => axios.post(base + 'api/images/setProfilePicture', photo, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        }
    });

    const getNotes = (date, album) => axios.get(`${base}api/notes/findByDate/${album}`,{
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        },
        params: {
            date
        }  
    });

    const updateNote = (note) => axios.patch(base +'api/notes/update/', note,{
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        }
    });

    const submitNote = (name, note) => axios.post(base + 'api/notes/create', {
        name,
        note
    },{
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        }
    })

    const submitImage = (image) => axios.post(base + 'api/images/upload', image,{
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        }
    });

    const updatePhotoAlbum = (image, album) => axios.patch(`${base}api/images/changeAlbum/${image}/${album}`,{},{
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        }
    });

    const exchangePhotos = (currentPhoto, newPhoto) => axios.patch(`${base}api/images/exchangePhotos/${currentPhoto}/${newPhoto}`,{},{
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        }
    });

    const updateAlbumPhotos = (images) => axios.patch(base + 'api/images/updateAlbumPhotos', {images},{
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        }
    });

    const getBase = () => base; 

    return({
        base,
        getAlbumImages,
        login,
        getNotes,
        updateNote,
        submitNote,
        getBase,
        submitImage,
        updatePhotoAlbum,
        exchangePhotos,
        register,
        setProfilePicture,
        updateAlbumPhotos
    })
})();