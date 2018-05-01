let mongoose = require('mongoose')
let router = require('express').Router()
let passport = require('passport')
let User = mongoose.model('User')

router.post('/register', (req, res, next) => {
  let user = new User()

  user.email = req.body.email

  user.save().then(() => {
    return res.json({ 'user':  user})
  }).catch(next)
})

module.exports = router
