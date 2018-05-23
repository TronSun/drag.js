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
    }
    state = {
        text: '拖拽按钮',//按钮文本
        withinX: 0,//鼠标在按钮内位置X
        withinY: 0,//鼠标在按钮内位置Y
        top: 200,//按钮top值
        left: 450,//按钮left值
        width: 100,//按钮宽度
        height: 50,//按钮高度
        flag: false,//是否可以移动按钮
        close: false,//删除按钮
        shape: true,//是否显示可以改变形状的锚点
        background: '#1890ff',//按钮背景颜色
        fontSize: '12px'//按钮字体大小
    }
    componentDidMount() {
        let { timestamp } = this.props
        //监控mousemove事件和鼠标抬起事件
        document.addEventListener('mousemove', e => this.moveHandler(e))
        document.addEventListener('mouseup', e => this.endHandler())
        document.addEventListener('contextmenu', e => this.showContextMenu(e))

        //添加按钮shape监听器
        emitter.addListener(`changeShape`, bol => {
            this.setState({ shape: bol })
        })
        //添加背景颜色监听器
        emitter.addListener(`changeBg-${timestamp}`, bg => {
            this.setState({ background: bg })
        })
        //添加字体大小监听器
        emitter.addListener(`changeFontSize-${timestamp}`, fontSize => {
            this.setState({ fontSize: fontSize })
        })
        //添加文本监听器
        emitter.addListener(`changeText-${timestamp}`, text => {
            this.setState({ text: text })
        })
    }
    componentWillUnmount() {
        this.props.unMountDrag && this.props.unMountDrag()
        emitter.removeAllListeners()
        document.removeEventListener('mousemove', null)
        document.removeEventListener('mouseup', null)
    }
    startHanlder = (e) => {
        //鼠标按下时 初始化state的各个值
        let event = e || window.event
        console.log(event.ctrlKey)
        let newState = {}
        let { top, left } = this.state
        event.preventDefault()
        event.stopPropagation()
        if (event.ctrlKey) {//判断是否按下ctrl键

        } else {
            emitter.emit(`changeShape`, false)
            newState.withinX = event.clientX - left //记录鼠标在按钮内的位置X
            newState.withinY = event.clientY - top //记录鼠标在按钮内的位置Y
            newState.flag = true
            newState.shape = true
            this.setState(newState)

            emitter.emit('initState', this.props.timestamp)//初始化属性的默认状态
        }





    }
    moveHandler = (e) => {
        //移动时触发该函数，只有当flag为true时才会变更按钮的位置
        let { withinX, withinY, flag } = this.state
        let event = e || window.event
        if (flag) {
            //当前的鼠标位置减去鼠标在按钮内的位置获取到当前的left值和top值，目的是保持鼠标在按钮内的位置不变
            let curLeft = e.clientX - withinX, curTop = e.clientY - withinY
            this.setState({
                left: curLeft,
                top: curTop
            })
        }
    }
    endHandler = () => {
        //鼠标抬起时设置flag为false
        this.setState({
            flag: false,
        })
    }
    showContextMenu = (e) => {

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
        let { text, left, top, width, height, close, background, fontSize, shape } = this.state
        let style = {
            left: left,
            top: top,
            width: width,
            height: height,
            background: background,
            fontSize: fontSize
        }
        return <div className={shape ? "btn btn-outline" : "btn"} style={style}
            // onDoubleClick={this.showCloseHandler}
            onMouseDown={e => this.startHanlder(e)}>
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