// /* CONSTANTS */
const express = require("express")
const router = express.Router()
/* CONSTANTS END*/

/****************** HISTORY PAGE ********************** */
router.get("/", async (req, res) => {
    let id = req.session.userId
                  
    let result = await db.any("SELECT user_id, title, histories_wid, exercises, TO_CHAR(date, 'MM/DD/YYYY') as date, histories_id FROM histories WHERE user_id = $1 ORDER BY histories_id DESC", [id]) 
    res.render('history', {History: result})        
 })

 exerciseArray = []

 /********* SAVE UPDATED WORKOUT ITEM ON WORKOUT-HISTORIES PAGE **************** */
 router.post("/update-history", (req, res) => {
    let exercise = req.body.exerciseName
    let histories_id = req.body.histories_id

   exerciseArray.push(exercise)
    

   res.redirect(`/history/${histories_id}`)

 })

 /***************************** SAVE WORKOUT ***************************** */


router.post("/save", (req, res) => {
    let id = req.session.userId
    let exercises = exerciseArray.toString()
    let title = req.body.title
    let date = new Date()
     
    db.none('INSERT INTO histories (title, user_id, exercises, date) VALUES ($1, $2, $3, $4)', [title, id, exercises, date])
    .then(() => {
      exerciseArray = []
       res.redirect('/dashboard')
    })
   
 })

 /****************** HISTORY WORKOUT PAGE ********************** */

 router.get("/:histories_id", async (req, res) => {
    let histories_id = req.params.histories_id
    
   await db.any('SELECT histories_id, title, exercises FROM histories WHERE histories_id= $1', [histories_id])
    .then(workout => {
       
       let exerciseList = workout.map((item) => {
       item.exercises = item.exercises.split(",")
       return item
    })
       res.render('workout-history', {exerciseList: exerciseList})
     })
    //  .catch ((error) => {res.render("error")}) 
 })


 /****************** HISTORY PAGE END ********************** */





module.exports = router