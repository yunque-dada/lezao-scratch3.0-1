/**
 * React Router 配置
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* 公开路由 */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* 受保护路由 */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/courses" 
          element={
            <ProtectedRoute>
              <CourseList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/courses/:id" 
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/works" 
          element={
            <ProtectedRoute>
              <WorkList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/works/:id" 
          element={
            <ProtectedRoute>
              <WorkEditor />
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
