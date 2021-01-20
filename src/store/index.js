import { trace, toJS, spy, observe, observable, action, computed, reaction } from 'mobx'
import Todo from './todoItem'
class Store {
    @observable todos = []
    disposers = []
    constructor(){
        // observe监听this.todos这个ObservablePropTypes.observableArray，修改里面item的属性监听不到
        // 如果监听的是ObservablePropTypes.observableObject，就能监听到里面的属性变化，
        // 可以考虑监听里面的每个todo，就监听了它的每个属性变化

        // 但是只能监听ObservablePropTypes.observableObject本身有的属性，不能监听新增的，要监听新增的得用spy
        // spy监听所有的行为，数据修改，action触发，autorun运行等等。
        var disposer = observe(this.todos, change => {
            this.disposers.forEach(dispose => {
                dispose()
            })
            for(let todo of change.object){
                var disposer = observe(todo, change => {
                    console.log('todo change', change)
                    this.save();
                })
                this.disposers.push(disposer)
            }
            this.save();
            console.log('observe change', change, change.object)
        })
        // 调用取消监听。
        // disposer()
    }
    save(){
        console.log('save', toJS(this.todos))
    }
    @action.bound createTodo(title){
        this.todos.unshift(new Todo(title))
    }
    @action.bound removeTodo(todo){
        // 下面的remove是mobx的ObservableArray提供的方法
        // 用于删掉数组中的元素。。
        this.todos.remove(todo)
    }
    @computed get left(){
        return this.todos.filter(todo => !todo.finished).length;
    }
}
export default Store
