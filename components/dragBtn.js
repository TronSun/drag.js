import React from 'react'
import ReactDOM, { render, unmountComponentAtNode } from 'react-dom'
import { Button } from 'antd'
import Proptypes from 'prop-types'
import '../dragBtn.css'
import Anchor from './anchor'
import emitter from './ev.js'

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
        text:'拖拽按钮',
        currentX: 0,
        currentY: 0,
        top: 200,
        left: 450,
        width: 100,
        height: 50,
        flag: false,
        close: false,
        shape: true,
        background: '#1890ff',
        fontSize: '14px'
    }
    componentDidMount() {
        //监控mousemove事件和鼠标抬起事件
        document.addEventListener('mousemove', e => this.moveHandler(e))
        document.addEventListener('mouseup', e => this.endHandler())
        document.querySelector('.home').addEventListener('click', () => {
            this.closeShapeHandler()
        })
        //添加背景颜色监听器
        this.eventEmitter = emitter.addListener(`changeBg-${this.props.timestamp}`, (bg) => {
            this.setState({
                background: bg
            })
        })
        //添加字体大小监听器
        this.eventEmitter = emitter.addListener(`changeFontSize-${this.props.timestamp}`, (fontSize) => {
            this.setState({
                fontSize: fontSize
            })
        })
        //添加文本监听器
        this.eventEmitter = emitter.addListener(`changeText-${this.props.timestamp}`, (text) => {
            console.log(text)
            this.setState({
                text: text
            })
        })
    }
    componentWillUnmount() {
        this.props.unMountDrag && this.props.unMountDrag()
        document.querySelector('.home').removeEventListener('click', () => {
            this.closeShapeHandler()
        })
        emitter.removeListener(this.eventEmitter);
    }
    closeShapeHandler = () => {
        this.setState({ shape: false })
    }
    startHanlder = (e) => {
        //鼠标按下时 初始化state的各个值
        document.querySelector('.home').click()
        let event = e || window.event
        let newState = {}
        // let computedStyle = document.defaultView.getComputedStyle(this.dragBtn.current, null)
        let computedStyle = window.getComputedStyle(this.dragBtn.current, null)
        event.preventDefault()
        event.stopPropagation()

        let { top, left } = this.state
        newState.currentX = event.clientX
        newState.currentY = event.clientY
        newState.top = computedStyle.top
        newState.left = computedStyle.left
        newState.flag = true
        newState.shape = true

        this.setState(newState)

        emitter.emit('initState', this.props.timestamp)
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
    showCloseHandler = () => {
        this.setState({ close: !this.state.close })
    }
    closeHandler = () => {
        unmountComponentAtNode(this.props.mountedNode);
    }
    /**
     * w:按钮宽度
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
        let { text,left, top, width, height, close, background, fontSize, shape } = this.state
        let style = {
            left: left,
            top: top,
            width: width,
            height: height,
            background: background,
            fontSize: fontSize
        }
        // console.log(text)
        return <div className={shape ? "btn btn-outline" : "btn"} style={style}
            onMouseDown={e => this.startHanlder(e)}
            // onDoubleClick={this.showCloseHandler}
            ref={this.dragBtn}>
            <div className="btnText">
                <span>{text}</span>
            </div>
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
    timestamp: Proptypes.number.isRequired,
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
let showDrag = (timestamp) => {
    let id = `_drag_btn_${timestamp}`,
        node = createDragNode(id)
    render(<DragBtn
        timestamp={timestamp}
        mountedNode={node}
        unMountDrag={() => {
            node.parentNode.removeChild(node)
        }}
    />, node)
}
export default showDrag