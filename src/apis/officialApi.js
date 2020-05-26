import { request } from "./request.js";
import { getIp } from './getIp';

/**
 * 提供组织,用户,角色等相关接口
 */
export default {
    getList({currentPage,pageSize}){
        let data={
            pageNum: currentPage,
            pageSize,
        };
        return request({
          url: getIp() + 'biz/appointmentRecord/page',
          method: 'POST',
          data
      })
    },
}