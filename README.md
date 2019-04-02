## 项目框架介绍
**1. 概述**

项目采用Vue.js + element UI 为基础，npm作为包管理工具，webpack作为模块化构建工具，其中用到了vue router2实现了前端访问的路由功能；

**2. 配置说明**

项目的后台ajax访问路径存放在2个地方，因为src和static目录做了区分，分别在/static_config/和/src/config下

- dev.config.js 表示开发环境路径
- mock.config.js 表示测试或mock环境路径
- prod.config.js 表示生产环境路径   
只需在各文件中配置好各环境的路径即可，打包时会自动区分环境打包；

**3. 项目目录介绍**

    * /static/目录为静态资源文件目录，主要存放的是superUI相关的资源，也是本项目首页采用的框架；
    * /src/目录下为开发相关的文件目录；
    * /src/api/url.js为所有模块方法请求管理的文件，需要新增请求时，在改文件中新增常量配置；
    * /src/api/baseRequest.js该文件为对jquery ajax的自定义封装，主要为简化请求代码，异常时处理等情况；
    * /src/common/js/util.js该文件中主要为时间格式化的util，已经封装好可直接使用；
    * /src/components/ 目录下为该项目的一些通用的组件功能，会在后续过程中持续的完善;
      目前已有的组件：dictSelect 业务字典组件、ueditor富文本编辑组件、fileUpload组件（img_upload_cloud为对接云盘图片上传，img_upload 为对接fastdfs图片上传、file_upload为对接fastdfs文件上传）
    * /src/pages/demo.vue 为各组件的使用案列
**4. 新增功能页面时，在/src/router/index.js中新增一个路由访问的节点**

**5. 主要功能页面，开发时在/src/pages/根据模块新建目录编写**

---
## 构建步骤

**1. 概述**
>1. 安装node.js的最新版本，配置npm及webpack
>2. 前端开发工具，请使用vs-code
>3. 项目检下来，导入到vs-code，**npm install** 安装项目依赖，**npm run dev** 可以跑起来本地运行   

**2. 参考命令**
```bash
#切换使用淘宝的npm镜像（国内npm太慢，建议切换为淘宝镜像）
npm config set registry https://registry.npm.taobao.org
#利用npm安装项目相关的依赖模块
npm install xxx@xxx
#启动开发环境的本地服务，访问路径localhost:8080
npm run dev
#生产压缩打包 
npm run build
# 生产压缩打包并生产报告
npm run build --report
```

## 参考资料

1. For a detailed explanation on how things work, check out the [vuejs-templates-webpack](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 关于页面button级别的权限控制说明如下

**1.引入文件**  
在业务功能页面的<script></script>标签中引入import util from '@/common/util'

**2.添加方法**  
在业务功能页面的methods:{} 定义以下方法：
hasPermissions: function(obj){
  return util.permissionValid.hasPermissions(obj);
}

**3.button限制**  
在需要权限限制的button上添加v-if的控制，示例如下：
<el-button v-if="hasPermissions('customer:view')"  type="success" icon="plus" v-on:click="handleAdd">新增</el-button>

**4.额外说明**  
3中提到的 customer:view 的权限标识一为后台接口controller添加的权限标识，二需要在添加菜单权限时增加权限标识的字符串

**5.表格字段格式化（映射业务字典）**  
```bash  
<el-table-column prop="enabled" label="可见" :formatter="(row,column)=>formatField(row,column,'enabled','IF_ENABLED')">
</el-table-column>
封装业务表格字段中，涉及到业务字段的方法，直接在字段中按如上代码引入formatter方法，参数分别为  
row 行对象  
column  列对象  
columnName  当前字段prop  
dictTypeId  对应的业务字典项ID  

页面引入util.js  
  import util from '@/common/util'  

在method: {} 中引入如下方法，即可  
//表格字段格式化  
formatField: function (row,column,columnName,dictTypeId) {  
  return util.formatDict.formatTableField(row,column,columnName,dictTypeId);  
}  
```