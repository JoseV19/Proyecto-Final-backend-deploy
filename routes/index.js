var express = require('express');
const Habit = require('../models/Habit');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
var router = express.Router();

const timeDifferenceInHours = (date1, date2) => {
  const differenceMS = Math.abs(date1 - date2);
  return differenceMS / (1000 * 3600);
}

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if(!token){
    return res.status(401).json({error: 'Access denied. No token'})
  }
  try{
    const tokenWithoutBearer = token.replace('Bearer ', '');
    const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = verified;
    next();
  }catch(error){
    console.error(`Error validating token ${error}`);
    res.status(403).json({error: 'Invalid or expired token'});
  }
}

const getUserId = (req, errorMessage) => {
  let userId = req.user && req.user.userId ? req.user.userId : res.status(500).json({error: errorMessage});
  return new mongoose.Types.ObjectId(userId);
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

/* GET hello page. */
router.get('/hello', function(req, res, next){
  res.json({"message":"hello mom!"});
})

/* GET habits list */
router.get('/habits', authenticateToken, async(req, res) => {
  try{
    const userId = getUserId(req, 'Error retrieving habits, access denied');
    const habits = await Habit.find({'userId': userId});
    res.status(200).json(habits);
  }catch(err){
    console.error("Error retrieving habit ->", err);
    res.status(500).json({ message: 'Error retrieving habits' });
  }
});

/* POST habit (CREATE) */
router.post('/habits', authenticateToken, async(req, res) => {
  try{
    const userId = getUserId(req, 'Error creating habit, access denied');
    const {title, description} = req.body;
    const habit = new Habit({title, description, userId});
    await habit.save();
    res.status(201).json(habit);
  }catch(err){
    console.error("Error creating habit ->", err);
    res.status(400).json({ error: 'Error creating habit' });
  }
  });

/* DELETE habit by id */
router.delete('/habits/:id', authenticateToken, async(req, res) => {
  try{
    const userId = getUserId(req, 'Error creating habit, access denied');
    const habitId = req.params.id;
    await Habit.findByIdAndDelete(habitId, userId);
    res.json({ message : 'Habit deleted' });
  }catch(err){
    console.error("Error deleting habit ->", err);
    res.status(204).json({ message: 'Habit not found'} );
  }
});

/* UPDATE habit by id (SET DONE) */
router.patch('/habits/done/:id', authenticateToken, async(req, res) => {
  try{
    const habit = await Habit.findById(req.params.id);
    let message = 'Habit marked as done';
    
    if(timeDifferenceInHours(habit.lastDone, habit.lastUpdate) < 24){
      habit.days += 1;
    }else{
      habit.days = 1;
      habit.startedAt = new Date();
      message = 'Habit restarted';
    } 
    
    habit.lastUpdate = new Date();
    habit.lastDone = new Date();

    await habit.save();
    res.status(200).json({message: message});
    
  }catch(err){
    console.error("Error setting habit to done ->", err);
    res.status(500).json({ error: 'Error setting habit to done' })
  }
})

module.exports = router;
