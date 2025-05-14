import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

// Interface for multilingual fields
interface IMultilingual {
  en: string;
  vi: string;
  [key: string]: string; // Index signature for string key access
}

export interface IProduct extends Document {
  name: IMultilingual;
  price: number;
  category: IMultilingual;
  subcategory: IMultilingual;
  likes: number;
  likedBy: mongoose.Types.ObjectId[] | IUser[];
}

const ProductSchema: Schema = new Schema({
  name: { 
    en: { type: String, required: true }, 
    vi: { type: String, required: true }
  },
  price: { type: Number, required: true },
  category: { 
    en: { type: String, required: true },
    vi: { type: String, required: true }
  },
  subcategory: { 
    en: { type: String, required: true },
    vi: { type: String, required: true }
  },
  likes: { type: Number, default: 0 },
  likedBy: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  }]
});

// Create index for text search on both languages
ProductSchema.index({ 'name.en': 'text', 'name.vi': 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);
