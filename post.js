/*  $.post 封装  */

(function () {
    // 判断类型
    var isType = function (obj,str) {
        var realType= Object.prototype.toString.call(obj); // [object String]
        var reg= new RegExp('\\[object '+str+'\\]' ,'i');// 两次转义  注意object后面有一个空格
        return reg.test(realType);
    };
    // 判断URL是否通过？还是& 进行参数的追加
    var code = function (url){
        return url.indexOf('?')==-1?'?':'&';
    };

    //  第2个以后的参数可有可无
    function post(url,data,cb,dataType,async){
        if(!url) return;
        var _def ={
            url:url,
            async:async||true, // 是否异步
            data:data,
            success:cb,
        };
        // 如果有data其形式为对象 需要进行格式化
        if(_def.data && isType(_def.data,'object') ){
            var dataStr= '';
            for(var attr in _def.data){
                dataStr+= attr +'='+ _def.data[attr]+'&';
            };
            _def.data= dataStr.slice(0,dataStr.length-1);
        }


        var xhr = new XMLHttpRequest();
        xhr.open('post',_def.url,_def.async);
        xhr.onreadystatechange = function () {
            if(xhr.readyState==4){
                if(xhr.status==200){
                    try {
                        var result = xhr.responseText;
                        // 处理数据类型 dataType  json  text  xml
                        switch (_def.dataType){
                            case 'json':
                                result= 'JSON' in window?JSON.parse(result):eval('('+result+')');
                                break;
                            case 'xml':
                                result = xhr.responseXML;
                                break;
                        }
                        _def.success&&_def.success.call(xhr,result);
                    }catch (e){
                        // 错误或者超时
                        _def.error&&_def.error.call(xhr);
                    }
                }
            }
        };
        xhr.timeout = _def.timeout;
        xhr.ontimeout = function () {
            _def.error&&_def.error.call(xhr);
        };
        xhr.send(_def.data);
    };
    window.post = post;
})();
