# Phase 01) Establishing Connection with MongoDB

## MongoDB Basics

- https://www.mongodb.com/docs/manual/

- MongoDB is a document database designed to help developers build modern applications faster. It stores data in flexible, JSON-like documents, making it easy to model data the same way your application code uses it.

- The flexible schema lets you evolve your data model without downtime, iterate quickly, and easily handle non-uniform data.

```json
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "Alice",
  birthdate: ISODate("1990-01-01T00:00:00Z"),
  address: {
    street: "123 Main St",
    city: "Springfield",
    state: "IL"
  },
  hobbies: ["reading", "hiking", "coding"]
}


```

- A group of these documents is called a “collection” (similar to a table).

- MongoDB is popular because:
  - It is easy to use with JavaScript and Node.js
  - Documents can have different fields; you do not need a fixed schema
  - It works well for web apps, APIs, and rapidly changing projects
  - It can scale to large amounts of data and traffic.

- **MongoDB Atlas** is the cloud-hosted version of MongoDB. Instead of installing MongoDB on your own computer or server, MongoDB Atlas hosts the database for you on cloud providers such as Amazon Web Services, Google Cloud Platform, or Microsoft Azure.

- Atlas handles things like:
  - Creating and hosting your database
  - Providing Security and user accounts
  - Keeping Backups
  - Scaling when your app grows
  - Monitoring and performance

- So the difference is:
  - MongoDB => the database software itself
  - MongoDB Atlas => an online service that runs MongoDB for us

- For our **Node.js/Express CRUD server**, Atlas is usually the easiest choice because we can create a free database online and connect our app to it with a connection string like:

```javascript

mongodb+srv://username:password@cluster.mongodb.net/myDatabase

```

- Note:

- MongoDB Atlas is **not** usually considered a full Backend-as-a-Service (BaaS) like Firebase or Supabase.

- MongoDB Atlas is primarily a **Database-as-a-Service (DBaaS)**: it gives us a hosted MongoDB database in the cloud, plus tools for backups, scaling, security, monitoring, and clustering.

- A typical BaaS platform usually also provides things such as:
  - Authentication / user management
  - Serverless functions
  - File storage
  - Push notifications
  - Realtime APIs
  - Built-in backend logic

- For our Node.js/Express project, the common setup is:
  - Express = our backend logic / API
  - MongoDB Atlas = our cloud database

- So Atlas replaces the local JSON array or local database file, but we still build the backend yourself in Express.

## How to Setup \& Use MongoDB

### 1) Register for a MongoDB Atlas Account

- Go to `https://cloud.mongodb.com/`

- Navigate to the MongoDB Atlas registration page.

- Sign up using your email address, or use your Google/GitHub account.

- Accept the Terms of Service and Privacy Policy.

### 2) Create a Free Cluster (M0)

- We will stick to the free tier. Once logged in, select the "Shared Tier" option (M0), which is free forever for small projects.
  - Choose a cloud provider (AWS, Google Cloud, or Azure) and a region close to you.

  - Name your cluster (e.g., "Cluster0") and click "Create Deployment".

### 3) Configure Database Security

- You will find **Security** [on the LeftSide Bar], click "Security QuickStart" and do the followings:
  - **Create a Database User:** (How would you like to authenticate your connection?)
    - Choose UserName and Password, provide the information, also save it in a local file (in case you forget), Choose "admin" role for the user.

    - Remember: You will be able to create more users later.

  - **Configure IP Access List:** (Where would you like to connect from?)
    - Under the "Network Access" tab, click "Add IP Address".
    - Click "Allow Access From Anywhere" (0.0.0.0/0) for ease of use, or select "Add Current IP Address" to only allow your current location.
    - Or, Choose "MyLocal Environment"

### 4) Connect to Your Cluster

- Navigate to the "Database" tab and click the "Connect" button on your cluster.

- Choose your connection method: (I usually do "Drivers")

- I run the following command on your terminal (VS Code, where you wrote the backend server last Friday)

  ```javascript
  npm install mongodb
  ```

- Then I will copy the code sample inside my `index.js` file (the one we wrote in last class). Note that `<db_username>` and `<db_password>` should be replaced with your `username` and `password` you created for the admin user during configuration.

- You should later hide these sensitive information by putting them in `.env` files.

## What does my `index.js` file look like?

```javascript
const express = require("express");

const cors = require("cors"); // npm i cors
// Cross-Origin Resource Sharing (CORS).
// cors: It allows or restricts web browsers from requesting resources (API data) from your server on behalf of a different domain (origin)

const app = express();

app.use(express.json());
// built-in middleware, json(): to parse the body of requests with a JSON payload

app.use(cors());

// this is the same 'validations.js' file we wrote in last class

const { validateCourse } = require("./utilities/validations");

const { ObjectId } = require("mongodb");
//will import ObjectId and related functions

const port = process.env.PORT || 3005; //just some port

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://<username>:<password>@cluster0.0laypje.mongodb.net/?appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
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
```

- If you have configured your MongoDB account and the cluster properly, a similar code should work.

- BTW, I used Google AI to generate some fake data for my `coursesSpr2026` collection. (We don't need to provide the ids, MongoDB will create them.)

- Sample data in my collection:

```javascript
{
  "_id": {
    "$oid": "69d2d774fea6f1cf15ce932f"
  },
  "coursename": "Introduction to Psychology",
  "enrollment": 450
}
```

- Once the code runs, you may use POSTMAN to test the API ends (get, post, put, delete) and check if the database (your collection on MongoDB) is updated accordingly or not.

- You may ask the AI to populate fake data (JSON array) for your project (given you specify the field names) and then drop them in your MongoDB.

- You will have to learn/familiarize yourself with the MongoDB specific functions (like, find, findOne, insert, insertOne, etc.)

- Here is a good source:

- https://www.mongodb.com/docs/manual/core/databases-and-collections/

- Google and ChatGPT are also helpful if we can ask the question properly/unambiguously.

- ** I Hope this helps you one step forward towards Project 02.**
- Note:
  - We will be following more-or-less an MVC (Model-View-Controller) style for the project:
    - Model (mostly, Database <MongoDB and Mongoose>)
    - View (Frontend <React>)
    - Controller (Backend Logic <NodeJS, Express>)
- You may also call it a MERN (MongoDB, Express, React, Node.js) stack

# Phase 02) A Server with Multiple Routes and Accessting Multiple Collections from MongoDB Database

The provided code shows us a more structured way of defining the server side logic.

### Project Structure

```mermaid
graph TD;

BACKEND-WITH-DBMS-AUTHORIZATION --> server.js;


```
