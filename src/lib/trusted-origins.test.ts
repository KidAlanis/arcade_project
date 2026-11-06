import {test} from "node:test";
import assert from "node:assert/strict";
import {trustedOrigins} from "./trusted-origins";
test("trust only explicitly configured website origins",()=>{
 const origins=trustedOrigins({BETTER_AUTH_URL:"https://arcade.example",BETTER_AUTH_TRUSTED_ORIGINS:"https://other.example, https://arcade.example/, https://*.example/path, https://*.example, https://user:password@private.example,garbage"});
 assert.deepEqual(origins,["https://arcade.example","https://other.example"]);
 assert.ok(!origins.includes("https://attacker.example"));
 assert.deepEqual(trustedOrigins({}),[]);
});

import { readMutation } from "./server/http";
test("ticket API accepts either configured alias and rejects a foreign origin", async () => {
 const oldURL=process.env.BETTER_AUTH_URL;
 const oldOrigins=process.env.BETTER_AUTH_TRUSTED_ORIGINS;
 process.env.BETTER_AUTH_URL="https://primary.example";
 process.env.BETTER_AUTH_TRUSTED_ORIGINS="https://secondary.example";
 const request=(origin:string)=>new Request("https://secondary.example/api/player/games",{method:"POST",headers:{origin,"content-type":"application/json"},body:JSON.stringify({action:"start"})});
 try {
  for(const origin of ["https://primary.example","https://secondary.example"])assert.deepEqual(await readMutation(request(origin)),{action:"start"});
  await assert.rejects(()=>readMutation(request("https://foreign.example")),{code:"INVALID_ORIGIN",status:403});
 } finally {
  if(oldURL===undefined)delete process.env.BETTER_AUTH_URL;else process.env.BETTER_AUTH_URL=oldURL;
  if(oldOrigins===undefined)delete process.env.BETTER_AUTH_TRUSTED_ORIGINS;else process.env.BETTER_AUTH_TRUSTED_ORIGINS=oldOrigins;
 }
});
