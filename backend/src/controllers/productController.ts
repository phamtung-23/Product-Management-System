import { RequestHandler } from "express";
import Product, { IProduct } from "../models/Product";
import { clearCache } from "../services/redisService";

// Get products with pagination
export const getProducts: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);

    const total = await Product.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new product
export const createProduct: RequestHandler = async (req, res) => {
  try {
    const { name, price, category, subcategory } = req.body;

    // Basic validation
    if (!name || !price || !category || !subcategory) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Validate price
    if (isNaN(price) || price <= 0) {
      res.status(400).json({ message: "Price must be a positive number" });
      return;
    }

    const newProduct: IProduct = new Product({
      name,
      price,
      category,
      subcategory,
      likes: 0,
      likedBy: [],
    });
    const savedProduct = await newProduct.save();

    // Invalidate products cache after creating a new product
    await clearCache("products:*");

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Search products
export const searchProducts: RequestHandler = async (req, res) => {
  try {
    const query = req.query.q as string;

    if (!query) {
      res.status(400).json({ message: "Search query is required" });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Search using text index or regex
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({
      name: { $regex: query, $options: "i" },
    });
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
