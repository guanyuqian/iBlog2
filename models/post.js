var db = require('./db'),
    mongoose = db.mongoose,
    base = db.base;

var postSchema = base.extend({
    //标题
    Title: {type: String},
    //文章别名
    Alias: {type: String},
    //摘要
    Summary: {type: String},
    //来源
    Source: {type: String},
    //内容
    Content: {type: String},
    //分类Id
    CategoryId: {type: String},
    //标签
    Labels: {type: String},
    //外链Url
    Url: {type: String},
    //浏览次数
    ViewCount: {type: Number},
    //是否草稿
    IsDraft: {type: Boolean},
    //是否有效
    IsActive: {type: Boolean, default: true},

    scenicList: [{
        uuid: String,//id
        title: String,//景点名称
        playTime: Date,//游玩时间
        type: String,//类型，吃住玩
        lng: Number,//经度
        lat: Number//纬度
    }]
});

exports.PostModel = mongoose.model('post', postSchema, 'post');