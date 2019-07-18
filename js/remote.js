const remote = (() => {

    const base = 'http://localhost:8000'
    
    const getAlbumImages = (album) => axios.get(`${base}/api/notes/findAlbumImages/${album}`,{
        headers: {
          Authorization: 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQ4MjEzMjQyNTZhZTdhMjNmYTM0NDMzN2YzMzcwODc4NWU0YzRkOTk2ZjdlYjJhYzM0MDcwNGRiMmMwNmVmYWQyZTc5ZWUxZmZkZDc2ODQ3In0.eyJhdWQiOiI3IiwianRpIjoiNDgyMTMyNDI1NmFlN2EyM2ZhMzQ0MzM3ZjMzNzA4Nzg1ZTRjNGQ5OTZmN2ViMmFjMzQwNzA0ZGIyYzA2ZWZhZDJlNzllZTFmZmRkNzY4NDciLCJpYXQiOjE1NjI5MjE1MDYsIm5iZiI6MTU2MjkyMTUwNiwiZXhwIjoxNTk0NTQzOTA2LCJzdWIiOiIyIiwic2NvcGVzIjpbXX0.SSjGV2RJS5VIsPSeCY7qRweWU6rhtEyLOAqPc2pL3SlA9_3GsyZyKTGvsgCl4oRd39A3oSZqe0Z9vY-B7Zn6Q4KOfId6jGQuoXcJxUGfFZPBh73VQwXVxhpbhCdMQImbM-S5DoqgwkvQ_GrBUwADhCKbsulzeomfiSGW0pR7cSy11wvg-JROh1f8ICVU0AMwAOB1EuJpYVZTxgNxy4ClPLJDWkm_Ja26YuQOJNpaCicCdkvlxQVQqLTDD6b-WVoGVEjD2WR4j058BV1Av4dCpEjK5DFoF35YxfvAcl33cSqWcSIdtOcI7D60WK4EbPch9tGRTF7CJP_qvZcpf-BFzUf-_r03VNtQxbP5RXbXOgmGnjOHEiiX_1a39viTVoZUx9-HZ3wGN-59n5myvhgXrqVYe5SmMLM_p2i9knSjoKzY7W1blOnkhnWz72Rg0TBKCzFPqtkxtOtPS6uyzmwKj1ATzQsmLtAW-F6DC6rq5juajYHlDfs5NFbnUwq4ry41VYNo266KH4CS1hm3Lc5Q5Qy82KWMqH1M3kxf1Wwm2zF71zhflxThdUzKdjRVphGrWwP7AU_EffSfm_CPUWo7S6D8nbm34cI0JdlRjq7N5bYiUpVbhzrOu9Ijf8Bm5yAkvQj2t1aijNlnuaGo-FJI6wvlsQ8AgYn-RAPsTXbrYWU'
        }
    })

    const login = (user) => axios.post(`${base}/api/login`, user)

    const getNotes = (date, album) => axios.get(`${base}/api/notes/findByDate/${album}`,{
        headers: {
          Authorization: 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImYwMzg4MDJkNDJhNWQ4NTQ3MDFhMjA2MjFkMGQ4YzhhZDY1YzQyZDBiYThkNTNiMGJjMTYxYzY4MzNmZGExMmU3ZDE3MmUwYWM5Mzk3OTExIn0.eyJhdWQiOiI3IiwianRpIjoiZjAzODgwMmQ0MmE1ZDg1NDcwMWEyMDYyMWQwZDhjOGFkNjVjNDJkMGJhOGQ1M2IwYmMxNjFjNjgzM2ZkYTEyZTdkMTcyZTBhYzkzOTc5MTEiLCJpYXQiOjE1NjI2MDU1ODMsIm5iZiI6MTU2MjYwNTU4MywiZXhwIjoxNTk0MjI3OTgzLCJzdWIiOiIxOCIsInNjb3BlcyI6W119.j4j8uIcx-_lF0bq4KuROE_cskJsIP_uEpd7HSwjtaSpw46zhOUPrJkHnmOp--qo_O1VC2Ub3cyiP7ifL2obKuqYf8ZqHwa4mzkM8BLP7xYGE0gJrz_rEMnt_9CR_mmI8R5iOOtyCLHIpofvTLxAyUZDR69s6KdA42XFftCYXQPr0do3sbU5hqw6-dGRU5-wNZIMF9DHXzPZQVb3MsgJ37e3a3Ahcwkz6OcteWd6O8kJFqJQxkJ-fEGoRy4BY6q5m5zkpnIYwS8Fog8lgpwftP_7jGPSt3y2PrVqfTo__wL0ODFjGBR57YN0GAmYS_hQPwbf5Ba40-nOV1N6kwEzN09jMcTbQcJXBZ7BbPcW10tgm9zwTOwAXRWyfJzsAwocWwMKFGhhQ1E1AvAex-b_hCYJN9pn32pHVqZX4ai1ZlX9vfsqD3NY4Y9YAUaz4lRqUelgAOa99uHmZyuBJpiIEPMbBpq71TuMO3oAzv2mJkNIgnvOMJxY6hAIPqeqDPcKYHl7jgpt8L566oEp-ltxxHPhOVKQG4ldrrCdPr-lULrIP7snsjeOLUTloSexgkbQR6al6jdfi69VNWsO1LM6qWtGP15fY9bjpn6k7wx1LXKHJ_wGBkNjG8jvlL5uH6_-y1go50qaXzPH62_s_hpxcJFGnG6sk5KnxpcRoGtTRxWg'
        },
        params: {
            date
        }
        
    });

    const updateNote = (note) => axios.patch(base +'/api/notes/updateNote/', note);

    const submitNote = (name, note) => axios.post(base + '/api/notes/create', {
        name,
        note
    },{
        'headers': {
            Authorization: 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImYwMzg4MDJkNDJhNWQ4NTQ3MDFhMjA2MjFkMGQ4YzhhZDY1YzQyZDBiYThkNTNiMGJjMTYxYzY4MzNmZGExMmU3ZDE3MmUwYWM5Mzk3OTExIn0.eyJhdWQiOiI3IiwianRpIjoiZjAzODgwMmQ0MmE1ZDg1NDcwMWEyMDYyMWQwZDhjOGFkNjVjNDJkMGJhOGQ1M2IwYmMxNjFjNjgzM2ZkYTEyZTdkMTcyZTBhYzkzOTc5MTEiLCJpYXQiOjE1NjI2MDU1ODMsIm5iZiI6MTU2MjYwNTU4MywiZXhwIjoxNTk0MjI3OTgzLCJzdWIiOiIxOCIsInNjb3BlcyI6W119.j4j8uIcx-_lF0bq4KuROE_cskJsIP_uEpd7HSwjtaSpw46zhOUPrJkHnmOp--qo_O1VC2Ub3cyiP7ifL2obKuqYf8ZqHwa4mzkM8BLP7xYGE0gJrz_rEMnt_9CR_mmI8R5iOOtyCLHIpofvTLxAyUZDR69s6KdA42XFftCYXQPr0do3sbU5hqw6-dGRU5-wNZIMF9DHXzPZQVb3MsgJ37e3a3Ahcwkz6OcteWd6O8kJFqJQxkJ-fEGoRy4BY6q5m5zkpnIYwS8Fog8lgpwftP_7jGPSt3y2PrVqfTo__wL0ODFjGBR57YN0GAmYS_hQPwbf5Ba40-nOV1N6kwEzN09jMcTbQcJXBZ7BbPcW10tgm9zwTOwAXRWyfJzsAwocWwMKFGhhQ1E1AvAex-b_hCYJN9pn32pHVqZX4ai1ZlX9vfsqD3NY4Y9YAUaz4lRqUelgAOa99uHmZyuBJpiIEPMbBpq71TuMO3oAzv2mJkNIgnvOMJxY6hAIPqeqDPcKYHl7jgpt8L566oEp-ltxxHPhOVKQG4ldrrCdPr-lULrIP7snsjeOLUTloSexgkbQR6al6jdfi69VNWsO1LM6qWtGP15fY9bjpn6k7wx1LXKHJ_wGBkNjG8jvlL5uH6_-y1go50qaXzPH62_s_hpxcJFGnG6sk5KnxpcRoGtTRxWg'
        }
    })

    return({
        getAlbumImages,
        login,
        getNotes,
        updateNote,
        submitNote
    })
})();