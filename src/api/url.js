/**
 * Created by Guoqing on 2018-06-26
 * 用户管理项目所有与后端交互的接口的URL
 */
export default{
  //系统权限模块
  sys_auth: {
    //登录
    login: '/admin/auth/token',
    //退出
    logout: '/admin/auth/token',
    //获取用户菜单
    menu_nav: '/admin/auth/menu/nav',
    //获取整个菜单树
    menu_tree: '/admin/auth/menu/tree',
    //获取用户的菜单权限列表
    menu_list: '/admin/auth/menu/list',
    //编辑菜单
    menu_edit: '/admin/auth/menu/edit',
    //删除菜单
    menu_delete: '/admin/auth/menu/delete',
    //密码修改
    passowrd_edit: '/admin/auth/sys/password',
    //用户权限列表
    user_auth_list: '/admin/auth/user/authList',
    //编辑用户权限列表
    user_auth_edit: '/admin/auth/user/editAuthList',
    //获取用户列表
    user_list: '/admin/auth/user/list',
    //编辑用户信息
    user_edit: '/admin/auth/user/edit',
    //删除用户信息
    user_delete: '/admin/auth/user/',
    //更新用户密码
    user_update_password: '/admin/auth/user/editPassword',
    //修改密码
    password_edit: '/admin/auth/user/password',
    //获取SSO用户信息
    user_sso_info: '/admin/auth/user/getUserInfoBySso',
    //获取用户的所有权限
    user_all_rights: '/admin/auth/user/getUserAllRight'
  },
  //角色管理模块
  sys_role: {
    //获取角色列表
    role_list: '/admin/auth/role/list',
    //编辑角色
    role_edit: '/admin/auth/role/edit',
    //获取角色信息
    role_info: '/admin/auth/role/',
    //删除角色
    role_delete: '/admin/auth/role/'
  },
  //系统字典模块
  sys_dict: {
    //获取字典类型数据
    type_list: '/admin/sys/dict/type/list',
    //新增或者保存字典类型数据
    type_save: '/admin/sys/dict/type/save',
    //删除字典类型
    type_delete: '/admin/sys/dict/type/delete',
    //获取字典项数据
    entry_list: '/admin/sys/dict/entry/list',
    //新增或更新字典项数据
    entry_save: '/admin/sys/dict/entry/save',
    //删除字典项数据
    entry_delete: '/admin/sys/dict/entry/delete',
    //刷新业务字典缓存
    type_reload_cache: '/admin/sys/dict/type/reloadCache',
    //获取字典d中文值
    dict_text: '/admin/sys/dict/type/dictText',
  },
  //代码生成器模块 mij 20170628
  sys_gen_code: {
    //获取表名列表
    table_list: '/admin/sys/generator/list',
    //生成代码
    gen_code: '/admin/sys/generator/code'
  },
  sys_common: {
    //获取云盘上传的token
    createCloudUploadToken: '/admin/common/createCloudUploadToken',
    //加载业务字典
    dict_load: '/admin/common/getDict'
  }
  
}