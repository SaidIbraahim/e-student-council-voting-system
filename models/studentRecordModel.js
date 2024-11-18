// models/studentRecordModel.js
import mongoose from 'mongoose';

const studentRecordSchema = mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive', 'graduated', 'suspended', 'transferred', 'withdrawn'], required: true },
  mobile: { type: String, required: true },
});

export default mongoose.model('StudentRecord', studentRecordSchema);
