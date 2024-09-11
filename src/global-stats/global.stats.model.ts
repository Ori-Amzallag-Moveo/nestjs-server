import mongoose, { Document, Schema } from 'mongoose';

export interface GlobalStatsReturnType {
  totalClicks: number;
  totalRestaurants: number;
  totalChefs: number;
  totalDishes: number;
  totalUsers: number;
}

export interface GlobalStats extends Document {
  totalClicks: number;
  totalRestaurants: number;
  totalChefs: number;
  totalDishes: number;
  totalUsers: number;
}

export const GlobalStatsSchema = new Schema({
  totalClicks: {
    type: Number,
    default: 0,
  },
  totalRestaurants: {
    type: Number,
    default: 0,
  },
  totalChefs: {
    type: Number,
    default: 0,
  },
  totalDishes: {
    type: Number,
    default: 0,
  },
  totalUsers: {
    type: Number,
    default: 0,
  },
});

const GlobalStats = mongoose.model<GlobalStats>(
  'GlobalStats',
  GlobalStatsSchema,
);
export default GlobalStats;
