/**
 * Created by the_s on 2017/9/6.
 */
/**
 * Created by the_s on 2017/8/30.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var async = require('async');
var tool = require('../utility/tool');
var post = require('../proxy/post');
var moment = require('moment');

//love页面
router.get('/love', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('love/index', {
                title: settings['SiteName'] + ' - ' + res.__("misc.love"),
                config: settings
            });
        }
    });
});


/**
 * 获取时间轴页面
 *
 */
router.get('/timeline', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('love/timeline', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.new_travels")
            });
        }
    });
});

function getArticlesOrTravels(req, res, next, CateName) {
    var  params ={cateId : CateName};
    async.parallel([
        //获取文章列表
        function (cb) {
            post.getArticles(params, function (err, posts) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, posts);
                }
            });
        }
    ], function (err, results) {
        var posts,
            post,
            cateId,
            cateItem,
            result = [];
        if (err) {
            next(err);
        } else {
            posts = results[0];
            posts.forEach(function (item) {
                post = {
                    UniqueId: item._id,
                    Alias: item.Alias,
                    Title: item.Title,
                    CreateTime: moment(item.CreateTime).format('YYYY-MM-DD HH:mm:ss'),
                    ModifyTime: moment(item.ModifyTime).format('YYYY-MM-DD HH:mm:ss'),
                    Summary: item.Summary,
                    ViewCount: item.ViewCount,
                    Source: item.Source,
                    imageCropSrc: item.imageCropSrc,
                    Url: item.Url,
                    IsDraft: item.IsDraft,
                    scenicList: item.scenicList,
                    IsActive: item.IsActive
                };
                result.push(post);
            });
            res.json({
                travels: result
            });
        }
    });
}
//获取旅游列表数据
router.get('/getTravels', function (req, res, next) {
    getArticlesOrTravels(req, res, next,'Travels');
});

module.exports = router;