module.exports = class HttpError extends Error {
  constructor(message, responseCode) {
    super(message || 'Response failed');
    this.code = responseCode || 400;
  }
}