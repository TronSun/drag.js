import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Anchor from './anchor.js'
import '../layout.css'

class DragLayoutTitle extends React.Component {
    state = {
        withinX: 0,
        withinY: 0,
        left: 150,
        top: 5,
        width: 100,
        height: 30,
        background: '#1890ff',
        fontSize: '12px',
        color: '#fff',
        inputValue: '我是标题',
        visible: true,
        flag: false,
        shape: false,
    }
    componentDidMount() {
        document.addEventListener('mousemove', e => this.moveHandler(e))
        document.addEventListener('mouseup', this.endHandler)
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', null)
        document.removeEventListener('mousemove', null)
        document.removeEventListener('mouseup', null)
    }
    startHandler = (e) => {
        let { left, top } = this.state
        // if (window._IS_CTRL_) {
        //     this.context.eventCol.push(e)
        // } else {
        //     this.context.closeHandler()
        //     this.context.childHandler(this)
        // }
        this.context.closeHandler()
        this.context.childHandler(this)

        e.stopPropagation()
        let newState = {}
        newState.withinX = e.clientX - left
        newState.withinY = e.clientY - top
        newState.flag = true
        newState.shape = true
        this.setState(newState)
    }
    moveHandler = (e) => {
        let { withinX, withinY, flag } = this.state
        if (flag) {
            this.setState({
                left: e.clientX - withinX,
                top: e.clientY - withinY
            })
        }
    }
    endHandler = () => {
        this.setState({ flag: false })
    }
    closeShapeHandler = () => {
        this.setState({ shape: false })
    }
    /**
     * w:按钮宽度
     * h:按钮高度，
     * l：按钮left值
     * t:按钮top值
     * 每一个参数没传值或为undefined时 默认为当前值不变
     * @memberof setShapeHandler
     */
    setShapeHandler = (l, t, w, h) => {
        let { left, top, width, height } = this.state
        this.setState({
            width: w || width,
            height: h || height,
            left: l || left,
            top: t || top,
        })
    }
    keyDownHandler = (e) => {
        console.log(e.keyCode)
        let keyCode = e.keyCode
        if (keyCode == 17) {
            window._IS_CTRL_ = true
        }
        if (keyCode == 46) {
            this.setState({ visible: false })
        }

    }
    setBackgroundHandler = (bg) => {
        this.setState({ background: bg })
    }
    setFontSizeHandler = (fontSize) => {
        this.setState({ fontSize: fontSize })
    }
    setColorHandler = (color) => {
        this.setState({ color: color })
    }
    setInputValueHandler = (inputValue) => {
        this.setState({ inputValue: inputValue })
    }
    render() {
        let { left, top, width, height, background, fontSize, color, inputValue, shape, visible } = this.state
        let { parentLeft, parentTop } = this.props
        let style = {
            left: left,
            top: top,
            width: width,
            height: height,
            background: background,
            fontSize: fontSize,
            color: color,
            display: visible ? 'block' : 'none',
            parentLeft: parentLeft,
            parentTop: parentTop
        }
        return <div onMouseDown={e => this.startHandler(e)}
            onKeyDown={e => this.keyDownHandler(e)}
            className={shape ? "title drag-outline" : "title"}
            style={style}
            tabIndex="0">
            <div className="dragText">
                <span>{inputValue}</span>
            </div>
            {shape && <div>
                <Anchor direction='tl' {...style} setShapeHandler={this.setShapeHandler} />
                <Anchor direction='tm' {...style} setShapeHandler={this.setShapeHandler} />
                <Anchor direction='tr' {...style} setShapeHandler={this.setShapeHandler} />
                <Anchor direction='ml' {...style} setShapeHandler={this.setShapeHandler} />
                <Anchor direction='mr' {...style} setShapeHandler={this.setShapeHandler} />
                <Anchor direction='bl' {...style} setShapeHandler={this.setShapeHandler} />
                <Anchor direction='bm' {...style} setShapeHandler={this.setShapeHandler} />
                <Anchor direction='br' {...style} setShapeHandler={this.setShapeHandler} />
            </div>}
        </div>
    }
}
DragLayoutTitle.contextTypes = {
    childHandler: PropTypes.func,
    closeHandler: PropTypes.func,
}
export default DragLayoutTitle