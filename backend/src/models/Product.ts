import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IProduct extends Document {
  name: string;
  price: number;
  category: string;
  subcategory: string;
  likes: number;
  likedBy: mongoose.Types.ObjectId[] | IUser[];
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  likes: { type: Number, default: 0 },
  likedBy: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  }]
});

// Create index for text search
ProductSchema.index({ name: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);
