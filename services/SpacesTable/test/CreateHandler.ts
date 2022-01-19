import { handler } from "../Create";

const event = {
  body: {
    location: "Kharkiv",
  },
};

handler(event as any, {} as any).then((apiResult) => {
  const result = JSON.parse(apiResult.body);
  console.log("Create result===>", result);
});
