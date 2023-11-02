(function(){

    //kassirWidget - это неизвестно что, надо определить
    if ( false !== !!window.kassirWidget ) {
        return;
    }

    if (undefined === Object.assign) {
        Object.assign = function() {
            for(var i=1; i<arguments.length; i++) {
                for(var key in arguments[i]) {
                    if(arguments[i].hasOwnProperty(key)) {
                        arguments[0][key] = arguments[i][key];
                    }
                }
            }

            return arguments[0];
        }
    }

    window.kassirWidget = {
        metaViewport: null
        ,defaults : {width:854,height:590}
        ,wrapper:null
        ,layer:null
        ,iframe:null
        ,zIndex:1000
        ,widgetParams:{}
        ,scroll: {
            style:null,
            keys:[32,33,34,35,36,37,38,39,40],
            preventDefault:function (e) {
                e = e || window.event;
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.returnValue = false;
            },
            wheel:function(e) {
                window.kassirWidget.scroll.preventDefault(e);
            },
            keydown:function(e) {
                var keys = window.kassirWidget.scroll.keys;
                for (var i = 0; i<keys.length; i++) {
                    if (e.keyCode === keys[i]) {
                        window.kassirWidget.scroll.preventDefault(e);
                        return;
                    }
                }
            },
            enable:function () {
                document.getElementsByTagName('body')[0].style = this.style;
                document.getElementsByTagName('html')[0].style = this.htmlStyle;

                if (window.removeEventListener) {
                    window.removeEventListener('DOMMouseScroll', window.kassirWidget.scroll.wheel, false);
                }
                window.onmousewheel = document.onmousewheel = document.onkeydown = null;
                document.removeEventListener('touchmove', window.kassirWidget.scroll.preventDefault, false);
            },
            disable: function() {
                var body = document.getElementsByTagName('body')[0];
                var html = document.getElementsByTagName('html')[0];
                this.style = body.style;
                this.htmlStyle = html.style;
                body.style.overflow = 'hidden';
                body.style.position = 'relative';
                body.style.height = '100%';

                window.addEventListener('DOMMouseScroll', window.kassirWidget.scroll.wheel, false);
                window.onmousewheel = document.onmousewheel = window.kassirWidget.scroll.wheel;
                document.onkeydown = window.kassirWidget.scroll.keydown;
                document.addEventListener('touchmove', window.kassirWidget.scroll.preventDefault, false);
            }
        }
        ,isMobile:{
            //Usage: if (isMobile.any()) {...}
            x :function() {
                return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            },
            y: function() {
                return window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
            },
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            }
            ,BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            }
            ,iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            }
            ,Opera: function() {
                return navigator.userAgent.match(/Opera Mini|opera mobile/i);
            }
            ,Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            }
            ,any: function() {
                return (this.x() <=854 || this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
            }
        }
        ,init :function () {

            var isMobile = this.isMobile.any();

            //1. создать слой затемнения
            this.layer = document.createElement('div');
            this.wrapper = document.createElement('div');

            with(this.layer.style){
                position = 'fixed';
                width = height = '100%';
                left = top = '0';
                opacity = '0.5';
                zIndex = this.zIndex;
                backgroundColor = '#000000';}

            document.body.appendChild(this.layer);


            var calculateWidth = this.widgetParams.width;
            with (this.wrapper.style) {
                position = 'fixed';
                width = ('' + calculateWidth).indexOf('%') !== -1
                    ? calculateWidth
                    : calculateWidth + 'px';
                boxSizing = 'content-box';
                height = this.widgetParams.height + 'px';
                left = '50%';
                top = '50%';
                backgroundColor = 'rgba(200,200,200,.5)';
                marginLeft = '-' + (parseInt(calculateWidth) / 2) + (('' + calculateWidth).indexOf('%') !== -1 ? '%' : 'px');
                marginTop = '-295px';
                padding = '10px';
                zIndex = '100000000';
            }

            if (isMobile){
                // для мобилы установим свои стили
                with (this.wrapper.style) {
                    position = 'fixed';
                    width = '100%';
                    height = '100%';
                    left = '0';
                    top = '0';
                    backgroundColor = 'rgba(200,200,200,1)';
                    padding = '0';
                    margin = '0';
                }
            }
            document.body.appendChild(this.wrapper);

            //кнопка удаления закрытия диалогового окна
            var btn=document.createElement('img');
            btn.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QQNCDMvR48VSwAAAL5JREFUSMfNl2EKgDAIha2TdTKPJt3M/iyocEtt8hqMYKVfmdO3RVUJMdZ21TalkMUXDpGqkt4Ht7WZkx8M6t3gWZ9p+JYruARu+Tx5byHhCqgFngLv+RiCR4ZfoC5wFv5m4wJH4Z5n3eCAQ9cLhsCO/xaJSgw82B4SyYMUuAOPJl8O3IwlA32C10RR2o21LVPa/h3qTpfh0uSCbCdIAYGUTEiTgLRFlBCASB+I2JNCbW3C4YK+EmpFlRbUoe0AWINYOC0WwDQAAAAASUVORK5CYII=";
            if ( isMobile ) {
                with(btn.style){
                    left = "0";
                    top = "10px";
                    transform = 'scale(.8)';
                    position = "absolute";
                    left = '0';
                    top = '5px';
                }
                this.wrapper.appendChild(btn);

                var text = document.createElement('div');
                with(text.style){
                    height  = "40px";
                    padding = "5px 10px 5px 40px";
                    lineHeight = '15px';
                    width = (this.isMobile.x() - 40) + 'px';
                    textOverflow = 'ellipsis';
                    overflow   = 'hidden';
                    whiteSpace = 'nowrap';
                    textAlign = 'center';
                }
                text.innerHTML = document.title + '<br><small>'+window.location.origin+'</small>';
                this.wrapper.appendChild(text);
            } else {
                with (btn.style) {
                    position = "absolute";
                    right = "-40px";
                    top = "0";
                    cursor = "pointer";
                }
                this.wrapper.appendChild(btn);
            }

            btn.addEventListener('click', function(){
                with(window.kassirWidget){
                    wrapper.style.display = layer.style.display = 'none';
                }
                window.kassirWidget.scroll.enable();
            });

            this.iframe=document.createElement('iframe');
            with(this.iframe.style){
                width  = '100%';
                height = '100%';
                border = 'none';
                background = '#fff';
            }

            window.addEventListener('resize', this.regenerateIframeHeight.bind(this));
            window.addEventListener('message', function(event) {
                try {
                    var url = new URL("/", kassirWidget.widgetParams.url);
                    if (event.origin === url.origin) { // принимаем сообщения только от нашего виджета
                        if(event?.data) {
                            var data = JSON.parse(event?.data)
                            var eventName = data.event
                            if (eventName === 'purchase') {
                                window.dataLayer = window.dataLayer || []
                                window.dataLayer.push(data)
                            }
                        }
                    } else {
                        // что-то прислали с неизвестного домена - проигнорируем..
                    }
                } catch (e) {
                    console.log('ошибка в start-frame.js не смогли обработать сообщение из iframe', e)
                }
            });

            this.iframe.name   = 'KWidget';
            this.iframe.onload = function () {

                var event = new CustomEvent("KWidget.loaded");
                document.dispatchEvent(event);

                var parsedUrl = window.kassirWidget.parseURL(window.kassirWidget.widgetParams.url);
                if (typeof ga !== 'undefined' && typeof ga['getAll'] !== 'undefined') {
                    ga.getAll().forEach(function (tracker) {
                        document.getElementsByName('KWidget')[0].contentWindow.postMessage(tracker.get('clientId'), parsedUrl.protocol + '//' + parsedUrl.hostname);
                    });
                }
                window.kassirWidget.regenerateIframeHeight.call(window.kassirWidget);
            };
            this.wrapper.appendChild(this.iframe);
        }

        ,regenerateIframeHeight: function(){
            this.iframe.style.height = this.isMobile.any() ? (this.isMobile.y() - 50) + 'px' : '100%';
        }
        ,summon:function(options) {

            // apply options
            options = options || {};
            this.widgetParams = Object.assign({}, this.defaults, options);
            if (typeof this.widgetParams.url === 'undefined') {
                var event = window.event || arguments.callee.caller.arguments[0],
                    t = event.currentTarget;
                this.widgetParams.url = t.href;
            }


            //первый запуск
            if (null === this.layer) {
                this.init();
            }

            window.kassirWidget.scroll.disable();

            document.cookie = ('#' !== this.widgetParams.url)
                ? "_kassirWidget="+encodeURIComponent(this.widgetParams.url)
                : "_kassirWidget=; expires=-1";

            this.wrapper.style.display = this.layer.style.display = 'block';

            this.iframe.src = this.widgetParams.url
                + "&domain="+window.location.protocol + '//' + window.location.host
                + "&clientID=" + window.kassirWidget.getClientID();
            return false;
        }
        ,getClientID :function(){
            if (typeof ga !== 'undefined' && typeof ga['getAll'] !== 'undefined' && ga.getAll().length){
                return ga.getAll()[0].get('clientId');
            }
            return '';
        }
        ,parseURL:function(url) {
            var parser = document.createElement('a'),
                searchObject = {},
                queries, split, i;
            // Let the browser do the work
            parser.href = url;
            // Convert query string to object
            queries = parser.search.replace(/^\?/, '').split('&');
            for( i = 0; i < queries.length; i++ ) {
                split = queries[i].split('=');
                searchObject[split[0]] = split[1];
            }
            return {
                protocol: parser.protocol,
                host: parser.host,
                hostname: parser.hostname,
                port: parser.port,
                pathname: parser.pathname,
                search: parser.search,
                searchObject: searchObject,
                hash: parser.hash
            };
        }
    }

})();
