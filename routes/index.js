let express = require('express');
let router = express.Router();

let latestVersion = 'v3'; // Set the latest version here

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(latestVersion + '/index', { title: 'Express' });
});

router.get('/v1', function(req, res, next) {
  res.render('v1/index', { title: 'Express' });
});

router.get('/v2', function(req, res, next) {
  res.render('v2/index', { title: 'Express' });
});

router.get('/v3', function(req, res, next) {
  res.render('v3/index', { title: 'Express' });
});

router.get('/versions', function(req, res, next) {
  res.render('versions', { title: 'Express' });
});

module.exports = router;
