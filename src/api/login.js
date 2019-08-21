import fetch from '../utils/fetch';

export function loginByEmail(username, password) {
  const data = {
    username,
    password
  };
  return fetch({
    url: '/api/auth/jwt/token',
    method: 'post',
    data
  });
}

export function logout(token) {
  return fetch({
    url: '/api/auth/jwt/invalid',
    method: 'post',
    params: { token }
  });
}

export function getInfo(token) {
  return fetch({
    url: '/api/admin/user/front/info',
    method: 'get',
    params: { token }
  });
}

export function getMenusTwo(token) {
  return fetch({
    url:''
  })
}

export function getMenus(token, sysId) {
    return fetch({
        url: '/api/admin/menu/getUserMenu/' + sysId,
        method: 'get',
        params: { token }
    });
}

export function getAllMenus() {
  return fetch({
    url: '/api/admin/user/front/menu/all',
    method: 'get'
  });
}
