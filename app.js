const express = require("express");
const Libreria = require("./libreria");
const { Router } = express;
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const { dirname } = require("path");
const { sendFile } = require("express/lib/response");
const { SocketAddress } = require("net");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.set("views", "./views");
app.set("view engine", "ejs");

const routerDos = Router();
const router = Router();
const libreria = new Libreria();

router.get("/", (req, res) => {
  return res.json(libreria.list);
});
// routerDos.get("/", (req, res) => {
//   return res.json(libreria.list);
// });

router.get("/:id", (req, res) => {
  try {
    let id = req.params.id;
    return res.json(libreria.find(id));
  } catch (err) {
    res.json(`Producto no encontrado${err}`);
  }
});

router.post("/", (req, res) => {
  let obj = req.body;
  libreria.insert(obj);
  return res.redirect("/list");
});

routerDos.post("/", (req, res) => {
  let obj = req.body;
  libreria.insert(obj);
  return res.redirect("/api/carrito");
});

router.put("/:id", (req, res) => {
  let obj = req.body;
  let id = req.params.id;
  return res.json(libreria.update(id, obj));
});
router.delete("/:id", (req, res) => {
  let obj = req.body;
  let id = req.params.id;
  return res.json(libreria.delete(id, obj));
});

app.use("/api/productos", router);
app.use("/api/carrito", routerDos);

httpServer.listen(3000);
app.get("/", (req, res) => {
  return res.render("ejs/form", {
    list: libreria.list,
  });
});

app.get("/list", (req, res) => {
  return res.render("ejs/list", {
    list: libreria.list,
  });
});

const messages = [
  {
    author: "Christian",
    text: "En que puedo ayudarte?",
  },
];

app.use(express.static("./public"));
app.get("/chat", (req, res) => {
  res.sendFile("./public/index.html", { root: __dirname });
});

io.on("connection", (socket) => {
  console.log("new user");
  socket.emit("messages", messages);

  socket.on("new-message", (data) => {
    data.time = new Date().toLocaleTimeString();
    messages.push(data);
    io.sockets.emit("messages", [data]);
  });
});
