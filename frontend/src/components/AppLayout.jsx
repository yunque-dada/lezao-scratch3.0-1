/**
 * App布局组件
 * 包含Header、Sidebar、Content
 */
import React, { useState } from 'react';
import MainLayout from './MainLayout';

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <MainLayout collapsed={collapsed} onCollapse={setCollapsed}>
      {children}
    </MainLayout>
  );
};

export default AppLayout;
