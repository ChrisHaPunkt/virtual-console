var express = require('express');
var router = express.Router();

/* GET client listing. */
router.get('/', function (req, res, next) {
    res.render('mainMenu/frontend', {title: 'Main Menu'});
});
router.get('/ext', function (req, res, next) {
    res.render('games/external/frontend', {title: 'External Games'});
});
router.get('/int/1', function (req, res, next) {
    res.render('games/internal/MatrixGame/frontend', {title: '--:: Matrix Demo Game ::-- '});
});
router.get('/int/2', function (req, res, next) {
    res.render('games/internal/CarsGame/frontend', {title: '--:: Cars Demo Game ::-- '});
});
router.get('/int/3', function (req, res, next) {
    res.render('games/internal/3DGame/frontend', {title: '--:: ThreeD Game ::-- '});
});

module.exports = router;
