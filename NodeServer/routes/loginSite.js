/**
 * Created by michaelschleiss on 29.10.15.
 */
var express = require('express');
var router = express.Router();

/* GET client listing. */
router.get('/', function(req, res, next) {
    res.render('loginSite', { title: 'LoginSite' });
});

module.exports = router;
