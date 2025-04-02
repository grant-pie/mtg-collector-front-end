import{_ as L}from"./BcrJk5wk.js";import{u as $,T as d}from"./Clc-PqKD.js";import{u as j}from"./l7uQw1y9.js";import{l as R,n as V,j as B,m as w,c as o,a as t,p as b,k as u,t as i,b as v,w as f,C as g,d as p,F as y,r as _,o as n}from"./BldJ7gzI.js";const U={class:"trades-container"},G={key:0,class:"flex justify-center my-10"},J={key:1,class:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"},M={key:2,class:"text-center my-10"},F={key:3,class:"mb-6"},Y={class:"border-b border-gray-200"},z={class:"flex -mb-px"},q={key:0,class:"ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"},H={key:4,class:"grid gap-4"},K={class:"flex justify-between items-center p-4 border-b bg-gray-50"},O={class:"flex items-center"},Q={class:"mr-3"},W={key:0,class:"text-blue-500"},X={key:1,class:"text-green-500"},Z={class:"font-medium"},ee={class:"font-semibold"},te={class:"text-sm text-gray-500"},se={class:"flex items-center"},re={class:"p-4"},oe={class:"grid grid-cols-2 gap-4"},ne={class:"font-medium mb-2 text-sm text-gray-600"},ae={class:"grid grid-cols-3 gap-2"},de={class:"text-xs"},le={key:0,class:"text-gray-500 text-sm"},ie={class:"font-medium mb-2 text-sm text-gray-600"},ue={class:"grid grid-cols-3 gap-2"},ce={class:"text-xs"},xe={key:0,class:"text-gray-500 text-sm"},be={class:"p-4 border-t bg-gray-50 flex justify-between"},me={key:0,class:"flex space-x-2"},ge=["onClick","disabled"],pe=["onClick","disabled"],ye=["onClick","disabled"],ve={key:5,class:"text-center my-10"},fe={class:"fixed bottom-6 right-6"},Te={__name:"index",setup(_e){const a=$(),h=j(),D=R(),l=V("all");B(async()=>{await Promise.all([a.fetchAllTrades(),h.fetchAllUsernames()])});const C=w(()=>l.value==="all"?(console.log(a.trades),a.trades):l.value==="pending"?a.trades.filter(r=>r.status===d.PENDING):l.value==="completed"?a.trades.filter(r=>r.status===d.ACCEPTED||r.status===d.REJECTED||r.status===d.CANCELED):[]),k=w(()=>a.trades.filter(r=>r.status===d.PENDING).length),x=r=>{var e;return r.initiatorId===((e=D.user)==null?void 0:e.id)},N=r=>{const e=h.publicUsernames.find(m=>m.id===r);return e?e.username:r.substring(0,8)},S=r=>new Date(r).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),A=r=>{switch(r){case d.PENDING:return"Pending";case d.ACCEPTED:return"Accepted";case d.REJECTED:return"Rejected";case d.CANCELED:return"Canceled";default:return r}},P=r=>{switch(r){case d.PENDING:return"bg-yellow-100 text-yellow-800";case d.ACCEPTED:return"bg-green-100 text-green-800";case d.REJECTED:return"bg-red-100 text-red-800";case d.CANCELED:return"bg-gray-100 text-gray-800";default:return"bg-gray-100 text-gray-800"}},E=r=>r.substring(0,8)+"...",T=async(r,e)=>{await a.respondToTrade(r,{accept:e})},I=async r=>{await a.cancelTrade(r)};return(r,e)=>{const m=L;return n(),o("div",U,[e[16]||(e[16]=t("div",{class:"mb-8"},[t("h1",{class:"text-2xl font-bold"},"My Trades"),t("p",{class:"text-gray-600"},"Manage your card trade offers")],-1)),u(a).loading?(n(),o("div",G,e[5]||(e[5]=[t("div",{class:"animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"},null,-1)]))):u(a).error?(n(),o("div",J,[t("p",null,i(u(a).error),1),t("button",{onClick:e[0]||(e[0]=(...s)=>u(a).resetErrorState&&u(a).resetErrorState(...s)),class:"text-sm underline"},"Dismiss")])):u(a).trades.length===0?(n(),o("div",M,[e[7]||(e[7]=t("div",{class:"text-5xl mb-4"},"🃏",-1)),e[8]||(e[8]=t("h3",{class:"text-xl font-medium mb-2"},"No trades yet",-1)),e[9]||(e[9]=t("p",{class:"text-gray-600 mb-6"},"Start trading cards with other collectors!",-1)),v(m,{to:"/cards",class:"bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition"},{default:f(()=>e[6]||(e[6]=[p(" Browse Cards ")])),_:1})])):(n(),o("div",F,[t("div",Y,[t("nav",z,[t("button",{onClick:e[1]||(e[1]=s=>l.value="all"),class:g(["px-4 py-2 mr-2 font-medium text-sm",l.value==="all"?"border-b-2 border-blue-500 text-blue-600":"text-gray-500 hover:text-gray-700"])}," All Trades ",2),t("button",{onClick:e[2]||(e[2]=s=>l.value="pending"),class:g(["px-4 py-2 mr-2 font-medium text-sm",l.value==="pending"?"border-b-2 border-blue-500 text-blue-600":"text-gray-500 hover:text-gray-700"])},[e[10]||(e[10]=p(" Pending ")),k.value>0?(n(),o("span",q,i(k.value),1)):b("",!0)],2),t("button",{onClick:e[3]||(e[3]=s=>l.value="completed"),class:g(["px-4 py-2 mr-2 font-medium text-sm",l.value==="completed"?"border-b-2 border-blue-500 text-blue-600":"text-gray-500 hover:text-gray-700"])}," Completed ",2)])])])),C.value.length>0?(n(),o("div",H,[(n(!0),o(y,null,_(C.value,s=>(n(),o("div",{key:s.id,class:"border rounded-lg overflow-hidden hover:shadow-md transition bg-white"},[t("div",K,[t("div",O,[t("div",Q,[x(s)?(n(),o("span",W,e[11]||(e[11]=[t("span",{class:"text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"},"Sent",-1)]))):(n(),o("span",X,e[12]||(e[12]=[t("span",{class:"text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"},"Received",-1)])))]),t("div",null,[t("h3",Z,[p(i(x(s)?"Trade to ":"Trade from ")+" ",1),t("span",ee,i(N(x(s)?s.receiverId:s.initiatorId)),1)]),t("p",te,i(S(s.createdAt)),1)])]),t("div",se,[t("span",{class:g(["text-sm px-3 py-1 rounded-full",P(s.status)])},i(A(s.status)),3)])]),t("div",re,[t("div",oe,[t("div",null,[t("h4",ne,i(x(s)?"Your offer":"Their offer"),1),t("div",ae,[(n(!0),o(y,null,_(s.initiatorCards,c=>(n(),o("div",{key:c,class:"border rounded p-1 text-center"},[t("div",de,"Card ID: "+i(E(c)),1)]))),128)),s.initiatorCards.length===0?(n(),o("div",le,"No cards")):b("",!0)])]),t("div",null,[t("h4",ie,i(x(s)?"Their cards":"Your cards"),1),t("div",ue,[(n(!0),o(y,null,_(s.receiverCards,c=>(n(),o("div",{key:c,class:"border rounded p-1 text-center"},[t("div",ce,"Card ID: "+i(E(c)),1)]))),128)),s.receiverCards.length===0?(n(),o("div",xe,"No cards")):b("",!0)])])])]),t("div",be,[v(m,{to:`/trades/${s.id}`,class:"text-blue-500 hover:text-blue-700 text-sm font-medium"},{default:f(()=>e[13]||(e[13]=[p(" View Details ")])),_:2},1032,["to"]),s.status==="pending"?(n(),o("div",me,[x(s)?(n(),o("button",{key:0,onClick:c=>I(s.id),class:"text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition",disabled:u(a).loading}," Cancel Trade ",8,ge)):b("",!0),x(s)?b("",!0):(n(),o(y,{key:1},[t("button",{onClick:c=>T(s.id,!0),class:"text-sm px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition",disabled:u(a).respondTradeLoading}," Accept ",8,pe),t("button",{onClick:c=>T(s.id,!1),class:"text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition",disabled:u(a).respondTradeLoading}," Reject ",8,ye)],64))])):b("",!0)])]))),128))])):l.value!=="all"?(n(),o("div",ve,[e[14]||(e[14]=t("p",{class:"text-gray-600"},"No trades found in this category",-1)),t("button",{onClick:e[4]||(e[4]=s=>l.value="all"),class:"text-blue-500 hover:text-blue-600 mt-2"},"View all trades")])):b("",!0),t("div",fe,[v(m,{to:"/trades/create",class:"bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition"},{default:f(()=>e[15]||(e[15]=[t("span",{class:"material-icons"},"add",-1)])),_:1})])])}}};export{Te as default};
