import React from 'react'
import ReactDOM, { render } from 'react-dom'
import PropTypes from 'prop-types'
import '../layout.css'
import DragHeader from './dragHeader.js'
import DragContainer from './dragContainer.js'
import DragFooter from './dragFooter.js'
import LayoutStyle from './layoutStyle.js'
import { Layout } from 'antd'
const { Header, Footer, Sider, Content } = Layout

class LayoutBox extends React.Component {
    state = {
        child: null
    }
    componentDidMount() {
        window._IS_CTRL_ = false
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', null)
    }
    getChildContext() {
        return {
            childHandler: this.childHandler,
            closeHandler: this.closeHandler,
        }
    }
    //通过props或context传给子组件或子组件的子组件，子组件调用这个方法传入一个this变量，用于在父组件中调用子组件的方法和获取state的值
    childHandler = (child, initState) => {
        if (initState) this.initStateChild = child //第二个参数为如果存在,确定是修改组件样式的组件

        let { background, fontSize, color, inputValue } = child.state
        if (this.initStateChild && background && fontSize && color && inputValue) {
            this.initStateChild.initStyleHandler(background, fontSize, color, inputValue)
        }
        this.setState({
            child: child
        })
    }
    //关闭所有的组件的shape状态，通过props或context传给子组件，子组件调用该方法触发关闭所有shape状态
    closeHandler = (e) => {
        let { child } = this.state
        child && child.closeShapeHandler && child.closeShapeHandler()
    }
    //修改组件的样式
    setBackgroundHandler = (bg) => {
        let { child } = this.state
        child && child.setBackgroundHandler && child.setBackgroundHandler(bg)
    }
    setFontSizeHandler = (fontSize) => {
        let { child } = this.state
        child && child.setFontSizeHandler && child.setFontSizeHandler(fontSize)
    }
    setColorHandler = (color) => {
        let { child } = this.state
        child && child.setColorHandler && child.setColorHandler(color)
    }
    setInputValueHandler = (inputValue) => {
        let { child } = this.state
        child && child.setInputValueHandler && child.setInputValueHandler(inputValue)
    }
    render() {
        let handlerFunc = {
            childHandler: this.childHandler,
            closeHandler: this.closeHandler
        }
        let styleFunc = {
            child: this.state.child,
            childHandler: this.childHandler,
            setBackgroundHandler: this.setBackgroundHandler,
            setFontSizeHandler: this.setFontSizeHandler,
            setColorHandler: this.setColorHandler,
            setInputValueHandler: this.setInputValueHandler
        }
        return <div className="layoutBox" >
            <div className="layout" onMouseDown={e => this.closeHandler(e)}>
                <DragHeader {...handlerFunc} />
                <DragContainer {...handlerFunc} />
                <DragFooter {...handlerFunc} />
            </div>
            <LayoutStyle {...styleFunc} />
        </div>

    }
}

LayoutBox.proptypes = {
    timestamp: PropTypes.number
}
LayoutBox.childContextTypes = {
    childHandler: PropTypes.func,
    closeHandler: PropTypes.func,
}
function createLayoutNode(id) {
    let node = document.getElementById(id)
    if (!node) {
        node = document.createElement('div')
        node.id = id
        document.querySelector('.home').appendChild(node)
    }
    return node
}
let showLayout = (timestamp) => {
    let id = `_layout__${timestamp}`,
        node = createLayoutNode(id)
    render(<LayoutBox
        timestamp={timestamp}
        mountedNode={node}
        unMountDrag={() => {
            node.parentNode.removeChild(node)
        }}
    />, node)
}

export {
    LayoutBox,
    showLayout
} 