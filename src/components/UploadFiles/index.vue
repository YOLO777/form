<template>
  <div>
    <el-upload
      class="upload-demo"
      ref="upload"
      action="/api/admin/file/upload"
      name="files"
      multiple
      :data="uploadfileData"
      :limit="length"
      :on-success="handleAvatarSuccess"
      :on-preview="download"
      :http-request="uploadFile"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-exceed="handleExceed"
      :disabled="disabledUpload"
      :before-upload="beforeFileUpload"
      :file-list="fileList"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary" :disabled="disabledUpload">点击上传</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success"
                 @click="subFileForm" :disabled="disabledUpload">
        上传到服务器
      </el-button>
      <div slot="tip" class="el-upload__tip">不超过100Mb</div>
    </el-upload>
  </div>
</template>

<script>
  import Viewer from 'viewerjs'
  import * as qiniu from 'qiniu-js'

  require('viewerjs/dist/viewer.css')
  import {
    getToken
  } from '../../utils/auth';

  import {
    upload,
    checkHashcode,
    showPic
  } from '../../api/admin/file/index';

  export default {
    props: {
      value: {
        type: Array,
        default: () => []
      },
      width: {
        type: Number,
        default: 100
      },
      height: {
        type: Number,
        default: 100
      },
      disabled: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: true
      },
      length: {
        type: Number,
        default: 3
      }
    },
    data() {
      return {
        uploadfileData: {
          hashcode: [],//文件生成的hashcode
        },
        disabledUpload: this.disabled,
        fileList: this.value.map(item => {
          return {
            key: item.key ? item.key : (new Date().getTime()) + '_' + Math.ceil(Math.random() * 99999),
            name: item.name,
            uid: item.uid,
            status: item.status
          }
        }),
      }
    },
    computed: {
      miniWidth() {
        if (this.width > this.height) {
          return this.height
        } else {
          return this.width
        }
      }
    },
    methods: {
      //处理删除
      handleRemove(file, fileList) {
        this.$emit('input', fileList);
      },
      //删除前怕判断是否已经禁用
      beforeRemove(file, fileList) {
        if (this.disabledUpload) {
          this.$message.warning("已经设置为禁用属性")
          return false;
        } else {
          return true;
        }
      },
      download(file) {
        const downloadUrl = '/api/admin/baseFile/downloadById/' + file.key;
        fetch(downloadUrl, {
          method: 'POST',
          credentials: 'include',
          headers: new Headers({
            'Authorization': getToken()//header带token信息
          })
        }).then(res => {
          res.blob().then(blob => {
            let bl = new Blob([blob], {
              type: 'application/octet-stream'
            });
            console.log(bl.size)
            if (window.navigator.msSaveOrOpenBlob) { //msSaveOrOpenBlob方法返回bool值
              navigator.msSaveBlob(bl, file.name); //本地保存
            } else {
              let link = document.createElement('a'); //a标签下载
              link.href = window.URL.createObjectURL(bl);
              link.download = file.name;
              link.click();
            }
          })
        })
      },
      //手动提交
      subFileForm() {
        this.formDate = new FormData()
        this.$refs.upload.submit();
      },
      //附件上传之前的操作
      async beforeFileUpload(file) {
        let _this = this;
        //使用async await return false无效,照样上传
        let result = true;
        if (file.size / 1024 / 1024 > 100) {
          _this.$message.error('上传附件大小不能超过 100MB!');
          return false;
        } else {//文件没有超过限定大小
          const hashcode = await _this.commonjs.generatehashcode(file);
          _this.formDate.append('hashcode', hashcode);
          _this.uploadfileData.hashcode = [];
          _this.uploadfileData.hashcode.push(hashcode);
          return true;
        }
      },
      //手动上传文件
      uploadFile(file) {
        let _this = this;
        _this.formDate.append('files', file.file);
        upload(_this.formDate).then(res => {
          _this.fileList = [];
          res.ids.forEach((id, i) => {
            let obj = {
              key: id,
              name: res.fileNames[i]
            };
            _this.fileList.push(obj)
          });
          _this.$message.success("上传成功！");
          this.$emit('input', _this.fileList)//并不能理解这段代码
        });
      },
      //附件上传成功返回文件id
      handleAvatarSuccess(res, file) {
        this.$message.success("普通上传！");
      },
      //附件超出个数限制提醒
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 ${this.length} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      async beforePhotoUpload(file) {
        return await this.commonjs.generatehashcode(file);
      },
    },
    watch: {}
  }
</script>

<style lang="scss">
  .fm-uplaod-container {
    .upload-file {
      margin: 0 10px 10px 0;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      // background: #fff;
      overflow: hidden;
      background-color: #fff;
      border: 1px solid #c0ccda;
      border-radius: 6px;
      box-sizing: border-box;
      position: relative;
      vertical-align: top;

      &:hover {
        .uplaod-action {
          display: flex;
        }
      }

      .uplaod-action {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        display: none;
        justify-content: center;
        align-items: center;

        i {
          color: #fff;
          cursor: pointer;
          margin: 0 5px;
        }
      }

      &.is-success {
        .item-status {
          position: absolute;
          right: -15px;
          top: -6px;
          width: 40px;
          height: 24px;
          background: #13ce66;
          text-align: center;
          transform: rotate(45deg);
          box-shadow: 0 0 1pc 1px rgba(0, 0, 0, .2);

          & > i {
            font-size: 12px;
            margin-top: 11px;
            color: #fff;
            transform: rotate(-45deg);
          }
        }
      }

      &.uploading {
        &:before {
          display: block;
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
        }
      }

      .upload-progress {
        position: absolute;

        .el-progress__text {
          color: #fff;
          font-size: 16px !important;
        }
      }

      img {
        max-width: 100%;
        max-height: 100%;
        vertical-align: middle;
      }
    }

    .el-upload--picture-card {
      position: relative;
      overflow: hidden;

      .el-icon-plus {
        position: absolute;
        top: 50%;
        left: 50%;
      }
    }

    .upload-input {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: block;
      opacity: 0;
      cursor: pointer;
    }
  }
</style>
