var CannedManager = React.createClass({
  displayName: "CannedManager",

  getInitialState: function () {
    return {
      tabItem: [{ index: "0", text: "文字" }, { index: "1", text: "圖片" }],
      selectedIndex: "0"
    };
  },
  handleOnTabClick: function (event) {
    this.setState({ selectedIndex: event.target.getAttribute('data-index') });
  },

  render: function () {
    var that = this;
    var tabItems = this.state.tabItem.map(function (item) {
      if (that.state.selectedIndex === item.index) {
        return React.createElement(
          "div",
          { key: item.index, className: "canned-tab active", "data-index": item.index, onClick: that.handleOnTabClick },
          item.text
        );
      } else {
        return React.createElement(
          "div",
          { key: item.index, className: "canned-tab", "data-index": item.index, onClick: that.handleOnTabClick },
          item.text
        );
      }
    });

    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "" },
        tabItems,
        React.createElement("div", { style: { clear: "both" } })
      ),
      React.createElement(CannedMessageView, null)
    );
  }
});

var CannedMessageView = React.createClass({
  displayName: "CannedMessageView",

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.addMessageInput).focus();
  },
  getInitialState: function () {
    return {
      data: [],
      index: 0
    };
  },
  componentWillMount: function () {
    this.loadMessageData();
  },
  loadMessageData: function () {
    var that = this;
    fdt.http.get("/api/canned/v0/cannedMessage", { hits: 20, offset: 0 }).done(function (res) {
      that.setState({ data: res.result.data });
    }).fail(function (err) {
      fdt.alert(err.responseText);
    });
  },
  handleMessageDelete: function (seqno) {
    var that = this;
    fdt.http.delete("/api/canned/v0/cannedMessage/" + seqno).done(function (res) {
      console.log('view delete seqno:' + seqno);
      that.loadMessageData();
    }).fail(function (err) {
      fdt.alert(err.responseText);
    });
  },
  handleMessageUpdate: function (dataObj) {
    console.log(dataObj);
    var that = this;
    fdt.http.put("/api/canned/v0/cannedMessage/" + dataObj.seqno, { message: dataObj.message }).done(function (res) {
      console.log('view update ===' + res);
      that.loadMessageData();
    }).fail(function (err) {
      fdt.alert(err.responseText);
    });
  },
  handleMessageAdd: function () {
    var that = this;
    var message = ReactDOM.findDOMNode(this.refs.addMessageInput).value;
    fdt.http.post("/api/canned/v0/cannedMessage", { message: message }).done(function (res) {
      console.log('view add ===' + res);
      ReactDOM.findDOMNode(that.refs.addMessageInput).value = '';
      that.loadMessageData();
    }).fail(function (err) {
      fdt.alert(err.responseText);
    });
  },
  render: function () {
    return React.createElement(
      "div",
      { className: "canned-frame" },
      React.createElement(
        "div",
        { className: "canned-title" },
        React.createElement("input", { type: "input", className: "canned-input", ref: "addMessageInput", defaultValue: "" }),
        React.createElement(
          "button",
          { type: "button", className: "canned-m btn btn-default", onClick: this.handleMessageAdd },
          "儲存"
        )
      ),
      React.createElement(CannedMessageList, { data: this.state.data, handleMessageDelete: this.handleMessageDelete, handleMessageUpdate: this.handleMessageUpdate })
    );
  }
});

var CannedMessageList = React.createClass({
  displayName: "CannedMessageList",

  getInitialState: function () {
    return {
      data: [],
      ModifyTargetSeqno: 0
    };
  },
  deleteMessage: function (seqno) {
    this.props.handleMessageDelete(seqno);
  },
  editMessage: function (seqno) {
    this.setState({ ModifyTargetSeqno: seqno });
  },
  updateMessage: function (item) {
    this.setState({ ModifyTargetSeqno: 0 });
    this.props.handleMessageUpdate(item);
  },

  render: function () {
    var that = this;
    var itemList = this.props.data.map(function (item) {
      if (that.state.ModifyTargetSeqno == item.seqno) {
        return React.createElement(CannedMessageEditItem, { key: item.seqno, data: item, updateMessage: that.updateMessage });
      } else {
        return React.createElement(CannedMessageItem, { key: item.seqno, data: item, deleteMessage: that.deleteMessage, editMessage: that.editMessage });
      }
    });

    return React.createElement(
      "div",
      { className: "canned-message-list" },
      itemList
    );
  }
});

var CannedMessageItem = React.createClass({
  displayName: "CannedMessageItem",

  handleMessageDeleteButton: function (seqno) {
    this.props.deleteMessage(seqno);
  },
  handleMessageEditButton: function (seqno) {
    this.props.editMessage(seqno);
  },

  render: function () {
    return React.createElement(
      "div",
      { calssName: "canned-message-item", onClick: this.handleMessageEditButton.bind(this, this.props.data.seqno) },
      React.createElement(
        "div",
        { className: "canned-message-item-left" },
        this.props.data.seqno
      ),
      React.createElement(
        "div",
        { className: "canned-message-item-center" },
        this.props.data.message
      ),
      React.createElement(
        "div",
        { className: "canned-message-item-right" },
        React.createElement(
          "button",
          { type: "button", className: "canned-message-button-delete btn btn-default", "data-seqno": this.props.data.seqno, onClick: this.handleMessageDeleteButton.bind(this, this.props.data.seqno) },
          "刪除"
        )
      ),
      React.createElement("div", { style: { clear: "both" } })
    );
  }
});

var CannedMessageEditItem = React.createClass({
  displayName: "CannedMessageEditItem",

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.messageInput).focus();
  },
  handleMessageSave: function (seqno) {
    var message = ReactDOM.findDOMNode(this.refs.messageInput).value;
    var dataObj = {
      seqno: seqno,
      message: message
    };
    this.props.updateMessage(dataObj);
  },
  render: function () {
    return React.createElement(
      "div",
      { className: "canned-message-item" },
      React.createElement(
        "div",
        { className: "canned-message-item-left" },
        this.props.data.seqno
      ),
      React.createElement(
        "div",
        { className: "canned-message-item-center" },
        React.createElement("input", { ref: "messageInput", onBlur: this.handleMessageSave.bind(this, this.props.data.seqno), defaultValue: this.props.data.message })
      ),
      React.createElement("div", { className: "canned-message-item-right" }),
      React.createElement("div", { style: { clear: "both" } })
    );
  }
});

ReactDOM.render(React.createElement(CannedManager, null), document.getElementById('canned-block'));