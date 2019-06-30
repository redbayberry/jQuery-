(function (root) {
  var jQuery = function (selector, context) {
    return new jQuery.prototype.init(selector, context)
  }
  var version = "1.0.1";
  var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
  jQuery.fn = jQuery.prototype = {
    length: 0,
    jquery: version,
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
          for (; index < elems.length; index++) {
            this[index] = emems[index];
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
    }
  })
  jQuery.fn.init.prototype = jQuery.fn;
  root.$ = root.jQuery = jQuery;
})(this)