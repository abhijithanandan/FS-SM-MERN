const express = require("express");
const { check, validationResult } = require("express-validator");
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../../models/User');
const config = require('config');

// @route   POST api/users
// @desc    Test route
// @access  Pubilc
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    
    try {
      
      const { name, email, password } = req.body;

      let user = await User.findOne({ email: email });

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      if(user) {
        return res.status(400).json({ error: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name, 
        email,  
        password,
        avatar 
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
}
);

module.exports = router;
