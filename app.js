// /* CONSTANTS */
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
app.use(
   session({
      secret: "keyboard cat", // this needs to be fixed
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
   // user given info
   let username = req.body.username
   let password = req.body.password
   let height = req.body.height
   let weight = req.body.weight
   // grabs all usernames, if given user exists in db, it restarts page with error message
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
// log in function, takes user data and tries to match it with username and passwords in the db
app.post("/login", (req, res) => {
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
// logout function - destroys session and renders login screen
app.get("/logout",(req,res) => {
   req.session.destroy();
   res.render("login")
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

app.get('/helloWorld', (req, res) => {
   res.send('Hello World')
})

/***************************** ROUTINE CREATOR STUFF ***************************** */


// posting the created routine to the wokouts table
app.post('/creatingRoutine', (req, res) => {
    const title = req.body.title
    const exercises = req.body.exercises

    db.none('INSERT INTO workouts (title, exercises) VALUES ($1, $2)', [title, exercises])
        .then(() => {
            res.redirect('/')
        })
})


app.post('/routineCreator/bodyPart', (req, res) => {
    const body_part = req.body.body_part



    db.any('SELECT title, body_part, equipment_need FROM exercises WHERE body_part LIKE \'%$1#%\';', [body_part])
        .then((filter) => {
            res.render('routineCreator', { allExercises: filter })
        })

 

})

// get request to pull the exercises 
app.get('/routineCreator', (req, res) => {
    db.any('SELECT title, body_part, equipment_need FROM exercises;')
        .then(exercise => {
            res.render('routineCreator', { allExercises: exercise })
        })
})


/***************************** ROUTINE CREATOR STUFF ***************************** */

app.listen(PORT, () => {
   console.log("Server is running...")
})
