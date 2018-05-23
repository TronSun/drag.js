import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import input from './input.css';
import { DeteleTable, NumericInputDemo, Drag, Page, showDrag, AttributePart } from './components';
import { Breadcrumb, Button, DatePicker, Switch, Table, Icon, Divider, Input, InputNumber, Popconfirm, Form } from 'antd';
import emitter from './components/ev.js'



class DragApp extends React.Component {
  state = {
    timestamp: null,
  }
  closeShapeHandler = () => {
    let { timestamp } = this.state
    emitter.emit(`changeShape`, false)
  }
  createHandler = () => {
    let now = +new Date()
    this.setState({ timestamp: now })
    showDrag(now)
    emitter.emit('initState', now, '#1890ff')
    emitter.emit(`changeShape`, false)
  }
  render() {
    return <div className="dragApp" >
      <Button type="primary" className="button" onClick={() => this.createHandler()}>生成拖拽按钮</Button>
      <div className="home" onClick={this.closeShapeHandler}></div>
      <div className="attributePart">
        <AttributePart />
      </div>
    </div>
  }
}

ReactDOM.render(<DragApp />, document.getElementById('root'));
// 一个父组件，包含生成拖拽按钮的组件、显示拖拽按钮的div、显示设置拖拽按钮的组件
// 点击生成拖拽按钮组件，会新建一个div，div里面包含一个拖拽组件。