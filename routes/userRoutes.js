const express = require("express");
const { ObjectId } = require("mongodb");
const { validateUser } = require("../utilities/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const db = req.app.locals.db;
  const userCollection = db.collection("users");

  try {
    let results = await userCollection.find({}).toArray();
    res.send(results).status(200);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const userCollection = db.collection("users");

  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format provided." });
  }

  const query = { _id: new ObjectId(id) };

  try {
    let result = await userCollection.findOne(query);
    if (!result) {
      return res
        .status(404)
        .json({ error: "No data found with the provided ID." });
    }

    res.send(result).status(200);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const db = req.app.locals.db;
  const userCollection = db.collection("users");

  const userInput = {
    name: req.body.name,
    email: req.body.email,
  };
  const { error, value } = validateUser(userInput);
  if (error) {
    return res.status(400).send(error.message);
  } else {
    const newUser = {
      name: userInput.name,
      email: userInput.email,
    };

    const result = await userCollection.insertOne(newUser);
    return res.send(result); //convention to send the created user
  }
});

router.delete("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const userCollection = db.collection("users");

  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await userCollection.deleteOne(query);
  res.send(result);
});

router.patch("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const userCollection = db.collection("users");

  const id = req.params.id;
  const updatedUser = {
    name: req.body.name,
    email: req.body.email,
  };

  const query = { _id: new ObjectId(id) };
  const update = {
    $set: {
      name: updatedUser.name,
      email: updatedUser.email,
    },
  };

  const result = await userCollection.updateOne(query, update);
  res.send(result);
});

module.exports = router;
