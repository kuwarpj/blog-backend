class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something wnet wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;

    if (data !== null && data !== undefined) {
      this.data = data;
    }
  }
}



const  makenestedComments = (comments) =>{
  const map = {};
  const roots = [];

  comments.forEach((comment) => {
    map[comment._id] = { ...comment.toObject(), replies: [] };
  });

  comments.forEach((comment) => {
    if (comment.parentComment) {
      const parent = map[comment.parentComment._id];
      if (parent) {
        parent.replies.push(map[comment._id]);
      }
    } else {
      roots.push(map[comment._id]);
    }
  });

  return roots;
}

export { ApiError, ApiResponse, makenestedComments };
