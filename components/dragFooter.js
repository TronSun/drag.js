import React from 'react'
import ReactDOM, { render } from 'react-dom'
import Proptypes from 'prop-types'
import '../layout.css'
import Anchor from './anchor.js'
import DragLayoutEnd from './dragLayoutEnd.js'

class DragFooter extends React.Component {
    state = {
        withinX: 0,
        withinY: 0,
        left: 420,
        top: 440,
        width: 400,
        height: 100,
        flag: false,
        shape: false
    }
    componentDidMount() {
        document.addEventListener('mousemove', e => this.moveHandler(e))
        document.addEventListener('mouseup', this.endHandler)
    }
    componentWillMount() {
        document.removeEventListener('mousedown', null)
        document.removeEventListener('mouseover', null)
        document.removeEventListener('mouseup', null)
    }
    closeShapeHandler = () => {
        this.setState({ shape: false })
    }
    startHandler = (e) => {
        this.props.closeHandler()
        this.props.childHandler(this)
        e.stopPropagation()
        let { left, top } = this.state
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
    render() {
        let { left, top, width, height, shape } = this.state
        let style = {
            left: left,
            top: top,
            width: width,
            height: height,
        }
        return <div className={shape ? "footer drag-outline" : "footer"} style={style} onMouseDown={e => this.startHandler(e)}>
            <DragLayoutEnd parentLeft={left} parentTop={top} />
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

DragFooter.proptypes = {
    timestamp: Proptypes.number
}

export default DragFooter