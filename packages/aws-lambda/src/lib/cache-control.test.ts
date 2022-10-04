import {CacheControl} from "./cache-control";

test("CacheControl Test", () => {

  let cacheControl = new CacheControl()
    .maxAge(3600)
    .setPublic();
  expect(cacheControl.headerValue()).toEqual("max-age=3600,public");

  cacheControl = new CacheControl()
    .noCache().noStore();
  expect(cacheControl.headerValue()).toEqual("no-cache,no-store");

});
