//The index.js file will act as a central hub to pull them 
//all together. Open index.js and add the following code:

const express = require('express');
const router = express.Router();

router.use(require('./candidateRoutes'));
router.use(require('./partyRoutes'));

module.exports = router;