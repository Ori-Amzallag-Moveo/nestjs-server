import mongoose, { Document, Schema } from 'mongoose';

export interface Chef extends Document {
  name: string;
  slug?: string;
  age: number;
  imageSrc: string;
  description: string;
  restaurants?: mongoose.Schema.Types.ObjectId[];
  isMostViewedChef: boolean;
  isChefOfTheWeek: boolean;
}
export interface ChefParams {
  page?: number;
  limit?: number;
  isNewChef?: string;
  isMostViewedChef?: string;
}

export interface ChefReturnType {
  success: boolean;
  data: Chef[] | Chef;
}

export const ChefSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    slug: String,
    age: {
      type: Number,
      required: [true, 'Please add chef age'],
      min: 18,
      max: 99,
    },
    imageSrc: {
      type: String,
      required: [true, 'Please add an image source file'],
    },
    description: {
      type: String,
    },
    restaurants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
      },
    ],
    isMostViewedChef: {
      type: Boolean,
      required: [true, 'Please add if the chef is popular'],
    },
    isChefOfTheWeek: {
      type: Boolean,
      required: [true, 'Please add if the chef is the chef of the week'],
    },
  },
  { versionKey: false },
);

const Chef = mongoose.model<Chef>('Chef', ChefSchema);

export default Chef;
