/*
 * Copyright 2004-2013 ICEsoft Technologies Canada Corp.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an 
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
if (!window['ice']) {
    window.ice = {};
}
if (!window['bridgeit']) {
    window.bridgeit = {};
    window.bridgeIt = window.bridgeit; //alias bridgeit and bridgeIt
}
if (!window.console) {
    console = {};
    if (ice.logInContainer) {
        console.log = ice.logInContainer;
    } else {
        console.log = function() {
        };
        console.error = function() {
        };
    }
}
/**
 * The BridgeIt JavaScript API. Native Mobile integration for your web app.
 * 
 * @class bridgeit
 */
(function(b) {
    
    /* *********************** PRIVATE ******************************/
    function serializeForm(formId, typed) {
        var form = document.getElementById(formId);
        var els = form.elements;
        var len = els.length;
        var qString = [];
        var addField = function(name, value) {
            var tmpStr = "";
            if (qString.length > 0) {
                tmpStr = "&";
            }
            tmpStr += encodeURIComponent(name) + "=" + encodeURIComponent(value);
            qString.push(tmpStr);
        };
        for (var i = 0; i < len; i++) {
            var el = els[i];
            if (!el.disabled) {
                var prefix = "";
                if (typed) {
                    var vtype = el.getAttribute("data-type");
                    if (vtype) {
                        prefix = vtype + "-";
                    } else {
                        prefix = el.type + "-";
                    }
                }
                switch (el.type) {
                    case 'submit':
                    case 'button':
                    case 'fieldset':
                        break;
                    case 'text':
                    case 'password':
                    case 'hidden':
                    case 'textarea':
                        addField(prefix + el.name, el.value);
                        break;
                    case 'select-one':
                        if (el.selectedIndex >= 0) {
                            addField(prefix + el.name, el.options[el.selectedIndex].value);
                        }
                        break;
                    case 'select-multiple':
                        for (var j = 0; j < el.options.length; j++) {
                            if (el.options[j].selected) {
                                addField(prefix + el.name, el.options[j].value);
                            }
                        }
                        break;
                    case 'checkbox':
                    case 'radio':
                        if (el.checked) {
                            addField(prefix + el.name, el.value);
                        }
                        break;
                    default:
                        addField(prefix + el.name, el.value);
                }
            }
        }
        // concatenate the array
        return qString.join("");
    }
    function getDeviceCommand()  {
        var sxkey = "#icemobilesx";
        var sxlen = sxkey.length;
        var locHash = "" + window.location.hash;
        if (sxkey === locHash.substring(0, sxlen))  {
            return locHash.substring(sxlen + 1);
        }
        return null;
    }
    function deviceCommandExec(command, id, options)  {
        console.log("deviceCommandExec('" + command + "', '" + id + ", " + JSON.stringify(options));
        var ampchar = String.fromCharCode(38);
        var uploadURL;
        var sessionid;
        var params;
        var element;
        var formID;
        var callback;

        if (options)  {
            if (options.postURL)  {
                uploadURL = options.postURL;
            }
            if (options.JSESSIONID)  {
                sessionid = options.JSESSIONID;
            }
            if (options.parameters)  {
                if ("string" === typeof options.parameters)  {
                    params = options.parameters;
                } else {
                    params = packObject(options.parameters);
                }
            }
            if (options.deviceCommandCallback)  {
                callback = options.deviceCommandCallback;
                if ("string" != typeof(callback))  {
                    if (bridgeit.allowAnonymousCallbacks)  {
                        callback = "!anon";
                    } else  {
                        console.error(
                            "BridgeIt callbacks must be named in window scope");
                        callback = null;
                    }
                }
            }
            if (options.element)  {
                element = options.element;
            }
            if (options.form)  {
                formID = options.form.getAttribute("id");
            }
        }

        if (!uploadURL)  {
            uploadURL = getUploadURL(element);
        }

        var windowLocation = window.location;
        var barURL = windowLocation.toString();
        var baseURL = barURL.substring(0,
                barURL.lastIndexOf("/")) + "/";

        var returnURL = "" + window.location;
        var lastHash = returnURL.lastIndexOf("#");
        var theHash = "";
        var theURL = returnURL;
        if (lastHash > 0)  {
            theHash = returnURL.substring(lastHash);
            theURL = returnURL.substring(0, lastHash);
        }
        returnURL = theURL + "#icemobilesx";
 
        var hashSubClause = "";
        if (!!theHash)  {
            hashSubClause = "&h=" + escape(theHash);
        }

        var callbackClause = "";
        if (!!callback)  {
            callbackClause = "&c=" + escape(callback);
        }

        var hashClause = "";
        if (!!hashSubClause || !!callbackClause)  {
            hashClause = "&h=" + escape(hashSubClause) + escape(callbackClause);
        }

        if (params && ("" != params)) {
            params = "ub=" + escape(baseURL) + ampchar + params;
        }

        var sessionidClause = "";
        if (sessionid && ("" != sessionid)) {
            sessionidClause = "&JSESSIONID=" + escape(sessionid);
            //also need PHPSESSID and ASPSESSIONID
        }
        var serializedFormClause = "";
        if (formID && ("" != formID))  {
            serializedFormClause = "&p=" +
                    escape(serializeForm(formID, false));
        }
        var uploadURLClause = "";
        if (uploadURL && ("" != uploadURL))  {
            uploadURLClause = "&u=" + escape(uploadURL);
        }
        var sxURL = "icemobile:c=" + escape(command +
                "?id=" + id + ampchar + (params ? params : '')) +
                uploadURLClause + 
                "&r=" + escape(returnURL) +
                sessionidClause +
                hashClause +
                serializedFormClause;
        console.log('sxURL=' + sxURL);

        window.location = sxURL;
    }
    function getSplashClause()  {
        var splashClause = "";
        if (null != bridgeit.splashImageURL)  {
            var splashImage = "i=" + escape(bridgeit.splashImageURL);
            splashClause = "&s=" + escape(splashImage);
        }
        return splashClause;
    }
    function getUploadURL(element)  {
        var uploadURL;

        var windowLocation = window.location;
        var barURL = windowLocation.toString();
        var baseURL = barURL.substring(0,
                barURL.lastIndexOf("/")) + "/";

        if (!element)  {
            uploadURL = baseURL;
        } else {
            var form = formOf(element);
            formID = form.getAttribute('id');
            var formAction = form.getAttribute("action");

            if (!uploadURL) {
                uploadURL = element.getAttribute("data-posturl");
            }
            if (!uploadURL) {        
                if (0 === formAction.indexOf("/")) {
                    uploadURL = window.location.origin + formAction;
                } else if ((0 === formAction.indexOf("http://")) ||
                        (0 === formAction.indexOf("https://"))) {
                    uploadURL = formAction;
                } else {
                    uploadURL = baseURL + formAction;
                }
            }
        }
        return uploadURL;
    }
    var checkTimeout;
    function deviceCommand(command, id, callback, options)  {
        if (navigator.userAgent.toLowerCase().indexOf('android') < 0)  {
            checkTimeout = setTimeout( function()  {
                bridgeit.launchFailed(id);
            }, 3000);
        }
        if (!options)  {
            options = {};
        }
        console.log(command + " " + id);
        bridgeit.deviceCommandCallback = callback;
        options.deviceCommandCallback = callback;
        deviceCommandExec(command, id, options);
    }
    function setInput(target, name, value, vtype)  {
        console.log('setInput(target=' + target + ', name=' + name + ', value=' + value + ', vtype=' + vtype);
        var hiddenID = name + "-hid";
        var existing = document.getElementById(hiddenID);
        if (existing)  {
            existing.setAttribute("value", value);
            return;
        }
        var targetElm = document.getElementById(target);
        if (!targetElm)  {
            return;
        }
        var hidden = document.createElement("input");

        hidden.setAttribute("type", "hidden");
        hidden.setAttribute("id", hiddenID);
        hidden.setAttribute("name", name);
        hidden.setAttribute("value", value);
        if (vtype)  {
            hidden.setAttribute("data-type", vtype);
        }
        targetElm.parentNode.insertBefore(hidden, targetElm);
    }
    function formOf(element) {
        var parent = element;
        while (null != parent) {
            if ("form" == parent.nodeName.toLowerCase()) {
                return parent;
            }
            parent = parent.parentNode;
        }
    }
    function packObject(params)  {
        var packed = "";
        var sep = "";
        for (var key in params)  {
            packed += sep + escape(key) + "=" + escape(params[key]);
            sep = "&";
        }
        return packed;
    }
    function unpackDeviceResponse(data)  {
        var result = {};
        var params = data.split("&");
        var len = params.length;
        for (var i = 0; i < len; i++) {
            var splitIndex = params[i].indexOf("=");
            var paramName = unescape(params[i].substring(0, splitIndex));
            var paramValue = unescape(params[i].substring(splitIndex + 1));
            if ("!" === paramName.substring(0,1))  {
                //ICEmobile parameters are set directly
                result[paramName.substring(1)] = paramValue;
            } else  {
                //only one user value is supported
                result.name = paramName;
                result.value = paramValue;
            }
        }
        return result;
    }
    function url2Object(encoded)  {
        var parts = encoded.split("&");
        var record = {};
        for (var i = 0; i < parts.length; i++) {
            if (!!parts[i])  {
                var pair = parts[i].split("=");
                record[unescape(pair[0])] = unescape(pair[1]);
            }
        }
        return record;
    }
    function addOnLoadListener(func)  {
        var oldonload = window.onload;
        window.onload = function() {
            try {
                if (oldonload)  {
                    oldonload();
                }
            } catch (e)  {
                console.error(e);
            }
            func();
        }
    }
    var isDataPending = false;
    var isLoaded = false;
    var pendingData = null;
    function loadComplete()  {
        isLoaded = true;
    }
    function checkExecDeviceResponse()  {
        var data = getDeviceCommand();
        if (null == data)  {
            data = pendingData;
            //record URL/hash changes that are not device commands
            storeLastPage();
        }
        var deviceParams;
        if (null != data)  {
            pendingData = data;
            isDataPending = true;
            if (!isLoaded)  {
                console.log("checkExecDeviceResponse waiting for onload");
                return;
            }
            var name;
            var value;
            var needRefresh = true;
            if ("" != data)  {
                deviceParams = unpackDeviceResponse(data);
                if (deviceParams.name)  {
                    name = deviceParams.name;
                    value = deviceParams.value;
                    setInput(name, name, value);
                    needRefresh = false;
                }
            }
            if (needRefresh)  {
                console.log('needs refresh');
                if (window.ice.ajaxRefresh)  {
                    ice.ajaxRefresh();
                }
            }
            setTimeout( function(){
                if (!isDataPending)  {
                    console.log("checkExecDeviceResponse is done, exiting");
                    return;
                }
                var sxEvent = {
                    name : name,
                    value : value
                };
                var callback = bridgeit.deviceCommandCallback;
                console.log('sxEvent: ' + sxEvent);
                var restoreHash = "";
                if (deviceParams)  {
                    if (deviceParams.r)  {
                        sxEvent.response = deviceParams.r;
                    }
                    if (deviceParams.p)  {
                        sxEvent.preview = deviceParams.p;
                    }
                    if (deviceParams.c)  {
                        if (ice.push)  {
                            setCloudPushId(deviceParams.c);
                            ice.push.parkInactivePushIds(
                                    deviceParams.c );
                        }
                    }
                    if (deviceParams.h)  {
                        var echoed = url2Object(unescape(deviceParams.h));
                        if (echoed.h)  {
                            restoreHash = echoed.h;
                        }
                        if (echoed.c)  {
                            if (window[echoed.c])  {
                                callback = window[echoed.c];
                            }
                        }
                    }
                }
                var loc = window.location;
                //changing hash to temporary value ensures changes
                //to repeated values are detected
                history.pushState("", document.title,
                        loc.pathname + loc.search + "#clear-icemobilesx");
                history.pushState("", document.title,
                        loc.pathname + loc.search + restoreHash);
                isDataPending = false;
                pendingData = null;
                if (callback)  {
                    try {
                        callback(sxEvent);
                    } catch (e)  {
                        alert("Device function callback failed " + e);
                        alert(e.stack);
                    }
                    bridgeit.deviceCommandCallback = null;
                } else{
                    console.log('no deviceCommandCallback registered :(');
                }
            }, 1);
        }
    }
    var CLOUD_PUSH_KEY = "ice.notifyBack";
    function setCloudPushId(id)  {
        //rely on local storage since cloud push is on modern platforms
        if (localStorage)  {
            localStorage.setItem(CLOUD_PUSH_KEY, id);
        }
    }
    function getCloudPushId()  {
        if (localStorage)  {
            return localStorage.getItem(CLOUD_PUSH_KEY);
        }
        return null;
    }

    function setupCloudPush()  {
        var cloudPushId = getCloudPushId();
        if (!!cloudPushId)  {
            if (ice.push)  {
                console.log("Cloud Push registered: " + cloudPushId);
                ice.push.parkInactivePushIds(cloudPushId);
            }
        }
    }

    function storeLastPage()  {
        var LAST_PAGE_KEY = "bridgeit.lastpage";
        if (localStorage)  {
            localStorage.setItem(LAST_PAGE_KEY, document.location);
        }
    }
    /* Page event handling */
    if (window.addEventListener) {

        window.addEventListener("pagehide", function () {
            //hiding the page either indicates user does not require
            //BridgeIt or the url scheme invocation has succeeded
            clearTimeout(checkTimeout);
            if (ice.push && ice.push.connection) {
                ice.push.connection.pauseConnection();
            }
        }, false);

        window.addEventListener("pageshow", function () {
            if (ice.push && ice.push.connection) {
                ice.push.connection.resumeConnection();
            }
        }, false);

        window.addEventListener("hashchange", function () {
            console.log('entered hashchange listener hash=' + window.location.hash);
            checkExecDeviceResponse();
        }, false);

        window.addEventListener("load", function () {
            setupCloudPush();
            storeLastPage();
        }, false);

    };


    function httpGET(uri, query) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', uri, false);
        xhr.send(query);
        if (xhr.status == 200) {
            return xhr.responseText;
        } else {
            throw xhr.statusText + '[' + xhr.status + ']';
        }
    }

    function endsWith(s, pattern) {
        return s.lastIndexOf(pattern) == s.length - pattern.length;
    }

    var absoluteGoBridgeItURL = null;

    function fetchGoBridgeIt(url) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (4 == xhr.readyState)  {
                if (200 == xhr.status)  {
                    if (!absoluteGoBridgeItURL)  {
                        absoluteGoBridgeItURL = getAbsoluteURL(url);
                        console.log("Cloud Push return via goBridgeIt: " + 
                                absoluteGoBridgeItURL);
                    }
                }
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    }

    function findGoBridgeIt() {
        if (!!bridgeit.goBridgeItURL)  {
            //page setting overrides detection
            absoluteGoBridgeItURL = getAbsoluteURL(bridgeit.goBridgeItURL);
            return;
        }
        //host-wide page
        fetchGoBridgeIt('/goBridgeIt.html');
        //application-specific page
        fetchGoBridgeIt('goBridgeIt.html');
    }

    function getAbsoluteURL(url)  {
        var img = document.createElement('img');
        img.src = url;
        url = img.src;
        img.src = null; //prevent server request
        return url;
    }

    /* *********************** PUBLIC **********************************/
    
    /**
     * Application provided callback to detect BridgeIt launch failure.
     * This should be overridden with an implementation that prompts the
     * user to download BridgeIt and potentially fallback with a different
     * browser control such as input file.
     *   
     * @alias plugin.launchFailed
     * @param {String} id The id of the invoking element TODO
     * @template
     */
    b.launchFailed = function(id)  {
        alert("BridgeIt not available for " + id);
    };
    /**
     * Launch the device QR Code scanner. 
     * 
     * The callback function will be called once the scan is captured.
     * 
     * @alias plugin.scan
     * @param {String} id The id of the invoking element TODO
     * @param {Function} callback The callback function.
     * @param {Object} options TODO
     * @param {String} options.postURL TODO
     * @param {String} options.JSESSIONID The Java Session id (optional)
     * @param {Object} options.parameters Additional parameters TODO
     * @param {HTMLElement} options.element The triggering element TODO
     * @param {HTMLElement} options.form The form element to be serialized TODO 
     * 
     */
    b.scan = function(id, callback, options)  {
        deviceCommand("scan", id, callback, options);
    };
    /**
     * Launch the native camera.
     * 
     * The callback function will be called once the photo is captured.
     * 
     * @alias plugin.camera
     * @inheritdoc #scan
     * 
     */
    b.camera = function(id, callback, options)  {
        deviceCommand("camera", id, callback, options);
    };
    /**
     * Launch the native video recorder.
     * 
     * The callback function will be called once the video has been captured.
     * 
     * @alias plugin.camcorder
     * @inheritdoc #scan
     * 
     */
    b.camcorder = function(id, callback, options)  {
        deviceCommand("camcorder", id, callback, options);
    };
    /**
     * Launch the native audio recorder.
     * 
     * The callback function will be called once the audio is captured.
     * 
     * @alias plugin.microphone
     * @inheritdoc #scan
     * 
     */
    b.microphone = function(id, callback, options)  {
        deviceCommand("microphone", id, callback, options);
    };
    /**
     * Launch the native contact list.
     * 
     * The callback function will be called once the contact is retrieved.
     * 
     * @alias plugin.fetchContact
     * @inheritdoc #scan
     * 
     */
    b.fetchContact = function(id, callback, options)  {
        deviceCommand("fetchContacts", id, callback, options);
    };
    /**
     * Send an SMS message.
     * 
     * The callback function will be called once the message is sent.
     * 
     * @alias plugin.sms
     * @inheritdoc #scan
     * 
     */
    b.sms = function(id, callback, options)  {
        deviceCommand("sms", id, callback, options);
    };
    /**
     * Activate and immerse yourself in a new and better world.
     * 
     * The callback function will be called once ...TODO
     * 
     * @alias plugin.augmentedReality
     * @inheritdoc #scan
     * 
     */
    b.augmentedReality = function(id, callback, options)  {
        deviceCommand("aug", id, callback, options);
    };
    /**
     * Activate native location tracking.
     * 
     * The callback function will be called ..TODO
     * 
     * @alias plugin.geoSpy
     * @inheritdoc #scan
     * 
     */
    b.geoSpy = function(id, callback, options)  {
        deviceCommand("geospy", id, callback, options);
    };
    /**
     * Register BridgeIt integration and configure Cloud Push.
     * 
     * The callback function will be called ..TODO
     * 
     * @alias plugin.register
     * @inheritdoc #scan
     * 
     */
    b.register = function(id, callback, options)  {
        deviceCommand("register", id, callback, options);
    };


    /**
     * Utility method to unpack url-encoded parameters into an object.
     * 
     * @alias plugin.url2Object
     * @param {String} encoded The encoded URL string to unpack
     */
    b.url2Object = function(encoded)  {
        return url2Object(encoded);
    }

    /**
     * Set allowAnonymousCallbacks to true to take advantage of persistent
     * callback functions currently supported on iOS.
     * 
     */
    b.allowAnonymousCallbacks = false;

    /**
     * Set goBridgeItURL to the URL of your goBridgeIt.html file
     * to allow Cloud Push to go back to the most recent page
     * The defaults of the host root and the current relative
     * directory URL do not need to be specified
     */
    b.goBridgeItURL = null;

    /**
     * Configure Push service and connect to it.
     * @param uri the location of the service
     * @param apiKey
     */
    b.usePushService = function(uri, apiKey) {
        if (ice && ice.push) {
            console.log('Push service already loaded and configured');
        } else {
            var baseURI = uri + (endsWith(uri, '/') ? '' : '/');
            var codeURI = baseURI + 'code.icepush';
            var code = httpGET(codeURI, 'apiKey=' + apiKey);
            eval(code);

            ice.push.configuration.contextPath = baseURI;
            ice.push.connection.startConnection();
            findGoBridgeIt();
        }
    };

    /**
     * Add listner for notifications belonging to the specified group.
     * @param group
     * @param callback
     */
    b.addPushListener = function(group, callback) {
        if (ice && ice.push && ice.push.configuration.contextPath) {
            var pushId = ice.push.createPushId();
            ice.push.addGroupMember(group, pushId);
            ice.push.register([ pushId ], callback);
        } else {
            throw 'Push service is not setup';
        }
    };

    /**
     * Push notification to the group.
     * @param groupName
     * @param options that a notification can carry
     */
    b.push = function(groupName, options) {
        if (!absoluteGoBridgeItURL)  {
            if (!!bridgeit.goBridgeItURL)  {
                absoluteGoBridgeItURL = getAbsoluteURL(bridgeit.goBridgeItURL);
            }
        }
        if (!!absoluteGoBridgeItURL)  {
            if (options && !options.url)  {
                options.url = absoluteGoBridgeItURL;
            }
        }
        if (ice && ice.push && ice.push.configuration.contextPath) {
            if (options && options.delay)  {
                ice.push.notify(groupName, options, options);
            } else {
                ice.push.notify(groupName, options);
            }
        } else {
            throw 'Push service is not setup';
        }
    };

    //android functions as full page load
    addOnLoadListener(loadComplete);
    addOnLoadListener(checkExecDeviceResponse);
    checkExecDeviceResponse();
})(bridgeit);

