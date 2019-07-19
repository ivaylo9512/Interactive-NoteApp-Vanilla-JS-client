const remote = (() => {

    const base = 'http://localhost:8000/'
    
    const getAlbumImages = (album) => axios.get(`${base}api/images/findAlbumImages/${album}`,{
        headers: {
          Authorization: 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImYwMzg4MDJkNDJhNWQ4NTQ3MDFhMjA2MjFkMGQ4YzhhZDY1YzQyZDBiYThkNTNiMGJjMTYxYzY4MzNmZGExMmU3ZDE3MmUwYWM5Mzk3OTExIn0.eyJhdWQiOiI3IiwianRpIjoiZjAzODgwMmQ0MmE1ZDg1NDcwMWEyMDYyMWQwZDhjOGFkNjVjNDJkMGJhOGQ1M2IwYmMxNjFjNjgzM2ZkYTEyZTdkMTcyZTBhYzkzOTc5MTEiLCJpYXQiOjE1NjI2MDU1ODMsIm5iZiI6MTU2MjYwNTU4MywiZXhwIjoxNTk0MjI3OTgzLCJzdWIiOiIxOCIsInNjb3BlcyI6W119.j4j8uIcx-_lF0bq4KuROE_cskJsIP_uEpd7HSwjtaSpw46zhOUPrJkHnmOp--qo_O1VC2Ub3cyiP7ifL2obKuqYf8ZqHwa4mzkM8BLP7xYGE0gJrz_rEMnt_9CR_mmI8R5iOOtyCLHIpofvTLxAyUZDR69s6KdA42XFftCYXQPr0do3sbU5hqw6-dGRU5-wNZIMF9DHXzPZQVb3MsgJ37e3a3Ahcwkz6OcteWd6O8kJFqJQxkJ-fEGoRy4BY6q5m5zkpnIYwS8Fog8lgpwftP_7jGPSt3y2PrVqfTo__wL0ODFjGBR57YN0GAmYS_hQPwbf5Ba40-nOV1N6kwEzN09jMcTbQcJXBZ7BbPcW10tgm9zwTOwAXRWyfJzsAwocWwMKFGhhQ1E1AvAex-b_hCYJN9pn32pHVqZX4ai1ZlX9vfsqD3NY4Y9YAUaz4lRqUelgAOa99uHmZyuBJpiIEPMbBpq71TuMO3oAzv2mJkNIgnvOMJxY6hAIPqeqDPcKYHl7jgpt8L566oEp-ltxxHPhOVKQG4ldrrCdPr-lULrIP7snsjeOLUTloSexgkbQR6al6jdfi69VNWsO1LM6qWtGP15fY9bjpn6k7wx1LXKHJ_wGBkNjG8jvlL5uH6_-y1go50qaXzPH62_s_hpxcJFGnG6sk5KnxpcRoGtTRxWg'
        }
    })

    const login = (user) => axios.post(`${base}api/login`, user)

    const getNotes = (date, album) => axios.get(`${base}api/notes/findByDate/${album}`,{
        headers: {
          Authorization: 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImYwMzg4MDJkNDJhNWQ4NTQ3MDFhMjA2MjFkMGQ4YzhhZDY1YzQyZDBiYThkNTNiMGJjMTYxYzY4MzNmZGExMmU3ZDE3MmUwYWM5Mzk3OTExIn0.eyJhdWQiOiI3IiwianRpIjoiZjAzODgwMmQ0MmE1ZDg1NDcwMWEyMDYyMWQwZDhjOGFkNjVjNDJkMGJhOGQ1M2IwYmMxNjFjNjgzM2ZkYTEyZTdkMTcyZTBhYzkzOTc5MTEiLCJpYXQiOjE1NjI2MDU1ODMsIm5iZiI6MTU2MjYwNTU4MywiZXhwIjoxNTk0MjI3OTgzLCJzdWIiOiIxOCIsInNjb3BlcyI6W119.j4j8uIcx-_lF0bq4KuROE_cskJsIP_uEpd7HSwjtaSpw46zhOUPrJkHnmOp--qo_O1VC2Ub3cyiP7ifL2obKuqYf8ZqHwa4mzkM8BLP7xYGE0gJrz_rEMnt_9CR_mmI8R5iOOtyCLHIpofvTLxAyUZDR69s6KdA42XFftCYXQPr0do3sbU5hqw6-dGRU5-wNZIMF9DHXzPZQVb3MsgJ37e3a3Ahcwkz6OcteWd6O8kJFqJQxkJ-fEGoRy4BY6q5m5zkpnIYwS8Fog8lgpwftP_7jGPSt3y2PrVqfTo__wL0ODFjGBR57YN0GAmYS_hQPwbf5Ba40-nOV1N6kwEzN09jMcTbQcJXBZ7BbPcW10tgm9zwTOwAXRWyfJzsAwocWwMKFGhhQ1E1AvAex-b_hCYJN9pn32pHVqZX4ai1ZlX9vfsqD3NY4Y9YAUaz4lRqUelgAOa99uHmZyuBJpiIEPMbBpq71TuMO3oAzv2mJkNIgnvOMJxY6hAIPqeqDPcKYHl7jgpt8L566oEp-ltxxHPhOVKQG4ldrrCdPr-lULrIP7snsjeOLUTloSexgkbQR6al6jdfi69VNWsO1LM6qWtGP15fY9bjpn6k7wx1LXKHJ_wGBkNjG8jvlL5uH6_-y1go50qaXzPH62_s_hpxcJFGnG6sk5KnxpcRoGtTRxWg'
        },
        params: {
            date
        }
        
    });

    const updateNote = (note) => axios.patch(base +'api/notes/updateNote/', note);

    const submitNote = (name, note) => axios.post(base + 'api/notes/create', {
        name,
        note
    },{
        'headers': {
            Authorization: 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImYwMzg4MDJkNDJhNWQ4NTQ3MDFhMjA2MjFkMGQ4YzhhZDY1YzQyZDBiYThkNTNiMGJjMTYxYzY4MzNmZGExMmU3ZDE3MmUwYWM5Mzk3OTExIn0.eyJhdWQiOiI3IiwianRpIjoiZjAzODgwMmQ0MmE1ZDg1NDcwMWEyMDYyMWQwZDhjOGFkNjVjNDJkMGJhOGQ1M2IwYmMxNjFjNjgzM2ZkYTEyZTdkMTcyZTBhYzkzOTc5MTEiLCJpYXQiOjE1NjI2MDU1ODMsIm5iZiI6MTU2MjYwNTU4MywiZXhwIjoxNTk0MjI3OTgzLCJzdWIiOiIxOCIsInNjb3BlcyI6W119.j4j8uIcx-_lF0bq4KuROE_cskJsIP_uEpd7HSwjtaSpw46zhOUPrJkHnmOp--qo_O1VC2Ub3cyiP7ifL2obKuqYf8ZqHwa4mzkM8BLP7xYGE0gJrz_rEMnt_9CR_mmI8R5iOOtyCLHIpofvTLxAyUZDR69s6KdA42XFftCYXQPr0do3sbU5hqw6-dGRU5-wNZIMF9DHXzPZQVb3MsgJ37e3a3Ahcwkz6OcteWd6O8kJFqJQxkJ-fEGoRy4BY6q5m5zkpnIYwS8Fog8lgpwftP_7jGPSt3y2PrVqfTo__wL0ODFjGBR57YN0GAmYS_hQPwbf5Ba40-nOV1N6kwEzN09jMcTbQcJXBZ7BbPcW10tgm9zwTOwAXRWyfJzsAwocWwMKFGhhQ1E1AvAex-b_hCYJN9pn32pHVqZX4ai1ZlX9vfsqD3NY4Y9YAUaz4lRqUelgAOa99uHmZyuBJpiIEPMbBpq71TuMO3oAzv2mJkNIgnvOMJxY6hAIPqeqDPcKYHl7jgpt8L566oEp-ltxxHPhOVKQG4ldrrCdPr-lULrIP7snsjeOLUTloSexgkbQR6al6jdfi69VNWsO1LM6qWtGP15fY9bjpn6k7wx1LXKHJ_wGBkNjG8jvlL5uH6_-y1go50qaXzPH62_s_hpxcJFGnG6sk5KnxpcRoGtTRxWg'
        }
    })

    const getBase = () => base; 

    return({
        getAlbumImages,
        login,
        getNotes,
        updateNote,
        submitNote,
        getBase
    })
})();