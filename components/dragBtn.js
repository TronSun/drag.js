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
        top: 318,//按钮top值
        left: 575,//按钮left值
        width: 100,//按钮宽度
        height: 50,//按钮高度
        flag: false,//是否可以移动按钮
        close: false,//删除按钮
        shape: true,//是否显示可以改变形状的锚点
        background: '#1890ff',//按钮背景颜色
        fontSize: '12px',//按钮字体大小,
        menuLeft: 0,//右键菜单left值
        menuTop: 0,//右键菜单top值
    }
    componentDidMount() {
        let { timestamp } = this.props
        //监控mousemove事件和mouseup事件
        document.addEventListener('mousemove', e => this.moveHandler(e))
        document.addEventListener('mouseup', this.endHandler)
        // document.addEventListener('keydown',e => this.deleteHandler(e))

        //添加按钮shape监听器
        emitter.addListener(`changeShape`, bol => {
            this.setState({ shape: bol, close: false })
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
        emitter.setMaxListeners(100)
    }
    componentWillUnmount() {
        // this.props.unMountDrag && this.props.unMountDrag()
        emitter.removeAllListeners()
        document.removeEventListener('mousemove', null)
        document.removeEventListener('mouseup', null)
    }
    startHanlder = (e) => {
        //鼠标按下时 初始化state的各个值
        let event = e || window.event
        let newState = {}
        let { top, left } = this.state
        // event.preventDefault()
        event.stopPropagation()
        // if (event.ctrlKey) {//判断是否按下ctrl键

        // } else {

        // }
        emitter.emit(`changeShape`, false)
        newState.withinX = event.clientX - left //记录鼠标在按钮内的位置X
        newState.withinY = event.clientY - top //记录鼠标在按钮内的位置Y
        emitter.emit('initState', this.props.timestamp)//初始化属性的默认状态
        newState.flag = true
        newState.shape = true
        this.setState(newState)
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
        this.setState({ flag: false })
    }
    showContextMenu = (e) => {
        let { left, top } = this.state
        e.preventDefault();
        this.setState({
            menuLeft: e.clientX - left + 'px',
            menuTop: e.clientY - top + 'px',
            close: true
        })
    }
    closeHandler = (e) => {
        e.stopPropagation()
        this.props.unMountDrag && this.props.unMountDrag()
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
        let l, t
        if (keyCode == 46) {//删除
            this.closeHandler(e)
        }
        if (keyCode == 37) {//左移
            l = --this.state.left
        }
        if (keyCode == 38) {//上移
            t = --this.state.top
        }
        if (keyCode == 39) {//右移
            l = ++this.state.left
        }
        if (keyCode == 40) {//下移
            t = ++this.state.top
        }
        this.setShapeHandler(l, t)
    }
    render() {
        let { text, left, top, width, height, close, background, fontSize, shape, menuLeft, menuTop } = this.state
        console.log(shape)
        let style = {
            left: left,
            top: top,
            width: width,
            height: height,
            background: background,
            fontSize: fontSize
        }
        let menuStyle = {
            left: menuLeft,
            top: menuTop,
            display: close ? 'block' : 'none'
        }
        return <div className={shape ? "btn btn-outline" : "btn"} style={style} tabIndex="0"
            onContextMenu={e => this.showContextMenu(e)}
            onMouseDown={e => this.startHanlder(e)}
            onKeyDown={e => this.keyDownHandler(e)}>
            <div className="btnText">
                <span>{text}</span>
            </div>
            <div className="contextMenu" style={menuStyle}>
                <div className="tabMenu" onMouseDown={this.closeHandler}>删除</div>
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