# AYF-BE-24-FINAL-PROJECT


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
          "email" : "Id of role - required",
          "picture" : "File",
          "no_hp" : "String - required - unique",
          "age" : "String - required - unique",
          "city" : "String - required - unique",
          "country" : "String - required - unique",
      }
    ```

   - Response :

    ```javascript
        {
            "status":"201 Created",
            "message":"Your Account was registered"
        }
    ```

     # BELOM SELESAI
