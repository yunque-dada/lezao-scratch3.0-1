import React from 'react'
import AppRoutes from './router/AppRoutes'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AppRoutes />
    </ConfigProvider>
  )
}

export default App
