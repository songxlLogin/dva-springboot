import React from 'react';
import {connect} from 'dva';
import {Table, Divider, Button, Card,Popconfirm,Form,Input,Icon,Modal} from 'antd';
import FormItem from "antd/es/form/FormItem";
// const Products = (props) => (
//   <h2>List of Products</h2>
// );

class Products extends React.Component {




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
    return (
      <div>
        <Card title="Product List --song.xl" headStyle={{textAlign: 'center'}}>
          <Button type="primary" onClick={this.showModal}>
            新增用户
          </Button>
          <Table columns={columns} dataSource={productsList} rowKey={card => card.id}/>
        </Card>
        <Modal
          title="Basic Modal"
          visible={this.props.addVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form  layout="inline">
            <FormItem>
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                />
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
  deleteProduct(id){
    this.props.dispatch({
      type:'products/deleteProduct',
      payload:{
        id:id
      }
    });
  }
  showModal = () => {
    this.props.dispatch({
      type:'products/changeValue',
      payload:{
        addVisible: true
      }
    });
  };
  handleCancel = e => {
    this.props.dispatch({
      type:'products/changeValue',
      payload:{
        addVisible: false
      }
    });
  };
}

function mapStateToProps(state) {
  return {
    productsList: state.products.productsList,
    addVisible:state.products.addVisible,
  }
}

export default connect(mapStateToProps)(Products);
