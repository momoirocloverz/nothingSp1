import { request } from "./request.js";
import { getIp } from './getIp';
export default {
    getList({currentPage,pageSize,keyword,status}){
        let params={
            pageNum: currentPage,
            pageSize,
            title: keyword,
            status
        };
        return request({
          url: getIp() + 'biz/informaion/getInfomationByTitle',
          method: 'GET',
          params
      })
    },
    systemMsg(params = {}){
        return request({
            url: getIp() + 'biz/systemMsg/list',
            method: 'GET',
            params
        })
    },
    systemMsgDown(params = {}){
        return request({
            url: getIp() + 'biz/systemMsg/down',
            method: 'GET',
            params
        })
    },
    systemMsgAdd(data = {}){
        return request({
            url: getIp() + 'biz/systemMsg/add',
            method: 'POST',
            data
        })
    },
    systemMsgUpdate(data = {}){
        return request({
            url: getIp() + 'biz/systemMsg/update',
            method: 'POST',
            data
        })
    },
    systemMsgDel(params = {}){
        return request({
            url: getIp() + 'biz/systemMsg/del',
            method: 'GET',
            params
        })
    },
    systemMsgUp(params = {}){
        return request({
            url: getIp() + 'biz/systemMsg/up',
            method: 'GET',
            params
        })
    },
    getEditorInfo({id}){
      let params={
        id
      };
      return request({
          url: getIp() + 'biz/informaion/getDetail',
          method: 'GET',
          params
      })
    },
    getEditorDetail({id}){
      let params={
        id
      };
      return request({
          url: getIp() + 'biz/systemMsg/detail',
          method: 'GET',
          params
      })
    },
    setSoldOutAndPutaway({id}){
      let data={
        id
      };  
      return request({
        url: getIp() + 'biz/informaion/updateOnShelfStatus',
        method: 'POST',
        data
      })
    },

    setDeleteInfo({id}){
      let data={
        id
      }; 
      return request({
        url: getIp() + 'biz/informaion/deleteInfomation',
        method: 'DELETE',
        data
      })
    },
    setSaveAndUp(data){
      return request({
        url: getIp() + 'biz/informaion/updateInfoMation',
        method: 'POST',
        data:JSON.parse(JSON.stringify(data))
      })
    },
    setNewSaveAndUp(data){
      return request({
        url: getIp() + 'biz/informaion/addInformation',
        method: 'POST',
        data:JSON.parse(JSON.stringify(data))
      })
    },
    getImgToken(params){
        return request({
            url: getIp() + 'public/qiniu/token',
            method: 'GET',
            params
        })
    },
    getServiceInfo(params){
        return request({
            url: getIp() + 'biz/board/getRespond',
            method: 'GET',
            params
        })
    },
    editServiceInfo(data){
        return request({
            url: getIp() + 'biz/board/addOrEditRespond',
            method: 'POST',
            data
        })
    },
    deleteBoard(params){
        return request({
            url: getIp() + 'biz/board/delete',
            method: 'GET',
            params
        })
    },
    switchBoard(params){
        return request({
            url: getIp() + 'biz/board/switch',
            method: 'GET',
            params
        })
    },
    checkBoardArticle(params){
        return request({
            url: getIp() + 'biz/board/get',
            method: 'GET',
            params
        })
    },
     getBoardArticle(params){
        return request({
            url: getIp() + 'biz/board/list',
            method: 'GET',
            params
        })
    },
    editBoardArticle(data){
        return request({
            url: getIp() + 'biz/board/addOrEdit',
            method: 'POST',
            data
        })
    },
    
}