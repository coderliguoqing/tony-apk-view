<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item label="">
            <el-date-picker v-model="filters.time" type="datetimerange" align="right" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <dict-select dictTypeId="BANNER_STATUS" v-model="filters.status" placeholder="状态"></dict-select>
          </el-form-item>
          <el-form-item label="">
            <dict-select dictTypeId="BANNER_TYPE" v-model="filters.type" placeholder="类型"></dict-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="filters.title" placeholder="标题" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="search" v-on:click="getBannerList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="fa-repeat" v-on:click="resetFields">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span class="wrapper">
      <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      <el-button type="warning" icon="el-icon-edit" @click="handleEdit">编辑</el-button>
      <el-button type="primary" icon="el-icon-info" @click="handleShow">查看</el-button>
      <el-button type="danger" icon="el-icon-close" @click="handleClose">关闭</el-button>
    </span>
    <el-row :gutter="20">
      <el-col :span="24" class="toolbar" style="padding-top: 15px">
        <div class="grid-content bg-purple">
          <el-table ref="singleTable" row-key="id" :data="bannerList" border tooltip-effect="dark" style="width: 100%"
              highlight-current-row @current-change="handleSelectChange" v-loading="listLoading" element-loading-text="拼命加载中">
            <el-table-column header-align="center" align="center" type="index"> </el-table-column>
            <el-table-column header-align="center" align="center" prop="code" label="编号" sortable> </el-table-column>
            <el-table-column header-align="center" align="center" prop="picUrl" label="图片"> 
              <template slot-scope="scope">
                <img :src="readUrl + scope.row.picUrl" :preview="scope.row.code" style="height:50px;width:50px;"/>
              </template>
            </el-table-column>
            <el-table-column header-align="center" :show-overflow-tooltip="true" prop="title" label="标题" > </el-table-column>
            <el-table-column header-align="center" align="center" prop="position" label="排列顺序" sortable> </el-table-column>
            <el-table-column header-align="center" align="center" prop="startTime" label="开始日期" :formatter="formatDate" sortable> </el-table-column>
            <el-table-column header-align="center" align="center" prop="endTime" label="结束日期" :formatter="formatDate" sortable> </el-table-column>
            <el-table-column header-align="center" align="center" prop="status" label="状态" :formatter="formatEnabled"> </el-table-column>
          </el-table>
        </div>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
      </el-col>
    </el-row>
    <el-dialog :title="title" :visible.sync="bannerForm" :close-on-click-modal="false" :before-close="cancelDialog" :fullscreen="false" top="1%">
      <el-form :model="banner" :rules="bannerRules" ref="banner" label-width="110px" class="demo-ruleForm">
        <el-form-item label="编码" prop="code">
          <el-input v-model="banner.code" placeholder="系统自动生成" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="banner.title" :maxlength="50" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="position">
          <el-input-number v-model="banner.position" :min="1" :max="9999"></el-input-number>
        </el-form-item>
        <el-form-item label="有效时间" prop="time" v-if="showTime">
          <el-date-picker v-model="banner.time" type="datetimerange" align="right" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期"></el-date-picker>       
        </el-form-item>
        <el-form-item label="生效日期" prop="startTime" v-if="showSplitTime">
          <el-col :span="11">
            <el-form-item prop="startTime">
              <el-date-picker v-model="banner.startTime" type="datetime" :readonly="startTimeReadonly" :disabled="startTimeReadonly" placeholder="开始时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align: center;">&nbsp;-&nbsp;</el-col>
          <el-col :span="11">
            <el-form-item prop="endTime">
              <el-date-picker v-model="banner.endTime" type="datetime" placeholder="结束时间" @change="endTimeChange"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <dict-select dictTypeId="BANNER_TYPE" clearable v-model="banner.type" key="banner.type" placeholder="请选择BANNER类型"></dict-select>
        </el-form-item>
        <el-form-item label="链接类型" prop="urlType">
          <dict-select dictTypeId="BANNER_URL_TYPE" clearable v-model="banner.urlType" key="banner.urlType" @change="onUrlTypeChanged" placeholder="请选择连接跳转类型"></dict-select>
        </el-form-item>
        <el-form-item label="跳转页面URL" v-if="webUrlShow" prop="webUrl">
          <el-input v-model="banner.webUrl" placeholder="请填入跳转页面URL，不跳转请填入#" :maxlength="250" clearable></el-input>
        </el-form-item>
        <el-form-item label="跳转页面标题" v-if="webUrlShow" prop="webTitle">
          <el-input v-model="banner.webTitle" placeholder="请填入跳转页面标题，不超过20个字" :maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="跳转页面描述" v-if="webUrlShow" prop="webDesc">
          <el-input v-model="banner.webDesc" placeholder="请填入跳转页面描述，不超过100个字" :maxlength="100" clearable></el-input>
        </el-form-item>
        <el-form-item label="内部页面编码" prop="urlCode" v-if="urlCodeShow">
          <dict-select dictTypeId="PAGE_URL_CODE" clearable v-model="banner.urlCode" key="banner.urlCode" placeholder="页面编码"></dict-select>
        </el-form-item>
        <el-form-item label="内部跳转参数" prop="urlParam" v-if="urlCodeShow">
          <el-input v-model="banner.urlParam" placeholder="请填入内部跳转参数，填入摊位管理页面对应的ID" :maxlength="100" clearable></el-input>
        </el-form-item>
        <el-form-item label="展示图片" required>
          <img-upload-cloud :ref="'uploadCloud'" :id="'uploadCloud'" :sizeLimit="2097152" :countLimit="1" ext="jpg,png,jpeg,bmp"></img-upload-cloud>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">注意：建议图片尺寸大小750px*280px，大小不超过2M</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-40px;">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="editLoading">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看BANNER" :visible.sync="showBannerForm" :close-on-click-modal="false" :before-close="cancelShowDialog" :fullscreen="false" top="1%">
      <el-form :model="showBanner" ref="showBanner" label-width="110px" class="demo-ruleForm">
        <el-form-item label="编码" prop="code">
          <el-input v-model="showBanner.code" placeholder="系统自动生成" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="showBanner.title" :maxlength="50" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="position">
          <el-input-number v-model="showBanner.position" :disabled="true" :min="0" :max="9999"></el-input-number>
        </el-form-item>
        <el-form-item label="有效时间">
          <el-date-picker v-model="showBanner.time" type="datetimerange" align="right" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" :disabled="true"></el-date-picker>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <dict-select dictTypeId="BANNER_TYPE" clearable :disabled="true" key="showBanner.type" v-model="showBanner.type" placeholder="请选择BANNER类型"></dict-select>
        </el-form-item>
        <el-form-item label="链接类型" prop="urlType">
          <dict-select dictTypeId="BANNER_URL_TYPE" clearable :disabled="true" key="showBanner.urlType" v-model="showBanner.urlType" @change="onUrlTypeChanged" placeholder="请选择连接跳转类型"></dict-select>
        </el-form-item>
        <el-form-item label="跳转页面URL" v-if="webUrlShow" prop="webUrl">
          <el-input v-model="showBanner.webUrl" placeholder="请填入跳转页面URL" :disabled="true" :maxlength="250"></el-input>
        </el-form-item>
        <el-form-item label="跳转页面标题" v-if="webUrlShow" prop="webTitle">
          <el-input v-model="showBanner.webTitle" placeholder="请填入跳转页面标题，不超过20个字" :disabled="true" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="跳转页面描述" v-if="webUrlShow" prop="webDesc">
          <el-input v-model="showBanner.webDesc" placeholder="请填入跳转页面描述，不超过100个字" :disabled="true" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="内部页面编码" prop="urlCode" v-if="urlCodeShow">
          <dict-select dictTypeId="PAGE_URL_CODE" clearable v-model="showBanner.urlCode" key="showBanner.urlCode" :disabled="true" placeholder="页面编码"></dict-select>
        </el-form-item>
        <el-form-item label="内部跳转参数" prop="urlParam" v-if="urlCodeShow">
          <el-input v-model="showBanner.urlParam" placeholder="请填入内部跳转参数" :disabled="true" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="展示图片" required>
          <img :src="readUrl + showBanner.picUrl" :preview="showBanner.code" style="width:152px;height:152px;border-radius:5px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-40px;">
        <el-button @click.native="showBannerForm = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import util from '@/common/util'
  import DictSelect from "@/components/dictSelect/src/dict_select.vue"
  import ImgUploadCloud from '@/components/fileUpload/src/img_upload_cloud.vue'

  export default {
    components: {DictSelect,ImgUploadCloud},
    data(){
      var checkTime = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择开始日期'));
        } else {
          var startTime = value[0];
          var endTime = value[1];
          if(startTime < this.nowDate.getTime()){
            callback(new Error('开始日期不能小于当前时间'));
          }
          if( startTime >= endTime ){
            callback(new Error('结束日期不能等于开始时间'));
          }
          callback();
        }
      };
      return{
        filters: {
          time: '',
          status: '',
          type: '',
          title: ''
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        listLoading: false,
        readUrl: AppConfig.cloudReadUrl,
        pageNum: 1,
        pageSize: 10,
        total: 0,
        start: 1,
        orderBy: 'position asc, create_time desc',
        bannerList: [],
        editLoading: false,
        bannerForm: false,
        banner: {
          id: '',
          code: '',
          title: '',
          type: '',
          startTime: '',
          endTime: '',
          time: '',
          picUrl: '',
          urlType: '',
          webUrl: '',
          webTitle: '',
          webDesc: '',
          urlCode: '',
          urlParam: '',
          position: ''
        },
        bannerRules: {
          title: [
            {required: true,message: '请填写标题，不超过50个字', trigger: 'blur'}
          ],
          position: [
            { required: true, message: '请填写排列顺序1~9999', trigger: 'blur' }
          ],
          time: [
            { required: true, validator:checkTime }
          ],
          startTime: [
            { required: true, message: "请填写生效日期" }
          ],
          urlType: [
            { required: true,message: '请选择链接类型', trigger: 'change'}
          ], 
          webUrl: [
            {required: true,message: '请填写跳转页面URL', trigger: 'blur'}
          ],
          webTitle: [
            {required: true,message: '请填写跳转页面标题', trigger: 'blur'}
          ],
          urlCode: [
            { required: true,message: '请选择编码页面', trigger: 'change'}
          ], 
          urlParam: [
            {required: true,message: '请填写传递参数', trigger: 'blur'}
          ]
        },
        webUrlShow: false,
        urlCodeShow: false,
        nowDate: '', //当前时间
        title: '',
        selectRow: '',
        showBannerForm: false,
        showBanner:  {
          id: '',
          code: '',
          title: '',
          type: '',
          time: '',
          picUrl: '',
          urlType: '',
          webUrl: '',
          webTitle: '',
          webDesc: '',
          urlCode: '',
          urlParam: '',
          position: ''
        },
        fileObject: {
          uid: "",
          name: "",
          ext: "",
          type: "",
          status: "",
          percentage: 0,
          url: ""
        },
        showTime: false,
        showSplitTime: false,
        startTimeReadonly: false
      }
    },
    methods: {
      handleAdd: function(){
        //清楚页面原有数据
        this.banner = {
          id: '',
          code: '',
          title: '',
          type: 'activity',
          startTime: '',
          endTime: '',
          time: '',
          picUrl: '',
          urlType: '',
          webUrl: '',
          webTitle: '',
          webDesc: '',
          urlCode: '',
          urlParam: '',
          position: 1
        };
        this.bannerForm = true;
        this.webUrlShow = false;
        this.urlCodeShow = false;
        this.title = "新增BANNER";
        this.showTime = true;
        this.showSplitTime = false;
      },
      addSubmit: function(){
        this.$refs.banner.validate((valid) => {
          if (valid) {
            this.$confirm('确定保存吗？', '提示', {
              callback: function (action, instance) {
                if (action === 'confirm') {
                  this.editLoading = true;
                  let para = {banner: Object.assign({}, this.banner),opType: ''};
                  if(this.banner.id == "" || this.banner.id == null){
                    //校验开始时间和结束时间：开始时间和结束时间均大于当前时间，结束时间大于开始时间
                    var date = new Date();
                    if(this.banner.time[0] < date.getTime()){
                      this.$message({
                        message: '开始日期不能小于当前时间!',
                        type: 'error',
                        duration: 3000
                      });
                      this.editLoading = false;
                      return;
                    }
                    para.opType = "add";
                    // 时间转换
                    para.banner.startTime = new Date(this.banner.time[0]);
                    para.banner.endTime = new Date(this.banner.time[1]);
                  }else{
                    para.opType = "edit";
                    if( this.banner.startTime == null || this.banner.startTime == '' || this.banner.endTime == null || this.banner.endTime == '' ){
                      this.$message({
                        message: '请选择生效日期!',
                        type: 'error',
                        duration: 3000
                      });
                      this.editLoading = false;
                      return;
                    }
                    para.banner.startTime = this.banner.startTime;
                    para.banner.endTime = this.banner.endTime;
                  }
                  //获取图片信息
                  var fileList = this.$refs.uploadCloud.getFileList();
                  if( fileList.length == 0 ){
                    this.$message({
                      message: '请上传BANNER图片!',
                      type: 'error',
                      duration: 3000
                    });
                    this.editLoading = false;
                    return;
                  }
                  para.banner.picUrl = fileList[0].url;
                  baseAjax({
                    url: api.common_banner.banner_save,
                    data: JSON.stringify(para),
                    success: function (data) {
                      this.editLoading = false;
                      if(data.isSuccess == true){
                        this.$message({
                          message: '保存成功',
                          type: 'success',
                          duration: 3000
                        });
                        this.bannerForm = false;
                        //清空文件上传组件
                        this.$refs.uploadCloud.removeAllFile();
                        this.getBannerList();
                      }else{
                        this.$message({
                          message: data.responseMsg,
                          type: 'error',
                          duration: 3000
                        });
                      }
                    }.bind(this)
                  });
                  this.editLoading = false;
                }
              }.bind(this)
            })
          }else{
            this.$message({
              message: '页面有未完善字段，请检查!',
              type: 'error',
              duration: 3000
            });
          }
        });
      },
      cancelDialog: function(){
        this.$confirm('现在取消会放弃当前编写内容确认取消吗？', '提示', {}).then(() => {
          this.banner = {
            id: '',
            code: '',
            title: '',
            type: '',
            startTime: '',
            endTime: '',
            time: '',
            picUrl: '',
            urlType: '',
            webUrl: '',
            webTitle: '',
            webDesc: '',
            urlCode: '',
            urlParam: '',
            position: 1
          };
          this.bannerForm = false;
          this.$refs['banner'].resetFields();
          //清空文件上传组件
          this.$refs.uploadCloud.removeAllFile();
          this.getBannerList();
        })
      },
      cancelShowDialog: function(){
        this.banner = {
          id: '',
          code: '',
          title: '',
          type: '',
          startTime: '',
          endTime: '',
          time: '',
          picUrl: '',
          urlType: '',
          webUrl: '',
          webTitle: '',
          webDesc: '',
          urlCode: '',
          urlParam: '',
          position: 1
        };
        this.showBannerForm = false;
        this.getBannerList();
      },
      handleEdit: function(){
        if( this.selectRow == '' || this.selectRow == null ){
          this.$message({
            message: '请选择要编辑的BANNER信息!',
            type: 'warning',
            duration: 3000
          });
        }else{
          if( this.selectRow.status == 'closed' ){
            this.$message({
              message: 'BANNER已关闭，不允许编辑!',
              type: 'warning',
              duration: 3000
            });
          }else{
            this.title = '编辑BANNER';
            this.bannerForm = true;
            this.startTimeReadonly = false;
            let para = {id: this.selectRow.id};
            baseAjax({
              url: api.common_banner.banner_show,
              data: JSON.stringify(para),
              success: function (data) {
                this.editLoading = false;
                if(data.isSuccess == true){
                  this.showTime = false;
                  this.showSplitTime = true;
                  this.banner.id = data.data.id;
                  this.banner.code = data.data.code;
                  this.banner.title = data.data.title;
                  this.banner.time = [data.data.startTime,data.data.endTime];
                  this.banner.startTime = new Date(data.data.startTime);
                  this.banner.endTime = new Date(data.data.endTime);
                  var nowTime = new Date();
                  if( data.data.startTime < nowTime.getTime() ){
                    this.startTimeReadonly = true;
                  }
                  this.banner.type = data.data.type;
                  this.banner.urlType = data.data.urlType;
                  this.onUrlTypeChanged(data.data.urlType);
                  this.banner.webUrl = data.data.webUrl;
                  this.banner.webTitle = data.data.webTitle;
                  this.banner.webDesc = data.data.webDesc;
                  this.banner.urlCode = data.data.urlCode;
                  this.banner.urlParam = data.data.urlParam;
                  this.banner.position = data.data.position;
                  this.fileObject.url = data.data.picUrl;
                  this.fileObject.status = 'success';
                  this.$refs.uploadCloud.setFileList([this.fileObject]);
                }else{
                  this.$message({
                    message: data.responseMsg,
                    type: 'error',
                    duration: 3000
                  });
                }
              }.bind(this)
            });
          }
        }
      },
      handleClose: function(){
        if( this.selectRow == '' || this.selectRow == null ){
          this.$message({
            message: '请选择要关闭的BANNER信息!',
            type: 'warning',
            duration: 3000
          });
        }else{
          if( this.selectRow.status == 'closed' ){
            this.$message({
              message: '已关闭的广告不允许重复关闭!',
              type: 'warning',
              duration: 3000
            });
          }else{
            this.$confirm('确认关闭选中的BANNER信息？', '提示', {
              type: 'warning',
              callback: function (action, instance) {
                if (action === 'confirm') {
                  let para = {id: this.selectRow.id};
                  baseAjax({
                    url: api.common_banner.banner_close,
                    data: JSON.stringify(para),
                    success: function(data){
                      if(data.isSuccess == true){
                        this.$message({
                          message: '关闭成功!',
                          type: 'success',
                          duration: 3000
                        });
                      }else{
                        this.$message({
                          message: data.responseMsg,
                          type: 'error',
                          duration: 3000
                        });
                      }
                      this.getBannerList();
                    }.bind(this)
                  })
                }
              }.bind(this)
            })
          }
        }
      },
      handleShow: function(){
        if( this.selectRow == '' || this.selectRow == null ){
          this.$message({
            message: '请选择要查看的BANNER信息!',
            type: 'warning',
            duration: 3000
          });
        }else{
          this.showBannerForm = true;
          this.showBanner.id = this.selectRow.id;
          this.showBanner.code = this.selectRow.code;
          this.showBanner.title = this.selectRow.title;
          this.showBanner.time = [this.selectRow.startTime,this.selectRow.endTime];
          this.showBanner.type = this.selectRow.type;
          this.showBanner.urlType = this.selectRow.urlType;
          this.onUrlTypeChanged(this.selectRow.urlType);
          this.showBanner.webUrl = this.selectRow.webUrl;
          this.showBanner.webTitle = this.selectRow.webTitle;
          this.showBanner.webDesc = this.selectRow.webDesc;
          this.showBanner.urlCode = this.selectRow.urlCode;
          this.showBanner.urlParam = this.selectRow.urlParam;
          this.showBanner.position = this.selectRow.position;
          this.showBanner.picUrl = this.selectRow.picUrl;
        }
      },
      onUrlTypeChanged: function(value){
        if( value == null || value == ""){
          this.webUrlShow = false;
          this.urlCodeShow = false;
        }else if( value == "url" ){
          this.webUrlShow = true;
          this.urlCodeShow = false;
          this.banner.urlCode = '';
          this.banner.urlParam = '';
        }else if( value == "code" ){
          this.webUrlShow = false;
          this.urlCodeShow = true;
          this.banner.webUrl = '';
          this.banner.webTitle = '';
          this.banner.webDesc = '';
        }
      },
      //查询列表
      getBannerList: function(){
        this.bannerList = [];
        this.listLoading = true;
        var page = new Object();
        page.pageNum = this.pageNum;
        page.pageSize = this.pageSize;
        page.orderBy = this.orderBy;
        var banner = new Object();
        banner.status = this.filters.status;
        banner.type = this.filters.type;
        banner.title = this.filters.title;
        if(this.filters.time != "" && this.filters.time != null ){
          banner.startTime = this.filters.time[0];
          banner.endTime = this.filters.time[1];
        }
        let para = {
          page: page,
          banner: banner
        }
        baseAjax({
          url: api.common_banner.banner_list,
          data: JSON.stringify(para),
          type: 'POST',
          success: function (data) {
            this.bannerList = data.list;
            this.total = Number(data.total);
            this.listLoading = false;
          }.bind(this),
          error: function(){
            this.listLoading = false;
          }.bind(this)
        });
      },
      //表格每页显示数据量变更
      handleSizeChange(val) {
        this.pagesize = val;
        this.getBannerList();
      },
      handleCurrentChange(val) {
        this.pageNum= val;
        this.getBannerList();
      },
      handleSelectChange: function(val){
        this.selectRow = val;
      },
      resetFields: function(){
        this.filters = {
          status: '',
          time: '',
          type: '',
          title : ''
        }
      },
      //日期格式化
      formatDate: function (row, column) {
        if (column.property == "startTime") {
          var date = new Date();
          date.setTime(row.startTime);
          return util.formatDate.format(date, "yyyy-MM-dd hh:mm:ss");
        } else if (column.property == "endTime") {
          var date = new Date();
          date.setTime(row.endTime);
          return util.formatDate.format(date, "yyyy-MM-dd hh:mm:ss");
        }
      },
      //状态格式化
      formatEnabled: function (row, column) {
        if (column.property == "status") {
          if (row.status == "notbegin") {
            return "未生效";
          } else if (row.status == "going") {
            return "已生效";
          } else if (row.status == "closed") {
            return "已关闭";
          }
        }
      },
      //当结束时间发生变化时
      endTimeChange: function(val){
        var sTime = this.banner.startTime;
        if( sTime == null || sTime == '' ){
          this.$message({
            message: '请先选择开始时间!',
            type: 'error',
            duration: 3000
          });
          this.banner.endTime = '';
          return;
        }else if( val <= sTime ){
          this.$message({
            message: '结束时间不能小于等于开始时间!',
            type: 'error',
            duration: 3000
          });
          this.banner.endTime = '';
          return;
        }
      }
    },
    mounted() {
      this.nowDate = new Date();
      this.getBannerList();
    }
  }
</script>
<style scoped>
  .sub-title{
    color: red;
    font-size: 14px;
    line-height: 18px;
  }
</style>
