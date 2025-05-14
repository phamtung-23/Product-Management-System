import { RequestHandler } from "express";
import Product, { IProduct } from "../models/Product";
import { clearCache } from "../services/redisService";
import i18next from "i18next";

// Get products with pagination
export const getProducts: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const language = req.language || "en"; // Get preferred language from request

    const products = await Product.find().skip(skip).limit(limit);

    // Format response based on language preference
    const formattedProducts = products.map((product) => {
      return {
        id: product._id,
        name: product.name[language],
        price: product.price,
        category: product.category[language],
        subcategory: product.subcategory[language],
        likes: product.likes,
        likedBy: product.likedBy,
      };
    });

    const total = await Product.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      products: formattedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
      language,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: i18next.t("serverError"), error: String(error) });
  }
};

// Create a new product
export const createProduct: RequestHandler = async (req, res) => {
  try {
    const { name, price, category, subcategory } = req.body;
    const language = req.language || "en";

    // Basic validation for multilingual fields
    if (
      !name?.en ||
      !name?.vi ||
      !price ||
      !category?.en ||
      !category?.vi ||
      !subcategory?.en ||
      !subcategory?.vi
    ) {
      res.status(400).json({ message: i18next.t("allFieldsRequired") });
      return;
    }

    // Validate price
    if (isNaN(price) || price <= 0) {
      res.status(400).json({ message: i18next.t("priceValidation") });
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

    // Format response with the preferred language
    const formattedProduct = {
      id: savedProduct._id,
      name: savedProduct.name[language],
      price: savedProduct.price,
      category: savedProduct.category[language],
      subcategory: savedProduct.subcategory[language],
      likes: savedProduct.likes,
      likedBy: savedProduct.likedBy,
    };

    res.status(201).json({
      message: i18next.t("productCreated"),
      product: formattedProduct,
      language,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: i18next.t("serverError"), error: String(error) });
  }
};

// Search products
export const searchProducts: RequestHandler = async (req, res) => {
  try {
    const query = req.query.q as string;
    const language = req.language || "en";

    if (!query) {
      res.status(400).json({ message: "Search query is required" });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Search using text index or regex based on the current language
    const searchQuery =
      language === "en"
        ? { "name.en": { $regex: query, $options: "i" } }
        : { "name.vi": { $regex: query, $options: "i" } };

    const products = await Product.find(searchQuery).skip(skip).limit(limit);

    const total = await Product.countDocuments(searchQuery);
    const totalPages = Math.ceil(total / limit);

    // Format response based on language preference
    const formattedProducts = products.map((product) => {
      return {
        id: product._id,
        name: product.name[language],
        price: product.price,
        category: product.category[language],
        subcategory: product.subcategory[language],
        likes: product.likes,
        likedBy: product.likedBy,
      };
    });

    res.status(200).json({
      products: formattedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
      language,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: i18next.t("serverError"), error: String(error) });
  }
};
