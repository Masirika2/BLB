const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line for CORS support
const app = express();
let port = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://masirika:goma2023.com@cluster0.hqy9pky.mongodb.net/BLB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error: '));
db.once('open', function () {
  console.log('Connected to BLB');
});

const { Citizen, Title } = require('./models');

app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  // Send the initial HTML page with registration forms
  res.sendFile(__dirname + '/index.html');
});

app.post('/registerCitizen', async (req, res) => {
  const { name, dob, fatherName, motherName, gender, bloodGroup } = req.body;
  const newCitizen = new Citizen({ name, dob, fatherName, motherName, gender, bloodGroup });
  try {
    await newCitizen.save();
    console.log('Citizen registered successfully:', newCitizen.toJSON());
    // Call fetchAndDisplayData to update the UI after successful registration
    fetchAndDisplayData(res);
  } catch (error) {
    console.error('Error saving citizen details:', error);
    res.status(500).json({ error: 'Error saving citizen details' });
  }
});

app.post('/registerTitle', async (req, res) => {
  const { ownerName, location, size, coordinates, titleNumber, photo } = req.body;
  const newTitle = new Title({ ownerName, location, size, coordinates, titleNumber, photo });
  try {
    await newTitle.save();
    console.log('Title registered successfully:', newTitle.toJSON());
    // Call fetchAndDisplayData to update the UI after successful registration
    fetchAndDisplayData(res);
  } catch (error) {
    console.error('Error saving title details:', error);
    res.status(500).json({ error: 'Error saving title details' });
  }
});

app.post('/titleTransfer', async (req, res) => {
  const { transferTitleNumber, newOwnerName } = req.body;
  try {
    const titleToTransfer = await Title.findOne({ titleNumber: transferTitleNumber });
    if (!titleToTransfer) {
      res.status(404).json({ error: 'Title not found' });
      return;
    }

    titleToTransfer.ownerName = newOwnerName;
    await titleToTransfer.save();
    console.log('Title transferred successfully:', titleToTransfer.toJSON());
    // Call fetchAndDisplayData to update the UI after successful transfer
    fetchAndDisplayData(res);
  } catch (error) {
    console.error('Error transferring title:', error);
    res.status(500).json({ error: 'Error transferring title' });
  }
});

// Helper function to fetch data and update the UI
async function fetchAndDisplayData(res) {
  try {
    const registeredCitizens = await Citizen.find({});
    const registeredTitles = await Title.find({});
    res.json({
      registeredCitizens: registeredCitizens,
      registeredTitles: registeredTitles,
    });
  } catch (error) {
    console.error('Error fetching data from the database:', error);
    res.status(500).json({ error: 'Error fetching data from the database' });
  }
}

const server = app.listen(port, () => {
  console.log(`Server is running on port ${server.address().port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    port += 1;
    console.log(`Port ${port - 1} is in use, trying port ${port}`);
    server.listen(port);
  } else {
    console.error('An error occurred while starting the server:', err);
  }
});
