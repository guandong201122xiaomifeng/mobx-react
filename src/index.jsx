import { trace, toJS, spy, observe, observable, action, computed, reaction } from 'mobx'
import React, { Component, Fragment } from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import { observer, PropTypes as ObservablePropTypes } from 'mobx-react'

// 监听所有的action,autorun,reaction等,但是开销大，尽量少使用
// spy((event) => {
//     console.log('spy', event)
// })

// 只要关注两个点
// 1 把用户操作行为转化为action
// 2 把数据绑定到react组件上，以驱动视图。
// 这是一个闭环，而且是单向的，体现出mobx简单易懂的管理哲学。

// 所有可变数据都要通过@observable修饰起来
class Todo {
    id = Math.random();
    @observable title = '';
    @observable finished = false;
    constructor(title) {
        this.title = title
    }
    @action.bound toggle(){
        this.finished = !this.finished
    }
}

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
var store = new Store()

@observer
class TodoItem extends Component {
    static propTypes = {
        todo: PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            finished: PropTypes.bool.isRequired
        }).isRequired
    }
    handleClick = () => {
        this.props.todo.toggle();
    }
    render() {
        trace()
        const todo = this.props.todo;
        // react16 提供的包裹组件 Fragment
        return (<Fragment>
            <input
                type="checkbox"
                className="input"
                checked={todo.finished}
                onClick={this.handleClick}
            />
            <span className={["title", todo.finished&&"finished"].join(' ')}>{todo.title}</span>
        </Fragment>)
    }
}

@observer
class TodoFooter extends Component {
    static propTypes = {
        // left: PropTypes.number.isRequired
    }
    render(){
        trace()
        // 如果使用const left = this.props.left;那么store.left就会在TodoList里用到，
        // store.left变化，会导致Footer和TodoList都重新渲染，还是过度渲染
        // const left = this.props.left;

        // 所以不要在TodoList里使用store.left,传整个store给Footer
        const left = this.props.store.left;
        return <footer>{left} item(s) unfinished</footer>
    }
}

@observer
class TodoView extends Component {
    static propTypes = {
    }
    render(){
        const todos = this.props.todos
        return <ul>
        {
            todos.map(todo => {
                return <li
                    className="todo-item"
                    key = {todo.id}
                >
                    <TodoItem todo = {todo}/>
                    <span
                        className = "delete"
                        onClick={e => {store.removeTodo(todo)}}
                    >X</span>
                </li>
            })
        }
    </ul>
    }
}

@observer
class TodoHeader extends Component {
    // 这里输入框变化，不会导致TodoList组件重新渲染。
    static propTypes = {

    }
    state = {
        inputValue: ''
    }
    handleSubmit = (e) => {
        e.preventDefault();
        // 表单提交的时候要增加一个todo,用action实现
        var store = this.props.store;
        var inputValue = this.state.inputValue;
        store.createTodo(inputValue)

        // 清空输入框
        this.setState({
            inputValue: ''
        })
    }

    handleChange = (e) => {
        e.preventDefault();
        var inputValue = e.target.value
        this.setState({
            inputValue
        })
    }

    render(){
        trace()
        return (<header>
            {/* form为了使提交方式多样化 */}
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    onChange={this.handleChange}
                    value = {this.state.inputValue}
                    className = "input"
                    placeholder = "what is need to be finished?"
                />
            </form>
        </header>)
    }
}

@observer
class TodoList extends Component {
    static propTypes = {
        store: PropTypes.shape({
            createTodo: PropTypes.func,
            todos: ObservablePropTypes.observableArrayOf(ObservablePropTypes.observableObject).isRequired
        }).isRequired
    };
    // state = {
    //     inputValue: ''
    // }

    // handleSubmit = (e) => {
    //     e.preventDefault();
    //     // 表单提交的时候要增加一个todo,用action实现
    //     var store = this.props.store;
    //     var inputValue = this.state.inputValue;
    //     store.createTodo(inputValue)

    //     // 清空输入框
    //     this.setState({
    //         inputValue: ''
    //     })
    // }

    // handleChange = (e) => {
    //     e.preventDefault();
    //     var inputValue = e.target.value
    //     this.setState({
    //         inputValue
    //     })
    // }
    render() {
        // 放在副作用中，会提示该副作用受什么数据影响，加true参数一运行就会进断点。
        // trace(true)
        trace()
        const store = this.props.store
        const todos = store.todos;
        return <div className="todo-list">
            <TodoHeader store = {store}></TodoHeader>
            {/* 这样todos里的todoItem的属性变化，就不会触发TodoList组件重新渲染。 */}
            <TodoView todos = {store.todos}/>
            {/* <TodoFooter left={store.left}></TodoFooter> */}
            <TodoFooter store={store}></TodoFooter>
        </div>
    }
}

ReactDom.render(<TodoList store={store}/>, document.querySelector('#root'))

