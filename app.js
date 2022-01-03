const express = require("express");
const Libreria = require("./libreria");
const { Router } = express;
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const { dirname } = require("path");

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

const router = Router();
const libreria = new Libreria();

router.get("/", (req, res) => {
  return res.json(libreria.list);
});

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
    author: "Pablo",
    text: "desfusa",
  },
];

app.use(express.static("./public"));
app.get("/chat", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

io.on("connection", (socket) => {
  console.log("new user");
  socket.emit("messages", messages);
});
io.on("new-message", (data) => {
  messages.push(data);
  io.sockets.emit("messages", [data]);
});
