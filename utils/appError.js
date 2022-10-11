class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // built-in Error has message;

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); // (currectObject,AppError class itself), when a new object's created and a constructor is called, it won't appear in the stackTrace (wich shows where the error happend, err.stack)
  }
}

module.exports = AppError;
