var express = require('express');
var router = express.Router();

/* GET client listing. */
router.get('/', function(req, res, next) {
  res.render('frontend', { title: '--:: ThreeD Game ::-- ' });
});
router.get('/1', function(req, res, next) {
  res.render('games/CarsGame/frontend', { title: '--:: Cars Demo Game ::-- ' });
});
router.get('/2', function(req, res, next) {
  res.render('frontend', { title: '--:: ThreeD Game ::-- ' });
});
router.get('/3', function(req, res, next) {
  res.render('frontend', { title: '--:: ThreeD Game ::-- ' });
});

module.exports = router;
