var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var async = require('async');
var upload = require('jquery-file-upload-middleware');
var post = require('../proxy/post');
var category = require('../proxy/category');
var log = require('../proxy/log');
var tool = require('../utility/tool');
var moment = require('moment');
var shortid = require('shortid');
var redisClient = require('../utility/redisClient');
var datapatch = require('../dataPatch');
var gallery = require('../proxy/gallery');
//上传配置
upload.configure({
    uploadDir: path.join(__dirname, '../public/images/'),
    uploadUrl: '/images'
});

//网站统计页面
router.get('/', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/index', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.web_statistic")
            });
        }
    });
});

//分类管理页面
router.get('/categorymanage', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/categorymanage', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.classified_management")
            });
        }
    });
});

//获取分类数据，不含所有和未分类，不走缓存
router.post('/getCategories', function (req, res, next) {
    category.getAll(false, false, function (err, data) {
        if (err) {
            next(err);
        } else {
            res.json(data);
        }
    });
});

//保存分类数据
router.post('/saveCategories', function (req, res, next) {
    var jsonArray = JSON.parse(req.body.json.substr(1, req.body.json.length - 2));
    category.save(jsonArray, function (err) {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    });
});

//文章管理页面
router.get('/articlemanage', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/articlemanage', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.article_management"),
                defaultCateID: ''
            });
        }
    });
});


//获取分类数据，包含所有和未分类，不走缓存
router.post('/getCateFilter', function (req, res, next) {
    category.getAll(true, false, function (err, data) {
        if (err) {
            next(err);
        } else {
            res.json(data);
        }
    });
});
function getArticlesOrTravels(req, res, next, CateName) {
    var filter,
        params = {
            pageIndex: req.body.pageNumber,
            pageSize: req.body.pageSize,
            sortName: req.body.sortName,
            sortOrder: req.body.sortOrder,
            searchText: req.body.searchText
        };
    if (req.body.filter) {
        filter = JSON.parse(req.body.filter);
        params.cateId = filter.CateName;
        params.uniqueId = filter.UniqueId;
        params.title = filter.Title;
    }
    if (CateName != '') params.cateId = CateName;
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
        },
        //获取文章总数
        function (cb) {
            post.getArticlesCount(params, function (err, count) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, count);
                }
            });
        },
        //获取分类
        function (cb) {
            category.getAll(true, false, function (err, categories) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, categories);
                }
            });
        }
    ], function (err, results) {
        var posts,
            count,
            categories,
            post,
            cateId,
            cateItem,
            result = [];
        if (err) {
            next(err);
        } else {
            posts = results[0];
            count = results[1];
            categories = results[2];
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
                    Url: item.Url,
                    IsDraft: item.IsDraft,
                    IsActive: item.IsActive
                };
                cateId = item.CategoryId;
                cateItem = tool.jsonQuery(categories, {"_id": cateId});
                if (cateItem) {
                    post.CategoryAlias = cateItem.Alias;
                    post.CateName = cateItem.CateName;
                }
                result.push(post);
            });
            res.json({
                rows: result,
                total: count
            });
        }
    });
}
//获取文章列表数据
router.post('/getArticles', function (req, res, next) {
    getArticlesOrTravels(req, res, next, '');
});
//获取旅游列表数据
router.post('/getTravels', function (req, res, next) {
    getArticlesOrTravels(req, res, next, 'Travels');
});


//新的文章页面
router.get('/newArticle', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/newarticle', {
                uniqueId: shortid.generate(),
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.new_article"),
                defaultCateID: ''
            });
        }
    });
});

//检查文章Alias是否唯一
router.post('/checkArticleAlias', function (req, res, next) {
    post.checkAlias(req.body.Alias, req.body.uid, function (err, isValid) {
        if (err) {
            next(err);
        } else {
            res.json({
                valid: isValid
            });
        }
    })
});

//保存文章
router.post('/saveArticle', function (req, res, next) {
    var params = {
        UniqueId: req.body.UniqueId,
        Title: req.body.Title,
        Alias: req.body.Alias,
        Summary: req.body.Summary,
        Source: req.body.Source,
        Content: req.body.Content,
        CategoryId: req.body.CategoryId,
        Labels: req.body.Labels,
        Url: req.body.Url,
        IsDraft: req.body.IsDraft,
        scenicList: req.body.scenic,
        imageCropSrc: req.body.imageCropSrc

    };
    post.save(params, function (err) {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    })
});

//修改文章
router.get('/editArticle/:id', function (req, res, next) {
    editArticleOrTravels(req, res, next, "");
});
//修改游记，即不能改文章类型
router.get('/editTravels/:id', function (req, res, next) {
    editArticleOrTravels(req, res, next, "Travels");
});
//编辑文章或者旅游的重定向，由editArticleOrTravels决定默认内容，空则是文章，可选类型，否则选择editArticleOrTravels
//考虑到权限问题
function editArticleOrTravels(req, res, next, defaultCateID) {
    var id = req.params.id;
    if (!id) {
        res.redirect('/admin/articlemanage');
    }
    async.parallel([
        //获取分类
        function (cb) {
            tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, settings);
                }
            });
        },
        //根据文章Id获取文章
        function (cb) {
            post.getById(id, function (err, article) {
                if (err) {
                    cb(err);
                } else if (!article) {
                    next();
                } else {
                    cb(null, article);
                }
            })
        }
    ], function (err, results) {
        var settings,
            article;
        if (err) {
            next(err);
        } else {
            settings = results[0];
            article = results[1];
            res.render('admin/editarticle', {
                config: settings,
                post: article,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.edit_article"),
                defaultCateID: defaultCateID
            });
        }
    });
}


//删除文章
router.post('/deleteArticles', function (req, res, next) {
    post.delete(req.body.ids, function (err) {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    })
});

//还原文章
router.post('/undoArticle', function (req, res, next) {
    post.undo(req.body.id, function (err) {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    })
});

//评论管理页面
router.get('/comments', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/comments', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.comment_management")
            });
        }
    });
});

//留言管理页面
router.get('/guestbook', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/guestbook', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.msg_management")
            });
        }
    });
});

//关于管理页面
router.get('/aboutmanage', function (req, res, next) {
    async.parallel([
        //获取关于数据
        function (cb) {
            tool.getConfig(path.join(__dirname, '../config/about.json'), function (err, about) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, about);
                }
            });
        },
        //获取配置
        function (cb) {
            tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, settings);
                }
            });
        }
    ], function (err, results) {
        var settings,
            about;
        if (err) {
            next(err);
        } else {
            about = results[0];
            settings = results[1];
            res.render('admin/aboutmanage', {
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.about_management"),
                about: about,
                config: settings
            });
        }
    });
});

//上传图片
router.post('/uploadimg', function (req, res, next) {
    upload.fileHandler()(req, res, next);
});

//保存关于数据
router.post('/saveAbout', function (req, res, next) {
    tool.setConfig(path.join(__dirname, '../config/about.json'), {
        FirstLine: req.body.FirstLine,
        SecondLine: req.body.SecondLine,
        PhotoPath: req.body.PhotoPath,
        ThirdLine: req.body.ThirdLine,
        Profile: req.body.Profile,
        Wechat: req.body.Wechat,
        QrcodePath: req.body.QrcodePath,
        Email: req.body.Email,
    });
    res.end();
});

//缓存管理页面
router.get('/cachemanage', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/cachemanage', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.cache_management")
            });
        }
    });
});

//根据缓存key获取缓存
router.post('/getcache', function (req, res, next) {
    redisClient.getItem(req.body.key, function (err, data) {
        if (err) {
            next(err);
        } else {
            if (data) {
                res.json(data);
            } else {
                res.end();
            }
        }
    })
});

//清除指定key的缓存
router.post('/clearcache', function (req, res, next) {
    redisClient.removeItem(req.body.key, function (err) {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    })
});

//异常管理页面
router.get('/exception', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/exception', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.exception_management")
            });
        }
    });
});

//获取异常数据
router.post('/getExceptions', function (req, res, next) {
    var params = {
        pageIndex: req.body.pageNumber,
        pageSize: req.body.pageSize,
        sortName: req.body.sortName,
        sortOrder: req.body.sortOrder
    };
    async.parallel([
        //获取异常列表
        function (cb) {
            log.getAll(params, function (err, logs) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, logs);
                }
            });
        },
        //获取异常数据总数
        function (cb) {
            log.getAllCount(params, function (err, count) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, count);
                }
            })
        }
    ], function (err, results) {
        var logs,
            count,
            result = [];
        if (err) {
            next(err);
        } else {
            logs = results[0];
            count = results[1];
            logs.forEach(function (item) {
                result.push({
                    message: item.message,
                    time: moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss.SSS'),
                    level: item.level,
                    meta: item.meta
                });
            });
            res.json({
                rows: result,
                total: count
            });
        }
    });
});

//系统设置页面
router.get('/settings', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        console.log(settings);
        if (err) {
            next(err);
        } else {
            res.render('admin/settings', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.settings")
            });
        }
    });
});

//保存系统设置
router.post('/saveSettings', function (req, res, next) {
    tool.setConfig(path.join(__dirname, '../config/settings.json'), {
        SiteName: req.body.SiteName,
        SiteDomain: req.body.SiteDomain,
        RecordNo: req.body.RecordNo,
        LogoPath: req.body.LogoPath,
        PageSize: req.body.PageSize,
        ExpandMenu: req.body.ExpandMenu,
        CacheExpired: req.body.CacheExpired,
        TranslateKey: req.body.TranslateKey,
        EnableStatistics: req.body.EnableStatistics,
        StatisticsId: req.body.StatisticsId,
        EnableShare: req.body.EnableShare,
        JiaThisId: req.body.JiaThisId,
        ShowComments: req.body.ShowComments,
        ShowGuestbook: req.body.ShowGuestbook,
        ChangyanId: req.body.ChangyanId,
        ChangyanConf: req.body.ChangyanConf
    });
    res.end();
});


/**
 * 新增游记页面
 */
router.get('/newTravels', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/newarticle', {
                uniqueId: shortid.generate(),
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.new_travels"),
                defaultCateID: 'Travels'
            });
        }
    });
});


/**
 * 获取游记的tab页面
 *
 */
router.get('/scenicInf', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/love/scenicInf', {
                uniqueId: shortid.generate(),
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.new_travels")
            });
        }
    });
});


/**
 * 新增游记管理页面
 */
//文章管理页面
router.get('/travelsManage', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/articlemanage', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.article_management"),
                defaultCateID: 'Travels'
            });
        }
    });

});


/**
 * 裁剪上传图片dialog
 */
router.get('/imageCropUpload', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/imageCropUpload', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.new_travels")
            });
        }
    });
});


/**
 * 相册管理
 */
router.get('/manageGallery', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/gallery/manageGallery', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.manageGallery")
            });
        }
    });
});


//添加
router.get('/addOrEditGalleryDetail/:id', function (req, res, next) {
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
                res.render('admin/gallery/manageGalleryDetail', {
                    config: settings,
                    title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.newGallery"),
                    gallery: gallery//a gallery instance
                });
            }
        });
    });
});

//添加相册
router.post('/addOrUpdateGallery', function (req, res, next) {
    var params = {
        UniqueId: req.body.UniqueId == "" ? shortid.generate() : req.body.UniqueId,
        //标题
        galleryName: req.body.galleryName,
        //描述
        galleryDes: req.body.galleryDes,
        //封面圖片
        inputCrop: req.body.inputCrop,
        //照片集合
        photoList: req.body.photoList

    };
    gallery.save(params, function (err) {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    })
});

//删除相册
router.post('/deleteGallery', function (req, res, next) {
    gallery.delete(req.body.id, function (err) {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    });
});
module.exports = router;

