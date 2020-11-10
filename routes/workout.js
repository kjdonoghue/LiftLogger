// /* CONSTANTS */
const express = require("express")
require('dotenv').config()
const pgp = require("pg-promise")()
const connectionString = process.env.CONNECTION_STRING
const db = pgp(connectionString)
const router = express.Router()
/* CONSTANTS END*/

/***************************** SAVE WORKOUT ***************************** */
exerciseArray = []

router.post("/save", (req, res) => {
    let id = req.session.userId
   //  let exercises = req.body.exercises
    let exercises = exerciseArray.toString()
    let title = req.body.title
    let date = new Date()
    let histories_wid = req.body.workout_id
     
    db.none('INSERT INTO histories (title, user_id, exercises, date, histories_wid) VALUES ($1, $2, $3, $4, $5)', [title, id, exercises, date, histories_wid])
    .then(() => {
      console.log(exerciseArray)
       res.redirect('/dashboard')
    })
   
 })


/***************************** SAVE UPDATED WORKOUT ITEM ***************************** */
 router.post("/update-list", (req, res) => {
    let exercise = req.body.exerciseName
    let workout_id = req.body.workout_id

   exerciseArray.push(exercise)
   

   res.redirect(`/workout/${workout_id}`)

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