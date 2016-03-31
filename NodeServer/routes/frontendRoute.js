var express = require('express');
var router = express.Router();

/* GET client listing. */
router.get('/', function (req, res, next) {
    res.render('mainMenu/frontend', {title: 'Main Menu'});
});
router.get('/1', function (req, res, next) {
    res.render('games/MatrixGame/frontend', {title: '--:: Matrix Demo Game ::-- '});
});
router.get('/2', function (req, res, next) {
    res.render('games/CarsGame/frontend', {title: '--:: Cars Demo Game ::-- '});
});
router.get('/3', function (req, res, next) {
    res.render('games/3DGame/frontend', {title: '--:: ThreeD Game ::-- '});
});

module.exports = router;
