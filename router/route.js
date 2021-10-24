const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const multer = require('multer')
const sharp = require('sharp')

const router = express.Router()

const User = require('../db/db')
const auth = require('../middleware/auth')
const { update } = require('../db/db')

const upload = multer({
    limits: {
        fileSize: 1000000
    }, 
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})


router.get('/', (req, res) => {
    res.send("Welcome to home Page")
})

//User Add

router.post("/register", upload.single('profileImg'), async (req, res) => {
    console.log(req.body)
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        profileImg: buffer
    })

    await User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err)
            res.status(400).send(err.message)
        }
        passport.authenticate("local")(req, res, function() {
            res.status(200).send(newUser)
        })
    })
})

//Loging in user

// router.post('/login', passport.authenticate('userLocal', {
//     successRedirect: "/secretRoute",
//     failureRedirect: "/codeSucks"
// }), function (err, req, res) {
//     res.status(400).send(res)
//     console.log(err)
// })

router.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
      });
    
      req.login(user, function(err){
        if (err) {
          console.log(err);
        } else {
          passport.authenticate("local")(req, res, function(){
            res.redirect("/secretRoute");
          });
        }
      });
})

//secret Route
router.get('/secretRoute',auth ,(req, res) => {
    res.send("Boom the authentication actually works")
})

//code sucks
router.get('/codeSucks', (req, res) => {
    res.send("Nah! it's not working")
})

//dashboard
router.get('/dashboard', auth, (req, res) => {
    res.send(`Hello ${req.user.username}. your session ID ${req.sessionID}
    and your session expires in ${req.session.cookie.maxAge}
    milliseconds.<br><br>
    <a href="/logout">Log Out</a><br><br>
    <a href="/secret">Members Only</a>`)
})

router.get('/logout', (req, res) =>{
    req.logOut()
    res.redirect('/')
})

//about user route

router.get('/user/about', auth, async (req, res) => {
    try {
        res.send(req.user)
    } catch {
        res.send("please login!")
    }
})

router.patch('/user/edit', auth, async (req, res) => {
    

    try {

        const updates = Object.keys(req.body)
        const allowedUpdates = ["firstName", "lastName", "email", "password"]
        const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
        )
    
        if (!isValidOperation) {
            return res.send(400).send({ error: "Invalid updates!" })
        }

        User.find({ username: req.user.username }).then((user) => {
            res.send(user)
        })
    } catch(e) {
        res.status(400).send(e)
        console.log(e)
    }
})

module.exports = router