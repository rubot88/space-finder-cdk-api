import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

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

  try {
    const queryResponse = await dbClient
      .scan({
        TableName: TABLE_NAME,
      })
      .promise();
    result.body = JSON.stringify(queryResponse.Items);
  } catch (error: any) {
    result.statusCode = 500;
    result.body = error.message;
  }

  return result;
};
