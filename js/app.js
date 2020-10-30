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
const { RSA_NO_PADDING } = require("constants")
/* CONSTANTS */
app.use(express.urlencoded())
app.engine("mustache", mustacheExpress())
// the pages are located in views directory
app.set("views", "./views")
// extension will be .mustache
app.set("view engine", "mustache")

app.get("/", (req, res) => {
   res.render("index")
})

app.post('/register',(req,res) => {

    const username = req.body.username 
    const password = req.body.password 

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            db.none('INSERT INTO users(username, password) VALUES($1,$2)',[username, hash])
            .then(() => {
                res.redirect('/')
            })
        })
    })
})

//LISTENER
app.listen(PORT, () => {
   console.log("Server is running...")
})
