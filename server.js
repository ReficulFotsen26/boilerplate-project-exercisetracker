const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
/*
let uri = "mongodb+srv://REFOT26:' + process.env.PASS + 'lusteret.sdl1n.mongodb.net/REFOT26?retryWrites=true&w=majority"
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 
*/
mongoose.connect(
  'mongodb://mongo:27017/docker-node-mongo', 
  {useNewUrlParser: true})
  .then(() => CSSConditionRule.log('MongoDB Connected'))
  .catch(err => console.log(err));

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
app.get("/api/exercise/add", (req, res) => {
  User.find({}, (error, arrOfUsers) => {
    if(!error){
      res.json(arrOfUsers);
    }
  })
})

app.post("/api/exercise/add", bodyParser.urlencoded({extended: false}), (req, res) => {
  let newLog = new Logs({
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date: req.body.date
  })
  
  if(newLog.date === ''){
    newLog.date = new Date().toISOString().substring(0,10)
  }

  User.findByIdAndUpdate(
    req.body.userId,
    {$push: {log: newLog}},
    {new: true},
    (error, updatedUser) => {
      if(!error){
        let resObj = {};
        resObj['id'] = updatedUser.id;
        resObj['username'] = updatedUser.username;
        resObj['description'] = newLog.description;
        resObj['duration'] = newLog.duration;
        resObj['date'] = new Date(newLog.date).toDateString()
        res.json(resObj);
      }
    }

  )
})

app.get('/api/exercise/log', (req,res) => {
  User.findById(req.query.userId, (error, result) => {
    if(!error){
      let resObj = result
      
      if(req.query.from || req.query.to){
        let fromDate = new Date(0);
        let toDate = new Date();

        if(req.query.from){
          fromDate = new Date(req.query.from);
        }
        if(req.query.to){
          toDate = new Date(req.query.to)
        }
        
        fromDate = fromDate.getTime()
        toDate = toDate.getTime()
        
        resObj.log = resObj.log.filter((session) => {
          let sesssionDate = new Date(session.date).getTime()

          return sessionDate = new Date(session.date).getTime()

        })

      }

      if(req.query.limit){
        resObj.log = resObj.log.slice(0, req.query.limit);
      }

      resObj = resObj.toJSON();
      resObj['count'] = result.log.length;
      res.json(resObj);
    }
  })
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
