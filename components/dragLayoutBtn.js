import React from 'react'
import ReactDOM, { render } from 'react-dom'
import PropTypes from 'prop-types'
import Anchor from './anchor.js'
import '../layout.css'

class DragLayoutBtn extends React.Component {
    state = {
        withinX: 0,
        withinY: 0,
        left: 572,
        top: 292,
        width: 100,
        height: 40,
        flag: false,
        shape: false
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
        // this.context.closeHandler()
        // this.context.childHandler(this)

        let { left, top } = this.state
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
    render() {
        let { left, top, width, height, shape } = this.state

        let { parentLeft, parentTop } = this.props
        let style = {
            left: left,
            top: top,
            width: width,
            height: height,
            parentLeft: parentLeft,
            parentTop: parentTop
        }
        return <div onMouseDown={e => this.startHandler(e)}
            className={shape ? "title drag-outline" : "title"}
            style={style}
            tabIndex="0">
            <div className="dragText">
                <span>按钮</span>
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
DragLayoutBtn.propTypes = {
    timestamp: PropTypes.number.isRequired
}

function createLayoutBtnNode(id) {
    let node = document.getElementById(id)
    if (!node) {
        node = document.createElement('div')
        node.id = id
        document.querySelector('.layout').appendChild(node)
    }
    return node
}
function showLayoutBtn(timestamp) {
    let id = `_layout_btn_${timestamp}`
    let node = createLayoutBtnNode(id)

    render(<DragLayoutBtn
        timestamp={timestamp}
        unMountDrag={() => {
            node.parentNode.removeChild(node)
        }} />, node)
}
export default showLayoutBtn