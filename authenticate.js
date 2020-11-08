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

module.exports = authenticate