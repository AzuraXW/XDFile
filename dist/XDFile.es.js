import 'core-js/modules/es6.object.assign';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var createClass = _createClass;

var XDFile = /*#__PURE__*/function () {
  function XDFile(opt) {
    classCallCheck(this, XDFile);

    var defaultOpt = {
      el: document.body,
      accept: 'image/jpeg',
      clsName: 'xd-wrap',
      drop: false,
      beforeUpload: function beforeUpload(e) {
        return console.log(e);
      },
      onProgess: function onProgess(e) {
        return console.log(e);
      },
      onLoad: function onLoad(e) {
        return console.log(e);
      },
      onError: function onError(e) {
        return console.log('文件读取错误', e);
      }
    }; // 获取挂载的DOM

    if (opt.el) {
      opt.el = opt.el instanceof Object ? opt.el : document.querySelector(opt.el);
    }

    this.options = Object.assign(defaultOpt, opt);
    console.log(this.options);
    this.value = '';
    this.init();
  }

  createClass(XDFile, [{
    key: "init",
    value: function init() {
      this.render();
      this.watch();
    }
  }, {
    key: "watch",
    value: function watch() {
      var _this2 = this;

      var ipt = this.options.el.querySelector('.xd-file');
      ipt.addEventListener('change', function (e) {
        _this2.handleFiles(ipt.files);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var fileFragment = document.createDocumentFragment(),
          file = document.createElement('input'),
          imgPreviewBox = document.createElement('div'); // 设置文件上传控件

      file.type = 'file';
      file.accept = this.options.accept;
      file.classList.add('xd-file');
      fileFragment.appendChild(file); // 设置图片预览框

      imgPreviewBox.classList.add('xd-fileimg-preview-box');
      fileFragment.appendChild(imgPreviewBox);
      this.options.el.classList.add(this.options.clsName);
      this.options.el.appendChild(fileFragment); // 点击图片预览框时可以打开系统文件选择器

      imgPreviewBox.addEventListener('click', function (e) {
        e.preventDefault();
        file.click();
      }, false); // 判断是否可以通过拖拽上传

      if (this.options.drop) {
        imgPreviewBox.addEventListener('dragenter', function (e) {
          e.stopPropagation();
          e.preventDefault();
          this.classList.add('xd-file-dropenter');
        }, false);
        imgPreviewBox.addEventListener('dragover', function (e) {
          e.stopPropagation();
          e.preventDefault();
        }, false);
        imgPreviewBox.addEventListener('dragleave', function (e) {
          e.stopPropagation();
          e.preventDefault();
          this.classList.remove('xd-file-dropenter');
        }, false);
        imgPreviewBox.addEventListener('drop', function (e) {
          e.stopPropagation();
          e.preventDefault();
          var dt = e.dataTransfer;
          var files = dt.files;

          _this3.handleFiles(files);
        }, false);
      }
    }
  }, {
    key: "handleFiles",
    // 处理文件
    value: function handleFiles(files) {
      var _this4 = this;

      // 给组件赋值
      this.value = files;
      var fileReader = new FileReader();

      var _this = this;

      var filetype = this.value[0].type;
      console.log(filetype);
      fileReader.addEventListener('loadstart', function (e) {
        console.log(filetype); // 判断文件格式时候正确

        if (_this4.options.accept !== '*' && _this.options.accept !== filetype.toLowerCase()) {
          fileReader.abort();

          _this.options.beforeUpload(files, e);

          console.error('文件错误', filetype);
        }
      }); // 文件读取完毕

      fileReader.addEventListener('load', function (e) {
        var imgbox = _this4.options.el.querySelector('.xd-fileimg-preview-box');

        if (_this4.isImage(filetype)) {
          imgbox.innerHTML = "";
          imgbox.style.backgroundImage = "url(".concat(fileReader.result, ")");
        } else {
          imgbox.innerHTML = fileReader.result;
        }

        console.log(e);
      }); // 读取文件出错

      fileReader.addEventListener('error', function (e) {
        _this4.options.onError(e);
      }); // 文件读取进度条

      fileReader.addEventListener('progress', function (e) {
        _this4.options.onProgess(e);
      });
      this.isImage(filetype) ? fileReader.readAsDataURL(files[0]) : fileReader.readAsText(files[0]);
    }
  }, {
    key: "clearFile",
    value: function clearFile() {}
  }, {
    key: "isImage",
    value: function isImage(type) {
      var reg = /((image)\/jpeg)|(\1\/png)|(\1\/jpg)|(\1\/gif)/ig;
      return reg.test(type);
    }
  }]);

  return XDFile;
}();

export default XDFile;
