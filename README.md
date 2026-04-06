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
