var express = require('express');
var router = express.Router();

/* GET client listing. */
router.get('/', function(req, res, next) {
  res.render('frontend', { title: 'Awesome Frontend :P' });
});

module.exports = router;
