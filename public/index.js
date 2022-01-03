const socket = io();

socket.on("messages", (data) => {
  console.log(data);
  render(data);
});

function render(data) {
  data.forEach((info) => {
    $("#messages").prepend(`
        <div>
        <strong>${info.author} : </strong>
        [${info.time}] 
        <em>${info.text}</em>
        </div>`);
  });
}

$("#myForm").submit((e) => {
  e.preventDefault();

  const mensaje = {
    author: $("#email").val(),
    text: $("#text").val(),
  };

  socket.emit("new-message", mensaje);
});
