const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
let uri = "mongodb+srv://REFOT26:' + process.env.PASS + 'lusteret.sdl1n.mongodb.net/REFOT26?retryWrites=true&w=majority"
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 

app.use(cors())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// MongoDB  

// Schemas
let exerciseLogSchema = new mongoose.Schema({
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: String
});
 
let userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  log: [exerciseLogSchema]
});

// Models
let User = mongoose.model('User', userSchema);
let Logs = mongoose.model('Logs', exerciseLogSchema);

// MongoDB ^^

/* To create a new user */
app.post("/api/exercise/new-user", bodyParser.urlencoded({extended: false}), (req, res) => {
  let newUser = new User({usernmae: req.body.username});
  newUser.save((error, nUser) => {
    if(!error){
      res.json({username: nUser.username, _id: nUser.id})
    }
  });
})

/* To get an array of all users */
app.get("/api/exercise/add", bodyParser.urlencoded({extended: false}), (req, res) => {
  User.find({}, (error, arrOfUsers) => {
    if(!error){
      res.json(arrOfUsers);
    }
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
