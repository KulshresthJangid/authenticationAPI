require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const dbConnection = require('./db/connection')
const User = require('./db/db')
const userRoutes = require('./router/route')

const app = express()

app.use(express.json())

app.use(require("express-session")({
    secret: "abcd",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
// passport.use('userLocal', new LocalStrategy(User.authenticate))

passport.serializeUser(function(user, done) {
    done(null, user)
})

passport.deserializeUser(function(user, done) {
    if(user!=null)
    done(null, user)
})

app.use(userRoutes)

const port = process.env.PORT || 3000

app.listen(port, () =>{
    console.log(`Server is up and running on port ${port}`)
})