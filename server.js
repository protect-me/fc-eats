const app = require("./app.js");
const port = 3000;

const server = app.listen(port, function () {
  console.log("Express listening on port", port);
});
const listen = require("socket.io");
const io = listen(server);
// const socketConnection = require("./helpers/socketConnection");
// socketConnection(io);
require("./helpers/socketConnection")(io);
