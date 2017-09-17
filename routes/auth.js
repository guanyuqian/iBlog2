var express = require('express');
var router = express.Router();
var tool = require('../utility/tool');
var path = require('path');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var logger = require('../utility/logger');

passport.use(new Strategy(
    {
        usernameField: 'UserName',//页面上的用户名字段的name属性值
        passwordField: 'Password'//页面上的密码字段的name属性值
    },
    function (username, password, cb) {
        var accounts = require('../config/account');
        var validate=false;
        //自己判断用户是否有效
        accounts.forEach(function(account) {
            if (username === account.UserName && password === account.Password) {
                //验证通过
                validate=true;
                return cb(null, account);
            }
        });
        //验证失败
        if(!validate)
        return cb(null, false);
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user.Id);
});

passport.deserializeUser(function (id, cb) {
    var accounts = require('../config/account');
    //自己判断用户是否有效
    var validate=false;
    accounts.forEach(function(account) {
        if (account.Id === id) {
            validate=true;
            return cb(null, account);
        }
    });
    if(!validate)
        return cb(err);
});

//后台登录页面
router.get('/login', function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('auth/login', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("auth.title")
            });
        }
    });
});

//提交登录请求
router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            next(err);
        } else if (!user) {
            logger.errLogger(req, new Error(res.__("auth.wrong_info")));
            res.json({
                valid: false,
                message:'用户名或密码错误'
            });
        } else {
            //登录操作
            req.logIn(user, function (err) {
                var returnTo = '/admin';
                if (err) {
                    next(err);
                } else {
                    //尝试跳转之前的页面
                    if (req.session.returnTo) {
                        returnTo = req.session.returnTo;
                    }
                    res.json({
                        valid: true,
                        returnTo: returnTo
                    });
                }
            });
        }
    })(req, res, next);
});

//退出登录
router.post('/logout',
    function (req, res) {
        req.logout();
        res.redirect('/login');
    });

module.exports = router;
