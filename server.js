const express = require("express");
const Product = require("./productModule");
require("dotenv").config();

const port = 5000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://maheshsolanke84:root@product.lfyfets.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.setHeader("Content-Type", "application/json");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/products", async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const existingProduct = Product.findOne({
      name: name,
      price: price,
      description: description,
    });

    if (existingProduct) {
      res.status(400).json({ error: "Product already exists" });
    } else {
      const product = new Product({ name, price, description });
      await product.save();

      res
        .status(201)
        .json({ message: "Product created successfully", product });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/products/:_id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => console.log(`server started on ${port}`));
