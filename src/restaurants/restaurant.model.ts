import mongoose, { Document, Schema } from 'mongoose';

export interface Restaurant extends Document {
  name: string;
  slug?: string;
  imageSrc: string;
  chef: mongoose.Schema.Types.ObjectId;
  rating: number;
  isNewRestaurant: boolean;
  isOpenNow: boolean;
  location: {
    type: string;
    coordinates: [number, number];
  };
}
export const RestaurantSchema: Schema = new mongoose.Schema({
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
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chef',
    required: [false, "Please add the chef's ID"],
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    required: [true, 'Please add a rating'],
  },
  isNewRestaurant: {
    type: Boolean,
    required: [true, 'Please add if the restaurant is new'],
  },
  isOpenNow: {
    type: Boolean,
    required: [true, 'Please add if the restaurant is open now'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere',
    },
  },
});

const Restaurant = mongoose.model<Restaurant>('Restaurant', RestaurantSchema);

export default Restaurant;
