// /* CONSTANTS */
const express = require("express")
const app = express()
require('dotenv').config()
const PORT = 3000
const pgp = require("pg-promise")()
var bcrypt = require("bcryptjs")
const connectionString = process.env.CONNECTION_STRING
const db = pgp(connectionString)
const mustacheExpress = require("mustache-express")
const session = require("express-session")
const path = require("path")
const VIEWS_PATH = path.join(__dirname, "./views")
const router = express.Router()
/* CONSTANTS END*/

//get account page
router.get("/", async (req, res) => {
    let user_id = req.session.userId

    let details = await db.any('SELECT username, height, weight, age, goal FROM users WHERE user_id = $1', [user_id])

    res.render("account", {AccountDetails: details})
})

//get edit page
router.get("/edit-account", async (req, res) => {
    let user_id = req.session.userId

    let details = await db.any('SELECT username, height, weight, age, goal FROM users WHERE user_id = $1', [user_id])

    res.render("edit-account", {AccountDetails: details})
})

//update edits
router.post("/update", (req, res) => {
    let user_id = req.session.userId
    let height = req.body.height
    let weight = req.body.weight
    let age = req.body.age
    let goal = req.body.goal

    db.none('UPDATE users SET height=$1, weight=$2, age=$3, goal=$4 WHERE user_id=$5', [height, weight, age, goal, user_id])
    .then(() => {
        res.redirect("/account")
    })
})



module.exports = router
