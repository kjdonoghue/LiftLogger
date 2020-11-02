/* CONSTANTS */
const express = require('express')
const app = express()
const PORT = 3000
const pgp = require('pg-promise')()
// var bcrypt = require('bcryptjs');
require('dotenv').config()
const connectionString = process.env.CONNECTION_STRING
const db = pgp(connectionString)
const mustacheExpress = require('mustache-express')
const path = require('path')
const VIEWS_PATH = path.join(__dirname, '../views' )
/* CONSTANTS */


app.use(express.urlencoded())
// app.engine('mustache',mustacheExpress())
app.engine('mustache',mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
// the pages are located in views directory
app.set('views', VIEWS_PATH)
// extension will be .mustache
app.set('view engine','mustache')

// css stylesheet
app.use("/css", express.static("css"))
app.use("/client", express.static("client"))


app.get('/',(req,res) => {
    res.render('index')
})

/* Dashboard Page */
/* Display Dashboard Page */
app.get("/dashboard", async (req, res) => {
    // THIS WILL BE CHANGED TO HISTORY
    //GET A LIST OF PAST WORKOUTS, GET COUNT OF NUMBER OF WORKOUTS IN PAST 7, 30 DAYS
    // db.any('SELECT workout_id, title, exercises FROM workouts')
    // .then(routines => {
    //     // console.log(routines)
    //     res.render('dashboard', {allRoutines: routines})
    // })
    let id = 1

    let result = await db.any('SELECT users.user_id, height, weight, workout_name, exercises FROM users JOIN histories ON users.user_id = histories.user_id WHERE users.user_id = $1', [id])
    
    user_dashboard = []

    result.forEach((item) => {
        if (user_dashboard.length == 0)  {
            let information = {user_id: item.user_id, weight: item.weight, height: item.height, workouts: [{title: item.workout_name, exercises: item.exercises}]}
            
            user_dashboard.push(information)
            
        } else {
            let information = user_dashboard.find(information => information.user_id == item.user_id)
            if (information) {
                information.workouts.push({title: item.workout_name, exercises: item.exercises}) 
            } 
        }
    })
    res.render('dashboard', {Dashboard: user_dashboard})
})

/* Routines Page */
/* Display All Routines */
app.get("/routines", (req, res) => {
    db.any('SELECT workout_id, title, exercises FROM workouts')
    .then(routines => {
        res.render('routines', {allRoutines: routines})
    })
})

// app.post("/delete-routine", (req, res) => {
//     let workout_id = req.body.workout_id

//     db.none()
   
// })


/* Go from Dashboard or Routines to Workout page after selecting workout*/
app.post("/select", (req, res) => {
    let workout_id = req.body.workout_id
    console.log(workout_id)
    db.any('SELECT workout_id, title, exercises FROM workouts WHERE workout_id= $1', [workout_id])
    .then(workout => {
        console.log(workout)
        res.render('workout', {selectedWorkout: workout})
    })

})






app.listen(PORT, () => {
   console.log('Server is running...')
})