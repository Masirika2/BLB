const mongoose = require('mongoose');

// Model schemas
const citizenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: String, required: true }, // You can adjust the type as needed
  bloodGroup: { type: String, required: true },
});

const titleSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  location: { type: String, required: true },
  landSize: { type: String, required: true },
  coordinates: { type: String, required: true },
  titleNumber: { type: String, required: true },
  photo: { type: String,}, // Assuming you store the file path or URL
});

const Citizen = mongoose.model('Citizen', citizenSchema);
const Title = mongoose.model('Title', titleSchema);

module.exports = { Citizen, Title };
