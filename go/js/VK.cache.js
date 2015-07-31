/**
 * Created by timur_000 on 26.07.2015.
 */

var VKCache = function(lifeTime, enableErrors){
    var cacheLifeTime = 1;
    var errorsEnabled = true;
    var cacheEnabled = false;

    if(lifeTime > 0)
        cacheLifeTime = lifeTime;
    if(enableErrors != undefined)
        errorsEnabled= enableErrors;


    var noCacheCall = null;

    /**
     * @param {number} lifeTime
     */
    this.setLifeTime = function(lifeTime){
        cacheLifeTime = lifeTime;
    };
    /**
     * @returns {number}
     */
    this.getLifeTime = function(){
        return cacheLifeTime;
    };

    this.enableErrors = function(){
        errorsEnabled = true;
    };
    this.disableErrors = function(){
        errorsEnabled = false;
    };

    /**
     * @param message
     */
    var logError = function(message){
        if(errorsEnabled)
            console.error(message);
    };

    /**
     * @returns {boolean}
     */
    this.isCacheEnabled = function(){
        return cacheEnabled;
    };


    var methodFilter = function(rule){
        if(rule.methodName == rule)
            return true;
        return false;
    };
    var methodAndParamsFilter = function(rule){
        if(typeof Hashcode == "undefined")
            return false;
        if(rule.methodName == this[0] && rule.paramsHash == this[1])
            return true;
        return false;
    };

    var saveCache = function(method, paramsHash, response, lifeTime){
        if(lifeTime <= 0)
            return;
        var cache = store.get(method) || {};
        cache[paramsHash] = {'response': response, 'Expires': Date.now() + lifeTime};
        store.set(method, cache);
    };

    /**
     *
     * @param {string} method
     * @param {object} params
     * @param {function} callback
     */

    this.cacheCall = function(method, params, callback){
        if(cacheEnabled){
            var lifeTime = cacheLifeTime;
            var paramsHash = Hashcode.value(params);
            var saveParams = false;
            var rulesForThis = rulesTable.filter(methodAndParamsFilter, [method, paramsHash]);
            if(rulesForThis.length != 0) {
                lifeTime = rulesForThis[0].lifeTime;
            }
            rulesForThis = rulesTable.filter(methodFilter, method);

            if(rulesForThis.length != 0)
                lifeTime = rulesForThis[0].lifeTime;

            var cacheForMethod = store.get(method) || {};
            var cacheForThis = cacheForMethod[paramsHash] || {'Expires': 0};
            if( Date.now() > cacheForThis.Expires){

                noCacheCall(method, params, function (response) {
                    saveCache(method, paramsHash, response, lifeTime);
                    callback(response);
                });
            }else {

                callback(cacheForThis.response);
            }

        }else{
            noCacheCall(method, params, callback);
        }
    };

    this.enableCaching = function(){
        if(typeof store == "undefined"){
            logError("store not defined(https://github.com/marcuswestin/store.js) ");
            return false;
        }
        if(!store.enabled){
            logError('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
            return false;
        }
        if( VK != undefined){
            cacheEnabled = true;
            noCacheCall = VK.Api.call;
            VK.Api.call = this.cacheCall;
            return true;
        }else{

            logError("VK.Api not defined");
        }
        return false;
    };
    this.disableCaching = function(){
        if( VK != undefined && noCacheCall != null){
            VK.Api.call = noCacheCall;
            cacheEnabled = false;
        }else{
            logError("VK.Api not defined or caching already disabled");
        }
    };


    var instance = this;
    var rulesTable = [];
    this.rules = {
        add: function(method, cacheLifeTime, params){
            var rule = {};
            if( params == undefined){
                rule = {
                    methodName: method,
                    lifeTime: cacheLifeTime
                };
                rulesTable.push(rule);
                return true;
            }else{
                if(typeof Hashcode != "undefined"){
                    rule = {
                        methodName: method,
                        lifeTime: cacheLifeTime,
                        paramsHash: Hashcode.value(params)
                    };
                    rulesTable.push(rule);
                    return true;
                }else{
                    logError("Hashcode not defined(https://github.com/stuartbannerman/hashcode)");
                }

            }
            return false;
        }
    };
};

