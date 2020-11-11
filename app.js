// /* CONSTANTS */
const express = require("express")
const app = express()
require('dotenv').config()
const PORT = 3000
const pgp = require("pg-promise")()
var bcrypt = require("bcryptjs")
const connectionString = process.env.CONNECTION_STRING
const db = pgp(connectionString)
const mustacheExpress = require("mustache-express")
const session = require("express-session")
const path = require("path")
const VIEWS_PATH = path.join(__dirname, "./views")
const indexRouter = require('./routes/index.js')
const dashboardRouter = require('./routes/dashboard.js')
const createRouter = require('./routes/routineCreator.js')
const workoutRouter = require('./routes/workout.js')
const historyRouter = require('./routes/history.js')
const accountRouter = require('./routes/account.js')
const functions = require('./functions')
/* CONSTANTS END*/

/* CREATING VIEWS */
app.use(express.urlencoded())
app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials", ".mustache"))
// the pages are located in views directory
app.set("views", VIEWS_PATH)
// extension will be .mustache
app.set("view engine", "mustache")
/* CREATING VIEWS END*/

/* STATIC FILES */
app.use("/css", express.static("css"))
app.use("/client", express.static("client"))
app.use("/images", express.static("images"))
/* STATIC FILES END*/

/* ROUTES */
app.use("/", indexRouter)
app.use("/dashboard", functions.authenticate, dashboardRouter)
app.use("/routineCreator", functions.authenticate, createRouter)
app.use("/workout", functions.authenticate, workoutRouter)
app.use("/account", functions.authenticate, accountRouter)
app.use("/history", functions.authenticate, historyRouter)
/* ROUTES END */


app.listen(PORT, () => {
   console.log("Server is running...")
})
