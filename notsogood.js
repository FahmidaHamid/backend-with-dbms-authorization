const express = require("express");
const cors = require("cors"); // npm i cors
require("dotenv").config(); // Load variables from .env

const app = express();

app.use(express.json());

app.use(cors());

const { validateCourse } = require("./utilities/validations");

const { ObjectId } = require("mongodb");

const port = 5050; //just some port
const mongoURI = process.env.MONGO_URI;

const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("basicBackendDBSpr2026"); // name of my database
    const courseCollection = db.collection("coursesSpr2026"); //name of my collection

    app.get("/api/courses", async (req, res) => {
      try {
        let results = await courseCollection.find({}).toArray();
        res.send(results).status(200);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    app.get("/api/courses/:id", async (req, res) => {
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

    app.post("/api/courses", async (req, res) => {
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

        const result = await courseCollection.insertOne(newCourse);
        return res.send(result); //convention
      }
    });

    app.delete("/api/courses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await courseCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/api/courses/:id", async (req, res) => {
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

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
}
run().catch(console.dir); //run () will run until your server is terminated/down

app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});
