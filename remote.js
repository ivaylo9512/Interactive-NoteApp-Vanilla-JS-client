const remote = (() => {

    const base = 'http://localhost:8000'
    
    const getAlbumImages = (album) => axios.get(`${base}/api/notes/findAlbumImages/${album}`,{
        headers: {
          Authorization: 'Bearer ' + "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQ4MjEzMjQyNTZhZTdhMjNmYTM0NDMzN2YzMzcwODc4NWU0YzRkOTk2ZjdlYjJhYzM0MDcwNGRiMmMwNmVmYWQyZTc5ZWUxZmZkZDc2ODQ3In0.eyJhdWQiOiI3IiwianRpIjoiNDgyMTMyNDI1NmFlN2EyM2ZhMzQ0MzM3ZjMzNzA4Nzg1ZTRjNGQ5OTZmN2ViMmFjMzQwNzA0ZGIyYzA2ZWZhZDJlNzllZTFmZmRkNzY4NDciLCJpYXQiOjE1NjI5MjE1MDYsIm5iZiI6MTU2MjkyMTUwNiwiZXhwIjoxNTk0NTQzOTA2LCJzdWIiOiIyIiwic2NvcGVzIjpbXX0.SSjGV2RJS5VIsPSeCY7qRweWU6rhtEyLOAqPc2pL3SlA9_3GsyZyKTGvsgCl4oRd39A3oSZqe0Z9vY-B7Zn6Q4KOfId6jGQuoXcJxUGfFZPBh73VQwXVxhpbhCdMQImbM-S5DoqgwkvQ_GrBUwADhCKbsulzeomfiSGW0pR7cSy11wvg-JROh1f8ICVU0AMwAOB1EuJpYVZTxgNxy4ClPLJDWkm_Ja26YuQOJNpaCicCdkvlxQVQqLTDD6b-WVoGVEjD2WR4j058BV1Av4dCpEjK5DFoF35YxfvAcl33cSqWcSIdtOcI7D60WK4EbPch9tGRTF7CJP_qvZcpf-BFzUf-_r03VNtQxbP5RXbXOgmGnjOHEiiX_1a39viTVoZUx9-HZ3wGN-59n5myvhgXrqVYe5SmMLM_p2i9knSjoKzY7W1blOnkhnWz72Rg0TBKCzFPqtkxtOtPS6uyzmwKj1ATzQsmLtAW-F6DC6rq5juajYHlDfs5NFbnUwq4ry41VYNo266KH4CS1hm3Lc5Q5Qy82KWMqH1M3kxf1Wwm2zF71zhflxThdUzKdjRVphGrWwP7AU_EffSfm_CPUWo7S6D8nbm34cI0JdlRjq7N5bYiUpVbhzrOu9Ijf8Bm5yAkvQj2t1aijNlnuaGo-FJI6wvlsQ8AgYn-RAPsTXbrYWU"
        }
    })

    return({
        getAlbumImages,
    })
})();