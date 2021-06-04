const { Router } = require("express");
const router = Router();
const ctrl = require("./accounts.ctrl");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passwordHash = require("../../helpers/passwordHash");
const models = require("../../models");

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
        // attributes: { exclude: ['password'] }
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
  done(null, user);
});

router.get("/join", ctrl.get_join);
router.post("/join", ctrl.post_join);

router.get("/login", ctrl.get_login);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/accounts/login",
    failureFlash: true,
  }),
  ctrl.post_login
);

// session 을 보기 위해서
router.get("/success", ctrl.get_success);

// 로그아웃 url 추가
router.get("/logout", ctrl.get_logout);

module.exports = router;
