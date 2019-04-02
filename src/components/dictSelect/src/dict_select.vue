<template>
  <div>
    <el-select :placeholder="placeholder" :value="value" :clearable="clearable" :disabled="disabled" @input="change($event)"
      @change="handleChange">
      <el-option v-for="item in itemList" :key="item.dictId" :value="item.dictId" :label="item.dictName"></el-option>
    </el-select>
  </div>
</template>
<script>
  export default{
    name: 'dict_select',
    props: {
      clearable: {
        type: Boolean,
        default: function(){
          return true;
        }
      },
      disabled: {
        type: Boolean,
        default: function(){
          return false;
        }
      },
      dictTypeId: {
        type: String,
        default: function(){
          return '';
        }
      },
      placeholder:{
        type: String,
        default: function(){
          return '请选择';
        }
      },
      value: {
        type: String,
        default: function(){
          return '';
        }
      }
    },
    data(){
      return{
        itemList: [],
        item: {
          dictId: '',
          dictName: ''
        }
      }
    },
    mounted() {
      if( this.dictTypeId != '' ) {
        if( sessionStorage.getItem(AppConfig.APP_NAME+'_dict_'+this.dictTypeId) == null ){
          let para1 = {dictTypeId: this.dictTypeId};
          baseAjax({
            url: api.sys_common.dict_load,
            data: JSON.stringify(para1),
            success: function (data) {
              this.itemList = data;
              sessionStorage.setItem(AppConfig.APP_NAME+'_dict_'+dictTypeId, JSON.stringify(this.itemList));
            }.bind(this)
          });
        }else{
          this.itemList = JSON.parse(sessionStorage.getItem(AppConfig.APP_NAME+'_dict_'+this.dictTypeId));  
        }
      }
    },
    methods:{
      change: function(val){
        this.$emit('input', val);
      },
      handleChange(val) {
        this.$emit('change', val);
      }
    }
  }

</script>
