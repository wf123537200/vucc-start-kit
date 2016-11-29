/**
 * vue-resource 包装
 */
import Vue from 'vue';
import vueResource from 'vue-resource';
import {conf} from 'src/config';
import {getCookie} from 'service/cookies';

Vue.use(vueResource);

export default {
    jsonp(method, params, callback) {
        //无查询参数，用于兼容(url,callback)模式
        if (typeof callback === 'undefined' && typeof  params === 'function') {
            callback = params;
            params = {};
        }

        //获取数据路径
        this._ajaxData('jsonp', this._getUrl(method), params, callback);
    },

    /**
     * 获取请求地址
     * @param method    请求方法名
     * @return {String} 请求地址
     * @private
     */
    _getUrl(method) {
        return this.rootUrl + this.childUrl + method;
    },

    /**
     * 统一 通过get请求去后台获取数据
     * @param url
     * @param params
     * @param callback
     * @param options
     */
    getData(url, params, callback, options) {
        this._ajaxData('get', Object.assign({
            url,
            params,
            callback
        }, options));
    },

    /**
     * 统一 通过post请求去后台获取数据
     * @param url
     * @param params
     * @param callback
     * @param options
     */
    postData(url, params = {}, callback, options) {
        this._ajaxData('post', Object.assign({
            url,
            params,
            callback
        }, options));
    },
    /**
     * 统一 通过del操作后台
     * @param url
     * @param params
     * @param callback
     * @param options
     */
    delData(url, params, callback, options) {
        this._ajaxData('DELETE', Object.assign({
            url,
            params,
            callback
        }, options));
    },

    /**
     * 统一 通过del操作后台
     * @param url
     * @param params
     * @param callback
     * @param options
     */
    putData(url, params, callback, options) {
        this._ajaxData('PUT', Object.assign({
            url,
            params,
            callback
        }, options));
    },

    /**
     * 获取ajax 头部需要自定义的部分
     * @param type http method
     * @param contentType
     *
     * @returns {{X-XSRF-TOKEN: *, Content-Type: (*|string), timeout: (*|number|er|Number)}}
     * @private
     */
    _getHeaders(type, contentType) {
        let headers = {
            'X-XSRF-TOKEN' : getCookie('XSRF-TOKEN'),
            'Content-Type': contentType || "application/json",
            timeout : this.timeout
        };

        // jsonp增加头部
        if(type === 'jsonp') {
            headers = Object.assign({
                //  Send request body as application/x-www-form-urlencoded content type
                emulateJSON: true,
                // Indicates whether or not cross-site Access-Control requests should be made using credentials
                credentials: true
            }, headers);
        }

        return headers;
    },

    /**
     * 统一ajax请求获取数据
     * @param type  请求方式
     * @param url   请求地址
     * @param params    请求参数
     * @param callback  回调函数
     * @param isNotCache
     * @param sync  同步方式
     * @param contentType header content type
     */
    _ajaxData : function (type, {url, params, callback, isNotCache = true, sync, contentType}) {
        // 如果是非get请求,则没有isNotCache参数后续参数前移
        if(!/get/i.test(type)) {
            isNotCache = sync;
            sync = contentType;
        }

        // 错误控制
        var noShowError = false;
        if (typeof (params.noShowError) != 'undefined') {
            delete params.noShowError;
            noShowError = true;
        }
        window.REQUESTS = window.REQUESTS || [];
        window.__ajax__cache = window.__ajax__cache || {};

        // 请求开始
        // 获取header头部
        const headers = this._getHeaders(type, contentType);
        // params增加公共参数
        this.addGlobalParams(params);
        const paramsJson = /post|delete|put/i.test(type) ? JSON.stringify(params) : params;

        // 如有缓存则调用缓存
        if(!isNotCache && /get/i.test(type)) {
            if(/get/i.test(type) && window.__ajax__cache[url]) {
                return callback && callback(JSON.parse(window.__ajax__cache[url]));
            } else if(window.__ajax__cache[url + paramsJson]) {
                return callback && callback(JSON.parse(window.__ajax__cache[url + paramsJson]));
            }
        }

        let request = Vue.http[type](url, paramsJson, {
            // 请求头
            headers,
            // 保存xhr,以备取消
            beforeSend: function(xhr) {
                window.REQUESTS.push(xhr);
            }
        }).then((result) => {
            const data = result.data
            // 处理步骤
            const returnCode = data.rtncode;

            switch(returnCode + '') {
                case 'ok':
                case '0': {
                    const resData = data.rtndata || {};
                    callback && callback(resData);
                    // 缓存数据
                    if(/get/i.test(type) && !isNotCache) {
                        window.__ajax__cache[url] = JSON.stringify(resData);
                    } else {
                        window.__ajax__cache[url + paramsJson] = JSON.stringify(resData);
                    }

                    break;
                }
                case '403': {
                    this.showError('无权限');
                    break;
                }
                case '407': {
                    window.location.href = data.rtndata;
                    break;
                }
                case '500': {
                    alert('操作失败');
                    break;
                }
                default: {
                    noShowError ? callback && callback(null) : this.handleAPIError(data);
                }
            }
        }, (result) => {
            //出现错误有可能是因为session超时，这种情况用api检查刷新页面
            if (result.status == 403) {
                this.showError('无权限');
            } else {
                //出错统一处理
                this.handleAPIError(result);
            }
        });
    },

    /**
     * 增加公共参数
     * @param params    提交数据
     * @return {*}      处理后的数据
     */
    addGlobalParams(params) {
        if (params == null)  params = {};
        // 这里可以给params增加一些公共参数
        return params;
    },


    /**
     * 对API调用发生的异常错误做处理（容错、提示、记录）
     * @param result
     */
    handleAPIError(result) {
    },

    //解析出错
    explainError(msg) {
    },

    translate(msg) {
    },

    showError(msg) {
        alert(msg);
    },

    pageNotice(msg) {
    }
};
