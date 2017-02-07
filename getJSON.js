/*  $.getJSON 封装  */

(function () {
    //  2 个参数 URL  cb
    function getJSON(url,cb){
        if(!url) return;
        var _def ={
            url:url,
            cb:cb,
        };
        var xhr = new XMLHttpRequest();
        xhr.open('get',_def.url);
        xhr.onreadystatechange = function () {
            if(xhr.readyState==4 && xhr.status==200){
                var result = xhr.responseText;
                result= 'JSON' in window?JSON.parse(result):eval('('+result+')');
                _def.cb&&_def.cb.call(xhr,result);
            }
        };
        xhr.send();
    };
    window.getJSON = getJSON;
})();
