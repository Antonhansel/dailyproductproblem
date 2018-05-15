let mongoose = require('mongoose')
let uniqueValidator = require('mongoose-unique-validator')
let crypto = require('crypto')
let jwt = require('jsonwebtoken')
let secret = require('../config').secret

let UserSchema = new mongoose.Schema({
  'email': { 'type': String, 'lowercase': true, 'unique': true, 'required': [ true, "can't be blank" ], 'match': [ /\S+@\S+\.\S+/, 'is invalid' ], 'index': true },
  'stripe': { type: Object}
}, { 'timestamps': true })

UserSchema.plugin(uniqueValidator, { 'message': 'is already taken.' })

mongoose.model('User', UserSchema)
