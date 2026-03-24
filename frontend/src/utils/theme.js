/**
 * Ant Design 主题配置
 */
export const theme = {
  token: {
    // 颜色配置
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    
    // 布局配置
    borderRadius: 6,
    fontSize: 14,
    
    // 间距配置
    margin: 16,
    padding: 16,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#001529',
      bodyBg: '#f0f2f5',
    },
    Menu: {
      darkItemBg: '#001529',
      darkSubMenuItemBg: '#000c17',
    },
    Button: {
      borderRadius: 6,
    },
    Card: {
      borderRadius: 8,
    }
  }
};
