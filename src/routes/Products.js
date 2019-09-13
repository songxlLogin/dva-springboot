import React from 'react';
import {connect} from 'dva';
import {Button, Card, Divider, Form, Icon, Input, message, Modal, Popconfirm, Table, Upload} from 'antd';
import FormItem from "antd/es/form/FormItem";
// const Products = (props) => (
//   <h2>List of Products</h2>
// );

class Products extends React.Component {

  constructor(props){
    super(props);
    this.state={
      fileData:'',
      name:'',
      fileList:'',
      file:''
    }
  }

  render() {
    const productsList = this.props.productsList;
    const dispatch = this.props.dispatch;
      //定义表头，一般放在render()中
    const columns = [
        {
          title: '编号',         //列名称
          dataIndex: 'id'      //数据源的字段名
        },
        {
          title: '姓名',
          dataIndex: 'username'
        },
        {
          title: '性别',
          dataIndex: 'gender'
        },
        {
          title: '年龄',
          dataIndex: 'age'
        },
        {
          title: "Action",
          key: "action",
          render: (text, record) => (
            <span>
        <Button type="primary" size="small">修改</Button>
        <Divider type="vertical"/>
            <Popconfirm
              title="Are you sure to delete?"
              onConfirm={() => this.deleteProduct(record.id)}
            >
              <Button type="danger" size="small">删除</Button>
            </Popconfirm>
      </span>
          )
        }
      ];

    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
    };

    return (
      <div>
        <Card title="Product List --song.xl" headStyle={{textAlign: 'center'}}>
          <Button type="primary" onClick={this.showModal}>
            新增用户
          </Button>
          {/* 渲染文件上传组件 */}
          <Upload {...this.getPdfURL()} showUploadList={true}>
            <Button>
              <Icon type="upload"/> 上传文件
            </Button>
          </Upload>
          <Table columns={columns} dataSource={productsList} rowKey={card => card.id}/>
        </Card>
        <Modal
          title="Basic Modal"
          visible={this.props.addVisible}
          onOk={this.addaOk.bind(this)}
          onCancel={this.handleCancel}
        >
          <Form layout="inline">
            <FormItem>
              <Input name='name'
                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                placeholder="Username" onChange={this.onInputChange.bind(this)}
              />
            </FormItem>
            <FormItem>
              <Upload
                {...props}>
                <Button>
                  <Icon type="upload"/>上传头像
                </Button>
              </Upload>
            </FormItem>
          </Form>
        </Modal>
        <Button onClick={this.jumpFun}>跳转</Button>
      </div>
    )
  }

  onInputChange=(e)=>{
    this.setState({
      name:e.target.value
    });
}

  deleteProduct(id) {
    this.props.dispatch({
      type: 'products/deleteProduct',
      payload: {
        id: id
      }
    });
  };

  //跳转
  jumpFun=()=>{
    let name = '宋相磊'; //encodeURI(name)
    let age = ['1','李四','c','王五'];
    JSON.stringify(age);
    window.location.href='http://127.0.0.1:8080/get/one?name='+encodeURI(encodeURI(name))+'&age='+age;
  };

  showModal = () => {
    this.props.dispatch({
      type: 'products/changeValue',
      payload: {
        addVisible: true
      }
    });
  };
  handleCancel = e => {
    this.props.dispatch({
      type: 'products/changeValue',
      payload: {
        addVisible: false
      }
    });
  };

  //此方法是点击上传按钮，选择后即可上传
  getPdfURL = () => {
    const props = {
      name: 'file',
      action: 'http://127.0.0.1:8080/user/uploadWord',
      // accept:"application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      headers: {
        authorization: 'authorization-text',
      },
      // 拦截文件上传
      beforeUpload(file) {
        return true;
      },
      //上传文件改变时的状态
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功！`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败！`);
        }
      },
    };
    return props;
  }

  addaOk() {
    let {fileList} = this.state;
    let that = this;
    let formData = new FormData();
    // 批量上传
    for(let item of fileList){
      formData.append('files', item)
    }
    // 单个上传
    // formData.append('files', fileList[0]);
    formData.append("name",this.state.name);
    this.props.dispatch({
      type:'products/mockAddUser',
      payload:formData
    });

    this.props.dispatch({
      type: 'products/changeValue',
      payload: {
        addVisible: false
      }
    });
    // formData.append('tm', values.tm.format('YYYY-MM-DD HH:mm'))
    // reqwest({
    //   url: '/services/mountainditchmanage/insertmountainditchandproject', // 上传url
    //   method: 'post',
    //   processData : false,  //必须false才会避开jQuery对 formdata 的默认处理
    //   contentType : false, //必须false才会自动加上正确的Content-Type
    //   data: formData,
    //   success: () => {
    //     message.success('上传成功');
    //
    //     // that.setState({
    //     //   fileList: [],
    //     // })
    //     // that.props.form.resetFields();
    //   },
    //   error: () => {
    //     message.error('上传失败');
    //   },
    // });


  }

}

function mapStateToProps(state) {
  return {
    productsList: state.products.productsList,
    addVisible: state.products.addVisible,
  }
}

Form.create()(Products);

export default connect(mapStateToProps)(Products);
