(function(window, $) {
  'use strict';

  window.fdt = window.fdt || {};
  window.fdt.config = {
    debug: true,
    templateUrl: '/templates',
    NIMAppKey: '852d5a5772369d3c3c9c81b7da905bd9',
  };

  var trace = function() {
    return new Error().stack.split('\n');
  }
  var console = {};
  console.log = function() {
    if (fdt.config.debug === true) {
      if (arguments.length > 1) {
        window.console.log.apply(window.console, arguments);
      }
      else {
        window.console.log(arguments[0]);
      }
      //window.console.info(trace()[3].trim());
      window.console.trace();
    }
  };
  console.info = function() {
    if (fdt.config.debug === true) {
      if (arguments.length > 1) {
        window.console.info.apply(window.console, arguments);
      }
      else {
        window.console.info(arguments[0]);
      }
      window.console.trace();
    }
  };
  console.error = function() {
    if (fdt.config.debug === true) {
      if (arguments.length > 1) {
        window.console.error.apply(window.console, arguments);
      }
      else {
        window.console.error(arguments[0]);
      }
      window.console.trace();
    }
  };
  console.warn = function() {
    if (fdt.config.debug === true) {
      if (arguments.length > 1) {
        window.console.warn.apply(window.console, arguments);
      }
      else {
        window.console.warn(arguments[0]);
      }
      window.console.trace();
    }
  };
  window.fdt.console = console;

  window.fdt.__extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };

  window.fdt.nl2br = function(str) {
    return str.replace(/\n/g, "<br />");
  };
  window.fdt.htmlEscape = function(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  window.fdt.modal = function(options) {
    var defaults = {
      id: 'fdt-modal',
      backdrop: true,
      keyboard: true,
      show: true,
      header: undefined,
      title: undefined,
      body: undefined,
      footer: undefined,
    };
    var opts = $.extend({}, defaults, options);
    var template = undefined;
    var modal;
    if ($('#' + opts.id).isExist()) {
      modal = $('#' + opts.id);
    }    else {
      modal = $(document.createElement('div'));
      modal.attr({
        id: opts.id,
        class: 'modal fade',
        tabindex: -1,
        role: 'dialog',
      });
      $('body').append(modal);
    }

    $('body').templateLoad('modal-template', fdt.config.templateUrl + '/modal.html')
    .then(function(temp) {
      template = temp;
      var html = render();
      modal.html(html);
      if (opts.show) {
        modal.modal(opts);
      }
    })
    .fail(function(err) {

    });

    function render() {
      var place = ['header', 'title', 'body', 'footer'];
      place.forEach(function(element, index, array) {
        if (opts[element] !== undefined) {
          template.find('.modal-' + element).empty();
          template.find('.modal-' + element).append(opts[element]);
        }
      });

      return template;
    }
    modal.setOpts = function(options) {
      opts = $.extend(opts, options);
      var html = render();
      modal.html(html);
    }
    return modal;
  };

  window.fdt.alert = function(msg, callback) {
    var modal = fdt.modal({
      show: true,
      keyboard: false,
      backdrop: 'static',
      title: '',
      body: msg,
      footer: '<button type="button" class="btn btn-default" id="modal-close" data-dismiss="modal">確定</button>',
    });
    if (callback && typeof callback === 'function') {
      modal.off('click', '#modal-close');
      modal.on('click', '#modal-close', function(event) {
        callback.call(modal);
      });
    }
  };

  window.fdt.confirm = function(msg, callback) {
    var modal = fdt.modal({
      id: 'confirm-modal',
      show: false,
      keyboard: false,
      backdrop: 'static',
      title: '',
      body: msg,
      footer: [
        '<button type="button" class="btn btn-default" id="modal-no">取消</button>',
        '<button type="button" class="btn btn-danger" id="modal-yes">確定</button>',
      ].join('\n'),
    });
    modal.confirm = false;
    modal.off('click', '#modal-yes');
    modal.on('click', '#modal-yes', function(event) {
      modal.confirm = true;
      callback.call(modal, modal.confirm);
    });

    modal.off('click', '#modal-no');
    modal.on('click', '#modal-no', function(event) {
      modal.confirm = false;
      callback.call(modal, modal.confirm);
    });

    modal.modal('show');
    return modal;
  };

  //http
  //get, post, delete, put
  window.fdt.http = {};
  ['post','get','put','delete'].forEach(function(method, index, array){
    window.fdt.http[method] = function ( url, data, callback, type ) {
      if ( $.isFunction( data ) ) {
        type = type || callback;
        callback = data;
        data = undefined;
      }

      // The url can be an options object (which then must have .url)
      return $.ajax( $.extend( {
        url: url,
        type: method,
        dataType: type,
        data: data,
        success: callback,
        headers: {
            "x-token": 'token',
            "x-language": "tw",
            "x-country": "tw"
        },
      }, $.isPlainObject( url ) && url ) );
    };
  });

  window.fdt.http.getBase64 = function(url) {
    var dfd = $.Deferred();
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      window.fdt.toBase64(this.response)
      .then(function(base64){
        dfd.resolve(base64);
      })
    };
    xhr.open('GET', url);
    xhr.send();
    return dfd.promise();
  };

  window.fdt.toBase64 = function(blob) {
    var dfd = $.Deferred();
    var reader  = new FileReader();
    reader.onload = function (e) {
      dfd.resolve(e.target.result);
    }
    reader.readAsDataURL(blob);
    return dfd.promise();
  };

  window.fdt.Storage = (function () {
    function Storage(key) {
      this.key = key;
    }
    Storage.prototype.set = function(json) {
      return localStorage.setItem(this.key, JSON.stringify(json));
    }

    Storage.prototype.get = function() {
      return JSON.parse(localStorage.getItem(this.key));
    }
    Storage.prototype.remove = function() {
      return localStorage.removeItem(this.key);
    }
    return Storage;
  }());

  window.fdt.SessionStorage = (function () {
    function SessionStorage(key) {
      this.key = key;
    }
    SessionStorage.prototype.set = function(json) {
      return sessionStorage.setItem(this.key, JSON.stringify(json));
    }

    SessionStorage.prototype.get = function() {
      return JSON.parse(sessionStorage.getItem(this.key));
    }

    SessionStorage.prototype.remove = function() {
      return sessionStorage.removeItem(this.key);
    }
    return SessionStorage;
  }());

  /* --- 以下是 jQuery plugin---*/
  $.fn.isExist = function() {
    if (this.length) {
      return true;
    }
    return false;
  };

  $.fn.templateLoad = function(id, url) {
    var dfd = $.Deferred();
    var that = this;
    if (!that.isExist()) {
      throw new Error('Can not found [' + that.selector + ']');
      return false;
    }
    var TAG = '[templateLoad]';
    console.log(TAG, '#' + id);
    if ($('#' + id).isExist()) {
      dfd.resolve($(that.find('#' + id).html()));
      return dfd;
    }

    if (!url) {
      var err = 'Error!!! templateLoad can not get id=' + id + ' template';
      console.error(TAG, err);
      dfd.reject(err);
      return dfd;
    }

    $.ajax(url, {
      method: 'GET',
      dataType: 'html',
      //async: false,
      timeout: 1000,
    })
    .then(function(data, textStatus, jqXHR) {
      var template = $(document.createElement('template')).attr('id', id);
      template.html(data);
      that.append(template);
      dfd.resolve($(data));
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      var err = 'Error!!! templateLoad get ' + url + ' template error';
      console.error(TAG, err);
      dfd.reject(err);
    });

    return dfd.promise();
  };

  $.fn.fileInput = function(options) {
    var that = this;
    if (!that.isExist()) {
      throw new Error('Can not found [' + that.selector + ']');
      return false;
    }
    var defaults = {
      accept: undefined,
      multiple : false,
      onchange : undefined
    };
    var opts = $.extend({}, defaults, options);
    var fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');

    if (opts.accept) {
      fileInput.accept = opts.accept;
    }

    if (opts.multiple) {
      fileInput.multiple = 'multiple';
    }

    if (opts.onchange && typeof opts.onchange === 'function') {
      fileInput.onchange = function () {
        opts.onchange.call(that, fileInput);
      };
    }

    that.on('click', function(e) {
      fileInput.value = '';
      fileInput.click();
    });

    that.fileInput = fileInput;
    return that;
  }
})(window, jQuery);
