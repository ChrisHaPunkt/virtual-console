var express = require('express');
var router = express.Router();

/* GET client listing. */
router.get('/', function(req, res, next) {
  res.render('cars', { title: 'cars' });
});

module.exports = router;
