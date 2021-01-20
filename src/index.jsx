import { trace, toJS, spy, observe, observable, action, computed, reaction } from 'mobx'
import React, { Component, Fragment } from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import { observer, PropTypes as ObservablePropTypes, Provider } from 'mobx-react'
import {HashRouter as Router, Route} from 'react-router'
import TodoList from './components/TodoList'
import Store from './store/index'

let store = new Store();
function App (){
    return <Router>
            <Provider  store={store}>
                {/* <TodoList/> */}
                <Route path = '/a' component = {TodoList}/>
            </Provider>
    </Router>
    return
}
ReactDom.render(<App/>, document.querySelector('#root'))

