const auth = function(req, res, next) {
    if (req.isAuthenticated()) { 
        return next()
    }
    else{
        res.status(400).send("Please Login")
    }
}

module.exports = auth