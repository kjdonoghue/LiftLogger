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

/* REGISTER FUNCTION */
app.post("/register", (req, res) => {
   let username = req.body.username
   let password = req.body.password
   let height = req.body.height
   let weight = req.body.weight
   bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
         db.none("INSERT INTO users(username, password, height, weight) VALUES($1,$2,$3,$4)", [
            username,
            hash,
            height,
            weight
         ]).then(() => {
            res.redirect("/")
         })
      })
   })
})
/* REGISTER FUNCTION END*/

//LISTENER
app.listen(PORT, () => {
   console.log("Server is running...")
})