const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load variables from .env

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3005; //just some port

const courseRouter = require("./routes/courseRoutes");
const userRouter = require("./routes/userRoutes");

const { MongoClient, ServerApiVersion } = require("mongodb");

const mongoURI = process.env.MONGO_URI;

//Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.type("text");
  res.send(
    `Hello...this is a basic backend crud server with mongodb...\n` +
      `  which works for multiple routes (\\api\\courses and \\api\\users)  \n` +
      `  where the routes are defined in separate files to keep the server clean and modular... \n`,
  );
});

async function run() {
  try {
    await client.connect();

    app.locals.db = client.db("basicBackendDBSpr2026");

    app.use("/api/courses/", courseRouter);
    app.use("/api/users/", userRouter);

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});
