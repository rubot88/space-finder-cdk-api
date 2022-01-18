import { App } from "aws-cdk-lib";
import { SpaceStack } from "./SpaceStack";

const app = new App();
new SpaceStack(app, "Space-finder", {
  env: { region: "eu-central-1" },
  stackName: "SpaceFinder",
});
