'use strict';

(function(window) {
  window.fdt = window.fdt || {};
  window.fdt.ui = window.fdt.ui || {};
  var console = fdt.console;

  var View = (function () {
    function View(newState) {
      var that = this;
      var defState = {};
      that.TAG = '[fdt.ui.View]';
      that.state = $.extend({}, defState, newState);
      that.template = undefined;
    }

    View.prototype.render = function() {
      throw new Error('Need implamation render method');
    };

    View.prototype.setState = function(newState) {
      if (this.state instanceof Array) {
        this.state = newState;
      }
      else {
        this.state = $.extend({}, this.state, newState);
      }
      //this.state = newState;
      return this.render();
    };

    View.prototype.getState = function() {
      return this.state;
    };

    View.prototype.remove = function() {
      return this.template.remove();
    };

    View.prototype.get = function() {
      return this.template;
    };

    return View;
  }());


  var ListView = (function (_super) {
    fdt.__extends(ListView, _super);
    function ListView(Item, newState) {
      var that = this;
      var defState = [];
      that.TAG = '[fdt.ui.ListView]';
      that.state = $.extend([], defState, newState);
      that.template = undefined;
      that.lists = [];
      that.Item = Item;
    }

    ListView.prototype.render = function() {
      var that = this;
      console.log(that.TAG, that.state);
      that.state.forEach(function(element, index, array){
        var instance = that.lists[index];
        element.index = index;
        if (!instance) {
          var item = new that.Item(element);
          that.lists.push(item);
          that.template.append(item.render());
        }
        else {
          instance.setState(element);
        }
      })
      if (that.lists.length > that.state.length) {
        var dels = that.lists.splice(that.state.length);
        if($.isArray(dels) > 0) {
          dels.forEach(function(element, index, array){
            element.remove();
          });
        }
      }
      return that.template;
    };
    return ListView;
  }(View));

  var PageListView = (function (_super) {
    fdt.__extends(PageListView, _super);
    function PageListView(Item, newState) {
      var that = this;
      var defState = {
        length : 0, //total number of the query
        data   : [],
        page   : 1,
        pageNumber : 10,
      };
      that.TAG = '[fdt.ui.PageListView]';
      that.state = $.extend({}, defState, newState);
      that.template = undefined;
      that.lists = [];
      that.Item = Item;
    }

    PageListView.prototype.render = function() {
      var that = this;
      console.log(that.TAG, that.state);
      that.state.data.forEach(function(element, index, array){
        var instance = that.lists[index];
        element.index = index;
        if (!instance) {
          var item = new that.Item(element);
          that.lists.push(item);
          that.listTemplate.append(item.render());
        }
        else {
          instance.setState(element);
        }
      })
      if (that.lists.length > that.state.data.length) {
        var dels = that.lists.splice(that.state.data.length);
        if($.isArray(dels) > 0) {
          dels.forEach(function(element, index, array){
            element.remove();
          });
        }
      }
      return that.template;
    };
    return PageListView;
  }(View));
  // export
  window.fdt.ui.View = View;
  window.fdt.ui.ListView = ListView;
  window.fdt.ui.PageListView = PageListView;
})(window)