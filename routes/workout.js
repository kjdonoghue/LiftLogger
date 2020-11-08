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

/***************************** SAVE WORKOUT ***************************** */
 
router.post("/save", (req, res) => {
    let id = req.session.userId
    let exercises = req.body.exercises
    let title = req.body.title
    let date = new Date()
    let histories_wid = req.body.workout_id
     
    db.none('INSERT INTO histories (title, user_id, exercises, date, histories_wid) VALUES ($1, $2, $3, $4, $5)', [title, id, exercises, date, histories_wid])
    .then(() => {
       res.redirect('/dashboard')
    })
   
 })
/***************************** RENDER WORKOUT PAGE ***************************** */

 router.get("/:workout_id", async (req, res) => {
   let workout_id = req.params.workout_id
   
    await db.any('SELECT workout_id, title, exercises, notes FROM workouts WHERE workout_id= $1', [workout_id])
   .then(workout => {
      
      let exerciseList = workout.map((item) => {
      item.exercises = item.exercises.split(",")
      return item
   })
      res.render('workout', {exerciseList: exerciseList})
    })
   //  .catch ((error) => {res.render("error")}) 
})
/****************** WORKOUT PAGE END  ********************** */

module.exports = router