interface HttpStatusObjectModel {
  code: number;
  status: string;
}
type httpStatusModelKeys =
  | "OK"
  | "CREATED"
  | "NO_CONTENT"
  | "BAD_REQUEST"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "UNAUTHORAIZED"
  | "INTERNAL_SERVER_ERROR";
type httpStatusModel = Record<httpStatusModelKeys, HttpStatusObjectModel>;

export default httpStatusModel;
