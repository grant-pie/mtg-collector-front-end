import{q as R,i as h,h as F,z as I,f as L,c as i,o as l,a as e,u as n,t as d,k as g,v,F as k,r as w,C as $,y as p,x as f,D as _,j as C,b as z}from"./ox6ecJFa.js";import{u as E}from"./EqvFJpHS.js";import{u as G}from"./6z83yeVA.js";const W={class:"container mx-auto px-4 py-8"},q={key:0,class:"text-center py-10"},H={key:1,class:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"},O={key:2},Z={class:"mb-6 bg-white p-4 rounded-lg shadow"},J={class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"},K={class:"flex space-x-2 mt-1"},Q=["value"],X={class:"flex space-x-2"},Y={key:0,class:"text-center py-10"},ee={key:1},te={class:"mb-4 flex justify-between items-center"},ae={class:"text-sm text-gray-600"},oe={class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"},ne={key:0,class:"h-48 bg-gray-100 flex items-center justify-center"},re=["src","alt"],se={class:"p-4"},ie={class:"font-bold text-lg"},le={class:"text-sm text-gray-600"},de={class:"text-sm text-gray-600"},ge={class:"mt-2 flex justify-between items-center"},ue={class:"text-sm font-semibold"},ce={key:0,class:"mt-6 flex justify-center"},me={class:"flex items-center space-x-2"},pe=["disabled"],be=["disabled"],ye={class:"flex space-x-1"},ve=["onClick"],fe=["disabled"],xe=["disabled"],Pe={class:"mt-4 flex justify-end"},he={class:"flex items-center space-x-2"},ke={__name:"TradingMarketplace",setup(T){R();const o=E(),r=h({name:"",type:"",rarity:"",set:"",username:"",orderBy:"",orderDirection:"ASC",page:1,limit:10}),m=h([]),u=h(10),M=F(()=>{const s=o.tradingPagination.totalPages,t=o.tradingPagination.currentPage,a=5;if(s<=a)return Array.from({length:s},(A,P)=>P+1);let c=Math.max(1,t-Math.floor(a/2)),y=c+a-1;return y>s&&(y=s,c=Math.max(1,y-a+1)),Array.from({length:y-c+1},(A,P)=>c+P)});I(m,s=>{r.value.colors=s.length>0?s:void 0}),L(async()=>{await o.fetchTradingMarketplace({page:1,limit:u.value})});const x=()=>{const s={};for(const[t,a]of Object.entries(r.value))a!==""&&a!==void 0&&a!==null&&(s[t]=a);return m.value.length>0&&(s.colors=m.value),s.limit=u.value,s.page=r.value.page||1,s},S=async()=>{r.value.page=1;const s=x();await o.fetchTradingMarketplace(s)},D=async()=>{r.value={name:"",type:"",rarity:"",set:"",username:"",orderBy:"",orderDirection:"ASC",page:1,limit:u.value},m.value=[],await o.fetchTradingMarketplace({page:1,limit:u.value})},b=async s=>{const t={...x(),page:s};await o.fetchTradingMarketplace(t)},U=()=>{o.tradingPagination.currentPage!==1&&b(1)},V=()=>{o.tradingPagination.currentPage!==o.tradingPagination.totalPages&&b(o.tradingPagination.totalPages)},N=()=>{o.tradingPagination.currentPage<o.tradingPagination.totalPages&&b(o.tradingPagination.currentPage+1)},j=()=>{o.tradingPagination.currentPage>1&&b(o.tradingPagination.currentPage-1)},B=async()=>{const s=Number(u.value);r.value.limit=s,r.value.page=1;const t=x();await o.fetchTradingMarketplace(t)};return(s,t)=>(l(),i("div",W,[t[25]||(t[25]=e("div",{class:"flex justify-between items-center mb-6"},[e("h1",{class:"text-2xl font-bold"},"Trading Marketplace"),e("p",{class:"text-gray-600"},"Find cards available for trade from all users")],-1)),n(o).loading?(l(),i("div",q,t[9]||(t[9]=[e("p",null,"Loading trading marketplace...",-1)]))):n(o).error?(l(),i("div",H,d(n(o).error),1)):(l(),i("div",O,[e("div",Z,[t[20]||(t[20]=e("h3",{class:"text-lg font-medium mb-4"},"Search Trading Marketplace",-1)),e("div",J,[e("div",null,[t[10]||(t[10]=e("label",{class:"block text-sm font-medium text-gray-700"},"Card Name",-1)),g(e("input",{"onUpdate:modelValue":t[0]||(t[0]=a=>r.value.name=a),type:"text",class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},null,512),[[v,r.value.name]])]),e("div",null,[t[11]||(t[11]=e("label",{class:"block text-sm font-medium text-gray-700"},"Card Type",-1)),g(e("input",{"onUpdate:modelValue":t[1]||(t[1]=a=>r.value.type=a),type:"text",placeholder:"Creature, Instant, etc.",class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},null,512),[[v,r.value.type]])]),e("div",null,[t[12]||(t[12]=e("label",{class:"block text-sm font-medium text-gray-700"},"Colors",-1)),e("div",K,[(l(),i(k,null,w(["W","U","B","R","G"],a=>e("label",{key:a,class:"inline-flex items-center"},[g(e("input",{type:"checkbox",value:a,"onUpdate:modelValue":t[2]||(t[2]=c=>m.value=c),class:"rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},null,8,Q),[[$,m.value]]),e("span",{class:p(["ml-1",{"text-yellow-500 font-bold":a==="W","text-blue-500 font-bold":a==="U","text-gray-800 font-bold":a==="B","text-red-500 font-bold":a==="R","text-green-500 font-bold":a==="G"}])},d(a),3)])),64))])]),e("div",null,[t[14]||(t[14]=e("label",{class:"block text-sm font-medium text-gray-700"},"Rarity",-1)),g(e("select",{"onUpdate:modelValue":t[3]||(t[3]=a=>r.value.rarity=a),class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},t[13]||(t[13]=[_('<option value="">Any</option><option value="common">Common</option><option value="uncommon">Uncommon</option><option value="rare">Rare</option><option value="mythic">Mythic</option>',5)]),512),[[f,r.value.rarity]])]),e("div",null,[t[15]||(t[15]=e("label",{class:"block text-sm font-medium text-gray-700"},"Set",-1)),g(e("input",{"onUpdate:modelValue":t[4]||(t[4]=a=>r.value.set=a),type:"text",placeholder:"e.g. ZNR",class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},null,512),[[v,r.value.set]])]),e("div",null,[t[16]||(t[16]=e("label",{class:"block text-sm font-medium text-gray-700"},"Trader Username",-1)),g(e("input",{"onUpdate:modelValue":t[5]||(t[5]=a=>r.value.username=a),type:"text",placeholder:"Search by trader username",class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},null,512),[[v,r.value.username]])]),e("div",null,[t[19]||(t[19]=e("label",{class:"block text-sm font-medium text-gray-700"},"Sort By",-1)),e("div",X,[g(e("select",{"onUpdate:modelValue":t[6]||(t[6]=a=>r.value.orderBy=a),class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},t[17]||(t[17]=[_('<option value="">Default</option><option value="name">Name</option><option value="convertedManaCost">CMC</option><option value="rarity">Rarity</option><option value="set">Set</option><option value="user.username">Trader</option>',6)]),512),[[f,r.value.orderBy]]),g(e("select",{"onUpdate:modelValue":t[7]||(t[7]=a=>r.value.orderDirection=a),class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},t[18]||(t[18]=[e("option",{value:"ASC"},"Ascending",-1),e("option",{value:"DESC"},"Descending",-1)]),512),[[f,r.value.orderDirection]])])])]),e("div",{class:"mt-4 flex justify-end space-x-3"},[e("button",{onClick:D,class:"px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"}," Reset "),e("button",{onClick:S,class:"px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"}," Search ")])]),n(o).tradingMarketplace.length===0?(l(),i("div",Y,t[21]||(t[21]=[e("p",null,"No cards available for trading match your criteria.",-1)]))):(l(),i("div",ee,[e("div",te,[t[22]||(t[22]=e("h3",{class:"text-lg font-medium"},"Available for Trade",-1)),e("p",ae," Showing "+d(n(o).tradingPagination.itemCount)+" of "+d(n(o).tradingPagination.totalItems)+" cards (Page "+d(n(o).tradingPagination.currentPage)+" of "+d(n(o).tradingPagination.totalPages)+") ",1)]),e("div",oe,[(l(!0),i(k,null,w(n(o).tradingMarketplace,a=>(l(),i("div",{key:a.id,class:"bg-white rounded-lg shadow-md overflow-hidden"},[a.cardDetails.imageUrl?(l(),i("div",ne,[e("img",{src:a.cardDetails.imageUrl,alt:a.cardDetails.name,class:"max-h-full max-w-full object-contain"},null,8,re)])):C("",!0),e("div",se,[e("h3",ie,d(a.cardDetails.name),1),e("p",le,d(a.cardDetails.type),1),e("p",de,"Set: "+d(a.cardDetails.setName||a.cardDetails.set)+" ("+d(a.cardDetails.rarity)+")",1),e("div",ge,[e("span",ue,"Trader: "+d(a.username),1)])])]))),128))]),n(o).tradingPagination.totalPages>1?(l(),i("div",ce,[e("nav",me,[e("button",{onClick:U,disabled:n(o).tradingPagination.currentPage===1,class:p(["px-3 py-1 rounded border",n(o).tradingPagination.currentPage===1?"bg-gray-100 text-gray-400 cursor-not-allowed":"bg-white hover:bg-gray-50"])}," « ",10,pe),e("button",{onClick:j,disabled:n(o).tradingPagination.currentPage===1,class:p(["px-3 py-1 rounded border",n(o).tradingPagination.currentPage===1?"bg-gray-100 text-gray-400 cursor-not-allowed":"bg-white hover:bg-gray-50"])}," ‹ ",10,be),e("div",ye,[(l(!0),i(k,null,w(M.value,a=>(l(),i("button",{key:a,onClick:c=>b(a),class:p(["px-3 py-1 rounded border",a===n(o).tradingPagination.currentPage?"bg-indigo-600 text-white":"bg-white hover:bg-gray-50"])},d(a),11,ve))),128))]),e("button",{onClick:N,disabled:n(o).tradingPagination.currentPage===n(o).tradingPagination.totalPages,class:p(["px-3 py-1 rounded border",n(o).tradingPagination.currentPage===n(o).tradingPagination.totalPages?"bg-gray-100 text-gray-400 cursor-not-allowed":"bg-white hover:bg-gray-50"])}," › ",10,fe),e("button",{onClick:V,disabled:n(o).tradingPagination.currentPage===n(o).tradingPagination.totalPages,class:p(["px-3 py-1 rounded border",n(o).tradingPagination.currentPage===n(o).tradingPagination.totalPages?"bg-gray-100 text-gray-400 cursor-not-allowed":"bg-white hover:bg-gray-50"])}," » ",10,xe)])])):C("",!0),e("div",Pe,[e("div",he,[t[24]||(t[24]=e("label",{class:"text-sm text-gray-600"},"Items per page:",-1)),g(e("select",{"onUpdate:modelValue":t[8]||(t[8]=a=>u.value=a),onChange:B,class:"rounded border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"},t[23]||(t[23]=[e("option",{value:"10"},"10",-1),e("option",{value:"20"},"20",-1),e("option",{value:"50"},"50",-1)]),544),[[f,u.value]])])])]))]))]))}},we={class:"container mx-auto px-4 py-6"},Me={__name:"index",setup(T){return G({title:"Trading Marketplace - Card Collector",meta:[{name:"description",content:"Find cards available for trade from other collectors"}]}),(o,r)=>(l(),i("div",we,[z(ke)]))}};export{Me as default};
