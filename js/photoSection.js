const photoSection = (() => {
    const photoEndDrag = (dragObject) => {
        elementFromPoint = document.elementFromPoint(event.clientX, event.clientY);

        switch (elementFromPoint.className) {
            case 'place-photo':
                choosePhoto();
                break;
            case 'appended':
                exchangePhotos();
                break;
            default:
                resetPhoto();
                break;
        }
        node.style.zIndex = 'auto';
        node.style.pointerEvents = 'auto';
    }
    
    const choosePhoto = async () => {

        if(!app.getCurrentAlbumNumber()){
            resetPhoto();
            return;
        }

        const photo = target;

        photo.style.opacity = 1;
        photo.style.transition = 'opacity 1s'
        photo.classList.add('loading');
    
        elementFromPoint.appendChild(photo);
        node.style.display = 'none';

        
        try{
            await app.updateChosenPhoto(photo.id, elementFromPoint);
        }catch(e){
            node.appendChild(photo);
            node.style.display = 'block';

            console.log(e);
            resetPhoto(node);
            return;
        }finally{
            photo.classList.remove('loading');
        }

        photo.className = 'appended';
        elementFromPoint.className = 'placed-photo';
        node.parentElement.removeChild(node);
    }
    
    const exchangePhotos = async() => {
        const currentPhoto = elementFromPoint;
        const currentPhotoId = Number(currentPhoto.id);
        const currentPhotoSrc = currentPhoto.src;

        const photo = target;
        const newPhotoId = Number(photo.id);
        const newPhotoSrc = photo.src;

        photo.classList.add('loading');
        currentPhoto.classList.add('loading');

        resetPhoto();
        currentPhoto.src = newPhotoSrc;
        photo.src = currentPhotoSrc;


        try{
            await exchange(currentPhoto.parentElement, currentPhotoId, newPhotoId);
        }catch(e){
            photo.src = newPhotoSrc;
            currentPhoto.src = currentPhotoSrc;
            console.log(e);
            return;
        }finally{
            photo.classList.remove('loading');
            currentPhoto.classList.remove('loading');
        }

        currentPhoto.id = newPhotoId;
        photo.id = currentPhotoId;

    }

    const exchange = (placedPhoto, currentPhoto, newPhoto) => {
        const index = placePhotos.indexOf(placedPhoto);
        const album = albums[currentAlbumNumber];

        return remote.exchangePhotos(currentPhoto, newPhoto).then(res => {
            const image = res.data;
            album[index] = image
            
            const photos = placePhotos.filter(placePhoto => {
                if(placePhoto.children[0]) {
                    if(placePhoto.children[0].id == currentPhoto) return placePhoto 
                }
            })
            if(photos.length > 0){
                photos[0].firstChild.src = remote.getBase() + image.location;
                photos[0].firstChild.id = image.id;
                photos[0].className = 'place-photo';
            }

        })
    }

    const updateChosenPhoto = (id, elementFromPoint) => { 
        const album = albums[currentAlbumNumber]

        return remote.updatePhotoAlbum(id, currentAlbumNumber).then(res => {
            album.push(res.data);
            const index = album.length - 1

            placePhotos[placePhotos.indexOf(elementFromPoint)] = placePhotos[index];
            placePhotos[index] = elementFromPoint;
        })
        
    }
    
    const resetPhoto = () => {
        node.style.webkitTransform = null;
        node.style.mozTransform = null;
        node.style.transform = null;
    }

    const albumNumbersContainer = document.getElementById('album-numbers');
    
    let numberNode;
    const resetNumber = () => number = null;

    const chooseAlbumNumber = () => {
        const target = event.target;
        if(target.tagName == 'BUTTON'){
            albumNumbersContainer.classList.remove('album' + currentAlbumNumber);
            clearPlacedPhotos();
           
            if(target == number){
                number = null;
                currentAlbumNumber = null;
                return;
            }
           
            number = target;
            currentAlbumNumber = +target.children[1].textContent;
            albumNumbersContainer.classList.add('album' + currentAlbumNumber);

            appendPlacePhotos();
        }
    }

    const placePhotos = Array.from(document.getElementsByClassName('place-photo'));
    const clearPlacedPhotos = () => {
        if(number){
            placePhotos.forEach(photo => {
                if (photo.firstChild) {
                    photo.className = 'place-photo';
                    photo.removeChild(photo.lastChild);
                }
            })
        }
    }

    const appendPlacePhotos = async() => {
        
        let album = albums[currentAlbumNumber];
        if(!album){
            await remote.getAlbumImages(currentAlbumNumber).then(res => {
                album = albums[currentAlbumNumber] = res.data;
            }).catch(e => {
                console.log(e);
            })
        }

        album.forEach((image, i) => {
            if(number){
                const photo = document.createElement('div');
                
                photo.className = 'appended';
                photo.id = image.id;
                photo.style.backgroundImage = `url('${remote.getBase() + image.location}')`;
                
                placePhotos[i].appendChild(photo);
                placePhotos[i].className = 'placed-photo';
                
                dragElement(photo, true);
            }
        })
    }

    const appendPhoto = () => {
        const input = event.target;
    
        if (input.files && input.files[0]) {
            const image = input.files[0];
            
            const imageData = new FormData();
            imageData.append('photo', image);

            remote.submitImage(imageData).then(res => {
                const image = res.data;
                
                const containerCopy = photoContainer.cloneNode(true);
                const photoCopy = containerCopy.children[0];

                photoCopy.id = image.id;
                photoCopy.src = remote.getBase() + image.location;
                
                dragElement(photoCopy);
                photosContainer.insertBefore(containerCopy, photosContainer.firstChild);
            })
        }
    }

    const initialize = () =>{
        document.getElementById('input-photo').addEventListener('input', appendPhoto);
        albumNumbersContainer.addEventListener('click', chooseAlbumNumber);
    }

    return {
        initialize,
        clearPlacedPhotos,
        resetNumber
    }
})()