import React from 'react'
import ReactDOM, { render, unmountComponentAtNode } from 'react-dom'
import { Button } from 'antd'
import Proptypes from 'prop-types'
import '../dragBtn.css'
import Anchor from './anchor'

class Set extends React.Component {
    render() {
        return <div>
            <div>颜色</div>
            <div>大小</div>
        </div>
    }
}
/**
 * 拖拽按钮
 * 
 * @class DragBtn
 * @extends {React.Component}
 */
class DragBtn extends React.Component {
    constructor(props) {
        super(props)
        this.dragBtn = React.createRef()
    }
    state = {
        currentX: 0,
        currentY: 0,
        top: 100,
        left: 300,
        width: 100,
        height: 50,
        flag: false,
        close: false,
        shape: false
    }
    componentDidMount() {
        //监控mousemove事件和鼠标抬起事件
        document.addEventListener('mousemove', e => this.moveHandler(e))
        document.addEventListener('mouseup', e => this.endHandler())
    }
    componentWillUnmount() {
        this.props.unMountDrag && this.props.unMountDrag();
    }
    startHanlder = (e) => {
        //鼠标按下时 初始化state的各个值
        let event = e || window.event
        let newState = {}
        // let computedStyle = document.defaultView.getComputedStyle(this.dragBtn.current, null)
        let computedStyle = window.getComputedStyle(this.dragBtn.current, null)
        event.preventDefault()
        let { top, left } = this.state
        newState.currentX = event.clientX
        newState.currentY = event.clientY
        newState.top = computedStyle.top
        newState.left = computedStyle.left
        newState.flag = true

        this.setState(newState)
    }
    moveHandler = (e) => {
        //移动时触发该函数，只有当flag为true时才会变更按钮的位置
        let { currentX, currentY, left, top, flag, width, height } = this.state
        let event = e || window.event
        if (flag) {
            let curX = event.clientX, curY = event.clientY
            let disX = curX - currentX, disY = curY - currentY
            let curLeft = parseInt(left) + disX
            let curTop = parseInt(top) + disY
            // console.log(left, disX)
            // this.setState({
            //     left: curLeft + 'px',
            //     top: curTop + 'px'
            // })
            this.dragBtn.current.style.left = curLeft + 'px'
            this.dragBtn.current.style.top = curTop + 'px'
        }

    }
    endHandler = () => {
        //鼠标抬起时 记录当前的left值和top值，并设置flag为false
        if (this.dragBtn.current != null) {
            let computedStyle = window.getComputedStyle(this.dragBtn.current, null)
            this.setState({
                left: computedStyle.left,
                top: computedStyle.top,
                flag: false,
            })
        }
    }
    showSettingHandler = () => {

    }
    showCloseHandler = () => {
        this.setState({ close: !this.state.close })
    }
    closeHandler = () => {
        unmountComponentAtNode(this.props.mountedNode);
    }
    setShapeHanlder = () => {
        this.setState({ shape: true })
    }
    /**
     * w:按钮宽度，没传值默认为当前值不变
     * h:按钮高度，
     * l：按钮left值
     * t:按钮top值
     * 每一个参数没传值或为undefined时 默认为当前值不变
     * @memberof setShapeHandler
     */
    setShapeHandler = (w, h, l, t) => {
        let { left, top, width, height } = this.state
        // console.log(w,h,l,t)
        this.setState({
            width: w || width,
            height: h || height,
            left: l || left,
            top: t || top,
        })
    }
    render() {
        let { left, top, width, height, close, shape } = this.state
        let style = {
            left: left,
            top: top,
            width: width,
            height: height
        }
        
        return <div className={shape ? "btn btn-outline" : "btn"} style={style}
            onMouseDown={(e) => this.startHanlder(e)}
            // onDoubleClick={this.showCloseHandler}
            onClick={this.setShapeHanlder}
            ref={this.dragBtn}>
            <div className="btnText">{this.props.text}</div>
            {shape && <div>
                {<Anchor direction='tl' {...style} setShapeHandler={this.setShapeHandler} />}
                {<Anchor direction='tm' {...style} setShapeHandler={this.setShapeHandler} />}
                {<Anchor direction='tr' {...style} setShapeHandler={this.setShapeHandler} />}
                {<Anchor direction='ml' {...style} setShapeHandler={this.setShapeHandler} />}
                {<Anchor direction='mr' {...style} setShapeHandler={this.setShapeHandler} />}
                {<Anchor direction='bl' {...style} setShapeHandler={this.setShapeHandler} />}
                {<Anchor direction='bm' {...style} setShapeHandler={this.setShapeHandler} />}
                {<Anchor direction='br' {...style} setShapeHandler={this.setShapeHandler} />}

            </div>}

            {close && <div className="close" onClick={this.closeHandler}>X</div>}
        </div>
    }
}

DragBtn.proptypes = {
    text: Proptypes.string,
    mountedNode: Proptypes.object
}

let createDragNode = (id) => {
    let node = document.getElementById(id)
    if (!node) {
        node = document.createElement('div')
        node.id = id
        document.body.appendChild(node)
    }
    return node
}
let showDrag = (text) => {
    let id = `_drag_${+new Date()}`,
        node = createDragNode(id)

    render(<DragBtn
        text={text}
        mountedNode={node}
        unMountDrag={() => {
            node.parentNode.removeChild(node)
        }}
    />, node)

}
export default showDrag