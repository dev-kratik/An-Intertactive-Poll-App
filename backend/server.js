require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Poll = require('./models/Poll');



const app = express();
app.use(cors());
app.use(express.json());

 // ✅ Loads .env file


 console.log("MONGO_URI is:", process.env.MONGO_URI);

 mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



app.get('/api/polls', async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
});

app.post('/api/polls', async (req, res) => {
  const { question, options } = req.body;
  const poll = new Poll({ question, options: options.map(text => ({ text })) });
  await poll.save();
  res.status(201).json(poll);
});

app.post('/api/polls/:id/vote', async (req, res) => {
  const { optionIndex } = req.body;
  const poll = await Poll.findById(req.params.id);
  if (!poll) return res.status(404).send('Poll not found');

  poll.options[optionIndex].votes++;
  await poll.save();
  res.json(poll);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
