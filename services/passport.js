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
  User.findOne({googleId: profile.id})
    .then((existingUser)=>{
      if(existingUser){
        console.log("User already exist :", existingUser);
      }else{
        // User doesn't exist, we can creat this one
        let user = new User({googleId: profile.id, displayName: profile.displayName}).save(()=>{
          console.log(user, "save from google");
        });
      }
    });
}));


passport.use(new FacebookStrategy({
    clientID: keys.facebookClientID,
    clientSecret: keys.facebookClientSecret,
    callbackURL: "http://localhost:5000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("Success code FACEBOOK : ", accessToken);
    console.log("Success code FACEBOOK profile: ", profile);
    
    User.findOne({facebookId: profile.id})
    .then((existingUser)=>{
      if(existingUser){
        done(null, existingUser);
      }else{
        // User doesn't exist, we can creat this one
        let user = new User({facebookId: profile.id, displayName: profile.displayName});
        user.save((newUser)=>{
          done(null, newUser);
        });
      }
    });
  }
));