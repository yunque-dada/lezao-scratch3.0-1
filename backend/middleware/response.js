/**
 * 统一响应格式中间件
 */
const apiResponse = (res, statusCode = 200, message = 'success', data = null) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data
  });
};

// 成功响应
const successResponse = (res, data = null, message = 'success') => {
  return apiResponse(res, 200, message, data);
};

// 错误响应
const errorResponse = (res, message = 'Error', statusCode = 500) => {
  return apiResponse(res, statusCode, message, null);
};

// 404响应
const notFoundResponse = (res, message = 'Resource not found') => {
  return apiResponse(res, 404, message, null);
};

// 401响应
const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return apiResponse(res, 401, message, null);
};

// 403响应
const forbiddenResponse = (res, message = 'Forbidden') => {
  return apiResponse(res, 403, message, null);
};

// 400响应
const badRequestResponse = (res, message = 'Bad request') => {
  return apiResponse(res, 400, message, null);
};

module.exports = {
  apiResponse,
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse
};
