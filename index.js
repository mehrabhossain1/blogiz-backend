const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("blogiz");
    const blogsCollection = db.collection("blogs");

    app.post("/api/v1/blogs", async (req, res) => {
      try {
        const {
          id,
          title,
          description,
          publish_date,
          author_name,
          blog_image,
          total_likes,
        } = req.body;

        // Insert the new product into the MongoDB collection
        const result = await blogsCollection.insertOne({
          id,
          title,
          description,
          publish_date,
          author_name,
          blog_image,
          total_likes,
        });

        res.status(201).json({
          message: "blog added successfully",
          blogId: result.insertedId,
        });
      } catch (error) {
        console.error("Error adding blog:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // GET route to fetch products
    app.get("/api/v1/blogs", async (req, res) => {
      try {
        const blogs = await blogsCollection.find({}).toArray();
        res.json(blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Get single blog
    app.get("/api/v1/blogs/:id", async (req, res) => {
      try {
        // const id = req.params.id;
        // console.log(id);

        // const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

        const id = req.params.id;

        // get single blog
        const blog = await blogsCollection.findOne({ id: id });
        console.log(blog);

        if (!blog) {
          return res.status(404).json({ error: "blog not found" });
        }
        res.json(blog);
      } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});
