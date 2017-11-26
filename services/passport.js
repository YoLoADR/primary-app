const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('user');

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
}, 
function(accessToken, refreshToken, profile, cb) {
  console.log("Success code Google accessToken : ", accessToken);
  console.log("Success code Google profile : ", profile);
  let user = new User({googleId: profile.id, displayName: profile.displayName}).save(()=>{
    console.log(user, "save from google");
  });
  // User.findOrCreate({facebookId: profile.id, displayName: profile.displayName}, function (err, user) {
  //   return cb(err, user);
  // });
}));


passport.use(new FacebookStrategy({
    clientID: keys.facebookClientID,
    clientSecret: keys.facebookClientSecret,
    callbackURL: "http://localhost:5000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("Success code FACEBOOK : ", accessToken);
    console.log("Success code FACEBOOK profile: ", profile);
    let user = new User({facebookId: profile.id, displayName: profile.displayName});
    user.save(()=>{
      console.log(user, "save from facebook");
    });
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
  }
));