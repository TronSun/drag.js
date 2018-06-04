import React from 'react'
import ReactDOM, { render, unmountComponentAtNode } from 'react-dom'
import { SketchPicker, MaterialPicker, TwitterPicker, CirclePicker, PhotoshopPicker } from 'react-color';
import '../dragBtn.css'
import emitter from "./ev"

class AttributePart extends React.Component {
    state = {
        showPicker: false,
        background: '#1890ff',//组件的颜色
        curDragDate: null,
        value: 12,
        text: ''
    }
    componentDidMount() {
        this.eventEmitter = emitter.addListener(`initState`, (timestamp,background) => {
            this.setState({
                curDragDate: timestamp,
                background: background || this.state.background,
                value: 12,
                text: ''
            })
        })
    }
    componentWillUnmount() {
        emitter.removeListener(this.eventEmitter);
    }
    handleChangeComplete = (color) => {
        this.setState({ background: color.hex });
    }
    showPickHandler = () => {
        this.setState({ showPicker: true })
    }
    cancelPickHandler = (e) => {
        let { curDragDate } = this.state
        e.stopPropagation()
        this.setState({ showPicker: false })
    }
    confirmPickHandler = (e) => {
        let { curDragDate, background } = this.state
        e.stopPropagation()
        this.setState({ showPicker: false })
        emitter.emit(`changeBg-${curDragDate}`, background)
    }
    selectChangeHandler = (e) => {
        let { curDragDate } = this.state
        this.setState({ value: e.target.value })
        emitter.emit(`changeFontSize-${curDragDate}`, `${e.target.value}px`)
    }
    inputChangeHandler = (e) => {
        let { curDragDate, text } = this.state
        this.setState({ text: e.target.value })
        emitter.emit(`changeText-${curDragDate}`, e.target.value)
    }
    keyDown = (e) => {
        console.log(e.keyCode)
    }
    render() {
        let { showPicker, background, value, text } = this.state
        let style = {
            background: background
        }
        return <div className="attribute">
            <div className="attribute-color" onClick={this.showPickHandler} >
                颜色:<span style={style}></span>
                {showPicker && <div className="colorBtn" onClick={e => this.cancelPickHandler(e)}>取消</div>}
                {showPicker && <div className="colorBtn" onClick={e => this.confirmPickHandler(e)}>确定</div>}
            </div>
            {showPicker && <div className="sketch">
                <SketchPicker
                    color={background}
                    onChangeComplete={this.handleChangeComplete} />
            </div>}

            <div className="attritube-size">
                字体大小：<select value={value} onChange={e => this.selectChangeHandler(e)}>
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                </select>
            </div>

            <div className="attritube-text">
                文本内容：<input type="text" value={text} onKeyDown={e => this.keyDown(e)}
                    onChange={(e) => this.inputChangeHandler(e)} />
            </div>
        </div>
    }
}

export default AttributePart