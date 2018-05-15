let mongoose = require('mongoose')
let router = require('express').Router()
let passport = require('passport')
let User = mongoose.model('User')
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

var stripe = require('stripe')(keySecret);

router.post('/payment', async (req, res, next) => {
  const user = await User.findOne({email: req.body.email});
  if (!user) {
    return res.send({error: 'user not found'});
  }
  let amount = 1000;
  const customer = await stripe.customers.create({
     email: req.body.email,
    source: req.body.id
  });
  const charge = await stripe.charges.create({
    amount,
    description: "DailyProductProblem Abonnement",
      currency: "eur",
      customer: customer.id
  })
  user.stripe = {
    customer,
    charge
  };
  await user.save();
  res.send(200)
})

router.post('/register', (req, res, next) => {
  let user = new User()

  user.email = req.body.email

  user.save().then(() => {
    return res.send(200)
  }).catch(next)
})

module.exports = router
