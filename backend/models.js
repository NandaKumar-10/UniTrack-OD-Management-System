import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' }
}, { timestamps: true });

const odSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  eventName: { type: String, required: true },
  date: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

const achievementSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  eventName: { type: String, required: true },
  rank: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Internal', 'External'], required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const OD = mongoose.model('OD', odSchema);
export const Achievement = mongoose.model('Achievement', achievementSchema);
export const Event = mongoose.model('Event', eventSchema);
