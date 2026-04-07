const express = require("express");
const { validateCourse } = require("../utilities/validations");
const { ObjectId } = require("mongodb");

const router = express.Router();

router.get("/", async (req, res) => {
  const db = req.app.locals.db;
  const courseCollection = db.collection("coursesSpr2026");
  try {
    let results = await courseCollection.find({}).toArray();
    res.send(results).status(200);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const courseCollection = db.collection("coursesSpr2026");
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format provided." });
  }

  const query = { _id: new ObjectId(id) };

  try {
    let result = await courseCollection.findOne(query);
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
  const courseCollection = db.collection("coursesSpr2026");
  const userInput = {
    coursename: req.body.coursename,
    enrollment: req.body.enrollment,
  };
  const { error, value } = validateCourse(userInput);
  if (error) {
    return res.status(400).send(error.message);
  } else {
    const newCourse = {
      coursename: userInput.coursename,
      enrollment: userInput.enrollment,
    };
    //courses.push(newCourse);
    const result = await courseCollection.insertOne(newCourse);
    return res.send(result); //convention
  }
});

router.delete("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const courseCollection = db.collection("coursesSpr2026");
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await courseCollection.deleteOne(query);
  res.send(result);
});

router.patch("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const courseCollection = db.collection("coursesSpr2026");
  const id = req.params.id;
  const updatedCourse = {
    coursename: req.body.coursename,
    enrollment: req.body.enrollment,
  };

  const query = { _id: new ObjectId(id) };
  const update = {
    $set: {
      coursename: updatedCourse.coursename,
      enrollment: updatedCourse.enrollment,
    },
  };

  const result = await courseCollection.updateOne(query, update);
  res.send(result);
});

module.exports = router;
