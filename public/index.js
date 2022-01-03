const socket = io();

socket.on("messages", (data) => {
  console.log(data);
  render(data);
});

function render(data) {
  data.forEach((info) => {
    $("#messages").prepend(`
        <div>
        <strong${info.author}</strong>
        <em>${info.text}</em>
        </div>`);
  });
}

$("#myForm").submit((e) => {
  e.preventDefault(e);
  const mensaje = {
    author: $("#username").val(),
    text: $("#texto").val(),
  };

  socket.emit("new-message", mensaje);
});
