module.exports = (io) => {
  io.on("connection", (socket) => {
    // console.log("소켓서버접속");
    socket.on("client message", (data) => {
      io.emit("server message", data.message);
    });
  });
};
