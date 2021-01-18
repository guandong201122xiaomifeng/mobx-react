import {
    observable,
    isArrayLike,
    computed,
    autorun,
    when,
    reaction,
    action,
    runInAction
} from 'mobx'
// 多次修改值，只触发一次
// action被定义为任何修改状态的行为，可使多次赋值，变成一次

class Store {
    @observable array = [];
    @observable obj = {};
    @observable map = new Map();
    // @observable 已经进行封装，可以直接用来监视下面这些
    @observable str = 'hello';
    @observable num = 20;
    @observable bool = false;
    
    // 更多情况下，computed是用来修饰类的属性成员的
    // 在这种修饰器的情况下，没办法像foo.observe(fun)一样用.observe方法了
    // 这时就需要autorun了
    @computed get mixed(){
        // computed这里还可以引用其他computed的值，但不能循环引用。
        return this.str + '/' + this.num
    }
    // action既可以当普通函数，也可以用做decorator
    @action bar(){
        this.str = 'world'
        this.num = 50
    }
    // 绑定this,把被修饰的方法的上下文绑定到该对象上，这里的上下文就是实例
    @action.bound barBound(){
        this.str = 'world'
        this.num = 50
    }
}
var store = new Store()
reaction(() => [store.str, store.num], arr => {console.log(arr.join('/'))})
// store.bar(); //这里面修改了两个值，只当作修改一次。

// 要是没有action.bound，就不会拿到实例
// var bar = store.bar
// bar() //Cannot set property 'str' of undefined

// var barBound = store.barBound
// barBound()


// runInAction语法糖，匿名的action
runInAction(() => {
    store.str = 'world'
    store.num = 50
})
// 也可以接收一个字符串
// runInAction('modify', () => {
//     store.str = 'world'
//     store.num = 50
// })