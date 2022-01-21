import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";

import { MissingError, validatorAsSpaceEntry } from "../Shared/InputValidator";
import { getEventBody } from "../Shared/Utils";

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

  try {
    const item = getEventBody(event);
    item.spaceId = v4();
    validatorAsSpaceEntry(item);
    await dbClient
      .put({
        TableName: TABLE_NAME,
        Item: item,
      })
      .promise();
    result.body = JSON.stringify(item);
  } catch (error: any) {
    if (error instanceof MissingError) {
      result.statusCode = 403;
    }
    result.statusCode = 500;
    result.body = error.message;
  }
  return result;
};
