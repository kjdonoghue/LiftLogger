/* CONSTANTS */
const express = require('express')
const app = express()
const PORT = 3000
const pgp = require('pg-promise')()
// var bcrypt = require('bcryptjs');
const connectionString = 'postgres://localhost:5432/mydatabase'
const db = pgp(connectionString)
const mustacheExpress = require('mustache-express')
const dashboardRouter = require('../routes/dashboard.js')
const routinesRouter = require('../routes/routines.js')

/* CONSTANTS */


app.use(express.urlencoded())
app.engine('mustache',mustacheExpress())
// the pages are located in views directory
app.set('views','./views')
// extension will be .mustache
app.set('view engine','mustache')

app.use("/dashboard", dashboardRouter)
app.use("/routines", routinesRouter)

app.get('/',(req,res) => {
    res.render('index')
})




app.listen(PORT, () => {
   console.log('Server is running...')
})