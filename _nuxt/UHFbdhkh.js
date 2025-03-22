import{E as te,y as P,G as ae,m as R,l as N,c,o as g,a as t,n as C,F as I,t as p,r as V,s as re,C as E,j as se,p as y,v as x,H as oe,B as U,A as T,I as q,k as f,b as ie}from"./NH000gxJ.js";import{u as A}from"./CxcP87si.js";const G=[10,20,50],ne=10,O=te("card",{state:()=>({userCards:[],allCards:[],loading:!1,error:null,pagination:{totalItems:0,itemCount:0,itemsPerPage:10,totalPages:0,currentPage:1},validPageSizes:G}),actions:{async fetchUserCards(s,l=1,r=10){const u=A(),n=P();if(u.token)try{this.loading=!0,this.error=null;const m=this.validatePageSize(r),v=await $fetch(`${n.public.apiBaseUrl}/user-cards/${s}`,{method:"GET",headers:{Authorization:`Bearer ${u.token}`},params:{page:l,limit:m}});this.userCards=v.cards||[],this.pagination=v.pagination||this.pagination}catch(m){console.error("Error fetching user cards:",m),this.error=m.message||"Failed to fetch cards"}finally{this.loading=!1}},async fetchCardsByUsername(s,l){const r=P();try{this.loading=!0,this.error=null,l||(l={}),l.page===void 0&&(l.page=1),l.limit===void 0&&(l.limit=10),l.limit=this.validatePageSize(l.limit);const u=new URLSearchParams;for(const[w,d]of Object.entries(l))d!=null&&d!==""&&(Array.isArray(d)?d.forEach(h=>{u.append(w,h)}):u.append(w,d.toString()));const n=u.toString();let m=`${r.public.apiBaseUrl}/user-cards/username/${s}`;n&&(m+=`?${n}`);const v=await $fetch(m,{method:"GET"});return this.userCards=v.cards||[],this.pagination=v.pagination||this.pagination,this.userCards}catch(u){return console.error("Error fetching cards by username:",u),this.error=u.message||"Failed to fetch cards",[]}finally{this.loading=!1}},async searchUserCards(s,l={}){const r=A(),u=P();if(r.token)try{this.loading=!0,this.error=null,l.page===void 0&&(l.page=1),l.limit===void 0&&(l.limit=10),l.limit=this.validatePageSize(l.limit);const n=new URLSearchParams;for(const[d,h]of Object.entries(l))h!=null&&h!==""&&(Array.isArray(h)?h.forEach(k=>{n.append(d,k)}):n.append(d,h.toString()));const m=n.toString(),v=`${u.public.apiBaseUrl}/user-cards/${s}${m?`?${m}`:""}`,w=await $fetch(v,{method:"GET",headers:{Authorization:`Bearer ${r.token}`}});this.userCards=w.cards||[],this.pagination=w.pagination||this.pagination}catch(n){console.error("Error searching user cards:",n),this.error=n.message||"Failed to search cards"}finally{this.loading=!1}},async goToPage(s,l,r={}){if(l<1||l>this.pagination.totalPages)return;const u={...r,page:l};if(r.username){const n=r.username;delete u.username,await this.fetchCardsByUsername(n,u)}else await this.searchUserCards(s,u)},async nextPage(s,l={}){this.pagination.currentPage<this.pagination.totalPages&&await this.goToPage(s,this.pagination.currentPage+1,l)},async prevPage(s,l={}){this.pagination.currentPage>1&&await this.goToPage(s,this.pagination.currentPage-1,l)},async changeItemsPerPage(s,l,r={}){const u=this.validatePageSize(l),n={...r,limit:u,page:1};if(r.username){const m=r.username;delete n.username,await this.fetchCardsByUsername(m,n)}else await this.searchUserCards(s,n)},validatePageSize(s){return isNaN(s)||!G.includes(s)?ne:s},async addCardToUser(s,l){const r=A(),u=P();if(r.isAdmin)try{this.loading=!0,this.error=null;const n=await $fetch(`${u.public.apiBaseUrl}/user-cards/${s}`,{method:"POST",headers:{Authorization:`Bearer ${r.token}`,"Content-Type":"application/json"},body:{scryfallId:l}});return await this.fetchUserCards(s,this.pagination.currentPage,this.pagination.itemsPerPage),n}catch(n){console.error("Error adding card:",n),this.error=n.message||"Failed to add card"}finally{this.loading=!1}},async removeCard(s,l){const r=A(),u=P();if(r.token)try{this.loading=!0,this.error=null,await $fetch(`${u.public.apiBaseUrl}/user-cards/${s}`,{method:"DELETE",headers:{Authorization:`Bearer ${r.token}`}}),await this.fetchUserCards(l,this.pagination.currentPage,this.pagination.itemsPerPage)}catch(n){this.error=n.message||"Failed to remove card"}finally{this.loading=!1}},async revealCard(s,l){const r=A(),u=P();if(r.token)try{this.loading=!0,this.error=null;const n=await $fetch(`${u.public.apiBaseUrl}/user-cards/${s}/reveal`,{method:"PATCH",headers:{Authorization:`Bearer ${r.token}`}});return await this.fetchUserCards(l,this.pagination.currentPage,this.pagination.itemsPerPage),n.userCard}catch(n){console.error("Error revealing card:",n),this.error=n.message||"Failed to reveal card"}finally{this.loading=!1}},async searchCards(s){const l=A(),r=P();if(l.token)try{this.loading=!0,this.error=null;const u=new URLSearchParams;for(const[m,v]of Object.entries(s))v&&u.append(m,v.toString());const n=await $fetch(`${r.public.apiBaseUrl}/cards?${u.toString()}`,{method:"GET",headers:{Authorization:`Bearer ${l.token}`}});return this.allCards=n||[],this.allCards}catch(u){return console.error("Error searching cards:",u),this.error=u.message||"Failed to search cards",[]}finally{this.loading=!1}},async fetchCardDetails(s){const l=A(),r=P();if(!l.token)return null;try{return await $fetch(`${r.public.apiBaseUrl}/cards/multiverse/${s}`,{method:"GET",headers:{Authorization:`Bearer ${l.token}`}})}catch(u){return console.error("Error fetching card details:",u),null}}}}),le=ae("/images/back.jpg"),de={class:"bg-white shadow rounded p-4 flex justify-between"},ue={class:"font-bold"},ce={class:"text-sm text-gray-600"},ge={class:"mt-2"},me={key:0,src:le,alt:"Card Back",class:"w-40"},fe=["src","alt"],ve={key:2,class:"text-sm"},ye={key:0},pe={key:1},be={key:2},he={key:3},xe={key:3,class:"text-sm"},Ce={class:"mt-2 text-sm"},we={key:0},ke={key:1,class:"italic text-gray-500"},Pe={key:2,class:"text-xs text-purple-600 mt-1"},Ae={key:0},Se=["onClick"],$e={__name:"CardItem",props:{card:{type:Object,required:!0},userId:{type:String,required:!1},actions:{type:Array,required:!1}},emits:["onClickAction","cardRevealed"],setup(s,{emit:l}){const r=O(),u=A(),n=R(!1),m=N(()=>u.isAdmin),v=s,w=l,d=N(()=>new Date(v.card.createdAt).toISOString().split("T")[0]);async function h(){if(!n.value)try{n.value=!0,await r.revealCard(v.card.id,v.userId||v.card.userId),w("cardRevealed",v.card)}catch(k){console.error("Failed to reveal card:",k)}finally{n.value=!1}}return(k,o)=>(g(),c("div",de,[t("div",null,[s.card.revealed||m.value?(g(),c(I,{key:0},[t("h3",ue,p(s.card.cardDetails.name),1),t("p",ce,p(s.card.cardDetails.type),1)],64)):(g(),c(I,{key:1},[o[0]||(o[0]=t("h3",{class:"font-bold"},"Mystery Card",-1)),o[1]||(o[1]=t("p",{class:"text-sm text-gray-600"},"Unknown Type",-1))],64)),t("div",ge,[!s.card.revealed&&!m.value?(g(),c("img",me)):(g(),c("img",{key:1,src:s.card.cardDetails.imageUrl||`https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${s.card.cardDetails.multiverseId}&type=card`,alt:s.card.cardDetails.name,class:"w-40"},null,8,fe)),s.card.revealed||m.value?(g(),c("div",ve,[s.card.cardDetails.manaCost?(g(),c("p",ye,"Mana Cost: "+p(s.card.cardDetails.manaCost),1)):C("",!0),s.card.cardDetails.rarity?(g(),c("p",pe,"Rarity: "+p(s.card.cardDetails.rarity),1)):C("",!0),s.card.createdAt?(g(),c("p",be,"Received: "+p(d.value),1)):C("",!0),m.value?(g(),c("p",he,"Revealed: "+p(s.card.revealed),1)):C("",!0)])):C("",!0),!s.card.revealed&&!m.value&&s.card.createdAt?(g(),c("div",xe,[t("p",null,"Received: "+p(d.value),1)])):C("",!0)]),t("div",Ce,[(s.card.revealed||m.value)&&s.card.cardDetails.text?(g(),c("p",we,p(s.card.cardDetails.text),1)):(g(),c("p",ke,'This card is face down. Click "Reveal" to see its contents.')),m.value&&!s.card.revealed?(g(),c("p",Pe," Admin view: You can see this card's details before it's revealed. ")):C("",!0)]),s.card.revealed?C("",!0):(g(),c("button",{key:2,onClick:h,class:"mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"}," Reveal "))]),s.actions?(g(),c("div",Ae,[(g(!0),c(I,null,V(s.actions,b=>(g(),c("button",{key:b,onClick:S=>k.$emit("onClickAction",{action:b,card:s.card}),class:"bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"},p(b),9,Se))),128))])):C("",!0)]))}},Ue={class:"mb-6 bg-white p-4 rounded-lg shadow"},Ie={class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"},Be={class:"flex space-x-2 mt-1"},Ee=["value"],Te={class:"grid grid-cols-2 gap-2"},Ne={class:"flex space-x-2"},De={key:0,class:"text-center py-10"},Re={key:1,class:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"},Ve={key:2},Me={class:"mb-4 flex justify-between items-center"},ze={class:"text-sm text-gray-600"},Le={key:0,class:"text-center py-10"},je={key:1,class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"},Fe={key:0,class:"absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center"},qe={key:2,class:"mt-6 flex justify-center"},Ge={class:"flex items-center space-x-2"},Oe=["disabled"],We=["disabled"],He={class:"flex space-x-1"},Ze=["onClick"],Ye=["disabled"],Je=["disabled"],Ke={class:"mt-4 flex justify-end"},Qe={class:"flex items-center space-x-2"},et={__name:"UserCardsList",props:{userName:{type:String,required:!1},userId:{type:String,required:!1},cardActions:{type:Array,required:!1},excludeCards:{type:Array,required:!1}},emits:["onClickAction"],setup(s,{emit:l}){const r=s,u=l,n=O(),{userCards:m,loading:v,error:w,pagination:d}=re(n),h=N(()=>m.value),k=i=>r.excludeCards?r.excludeCards.map(a=>a.id).includes(i.id):!1,o=R({name:"",type:"",rarity:"",set:"",manaCost:"",convertedManaCost:"",minPower:"",minToughness:"",text:"",artist:"",createdAt:"",createdAtStart:"",createdAtEnd:"",orderBy:"",orderDirection:"ASC",page:1,limit:10}),b=R(10),S=R([]),W=N(()=>r.userName),H=N(()=>{const i=d.value.totalPages,e=d.value.currentPage,a=5;if(i<=a)return Array.from({length:i},(ee,L)=>L+1);let $=Math.max(1,e-Math.floor(a/2)),D=$+a-1;return D>i&&(D=i,$=Math.max(1,D-a+1)),Array.from({length:D-$+1},(ee,L)=>$+L)});E(W,async()=>{r.userName&&(o.value.page=1,await n.fetchCardsByUsername(r.userName,{page:o.value.page,limit:b.value}))}),E(S,i=>{o.value.colors=i.length>0?i:void 0}),E(()=>[o.value.createdAtStart,o.value.createdAtEnd],([i,e])=>{(i||e)&&(o.value.createdAt="")}),E(()=>o.value.createdAt,i=>{i&&(o.value.createdAtStart="",o.value.createdAtEnd="")});const M=i=>i||"";se(async()=>{r.userId&&await n.fetchUserCards(r.userId,1,b.value),r.userName&&await n.fetchCardsByUsername(r.userName,{page:1,limit:b.value})}),E(()=>r.userId,async i=>{i&&(F(),await n.fetchUserCards(i,1,b.value))});const z=async i=>{o.value.page=i,await j()},Z=()=>{d.value.currentPage!==1&&z(1)},Y=()=>{d.value.currentPage!==d.value.totalPages&&z(d.value.totalPages)},J=async()=>{if(d.value.currentPage>1){const i={...B(),username:r.userName};r.userId?await n.prevPage(r.userId,i):r.userName&&await n.prevPage("",i)}},K=async()=>{if(d.value.currentPage<d.value.totalPages){const i={...B(),username:r.userName};r.userId?await n.nextPage(r.userId,i):r.userName&&await n.nextPage("",i)}},Q=async()=>{const i=Number(b.value);if(o.value.limit=i,r.userId)await n.changeItemsPerPage(r.userId,i,B());else if(r.userName){const e=B();await n.changeItemsPerPage("",i,{...e,username:r.userName})}},B=()=>{const i={};for(const[e,a]of Object.entries(o.value))a!==""&&a!==void 0&&a!==null&&(i[e]=a);return S.value.length>0&&(i.colors=S.value),i.createdAt&&(i.createdAt=M(i.createdAt)),i.createdAtStart&&(i.createdAtStart=M(i.createdAtStart)),i.createdAtEnd&&(i.createdAtEnd=M(i.createdAtEnd)),i.page=o.value.page,i.limit=b.value,i},j=async()=>{const i=B();r.userId?await n.searchUserCards(r.userId,i):r.userName&&await n.fetchCardsByUsername(r.userName,i)},X=async()=>{o.value.page=1,await j()},F=async()=>{o.value={name:"",type:"",rarity:"",set:"",manaCost:"",convertedManaCost:"",minPower:"",minToughness:"",text:"",artist:"",revealed:"",createdAt:"",createdAtStart:"",createdAtEnd:"",orderBy:"",orderDirection:"ASC",page:1,limit:b.value},S.value=[],r.userId?await n.fetchUserCards(r.userId,1,b.value):r.userName&&await n.fetchCardsByUsername(r.userName,{page:1,limit:b.value})},_=i=>{u("onClickAction",i)};return(i,e)=>(g(),c("div",null,[t("div",Ue,[e[37]||(e[37]=t("h3",{class:"text-lg font-medium mb-4"},"Search Cards",-1)),t("div",Ie,[t("div",null,[e[18]||(e[18]=t("label",{class:"block text-sm font-medium text-gray-700"},"Card Name",-1)),y(t("input",{"onUpdate:modelValue":e[0]||(e[0]=a=>o.value.name=a),type:"text",class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},null,512),[[x,o.value.name]])]),t("div",null,[e[19]||(e[19]=t("label",{class:"block text-sm font-medium text-gray-700"},"Card Type",-1)),y(t("input",{"onUpdate:modelValue":e[1]||(e[1]=a=>o.value.type=a),type:"text",placeholder:"Creature, Instant, etc.",class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},null,512),[[x,o.value.type]])]),t("div",null,[e[20]||(e[20]=t("label",{class:"block text-sm font-medium text-gray-700"},"Colors",-1)),t("div",Be,[(g(),c(I,null,V(["W","U","B","R","G"],a=>t("label",{key:a,class:"inline-flex items-center"},[y(t("input",{type:"checkbox",value:a,"onUpdate:modelValue":e[2]||(e[2]=$=>S.value=$),class:"rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},null,8,Ee),[[oe,S.value]]),t("span",{class:U(["ml-1",{"text-yellow-500 font-bold":a==="W","text-blue-500 font-bold":a==="U","text-gray-800 font-bold":a==="B","text-red-500 font-bold":a==="R","text-green-500 font-bold":a==="G"}])},p(a),3)])),64))])]),t("div",null,[e[22]||(e[22]=t("label",{class:"block text-sm font-medium text-gray-700"},"Revealed",-1)),y(t("select",{"onUpdate:modelValue":e[3]||(e[3]=a=>o.value.revealed=a),class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},e[21]||(e[21]=[t("option",{value:""},"Any",-1),t("option",{value:"true"},"Revealed",-1),t("option",{value:"false"},"Not Revealed",-1)]),512),[[T,o.value.revealed]])]),t("div",null,[e[24]||(e[24]=t("label",{class:"block text-sm font-medium text-gray-700"},"Rarity",-1)),y(t("select",{"onUpdate:modelValue":e[4]||(e[4]=a=>o.value.rarity=a),class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},e[23]||(e[23]=[q('<option value="">Any</option><option value="common">Common</option><option value="uncommon">Uncommon</option><option value="rare">Rare</option><option value="mythic">Mythic</option>',5)]),512),[[T,o.value.rarity]])]),t("div",null,[e[25]||(e[25]=t("label",{class:"block text-sm font-medium text-gray-700"},"Set",-1)),y(t("input",{"onUpdate:modelValue":e[5]||(e[5]=a=>o.value.set=a),type:"text",placeholder:"e.g. ZNR",class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},null,512),[[x,o.value.set]])]),t("div",null,[e[26]||(e[26]=t("label",{class:"block text-sm font-medium text-gray-700"},"Mana Cost",-1)),y(t("input",{"onUpdate:modelValue":e[6]||(e[6]=a=>o.value.manaCost=a),type:"text",placeholder:"e.g. {2}{W}{W}",class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},null,512),[[x,o.value.manaCost]])]),t("div",null,[e[27]||(e[27]=t("label",{class:"block text-sm font-medium text-gray-700"},"CMC",-1)),y(t("input",{"onUpdate:modelValue":e[7]||(e[7]=a=>o.value.convertedManaCost=a),type:"number",min:"0",class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},null,512),[[x,o.value.convertedManaCost]])]),t("div",null,[e[28]||(e[28]=t("label",{class:"block text-sm font-medium text-gray-700"},"Min Power",-1)),y(t("input",{"onUpdate:modelValue":e[8]||(e[8]=a=>o.value.minPower=a),type:"number",min:"0",class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},null,512),[[x,o.value.minPower]])]),t("div",null,[e[29]||(e[29]=t("label",{class:"block text-sm font-medium text-gray-700"},"Min Toughness",-1)),y(t("input",{"onUpdate:modelValue":e[9]||(e[9]=a=>o.value.minToughness=a),type:"number",min:"0",class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},null,512),[[x,o.value.minToughness]])]),t("div",null,[e[30]||(e[30]=t("label",{class:"block text-sm font-medium text-gray-700"},"Card Text",-1)),y(t("input",{"onUpdate:modelValue":e[10]||(e[10]=a=>o.value.text=a),type:"text",placeholder:"Search card text",class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},null,512),[[x,o.value.text]])]),t("div",null,[e[31]||(e[31]=t("label",{class:"block text-sm font-medium text-gray-700"},"Artist",-1)),y(t("input",{"onUpdate:modelValue":e[11]||(e[11]=a=>o.value.artist=a),type:"text",class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},null,512),[[x,o.value.artist]])]),t("div",null,[e[32]||(e[32]=t("label",{class:"block text-sm font-medium text-gray-700"},"Received On",-1)),y(t("input",{"onUpdate:modelValue":e[12]||(e[12]=a=>o.value.createdAt=a),type:"date",class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},null,512),[[x,o.value.createdAt]])]),t("div",null,[e[33]||(e[33]=t("label",{class:"block text-sm font-medium text-gray-700"},"Received Between",-1)),t("div",Te,[t("div",null,[y(t("input",{"onUpdate:modelValue":e[13]||(e[13]=a=>o.value.createdAtStart=a),type:"date",class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500",placeholder:"From"},null,512),[[x,o.value.createdAtStart]])]),t("div",null,[y(t("input",{"onUpdate:modelValue":e[14]||(e[14]=a=>o.value.createdAtEnd=a),type:"date",class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500",placeholder:"To"},null,512),[[x,o.value.createdAtEnd]])])])]),t("div",null,[e[36]||(e[36]=t("label",{class:"block text-sm font-medium text-gray-700"},"Sort By",-1)),t("div",Ne,[y(t("select",{"onUpdate:modelValue":e[15]||(e[15]=a=>o.value.orderBy=a),class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},e[34]||(e[34]=[q('<option value="">Default</option><option value="name">Name</option><option value="convertedManaCost">CMC</option><option value="rarity">Rarity</option><option value="set">Set</option><option value="createdAt">Received Date</option>',6)]),512),[[T,o.value.orderBy]]),y(t("select",{"onUpdate:modelValue":e[16]||(e[16]=a=>o.value.orderDirection=a),class:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"},e[35]||(e[35]=[t("option",{value:"ASC"},"Ascending",-1),t("option",{value:"DESC"},"Descending",-1)]),512),[[T,o.value.orderDirection]])])])]),t("div",{class:"mt-4 flex justify-end space-x-3"},[t("button",{onClick:F,class:"px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"}," Reset "),t("button",{onClick:X,class:"px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"}," Search ")])]),f(v)?(g(),c("div",De,e[38]||(e[38]=[t("p",null,"Loading cards...",-1)]))):f(w)?(g(),c("div",Re,p(f(w)),1)):(g(),c("div",Ve,[t("div",Me,[e[39]||(e[39]=t("h3",{class:"text-lg font-medium"},"Card List",-1)),t("p",ze," Showing "+p(f(d).itemCount)+" of "+p(f(d).totalItems)+" cards (Page "+p(f(d).currentPage)+" of "+p(f(d).totalPages)+") ",1)]),h.value.length===0?(g(),c("div",Le,e[40]||(e[40]=[t("p",null,"No cards found matching your criteria.",-1)]))):(g(),c("div",je,[(g(!0),c(I,null,V(f(m),a=>(g(),c("div",{key:a.id,class:"relative"},[ie($e,{card:a,userId:s.userId,actions:s.cardActions,onOnClickAction:_},null,8,["card","userId","actions"]),k(a)?(g(),c("div",Fe,e[41]||(e[41]=[t("p",{class:"text-lg font-bold text-gray-800"},"Card in Deck",-1)]))):C("",!0)]))),128))])),f(d).totalPages>1?(g(),c("div",qe,[t("nav",Ge,[t("button",{onClick:Z,disabled:f(d).currentPage===1,class:U(["px-3 py-1 rounded border",f(d).currentPage===1?"bg-gray-100 text-gray-400 cursor-not-allowed":"bg-white hover:bg-gray-50"])}," « ",10,Oe),t("button",{onClick:J,disabled:f(d).currentPage===1,class:U(["px-3 py-1 rounded border",f(d).currentPage===1?"bg-gray-100 text-gray-400 cursor-not-allowed":"bg-white hover:bg-gray-50"])}," ‹ ",10,We),t("div",He,[(g(!0),c(I,null,V(H.value,a=>(g(),c("button",{key:a,onClick:$=>z(a),class:U(["px-3 py-1 rounded border",a===f(d).currentPage?"bg-indigo-600 text-white":"bg-white hover:bg-gray-50"])},p(a),11,Ze))),128))]),t("button",{onClick:K,disabled:f(d).currentPage===f(d).totalPages,class:U(["px-3 py-1 rounded border",f(d).currentPage===f(d).totalPages?"bg-gray-100 text-gray-400 cursor-not-allowed":"bg-white hover:bg-gray-50"])}," › ",10,Ye),t("button",{onClick:Y,disabled:f(d).currentPage===f(d).totalPages,class:U(["px-3 py-1 rounded border",f(d).currentPage===f(d).totalPages?"bg-gray-100 text-gray-400 cursor-not-allowed":"bg-white hover:bg-gray-50"])}," » ",10,Je)])])):C("",!0),t("div",Ke,[t("div",Qe,[e[43]||(e[43]=t("label",{class:"text-sm text-gray-600"},"Items per page:",-1)),y(t("select",{"onUpdate:modelValue":e[17]||(e[17]=a=>b.value=a),onChange:Q,class:"rounded border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"},e[42]||(e[42]=[t("option",{value:"10"},"10",-1),t("option",{value:"20"},"20",-1),t("option",{value:"50"},"50",-1)]),544),[[T,b.value]])])])]))]))}};export{et as _,O as u};
