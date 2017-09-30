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
var gallery=require('../proxy/gallery');
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


router.get('/getGallery', function (req, res, next) {
    gallery.getAll(false,  function (err, data) {
        if (err) {
            next(err);
        } else {
            res.json(data);
        }
    });
});

//查看相册内容
router.get('/viewGalleryDetail/:id', function (req, res, next) {
    var id = req.params.id;
    console.log(id);
    gallery.getById(id, function (err, gallery) {
        if (err) {
            cb(err);
        }
        tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
            if (err) {
                next(err);
            } else {
                console.log(gallery);
                if(gallery==null)gallery={};
                res.render('gallery/detail', {
                    config: settings,
                    title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.newGallery"),
                    gallery: gallery//a gallery instance
                });
            }
        });
    });
});
module.exports = router;