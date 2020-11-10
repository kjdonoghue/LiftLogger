// /* CONSTANTS */
const express = require("express")
const pgp = require("pg-promise")()
require('dotenv').config()
const connectionString = process.env.CONNECTION_STRING
const db = pgp(connectionString)
const router = express.Router()
const functions = require('../functions')
/* CONSTANTS END*/

/***************************** DASHBOARD  ***************************** */
router.get("/", async (req, res) => {
    let id = req.session.userId
               
         let userWorkouts = await db.any('SELECT user_id FROM workouts')   
 
         let found = userWorkouts.find(user => {
             return user.user_id == id
         })       
 
         if (found) {
             let result = await db.any('SELECT users.user_id, username, height, weight, age, goal, workout_id, title, exercises FROM users JOIN workouts ON users.user_id = workouts.user_id WHERE users.user_id = $1', [id])
             let count = await functions.getTotal(id)
             let week = await functions.getTotalByDate(id, 7)
             user_dashboard = functions.getUserDetails(result, count, week)
 
             res.render('dashboard', {Dashboard: user_dashboard})
             
         } else {
             let result = await db.any('SELECT users.user_id, username, height, weight, age, goal FROM users WHERE user_id=$1', [id])
             res.render('dashboard', {Dashboard: result})
         }          
     
 })
 
router.post("/delete-routine", (req, res) => {
    let workout_id = req.body.workout_id
 
     db.none('DELETE FROM workouts WHERE workout_id=$1', [workout_id])
     .then(() => {
         res.redirect('dashboard')
     })
    
 })
 
/***************************** DASHBOARD END ***************************** */
 
/****************** HISTORY PAGE ********************** */
  router.get("/history", async (req, res) => {
    let id = req.session.userId
                  
    let result = await db.any("SELECT user_id, title, histories_wid, exercises, TO_CHAR(date, 'DD/MM/YYYY') as date, histories_id FROM histories WHERE user_id = $1 ORDER BY histories_id DESC", [id]) 
  
    console.log(result)
    res.render('history', {History: result})        
 })
 
 /****************** HISTORY PAGE END ********************** */

 module.exports = router