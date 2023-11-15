const mongoose = require('mongoose');

// Citizen schema
const citizenSchema = new mongoose.Schema({
  name: String,
  dob: String,
  fatherName: String,
  motherName: String,
  gender: String,
  bloodGroup: String
});

const Citizen = mongoose.model('Citizen', citizenSchema);

// Title schema
const titleSchema = new mongoose.Schema({
  ownerName: String,
  location: String,
  size: String,
  coordinates: String,
  titleNumber: String,
  photo: String
});

const Title = mongoose.model('Title', titleSchema);

module.exports = { Citizen, Title };
