/**
 * Created by the_s on 2017/9/23.
 */
var GalleryModel = require('../models/gallery').GalleryModel;
var shortid = require('shortid');
var tool = require('../utility/tool');
var redisClient = require('../utility/redisClient');
var i18n = require('../models/i18n');


/**
 * 新增或更新相册
 * @param params 参数对象
 * @param callback 回调函数
 */
exports.save = function (params, callback) {
    var _id = params.UniqueId,
        entity = new GalleryModel({
            //标题
            galleryName: params.galleryName,
            //描述
            galleryDes:  params.galleryDes,
            //封面圖片
            inputCrop:  params.inputCrop,
            //照片集合
            photoList:  params.photoList
        });
    GalleryModel.findById(_id, function (err, gallery) {
        if (err) {
            return callback(err);
        }
        if (!gallery) {
            //新增
            entity._id = _id;
            entity.CreateTime = new Date();
            entity.save(function (err) {
                if (err) {
                    return callback(err);
                }
                return callback(null);
            });
        } else {
            //更新
            GalleryModel.update({"_id": _id}, entity, function (err) {
                if (err) {
                    return callback(err);
                }
                return callback(null);
            });
        }
    })
};


/**
 * 获取所有相册
 * @param params 参数对象
 * @param callback 回调函数
 */
exports.getAll = function (params, callback) {
    GalleryModel.find({}, {}, {}, function (err,  gallerys) {
        if (err) {
            return callback(err);
        }
        return callback(null, gallerys);
    });
};