import { Stack, StackProps, Resource } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { join } from "path";
import {
  Code,
  Function as LambdaFunction,
  LayerVersion,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { GenericTable } from "./GenericTable";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";

export class SpaceStack extends Stack {
  private api = new RestApi(this, "SpaceApi");
  private spacesTable = new GenericTable("SpacesTable", "spaceId", this);

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const modulesLayer = new LayerVersion(this, "spaceApi-deps", {
      compatibleRuntimes: [Runtime.NODEJS_12_X, Runtime.NODEJS_14_X],
      code: Code.fromAsset("layers"),
      description: "Use node_modules for app",
    });

    const helloLambda = new NodejsFunction(this, "hello-lambda", {
      runtime: Runtime.NODEJS_14_X,
      entry: join(__dirname, "..", "services", "common", "handler.ts"),
      handler: "main",
      bundling: {
        keepNames: true,
        externalModules: ["uuid", "aws-sdk"],
      },
      layers: [modulesLayer],
    });

    // 👇 create a policy statement
    const s3ListBucketsPolicy = new PolicyStatement({
      actions: ["s3:ListAllMyBuckets"],
      resources: ["arn:aws:s3:::*"],
    });

    // 👇 add the policy to the Function's role
    helloLambda.role?.attachInlinePolicy(
      new Policy(this, "list-buckets-policy", {
        statements: [s3ListBucketsPolicy],
      })
    );

    // Api lambda integration
    const helloLambdaIntegration = new LambdaIntegration(helloLambda);
    const helloLambdaResource = this.api.root.addResource("hello");
    helloLambdaResource.addMethod("GET", helloLambdaIntegration);
  }
}
