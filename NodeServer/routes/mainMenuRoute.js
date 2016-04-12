var express = require('express');
var router = express.Router();

/* GET client listing. */
router.get('/', function (req, res, next) {
    res.render('mainMenu/frontend', {title: 'Main Menu'});
});

module.exports = router;
