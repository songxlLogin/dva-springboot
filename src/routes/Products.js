import React from 'react';
import {connect} from 'dva';
import {Button, Card, Divider, Form, Icon, Input, message, Modal, Popconfirm, Table, Upload} from 'antd';
import FormItem from "antd/es/form/FormItem";
// const Products = (props) => (
//   <h2>List of Products</h2>
// );

class Products extends React.Component {




  render() {
    const productsList = this.props.productsList;
    const dispatch = this.props.dispatch;
    /**
     *  后端地址：  http://127.0.0.1:8080/user/uploadWord
     *  请求头：headers: {
                          authorization: 'authorization-text',
                          'Content-Type': 'multipart/form-data',
                        }
     */

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
    return (
      <div>
        <Card title="Product List --song.xl" headStyle={{textAlign: 'center'}}>
          <Button type="primary" onClick={this.showModal}>
            新增用户
          </Button>
          {/* 渲染文件上传组件 */}
          <Upload {...this.getPdfURL()} showUploadList={true}>
            <Button>
              <Icon type="upload" /> 上传文件
            </Button>
          </Upload>
          <Table columns={columns} dataSource={productsList} rowKey={card => card.id}/>
        </Card>
        <Modal
          title="Basic Modal"
          visible={this.props.addVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form layout="inline">
            <FormItem>
              <Input
                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                placeholder="Username"
              />
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }

  deleteProduct(id) {
    this.props.dispatch({
      type: 'products/deleteProduct',
      payload: {
        id: id
      }
    });
  }

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
  getPdfURL = () =>{
    const props = {
      name: 'file',
      action: 'http://127.0.0.1:8080/user/uploadWord',
    // accept:"application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {//上传文件改变时的状态
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
}

function mapStateToProps(state) {
  return {
    productsList: state.products.productsList,
    addVisible: state.products.addVisible,
  }
}

export default connect(mapStateToProps)(Products);
