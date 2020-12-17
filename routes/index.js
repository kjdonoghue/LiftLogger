// /* CONSTANTS */
const express = require("express")
var bcrypt = require("bcryptjs")
const session = require("express-session")
const router = express.Router()
/* CONSTANTS END*/


router.get("/", (req,res) => {
    res.render("splash")
 })

/***************************** AUTHENTICATION ***************************** */
// initalize the session
router.use(
   session({
      secret: "keyboard cat", // this needs to be fixed
      resave: false,
      saveUnitialized: true,
   })
)
 /***************************** REGISTRATION ***************************** */
 // registration page action
router.get("/register", (req, res) => {
    res.render("register")
 })

 // create user
router.post("/register", (req, res) => {
    // user given info
    let username = req.body.username
    let password = req.body.password
    let height = req.body.height
    let weight = req.body.weight
    let age = req.body.age
    let goal = req.body.goal
    // looks to see if given username exists in the database
    db.any("SELECT username FROM users WHERE username=$1", username).then(
       (users) => {
          // if username is inside db
          if (users.length > 0) {
             res.render("register", {
                message: "Username already exists",
             })
          } else {
             // create user row
             bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                   db.none(
                      "INSERT INTO users(username, password, height, weight, age, goal) VALUES($1,$2,$3,$4,$5,$6)",
                      [username, hash, height, weight, age, goal]
                   ).then(() => {
                      res.redirect("/login")
                   })
                })
             })
          }
       }
    )
 })

 // guest login
router.post("/guest", (req, res) => {
    // guest user info
    let username = "johndoe"
    let password = "password"
    let userId = 30
    if (req.session) {
       // stores info in session
       req.session.username = username
       req.session.password = password
       req.session.userId = userId
    }
    res.redirect("/dashboard")
 })

/***************************** LOGIN ***************************** */
 // show the login page
 router.get("/login", (req, res) => {
    res.render("login")
 })

 // log in function, takes user data and tries to match it with username and passwords in the db
router.post("/login", (req, res) => {
    // user enters login info
    let username = req.body.username
    let password = req.body.password
    // grabs user info from db, loops through and compares to given
    db.any("SELECT username, password, user_id FROM users").then((users) => {
       users.forEach((element) => {
          if (username == element.username) {
             // uses bcrypt's compare function. result returns true if passwords match
             loggedIn = bcrypt
                .compare(password, element.password)
                .then(function (result) {
                   if (result == true) {
                      if (req.session) {
                         req.session.username = username
                         req.session.userId = element.user_id
                      }
                      res.redirect("/dashboard")
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

/***************************** LOG OUT ***************************** */
 // logout function - destroys session and renders login screen
router.post("/logout", (req, res) => {
    req.session.destroy()
    res.render("login")
 })

 /***************************** END ***************************** */

 module.exports = router