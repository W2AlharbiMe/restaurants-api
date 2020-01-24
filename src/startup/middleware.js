const { json } = require("express");
const helmet = require("helmet");
const compression = require("compression");
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("config");
const { User } = require("../models/User");

module.exports = function(app) {
  app.use(json());
  app.use(helmet());
  app.use(compression()); // compress all responses

  // passport setup
  app.use(passport.initialize());

  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get("jwtSecretKey")
  };

  const strategy = new JwtStrategy(options, async ({ id }, done) => {
    const user = await User.findById(id);
    // TODO: need to validate the expire & add refresh token

    if (user) {
      return done(null, user.toJSON());
    }

    return done(null, false);
  });
  passport.use(strategy);

  // TODO: need global catch middleware
};
