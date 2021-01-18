import {
    observable,
    isArrayLike,
    computed,
    autorun,
    when,
    reaction
} from 'mobx'

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
        return store.str + '/' + store.num
    }
}
// computed 两种用法：
// 1 对可观察数据做出反应
// 2 作为可观察数据用

var store = new Store()

// computed传入一个无参数的函数,一开始就会执行
// var foo = computed(function(){
//     return store.str + '/' +  store.num
// })
// console.log('computed', foo,foo.get())

// 检测数据的变化
// foo.observe(function(change){
//     // change本身存储了修改前后的值
//     console.log(change)
// })
// store.str = 'world'
// store.num = 30


// autorun
// 自动运行什么，传入的参数
// 什么来触发运行

store.num = 30
autorun(function(){
    // 没有参数的函数
    // 代码跑到这里会触发一次
    console.log('autorun', store.str + '/' + store.num)
})
//改变值，修改后，执行依赖该值的行为，这里就是
// 传入autorun的函数
// store.num = 30

// 如果依赖的数据多，每个值改变都会触发行为执行，很浪费资源，下节课再看如何解决


// autorun(function(){
//     // computed的值，可以做为新的可观察数据看待
//     // computed这里还可以引用其他computed的值，但不能循环引用。
//     console.log(store.mixed)
// })
// store.num = 30



// when
// 有条件的执行，代码跑到这里，第一个函数返回true，才执行第二个函数
// 第一个函数必须根据可观察数据来计算bool返回值
// 如果第一个一开始就返回true,那么会同步执行后面的函数
// 打印结果  
// before 
// it is true 
// after

// store.bool = true;
// console.log('before')
// when(() => store.bool, () => {console.log('it is true')})
// console.log('after')

// store.bool = true;

// 如果不是可观察数据，就算是true,也不会执行后面的函数
// when(() => !!store.bar, () => {console.log('it is true')})
// store.bar = true;



// reaction
// 接收两个函数，第一个函数的返回值，作为第二个函数的入参
// 何时使用：一开始不想执行，等数据被填充之后再执行

// 一开始第一个函数会被执行一次，mobx才知道要监视哪些数据，当数据变化时，
// 获取返回值，给第二个函数，执行第二个函数
reaction(() => [store.str, store.num], arr => {console.log(arr.join('/'))})
// store.num = 30