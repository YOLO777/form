import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

//判断cookie或url中是否有token,没有的场合返回false,存在的场合保存到cookie中并返回true
export function hasToken(to){
  if(getToken()){
    return true;
  }else {
    //存在token的场合
    if(to.query.token){
      setToken(to.query.token)
      return true;
    }else{ //不存在token的场合
      return false;
    }
  }
 
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
