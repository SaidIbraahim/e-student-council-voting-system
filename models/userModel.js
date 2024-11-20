import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, unique: true, sparse: true }, // Optional for Admins, required for Voters
  email: { 
    type: String, 
    unique: true, 
    sparse: true, // Allows multiple documents with `null` or non-existing values in the `email` field
    required: function() { return this.role !== 'Voter'; } // Required only for Admins
  },
  department: { type: String, required: true },
  academicYear: { type: String }, // Optional for Admins
  mobile: { 
    type: String, 
    required: function() { return this.role === 'Voter'; }, // Required only for Voters
    unique: function() { return this.role === 'Voter'; } // Unique constraint only for Voters
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['Voter', 'Admin', 'Super Admin'], default: 'Voter' },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending' },
  profileImage: { type: String }, // Optional for Admins
});

const User = mongoose.model('User', userSchema);

export default User;
