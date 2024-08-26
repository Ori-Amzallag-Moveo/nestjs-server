import mongoose, { Document, Schema } from 'mongoose';

export interface Restaurant extends Document {
  name: string;
  slug?: string;
  imageSrc: string;
  chef: mongoose.Schema.Types.ObjectId;
  dishes: mongoose.Schema.Types.ObjectId[];
  rating: number;
  dateOfEstablishment: Date;
  openingHours: [string, string];
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
  },
  dishes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish',
    },
  ],
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    required: [true, 'Please add a rating'],
  },
  openingHours: {
    type: [String],
    required: [true, 'Please add opening hours'],
    validate: {
      validator: function (v: string[]) {
        return v.length === 2;
      },
      message:
        'Opening hours must be an array of two strings: [openingTime, closingTime]',
    },
  },
  dateOfEstablishment: {
    type: Date,
    required: [true, 'Please add the date of establishment'],
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
