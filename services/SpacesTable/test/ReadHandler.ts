import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../Read";

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    spaceId: "2f49fd66-823f-4b65-9f5a-f67f5ec6710a",
  },
} as any;

handler(event, {} as any).then((apiResult) => {
  const result = JSON.parse(apiResult.body);
  console.log("Read result===>", result);
});
