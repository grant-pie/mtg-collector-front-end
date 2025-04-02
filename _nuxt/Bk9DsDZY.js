import{A as _,c as i,o as n,a as e,t as v,m as I,n as x,j as C,D as V,p as w,k,F as $,r as S,E as M,q as y,v as f,l as U,s as A,b as h}from"./BldJ7gzI.js";import{_ as q}from"./BWfbaynp.js";import{_ as B}from"./BECgjmYM.js";import{u as N}from"./BCla5gcS.js";const L={class:"bg-white shadow rounded p-4 flex justify-between"},Y={class:"font-bold"},F={class:"text-gray-600 mt-1"},T={class:"mt-2 text-sm text-gray-500"},z={__name:"DeckItem",props:{deck:{type:Object,required:!0},userId:{type:String,required:!0}},emits:["view","edit"],setup(r,{emit:c}){const u=r,d=c,p=N();_();const m=()=>{d("view",u.deck.id)},s=()=>{d("edit",u.deck.id)},l=async()=>{confirm(`Are you sure you want to delete "${u.deck.name}"?`)&&await p.removeDeck(u.deck.id)};return(a,D)=>{var g;return n(),i("div",L,[e("div",null,[e("h3",Y,v(r.deck.name),1),e("p",F,v(r.deck.description||"No description"),1),e("div",T,[e("p",null,v(((g=r.deck.userCards)==null?void 0:g.length)||0)+" cards",1)])]),e("div",{class:"flex flex-col space-y-2"},[e("button",{onClick:m,class:"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"}," View "),e("button",{onClick:s,class:"px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"}," Edit "),e("button",{onClick:l,class:"px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"}," Delete ")])])}}},R={key:0,class:"flex justify-center py-6"},G={key:1,class:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4"},O={key:2},P={key:0,class:"text-center py-8"},H={key:1},J={class:"mb-6 flex justify-between"},K={class:"text-gray-600"},Q={class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"},W={key:3,class:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"},X={class:"bg-white rounded-lg shadow-lg p-6 w-full max-w-md"},Z={class:"mb-4"},ee={class:"mb-6"},te={class:"flex justify-end"},se=["disabled"],oe={key:4,class:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"},ne={class:"bg-white rounded-lg shadow-lg p-6 w-full max-w-md"},ie={class:"mb-4"},de={class:"mb-6"},ae={class:"flex justify-end"},le=["disabled"],re={__name:"UserDecksList",props:{userId:{type:String,required:!0}},setup(r){const c=r,u=_(),d=N(),p=I(()=>d.userDecks),m=x(!1),s=x({name:"",description:""}),l=x(!1),a=x({id:"",name:"",description:""});C(async()=>{c.userId&&await d.fetchUserDecks(c.userId)}),V(()=>c.userId,async b=>{b&&await d.fetchUserDecks(b)});const D=async()=>{s.value.name&&(await d.createDeck({name:s.value.name,description:s.value.description}),s.value={name:"",description:""},m.value=!1)},g=b=>{u.push(`/decks/${b}`)},j=b=>{const t=p.value.find(o=>o.id===b);t&&(a.value={id:t.id,name:t.name,description:t.description||""},l.value=!0)},E=async()=>{!a.value.name||!a.value.id||(await d.updateDeck(a.value.id,{name:a.value.name,description:a.value.description}),l.value=!1)};return(b,t)=>(n(),i("div",null,[k(d).loading?(n(),i("div",R,t[8]||(t[8]=[e("p",null,"Loading decks...",-1)]))):k(d).error?(n(),i("div",G,[e("p",null,v(k(d).error),1)])):(n(),i("div",O,[p.value.length===0?(n(),i("div",P,[t[9]||(t[9]=e("p",{class:"text-lg text-gray-600"},"You don't have any decks yet.",-1)),e("button",{onClick:t[0]||(t[0]=o=>m.value=!0),class:"mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"}," Create Your First Deck ")])):(n(),i("div",H,[e("div",J,[e("p",K,"You have "+v(p.value.length)+" deck(s)",1),e("button",{onClick:t[1]||(t[1]=o=>m.value=!0),class:"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"}," Create New Deck ")]),e("div",Q,[(n(!0),i($,null,S(p.value,o=>(n(),M(z,{key:o.id,deck:o,userId:r.userId,onView:g,onEdit:j},null,8,["deck","userId"]))),128))])]))])),m.value?(n(),i("div",W,[e("div",X,[t[12]||(t[12]=e("h3",{class:"text-xl font-bold mb-4"},"Create New Deck",-1)),e("div",Z,[t[10]||(t[10]=e("label",{class:"block text-gray-700 text-sm font-bold mb-2",for:"deckName"}," Deck Name ",-1)),y(e("input",{"onUpdate:modelValue":t[2]||(t[2]=o=>s.value.name=o),class:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",id:"deckName",type:"text",placeholder:"Enter deck name"},null,512),[[f,s.value.name]])]),e("div",ee,[t[11]||(t[11]=e("label",{class:"block text-gray-700 text-sm font-bold mb-2",for:"deckDescription"}," Description (optional) ",-1)),y(e("textarea",{"onUpdate:modelValue":t[3]||(t[3]=o=>s.value.description=o),class:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",id:"deckDescription",placeholder:"Enter deck description",rows:"3"},null,512),[[f,s.value.description]])]),e("div",te,[e("button",{onClick:t[4]||(t[4]=o=>m.value=!1),class:"mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"}," Cancel "),e("button",{onClick:D,class:"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300",disabled:!s.value.name}," Create ",8,se)])])])):w("",!0),l.value?(n(),i("div",oe,[e("div",ne,[t[15]||(t[15]=e("h3",{class:"text-xl font-bold mb-4"},"Edit Deck",-1)),e("div",ie,[t[13]||(t[13]=e("label",{class:"block text-gray-700 text-sm font-bold mb-2",for:"editDeckName"}," Deck Name ",-1)),y(e("input",{"onUpdate:modelValue":t[5]||(t[5]=o=>a.value.name=o),class:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",id:"editDeckName",type:"text",placeholder:"Enter deck name"},null,512),[[f,a.value.name]])]),e("div",de,[t[14]||(t[14]=e("label",{class:"block text-gray-700 text-sm font-bold mb-2",for:"editDeckDescription"}," Description (optional) ",-1)),y(e("textarea",{"onUpdate:modelValue":t[6]||(t[6]=o=>a.value.description=o),class:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",id:"editDeckDescription",placeholder:"Enter deck description",rows:"3"},null,512),[[f,a.value.description]])]),e("div",ae,[e("button",{onClick:t[7]||(t[7]=o=>l.value=!1),class:"mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"}," Cancel "),e("button",{onClick:E,class:"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300",disabled:!a.value.name}," Save Changes ",8,le)])])])):w("",!0)]))}},ce={class:"mt-8"},ue={key:0,class:"text-center py-10"},pe={class:"mb-6 flex justify-between items-center"},me={key:0,class:"text-gray-600"},xe={__name:"index",setup(r){const c=U(),{isAuthenticated:u,user:d,loading:p}=A(c);return C(async()=>{await c.initAuth()}),(m,s)=>{var l;return n(),i("div",null,[h(q,{title:"My Deck Collection",subtitle:"View and manage your Magic: The Gathering decks"}),e("div",ce,[k(u)?(n(),i($,{key:1},[e("div",pe,[s[1]||(s[1]=e("h2",{class:"text-2xl font-bold"},"Your Decks",-1)),k(p)?(n(),i("div",me,"Loading...")):w("",!0)]),h(re,{userId:(l=k(d))==null?void 0:l.id},null,8,["userId"])],64)):(n(),i("div",ue,[s[0]||(s[0]=e("p",null,"Please log in to view your decks.",-1)),h(B,{class:"mt-4"})]))])])}}};export{xe as default};
