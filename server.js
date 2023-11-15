const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// to the MongoDB
mongoose.connect('mongodb+srv://masirika:goma2023.com@cluster0.hqy9pky.mongodb.net/BLB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// Models
// Models
const { Citizen, Title } = require('./models'); // Update the require statement

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// Index route
app.get('/', (req, res) => {
  // Render your HTML page here
  res.sendFile(__dirname + '/index.html');
});

// Citizen registration route
app.post('/registerCitizen', (req, res) => {
  const { name, dob, fatherName, motherName, gender, bloodGroup } = req.body;
  
  // Create a new Citizen instance
  const newCitizen = new Citizen({
    name,
    dob,
    fatherName,
    motherName,
    gender,
    bloodGroup
  });

  // Save the new citizen to the database
  newCitizen.save()
    .then(citizen => res.send(citizen))
    .catch(err => res.status(500).send(err));
});

// Title registration route
app.post('/registerTitle', (req, res) => {
  const { ownerName, location, size, coordinates, titleNumber, photo } = req.body;
  
  // Create a new Title instance
  const newTitle = new Title({
    ownerName,
    location,
    size,
    coordinates,
    titleNumber,
    photo
  });

  // Save the new title to the database
  newTitle.save()
    .then(title => res.send(title))
    .catch(err => res.status(500).send(err));
});

// Fetch all registered citizens
app.get('/registeredCitizens', (req, res) => {
  Citizen.find()
    .then(citizens => res.send(citizens))
    .catch(err => res.status(500).send(err));
});

// Fetch all registered titles
app.get('/registeredTitles', (req, res) => {
  Title.find()
    .then(titles => res.send(titles))
    .catch(err => res.status(500).send(err));
});

// Title transfer route
app.post('/titleTransfer', (req, res) => {
  const { titleNumber, newOwnerName } = req.body;

  // Find the title by title number
  Title.findOne({ titleNumber })
    .then(title => {
      if (!title) {
        return res.status(404).send('Title not found');
      }

      // Update the owner name
      title.ownerName = newOwnerName;

      // Save the updated title
      title.save()
        .then(updatedTitle => res.send(updatedTitle))
        .catch(err => res.status(500).send(err));
    })
    .catch(err => res.status(500).send(err));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
