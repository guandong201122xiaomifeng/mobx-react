import React, { Component, Fragment } from 'react'
import { trace, toJS, spy, observe, observable, action, computed, reaction } from 'mobx'
import PropTypes from 'prop-types'
import { observer, PropTypes as ObservablePropTypes, inject } from 'mobx-react'
import TodoFooter from './TodoFooter'
import TodoView from './TodoView'
import TodoHeader from './TodoHeader'

@inject('store')
@observer
class TodoList extends Component {
    static propTypes = {
        store: PropTypes.shape({
            createTodo: PropTypes.func,
            todos: ObservablePropTypes.observableArrayOf(ObservablePropTypes.observableObject).isRequired
        })
    };
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
export default TodoList