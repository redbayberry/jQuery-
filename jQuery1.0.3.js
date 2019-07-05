(function (root) {
  var jQuery = function (selector, context) {
    return new jQuery.prototype.init(selector, context)
  }
  var core_version = "1.0.1";
  var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
  var optionsCache = {};
  jQuery.fn = jQuery.prototype = {
    length: 0,
    jquery: core_version,
    selector: "",
    init: function (selector, context) {
      context = context || document;
      var match, elem, index = 0;
      if (!selector) {//如果没有传入selector，那么就返回jquery的实力对象
        return this;
      }

      //如果传入的是字符串
      if (typeof selector === "string") {
        // 首字符和尾字符，以及长度大于3，就是创建
        if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length > 2) {
          match = [selector];
        }
        //创建Dom
        if (match) {
          //合并数组，现在this有一个length属性
          jQuery.merge(this, jQuery.parseHTML(selector, context))
        } else {
          elem = document.querySelectorAll(selector);
          var elems = Array.prototype.slice.call(elem);
          this.length = elems.length;
          for (; index < elems.length; index++) {
            this[index] = elems[index];
          }
          this.context = context;
          this.selector = selector;

        }

      } else if (selector.nodeType) {//如果传入的是个节点
        this.context = this[0] = selector;
        this.length = 1;
        return this;

      } else if (toString.call(selector) === "[object Function]") {//如果是个函数
        return root.ready !== undefined ?
          root.ready(selector) :
            selector(jQuery)
      }
    }
  }

  jQuery.fn.extend = jQuery.extend = function () {
    var target = arguments[0] || {};
    var length = arguments.length;
    var i = 1;
    var option, deep, src, name, copy;
    if (typeof target === 'boolean') {
      deep = target;
      target = arguments[1] || {};
      i = 2;
    }
    //如果第一个参数不是对象
    if (typeof target !== 'object') {
      target = {};
    }
    //如果只有一个参数
    if (length === i) {
      console.log(this,'this')
      target = this;
      i--;//这样下面遍历的就是第一个参数
    }
    for (; i < length; i++) {
      if ((option = arguments[i]) != null) {
        for (name in option) {
          copy = option[name];
          src = target[name];
          if (deep && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {//深拷贝，但是copy的数据类型必须是Object和Array
            if (copyIsArray) {//如果要拷贝的是数组
              copyIsArray = false;//重置，下次循环重新赋值
              clone = src && jQuery.isArray(src) ? src : []
            } else {
              clone = src && jQuery.isPlainObject(src) ? src : []
            }
            target[name] = jQuery.extend(deep, clone, src)
          } else if (copy != undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  }
  jQuery.fn.extend({
    expando:"jQuery"+(core_version+Math.random()).replace(/\D/g,""),
    guid:1,
    each:function(callback,args){
      return jQuery.each(this,callback,args);
    },
    on:function(types,fn){
      var type;
      if(typeof types === "object"){
        for(type in types){
          this.on(type,types[type])
        }
      }
      return this.each(function(){
        jQuery.event.add(this,types,fn)
      })
    }
  })
  function Data(){
    this.expando = jQuery.expando + Math.random();
    this.cache = {};
  }
  Data.uid = 1;
  Data.prototype = {
    key:function(elem){
      var descriptor = {},
      unlock = elem[this.expando];
      if(!unlock){
        unlock = Data.uid++;
        descriptor[this.expando] = {
          value:unlock
        }
        Object.defineProperties(elem,descriptor)
      }
      if(!this.cache[unlock]){
        this.cache[unlock] = {};
      }
      return unlock;
    },
    get:function(elem,key){
      var cache = this.cache[this.key(elem)];
      return key === undefined?cache:cache[key];
    }
    
  }
  var data_priv = new Data();
  jQuery.event = {
    add:function(elem,type,handler){
      var eventHandle,events,handlers;
      var elemData = data_priv.get(elem);
      if(!handler.guid){
        handler.guid = jQuery.guid++;
      }
      if(!(events = elemData.events)){
        events = elemData.events = {};
      }
      if(!(eventHandle = elemData.handle)){
        eventHandle = elemData.handle = function(e){
          return jQuery.event.dispatch.apply(eventHandle.elem,arguments)
        };
      }
      eventHandle.elem = elem;
      if(!(handlers = events[type])){
        handlers = events[type] = [];
        handlers.delegateCount = 0;
      }
      handlers.push({
        type:type,
        handler:handler,
        guid:handler.guid
      })
      if(elem.addEventListener){
        elem.addEventListener(type,eventHandle,false)
      }
    },
    dispatch:function(event){
      var handlers = (data_priv.get(this,'events')||{})[event.type]||[];
      event.delegateTarget = this;
      jQuery.event.handlers.call(this,event,handlers)
    },
    handlers:function(event,handlers){
      handlers[0].handler.call(this,event)
    }
  }
  jQuery.extend({
    //类型检测
    isPlainObject: function (obj) {
      return toString.call(obj) === "[object Object]"
    },
    isArray: function (obj) {
      return toString.call(obj) === "[object Array]"
    },
    merge: function (first, second) {//把数组成员合并在有length属性的对象上
      var l = +second.length,
        i = first.length,
        j = 0;
      for (; j < l; j++) {
        first[i++] = second[j];
      }
      first.length = i;
      return first;
    },
    parseHTML: function (data, context) {
      if (!data || typeof data !== "string") {
        return null;
      }
      //过滤掉"<a> => a
      var parse = rejectExp.exec(data);
      console.log(parse);
      return [context.createElement(parse[1])]
    },
    callbacks: function (options) {
      options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : {}
      var list = [];
      var index, length, testting, memory, start, starts;
      var fire = function (data) {
        memory = options.memory && data;//只有在第一次fire之后memory才有值，才会在在此add时立即执行
        index = starts || 0;
        start = 0;
        length = list.length;
        for (; index < length; index++) {
          testting = true;
          if (list[index].apply(data[0], data[1]) === false && options[stopOnfalse]) {
            break;
          }
        }
      };
      var self = {
        add: function () {
          //可以传多个
          var args = Array.prototype.slice.call(arguments);
          start = list.length;
          args.forEach(function (fn) {
            //检验每一项是不是函数
            if (toString.call(fn) === "[object Function]") {
              list.push(fn);
            }
          })
          if (memory) {
            starts = start;
            fire(memory);
          }
          return this;
        },
        fireWith: function (context, argumengts) {
          var args = [context, argumengts];
          if (options.once && testting) {//判断是不是有once以及是不是第一次
            return;
          }
          fire(args);

        },
        fire: function () {
          self.fireWith(this, arguments)
        }
      }
      return self;
    },
    Deferred:function(func){
      var tuples = [
        ['resolve','done',jQuery.callbacks("once memory"),"resolved"],
        ['reject','fail',jQuery.callbacks("once memory"),"rejected"],
        ['notify','progress',jQuery.callbacks('memory')]
      ],
      state = "pending",
      promise = {
        state:function(){
          return state;
        },
        then:function(){

        },
        promise:function(obj){
          //jQuery.extend(obj,promise)这里时拆出来赋值上去的  obj {state:,then:,promise:}
          //而不是  obj  {promise:{state}},所以每个derfered
          return obj!=null?jQuery.extend(obj,promise):promise
        }
      }
      deferred = {};
      tuples.forEach(function(tuple,i){
        var list = tuple[2],//创建一个队列
        stateString = tuple[3];
        //promise[done|fail|progress] = list.add
        promise[tuple[1]] = list.add;
        if(stateString){
          list.add(function(){
            //state = [resolved | rejected]
            state = stateString;
          })
        }
        deferred[tuple[0]] = function(){
          deferred[tuple[0]+'With'](this === deferred ? promise :this,arguments);
          return this;
        }
        deferred[tuple[0]+"With"] = list.fireWith;
        promise.promise(deferred);
        console.log(deferred,'deferred')  
      })
      return deferred;
    },
    when:function(subordinate){
      return subordinate.promise();
    },
    each:function(object,callback,args){
      var length = object.length;
      var name,i=0;
      if(args){
        if(length === undefined){
          for(name in object){
            callback.apply(object,args)
          }
        }else{
          for(;i<length;){
            callback.apply(object[i++],args)
          }
        }
      }else{
        if(length === undefined){
          for(name in object){
            callback.call(object,name,object[name])
          }
        }else{
          for(;i<length;){
            callback.call(object[i],i,object[i++])
          }
        }
      }
    }
  })
  function createOptions(options) {
    var object = optionsCache[options] = {};
    //传入的可能是"once memery"
    options.split(/\s+/).forEach(function (value) {
      object[value] = true;
    })
    return object;
  }
  jQuery.fn.init.prototype = jQuery.fn;
  root.$ = root.jQuery = jQuery;
})(this)