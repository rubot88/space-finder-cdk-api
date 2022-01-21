import { Space } from "./Model";

export class MissingError extends Error {}

export const validatorAsSpaceEntry = (arg: any) => {
  if (!(arg as Space).name) {
    throw new MissingError("Name field is required");
  }
  if (!(arg as Space).location) {
    throw new MissingError("Location field is required");
  }
  if (!(arg as Space).spaceId) {
    throw new MissingError("SpaceId field is required");
  }
};
