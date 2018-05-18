import React from 'react'
import ReactDOM from 'react-dom'
import input from '../input.css'

class Drag extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {
        left: 0,
        top: 0,
        currentX: 0,
        currentY: 0,
        flag: false
    }
    componentDidMount() {
        document.addEventListener('mousemove', e => this.moveDrag(e), null)
        document.addEventListener('mouseup', e => this.endDrag(e), null)
    }
    startDrag = (e) => {
        let newState = {}
        let computedStyle = document.defaultView.getComputedStyle(this.dragBtn, null)
        let event = e || window.event

        event.preventDefault()
        newState.currentX = event.clientX
        newState.currentY = event.clientY
        newState.left = computedStyle.left
        newState.top = computedStyle.top
        newState.flag = true
        this.setState(newState)
    }
    moveDrag = (e) => {
        let { left, top } = this.state
        let event = e || window.event
        if (this.state.flag) {
            let nowX = event.clientX, nowY = event.clientY
            let disX = nowX - this.state.currentX, disY = nowY - this.state.currentY
            let currentLeft = parseInt(left) + disX
            let currentTop = parseInt(top) + disY
            console.log(parseInt(left),disX)
            this.dragBtn.style.left = currentLeft + 'px'
            this.dragBtn.style.top = currentTop + 'px'
        }
    }
    endDrag = () => {
        let computedStyle = document.defaultView.getComputedStyle(this.dragBtn, null);
        this.setState({
            left: computedStyle.left,
            top: computedStyle.top,
            flag: false,
        });
    }
    render() {
        let dragStyle = {
            position: 'absolute',
            cursor: 'n-resize',
            zIndex:10
        }
        return <div>
            <div className="dragBtn" style={dragStyle}
                onClick={this.clickHandler}
                ref={div => this.dragBtn = div}
                onMouseDown={(e) => this.startDrag(e)}
            // onMouseMove = {e => this.moveDrag(e)}
            // onMouseUp = {e => this.endDrag(e)}
            >
            </div>
        </div>
    }
}

export default Drag