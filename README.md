# Install

`npm install`

---

# Things to add

- Create a `.env` file in config folder and add the following as `key = value`
  - PORT = 2121 (can be any port example: 3000)
  - DB_STRING = `your database URI`
  - CLOUD_NAME = `your cloudinary cloud name`
  - API_KEY = `your cloudinary api key`
  - API_SECRET = `your cloudinary api secret`

---

# Run

`npm start`

---
Routes 
-  "/", mainRoutes
-  / 	/profile	/feed	/login	/login	/logout	/signup	/signup

- /cogitation", cogitationRoutes
- /:id		/createCogitation		/likePost/:id		/deleteCogitation/:id

GET logout  logs out and redirects to landing page

GET landing page CTA  return - login || new - signup
GET signup  **new**
 - render // form & error scaffolding CTA submit button
POST signup 
 - validate/clean user input, user Model in db
 - & session in db  
 - & 1 cookie (connect.sid) created, expires "when the browsing session ends"  
 - & req.user lego piece made yay!
 - /profile  redirect

 GET login  **returning**

 GET profile   CTA  logout || Return to Feed || submit (to add a post)
