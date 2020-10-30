/* CONSTANTS */
const express = require('express')
// const app = express()
const router = express.Router()
const mustacheExpress = require('mustache-express')
const pgp = require('pg-promise')()
const connectionString ='postgres://skvpwhin:lXgkojz2TanCel7pEUUSDtGg-bEKm4NW@lallah.db.elephantsql.com:5432/skvpwhin' 
const db = pgp(connectionString)
/* CONSTANTS */

/* show dashboard main page while building functions - need to change to history */
router.get("/", (req, res) => {
    db.any('SELECT workout_id, title, exercises FROM workouts')
    .then(routines => {
        console.log(routines)
        res.render('dashboard', {allRoutines: routines})
    })
})



/* Go to clicked routines pate */
// router.post("/chooseWorkout", (req, res) => {
//     let routine_id = req.body.routine_id
    

//     res.render("/clickedRoutine", {Routine: selectedRoutine})

// })

module.exports = router