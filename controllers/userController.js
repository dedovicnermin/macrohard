const express = require('express'),
      userRouter = express.Router(),
      dataAnalysis = require('../public/js/dataAnalysis');







userRouter.get('/stats', (req, res) => {
    res.render('statsPage');
});


userRouter.get('/stats/getstats', (req, res) => {
    res.json({label: "label"});
})

module.exports = userRouter;