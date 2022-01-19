import { Stack } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { join } from "path";
import { StringUrlWithLength } from "aws-sdk/clients/lexruntime";
import { LayerVersion } from "aws-cdk-lib/aws-lambda";

export interface TableProps {
  tableName: string;
  primaryKey: string;
  paths: {
    [key in keyof Lambdas]: StringUrlWithLength;
  };
  externalModules: string[];
}

interface Lambdas {
  createLambda?: NodejsFunction;
  readLambda?: NodejsFunction;
  updateLambda?: NodejsFunction;
  deleteLambda?: NodejsFunction;
}

type LambdaIntegrations = {
  [key in keyof Lambdas]: LambdaIntegration;
};
export class GenericTable {
  private lambdas: Lambdas = {};
  private table: Table;

  public lambdaIntegrations: LambdaIntegrations = {};

  constructor(
    private readonly stack: Stack,
    private readonly props: TableProps
  ) {
    this.initialize();
  }

  public setLambdaLayers(layers: LayerVersion[]) {
    const lambdas: NodejsFunction[] = Object.values(this.lambdas);
    lambdas.forEach((lambda) => {
      lambda.addLayers(...layers);
    });
  }

  private initialize() {
    this.createTable();
    this.createLambdas();
    this.grandTableRights();
  }

  private createTable() {
    this.table = new Table(this.stack, this.props.tableName, {
      partitionKey: {
        name: this.props.primaryKey,
        type: AttributeType.STRING,
      },
      tableName: this.props.tableName,
    });
  }

  private createLambdas() {
    const paths = Object.entries(this.props.paths);
    paths.forEach(([key, lambdaPath]) => {
      const method = key as keyof Lambdas;
      const handler = this.createSingleLambda(lambdaPath);
      this.lambdas[method] = handler;
      this.lambdaIntegrations[method] = new LambdaIntegration(handler);
    });
  }

  private createSingleLambda(lambdaName: string): NodejsFunction {
    const tableName = this.props.tableName;
    const lambdaId = `${tableName}-${lambdaName}`;
    return new NodejsFunction(this.stack, lambdaId, {
      entry: join(__dirname, "..", "services", tableName, `${lambdaName}.ts`),
      handler: "handler",
      functionName: lambdaId,
      environment: {
        TABLE_NAME: tableName,
        PRIMARY_KEY: this.props.primaryKey,
      },
      bundling: {
        keepNames: true,
        externalModules: ["uuid", "aws-sdk"],
      },
    });
  }

  private grandTableRights() {
    const lambdas: NodejsFunction[] = Object.values(this.lambdas);
    lambdas.forEach((lambda) => {
      this.table.grantReadWriteData(lambda);
    });
  }
}
