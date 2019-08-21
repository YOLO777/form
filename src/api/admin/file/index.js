import fetch from '../../../utils/fetch';

export function upload(obj) {
  return fetch({
    url: '/api/admin/baseFile/upload',
    method: 'post',
    data: obj
  })
}

export function checkHashcode(obj) {
  return fetch({
    url: '/api/admin/baseFile/checkHashcode',
    method: 'post',
    data: obj
  })
}

export function downloadById(id) {
  return fetch({
    url: '/api/admin/baseFile/downloadById/'+id,
    method: 'post',
    responseType: 'blob'
  })
}

export function showPic(photoFileId) {
  return fetch({
    url: '/api/admin/baseFile/showPic/' + photoFileId,
    method: 'get'
  })
}

