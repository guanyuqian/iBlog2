/**
 * Created by the_s on 2017/8/30.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var async = require('async');
var tool = require('../utility/tool');

//love页面
router.get('/love', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('love/index', {
                title: settings['SiteName'] + ' - ' + res.__("misc.msg"),
                config: settings
            });
        }
    });
});

module.exports = router;