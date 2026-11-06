import {test} from "node:test";
import assert from "node:assert/strict";
import {parseGameTicketRequest,parseTicketClaim} from "./game-ticket-rules";
const runId="f57d18af-8a0d-4b72-bb9a-920c0fb95444";
test("paid rounds accept only supported games and valid request identities",()=>{
 for(const gameId of ["game-1","game-2","game-3","clawpop"])assert.ok(parseGameTicketRequest({action:"start",gameId,runId}));
 for(const input of [null,[],{action:"start",gameId:"unknown",runId},{action:"start",gameId:"game-1",runId:"invalid"}])assert.equal(parseGameTicketRequest(input),null);
});
test("round requests cannot choose ownership, costs, rewards or balances",()=>{
 for(const request of [{action:"start",gameId:"game-1",runId},{action:"finish",outcome:"win",runId}]){
  assert.ok(parseGameTicketRequest(request));
  for(const key of ["userId","amount","cost","reward","balance","score"])assert.equal(parseGameTicketRequest({...request,[key]:999}),null);
 }
 assert.equal(parseGameTicketRequest({action:"finish",runId,outcome:"jackpot"}),null);
});

test("free ticket claims reject client amounts, dates and other player identities",()=>{
 const request={kind:"daily",requestId:runId};
 assert.ok(parseTicketClaim(request));assert.ok(parseTicketClaim({...request,kind:"rescue"}));
 for(const key of ["amount","userId","claimDay","balance"])assert.equal(parseTicketClaim({...request,[key]:123}),null);
 for(const invalid of [null,[],{...request,kind:"bonus"},{...request,requestId:"bad"}])assert.equal(parseTicketClaim(invalid),null);
});
