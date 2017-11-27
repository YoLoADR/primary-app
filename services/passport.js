const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('user');

passport.serializeUser((user, done)=>{
  done(null, user.id);
});

passport.deserializeUser((id, done)=>{
  User.findById(id).then(user => {
      done(null, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) =>{
   
    User.findOne({googleId: profile.id})
    .then((existingUser)=>{
      if(existingUser){
        //User already exist
        done(null, existingUser);
      }else{
        // User doesn't exist, we can creat this one
        let user = new User({googleId: profile.id, displayName: profile.displayName}).save((data)=>{
          // Informed to passport method that it is finish
          done(null, data);
        });
      }
    });
}));



passport.use(new FacebookStrategy({
    clientID: keys.facebookClientID,
    clientSecret: keys.facebookClientSecret,
    callbackURL: "/auth/facebook/callback"
  }, function(accessToken, refreshToken, profile, done) {
    
    User.findOne({facebookId: profile.id})
    .then((existingUser)=>{
      if(existingUser){
        done(null, existingUser);
      }else{
        // User doesn't exist, we can creat this one
        let user = new User({facebookId: profile.id, displayName: profile.displayName});
        user.save((newUser)=>{
          done(null, existingUser);
        });
      }
    });
  }
));