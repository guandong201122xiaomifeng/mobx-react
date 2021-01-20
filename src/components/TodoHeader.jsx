import React, { Component, Fragment } from 'react'
import { trace, toJS, spy, observe, observable, action, computed, reaction } from 'mobx'
import PropTypes from 'prop-types'
import { observer, PropTypes as ObservablePropTypes, inject } from 'mobx-react'

@inject('store')
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
export default TodoHeader