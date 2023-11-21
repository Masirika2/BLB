const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer'); // Add multer for handling file uploads
const { Citizen, Title } = require('./models');

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://masirika:goma2023.com@cluster0.hqy9pky.mongodb.net/BLB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Function to fetch and send the registered citizens and titles
app.get('/fetchRegisteredData', async (req, res) => {
  try {
    const citizens = await Citizen.find();
    const titles = await Title.find({}, 'titleNumber');
    res.json({ citizens, titles });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route for handling file uploads (photo)
app.post('/upload', upload.single('photo'), (req, res) => {
  // Access the uploaded file through req.file
  const photoBuffer = req.file.buffer;
  
  // Implement logic to save the photo buffer to your database or storage
  // Example: savePhotoToDatabase(photoBuffer);

  // Respond with success or failure
  res.json({ success: true, message: 'File uploaded successfully' });
});

// Function to handle the registration form submission
app.post('/registration', async (req, res) => {
  try {
    // Extract data from the form
    const {
      name,
      date_of_birth,
      father_name,
      mother_name,
      gender,
      blood_group,
      owner_name,
      location,
      land_size,
      coordinates,
      title_number,
    } = req.body;

    // Validate required fields
    if (!name || !date_of_birth) {
      res.status(400).send('Name and Date of Birth are required fields');
      return;
    }

    // Save Citizen
    const citizen = new Citizen({
      name,
      dateOfBirth: date_of_birth,
      fatherName: father_name,
      motherName: mother_name,
      gender,
      bloodGroup: blood_group,
    });
    await citizen.save();

    // Save Title
    const title = new Title({
      ownerName: owner_name,
      location,
      landSize: land_size,
      coordinates,
      titleNumber: title_number,
      // Save the photo buffer or path to the photo in the database
      // Example: photo: 'path/to/photo.jpg'
    });
    await title.save();

    // Display the registration success popup
    res.json({ success: true, message: 'Registration successful!' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// Function to handle the title transfer form submission
app.post('/titleTransfer', async (req, res) => {
  try {
    const { transferTitleNumber, newOwnerName } = req.body;

    // Find the title before the update for the previous owner details
    const previousTitle = await Title.findOne({ titleNumber: transferTitleNumber });

    // Implement logic to transfer the title and update the database
    const updatedTitle = await Title.findOneAndUpdate(
      { titleNumber: transferTitleNumber },
      { ownerName: newOwnerName },
      { new: true }
    );

    if (!updatedTitle) {
      res.status(404).json({ error: 'Title not found' });
      return;
    }

    // Display the updated title details in a popup
    const titleTransferSuccessPopup = {
      previousOwner: previousTitle.ownerName,
      titleNumber: updatedTitle.titleNumber,
      ownerName: updatedTitle.ownerName,
      location: updatedTitle.location,
      landSize: updatedTitle.landSize,
      coordinates: updatedTitle.coordinates,
    };

    res.json({ title: titleTransferSuccessPopup });
  } catch (error) {
    console.error('Error transferring title:', error);
    res.status(500).send(error.message);
  }
});


// Route for handling title searches
// Route for handling title searches
app.post('/titleSearch', async (req, res) => {
  try {
    const { titleNumber } = req.body;

    console.log('Searching for title with titleNumber:', titleNumber);

    // Implement logic to search for the title based on the title number
    const title = await Title.findOne({ titleNumber });

    if (!title) {
      console.log('Title not found for titleNumber:', titleNumber);
      res.status(404).json({ error: 'Title not found' });
      return;
    }

    console.log('Title found:', title);

    // Display the title details in a popup
    const titleSearchResultPopup = {
      titleNumber: title.titleNumber,
      ownerName: title.ownerName,
      location: title.location,
      landSize: title.landSize,
      coordinates: title.coordinates,
    };

    console.log('Sending title search result:', titleSearchResultPopup);
    res.json({ title: titleSearchResultPopup });
  } catch (error) {
    console.error('Error searching title:', error);
    res.status(500).send(error.message);
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
