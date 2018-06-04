import React from 'react'
import ReactDOM from 'react-dom'
import '../dragBtn.css'

class Anchor extends React.Component {
    state = {
        originalWidth: 0,//保留原始的宽度
        originalHeight: 0,//保留原始的高度
        originalLeft: 0,//保留原始的left值
        originalTop: 0,//保留原始的top值
        flag: false
    }
    componentDidMount() {
        document.addEventListener('mousemove', e => this.move(e))
        document.addEventListener('mouseup', () => this.stop())
    }
    componentWillMount() {
        document.removeEventListener('mousemove', null)
        document.removeEventListener('mouseup', null)
    }
    start = (e) => {
        let { top, left, width, height, parentLeft, parentTop } = this.props
        let event = e || window.event
        event.stopPropagation()
        event.preventDefault()
        this.setState({
            originalWidth: parseInt(width) + parseInt(left),
            originalHeight: parseInt(height) + parseInt(top),
            originalLeft: parseInt(left),
            originalTop: parseInt(top),
            flag: true
        })
    }
    //左上角锚点
    topLeftHanlder = (event) => {
        let e = event || window.event
        let { originalWidth, originalHeight, flag } = this.state
        let { width, height, parentLeft, parentTop, setShapeHandler } = this.props
        let w, h, l, t, clientX = e.clientX, clientY = e.clientY

        if (parentLeft) clientX = e.clientX - parseInt(parentLeft)
        if (parentTop) clientY = e.clientY - parseInt(parentTop)

        if (flag) {
            originalWidth > clientX ? (w = originalWidth - clientX, l = clientX) :
                (w = clientX - originalWidth, l = originalWidth)
            originalHeight > clientY ? (h = originalHeight - clientY, t = clientY) :
                (h = clientY - originalHeight, t = originalHeight)
            setShapeHandler(l, t, w, h)
        }
    }
    //左中锚点
    topMiddleHandler = (event) => {
        let e = event || window.event
        let { originalHeight, flag } = this.state
        let { parentTop, setShapeHandler } = this.props
        let w, h, l, t, clientY = e.clientY
        if (parentTop) clientY = e.clientY - parseInt(parentTop)

        if (flag) {
            originalHeight > clientY ? (h = originalHeight - clientY, t = clientY) :
                (h = clientY - originalHeight, t = originalHeight)

            setShapeHandler(l, t, w, h)
        }
    }
    //右上角锚点
    topRightHandler = (event) => {
        let e = event || window.event
        let { originalLeft, originalHeight, flag } = this.state
        let { parentLeft, parentTop, setShapeHandler } = this.props
        let w, h, l, t, clientX = e.clientX, clientY = e.clientY

        if (parentLeft) clientX = e.clientX - parseInt(parentLeft)
        if (parentTop) clientY = e.clientY - parseInt(parentTop)

        if (flag) {
            clientX > originalLeft ? (w = clientX - originalLeft) :
                (w = originalLeft - clientX, l = clientX)
            originalHeight > clientY ? (h = originalHeight - clientY, t = clientY) :
                (h = clientY - originalHeight, t = originalHeight)
            setShapeHandler(l, t, w, h)
        }
    }
    //中左锚点
    middleLeftHandler = (event) => {
        let e = event || window.event
        let { originalWidth, flag } = this.state
        let { parentLeft, setShapeHandler } = this.props
        let w, h, l, t, clientX = e.clientX, clientY = e.clientY
        if (parentLeft) clientX = e.clientX - parseInt(parentLeft)

        if (flag) {
            originalWidth > clientX ? (w = originalWidth - clientX, l = clientX) :
                (w = clientX - originalWidth, l = originalWidth)
            setShapeHandler(l, t, w, h)
        }
    }
    //中右锚点
    middleRightHandler = (event) => {
        let e = event || window.event
        let { originalLeft, flag } = this.state
        let { parentLeft, setShapeHandler } = this.props
        let w, h, l, t, clientX = e.clientX

        if (parentLeft) clientX = e.clientX - parseInt(parentLeft)

        if (flag) {
            clientX > originalLeft ? (w = clientX - originalLeft, l = originalLeft) :
                (w = originalLeft - clientX, l = clientX)
            setShapeHandler(l, t, w, h)
        }
    }
    //下左锚点
    bottomLeftHandler = (event) => {
        let e = event || window.event
        let { originalLeft, originalTop, originalWidth, originalHeight, flag } = this.state
        let { parentLeft, parentTop, setShapeHandler } = this.props
        let w, h, l, t, clientX = e.clientX, clientY = e.clientY

        if (parentLeft) clientX = e.clientX - parseInt(parentLeft)
        if (parentTop) clientY = e.clientY - parseInt(parentTop)

        if (flag) {
            originalWidth > clientX ? (w = originalWidth - clientX, l = clientX) :
                (w = clientX - originalWidth, l = originalWidth)

            clientY > originalTop ? (h = clientY - originalTop, t = originalTop) :
                (h = originalTop - clientY, t = clientY)
            setShapeHandler(l, t, w, h)
        }
    }
    //下中锚点
    bottomMiddleHandler = (event) => {
        let e = event || window.event
        let { originalLeft, originalTop, originalWidth, originalHeight, flag } = this.state
        let { parentTop, setShapeHandler } = this.props
        let w, h, l, t, clientY = e.clientY

        if (parentTop) clientY = e.clientY - parseInt(parentTop)

        if (flag) {
            clientY > originalTop ? (h = clientY - originalTop, t = originalTop) :
                (h = originalTop - clientY, t = clientY)
            setShapeHandler(l, t, w, h)
        }
    }
    //下右锚点
    bottomRightHandler = (event) => {
        let e = event || window.event
        let { originalLeft, originalTop, flag } = this.state
        let { parentLeft, parentTop, setShapeHandler } = this.props
        let w, h, l, t, clientX = e.clientX, clientY = e.clientY

        if (parentLeft) clientX = e.clientX - parseInt(parentLeft)
        if (parentTop) clientY = e.clientY - parseInt(parentTop)

        if (flag) {
            clientX > originalLeft ? (w = clientX - originalLeft, l = originalLeft) :
                (w = originalLeft - clientX, l = clientX)

            clientY > originalTop ? (h = clientY - originalTop, t = originalTop) :
                (h = originalTop - clientY, t = clientY)
            setShapeHandler(l, t, w, h)
        }
    }
    move = (e) => {
        let { direction } = this.props
        if (direction == 'tl') {
            this.topLeftHanlder(e)
        } else if (direction == 'tm') {
            this.topMiddleHandler(e)
        } else if (direction == 'tr') {
            this.topRightHandler(e)
        } else if (direction == 'ml') {
            this.middleLeftHandler(e)
        } else if (direction == 'mr') {
            this.middleRightHandler(e)
        } else if (direction == 'bl') {
            this.bottomLeftHandler(e)
        } else if (direction == 'bm') {
            this.bottomMiddleHandler(e)
        } else if (direction == 'br') {
            this.bottomRightHandler(e)
        }
    }
    stop = () => {
        document.removeEventListener("mousemove", e => this.move(e));
        this.setState({ flag: false })
    }
    render() {
        return <div className={`${this.props.direction} sizeControl`} onMouseDown={e => this.start(e)}> </div>
    }
}

export default Anchor