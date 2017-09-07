/**
 * Created by the_s on 2017/9/6.
 */
var travelList = [];
$(function () {

    $.ajax({
        url: 'timeline', //这里是静态页的地址
        type: "GET", //静态页用get方法，否则服务器会抛出405错误
        success: function (data) {
            $("#timeline").html(data);
            //获取旅游列表
            $.ajax({
                url: 'getTravels', //这里是静态页的地址
                type: "GET", //静态页用get方法，否则服务器会抛出405错误
                success: function (data) {
                    travelList = data.travels;
                    try {
                        PretreatmentTravels(travelList);
                    } catch (e) {
                    }
                    loadTimeline(travelList);
                    timelineFocusReflectMap();
                }
            });
        }
    });

    //地图初始化
    myMap.noChooseMark();
    myMap.enableClickAddChooseMark = false;//不可点选新点
    myMap.enableClickSetMarkListAnimation = true;

    //预处理游记
    function PretreatmentTravels(travels) {
        for (var i in travels) {

            if (typeof travels[i].scenicList == "undefined" || travels[i].scenicList.length == 0) {
                travels[i].beginTime = 'XXXX';
                travels[i].endTime = 'XXXX';
            } else {
                travels[i].scenicList = JSON.parse(travels[i].scenicList);
                travels[i].beginTime = getMaxOrMinPlayTime('max', travels[i].scenicList);
                travels[i].endTime = getMaxOrMinPlayTime('min', travels[i].scenicList);
                loadScenicList2Map(travels[i]);
            }
        }
    }

    //获取最大或者最小时间
    getMaxOrMinPlayTime = function (maxOrMin, scenicList) {
        var result = scenicList[0];
        scenicList.forEach(function (ele, index, arr) {
            if (maxOrMin == 'max' && ele.playTime < result.playTime) {
                result = ele;
            }
            else if (maxOrMin == 'min' && ele.playTime > result.playTime) {
                result = ele;
            }
        });
        return result.playTime;
    };


//时间轴点击映射到地图
    function timelineFocusReflectMap() {
        $("input[name='tl-group']").change(function (e) {
            for (var i in travelList) {
                var travel = travelList[i];
                if (e.target.id == travel.UniqueId) {
                    myMap.setAnimationToTravelListByTravel(travel, true);
                } else {
                    myMap.setAnimationToTravelListByTravel(travel, false);
                }
            }
        });
    }
});

