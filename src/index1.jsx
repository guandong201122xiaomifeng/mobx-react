import { observable, action } from 'mobx'
import React, { Component } from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
// 避免与上面的PropTypes重名
// observer用来修饰react的组件类
import { observer, PropTypes as ObservablePropTypes } from 'mobx-react'

// import './test1'
// import './mobx-t'
// import './dosth'
// import './action'

class Store {
    // @observable 修饰之后，cache.queue不是数组了
    @observable cache = {
        queue: []
    }
    // 被修饰的数据建议都放到action中
    @action.bound refresh(){
        this.cache.queue.push('')
    }
}
const store = new Store()

// Bar 被 Foo引用
// Bar真正用到了queue属性，谁就重渲染，应该被observer修饰。
// Foo没有使用到，也建议被修饰，没有副作用，增强扩展性。
// react 的钩子shouldComponentUpdate,可以控制要不要更新，mobx-react已经对这部分逻辑进行处理了，不需要我们考虑。
@observer
class Bar extends Component {
    // 规定props属性数据类型
    static propTypes = {
        // queue: PropTypes.array
        queue: ObservablePropTypes.observableArray
    }
    render(){
        const queue = this.props.queue
        return <span>{queue.length}</span>
    }
}

// @observer
class Foo extends Component{
    static propTypes = {
        // cache: PropTypes.object
        cache: ObservablePropTypes.observableObject
    }
    render(){
        const cache = this.props.cache
        // 每点击一下按钮，数据就会变化，但是视图没有更新，这时就轮到
        // mobx-react登场了
        return (<div>
            <button onClick={this.props.refresh}>refresh</button>
            <Bar queue={cache.queue} />
        </div>)
    }
}

ReactDom.render(<Foo cache={store.cache} refresh={store.refresh}/>, document.querySelector('#root'))
