export function getIp(){
  let base = '/';
  if (process.env.NODE_ENV === 'development') {
      //base = 'http://192.168.8.20:8180/';
      base = 'http://test.api.10000rc.com/';
  } else if (process.env.VUE_APP_TITLE == 'test') {
    base = 'http://test.api.10000rc.com/';
  }else {
    base = 'http://www.10000rc.com/2.0/';
  }
  return base;
}
