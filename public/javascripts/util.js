/**
 * Created by the_s on 2017/8/27.
 */

/**
 * 生成 ID 唯一标识符
 * @returns {string} 返回UUID
 */
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

//格式化日期
Date.prototype.Format = function (fmt) {
    var o = {
        "y+": this.getFullYear(),
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S+": this.getMilliseconds()             //毫秒
    };
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)){
            if(k == "y+"){
                fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
            }
            else if(k=="S+"){
                var lens = RegExp.$1.length;
                lens = lens==1?3:lens;
                fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1,lens));
            }
            else{
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
    }
    return fmt;
};
function loadTimeline() {
    $('#timeline-container').html("");
    console.log(travelList);
    console.log(travelList.length);
    console.log('loadTimeline');
    for (var i in travelList) {
        console.log(travelList[i]);
        var timelineLi = ['<li class="event">',
            '    <input type="radio" name="tl-group" checked/>',
            '    <label>',
            '    </label>',
            '    <div class="thumb user-4">',
            '   <span> <i class="fa fa-hourglass-start"></i>',
            travelList[i].beginTime,
            '</span>',
            '   <span class="below"> <i class="fa fa-hourglass-end"></i>',
            travelList[i].endTime,
            '</span>',
            '    </div>',
            '    <div class="content-perspective">',
            '        <div class="content">',
            '            <div class="content-inner">',
            '                <h3>',
            travelList[i].Title,
            '                </h3>',
            '                <p>',
            '                  <a href=\"/blog/loveTravel/' + travelList[i].Alias + '\" target=\"_blank\">',
            travelList[i].Summary,
            '                   </a>',
            '                </p>',
            '            </div>',
            '        </div>',
            '    </div>',
            '</li>'].join("");
        $('#timeline-container').append(timelineLi);
    }
};