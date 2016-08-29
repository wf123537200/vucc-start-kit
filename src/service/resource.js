import Vue from 'vue';
import vueResource from 'vue-resource';
import {GE} from 'src/config';
import {getCookie} from 'service/cookies';

Vue.use(vueResource);

export default {
    domainPath: GE.domainPath,
    urlRoot :  GE.stepApiPath,
    rootUrl : GE.stepApiPath,
    timeout : GE.timeOut,

    /**
     * post公共方法
     * @param method    请求方法名
     * @param params    参数
     * @param callback  回调函数
     */
    gePost(method, params, callback) {
        //无查询参数，用于兼容(url,callback)模式
        if (typeof callback === 'undefined' && typeof  params === 'function') {
            callback = params;
            params = {};
        }

        //获取数据路径
        this.postData(this._getUrl(method), params, (data) => {
            callback && callback(data);
        }, null);
    },

    /**
     * get公共方法
     * @param method
     * @param params
     * @param callback
     */
    geGet(method, params, callback) {
        //无查询参数，用于兼容(url,callback)模式
        if (typeof callback === 'undefined' && typeof  params === 'function') {
            callback = params;
            params = {};
        }

        //获取数据路径
        this.getData(this._getUrl(method), params, (data) => {
            callback && callback(data);
        }, null);
    },

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
     * @param isNotCache
 *   *  @param sync
     */
    getData(url, params, callback, isNotCache, sync) {
        this._ajaxData('get', url, params, callback, isNotCache, sync);
    },

    /**
     * 统一 通过post请求去后台获取数据
     * @param url
     * @param params
     * @param callback
     * @param sync
     * @param contentType
     */
    postData(url, params, callback, sync, contentType) {
        this._ajaxData('post', url, params, callback, sync, contentType);
    },
    /**
     * 统一 通过del操作后台
     * @param url
     * @param params
     * @param callback
     * @param sync
     */
    delData(url, params, callback, sync) {
        this._ajaxData('DELETE', url, params, callback, sync);
    },

    /**
     * 统一 通过del操作后台
     * @param url
     * @param params
     * @param callback
     * @param sync
     */
    putData(url, params, callback, sync, contenttype) {
        this._ajaxData('PUT', url, params, callback, sync, contenttype);
    },

    /**
     * 统一 通过del操作后台
     * @param url
     * @param params
     * @param callback
     * @param sync
     */
    putDataWithContentType(url, params, callback, sync, contenttype) {
        this._ajaxData('PUT', url, params, callback, sync, contenttype);
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
    _ajaxData : function (type, url, params, callback, isNotCache = true, sync, contentType) {
        //无查询参数，用于兼容(url,callback)模式
        if (typeof callback === 'undefined' && typeof  params === 'function') {
            callback = params;
            params = {};
        }
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
        const headers = this._getHeaders(type, contentType);
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
            const data = result.data;
            // 清除定时器
            this._clearTimeouts();
            // 处理步骤
            const returnCode = data.resultCode || data.code;

            switch(returnCode) {
                case 'ok':
                case '0': {
                    const resData = data.resultData !== undefined ? data.resultData : data.data;
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
                    window.location.href = data.resultData;
                    break;
                }
                case '500': {
                    GRI.UI.alert('操作失败');
                    break;
                }
                default: {
                    noShowError ? callback && callback(null) : this.handleAPIError(data);
                }
            }
        }, (result) => {
            this._clearTimeouts();

            //出现错误有可能是因为session超时，这种情况用api检查刷新页面
            if (result.status == 403) {
                this.showError('无权限');
            } else {
                //出错统一处理
                this.handleAPIError(result);
            }
        });
    },

    //清除定时
    _clearTimeouts() {
        setTimeout(function(){
            let bodyLoading = document.querySelector('#body_loading');
            if (bodyLoading && bodyLoading.style.display === 'none') {
                bodyLoading.style.display = 'none';
            }
        }, 2000);

        var timeouts = window.TIMEOUTS || [];
        for (var i = 0, l = timeouts.length; i < l; i++) {
            clearTimeout(timeouts[i]);
        }

        window.TIMEOUTS = [];
    },

    /**
     * 增加公共参数
     * @param params    提交数据
     * @return {*}      处理后的数据
     */
    addGlobalParams(params) {
        if (params == null)  params = {};
        params['ge_portal_name'] = GE.GLOBAL.portal_name;
        params['ge_portal_type'] = GE.GLOBAL.portal_type;
        params['ge_sys_type'] = GE.GLOBAL.sys_type;
        if (GE.GLOBAL['page_id'] != '') {
            params['ge_page_id'] = GE.GLOBAL['page_id'];
        }

        //随机数，防止提交相同数据不执行
        params['t'] = Math.random();
        return params;
    },


    /**
     * 对API调用发生的异常错误做处理（容错、提示、记录）
     * @param result
     */
    handleAPIError(result) {
        var _this = this;
        let loadDiv = document.querySelector("#loadDiv");
        if(loadDiv && loadDiv.length > 0) loadDiv.style.display = 'none';

        //隐藏loading
        var $loading = document.querySelector('body > .mod-loading');
        if ($loading && $loading.length != 0) {
            $loading.style.display = 'none';
        }

        if (result && typeof result['statusText'] != 'undefined' && result['statusText'] != '') {
            GRI.UI.alert(result['statusText']);
            return;
        }

        //隐藏loading
        if (document.querySelector('.mod-loading') && document.querySelector('.mod-loading').style.display != 'none') {
            document.querySelector('.mod-loading').style.display = 'none';
        }

        //显示下一步的按钮
        Array.from(document.querySelectorAll('#stepNextBtn, #startStep')).forEach((it) => {
            it.className = it.className.replace(/\s?disabled\s?/, ' primary ');
        });

        if (result && typeof result.status !== 'undefined') {
            if (result.status == 401 && typeof result['statusText'] !== 'undefined' && result['statusText'] == 'Unauthorized') {
                //session超时，则刷新页面
                location.reload();
                return;
            } else if (result.status == 0 && typeof result['statusText'] !== 'undefined') {
                //页面刷新
                return;
            } else if (result.status == 403) {
                GRI.UI.warn('无操作权限！', function() {
                    window.location.href = _this.domainPath;
                });
                return;
            }
        }

        if(result.hasOwnProperty('message')) {
            if (result.message == 'cluster not found') {
                location.href = '#step';
                return;
            }
            var msg = _this.translate(result.message);

            if (msg == '集群还未安装~' || msg == '该服务还未安装~') {
                _this.pageNotice(msg);
            } else {
                GRI.UI.alert(msg);
            }
            return false;
        }
    },

    //解析出错
    explainError(msg) {
        var text = '系统出错！请稍后再试，';

        text += '</p><p><a class="confirm-trigger" href="javascript:void(0);">错误详情<i class="ui-i ui-i-tri"></i></a>';
        return text;
    },

    translate(msg) {
        var map = {
            'cluster not found' : '集群还未安装~',
            'fail to fetch.*?host.*?' : '该服务还未安装~',
            'fail to fetch.*' : '该服务还未安装~',
            'nameExits' : '名称已存在',
            '.*nameExits' : '用户名已存在',
            'name conflict' : '文件名冲突',
            'content conflict' : '文件内容冲突',
            'file not found' : '上传失败',
            'upload ftp error.*' : 'ftp 上传失败',
            'can not get .*' : '组件还未安装~',
            'service .* is not available' : '该组件已停止运行!',
            'invalid weight of yarn' : '无效的权值配置',
            'invalid vcore and memory settings' : '无效的虚拟内核或内存配置',
            'no resource in yarn' : '集群无资源',
            'vcore and memory settings more than total' : '虚拟内核或内存配置超过资源池的总量',
            'field QueueConfigEntity' : '资源池创建失败'
        };
        for (var key in map) {
            var reg = new RegExp("^"+key+"document.querySelector");
            if (reg.test(msg)) {
                return map[key];
            }
        }
        return msg;
    },

    showError(msg) {
        document.querySelector('.layout-main-cnt').innerHTML = '<div class="cnt-inner">'
            + '<div class="wrapper gui-no-access">'
            + '  <div class="access-cnt">'
            + '    <i class="icon i-404"></i>'
            + '   <h3>页面发生错误</h3>'
            + '   <p>' + msg + '</p>'
            + '  </div>'
            + '</div>'
            + '</div>';
    },

    pageNotice(msg) {
        document.querySelector('#body').innerHTML = '<div class="gui-nodata"><i class="gui-i nodata"></i><div class="ctn">' + msg + '</div></div>';
        return false;
    }
};
