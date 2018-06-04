import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import input from './input.css';
import { DeteleTable, NumericInputDemo, Drag, Page, showDrag, showLayoutBtn, showLayout, AttributePart } from './components';
import { Breadcrumb, Button, DatePicker, Switch, Table, Icon, Divider, Input, InputNumber, Popconfirm, Form } from 'antd';
import emitter from './components/ev.js'

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import combineApp from './reduces'

let store = createStore(combineApp)

class DragApp extends React.Component {
  state = {
    timestamp: null,
  }
  componentDidMount() {
    let now = +new Date()
    this.setState({ timestamp: now })
    showLayout(now)
  }
  closeShapeHandler = () => {
    let { timestamp } = this.state
    emitter.emit(`changeShape`, false)
  }
  createBtnHandler = () => {
    let now = +new Date()
    this.setState({ timestamp: now })
    showDrag(now)
    emitter.emit('initState', now, '#1890ff')
    emitter.emit(`changeShape`, false)
  }
  createLayoutHandler = () => {
    
  }
  render() {
    return <div className="dragApp">
      <div className="btnBox">
        <Button type="primary" className="button" onClick={() => this.createBtnHandler()}>生成拖拽按钮</Button>
        <br />
        <Button type="primary" className="button" onClick={() => this.createLayoutHandler()}>生成页面</Button>
        <br />
      </div>
      <div className="home" onMouseDown={this.closeShapeHandler}></div>
      {/*<div className="attributePart">
        <AttributePart />
  </div>*/}
    </div>
  }
}

ReactDOM.render(
  <Provider store={store}>
    <DragApp />
  </Provider>,
  document.getElementById('root'))