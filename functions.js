// /* CONSTANTS */
const express = require("express")
const pgp = require("pg-promise")()
const connectionString = process.env.CONNECTION_STRING
const db = pgp(connectionString)
/* CONSTANTS END*/

//authenticate session
function authenticate(req, res, next) {
    if (req.session) {
       if (req.session.username) {
          // continue with the original request
          next()
       } else {
          res.redirect("/login")
       }
    } else {
       res.redirect("/login")
    }
}


//to create list of user and workout information for dashboard 
 function getUserDetails(result, count, week) {
    user_dashboard = []

    result.forEach((item) => {
        if (user_dashboard.length == 0)  {
            let information = {user_id: item.user_id, username: item.username, weight: item.weight, height: item.height, age: item.age, goal: item.goal, count: count, week: week, workouts: [{title: item.title, exercises: item.exercises, workout_id: item.workout_id}]}
            
            user_dashboard.push(information)
            
        } else {
            let information = user_dashboard.find(information => information.user_id == item.user_id)
            if (information) {
                information.workouts.push({title: item.title, exercises: item.exercises, workout_id: item.workout_id}) 
            } 
        }
        
    })
    return user_dashboard
} 

//  to get total historical workout count
 async function getTotal(id) {
    let count = await db.any("SELECT COUNT (*) FROM histories WHERE user_id =$1", [id])
    return count
 }
 
 // to get weekly historical workout count
 async function getTotalByDate(id, days) {
    let today = new Date()
    let date = getDate(days)
    let countByDate = await db.any('SELECT COUNT (*) FROM histories WHERE user_id =$1 AND date BETWEEN $2 AND $3', [id, date, today])
    return countByDate
 }
 
 //to calculate the date for weekly workout count
 function getDate(days) {
    var dateObj = new Date()
 
    dateObj.setDate(dateObj.getDate() - days)
 
    return dateObj
 }
 
 module.exports = {authenticate, getUserDetails, getTotal, getTotalByDate}
