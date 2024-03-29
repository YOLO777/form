# form-making
基于Vue,ElementUI开发的一款表单设计器，提高表单开发效率的利器，让开发者从枯燥的表单代码编写中解放出来
## 特性

* 可视化配置页面
* 提供栅格布局，并采用flex实现对齐
* 一键预览配置的效果
* 一键生成配置json数据
* 一键生成代码，立即可运行
* 提供自定义组件满足用户自定义需求
* 提供远端数据接口，方便用户需要异步获取数据加载
* 提供功能强大的高级组件
* 支持表单验证
* 快速获取表单数据

## CDN
``` html
<!-- 引入样式 -->
<link rel="stylesheet" href="https://unpkg.com/form-making/dist/FormMaking.css">
<!-- 引入组件库 -->
<script src="https://unpkg.com/form-making/dist/FormMaking.umd.js"></script>
```

## Install

```shell
npm install form-develop -S
```

## Quick Start

``` javascript
import FormMaking from 'form-develop'
import 'form-making/dist/FormMaking.css'
Vue.use(FormMaking)

// or
import {
  GenerateForm
} from 'form-develop'
import 'form-making/dist/FormMaking.css'

Vue.component(GenerateForm.name, GenerateForm)
```

## Template
``` html
<fm-generate-form></fm-generate-form>
```

## 设计器引用

``` javascript
import {MakingForm} from 'form-develop'
Vue.component(MakingForm.name, MakingForm)
```

```html
<fm-making-form  preview generate-code generate-json>
    <template slot="action">
    </template>
  </fm-making-form>
```

##### props
| Prop name  | Description  | Type  | Default value |
| ------------ | ------------ | ------------ | ------------ |
| preview  | 预览，头部操作按钮  | Boolean  | false |
| generate-json  | 生成JSON  | Boolean  | false |
| generate-code  | 生成代码  | Boolean  | false |


##### methods
| Function name | Description                    |
| ------------- | ------------------------------ |
| `getJSON`      | 获取设计器生成的JSON数据       |
| `getHtml`   | 获取生成可使用的html代码    |
| `setJSON(value)`   | 根据value值设置表单设计器    |

##### slots
| Slot name | Description                    |
| ------------- | ------------------------------ |
|   action    | 自定义设计器操作按钮，展示在设计头部区域       |


## 表单渲染

下面就是加载对应的数据用于展示，假设你已经正确加载组件

``` html
<fm-generate-form
    :data="jsonData"
    :remote="remoteFuncs"
    :value="values"
    ref="generateForm">
</fm-generate-form>
```

``` javascript
new Vue({
    ...
    data () {
        return {
            jsonData: {}, // 表单配置中生成的json数据
            values: {}, // 表单需要显示的表单数据
            remoteFuncs: {
                // 组件配置时配置的远端方法,保持和配置时输入的名称一致
                func_test (resolve) {
                  // 模拟接口请求
                  setTimeout(() => {
                    const options = [
                      {id: '1', name: '1111'},
                      {id: '2', name: '2222'},
                      {id: '3', name: '3333'}
                    ]
                    
                    // 获取到的值和标签可以通过配置页远端配置
                    // 值:id  标签：name
        
                    resolve(options) // 将后端获取的数据放入回调函数中
                  }, 2000)
                },
                func_test2....
            }
        }
    },
    methods: {
        ...{
            // 调用此方法验证表单数据和获取表单数据
            this.$refs.generateForm.getData().then(data => {
                // 数据校验成功
                // data 为获取的表单数据
            }).catch(e => {
                // 数据校验失败
            })
        }
    }
})
```
