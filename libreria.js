const fs = require("fs");

class Libreria {
  constructor(filename = "libros.json") {
    this.id = 0;
    this.list = [];
    this.filename = filename;

    this.init();
  }

  init() {
    const data = fs.readFileSync(this.filename);
    const listaFromFile = JSON.parse(data);
    for (const obj of listaFromFile) {
      this.insert(obj);
    }
  }
  find(id) {
    return this.list.find((obj) => obj.id == id);
  }
  delete(id, obj) {
    const index = this.list.findIndex((objT) => objT.id == id);
    obj.id = this.list[index].id;
    this.list[index] = obj;
    return (obj = []);
  }

  insert(obj) {
    obj.id = ++this.id;
    this.list.push(obj);
    return obj;
  }

  update(id, obj) {
    const index = this.list.findIndex((objT) => objT.id == id);
    obj.id = this.list[index].id;
    this.list[index] = obj;
    return obj;
  }
}

module.exports = Libreria;
