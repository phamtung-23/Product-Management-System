import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';

export const toggleLike: RequestHandler = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ message: 'Invalid product ID' });
      return;
    }

    // Find product by ID
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Check if user has already liked the product
    const alreadyLiked = product.likedBy.some(
      (id) => id.toString() === userId
    );

    let update;
    let message;

    if (alreadyLiked) {
      // Unlike: Remove user ID from likedBy array and decrement likes count
      update = {
        $pull: { likedBy: userId },
        $inc: { likes: -1 }
      };
      message = 'Product unliked successfully';
    } else {
      // Like: Add user ID to likedBy array and increment likes count
      update = {
        $addToSet: { likedBy: userId },
        $inc: { likes: 1 }
      };
      message = 'Product liked successfully';
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      update,
      { new: true }
    );

    res.status(200).json({
      message,
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
