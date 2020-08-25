class XDFile {
  constructor(opt) {
    const defaultOpt = {
      el: document.body,
      accept: 'image/jpeg',
      clsName: 'xd-wrap',
      drop: false,
      beforeUpload: e => console.log(e),
      onProgess: e => console.log(e),
      onLoad: e => console.log(e),
      onError: e => console.log('文件读取错误', e)
    }

    // 获取挂载的DOM
    if (opt.el) {
      opt.el = opt.el instanceof Object ? opt.el : document.querySelector(opt.el);
    }
    
    this.options = Object.assign(defaultOpt, opt);
    console.log(this.options);
    this.value = '';
    this.init();
  };
  init () {
    this.render();
    this.watch();
  };
  watch () {
    const ipt = this.options.el.querySelector('.xd-file');
    ipt.addEventListener('change', (e) => {
      this.handleFiles(ipt.files);
    });
  };
  render () {
    const fileFragment = document.createDocumentFragment(),
          file = document.createElement('input'),
          imgPreviewBox = document.createElement('div');
    // 设置文件上传控件
    file.type = 'file';
    file.accept = this.options.accept;
    file.classList.add('xd-file');
    fileFragment.appendChild(file);
    // 设置图片预览框
    imgPreviewBox.classList.add('xd-fileimg-preview-box');
    fileFragment.appendChild(imgPreviewBox);
    this.options.el.classList.add(this.options.clsName);
    this.options.el.appendChild(fileFragment);

    // 点击图片预览框时可以打开系统文件选择器
    imgPreviewBox.addEventListener('click', function (e) {
      e.preventDefault();
      file.click();
    }, false);

    // 判断是否可以通过拖拽上传
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
      imgPreviewBox.addEventListener('drop', (e) => {
        e.stopPropagation();
        e.preventDefault();

        let dt = e.dataTransfer;
        let files = dt.files;
        this.handleFiles(files);
      }, false);
    }
  };
  // 处理文件
  handleFiles (files) {
    // 给组件赋值
    this.value = files;

    const fileReader = new FileReader();

    const _this = this;
    const filetype = this.value[0].type;
    console.log(filetype);
    fileReader.addEventListener('loadstart', e => {
      console.log(filetype);
      // 判断文件格式时候正确
      if (this.options.accept !== '*' && _this.options.accept !== filetype.toLowerCase()) {
        fileReader.abort();
        _this.options.beforeUpload(files, e);
        console.error('文件错误', filetype);
      }
    });
    
    // 文件读取完毕
    fileReader.addEventListener('load', e => {
      const imgbox = this.options.el.querySelector('.xd-fileimg-preview-box');
      if (this.isImage(filetype)) {
        imgbox.innerHTML = "";
        imgbox.style.backgroundImage = `url(${fileReader.result})`;
      } else {
        imgbox.innerHTML = fileReader.result;
      }
      console.log(e);
    });

    // 读取文件出错
    fileReader.addEventListener('error', e => {
      this.options.onError(e);
    });

    // 文件读取进度条
    fileReader.addEventListener('progress', e => {
      this.options.onProgess(e);
    });
    this.isImage(filetype) ? fileReader.readAsDataURL(files[0]) : fileReader.readAsText(files[0]);
  }
  clearFile () {

  };
  isImage (type) {
    const reg = /((image)\/jpeg)|(\1\/png)|(\1\/jpg)|(\1\/gif)/ig;
    return reg.test(type);
  };
};

export default XDFile;
