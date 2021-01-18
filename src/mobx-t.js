import {observable, isArrayLike} from 'mobx'
// observable是个函数，本身还挂了一个observable.box

// 对于数组，对象，map,直接用observable把对象转化为可观察的对象，
// 然后对数据的操作都会被监视

// 对于其他的类型数据，要用observable.box包装为可观察对象，
// 监视该变量的直接赋值,监视该变量的引用地址。

//监视数组
// let arr = observable([1,2,3])
// console.log(arr, Array.isArray(arr), isArrayLike(arr))
// mobx-t.js:10 ObservableArray {$mobx: ObservableArrayAdministration} false true

// 虽然不是数组，但还是可以通过下标来访问，但不要越界，arr[3]访问第四个就越界
// console.log(arr[2])

// // 调用数组方法
// arr.pop()
// console.log(arr.length)
// arr.push(12)
// console.log(arr.length)



//监视对象
// 只能监视对象本身存在的属性，如果另外增加的要用extendObservable(),
// 所以把可能用到的属性先定义。
// let obj = observable({a:1,b:2})
// console.log(obj, obj.a, obj.b)

// 监视map
// let map = observable(new Map())
// console.log(map)
// map.set('a',2)
// console.log(map.has('a'))


// 
// var num = observable.box(20)
// var str = observable.box('hello')
// var bool = observable.box(true)
// //获取的话用get
// console.log(num,num.get(),str,str.get(),bool,bool.get()) 

// // 设置值用set
// num.set(30)
// str.set('world')
// bool.set(false)
// console.log(num,num.get(),str,str.get(),bool,bool.get()) 



class Store {
    @observable array = [];
    @observable obj = {};
    @observable map = new Map();
    // @observable 已经进行封装，可以直接用来监视下面这些
    @observable str = 'hello';
    @observable num = 20;
    @observable bool = false;
}











