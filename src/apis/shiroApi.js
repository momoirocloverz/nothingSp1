import Axios from "axios";
import { getIp } from './getIp';
/**
 * 系统认证接口
 */
export default {
    /**
     * 系统登陆
     */
    loginIn: function ({ username, password }) {
        var param = {
            username: username,
            password: password
        };
        return Axios.post(getIp()+'biz/user/login', param);

    },
}