const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route GET api/profile/me
// @desc Get current user profile
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    profile = await Profile.findOne({ user: req.user.id }).populate("user", [
      "name",
      "avatar",
    ]);
    if (!profile) {
      res.status(400).json({ message: "There is no profile for the user" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route POST api/profile
// @desc Create or update a user profile
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(githubusername) profileFields.githubusername = githubusername;

    if(skills)  {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    };

    //Build social object
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;

    try {
       let profile = await Profile.findOne({ user: req.user.id });
       if(profile) {
        //Update profile
        
       } 

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
