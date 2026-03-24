import React from 'react'
import AppRoutes from './router/AppRoutes'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { theme } from './utils/theme'

function App() {
  return (
    <ConfigProvider theme={theme} locale={zhCN}>
      <AppRoutes />
    </ConfigProvider>
  )
}

export default App
