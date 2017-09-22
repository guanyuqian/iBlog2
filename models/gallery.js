var db = require('./db'),
    mongoose = db.mongoose,
    base = db.base;

var gallerySchema = base.extend({
    //标题
    galleryName: {type: String},
    //描述
    galleryDes: {type: String},
    //封面圖片
    inputCrop: {type: String},
    //照片集合
    photoList: {type: String},

    CreateTime: {type: Date}
});

exports.GalleryModel = mongoose.model('gallery', gallerySchema, 'gallery');