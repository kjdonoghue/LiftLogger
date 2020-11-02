/* CONSTANTS */
const express = require("express")
const app = express()
const PORT = 3000
const pgp = require("pg-promise")()
const bcrypt = require("bcryptjs")
const connectionString =
   "postgres://skvpwhin:lXgkojz2TanCel7pEUUSDtGg-bEKm4NW@lallah.db.elephantsql.com:5432/skvpwhin"
const db = pgp(connectionString)
const mustacheExpress = require("mustache-express")
const session = require("express-session")
/* CONSTANTS END*/

/* VIEWS */
app.use(express.urlencoded())
app.engine("mustache", mustacheExpress())
// the pages are located in views directory
app.set("views", "./views")
// extension will be .mustache
app.set("view engine", "mustache")
/* VIEWS END*/

/***************************** AUTHENTICATION STUFF ******************************/
// initalize session
app.use(express.urlencoded())
app.use(
   session({
      secret: "keyboard cat", // this needs to be changed
      resave: false,
      saveUnitialized: true,
   })
)
// registration page action
app.get("/register", (req, res) => {
   res.render("register")
})
// create user
app.post("/register", (req, res) => {
   // taking user inputs
   let username = req.body.username
   let password = req.body.password
   let height = req.body.height
   let weight = req.body.weight
   // checks if the username already exists, if not continue, if it does page reloads with a "Username already exists" message
   db.any("SELECT username FROM users").then((users) => {
      // loop through every username inside the users table
      users.forEach((element) => {
         if (username != element.username) {
            // hash password
            bcrypt.genSalt(10, function (err, salt) {
               bcrypt.hash(password, salt, function (err, hash) {
                  // 
                  db.none(
                     "INSERT INTO users(username, password, height, weight) VALUES($1,$2,$3,$4)",
                     [username, hash, height, weight]
                  ).then(() => {
                     res.redirect("/login")
                  })
               })
            })
         } else {
            res.render("register", {
               message: "Username already exists",
            })
         }
      })
   })
})
// show the login page
app.get("/login", (req, res) => {
   res.render("login")
})
// log in function
app.post("/login", (req, res) => {
   // taking user input
   let username = req.body.username
   let password = req.body.password
   // gets all user info from users table
   db.any("SELECT username, password, user_id FROM users").then((users) => {
      // loop through users
      users.forEach((element) => {
         // if username is correct, then check password accuracy with the compare function (bcryptjs). If password is incorrect, display "Username or password is incorrect"
         if (username == element.username) {
            loggedIn = bcrypt
               .compare(password, element.password)
               .then(function (result) {
                  if (result == true) {
                     if (req.session) {
                        req.session.username = username
                     }
                     res.redirect("/testPage") // this will need to change to the dashboard
                  } else {
                     res.render("login", {
                        message: "Username or password is incorrect",
                     })
                  }
               })
         } else {
            res.render("login", {
               message: "Username or password is incorrect",
            })
         }
      })
   })
})
// authentication middleware, redirects to login page if user doesnt exist in session
function authenticate(req, res, next) {
   if (req.session) {
      if (req.session.username) {
         // continue with the original request
         next()
      } else {
         res.redirect("/login")
      }
   } else {
      res.redirect("/login")
   }
}
// test page for middleware
app.get("/testPage", authenticate, (req, res) => {
   let user = req.session.username
   res.render("test", { user: user })
})
/***************************** AUTHENTICATION STUFF END ******************************/

//LISTENER
app.listen(PORT, () => {
   console.log("Server is running...")
})