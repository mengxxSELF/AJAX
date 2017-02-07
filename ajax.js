/* ajax重新封装 */

(function () {
    // 判断类型
    var isType = (function (obj,str) {
        var realType= Object.prototype.toString.call(obj); // [object String]
        var reg= new RegExp('\\[object '+str+'\\]' ,'i');// 两次转义  注意object后面有一个空格
        return reg.test(realType);
    })(obj,str);
    // 判断URL是否通过？还是& 进行参数的追加
    var code = (function (url){
        return url.indexOf('?')==-1?'?':'&';
    })(url);


    // 参数1个或者2个
    function ajax(url,options){
//    判断URL的类型是字符串还是对象
        if(isType(url,'string')){
            // 字符串
            options.url=url;
        }else if(isType(url,'object')){
            // 是对象
            options = url;
            url=null;
        }
        options = options || {};

        // 设置默认值
        var _def = {
            url:null,
            method:'get',
            async:true, // 是否异步
            data:null,
            dataType:'json',
            cache:true, // 是否关闭缓存 默认无缓存
            success:null // 成功回调函数
        };
        // 默认值赋值
        for(var attr in options){
            if(options.hasOwnProperty(attr)){
                if(attr=='type'){
                    _def['method']=options['type'];
                }
                _def[attr]=options[attr];
            }
        }

        //处理缓存 当 get系列 并且 cache 为false  进行清除缓存
        var regG = /(get|delete|head)/i,
            regP= /(post|put)/i;
        // 处理data 当有data 并且data为对象类型  需要转为字符串
        if(isType(_def.data,'object')){
            var dataStr='';
            for(var attr in _def.data){
                dataStr+= attr +'='+ _def.data[attr]+'&';
            };
            _def.data= dataStr.slice(0,dataStr.length-1);
        }
        // 如果此时是get类型 还需要将data追加到URL
        if(_def.data&&regG.test(_def.method)){
            _def.url+= code(_def.url)+_def.data;
            _def.data =null;
        }


        if(regG.test(_def.method)&&_def.cache== false){
        //    进行清除缓存  url 追加随机数 但是要判断是通过？还是&进行追加
            _def.url+= code(_def.url)+'_='+Math.random().toFixed(2);
        }



        // 开启四步
        var xhr = new XMLHttpRequest();
        xhr.open(_def.method,_def.url,_def.async);
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
        xhr.send(_def.data);
    };
    window.ajax = ajax;

})();

