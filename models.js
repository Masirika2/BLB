const mongoose = require('mongoose');

// Citizen Schema
const citizenSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  fatherName: String,
  motherName: String,
  gender: String,
  bloodGroup: String,
});

// Title Schema
const titleSchema = new mongoose.Schema({
  ownerName: String,
  location: String,
  size: String,
  coordinates: String,
  titleNumber: String,
  photo: String,
});

const Citizen = mongoose.model('Citizen', citizenSchema);
const Title = mongoose.model('Title', titleSchema);

module.exports = { Citizen, Title };
