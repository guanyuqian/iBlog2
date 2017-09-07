/**
 * Created by the_s on 2017/8/27.
 */
const BAIDU_ICON_HOUSE = new BMap.Icon("/images/house.png", new BMap.Size(32, 32), {});
const BAIDU_ICON_KITCHEN = new BMap.Icon("/images/kitchen.png", new BMap.Size(32, 32), {});
const BAIDU_ICON_PHTOO = new BMap.Icon("/images/photo.png", new BMap.Size(32, 32), {
    // offset: new BMap.Size(10, 25), // 指定定位位置
    // imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
});

//MAP ICON 映射
const ICONList =
    {
        '游玩': BAIDU_ICON_PHTOO,
        '吃喝': BAIDU_ICON_KITCHEN,
        '下榻': BAIDU_ICON_HOUSE
    };
var myMap = {
    chooseMark: null,
    polyline: null,//所有覆盖线
    lushu: null,//路书
    saveMark: null,//保存当前点进地图，添加新可选择点
    deleteMark: null,//删除景点的时候
    noChooseMark: null,//移除chooseMark
    newChooseMark: null,//移除chooseMark
    panTo: null,//移除chooseMark
    makeArrowLine: null,//传入两个点，绘制出指向其的线
    loadScenicList: null,//传入ScenicList，载入景点
    enableClickAddChooseMark: true//可点击建立新点还是查看点
}

/**
 * my baidu map API
 */

const BAIDU_ICON_DEFAULT = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
    offset: new BMap.Size(10, 25), // 指定定位位置
    imageOffset: new BMap.Size(0, 0 - 11 * 25) // 设置图片偏移
});
const BAIDU_ICON_FOCUS = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
    offset: new BMap.Size(10, 25), // 指定定位位置
    imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
});
var FOOT_SVG = new BMap.Symbol('M563.4 623.8c0.8-13.8 16.6-9 16.6-9l124 25.2 256 97.4c0-48-7.6-53-18.8-61.4L576 414c0 0-9.8-120-9.8-225.8 0-49-23.6-156.2-54.2-156.2s-54.2 108.8-54.2 156.2c0 100.4-9.8 225.8-9.8 225.8L82.8 676c-14.2 10-18.8 15.4-18.8 61.4L320 640l123.8-25.2c0 0 15.8-4.8 16.6 9 0.8 13.8-2.4 138.2 11.8 204.2 1.8 8.8-5 9.4-9.6 14.8l-103.8 65.6c-3.4 3.8-5 14.6-5 14.6l-2 37 136-32 24 64 24-64 136 32-2-37c0.2 0-1.4-10.8-4.8-14.6l-103.8-65.6c-4.6-5.4-11.4-6-9.6-14.8C565.4 762 562.6 637.6 563.4 623.8z', {
    scale: 0.02,
    strokeWeight: 0.1,
    // anchor: new BMap.Size(500, 250),
    rotation: 90,
    fillColor: 'rgba(65,131,142,1)',
    fillOpacity: 0.8
});
$(function () {
    /**
     *地图初始化
     */
// 创建地图对象并初始化
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom('上海', 4);
    map.enableInertialDragging();
    map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
    //map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
    map.disableDoubleClickZoom();
    map.setMapStyle({
        styleJson: [
            {
                "featureType": "land",
                "elementType": "all",
                "stylers": {
                    "color": "#ffffff",
                    "lightness": 51,
                    "saturation": -31
                }
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": {
                    "color": "#99CCFF",
                    "lightness": 50
                }
            },
            {
                "featureType": "manmade",
                "elementType": "geometry",
                "stylers": {
                    "lightness": 28
                }
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": {
                    "lightness": 82
                }
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": {
                    "color": "#fff2cc",
                    "weight": "0.4",
                    "lightness": 46
                }
            },
            {
                "featureType": "green",
                "elementType": "all",
                "stylers": {
                    "lightness": 37,
                    "saturation": -100
                }
            },
            {
                "featureType": "boundary",
                "elementType": "geometry.fill",
                "stylers": {
                    "lightness": 64,
                    "saturation": -17
                }
            },
            {
                "featureType": "boundary",
                "elementType": "geometry.stroke",
                "stylers": {
                    "lightness": -75,
                    "saturation": -100
                }
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#666666",
                    "weight": "0.1"
                }
            }
        ]
    });

    /**
     * myAPI 函数初始化
     * @type {BMap.Geolocation}
     */
    //加载mark

    myMap.saveMark = function (ICON) {//保存当前点，添加新可选择点
        if (ICON == null || typeof ICON == undefined) {
            ICON = BAIDU_ICON_DEFAULT;
        }
        if (myMap.chooseMark != null) {
            myMap.chooseMark.disableDragging();
            myMap.chooseMark.setIcon(ICON);
            myMap.chooseMark = null;
        }
    };
    myMap.newChooseMark = function () {
        map.panTo(new BMap.Point(116.404, 39.915));
        map.setZoom(4);
        addchooseMark(new BMap.Point(116.404, 39.915));
    };
    myMap.deleteMark = function (mark) {
        map.removeOverlay(mark);
    };
    myMap.loadScenicList = function (scenicList) {
        for (var i in scenicList) {
            map.addOverlay(scenicList[i].mark);
        }
    };
    myMap.noChooseMark = function () {
        map.removeOverlay(myMap.chooseMark);
        myMap.chooseMark = null;
    };
    myMap.panTo = function (mark) {
        map.panTo(mark.point);
    };
    myMap.makeArrowLine = function (pointList) {
        if (pointList.length < 2)return;
        myMap.polyline = new BMap.Polyline(pointList, {
            strokeColor: "SteelBlue",
            strokeStyle: 'dashed',
            strokeWeight: 3,
            strokeOpacity: 0.9
        });
        myMap.lushu = new BMapLib.LuShu(map, pointList, {
            defaultContent: "",

            autoView: true, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
            icon: FOOT_SVG,
            enableRotation: true, //是否设置marker随着道路的走向进行旋转
            speed: 100000,
            landmarkPois: []
        });
        map.addOverlay(myMap.polyline);          //增加折线
        myMap.lushu.start();
        //map.addOverlay(myMap.lushu);          //增加折线
    };


//创建检索控件
    /*
     var searchControl = new BMapLib.SearchControl({
     container: "searchBox" //存放控件的容器
     , map: map  //关联地图对象
     , type: LOCAL_SEARCH  //检索类型
     });
     document.getElementById("selectType").onchange = function () {
     searchControl.setType(this.value);
     };
     */

//地图上选点标记并且设为中心
    function addchooseMark(point) {
        map.removeOverlay(myMap.chooseMark);
        myMap.chooseMark = new BMap.Marker(point, {icon: BAIDU_ICON_FOCUS});
        myMap.chooseMark.enableDragging();
        map.addOverlay(myMap.chooseMark);
        //map.panTo(point);
        return myMap.chooseMark;
    };

//地图点击标记选取
    function clickHandler(e) {
        if (myMap.enableClickAddChooseMark)
            addchooseMark(e.point);
        else{

        }
    }

    map.addEventListener('click', clickHandler);
    addchooseMark('上海');
});