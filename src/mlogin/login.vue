<template>
  <h1>登录ZMindMap</h1>
  <Form @submit="onSubmit">
    <CellGroup inset>
      <Field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <Field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
    </CellGroup>
    <div style="margin: 16px;">
      <Button round block type="primary" native-type="submit">
        提交
      </Button>
    </div>
  </Form>
</template>
<script setup>
import { Form, Field, CellGroup, Button } from 'vant'

</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
