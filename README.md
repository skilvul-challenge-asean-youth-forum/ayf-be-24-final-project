# AYF-BE-24-FINAL-PROJECT

- Link Deploy RESTful dengan Railway: https://backend-service-dev.up.railway.app/ENDPOINT
- Link BRD : https://whimsical.com/brd-asean-youth-forum-fe42-YKm8iWc9qeTWE2hbeVahYr
- Link ERD: https://dbdiagram.io/d/648725e9722eb77494d14573

 ** 'ENDPOINT' ganti dengan alamat endpoint dibutuhkan **
# API Specification

- ## User Model

  | Atrributes    | Data Type     | Description                        |
  | ------------- | ---------     | ----------------------------       |
  | id            | Integer        | Contains the user's fullname      |
  | fullname      | String        | Contains the user's fullname       |
  | password      | String        | Contains the user's password       |
  | email         | String        | Contains the user's email          |
  | createdAt     | Date          | contains the account creation date |
  | updatedAt     | Date          | contains the account update date   |

  
- ## Profile Model

  | Atrributes    | Data Type     | Description                        |
  | ------------- | ---------     | ----------------------------       |
  | id            | Integer       | Contains the profile's id          |
  | user_id       | Integer       | Contains the profile's user_id     |
  | no_hp         | String        | Contains the profile's no_hp       |
  | age           | String        | Contains the profile's age         |
  | city          | String        | Contains the profile's city        |
  | country       | String        | Contains the profile's email       |
  | picture       | String        | Contains the profile's picture     |
  | createdAt     | Date          | contains the account creation date |
  | updatedAt     | Date          | contains the account update date   |
  
- ## forums Model

  | Atrributes    | Data Type     | Description                        |
  | ------------- | ---------     | ----------------------------       |
  | id            | Integer       | Contains the forums's id           |
  | name          | String        | Contains the forums's name         |
  | descrition    | String        | Contains the forums's descrition   |
  | picture       | String        | Contains the forums's picture      |
  | createdAt     | Date          | contains the account creation date |
  | updatedAt     | Date          | contains the account update date   |
  
- ## news Model

  | Atrributes    | Data Type     | Description                        |
  | ------------- | ---------     | ----------------------------       |
  | id            | Integer       | Contains the news's id             |
  | title         | String        | Contains the news's title          |
  | category      | String        | Contains the news's category       |
  | content       | String        | Contains the news's content        |
  | pictures      | Date          | Contains the news's pictures       |
  | createdAt     | Date          | contains the account creation date |
  | updatedAt     | Date          | contains the account update date   |
  
- ## forums_comments Model

  | Atrributes    | Data Type     | Description                              |
  | ------------- | ---------     | ----------------------------             |
  | id            | Integer       | Contains the forums_comments's id        |
  | forum_id      | Integer       | Contains the forums_comments's forum_id  |
  | user_id       | Integer       | Contains the forums_comments's user_id   |
  | comment       | Text          | contains the forums_comments's comment   |
  | createdAt     | Date          | contains the account creation date       |
  | updatedAt     | Date          | contains the account update date         |
  
  - ## news_comments Model

  | Atrributes    | Data Type     | Description                           |
  | ------------- | ---------     | ----------------------------          |
  | id            | Integer       | Contains the news_comments's id       |
  | news_id       | Integer       | Contains the news_comments's news_id  |
  | user_id       | Integer       | Contains the news_comments's user_id  |
  | comment       | Text          | contains the news_comments's comment  |
  | createdAt     | Date          | contains the account creation date    |
  | updatedAt     | Date          | contains the account update date      |
  
  # Authentication & Autorization Endpoint

  - ### Register (all users)
  
   - Method : POST
   - Endpoint : /register
   - Header :
    - Content-Type : application/json
    - Accept : application/json
   - Body :

    ```javascript
      {
          "fullname" : "String ",
          "password" : "String ",
          "email" : "String",
          "picture" : "File",
          "no_hp" : "String - required ",
          "age" : "String - required ",
          "city" : "String - required ",
          "country" : "String - required",
      }
    ```

   - Response :

    ```javascript
    {
      "user": {
          "id": "id of user",
          "fullname": "String",
          "password": "Text - required",
          "email": "String - required",
          "updatedAt": "Date",
          "createdAt": "Date"
      },
      "Profile": {
          "id": "id of profil",
          "user_id": "id of user",
          "no_hp": "String",
          "age": "String",
          "city": "String",
          "country": "String",
          "picture": "String",
          "updatedAt": "Date",
          "createdAt": "Date"
      }
    }
    ```
    > endpoint ini akan mendaftarkan dan menyimpan data user kedalam 2 tabel ( `user`, `profile` ) 


  - ### Login (all users)
  
   - Method : POST
   - Endpoint : /login
   - Header :
    - Content-Type : application/json
    - Accept : application/json
   - Body :

   ```javascript
    {
       
       "email" : "Id of role - required"
       "password" : "String ",

    }
    ```

    - Response :

    ```javascript
    {
        "token": "String",
        "email": "String",
        "user_id": "id of user",
        "fullname": "String",
        "picture": "String"
    }
    ```
   > endpoint ini akan melakukan pengecekan data yang telah di registrasikan untuk mendapatkan kode `token` login.


  - ### Forum Comment (all users)
  
   - Method : POST
   - Endpoint : /forums/comments
   - Header :
    - authorization : JSON Web Token
    - Accept : application/json
   - Body :

   ```javascript
   {
    "comment": "String",
    "forum_id": "Integer"
    }
   ```

   - Response :

   ```javascript
   {
    "id": 34,
    "forum_id": 1,
    "user_id": 1,
    "comment": "String",
    "updatedAt": "Date",
    "createdAt": "Date"
    }
    ```
    > endpoint ini akan sukses dijalankan ketika user telah mendapatkan token login dan berfungsi untuk mengirimkan data ke dalam tabel `forum_comment` berisi komentar dari forum tersebut.

  - ### News Comment (all users)
  
   - Method : POST
   - Endpoint : /news/comments
   - Header :
    - Content-Type : application/json
    - Accept : application/json
    - authorization : JSON Web Token
   - Body :
    ```javascript
    {
    "comment": "String",
    "news_id": "id of news"
    }
    ```
  - Response :
    ```javascript
    {
    "id": "Integer",
    "news_id": "id of news,
    "user_id": "id of user,
    "comment": "String",
    "updatedAt": "Date",
    "createdAt": "Date"
    }
    ```
    > endpoint ini akan sukses dijalankan ketika user telah mendapatkan token login dan berfungsi untuk mengirimkan data ke dalam tabel `news_comment` berisi komentar dari news tersebut.


  # User Endpoint
  
    - ### Get Forums (all users)

     - Method : GET
     - Endpoint : /forums
     - Header :
      - Accept : application/json

     - Response :
     ```javascript
    {
      "page": "Integer",
    "totalPages": "Integer",
    "data": [
        {
            "id": "id of forums",
            "author": "String",
            "title": "String",
            "descrition": "String",
            "picture": "String",
            "createdAt": "Date",
            "updatedAt": "Date"
        },
        ]
      }
      
      ```

     
    - ### Get News (all users)

     - Method : GET
     - Endpoint : /news
     - Header :
      - Accept : application/json

     - Response :

      ```javascript
      [
        {
          "id": "id of news",
          "title": "String",
          "category": "String",
          "content": "text",
          "pictures": "String",
          "createdAt": "Date",
          "updatedAt": "Date"
      }
      ]
      ```
      - ### Get NewsComment (all users)

      - Method : GET
      - Endpoint : /news/:id/comments
      - Header :
       - Accept : application/json
       - Paremeter :

       `/news/id_of_news/comments"
       
      - Body :
      
       ```javascript
           {
             "news_id":"req.params.id"
           }
       ```
      - Response :
 
       ```javascript
       [
        {
          "id": "integer",
          "news_id": "id of news",
          "user_id": "id of user",
          "comment": "String",
          "createdAt": "Date",
          "updatedAt": "Date",
          "User": {
              "fullname": "String",
              "Profile": {
                  "picture": "String"
              }
          }
      }
       ]
       ```
       # Endpoint method Delete

       - ### Delete User (Developer)

     - Method : Delete
     - Endpoint : /users/:userId
     - Header :
      - Accept : application/json

     - Response :
     ```javascript
    {
    "message": "User deleted successfully"
    }
      ```
    > ketika digunakan endpoint ini akan menghapus data `user` dan yang berelasi dengan user ( `profile`, `news_comment`, `forum_comment` ).


    - ### Delete Forum (Developer)

     - Method : Delete
     - Endpoint : /forums/:id
     - Header :
      - Accept : application/json

     - Response :

     ```javascript
    {
    "message": "Forum deleted successfully"
    }
      ```
    > endpoind ini akan menghapus forum berdasarkan `id` pada tabel forum

    
    - ### Delete News (Developer)

     - Method : Delete
     - Endpoint : /news/:id
     - Header :
      - Accept : application/json

     - Response :

     ```javascript
    {
    "message": "News deleted successfully"
    }
      ```
    > endpoint ini akan menghapus data `news` berdasarkan `id` dari tabel News.

    - ### Delete Forum Comment (Developer)

     - Method : Delete
     - Endpoint : /forums/:id:comment
     - Header :
      - Accept : application/json

     - Response :

     ```javascript
    {
    "message": "Comment deleted successfully"
    }
      ```
    >endpoint ini akan menghapus data `forum comment` berdasarakan `id` dari tabel forum_comment.


    - ### Delete News Comment (Developer)

     - Method : Delete
     - Endpoint : /news/:id:comment
     - Header :
      - Accept : application/json

     - Response :

     ```javascript
    {
    "message": "Comment deleted successfully"
    }
      ```
    > endpoint ini akan menghapus data `News Comment` berdasarkan `id` dari tabel news_comment.
