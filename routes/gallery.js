/**
 * Created by the_s on 2017/9/6.
 */
/**
 * Created by the_s on 2017/8/30.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var tool = require('../utility/tool');

//love页面
router.get('/gallery', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('gallery/gallery', {
                title: settings['SiteName'] + ' - ' + res.__("misc.gallery"),
                config: settings
            });
        }
    });
});

//love页面
router.post('/gallery/detail', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('gallery/detail', {
                title: settings['SiteName'] + ' - ' + res.__("misc.gallery"),
                config: settings
            });
        }
    });
});

module.exports = router;