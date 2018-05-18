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
    start = (e) => {
        let { top, left, width, height } = this.props
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
        let { width, height, setShapeHandler } = this.props
        let w, h, t, l
        if (flag) {
            originalWidth > e.clientX ? (w = originalWidth - e.clientX, l = e.clientX) :
                (w = e.clientX - originalWidth, l = originalWidth)
            originalHeight > e.clientY ? (h = originalHeight - e.clientY, t = e.clientY) :
                (h = e.clientY - originalHeight, t = originalHeight)
            setShapeHandler(w, h, l, t)
        }
    }
    //左中锚点
    topMiddleHandler = (event) => {
        let e = event || window.event
        let { originalHeight, flag } = this.state
        let { height, setShapeHandler } = this.props
        let w, h, t, l
        if (flag) {
            originalHeight > e.clientY ? (h = originalHeight - e.clientY, t = e.clientY) :
                (h = e.clientY - originalHeight, t = originalHeight)

            setShapeHandler(w, h, l, t)
        }
    }
    //右上角锚点
    topRightHandler = (event) => {
        let e = event || window.event
        let { originalLeft, originalHeight, flag } = this.state
        let { height, setShapeHandler } = this.props
        let w, h, t, l
        if (flag) {
            e.clientX > originalLeft ? (w = e.clientX - originalLeft) :
                (w = originalLeft - e.clientX, l = e.clientX)
            originalHeight > e.clientY ? (h = originalHeight - e.clientY, t = e.clientY) :
                (h = e.clientY - originalHeight, t = originalHeight)
            setShapeHandler(w, h, l, t)
        }
    }
    //中左锚点
    middleLeftHandler = (event) => {
        let e = event || window.event
        let { originalWidth, flag } = this.state
        let { setShapeHandler } = this.props
        let w, h, t, l
        if (flag) {
            originalWidth > e.clientX ? (w = originalWidth - e.clientX, l = e.clientX) :
                (w = e.clientX - originalWidth, l = originalWidth)
            setShapeHandler(w, h, l, t)
        }
    }
    //中右锚点
    middleRightHandler = (event) => {
        let e = event || window.event
        let { originalLeft, flag } = this.state
        let { setShapeHandler } = this.props
        let w, h, t, l
        if (flag) {
            e.clientX > originalLeft ? (w = e.clientX - originalLeft) :
                (w = originalLeft - e.clientX, l = e.clientX)
            setShapeHandler(w, h, l, t)
        }
    }
    //下左锚点
    bottomLeftHandler = (event) => {
        let e = event || window.event
        let { originalLeft, originalTop, originalWidth, originalHeight, flag } = this.state
        let { height, setShapeHandler } = this.props
        let w, h, t, l
        if (flag) {
            originalWidth > e.clientX ? (w = originalWidth - e.clientX, l = e.clientX) :
                (w = e.clientX - originalWidth, l = originalWidth)

            e.clientY > originalTop ? (h = e.clientY - originalTop, t = originalTop) :
                (h = originalTop - e.clientY, t = e.clientY)
            setShapeHandler(w, h, l, t)
        }
    }
    //下中锚点
    bottomMiddleHandler = (event) => {
        let e = event || window.event
        let { originalLeft, originalTop, originalWidth, originalHeight, flag } = this.state
        let { height, setShapeHandler } = this.props
        let w, h, t, l
        if (flag) {
            e.clientY > originalTop ? (h = e.clientY - originalTop, t = originalTop) :
                (h = originalTop - e.clientY, t = e.clientY)
            setShapeHandler(w, h, l, t)
        }
    }
    //下右锚点
    bottomRightHandler = (event) => {
        let e = event || window.event
        let { originalLeft, originalTop, flag } = this.state
        let { setShapeHandler } = this.props
        let w, h, t, l
        if (flag) {
            e.clientX > originalLeft ? (w = e.clientX - originalLeft, l = originalLeft) :
                (w = originalLeft - e.clientX, l = e.clientX)

            e.clientY > originalTop ? (h = e.clientY - originalTop, t = originalTop) :
                (h = originalTop - e.clientY, t = e.clientY)
            setShapeHandler(w, h, l, t)
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