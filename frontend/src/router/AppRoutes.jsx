/**
 * React Router 配置 - 带布局版本
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';

// 页面组件
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import CourseList from '../pages/CourseList';
import CourseDetail from '../pages/CourseDetail';
import WorkList from '../pages/WorkList';
import WorkEditor from '../pages/WorkEditor';

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
        
        {/* 默认重定向 */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
