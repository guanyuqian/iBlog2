/**
 * Created by the_s on 2017/8/27.
 */
const BAIDU_ICON_HOUSE = new BMap.Icon("/images/house.png", new BMap.Size(32, 32), {});
const BAIDU_ICON_KITCHEN = new BMap.Icon("/images/kitchen.png", new BMap.Size(32, 32), {});
const BAIDU_ICON_PHTOO = new BMap.Icon("/images/photo.png", new BMap.Size(32, 32), {
    // offset: new BMap.Size(10, 25), // 指定定位位置
    // imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
});
const polyLineFocusColor = '#FCB941';
const polyLineDefaultColor = '#2C82C9';
const lushuDefaultColor = '#1abc9c';
const lushuFocusColor = '#2980b9';
const labelDefaultStyle = {
    color: '#2c3e50',
    fontSize: "13px",
    fontWeight: "bold",
    backgroundColor: '#ecf0f1',
    borderColor: '#95a5a6',
    cursor:'pointer'
};
const labelFocusStyle = {
    color: '#34495e',
    fontSize: "14px",
    fontWeight: "bold",
    backgroundColor: '#ecf0f1',
    borderColor: '#7f8c8d',
    cursor:'pointer'
};
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
    enableClickAddChooseMark: true,//可点击建立新点还是查看点
    enableClickSetMarkListAnimation: false,//可点击travelList的对应点跳动
    setAnimationToTravelListByTravel:null
};

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
var DEFAULT_FOOT_SVG = new BMap.Symbol('M563.4 623.8c0.8-13.8 16.6-9 16.6-9l124 25.2 256 97.4c0-48-7.6-53-18.8-61.4L576 414c0 0-9.8-120-9.8-225.8 0-49-23.6-156.2-54.2-156.2s-54.2 108.8-54.2 156.2c0 100.4-9.8 225.8-9.8 225.8L82.8 676c-14.2 10-18.8 15.4-18.8 61.4L320 640l123.8-25.2c0 0 15.8-4.8 16.6 9 0.8 13.8-2.4 138.2 11.8 204.2 1.8 8.8-5 9.4-9.6 14.8l-103.8 65.6c-3.4 3.8-5 14.6-5 14.6l-2 37 136-32 24 64 24-64 136 32-2-37c0.2 0-1.4-10.8-4.8-14.6l-103.8-65.6c-4.6-5.4-11.4-6-9.6-14.8C565.4 762 562.6 637.6 563.4 623.8z', {
    scale: 0.02,
    strokeWeight: 0.1,
    // anchor: new BMap.Size(500, 250),
    rotation: 90,
    fillColor: lushuDefaultColor,
    fillOpacity: 0.8
});
var FOCUS_FOOT_SVG = new BMap.Symbol('M563.4 623.8c0.8-13.8 16.6-9 16.6-9l124 25.2 256 97.4c0-48-7.6-53-18.8-61.4L576 414c0 0-9.8-120-9.8-225.8 0-49-23.6-156.2-54.2-156.2s-54.2 108.8-54.2 156.2c0 100.4-9.8 225.8-9.8 225.8L82.8 676c-14.2 10-18.8 15.4-18.8 61.4L320 640l123.8-25.2c0 0 15.8-4.8 16.6 9 0.8 13.8-2.4 138.2 11.8 204.2 1.8 8.8-5 9.4-9.6 14.8l-103.8 65.6c-3.4 3.8-5 14.6-5 14.6l-2 37 136-32 24 64 24-64 136 32-2-37c0.2 0-1.4-10.8-4.8-14.6l-103.8-65.6c-4.6-5.4-11.4-6-9.6-14.8C565.4 762 562.6 637.6 563.4 623.8z', {
    scale: 0.02,
    strokeWeight: 0.1,
    // anchor: new BMap.Size(500, 250),
    rotation: 90,
    fillColor: lushuFocusColor,
    fillOpacity: 0.8
});
/**
 * in love/index.html
 */
//把点加载到map上
function loadScenicList2Map(travel) {
    scenicList = travel.scenicList;
    var pointList = [];
    for (var i in scenicList) {
        var point = new BMap.Point(scenicList[i].lng, scenicList[i].lat);
        pointList.push(point);
        scenicList[i].mark = new BMap.Marker(point, {icon: ICONList[scenicList[i].type]});
        var label = new BMap.Label(scenicList[i].title, {offset: new BMap.Size(35, -10)});
        label.setStyle(labelDefaultStyle);
        scenicList[i].mark.setLabel(label);
        label.addEventListener("click",function(){
            window.open(travel.Url);
        });
        label.addEventListener("mouseover",
            function(e){
                e.target.setStyle(labelFocusStyle);
            });
        label.addEventListener("mouseout",
            function(e){
                e.target.setStyle(
                    labelDefaultStyle
                );
            });
        label.hide();
    }
    myMap.loadScenicList(scenicList);
    myMap.makeArrowLine(travel, pointList);
}

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
                    "color": "#fff",
                    "lightness": 51,
                    "saturation": -31
                }
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": {
                    "color": "#50B9D7",
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
            if (myMap.enableClickSetMarkListAnimation)
                scenicList[i].mark.addEventListener("click", setMarkClickAnimation);
        }
    };
    myMap.noChooseMark = function () {
        map.removeOverlay(myMap.chooseMark);
        myMap.chooseMark = null;
    };
    myMap.panTo = function (mark) {
        map.panTo(mark.point);
    };

    //点击设置travel的路书和polyline
    myMap.makeArrowLine = function (travel, pointList) {
        if (pointList.length < 2)return;
        travel.polyline = new BMap.Polyline(pointList, {
            strokeColor: polyLineDefaultColor,
            strokeStyle: 'dashed',
            strokeWeight: 3,
            strokeOpacity: 0.9
        });
        travel.lushu = new BMapLib.LuShu(map, pointList, {
            defaultContent: "",
            autoView: true, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
            icon: DEFAULT_FOOT_SVG,
            enableRotation: true, //是否设置marker随着道路的走向进行旋转
            speed: 100000,
            landmarkPois: []
        });
        map.addOverlay(travel.polyline);          //增加折线
        travel.lushu.start();
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
    }

    //地图点击标记选取
    function clickHandler(e) {
        if (myMap.enableClickAddChooseMark)
            addchooseMark(e.point);

    }


    //点击动画，点跳动，线变色
    function setMarkClickAnimation(e) {
        var mark = e.target;
        map.setZoom(6);
        setAnimationToTravelListByMark(mark);
    }

    //设置点点击对应所有点跳动,路书启动，polyline变色，标签出现
    function setAnimationToTravelListByMark(mark) {
        travelList.forEach(function (travel, index, arr) {
            var isFocus=markInScenicList(mark, travel.scenicList);
            myMap.setAnimationToTravelListByTravel(travel,isFocus);
            try {
                checkTimelineByUniqueId(index, isFocus, travel.UniqueId);
            }catch (e){
                console.log("checkTimelineByUniqueId don't execute")
            }
        });
    }
    //设置点点击对应所有点跳动,路书启动，polyline变色，标签出现
     myMap.setAnimationToTravelListByTravel=function(travel,focus) {
         if(travel.scenicList.length==0)return;
            if (focus) {
                allScenicMarkSetAnimation(travel.scenicList, BMAP_ANIMATION_BOUNCE, true);
                if(travel.scenicList.length==1){
                    map.panTo(travel.scenicList[0].mark);
                    return;
                }
                travel.polyline.setStrokeColor(polyLineFocusColor);
                travel.lushu.stop();
                travel.lushu.start();
            }else{
                allScenicMarkSetAnimation(travel.scenicList, null, false);
                if(travel.scenicList.length==1){
                    map.panTo(travel.scenicList[0].mark);
                    return;
                }
                travel.polyline.setStrokeColor(polyLineDefaultColor);
            }
    };
    //点集设置动画
    function allScenicMarkSetAnimation(scenics, Animation, lableShow) {
        scenics.forEach(function (scenic, index2, arr2) {
            scenic.mark.setAnimation(Animation);
            if (lableShow)
                scenic.mark.getLabel().show();
            else
                scenic.mark.getLabel().hide();
        });
    }

    //判断点在ScenicList里面
    function markInScenicList(mark, scenics) {
        var result = false;
        scenics.forEach(function (scenic, index2, arr2) {
            if (mark == scenic.mark)
                result = true;
        });
        return result;
    }

    map.addEventListener('click', clickHandler);
    myMap.newChooseMark();
});