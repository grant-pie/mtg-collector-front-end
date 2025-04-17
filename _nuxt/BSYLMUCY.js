import{_ as V}from"./CQjWgFAY.js";import{u as I,T as d}from"./C2buioIH.js";import{u as G}from"./CIURiS_T.js";import{l as J,n as f,j as M,m as S,c as o,a as t,b as _,p as x,w as h,k as b,t as u,D as p,d as v,F as y,r as C,o as n}from"./BgyqXIzg.js";import{u as F}from"./DPXQG1aY.js";const Y={class:"trades-container"},z={key:0,class:"flex justify-center my-10"},q={key:1,class:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"},H={key:2,class:"text-center my-10"},K={class:"flex flex-col w-40 mx-auto"},O={key:3,class:"mb-6"},Q={class:"border-b border-gray-200"},W={class:"flex -mb-px"},X={key:0,class:"ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"},Z={key:4,class:"grid gap-4"},ee={class:"flex justify-between items-center p-4 border-b bg-gray-50"},te={class:"flex items-center"},se={class:"mr-3"},re={key:0,class:"text-blue-500"},oe={key:1,class:"text-green-500"},ne={class:"font-medium"},ae={class:"font-semibold"},le={class:"text-sm text-gray-500"},de={class:"flex items-center"},ie={class:"p-4"},ue={class:"grid grid-cols-2 gap-4"},ce={class:"font-medium mb-2 text-sm text-gray-600"},me={class:"grid grid-cols-3 gap-2"},xe={key:0},be={class:"text-sm mr-2"},ge=["src"],pe={key:1,class:"text-xs"},ve={key:0,class:"text-gray-500 text-sm"},ye={class:"font-medium mb-2 text-sm text-gray-600"},fe={class:"grid grid-cols-3 gap-2"},_e={key:0},he={class:"text-sm mr-2"},Ce=["src"],ke={key:1,class:"text-xs"},Ee={key:0,class:"text-gray-500 text-sm"},De={class:"p-4 border-t bg-gray-50 flex justify-between"},Te={key:0,class:"flex space-x-2"},we=["onClick","disabled"],Ne=["onClick","disabled"],Se=["onClick","disabled"],Ae={key:5,class:"text-center my-10"},Re={__name:"index",setup(Pe){const a=I(),k=G(),A=J(),P=F(),c=f("all"),m=f({}),E=f(!1);M(async()=>{await Promise.all([a.fetchAllTrades(),k.fetchAllUsernames()]),L()});const L=async()=>{console.log(a.trades);const r=a.trades;if(!r)return;E.value=!0;const e=[];r.forEach(i=>{i.initiatorCards.forEach(s=>{e.push(s)}),i.receiverCards.forEach(s=>{e.push(s)})});for(const i of e)if(!m.value[i]){const s=await P.fetchCardById(i);s&&(m.value[i]=s)}E.value=!1},D=S(()=>c.value==="all"?a.trades:c.value==="pending"?a.trades.filter(r=>r.status===d.PENDING):c.value==="completed"?a.trades.filter(r=>r.status===d.ACCEPTED||r.status===d.REJECTED||r.status===d.CANCELED):[]),T=S(()=>a.trades.filter(r=>r.status===d.PENDING).length),g=r=>{var e;return r.initiatorId===((e=A.user)==null?void 0:e.id)},$=r=>{const e=k.publicUsernames.find(i=>i.id===r);return e?e.username:r.substring(0,8)},U=r=>new Date(r).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),j=r=>{switch(r){case d.PENDING:return"Pending";case d.ACCEPTED:return"Accepted";case d.REJECTED:return"Rejected";case d.CANCELED:return"Canceled";default:return r}},B=r=>{switch(r){case d.PENDING:return"bg-yellow-100 text-yellow-800";case d.ACCEPTED:return"bg-green-100 text-green-800";case d.REJECTED:return"bg-red-100 text-red-800";case d.CANCELED:return"bg-gray-100 text-gray-800";default:return"bg-gray-100 text-gray-800"}},w=r=>r.substring(0,8)+"...",N=async(r,e)=>{await a.respondToTrade(r,{accept:e})},R=async r=>{await a.cancelTrade(r)};return(r,e)=>{const i=V;return n(),o("div",Y,[e[16]||(e[16]=t("div",{class:"mb-8"},[t("h1",{class:"text-2xl font-bold"},"My Trades"),t("p",{class:"text-gray-600"},"Manage your card trade offers")],-1)),_(i,{to:"/trades/create",class:"bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition"},{default:h(()=>e[5]||(e[5]=[t("span",{class:"material-icons"},"Start Trade",-1)])),_:1}),b(a).loading?(n(),o("div",z,e[6]||(e[6]=[t("div",{class:"animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"},null,-1)]))):b(a).error?(n(),o("div",q,[t("p",null,u(b(a).error),1),t("button",{onClick:e[0]||(e[0]=(...s)=>b(a).resetErrorState&&b(a).resetErrorState(...s)),class:"text-sm underline"},"Dismiss")])):b(a).trades.length===0?(n(),o("div",H,[e[8]||(e[8]=t("div",{class:"text-5xl mb-4"},"🃏",-1)),e[9]||(e[9]=t("h3",{class:"text-xl font-medium mb-2"},"No trades yet",-1)),e[10]||(e[10]=t("p",{class:"text-gray-600 mb-6"},"Start trading cards with other collectors!",-1)),t("div",K,[_(i,{to:"/cards",class:"bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition"},{default:h(()=>e[7]||(e[7]=[v(" Browse Cards ")])),_:1})])])):(n(),o("div",O,[t("div",Q,[t("nav",W,[t("button",{onClick:e[1]||(e[1]=s=>c.value="all"),class:p(["px-4 py-2 mr-2 font-medium text-sm",c.value==="all"?"border-b-2 border-blue-500 text-blue-600":"text-gray-500 hover:text-gray-700"])}," All Trades ",2),t("button",{onClick:e[2]||(e[2]=s=>c.value="pending"),class:p(["px-4 py-2 mr-2 font-medium text-sm",c.value==="pending"?"border-b-2 border-blue-500 text-blue-600":"text-gray-500 hover:text-gray-700"])},[e[11]||(e[11]=v(" Pending ")),T.value>0?(n(),o("span",X,u(T.value),1)):x("",!0)],2),t("button",{onClick:e[3]||(e[3]=s=>c.value="completed"),class:p(["px-4 py-2 mr-2 font-medium text-sm",c.value==="completed"?"border-b-2 border-blue-500 text-blue-600":"text-gray-500 hover:text-gray-700"])}," Completed ",2)])])])),D.value.length>0?(n(),o("div",Z,[(n(!0),o(y,null,C(D.value,s=>(n(),o("div",{key:s.id,class:"border rounded-lg overflow-hidden hover:shadow-md transition bg-white"},[t("div",ee,[t("div",te,[t("div",se,[g(s)?(n(),o("span",re,e[12]||(e[12]=[t("span",{class:"text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"},"Sent",-1)]))):(n(),o("span",oe,e[13]||(e[13]=[t("span",{class:"text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"},"Received",-1)])))]),t("div",null,[t("h3",ne,[v(u(g(s)?"Trade to ":"Trade from ")+" ",1),t("span",ae,u($(g(s)?s.receiverId:s.initiatorId)),1)]),t("p",le,u(U(s.createdAt)),1)])]),t("div",de,[t("span",{class:p(["text-sm px-3 py-1 rounded-full",B(s.status)])},u(j(s.status)),3)])]),t("div",ie,[t("div",ue,[t("div",null,[t("h4",ce,u(g(s)?"Your offer":"Their offer"),1),t("div",me,[(n(!0),o(y,null,C(s.initiatorCards,l=>(n(),o("div",{key:l,class:"border rounded p-1 text-center"},[m.value[l]?(n(),o("div",xe,[t("span",be,u(m.value[l].cardDetails.name),1),m.value[l]?(n(),o("img",{key:0,src:m.value[l].cardDetails.imageUrl},null,8,ge)):x("",!0)])):(n(),o("div",pe,"Card ID: "+u(w(l)),1))]))),128)),s.initiatorCards.length===0?(n(),o("div",ve,"No cards")):x("",!0)])]),t("div",null,[t("h4",ye,u(g(s)?"Their cards":"Your cards"),1),t("div",fe,[(n(!0),o(y,null,C(s.receiverCards,l=>(n(),o("div",{key:l,class:"border rounded p-1 text-center"},[m.value[l]?(n(),o("div",_e,[t("span",he,u(m.value[l].cardDetails.name),1),m.value[l]?(n(),o("img",{key:0,src:m.value[l].cardDetails.imageUrl},null,8,Ce)):x("",!0)])):(n(),o("div",ke,"Card ID: "+u(w(l)),1))]))),128)),s.receiverCards.length===0?(n(),o("div",Ee,"No cards")):x("",!0)])])])]),t("div",De,[_(i,{to:`/trades/${s.id}`,class:"text-blue-500 hover:text-blue-700 text-sm font-medium"},{default:h(()=>e[14]||(e[14]=[v(" View Details ")])),_:2},1032,["to"]),s.status==="pending"?(n(),o("div",Te,[g(s)?(n(),o("button",{key:0,onClick:l=>R(s.id),class:"text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition",disabled:b(a).loading}," Cancel Trade ",8,we)):x("",!0),g(s)?x("",!0):(n(),o(y,{key:1},[t("button",{onClick:l=>N(s.id,!0),class:"text-sm px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition",disabled:b(a).respondTradeLoading}," Accept ",8,Ne),t("button",{onClick:l=>N(s.id,!1),class:"text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition",disabled:b(a).respondTradeLoading}," Reject ",8,Se)],64))])):x("",!0)])]))),128))])):c.value!=="all"?(n(),o("div",Ae,[e[15]||(e[15]=t("p",{class:"text-gray-600"},"No trades found in this category",-1)),t("button",{onClick:e[4]||(e[4]=s=>c.value="all"),class:"text-blue-500 hover:text-blue-600 mt-2"},"View all trades")])):x("",!0)])}}};export{Re as default};
