"use client";
import {useEffect,useRef,useState} from "react";
import {useTicketWallet} from "./ticket-wallet";
export function TicketGifts({dailyOnly=false}:{dailyOnly?:boolean}){
 const {user,status,tickets,pending,claimTickets}=useTicketWallet();
 const [message,setMessage]=useState("");
 const [today,setToday]=useState("");
 const [claimedDay,setClaimedDay]=useState("");
 const dailyClaimed=!!today && today===claimedDay;
 useEffect(()=>{const tick=()=>setToday(new Date().toISOString().slice(0,10));tick();const timer=setInterval(tick,30000);return ()=>clearInterval(timer);},[]);
 const keys=useRef<Partial<Record<"daily"|"rescue",string>>>({});
 const busy=useRef(false);
 async function claim(kind:"daily"|"rescue"){
  if(busy.current)return;busy.current=true;setMessage("");
  keys.current[kind]??=crypto.randomUUID();
  try{
   const result=await claimTickets(kind,keys.current[kind]!);
   setMessage(result.alreadyApplied?`Already received: ${result.amount} tickets. No additional tickets added.`:`+${result.amount} tickets added!`);
   if(kind==="daily")setClaimedDay(new Date().toISOString().slice(0,10));
   else delete keys.current.rescue;
  }catch(e){setMessage(e instanceof Error?e.message:"Please try again.");}
  finally{busy.current=false;}
 }
 return <div className="nav-ticket-gifts" aria-label="Free tickets">
 <button className="text-button" title="10 free tickets when your balance is zero" disabled={!user||pending||status!=="ready"||tickets!==0} onClick={()=>void claim("rescue")}>Free tickets +10</button>
 <button className="text-button" title="10–50 tickets once per UTC day. Resets at 00:00 UTC." disabled={!user||pending||status!=="ready"||dailyClaimed} onClick={()=>void claim("daily")}>{dailyClaimed?"✓ Checked in":"Daily check-in"}</button>
 {message&&<span className="nav-ticket-message" role="status" aria-live="polite">{message}</span>}
 </div>;
}
