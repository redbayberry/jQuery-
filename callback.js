(function (root) {
  var optionsCache = {};
  var _ = {
    callback: function (options) {
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
          if (memory){
            starts = start;
            fire(memory);
          }
},
  fireWith: function(context, argumengts) {
    var args = [context, argumengts];
    if (options.once && testting) {//判断是不是有once以及是不是第一次
      return;
    }
    fire(args);

  },
fire: function() {
  self.fireWith(this, arguments)
}
      }
return self;
    }
  }
function createOptions(options) {
  var object = optionsCache[options] = {};
  //传入的可能是"once memery"
  options.split(/\s+/).forEach(function (value) {
    object[value] = true;
  })
  return object;
}
root._ = _;
}) (this)