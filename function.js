// ES5
var testES5 = function (param) {
  console.log(param)
};
testES5('ES5');

// ES6はアロー関数でも記述できる
const testES6 = (param) => {
  console.log(param)
}
testES6('ES6')

// ES6では関数にデフォルト引数を持たせられる
const init = {obj:'obj'}
const testES6Def = (arg = init) => {
  console.log(arg)
}
testES6Def()

// オブジェクト引数を展開済みで渡す
const testES6Obj = ({a,b}) => {
  console.log(a,b)
}
testES6Obj({a:'a',b:'b'})
