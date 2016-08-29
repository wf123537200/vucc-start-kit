/**
 * 获取cookie
 * @method getCookie
 * @param  {[type]}  name [description]
 * @return {[type]}       [description]
 */
const getCookie = (name) => {
    const str_cookies = document.cookie;
    const arr_cookies = str_cookies.split(';');
    const num_cookies = arr_cookies.length;
    for(let i = 0; i < num_cookies; i++){
        let arr = arr_cookies[i].split("=");
        if(arr[0].trim() == name) {
            return unescape(arr[1]);
        }
    }

    return null;
};

/**
 * 设置cookie
 * @method setCookie
 * @param  {[type]}  name    [cookie的key]
 * @param  {[type]}  value   [cookie的值]
 * @param  {[type]}  minutes [cookie超时时间，分钟]
 */
const setCookie = (name, value, minutes) => {
        let cookie = name + '=' + escape(value);
        if(minutes){
            const expiration = new Date((new Date()).getTime() + minutes * 60000);
            cookie += ';expires=' + expiration.toGMTString();
        }
        cookie += ';path=/' ;
        if(typeof domain  !== 'undefined') {
            cookie += ';domain=' + domain;
        }
        if(typeof secure !== 'undefined') {
            cookie += ';secure';
        }
        document.cookie = cookie;
};

export {
    getCookie,
    setCookie
}
