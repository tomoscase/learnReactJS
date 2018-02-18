# webpackしたコンポーネントを非同期でレンダリングする(Code Spliting)
参考：[Code Splitting for React Router with Webpack and HMR]
(https://hackernoon.com/code-splitting-for-react-router-with-webpack-and-hmr-bb509968e86f)

プロジェクトが大きくなってくるとwebpack.jsでコンパイルしたbundle.jsが肥大化します。
bundle.jsが肥大化するとbundle.jsの読み込みに時間がかかってしまい、初回のページの表示が遅くなります（SPAの欠点）
そこでAsyncComponentを作成して、非同期リソース読み込みを行います。

``` asyncComponent.js
import React from 'react'

// 遅延レンダリングを行うコンポーネント
export default (loader, collection) => (
  class AsyncComponent extends React.Component {
    constructor(props) {
      super(props)
      this.Component = null
      this.state = { Component: AsyncComponent.Component }
    }

    componentWillMount() {
      // 遅延して読み込み完了させる
      setTimeout(() => this.setState({startProgress: true}), 500)
      if (!this.state.Component) {
        loader()
          .then(module => module.default) // export defaultされたコンポーネント
          .then(Component => {
            // コンポーネントを遅延読み込みしたものに差し替え
            AsyncComponent.Component = Component
            this.setState({ Component })
          })
      }
    }

    render() {
      if (this.state.Component) {
        // Wrapしたコンポーネントをレンダリングする
        return <this.state.Component { ...this.props } { ...collection } />
      }

      if (!this.state.startProgress) {
        return null
      }

      // Loading中コンポーネント
      return <div>Now Loading...</div>
    }
  }
)
```

```
const UserPage = asyncComponent(() => import('./components/UserPage'))
```

## webpackでトランスパイル後のファイル名を指定のファイル名にする方法
上記のacyncComponentでラップしたコンポーネントをwebpackでトランスパイルすると
0.jsのようにファイル名がリネームされて出力されてしまいます。
これを回避するためにWebpack 2.4.0以降でmagicコメントが使えます。
参考：[How to use Webpack’s new “magic comment” feature with React Universal Component + SSR](https://medium.com/faceyspacey/how-to-use-webpacks-new-magic-comment-feature-with-react-universal-component-ssr-a38fd3e296a)
このmagicコメントを指定することでwebpackでコンパイルされた後のファイル名を指定することができます。(App.js)

```
const UserPage = asyncComponent(() => import(/* webpackChunkName: 'userpage' */ './components/UserPage'))
const TodoPage = asyncComponent(() => import(/* webpackChunkName: 'todopage' */ './components/TodoPage'))
const NotFound = asyncComponent(() => import(/* webpackChunkName: 'notfound' */ './components/NotFound'))
```

上記マジックコメントで指定すれば、webpackリリースビルド時に  
userpage.js、todopage.js、notfound.jsが出力されます。  
なお、複数コンポーネントがある場合は、magic commentのコンポーネント名は被ってはいけません。  

なお、ReactHotLoader使用時は次のようにrequireすることで、遅延レンダリングではなく  
全て読み込み完了待ちするまで待ってからレンダリングすることができます。  

```
/*globals module: false require: false */

// ReactHotLoader時は全部読み込んでしまう
if (module.hot) {
  require('./components/UserPage')
  require('./components/TodoPage')
  require('./components/NotFound')
}
```