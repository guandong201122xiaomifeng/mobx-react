import React, { Component, Fragment } from 'react'
import { trace, toJS, spy, observe, observable, action, computed, reaction } from 'mobx'
import PropTypes from 'prop-types'
import { observer, PropTypes as ObservablePropTypes } from 'mobx-react'

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
export default TodoItem

