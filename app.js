const express = require("express");
const Sequelize = require("sequelize");

const app = express();
const PORT = 5050;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const connection = new Sequelize("todosDB", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3333
});

const Todo = connection.define("Todo", {
  name: Sequelize.STRING
});

app.get("/notes", (req, res) => {
  Todo.findAll()
    .then(resp => {
      res.json(resp).status(200);
    })
    .catch(err => {
      res.json({ error: JSON.stringify(err) }).status(400);
    });
});

app.post("/note", (req, res) => {
  const note = new Todo();
  note.name = req.body.name;

  note
    .save()
    .then(note => {
      res.json(note).status(200);
    })
    .catch(err => {
      res.json({ error: JSON.stringify(err) }).status(400);
    });
});

app.get("/note/:id", (req, res) => {
  Todo.findByPk(req.params.id)
    .then(note => {
      res.json(note).status(200);
    })
    .catch(err => {
      res.json({ error: JSON.stringify(err) }).status(400);
    });
});

app.put("/note/:id", (req, res) => {
  Todo.update(req.body, {
    where: { id: req.params.id }
  })
    .then(() => {
      Todo.findByPk(req.params.id).then(note => {
        res.json(note).status(200);
      });
    })
    .catch(err => {
      res.json({ error: JSON.stringify(err) }).status(400);
    });
});

app.delete("/note/:id", (req, res) => {
  Todo.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(rows => {
      res.json(rows).status(200);
    })
    .catch(err => {
      res.json({ error: JSON.stringify(err) }).status(400);
    });
});

connection
  .sync({
    logging: console.log,
    force: true
  })
  .then(() => {
    console.log("Connection success");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch(err => {
    console.log("Connection failed", err);
  });
