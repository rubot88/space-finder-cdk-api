import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";

const TABLE_NAME = process.env.TABLE_NAME!;
const dbClient = new DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent,
  ctx: Context
): Promise<APIGatewayProxyResult> => {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(true),
  };

  const { body } = event;

  const item = typeof body === "object" ? event.body : JSON.parse(body);
  item.spaceId = v4();

  try {
    await dbClient
      .put({
        TableName: TABLE_NAME,
        Item: item,
      })
      .promise();
    result.body = JSON.stringify(item);
  } catch (error: any) {
    result.statusCode = 500;
    result.body = error.message;
  }

  return result;
};
