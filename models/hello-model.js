'use strict';
//TODO 此檔準備移除，正式 code 還沒有使用到 i18n 的地方，故先保留
class HelloModel {

  constructor(i18n) {
    this.i18n = i18n;
  }

  get() {
    let msg = this.i18n.__('hello', 'FDT');
    return msg;
  }

}

module.exports = HelloModel;
