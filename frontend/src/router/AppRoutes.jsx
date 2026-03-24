/**
 * React Router 配置 - 懒加载版本
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';
import AppLayout from '../components/AppLayout';

// 懒加载页面组件
const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const CourseList = lazy(() => import('../pages/CourseList'));
const CourseDetail = lazy(() => import('../pages/CourseDetail'));
const WorkList = lazy(() => import('../pages/WorkList'));
const WorkEditor = lazy(() => import('../pages/WorkEditor'));
const UserManagement = lazy(() => import('../pages/UserManagement'));

// 加载中组件
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '400px' 
  }}>
    <Spin size="large" />
  </div>
);

// 路由守卫组件
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// 公开路由（已登录则跳转dashboard）
const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// 带布局的页面组件
const LayoutWrapper = ({ children }) => (
  <AppLayout>{children}</AppLayout>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Routes>
          {/* 公开路由 - 无布局 */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          {/* 受保护路由 - 带布局 */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <Dashboard />
                </LayoutWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <CourseList />
                </LayoutWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/:id" 
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <CourseDetail />
                </LayoutWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/works" 
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <WorkList />
                </LayoutWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/works/:id" 
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <WorkEditor />
                </LayoutWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <UserManagement />
                </LayoutWrapper>
              </ProtectedRoute>
            } 
          />
          
          {/* 默认重定向 */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </Suspense>
  );
};

export default AppRoutes;
