import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import * as uuid from "uuid";

import { S3 } from "aws-sdk";

const s3Client = new S3();

export const main = async (
  event?: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  console.log("event", event);
  const buckets = await s3Client.listBuckets().promise();
  const responseBody = {
    message: "Hello from lambda!",
    id: uuid.v4(),
    buckets,
  };
  return {
    statusCode: 200,
    body: JSON.stringify(responseBody),
  };
};
