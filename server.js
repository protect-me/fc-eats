const app = require("./app.js");
const port = 3000;

const server = app.listen(port, function () {
  console.log("Express listening on port", port);
});
const listen = require("socket.io");
const io = listen(server);

io.on("connection", (socket) => {
  console.log("소켓서버접속");
  socket.on("client message", (data) => {
    io.emit("server message", data.message);
  });
});
