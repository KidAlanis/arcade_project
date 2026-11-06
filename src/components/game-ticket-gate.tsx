"use client";
import Link from "next/link";
import {createContext,useContext,useRef,useState,type ReactNode} from "react";
import {useTicketWallet} from "./ticket-wallet";
type Controls = { start:()=>Promise<boolean>; busy:boolean; paid:boolean; canInsert:boolean; error:string; retry:()=>void };
const ControlsContext=createContext<Controls>({start:async()=>false,busy:false,paid:false,canInsert:false,error:"",retry:()=>{}});
export function useGameTickets(){return useContext(ControlsContext);}
const Context=createContext<(won:boolean)=>void>(()=>{});
export function useGameSettlement(){return useContext(Context);}
export function GameTicketGate({gameId,children}:{gameId:string;children:ReactNode}){
 const {user,status,tickets,refresh}=useTicketWallet();
 const [run,setRun]=useState<string|null>(null);
 const [outcome,setOutcome]=useState<boolean|null>(null);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const key=useRef<string|null>(null);
 const lock=useRef(false);
 const settled=useRef(false);
 async function send(body:object){
  const response=await fetch("/api/player/games",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const data=await response.json();
  if(!response.ok)throw new Error(data.message || "Game tickets are unavailable. Please try again.");
  await refresh();
 }
 async function start(){
  if(lock.current || (run && outcome===null) || (outcome!==null && !settled.current))return false;
  lock.current=true;setBusy(true);setError("");
  if(outcome!==null)key.current=null;
  key.current ??= crypto.randomUUID();
  try{await send({action:"start",gameId,runId:key.current});setRun(key.current);settled.current=false;setOutcome(null);return true;}
  catch(e){setError(e instanceof Error?e.message:"Cannot start round.");return false;}
  finally{lock.current=false;setBusy(false);}
 }
 async function finish(won:boolean){
  if(lock.current || !run || settled.current)return;
  lock.current=true;setBusy(true);setOutcome(won);setError("");
  try{await send({action:"finish",runId:run,outcome:won?"win":"loss"});settled.current=true;}
  catch(e){setError(e instanceof Error?e.message:"Cannot settle round.");}
  finally{lock.current=false;setBusy(false);}
 }
 const controls={start,busy,paid:!!run&&outcome===null,canInsert:status==="ready"&&!!user&&tickets>=1&&!busy&&(!run||(outcome!==null&&settled.current)),error,retry:()=>{if(outcome!==null)void finish(outcome);}};
 const content=gameId==="clawpop"?children:<div className="ticket-game-preview" key={run??"preview"} inert={!controls.paid}>{children}</div>;
 return <ControlsContext.Provider value={controls}><Context.Provider value={won=>{void finish(won);}}>
 <div className={`ticket-game-shell ${gameId==="game-1"?"ticket-game-fullscreen":""}`}>
 {content}
 {gameId==="game-1"&&controls.paid&&<Link href="/lobby" className="game-back-floating">← Back to lobby</Link>}
 {gameId!=="clawpop"&&!controls.paid&&<div className="ticket-game-overlay"><div className="ticket-game-card">
 <span className="eyebrow">ONE TICKET. ONE LITTLE ADVENTURE.</span>
 <h2>{outcome===null?"Your next round awaits":outcome?"Lovely win!":"One more try?"}</h2>
 <p>{outcome===null?"1 ticket to play · Win +5 tickets":busy?"Saving your result…":settled.current?outcome?"+5 tickets saved to your wallet":"Round saved. Ready when you are.":"Your result needs to be saved."}</p>
 <p className="ticket-game-balance">▤ {tickets} tickets</p>
 {error&&<p role="alert">{error}</p>}
 {outcome!==null&&!settled.current?<button className="button pink-button" disabled={busy} onClick={controls.retry}>Retry saving result</button>:<button className="button purple-button" disabled={!controls.canInsert} onClick={()=>void start()}>{busy?"Inserting ticket…":"INSERT TICKET · 1"}</button>}
 <Link href="/lobby" className="game-back-link" aria-disabled={busy} onClick={event=>{if(busy)event.preventDefault();}}>← Back to lobby</Link>
 </div></div>}
 </div></Context.Provider></ControlsContext.Provider>;
}
