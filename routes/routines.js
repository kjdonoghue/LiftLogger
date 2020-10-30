/* CONSTANTS */
const express = require('express')
// const app = express()
const router = express.Router()
const mustacheExpress = require('mustache-express')
const pgp = require('pg-promise')()
const connectionString ='postgres://skvpwhin:lXgkojz2TanCel7pEUUSDtGg-bEKm4NW@lallah.db.elephantsql.com:5432/skvpwhin' 
const db = pgp(connectionString)
/* CONSTANTS */


/* Display All Routines Page */
router.get("/", (req, res) => {
    db.any('SELECT workout_id, title, exercises FROM workouts')
    .then(routines => {
        res.render('routines', {allRoutines: routines})
    })
})


module.exports = router