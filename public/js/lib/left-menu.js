var LeftMenuList = React.createClass({
  displayName: 'LeftMenuList',

  getInitialState: function () {
    return {
      items: [{ key: 'CannedManager', itemName: '素材管理' }, { key: 'CreateUser', itemName: '新增客戶' }],
      selectKey: ''
    };
  },

  handleClick: function (event) {
    this.setState({ index: event.target.getAttribute('data-index') });
    var selectItem = event.target.getAttribute('data-key');
    if (selectItem === 'CannedManager') {
      $('.im-session-block').hide();
      $('#canned-block').show();
    } else if (selectItem === 'CreateUser') {
      $('.im-session-block').hide();
      $('#canned-block').hide();
    }
    this.setState({ selectKey: selectItem });
  },
  render: function () {
    var that = this;
    var menuItems = this.state.items.map(function (item) {
      if (that.state.selectKey === item.key) {
        return React.createElement(
          'li',
          { key: item.itemName, className: 'left-menu-item active', 'data-key': item.key },
          item.itemName
        );
      } else {
        return React.createElement(
          'li',
          { key: item.itemName, className: 'left-menu-item', 'data-key': item.key },
          item.itemName
        );
      }
    });

    return React.createElement(
      'ul',
      { className: 'left-menu-list', onClick: this.handleClick },
      menuItems
    );
  }
});

ReactDOM.render(React.createElement(LeftMenuList, null), document.getElementById('left-menu-block'));