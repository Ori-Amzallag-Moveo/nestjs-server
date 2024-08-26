import mongoose, { Document, Schema } from 'mongoose';

export enum MealTime {
  Breakfast = 1,
  Lunch = 2,
  Dinner = 3,
}

export interface Dish extends Document {
  name: string;
  slug?: string;
  imageSrc: string;
  ingredients: string[];
  icons?: { imageSrc: string; alt: string }[];
  price: number;
  meals: MealTime[];
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
      imageSrc: { type: String, required: true },
      alt: { type: String, required: true },
    },
  ],
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  meals: {
    type: [Number],
    required: true,
    validate: {
      validator: function (v: MealTime[]) {
        return v.every((num) => num >= 1 && num <= 3);
      },
      message: (props) =>
        `${props.value} contains an invalid meal time! Only values between 1 and 3 are allowed.`,
    },
  },

  isSignature: {
    type: Boolean,
    required: [true, 'Please add if the dish is signature'],
  },
});

const Dish = mongoose.model<Dish>('Dish', DishSchema);

export default Dish;
