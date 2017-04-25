var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', message: "Pugggggggg" });
});

  // Get variables from index Post, and redirect to /parse/
  //TODO Add post variable sanitation.
router.post('/parse/submit', function(req, res, next) {
  console.log("Submitted.")
  var days = req.body.days ? req.body.days : "7"
  var dow = req.body.dayOfWeek ? req.body.dayOfWeek : "Sunday"
    //TODO Add momentjs to get today's day of week

  res.redirect('/parse/'+days+"/"+ dow)
})

module.exports = router;
