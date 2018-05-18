import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import input from './input.css';
import { DeteleTable, NumericInputDemo, Drag, Page, showDrag } from './components';
import { Breadcrumb, Button, DatePicker, Switch, Table, Icon, Divider, Input, InputNumber, Popconfirm, Form } from 'antd';

function App() {
  function onChange(checked) {
    console.log(checked)
  }
  function createHandler(text){
    showDrag(text)
  }
  showDrag('哈哈哈')
  return (
    
    <div style={{ margin: 100 }}>
      <Button type="primary" onClick={() => createHandler('我是拖拽按钮...')}>生成拖拽按钮</Button>
      {/*<Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item><a href="">Application Center</a></Breadcrumb.Item>
        <Breadcrumb.Item><a href="">Application List</a></Breadcrumb.Item>
        <Breadcrumb.Item>An Application</Breadcrumb.Item>
      </Breadcrumb>
      <Drag />
      <Drag />
      <NumericInputDemo />
      <DeteleTable />*}
      {/*<Switch defaultChecked size='small' onChange={onChange} />*/}
      {/*<hr /><br />
      <hr /><br />
      <hr /><br />
      <NewApp />
      <EditableTable />*/}
    </div>
  );
}

class NewApp extends React.Component {
  state = {
    close: true
  }
  switchTableHandler = (checked) => {
    this.setState({ close: checked })
  }
  render() {
    let { close } = this.state
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a href="http://www.baidu.com">{text}</a>,
    }, {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;">Action 一 {record.name}</a>
          <Divider type="vertical" />
          <a href="javascript:;">Delete</a>
          <Divider type="vertical" />
          <a href="javascript:;" className="ant-dropdown-link">
            More actions <Icon type="down" />
          </a>
        </span>
      ),
    }];

    const data = [{
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    }, {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    }, {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    }];
    return <div>
      <Switch defaultChecked onChange={this.switchTableHandler} />,
      {close && <Table columns={columns} dataSource={data} />}
      <InputApp />
    </div>
  }
}
class InputApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
    };
  }
  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ userName: '' });
  }
  onChangeUserName = (e) => {
    this.setState({ userName: e.target.value });
  }
  render() {
    const { userName } = this.state;
    const suffix = userName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    return (
      <Input className="input"
        placeholder="Enter your username"
        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,1)' }} />}
        suffix={suffix}
        value={userName}
        onChange={this.onChangeUserName}
        ref={node => this.userNameInput = node}
        addonAfter={<Button className="btn" type="primary">Primary</Button>}
      />
    );
  }
}


const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber size="small" />;
    }
    return <Input size="small" />;
  };
  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `Please Input ${title}!`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : (
                  restProps.children
                )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data, editingKey: '' };

    this.columns = [
      {
        title: 'name',
        dataIndex: 'name',
        width: '25%',
        editable: true,
      },
      {
        title: 'age',
        dataIndex: 'age',
        width: '15%',
        editable: true,
      },
      {
        title: 'address',
        dataIndex: 'address',
        width: '40%',
        editable: true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div className="editable-row-operations">
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        className="saveBtn"
                        href="javascript:;"
                        onClick={() => this.save(form, record.key)}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (<div>
                <a className='saveBtn' onClick={() => this.edit(record.key)}>编辑</a>
                <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
                  <a href="javascript:;">删除</a>
                </Popconfirm>
              </div>

                )}
            </div>
          );
        },
      },
    ];
  }
  onDelete = (key) => {
    const data = [...this.state.data];
    this.setState({ data: data.filter(item => item.key !== key) });
  }
  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };
  edit(key) {
    this.setState({ editingKey: key });
  }
  save(from, key) {
    from.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(data);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <Table
        components={components}
        bordered
        dataSource={this.state.data}
        columns={columns}
      />
    );
  }
}


ReactDOM.render(<App />, document.getElementById('root'));
