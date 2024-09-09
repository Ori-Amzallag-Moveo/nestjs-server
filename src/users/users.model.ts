import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document {
  email: string;
  password?: string;
}
export const UserSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
  },
});

const User = mongoose.model<User>('User', UserSchema);

export default User;
