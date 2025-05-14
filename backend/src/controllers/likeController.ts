import { RequestHandler } from "express";
import mongoose from "mongoose";
import Product from "../models/Product";
import { clearCache } from "../services/redisService";
import i18next from "i18next";

export const toggleLike: RequestHandler = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;
    const language = req.language || "en";

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }

    // Find product by ID
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ message: i18next.t("productNotFound") });
      return;
    }

    // Check if user has already liked the product
    const alreadyLiked = product.likedBy.some((id) => id.toString() === userId);

    let update;
    let messageKey;

    if (alreadyLiked) {
      // Unlike: Remove user ID from likedBy array and decrement likes count
      update = {
        $pull: { likedBy: userId },
        $inc: { likes: -1 },
      };
      messageKey = "productUnliked";
    } else {
      // Like: Add user ID to likedBy array and increment likes count
      update = {
        $addToSet: { likedBy: userId },
        $inc: { likes: 1 },
      };
      messageKey = "productLiked";
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(productId, update, {
      new: true,
    });

    // Invalidate products cache after toggling like/unlike
    await clearCache("products:*");

    // Format response based on language preference
    if (!updatedProduct) {
      res.status(404).json({ message: i18next.t("productNotFound") });
      return;
    }

    const formattedProduct = {
      id: updatedProduct._id,
      name: updatedProduct.name[language],
      price: updatedProduct.price,
      category: updatedProduct.category[language],
      subcategory: updatedProduct.subcategory[language],
      likes: updatedProduct.likes,
      likedBy: updatedProduct.likedBy,
    };

    res.status(200).json({
      message:
        messageKey === "productLiked"
          ? i18next.t("productLiked")
          : i18next.t("productUnliked"),
      product: formattedProduct,
      language,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: i18next.t("serverError"), error: String(error) });
  }
};
