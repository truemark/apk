/**
 * @group integration
 */

import {ParameterStore} from "../../src";
import * as crypto from "crypto";

async function sleep(ms): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function makeId(): string {
  return crypto.randomBytes(10).toString("hex");
}

test("Happy Path", async () => {
  const store = new ParameterStore();
  const path = `/apk/ParameterStore${makeId()}/HappyPath`;
  console.debug(`Using base path ${path}`);
  try {
    let version = await store.writeString(
      `${path}/TestString`, "This is a regular string!");
    expect(version).toBe(1);
    version = await store.writeSecureString(
      `${path}/TestSecureString`, "This is a secure string!");
    expect(version).toBe(1);
    version = await store.writeStringList(
      `${path}/TestStringList`, "This is a string list!".split(" "));
    expect(version).toBe(1);

    let value = await store.readValue(`${path}/TestString`);
    expect(value).toBe("This is a regular string!");
    value = await store.readValue(`${path}/TestSecureString`);
    expect(value).toBe("This is a secure string!");
    value = await store.readValue(`${path}/TestStringList`);
    expect(value).toBe("This,is,a,string,list!");

    let map = await store.readValuesMap(path);
    expect(map["TestString"]).toBe("This is a regular string!");
    expect(map["TestSecureString"]).toBe("This is a secure string!");
    expect(map["TestStringList"]).toBe("This,is,a,string,list!");

    let record = await store.readValuesRecord(path);
    expect(record["TestString"]).toBe("This is a regular string!");
    expect(record["TestSecureString"]).toBe("This is a secure string!");
    expect(record["TestStringList"]).toBe("This,is,a,string,list!");

  } finally {
    for (let key in await store.readValuesMap(path, false)) {
      await store.remove(key);
    }
  }
});
