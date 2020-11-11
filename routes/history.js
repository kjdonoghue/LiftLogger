// /* CONSTANTS */
const express = require("express")
require('dotenv').config()
const pgp = require("pg-promise")()
const connectionString = process.env.CONNECTION_STRING
const db = pgp(connectionString)
const router = express.Router()
/* CONSTANTS END*/

/****************** HISTORY PAGE ********************** */
router.get("/", async (req, res) => {
    let id = req.session.userId
                  
    let result = await db.any("SELECT user_id, title, histories_wid, exercises, TO_CHAR(date, 'DD/MM/YYYY') as date, histories_id FROM histories WHERE user_id = $1 ORDER BY histories_id DESC", [id]) 
    res.render('history', {History: result})        
 })

 /****************** HISTORY WORKOUT PAGE ********************** */

 router.get("/:histories_id", async (req, res) => {
    let histories_id = req.params.histories_id
    console.log(histories_id)
    
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