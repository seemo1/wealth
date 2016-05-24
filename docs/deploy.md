# Deploy 機制

## 主要解決問題
- 第一次安裝時的會做的環境設定，例如資料庫的 sql。
- 升級時總是會做一些 migrate 動作，例如資料庫的新增資料表格 sql 或是更新資料。
- 分開不同程式來撰寫才不會影響到之前可以正確執行的程式。
- 一個簡易的更新版本控制

## 運作原理
每隻 migration 程式內都有 up 和 down 的 interface，分別撰寫 up (升級)和 down (降級)的程式即可。

在 `migrations/.migrate` 會記錄所有檔案的執行狀態。

每次下 `npm run migrate` 就會從上次記錄最後一次執行的檔案的下一個，執行到最新的檔案(執行 up 區段)。

例如：第一次下
```
$ npm run migrate
up : migrations/1459149829860-install.js
up : migrations/1459150110432-step1.js
up : migrations/1459150112080-step2.js
up : migrations/1459150113494-step3.js
migration : complete
```

連續再下一次
```
$ npm run migrate
migration : complete
```
建立一個新的程式 `npm run migrate create step4`
```
$ npm run migrate
up : migrations/1459153122046-step4.js
migration : complete
```

如要重頭開始，刪掉 `migrations/.migrate` 再下 `npm run migrate` 即可，或是直接下 `npm run migrate down`。


## 操作
### 建立 migration 程式
```
npm run migrate create [filename]
```
例如
```
npm run migrate create install
```

會產生一個 1459149829860-install.js 類似的名字檔案在 migrations 目錄下，前面是 timestamp

### 每次升級
```
npm run migrate
```


### 第一次安裝
```
npm run migrate
```

### 升級到某一個版本(包含這個版本)
```
npm run migrate up 1459150112080-step2.js
```

### 降級到某一個版本(包含這個版本)
```
npm run migrate down 1459150112080-step1.js
```


## 套件
https://github.com/tj/node-migrate