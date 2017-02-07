/*  $.get 封装  */

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

    //  第2 、 4 个参数可有可无
    function get(url,data,cb,dataType,async){
        if(!url) return;
        // 可以不传递data参数 如果data是一个函数
        if(typeof data == 'function'){
            cb = data;
            data= null;
        }
        var _def ={
            url:url,
            async:async||true, // 是否异步
            data:data,
            success:cb,
            dataType:dataType||'json'
        };
        // 如果有data 需要进行URL拼接
        if(_def.data){
            if(isType(_def.data,'object')){
                // 如果是对象 先将其格式化
                var dataStr= '';
                for(var attr in _def.data){
                    dataStr+= attr +'='+ _def.data[attr]+'&';
                };
                _def.data= dataStr.slice(0,dataStr.length-1);
            }
            _def.url+= code(_def.url)+_def.data;
            _def.data =null;
        }


        var xhr = new XMLHttpRequest();
        xhr.open('get',_def.url,_def.async);
        xhr.onreadystatechange = function () {
            if(xhr.readyState==4&&xhr.status==200){
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
            }
        };
        xhr.send();
    };
    window.get = get;
})();
