#介绍
这是一个在ant-design的demo项目的基础上进行开发的拖拽组件和进行组件变化的项目

### 组件的大小变化

有四个值，分别用来存放一个按钮的四个点的坐标，对应的
    左上：(left，top)
    左下：(left，top+height)
    右上：(left+width，top)
    右下：(left+width，top+height)

当我拖动左上角的锚点时，应以右下角的锚点为中心点进行大小变化。首先改变宽的的变化，需要判断 left+width 是否大于 e.clientX ，如果是，做减法，取到当前宽度的值，并且设置left值为e.clientX；如果不是，
需要e.clientX - left+width, 取到当前宽度的值，并且设置left的值为left+width的值，
其次改变高度的变化，类似上面的做法，算出height和top值。

该页面全部功能并没有完成，后续更新。。。