const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passwordHash = require("../helpers/passwordHash");
const models = require("../models");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username", // login.html > name="username"
      passwordField: "password", // login.html > name="password"
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      // 조회
      const user = await models.User.findOne({
        where: {
          username,
          password: passwordHash(password),
        },
        attributes: { exclude: ["password"] }, // 사용자 비밀번호 가리기
      });

      if (!user) {
        // 유저에서 조회되지 않을시
        return done(null, false, {
          message: "일치하는 아이디 패스워드가 존재하지 않습니다.",
        });
      } else {
        // 유저에서 조회 되면 세션등록쪽으로 데이터를 넘김
        return done(null, user.dataValues);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializeUser");
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("deserializeUser");

  // 사용자 비밀번호 가리기
  // 상단의 attributes: { exclude: ["password"] }, 에서 처리하거나 여기서 하거나
  // user.password = "";

  done(null, user);
});

module.exports = passport;
