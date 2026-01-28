export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Something went wrong!';
  
  res.status(err.statusCode).json({
    status: 'error',
    message: err.message
  });
};
