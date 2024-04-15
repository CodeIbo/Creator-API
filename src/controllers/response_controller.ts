class ResponseController {
  readonly timeStamp: string;
  statusCode: number;
  httpStatus: string;
  message: string;
  data?: string;
  constructor(statusCode: number, httpStatus: string, message: string, data?: any) {
    this.timeStamp = new Date().toLocaleString();
    this.statusCode = statusCode;
    this.httpStatus = httpStatus;
    this.message = message;
    this.data = data;
  }
}

export default ResponseController;
