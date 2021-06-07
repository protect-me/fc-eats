const { Router } = require("express");
const router = Router();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const models = require("../../models");

const dotenv = require("dotenv");
dotenv.config(); // LOAD CONFIG

passport.use(
  new FacebookStrategy(
    {
      // https://developers.facebook.com에서 appId 및 scretID 발급
      clientID: process.env.FACEBOOK_APPID, //입력하세요
      clientSecret: process.env.FACEBOOK_SECRETCODE, //입력하세요.
      callbackURL: `${process.env.SITE_DOMAIN}/auth/facebook/callback`,
      profileFields: ["id", "displayName", "photos", "email"], //받고 싶은 필드 나열
    },
    async (accessToken, refreshToken, profile, done) => {
      //아래 하나씩 찍어보면서 데이터를 참고해주세요.
      //console.log(accessToken);
      // console.log(profile);
      //console.log(profile.displayName);
      //console.log(profile.emails[0].value);
      //console.log(profile._raw);
      //console.log(profile._json);

      try {
        const username = `fb_${profile.id}`; // 다른 소셜로그인과 겹치지 않게 하기 위해 앞에 `fb_`를 추가
        const exist = await models.User.count({
          where: {
            username,
          },
        });
        if (!exist) {
          user = await models.User.create({
            username,
            displayname: profile.displayName,
            password: "facebook",
            // 개선 필요
            // allow Null 이 false라서 일단 넣어야하는 값이라 일단 넣어놨지만, 보안상 문제.
            // type field를 추가해서 입력한 아이디가 이메일인지 뭔지 확인하는 식으로 개선
          });
        } else {
          user = await models.User.findOne({
            where: {
              username,
            },
          });
        }
        return done(null, user);
      } catch (e) {
        console.log(e);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get("/facebook", passport.authenticate("facebook", { scope: "email" }));

//후 페이스북에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/facebook/success",
    failureRedirect: "/auth/facebook/fail",
  })
);

//로그인 성공시 이동할 주소
router.get("/facebook/success", (req, res) => {
  res.send(req.user);
});
router.get("/facebook/fail", (req, res) => {
  res.send("facebook login fail");
});

module.exports = router;
