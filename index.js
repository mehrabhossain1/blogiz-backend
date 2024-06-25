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

    app.post("/api/v1/products", async (req, res) => {
      try {
        const { image, title, price, ratings, brand, description, flashSale } =
          req.body;

        // Insert the new product into the MongoDB collection
        const result = await collection.insertOne({
          image,
          title,
          price,
          ratings,
          brand,
          description,
          flashSale,
        });

        res.status(201).json({
          message: "Product added successfully",
          productId: result.insertedId,
        });
      } catch (error) {
        console.error("Error adding product:", error);
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

    app.get("/api/v1/products/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const product = await collection.findOne({ _id: new ObjectId(id) });

        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
      } catch (error) {
        console.error("Error fetching product:", error);
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
