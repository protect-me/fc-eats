const express = require("express");
const nunjucks = require("nunjucks");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const flash = require("connect-flash");

// passport 관련
const passport = require("passport");
const session = require("express-session");

// db 관련
const db = require("./models");

class App {
  constructor() {
    this.app = express();

    // db 접속
    this.dbConnection();

    // 뷰엔진 셋팅
    this.setViewEngine();

    // 세선설정
    this.setSession();

    // 미들웨어 셋팅
    this.setMiddleWare();

    // 정적 디렉토리 추가
    this.setStatic();

    // 로컬 변수
    this.setLocals();

    // 라우팅
    this.getRouting();

    // 404 페이지를 찾을수가 없음
    this.status404();

    // 에러처리
    this.errorHandler();
  }

  dbConnection() {
    // DB authentication
    db.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
        return db.sequelize.sync();
      })
      .then(() => {
        console.log("DB Sync complete.");
      })
      .catch((err) => {
        console.error("Unable to connect to the database:", err);
      });
  }

  setMiddleWare() {
    // 미들웨어 셋팅
    this.app.use(logger("dev"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookieParser());
  }

  setViewEngine() {
    nunjucks.configure("template", {
      autoescape: true,
      express: this.app,
    });
  }

  setSession() {
    const SequelizeStore = require("connect-session-sequelize")(session.Store);

    //session 관련 셋팅
    this.app.sessionMiddleWare = session({
      secret: "fastcampus",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 2000 * 60 * 60, //지속시간 2시간
      },
      store: new SequelizeStore({
        db: db.sequelize,
      }),
    });
    this.app.use(this.app.sessionMiddleWare);

    //passport 적용
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    //플래시 메시지 관련
    this.app.use(flash());
  }

  setStatic() {
    this.app.use("/uploads", express.static("uploads"));
    this.app.use("/static", express.static("static"));
  }

  setLocals() {
    // 템플릿 변수
    this.app.use((req, res, next) => {
      this.app.locals.isLogin = req.isAuthenticated();
      this.app.locals.currentUser = req.user;
      this.app.locals.req_path = req.path;
      // get 변수 받기
      this.app.locals.req_query = req.query;
      // 지도 API 키
      this.app.locals.map_api = {
        KAKAO_JAVASCRIPT_KEY: process.env.KAKAO_JAVASCRIPT_KEY,
        default: {
          lat: process.env.DEFAULT_LATITUDE,
          lng: process.env.DEFAULT_LONGITUDE,
        },
      };
      next();
    });
  }

  getRouting() {
    this.app.use(require("./controllers"));
  }

  status404() {
    this.app.use((req, res, _) => {
      res.status(404).render("common/404.html");
    });
  }

  errorHandler() {
    // this.app.use( (err, req, res,  _ ) => {
    //     res.status(500).render('common/500.html')
    // });
  }
}

module.exports = new App().app;
