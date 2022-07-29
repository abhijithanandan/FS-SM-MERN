const express = require('express');
const { check, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config');

// @route GET api/auth
// @desc Test route
// @access Pubilc
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password');
        res.json(user);
    } catch (error) {
       res.status(500).send('Server Error'); 
    }
});

// @route   POST api/auth
// @desc    Authenticate User & get token 
// @access  Pubilc

router.post(
  "/",
  [
    check(
        "email", 
        "Please enter a valid email"
    ).isEmail(),
    check(
      "password",
      "Passowrd is required"
    ).exists()
  ],

  async (req, res) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      
      const { email, password } = req.body;

      let user = await User.findOne({ email: email });

      if(!user) {
        return res.status(400).json({ error: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials'});
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      const token = jwt.sign(
        payload, 
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (error, token) => {
          if(error) throw error;
          res.json({ token });
      });

      
    } catch (error) {

      console.log(error.message);
      res.response(500).send('Server Error');
      
    }
});

module.exports = router;