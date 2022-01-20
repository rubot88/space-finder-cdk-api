import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME!;
const PRIMARY_KEY = process.env.PRIMARY_KEY!;

const dbClient = new DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent,
  ctx: Context
): Promise<APIGatewayProxyResult> => {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(true),
  };

  const keyValue = event?.queryStringParameters?.[PRIMARY_KEY];
  try {
    if (keyValue) {
      const queryResponse = await dbClient
        .get({
          TableName: TABLE_NAME,
          Key: {
            [PRIMARY_KEY]: keyValue,
          },
        })
        .promise();
      result.body = JSON.stringify(queryResponse.Item);
    } else {
      const queryResponse = await dbClient
        .scan({
          TableName: TABLE_NAME,
        })
        .promise();
      result.body = JSON.stringify(queryResponse.Items);
    }
  } catch (error: any) {
    result.statusCode = 500;
    result.body = error.message;
  }

  return result;
};
