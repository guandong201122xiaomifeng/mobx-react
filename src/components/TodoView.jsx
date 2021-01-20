import React, { Component, Fragment } from 'react'
import TodoItem from './TodoItem'
import { trace, toJS, spy, observe, observable, action, computed, reaction } from 'mobx'
import PropTypes from 'prop-types'
import { observer, PropTypes as ObservablePropTypes, inject } from 'mobx-react'

@inject('store')
@observer
class TodoView extends Component {
    static propTypes = {
    }
    render(){
        const store = this.props.store
        const todos = this.props.store.todos
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
export default TodoView