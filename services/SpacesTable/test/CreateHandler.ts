import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../Create";

const event: APIGatewayProxyEvent = {
  body: {
    location: "Kharkiv",
  },
} as any;

handler(event, {} as any).then((apiResult) => {
  const result = JSON.parse(apiResult.body);
  console.log("Create result===>", result);
});
