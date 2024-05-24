const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');

module.exports = (passport) => {
    passport.use(new LocalStrategy( {usernameField: 'email'}, (email, password, done) => {
        User.findOne({email: email})
        .then(user => {
            if(!user) {
                return done(null, false, {msg: 'Email is not registered'});
            }
            /* maybe check for verification here */
            if(!user.isVerified) {
                return done(null, false, {msg: 'Must verify email to login.'});
            }

            bcrypt.compare(password.trim(), user.password, (err, isMatch) => {
                if(err) {
                    throw err;
                }
                if(isMatch) {
                    return done(null, user);
                }
                else {
                    // console.log('wrong passwrod: ', password);
                    return done(null, false, { msg: 'Password is incorrect' });
                }
            });
        })
    } ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    })
}