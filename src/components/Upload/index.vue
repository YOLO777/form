<template>
  <div class="fm-uplaod-container" :id="uploadId">
    <div :id="item.key"
         :style="{width: width+'px', height: height+'px'}"
         :class="{uploading: item.status=='uploading', 'is-success': item.status=='success'}"
         class="upload-file" v-for="(item) in fileList" :key="item.key">
      <img :src="item.src"/>
      <el-progress v-if="item.status=='uploading'" :width="miniWidth*0.9" class="upload-progress" type="circle"
                   :percentage="item.percent"></el-progress>

      <label class="item-status" v-if="item.status=='success'">
        <i class="el-icon-upload-success el-icon-check"></i>
      </label>

      <div class="uplaod-action">
        <i class="el-icon-view" @click="handlePreviewFile(item.key)" :style="{'font-size': miniWidth/4+'px'}"></i>
        <i class="el-icon-delete" v-if="!disabledUpload" @click="handleRemove(item.key)" :style="{'font-size': miniWidth/4+'px'}" ></i>
      </div>
    </div>

    <div class="el-upload el-upload--picture-card" :style="{width: width+'px', height: height+'px'}">
      <i class="el-icon-plus"
         :style="{fontSize:miniWidth/4+'px',marginTop: (-miniWidth/8)+'px', marginLeft: (-miniWidth/8)+'px'}"></i>
      <input accept="image/*" multiple ref="uploadInput" @change="handleChange" type="file"
             :style="{width: width+'px', height: height+'px'}" name="file" class="el-upload__input upload-input" :disabled="disabledUpload">
    </div>
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
    showPic,
    downloadById
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
      multiple: {
        type: Boolean,
        default: true
      },
      disabled: {
        type: Boolean,
        default: true
      },
      // length: {
      //   type: Number,
      //   default: 9
      // }
    },
    data() {
      return {
        dialogVisible: false,
        disabledUpload:this.disabled,
        fileList: [],
        fileList2: this.value.map(item => {
          return {
            key: item.key ? item.key : (new Date().getTime()) + '_' + Math.ceil(Math.random() * 99999),
            url: item.url,
            percent: item.percent ? item.percent : 100,
            status: item.status ? item.status : 'success'
          }
        }),
        viewer: null,
        uploadId: 'upload_' + new Date().getTime()
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
    created() {
      this.setValue();
    },
    methods: {
      setValue() {
        let _this = this;
        let shuZu = [];
        this.value.forEach(item => {
          let src = "";
          showPic(item.key).then(res => {
            // console.log(res)
            let obj = {
              key: item.key ? item.key : (new Date().getTime()) + '_' + Math.ceil(Math.random() * 99999),
              url: item.url,
              percent: item.percent ? item.percent : 100,
              status: item.status ? item.status : 'success',
              src: 'data:image/jpeg;base64,' + res,
            }
            shuZu.push(obj)
            _this.fileList = shuZu;
          })
        });
      },
      async beforePhotoUpload(file) {
        return await this.commonjs.generatehashcode(file);
      },
      async handleChange() {
        const _this = this
        for (let i = 0; i < this.$refs.uploadInput.files.length; i++) {
          let hashcode = [];
          const file = this.$refs.uploadInput.files[i];
          console.log(file);
          let fd = new FormData();
          fd.append('files', file);
          let code = await this.beforePhotoUpload(file);
          hashcode.push(code);
          fd.append('hashcode', hashcode);//其他参数
          upload(fd).then(r => {
            let obj = {
              key: r.ids[0],
              url: "/api/admin/baseFile/showPic/" + r.ids[0],
              percent: 100,
              status: 'success',
            }
            let obj2 = {
              key: r.ids[0],
              url: "/api/admin/baseFile/showPic/" + r.ids[0],
              percent: 100,
              status: 'success',
            }
            console.log("2")
            this.fileList2.push(obj2);
            console.log(this.fileList2)
            showPic(r.ids[0]).then(res => {
              obj.src = 'data:image/jpeg;base64,' + res;
            });
            this.fileList.push(obj);
            console.log(this.fileList)
            console.log("fileList")
          })
        }
        this.$emit('input', _this.fileList2)//并不能理解这段代码
      },

      handleRemove(key) {
        this.fileList.splice(this.fileList.findIndex(item => item.key === key), 1)
        this.fileList2.splice(this.fileList2.findIndex(item => item.key === key), 1)
        this.$emit('input', this.fileList2)
      },

      handlePreviewFile(key) {
        this.viewer && this.viewer.destroy()
        this.uploadId = 'upload_' + new Date().getTime()

        console.log(this.viewer)
        this.$nextTick(() => {
          this.viewer = new Viewer(document.getElementById(this.uploadId))
          this.viewer.view(this.fileList.findIndex(item => item.key === key))
        })
      }
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
