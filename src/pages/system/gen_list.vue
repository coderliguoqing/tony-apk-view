<template>

  <div>

    <el-row :gutter="20">
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.tableName" placeholder="表名"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="search" v-on:click="getTableList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="close" v-on:click="resetForm">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="plus" @click="openCodeGenInfoForm">生成代码</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24" class="toolbar" style="padding-top: 0px">
        <div class="grid-content bg-purple">
          <!--列表-->
          <el-table ref="multipleTable" :data="tableList" highlight-current-row v-loading="listLoading" fit style="width: 100%;" @selection-change="tableChange" @row-click="handleCurrentChange">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="tableName" label="表名" sortable>
            </el-table-column>
            <el-table-column prop="engine" label="Engine">
            </el-table-column>
            <el-table-column prop="tableComment" label="表备注">
            </el-table-column>
            <el-table-column prop="createTime" label="创建日期"  sortable>
            </el-table-column>
            <!--<el-table-column label="操作" width="90">-->
              <!--<template scope="scope">-->
                <!--<el-button type="warning"  icon="edit" @click="handleGen(scope.$index, scope.row)">生成代码-->
                <!--</el-button>-->
              <!--</template>-->
            <!--</el-table-column>-->
          </el-table>
        </div>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
      </el-col>
    </el-row>

    <el-dialog title="代码生成信息"  :visible.sync="codeGenInfoForm">
      <el-form :model="codeGenForm" :rules="codeGenRules" ref="codeGenForm">
        <el-form-item label="包名(package)" :label-width="formLabelWidth"  prop="package" >
          <el-input v-model="codeGenForm.package" auto-complete="on" placeholder="cn.com.bluemoon.platform.admin" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="作者(author)" :label-width="formLabelWidth" prop="author">
          <el-input v-model="codeGenForm.author" auto-complete="on" placeholder="name" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="邮箱(email)" :label-width="formLabelWidth" prop="email" >
          <el-input v-model="codeGenForm.email" auto-complete="on" placeholder="name@bluemoon.com.cn" :maxlength="100"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="codeGenInfoForm = false">取 消</el-button>
        <el-button type="primary" @click.native="codeGenSubmitType">生 成</el-button>
      </div>

    </el-dialog>

  </div>


</template>



<script>
  import util from '@/common/util'
  import AppConfig from '@/config'
  export default {
    data(){
      return {
        tables: [],//选中的值显示
        filters: {
          tableName: ''
        },
        tableList: [],
        start: 1,
        total: 0,
        pageNum: 1,
        pagesize: 10,
        listLoading: false,
        codeGenInfoForm: false,
        codeGenForm: {
          package:'',
          author:'',
          email:''
        },
        formLabelWidth: '120px',
        codeGenRules: {
          package:[
            {required: true, message: '请输入包名', trigger: 'blur' },
            { min: 10, max: 100, message: '长度在 10 到 100 个字符', trigger: 'blur' }
          ],
          author:[
            {required: true, message: '请输入作者', trigger: 'blur' }
          ],
          email:[
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
          ],
        }
      }
    },


    methods: {
      openCodeGenInfoForm: function () {

        var tables = this.tables.map(item => item.tableName).join()//获取所有选中行的tableName组成的字符串，以逗号分隔
        if(tables == ""){
          this.$message({
            showClose: true,
            message: '请选择需要生成的库表!',
            type: 'warning'
          });
          return;
        }

        //打开生成代码输入信息
        this.codeGenInfoForm=true;
      },

      //表格每页显示数据量变更
      handleSizeChange(val) {
        this.pagesize = val;
        this.getTableList();
      },
      handleCurrentPageChange(val) {
        this.pageNum= val;
        this.getTableList();
      },
      getTableList() {
        var page = new Object();
        page.pageNum = this.pageNum;
        page.pageSize = this.pagesize;
        var table = new Object();
        table.tableName = this.filters.tableName;
        let para = {
          page: page,
          table:table
        };
        this.listLoading = true;
        baseAjax({
          url: api.sys_gen_code.table_list,
          data: JSON.stringify(para),
          type: 'POST',
          success: function (data) {
            this.tableList = data.list;
            this.total = Number(data.total);
            this.listLoading = false;
          }.bind(this)
        });
        this.listLoading = false;
      },

      tableChange(table) {
        this.tables = table
      },

      handleCurrentChange(row, event, column) {
        this.$refs.multipleTable.toggleRowSelection(row)
      },


      //生成代码
      codeGenSubmitType: function () {

        var tables = this.tables.map(item => item.tableName).join() //获取所有选中行的tableName组成的字符串，以逗号分隔

        this.$refs.codeGenForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认生成库表代码吗?', '提示', {
            }).then(() => {
              var repackage=this.codeGenForm.package
              var author=this.codeGenForm.author
              var email=this.codeGenForm.email
//              alert("&package="+repackage+"&author="+author+"&email="+email);
              let BASE_PATH = AppConfig.BASE_PATH;

              window.location.href = BASE_PATH+api.sys_gen_code.gen_code+"?tables="+tables+"&package="+repackage+"&author="+author+"&email="+email;
              this.codeGenInfoForm=false;
            }).catch(() => {

            });
          }
        });
      },

      //重置查询
      resetForm(){
        this.filters = {
          code: '',
          name: ''
        }
      },
    },
    mounted() {
      this.getTableList();
    }
  }

</script>
