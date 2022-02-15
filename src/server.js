import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
//Creating Websocket server on the top of Http server
//So you can use both protocol on the same port

const onSocketClose = () => {
  console.log("Disconnected from the Browser ❌");
};

const sockets = []; //fake db for socket <-> socket connection

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser ✅");
  socket.on("close", onSocketClose);
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);

    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
        //send back the message to frontend
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        //identifying users. Socket is basically an object
        break;
    }
  });
});

server.listen(3000, handleListen);
