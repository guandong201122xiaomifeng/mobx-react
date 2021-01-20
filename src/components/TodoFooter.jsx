import React, { Component, Fragment } from 'react'
import { trace, toJS, spy, observe, observable, action, computed, reaction } from 'mobx'
import PropTypes from 'prop-types'
import { observer, PropTypes as ObservablePropTypes, inject } from 'mobx-react'
@inject('store')
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
export default TodoFooter