/* CONSTANTS */
const express = require('express')
const app = express()
const PORT = 3000
const pgp = require('pg-promise')()
var bcrypt = require('bcryptjs');
const connectionString = 'postgres://skvpwhin:lXgkojz2TanCel7pEUUSDtGg-bEKm4NW@lallah.db.elephantsql.com:5432/skvpwhin'
const db = pgp(connectionString)
const mustacheExpress = require('mustache-express')
/* CONSTANTS */


app.use(express.urlencoded())
app.engine('mustache', mustacheExpress())
// the pages are located in views directory
app.set('views', './views')
// extension will be .mustache
app.set('view engine', 'mustache')


app.get('/', (req, res) => {
    res.render('index')
})



// Routine creator - Dom


// posting the created routine to the wokouts table
app.post('/creatingRoutine', (req, res) => {
    const title = req.body.title
    const exercises = req.body.exercises

    db.none('INSERT INTO workouts (title, exercises) VALUES ($1, $2)', [title, exercises])
        .then(() => {
            res.redirect('/')
        })
})


app.post('/routineCreator/bodyPart', (req, res) => {
    const body_part = req.body.body_part



    db.any('SELECT title, body_part, equipment_need FROM exercises WHERE body_part LIKE \'%$1#%\';', [body_part])
        .then((filter) => {
            res.render('routineCreator', { allExercises: filter })
        })

 

})

// get request to pull the exercises 
app.get('/routineCreator', (req, res) => {
    db.any('SELECT title, body_part, equipment_need FROM exercises;')
        .then(exercise => {
            res.render('routineCreator', { allExercises: exercise })
        })
})


app.listen(PORT, () => {
    console.log('Server is running...')
})


