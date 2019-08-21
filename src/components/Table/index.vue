<template>
  <div>
    <el-table
      :data="tableData"
      border
      :style="{'width': width+'%'}"
      :max-height="height">
      <el-table-column v-for="item in  tablePropData"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
         align="center">
        <template scope="scope">
          <span><el-input v-model="scope.row[item.prop]"></el-input></span>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="addRow">添加一行</el-button>
    <el-button type="primary" @click="delRow">删除一行</el-button>
  </div>
</template>

<script>
  import Viewer from 'viewerjs'
  import * as qiniu from 'qiniu-js'

  require('viewerjs/dist/viewer.css')
  import {
    getToken
  } from '../../utils/auth';

  export default {
    props: {
      tablePropData: {
        type: Array,
        default: () =>  []
      },
      tableData: {
        type: Array,
        default: () =>  []
      },
      width: {
        type: Number,
        default: 100
      },
      height: {
        type: Number,
        default: 300
      },
      disabled: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {

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
    methods:{
      addRow(){
        console.log(this.tablePropData);
        let obj={};
        this.tablePropData.forEach(item=>{
          let prop=  item.prop;
          obj[prop]='';
        });
        this.tableData.push(obj)
        this.$emit('input', this.tableData)
      },
      delRow(){
        this.tableData.splice(-1)
        this.$emit('input', this.tableData)
      }
    },
    created(){
      this.$emit('input', this.tableData)
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
