import React from 'react'
import ReactDOM from 'react-dom'
import { SketchPicker } from 'react-color'
import '../layout.css'
import emitter from "./ev"

class LayoutStyle extends React.Component {
    state = {
        child: null,
        curDragDate: null,
        showBgPicker: false,
        showColorPicker: false,
        background: '#1890ff',
        color: '#fff',
        selectedValue: '12',
        inputValue: ''
    }
    componentDidMount() {
        this.eventEmitter = emitter.addListener(`initState`, (timestamp, background) => {
            this.setState({
                curDragDate: timestamp,
                background: background || this.state.background,
                selectedValue: 12,
                inputValue: '拖拽按钮'
            })
        })
        this.props.childHandler(this, true)
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ child: nextProps.child })
    }
    componentWillUnmount() {
        emitter.removeListener(this.eventEmitter);
    }
    //初始化状态
    initStyleHandler = (bg, fontSize, color, inputValue) => {
        let selectedValue = fontSize && fontSize.substring(0, fontSize.lastIndexOf('p'))
        this.setState({
            background: bg,
            selectedValue: selectedValue,
            color: color,
            inputValue: inputValue
        })
    }
    //背景选择
    changeBgHandler = (color) => {
        this.setState({ background: color.hex });
    }
    showBgPickHandler = () => {
        this.setState({ showBgPicker: true })
    }
    cancelBgPickHandler = (e) => {
        e.stopPropagation()
        this.setState({ showBgPicker: false })
    }
    confirmBgPickHandler = (e) => {
        let { curDragDate, background } = this.state
        e.stopPropagation()
        this.setState({ showBgPicker: false })
        this.props.setBackgroundHandler(background)
        emitter.emit(`changeBg-${curDragDate}`, background)
    }

    //颜色选择
    changeColorHandler = (color) => {
        this.setState({ color: color.hex });
    }
    showColorPickHandler = () => {
        this.setState({ showColorPicker: true })
    }
    cancelColorPickHandler = (e) => {
        e.stopPropagation()
        this.setState({ showColorPicker: false })
    }
    confirmColorPickHandler = (e) => {
        let { color } = this.state
        e.stopPropagation()
        this.setState({ showColorPicker: false })
        this.props.setColorHandler(color)
    }

    selectChangeHandler = (e) => {
        this.setState({ selectedValue: e.target.value })
        this.props.setFontSizeHandler(`${e.target.value}px`)
    }
    inputChangeHandler = (e) => {
        let { inputValue } = this.state
        this.setState({ inputValue: e.target.value })
        this.props.setInputValueHandler(e.target.value)
    }
    render() {
        let { showBgPicker, showColorPicker, selectedValue, background, color, inputValue } = this.state
        let style = {
            background: background
        }
        return <div className="attribute" >
            <div className="attribute-bg" onClick={this.showBgPickHandler} >
                背景颜色:<span style={style}></span>
                {showBgPicker && <div className="bgBtn" onClick={e => this.cancelBgPickHandler(e)}>取消</div>}
                {showBgPicker && <div className="bgBtn" onClick={e => this.confirmBgPickHandler(e)}>确定</div>}
            </div>
            {
                showBgPicker && <div className="sketch">
                    <SketchPicker
                        color={background}
                        onChangeComplete={this.changeBgHandler} />
                </div>
            }
            <div className="attribube-color" onClick={this.showColorPickHandler}>
                字体颜色:<span style={{ background: color }}></span>
                {showColorPicker && <div className="bgBtn" onClick={e => this.cancelColorPickHandler(e)}>取消</div>}
                {showColorPicker && <div className="bgBtn" onClick={e => this.confirmColorPickHandler(e)}>确定</div>}
            </div>
            {
                showColorPicker && <div className="sketch">
                    <SketchPicker
                        color={color}
                        onChangeComplete={this.changeColorHandler} />
                </div>
            }
            <div className="attribube-size">
                字体大小：<select value={selectedValue} onChange={e => this.selectChangeHandler(e)}>
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                </select>
            </div>

            <div className="attritube-text">
                文本内容：<input type="text" value={inputValue} onChange={(e) => this.inputChangeHandler(e)} />
            </div>
        </div >
    }
}

export default LayoutStyle