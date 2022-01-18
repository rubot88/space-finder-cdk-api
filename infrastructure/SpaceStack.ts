import { Stack, StackProps, Resource } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { join } from "path";
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";

export class SpaceStack extends Stack {
  private api = new RestApi(this, "SpaceApi");

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const helloLambda = new LambdaFunction(this, "hello-lambda", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(join(__dirname, "..", "services", "common")),
      handler: "handler.main",
    });

    // Api lambda integration
    const helloLambdaIntegration = new LambdaIntegration(helloLambda);
    const helloLambdaResource = this.api.root.addResource("hello");
    helloLambdaResource.addMethod("GET", helloLambdaIntegration);
  }
}
