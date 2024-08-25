import mongoose, { Document, Schema } from 'mongoose';

export interface Dish extends Document {
  name: string;
  slug?: string;
  imageSrc: string;
  ingredients: string[];
  icons?: { imgSrc: string; alt: string }[];
  price: number;
  isSignature?: boolean;
}

export const DishSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  slug: String,
  imageSrc: {
    type: String,
    required: [true, 'Please add an image source file'],
  },
  ingredients: [
    {
      type: String,
    },
  ],
  icons: [
    {
      imgSrc: { type: String, required: true },
      alt: { type: String, required: true },
    },
  ],
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  isSignature: {
    type: Boolean,
    required: [true, 'Please add if the dish is signature'],
  },
});

const Dish = mongoose.model<Dish>('Dish', DishSchema);

export default Dish;
