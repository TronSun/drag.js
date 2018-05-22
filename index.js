import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import input from './input.css';
import { DeteleTable, NumericInputDemo, Drag, Page, showDrag, AttributePart } from './components';
import { Breadcrumb, Button, DatePicker, Switch, Table, Icon, Divider, Input, InputNumber, Popconfirm, Form } from 'antd';
import emitter from './components/ev.js'



class DragApp extends React.Component {
  state = {
    timestamp: null
  }
  componentDidMount() {

  }
  createHandler = () => {
    let now = +new Date()
    this.setState({ timestamp: now })
    showDrag(now)
    emitter.emit('initState', now)
    document.querySelector('.home').click()
  }
  render() {
    return <div className="dragApp">
      <Button type="primary" className="button" onClick={() => this.createHandler()}>生成拖拽按钮</Button>
      <div className="home"></div>
      <div className="attributePart">
        {<AttributePart />}
      </div>
    </div>
  }
}

ReactDOM.render(<DragApp />, document.getElementById('root'));
