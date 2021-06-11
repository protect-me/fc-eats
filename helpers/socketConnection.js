module.exports = (io) => {
  io.on("connection", (socket) => {
    //아래 두줄로 passport의 req.user의 데이터에 접근한다.
    const session = socket.request.session.passport;
    const user = typeof session !== "undefined" ? session.user : "";

    //사용자 명과 메시지를 같이 반환한다.
    socket.on("client message", (data) => {
      io.emit("server message", {
        message: data.message,
        displayname: user.displayname,
      });
    });
  });
};
