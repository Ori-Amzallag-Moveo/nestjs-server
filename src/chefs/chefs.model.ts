import mongoose, { Document, Schema } from 'mongoose';

export interface Chef extends Document {
  name: string;
  slug?: string;
  imageSrc: string;
  description: string;
  restaurants?: mongoose.Schema.Types.ObjectId[];
  isNewChef: boolean;
  isMostViewedChef: boolean;
}

export const ChefSchema: Schema = new mongoose.Schema({
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
  description: {
    type: String,
  },
  restaurants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
  ],
  isNewChef: {
    type: Boolean,
    required: [true, 'Please add if the chef is new'],
  },
  isMostViewedChef: {
    type: Boolean,
    required: [true, 'Please add if the chef is popular'],
  },
});

const Chef = mongoose.model<Chef>('Chef', ChefSchema);

export default Chef;
