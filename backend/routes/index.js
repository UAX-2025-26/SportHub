var express = require('express');
var router = express.Router();

/* GET home JSON. */
router.get('/', function(req, res) {
  res.json({
    name: 'SportHub API',
    ok: true,
    health: '/health',
    api: '/api'
  });
});

module.exports = router;
