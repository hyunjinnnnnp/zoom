const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", { payload: input.value }, (msg) => {
    console.log("server says", msg);
  });
  //event name, payload(s)..., callback
  input.value = "";
};

form.addEventListener("submit", handleRoomSubmit);
