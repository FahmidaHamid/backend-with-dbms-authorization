# MongoDB Basics

- MongoDB is a `NoSQL` database. Instead of storing data in tables with rows and columns like a traditional SQL database such as `MySQL`, **MongoDB** stores data as flexible, JSON-like "documents."

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "age": 25
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
  - Security and user accounts
  - Backups
  - Scaling when your app grows
  - Monitoring and performance

- So the difference is:
  - MongoDB = the database software itself
  - MongoDB Atlas = an online service that runs MongoDB for us

- For our Node.js/Express CRUD server, Atlas is usually the easiest choice because we can create a free database online and connect our app to it with a connection string like:

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

# How to Use MongoDB

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
        - Under the "Network Access" tab, click "Add IP Address". Click "Allow Access From Anywhere" (0.0.0.0/0) for ease of use, or select "Add Current IP Address" to only allow your current location.
        - Or, Choose "MyLocal Environment"

### 4) Connect to Your Cluster

- Navigate to the "Database" tab and click the "Connect" button on your cluster.
- Choose your connection method: (I usually do "Drivers")
- I run the following command on my terminal (VS Code, where I wrote my backend server)
  ```javascript
  npm install mongodb
  ```
- Then I will copy the code sample inside my `index.js` file (the one we wrote in last class). Note that `<db_username>` and `<db_password>` should be replaced with your username and password you created for the admin user during configuration.
- You should later hide these sensitive information by putting them in .env files.

```javascript
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://<db_username>:<db_password>@cluster0.0laypje.mongodb.net/?appName=Cluster0";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
```
