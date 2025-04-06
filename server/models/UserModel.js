import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  fileList: [{ type: String, ref: 'File' }]
}, { versionKey: false, _id: false });

const User = mongoose.model('User', userSchema);

export default User;
