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
const session = require("express-session")
/* CONSTANTS END*/

/* CREATING VIEWS */
app.use(express.urlencoded())
app.engine("mustache", mustacheExpress())
// the pages are located in views directory
app.set("views", "./views")
// extension will be .mustache
app.set("view engine", "mustache")
/* CREATING VIEWS END*/

/***************************** AUTHENTICATION STUFF ***************************** */
// initalize the session
app.use(express.urlencoded())
app.use(
   session({
      secret: "keyboard cat",
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
   let username = req.body.username
   let password = req.body.password
   let height = req.body.height
   let weight = req.body.weight
   db.any("SELECT username FROM users").then((users) => {
      users.forEach((element) => {
         if (username != element.username) {
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
   let username = req.body.username
   let password = req.body.password
   db.any("SELECT username, password, user_id FROM users").then((users) => {
      users.forEach((element) => {
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
         }
      })
   })
})
// authentication middleware
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
// just a test page to see if middleware works
app.get("/testPage", authenticate, (req, res) => {
   let user = req.session.username
   res.render("test", { user: user })
})
/***************************** AUTHENTICATION STUFF ***************************** */

//LISTENER
app.listen(PORT, () => {
   console.log("Server is running...")
})
