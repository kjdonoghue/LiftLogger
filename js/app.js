/* CONSTANTS */
const express = require('express')
const app = express()
const PORT = 3000
const pgp = require('pg-promise')()
var bcrypt = require('bcryptjs');
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

// static files
app.use("/css", express.static("css"))
app.use("/client", express.static("client"))
app.use("/images", express.static("images"))

app.get('/',(req,res) => {
    res.render('index')
})

/* Dashboard Page */
/* Display Dashboard Page */
app.get("/dashboard", async (req, res) => {
    let id = 6
    
        let userHistory = await db.any('SELECT user_id FROM histories')   

        let found = userHistory.find(user => {
            return user.user_id == id
        })       

        if (found) {
            let result = await db.any('SELECT users.user_id, username, height, weight, workout_name, exercises FROM users JOIN histories ON users.user_id = histories.user_id WHERE users.user_id = $1 ORDER BY date_completed DESC LIMIT 7', [id])
            let count = await db.any('SELECT COUNT (*) FROM histories WHERE user_id =$1', [id])
            
            user_dashboard = getUserDetails(result, count)

            res.render('dashboard', {Dashboard: user_dashboard})
            
        } else {
            let result = await db.any('SELECT users.user_id, username, height, weight FROM users WHERE user_id=$1', [id])
            res.render('dashboard', {Dashboard: result})
        }          
    
})

//function for getting dashboard info with workouts
function getUserDetails(result, count) {
    
    user_dashboard = []

    result.forEach((item) => {
        if (user_dashboard.length == 0)  {
            let information = {user_id: item.user_id, username: item.username, weight: item.weight, height: item.height, count: count, workouts: [{title: item.workout_name, exercises: item.exercises}]}
            
            user_dashboard.push(information)
            
        } else {
            let information = user_dashboard.find(information => information.user_id == item.user_id)
            if (information) {
                information.workouts.push({title: item.workout_name, exercises: item.exercises}) 
            } 
        }
        
    })
    return user_dashboard
}


/* Routines Page */
/* Display All Routines */
app.get("/routines", (req, res) => {
    db.any('SELECT workout_id, title, exercises FROM workouts')
    .then(routines => {
        res.render('routines', {allRoutines: routines})
    })
})

app.post("/delete-routine", (req, res) => {
    let workout_id = req.body.workout_id

    db.none('DELETE FROM workouts WHERE workout_id=$1', [workout_id])
    .then(() => {
        res.redirect('routines')
    })
   
})


/* Go from Dashboard or Routines to Workout page after selecting workout*/
app.post("/select", (req, res) => {
    let workout_id = req.body.workout_id
    
    db.any('SELECT workout_id, title, exercises FROM workouts WHERE workout_id= $1', [workout_id])
    .then(workout => {
      
        res.render('workout', {selectedWorkout: workout})
    })

})


app.listen(PORT, () => {
   console.log('Server is running...')
})