import request from "../utils/request";
import {message, notification} from 'antd';

/**
 * 查询
 * @param param
 * @returns {Promise<*>}
 */
async function queryProducts(param) {
  return new Promise(function(res, reject) {
    let arr = [
      {
      "name": "songxl",
      "sex": "男",
      "age": "13",
      "id": "1"
    },
      {
        "name": "lisi",
        "sex": "男",
        "age": "21",
        "id": "2"
      },
      {
        "name": "lsy",
        "sex": "女",
        "age": "25",
        "id": "3"
      },
      {
        "name": "ln",
        "sex": "女",
        "age": "23",
        "id": "4"
      }
    ];
    let url = 'http://127.0.0.1:8080/user/queryAll';
    request(url,{
      //解决跨域问题
      model:"no-cors",
      // 解决报错：'Access-Control-Allow-Origin' header]``问题
      withCredentials: false
    }).then(result=>{
      res(result.data);
    });

  });
}

async function addProduct(param) {
  return new Promise(function(res, reject) {

  });
}

async function deleteProduct(param) {
  return new Promise(((resolve,reject)=>{
      let url = `http://127.0.0.1:8080/user/delete`;
      request(url,{
        method: "POST",
        model:"no-cors",
        withCredentials: false,
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:`id=${param.id}`
      }).then(res=>{
        resolve(res.data);
      });
  }));
}

async function uploadWord(param) {
  return new Promise((resolve,reject) => {
    let url = `http://127.0.0.1:8080/user/delete`;
    request(url,{
      method: "POST",
      model:"no-cors",
      withCredentials: false,
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body:`id=${param.id}`
    }).then(res=>{
      resolve(res.data);
    });
  })
}

export default {

  namespace: 'products',

  state: {
    productsList:[],
    addVisible:false
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/products') {
          dispatch({
            type: 'queryProducts',
          });
        }
      });
    },
  },

  effects: {
    * queryProducts({payload}, {select,call, put}) {
      let data = yield call(queryProducts,payload);
      yield put({
        type: 'changeValue',
        payload: {
          productsList:data
        }
      });
    },

    * deleteProduct({payload}, {select,call, put}){
      let data = yield call(deleteProduct,payload);
      if(data.success){
        message.success(`删除 id:${payload.id} 成功`);
        yield put({
          type:'queryProducts'
        })
      }else{
        notification["error"]({
          message: 'Notification Title',
          description:
            '删除失败',
        });
      }
    },

    * uploadWord({payload}, {select,call, put}) {
      // let data = yield call(uploadWord,payload);
     console.log('sxl:',payload)
    },
  },

  reducers: {
    changeValue(state, action) {
      return {...state, ...action.payload};
    },
  },

};
