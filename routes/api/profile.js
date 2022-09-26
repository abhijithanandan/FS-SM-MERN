const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route GET api/profile/me
// @desc Get current user profile
// @access Private
router.get('/', auth, async (req, res) => {
    try {
       profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']) 
       if(!profile) {
        res.status(400).json({ message: 'There is no profile for the user' })
       }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');    
    }
});

module.exports = router;