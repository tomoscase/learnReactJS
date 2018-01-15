# JavaScript Standard Style

[JavaScript Standard Style](https://standardjs.com/)はES6以降のデファクトスタンダートな文法です。

* インデント2つのスペース 
* ストリングはシングルクォーテーションで囲む – エスケープを避けるため
* 使わない変数は消す – バグの温床となる
* セミコロンは書かない
* if(condition){...}内の単語の後ろにはスペースを入れる
* function name (arg){...}でfunctionの名前の後ろにはスペースを入れる
* 常に==ではなく===を使う – ただしobj ==nullはnull||undefinedをチェックするために使っても良い

...etc

# ESLint

[ESLint](https://eslint.org/)というツールを導入することで未使用の変数やコーディングスタイルをチェックしてくれます。  
eslintコマンドを使うにはeslintをグローバルインストールします。  
VSCodeの人は[VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint#overview)を入れておくとエディット中も随時lintチェックが有効になるのでlintエラーを編集しながら確認できます。  

```
$ yarn add --global eslint
```

プロジェクト内では.eslintrc.jsという設定ファイルに基づいてlintチェックを行ってくれます。  
次のeslint系のパッケージをインストールします。  
webpack用にeslint-loader、  
react用にeslint-plugin-reactも追加しています。  

```
$ yarn add --dev babel-eslint eslint eslint-loader eslint-plugin-react
```

.eslintrc.jsです。

```
module.exports = {
  'parser': 'babel-eslint',
  'env': {
    'browser': true, // ブラウザ
    'es6': true
  },
  // reactプラグイン
  'extends': ['eslint:recommended', 'plugin:react/recommended'],
  'parserOptions': {
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true,
      'jsx': true // JSX文法有効
    },
    'sourceType': 'module'
  },
  // reactプラグイン使用
  'plugins': [
    'react'
  ],
  'globals': {
  },
  'rules': {
    // インデントルール
    'indent': [
      'error',
      2,
      { 'SwitchCase': 1 }
    ],
    // 改行コード
    'linebreak-style': [
      'error',
      'unix'
    ],
    // シングルクォートチェック
    'quotes': [
      'error',
      'single'
    ],
    // 末尾セミコロンチェック
    'semi': [
      'error',
      'never'
    ],
    // マルチライン末尾コンマ必須
    'comma-dangle': [
      'error',
      'always-multiline'
    ],
    // 末尾スペースチェック
    'no-trailing-spaces': [
      'error'
    ],
    // 単語間スペースチェック
    'keyword-spacing': [
      'error',
      { 'before': true, 'after': true }
    ],
    // オブジェクトコロンのスペースチェック
    'key-spacing': [
      'error',
      { 'mode': 'minimum' }
    ],
    // コンマ後スペースチェック
    'comma-spacing': [
      'error',
      { 'before': false, 'after': true }
    ],
    // ブロック前スペースチェック
    'space-before-blocks': [
      'error'
    ],
    // アロー関数スペースチェック
    'arrow-spacing': [
      'error',
      { "before": true, "after": true }
    ],
    // 括弧内のスペースチェック
    'space-in-parens': [
      'error',
      'never'
    ],
    // オブジェクトのdot記法強制
    'dot-notation': [
      'error'
    ],
    // ブロックを不要に改行しない
    'brace-style': [
      'error',
      '1tbs'
    ],
    // elseでreturnさせない
    'no-else-return': [
      'error'
    ],
    // 未使用変数チェック
    'no-unused-vars': [
      'warn',
      { 'ignoreRestSiblings': true }
    ],
    'no-console': 'off',
    // reactのprop-typesチェックをしない
    'react/prop-types': 'off',
    // reactのコンポーネント名チェックをしない
    'react/display-name': 'off'
  }
}
```

eslintコマンドで直接フォルダをlintするには下記のコマンドで行えます。  

```
$ eslint .
```

lintチェックと同時に自動修正するには`--fix`オプションをつけます。  
（warnは自動修正してくれないので注意）  

```
$ eslint . --fix
```

今回はpackage.jsonにlintスクリプトを作成してます。

```package.json
"scripts": {
  "lint": "eslint .",
},
```

上記lintは下記のコマンドにて実行できます。  

```
$ yarn run lint
```

マジックコメント（特殊なコメント）でeslintをignoreすることもできます。  
今回はclient/src/index.jsにて使用しています。  

```client/src/index.js
/*globals module: false */

// 本来ならば定義されていないグローバル変数エラーのlint表示が出るが、HMRはデバッグ時のみ有効なので無視したい
if (module.hot) {
  module.hot.accept('./App', () => {
    render(App)
  })
}
```