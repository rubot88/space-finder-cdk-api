import { handler } from "../Read";

handler({} as any, {} as any).then((apiResult) => {
  const result = JSON.parse(apiResult.body);
  console.log("Read result===>", result);
});
