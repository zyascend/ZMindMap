// 自定义验证规则
const validatePass = (rule, value, callback) => {
  // 密码只能由大小写英文字母或数字开头，且由大小写英文字母_.组成
  const reg = /^[A-Za-z0-9][A-Za-z0-9_.]{5,14}$/
  if (!value.match(reg)) {
    callback(new Error('密码由字母或数字开头，且只能为字母,数字,下划线及（.）'))
  } else {
    callback()
  }
}
const loginRules = {
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  pwd: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '密码位数只能在6~15之间', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ]
}

export default { loginRules }
