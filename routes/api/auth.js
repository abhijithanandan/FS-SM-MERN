const express = require('express');
const router = express.Router();

// @route GET api/auth
// @desc Test route
// @access Pubilc
router.get('/', (req, res) => res.send('Auth Route'));

module.exports = router;