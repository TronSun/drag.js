import React from 'react'
import ReactDOM from 'react-dom'
import input from '../input.css'

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = { display: true };
        this.handleClick = this.handleClick.bind(this);
        this.onChildChanged = this.onChildChanged.bind(this);
        this.handleClick1 = this.handleClick1.bind(this);
    }
    handleClick() {
        this.setState({ display: true });
    }
    handleClick1() {
        this.setState({ display: false });
    }
    //利用子组件来改变父组件的状态
    onChildChanged(newS) {
        this.setState({ display: newS });
    }
    render() {
        const display = this.state.display;
        return (
            <div className='page'>
                <div id='mask' onClick={this.handleClick1} className={display ? 'show' : 'hide'} />
                <header onClick={this.handleClick}><h2>登录</h2></header>
                <p className='rules' onClick={this.handleClick1}>
                    {`点击半透明遮罩或浮出层顶部关闭按钮,关闭浮出层
点击页面深绿色头部登录按钮,显示浮出层
拖拽浮出层顶部,可使其移动
拖拽浮出层右边框或下边框,可改变其大小`}
                </p>
                <div className={display ? 'show' : 'hide'}><LogPad display={this.state.display} callbackParent={this.onChildChanged} /></div>
            </div>);
    }
}

class LogPad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            top: (window.innerHeight - 220) / 2,
            left: (window.innerWidth - 320) / 2
        };
        this.onChildChanged1 = this.onChildChanged1.bind(this);
    }
    onChildChanged1(newleft, newtop) {
        this.setState({ top: newtop, left: newleft });
    }
    render() {
        const top = this.state.top;
        const left = this.state.left;
        return (
            <div className='logpad' style={{ 'top': top + 'px', 'left': left + 'px' }} >
                <Title display={this.props.display} top={this.state.top} left={this.state.left} callbackParent={this.props.callbackParent} callbackParent1={this.onChildChanged1} />
                <UserInputs />
            </div>);
    }
}
class Title extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: this.props.display,
            cursor: 'pointer',
            relativex: null,
            relativey: null,
            isDragging: false//设置下是不是在drag状态
        };
        this.handleClick = this.handleClick.bind(this);
        //进入title的时候把鼠标指针换一下
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        //拖拽
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }
    handleMouseEnter(e) {
        this.setState({ cursor: 'move' });
    }
    handleMouseLeave(e) {
        this.setState({ cursor: 'pointer', isDragging: false });
    }
    handleClick() {
        var newS = false;
        this.setState({ display: newS });
        this.props.callbackParent(newS);
    }
    handleMouseDown(e) {
        this.setState({
            relativex: e.pageX - this.props.left,
            relativey: e.pageY - this.props.top,
            isDragging: true
        });
    }
    handleMouseMove(e) {
        if (this.state.isDragging === true) {
            const maxX = window.innerWidth - 320;
            const maxY = window.innerHeight - 220;
            var moveX = e.pageX - this.state.relativex;
            var moveY = e.pageY - this.state.relativey;
            //用来限制，不让登录框超过边界
            moveX = Math.min(Math.max(0, moveX), maxX);
            moveY = Math.min(Math.max(0, moveY), maxY);
            this.props.callbackParent1(moveX, moveY);
        } else {
            return false;
        }
    }
    handleMouseUp(e) {
        e.preventDefault();
        this.setState({
            isDragging: false,
            relativex: null,
            relativey: null
        });

    }
    render() {
        const cursor = this.state.cursor;
        return (
            <div className='title' style={{ 'cursor': cursor }} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp}>
                <h4>登录</h4>
                <div className='delete' onClick={this.handleClick}>X</div>
            </div>);
    }
}

class UserInputs extends React.Component {
    render() {
        return (
            <div className='inputs'>
                <input type='text' placeholder='   请输入用户名...' />
                <input type='password' placeholder='   请输入密码...' />
                <input type='submit' value='登录' className='submit' />
            </div>);
    }
}
export default Page