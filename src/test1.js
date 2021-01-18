// document.write('hellow world')

// class Animal {
//     name() {
//         return 'Animal'
//     }
//     say() {
//         return `I'm ${this.name()}`
//     }
// }
// class Dog extends Animal {
//     food = 'born';
//     name(){
//         return 'Dog'
//     }
// }
// console.log(new Dog() instanceof Animal)

// decorator
// 修饰类，和修饰类成员，都是函数，但参数不同


function log(target){
    // console.log(target, target.PI)
    // target 就是 Numberic
    const desc = Object.getOwnPropertyDescriptors(target.prototype)
    console.log('desc', desc)
    for(const key of Object.keys(desc)){
        if(key === 'constructor'){
            continue;
        }
        const func = desc[key].value;
        if('function' === typeof func){
            // 如果是方法，就重新定义
            Object.defineProperty(target.prototype, key, {
                value(...args){
                    console.log(`before  ${key}`)
                    const ret = func.apply(this, args)
                    console.log(`after ${key}`)
                }
            })
        }
    }
}
function readonly(target, key, decorator){
    // target 为类的实例对象
    // key 为属性名称，这里PI,
    // decorator 为属性描述
    console.log('target',target, 'key',key, 'decorator', decorator)
    decorator.writable = false
}
function validate(target, key, decorator){
    // 重写decorator.value
    const fun = decorator.value
    decorator.value = function(...args){
        for(let num of args){
            if('number' !== typeof num){
                throw new Error(`${num} is not a number`)
            }
        }
        // 如果都是number
        return fun.apply(this, args)
    }
}

@log
class Numberic {
    // 修饰类成员
    @readonly PI = 3.1415926;

    // 对add进行参数类型检测，非数字报错
    @validate
    add(...nums){
        return nums.reduce((a,b)=> a+b, 0)
    }
}
let num = new Numberic()
console.log('num', num)
num.add(2,5,3)
// num.add(2,5,'3')//报错
console.log('num.PI', num.PI)
// num.PI = 2//报错