/* CONSTANTS */
const express = require("express")
const app = express()
const PORT = 3000
const pgp = require("pg-promise")()
var bcrypt = require("bcryptjs")
const connectionString =
   "postgres://skvpwhin:lXgkojz2TanCel7pEUUSDtGg-bEKm4NW@lallah.db.elephantsql.com:5432/skvpwhin"
const db = pgp(connectionString)
const mustacheExpress = require("mustache-express")
const session = require('express-session')
/* CONSTANTS END*/

/* CREATING VIEWS */
app.use(express.urlencoded())
app.engine("mustache", mustacheExpress())
// the pages are located in views directory
app.set("views", "./views")
// extension will be .mustache
app.set("view engine", "mustache")
/* CREATING VIEWS END*/

/* INITIAL PAGE */
app.get("/", (req, res) => {
   res.render("index")
})
/* INITIAL PAGE END*/

/******************* AUTHENTICATION STUFF *****************/
// initalize the session
app.use(express.urlencoded())
app.use(session({
   secret: "keyboard cat",
   resave: false,
   saveUnitialized: true
}))
// logging middleware
function loggingMiddleware(req,res, next) {
   console.log("LOGGING MIDDLEWARE")
   next() // continue with the original request 
}
app.use(loggingMiddleware)
// registration page action
app.get("/register", (req, res) => {
   res.render("register")
})
// create user
app.post("/register", (req, res) => {
   let username = req.body.username
   let password = req.body.password
   let height = req.body.height
   let weight = req.body.weight
   bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
         db.none(
            "INSERT INTO users(username, password, height, weight) VALUES($1,$2,$3,$4)",
            [username, hash, height, weight]
         ).then(() => {
            res.redirect("/login")
         })
      })
   })
})
// show the login page
app.get("/login", (req, res) => {
   res.render("login")
})
// log in function
app.post("/login", (req, res) => {
   let username = req.body.username
   let password = req.body.password

   db.any("SELECT username, password FROM users").then((users) => {
      users.forEach((element) => {
         if (username == element.username) {
            console.log("W")
            bcrypt.compare(password, element.password).then(function (result) {
               if (result == true) {
                  res.render('login',{message: 'Username or password is correct'})
               } else {
                  res.render('login',{message: 'Username or password is incorrect'})
               }
            })
         }
      })
   })
})
/******************* AUTHENTICATION STUFF *****************/

//LISTENER
app.listen(PORT, () => {
   console.log("Server is running...")
})
