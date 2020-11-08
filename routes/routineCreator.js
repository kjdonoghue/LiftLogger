// /* CONSTANTS */
const express = require("express")
const app = express()
require('dotenv').config()
// const PORT = process.env.PORT || 8080
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


/***************************** ROUTINE CREATOR STUFF ***************************** */

// posting the created routine to the wokouts table
router.post("/creatingRoutine", (req, res) => {
    const title = req.body.title
    const exercises = req.body.exercises.join(",")
    const user_id = req.session.userId
    
    
    db.none("INSERT INTO workouts (title, exercises, user_id) VALUES ($1, $2, $3)", [
       title,
       exercises,
       user_id
    ]).then(() => {
       res.redirect("/dashboard")
    })
 })
 
router.post("/routineCreator/bodyPart", (req, res) => {
    const body_part = req.body.body_part
 
    db.any(
       "SELECT title, body_part, equipment_need FROM exercises WHERE body_part LIKE '%$1#%';",
       [body_part]
    ).then((filter) => {
       res.render("routineCreator", { allExercises: filter })
    })
 })
 
 // get request to pull the exercises
router.get("/", (req, res) => {
    db.any("SELECT title, body_part, equipment_need FROM exercises;").then(
       (exercise) => {
          res.render("routineCreator", { allExercises: exercise })
       }
    )
 })
 
 /***************************** ROUTINE CREATOR STUFF END ***************************** */

 module.exports = router