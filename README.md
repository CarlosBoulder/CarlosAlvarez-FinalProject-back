# BoulderLab API

## Endpoints

**_GET https://carlos-alvarez-final-project-back-202304.onrender.com/ping_**

Verify status api

Return:

"message": "🏓 Pong"

**_POST https://carlos-alvarez-final-project-back-202304.onrender.com/user/login_**

User credentials verification to get valid token

Body:

`{ "username":"admin", "password":"admin" }`

Return:

`{
    "token": "eyJhbGciOiJIUz..."
}`

**_GET https://carlos-alvarez-final-project-back-202304.onrender.com/boulders/all_**

Get all boulders

Authorization: Bearer Token

Return:

`{
    "boulders": [
        {
            "img": "imageurl",
            "name": "Rema remero",
            "crag": "Techos",
            "grade": "7A",
            "description": "Sit start from small crimps",
            "country": "Spain",
            "spot": "Albarracín",
            "id": "6470ddcd54aeae925d46d8d6"
        }
    ]
}`
