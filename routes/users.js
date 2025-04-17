var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async(req, res) => {
  try{
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({username, password:hashedPassword});
    await user.save();

    res.status(201).json({ message: 'User successfully registered' });
  }catch(err){
    console.error('Error creating User ->', err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

router.post('/login', async(req, res) => {
  try{
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if(!user) return res.status(400).json({ error : 'User not found' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('userToken', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * (24) * 60 * 60 * 1000
    });

    res.status(200).json({ message: 'Login successful', token: token });
  }catch(err){
    console.error('Login error ->', err);
    res.status(500).json({ error: 'Login error' })
  }
})

module.exports = router;
