import{g as P,l as Y,s as H,n as d,m as J,j as K,D as Q,c as r,b as X,a as t,p as _,y as Z,q as b,v as z,B as N,F as $,r as I,k as j,t as l,z as U,o as a,C as S}from"./BldJ7gzI.js";import{u as ee}from"./l7uQw1y9.js";import{_ as te}from"./BWfbaynp.js";const se={class:"mt-8"},oe={class:"bg-white p-6 rounded shadow-md mb-8"},le={class:"grid grid-cols-1 gap-6 md:grid-cols-2"},re={class:"col-span-2"},ae={class:"col-span-2"},ne=["value"],ie={class:"col-span-2"},de=["disabled"],ue={key:0,class:"mt-3 text-red-600"},ce={key:1,class:"mt-3 text-green-600"},fe={class:"bg-white p-6 rounded shadow-md"},pe={class:"flex justify-between items-center mb-4"},be={class:"flex items-center gap-2"},me=["value"],ve={key:0,class:"text-center py-10"},ye={key:1,class:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"},ge={key:2,class:"text-center py-6"},xe={key:3},he={class:"min-w-full bg-white"},we={class:"py-2 px-4 border-b font-medium"},ke={class:"py-2 px-4 border-b"},_e={class:"py-2 px-4 border-b"},Ne={class:"py-2 px-4 border-b"},Ue={class:"py-2 px-4 border-b"},Ae={class:"py-2 px-4 border-b"},$e={class:"py-2 px-4 border-b text-center"},Ie=["onClick"],Se=["onClick"],Ce={key:0,class:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"},Te={class:"bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4"},Ee={class:"flex justify-between items-center mb-4"},Be={class:"text-xl font-bold"},Fe={class:"mb-4"},Me={class:"text-sm text-gray-500"},Ve={class:"mb-6"},Re={class:"whitespace-pre-wrap"},De={class:"flex justify-end"},qe=P({__name:"index",setup(ze){const C=ee(),u=Y(),{users:y}=H(C),m=d([]),A=d(!1),g=d(null),c=d({userId:"",read:""}),n=d({title:"",message:"",type:"INFO",userId:""}),x=d(!1),h=d(null),v=d(!1),p=d(!1),f=d(null),T=J(()=>{let o=[...m.value];return c.value.userId&&(o=o.filter(e=>e.userId===c.value.userId)),c.value.read!==""&&(o=o.filter(e=>e.read===c.value.read)),o});async function E(){if(u.token){A.value=!0,g.value=null;try{const o=U(),e=await $fetch(`${o.public.apiBaseUrl}/notifications`,{headers:{Authorization:`Bearer ${u.token}`},params:{}});m.value=e}catch(o){console.error("Error fetching notifications:",o),g.value="Failed to load notifications"}finally{A.value=!1}}}async function L(){var o;if(u.token){x.value=!0,h.value=null,v.value=!1;try{const e=U(),i={...n.value,userId:n.value.userId||null};await $fetch(`${e.public.apiBaseUrl}/notifications`,{method:"POST",headers:{Authorization:`Bearer ${u.token}`,"Content-Type":"application/json"},body:JSON.stringify(i)}),n.value={title:"",message:"",type:"INFO",userId:""},v.value=!0,await E(),setTimeout(()=>{v.value=!1},3e3)}catch(e){console.error("Error creating notification:",e),h.value=((o=e.data)==null?void 0:o.message)||"Failed to create notification"}finally{x.value=!1}}}async function O(o){if(!(!u.token||!o)&&confirm("Are you sure you want to delete this notification?"))try{const e=U();await $fetch(`${e.public.apiBaseUrl}/notifications/${o}`,{method:"DELETE",headers:{Authorization:`Bearer ${u.token}`}}),m.value=m.value.filter(i=>i.id!==o)}catch(e){console.error("Error deleting notification:",e),alert("Failed to delete notification")}}async function q(o){if(!(!u.token||!o))try{const e=U();await $fetch(`${e.public.apiBaseUrl}/notifications/${o}/read`,{method:"PATCH",headers:{Authorization:`Bearer ${u.token}`}});const i=m.value.find(w=>w.id===o);i&&(i.read=!0),p.value&&(p.value=!1)}catch(e){console.error("Error marking notification as read:",e),alert("Failed to mark notification as read")}}function W(o){f.value=o,p.value=!0}function B(o){if(!o)return"";const e=new Date(o);return new Intl.DateTimeFormat("en-US",{dateStyle:"medium",timeStyle:"short"}).format(e)}function F(o){if(!o)return"All Users";const e=y.value.find(i=>i.id===o);return e?`${e.firstName} ${e.lastName}`:"Unknown User"}function G(o){switch(o){case"INFO":return"bg-blue-200 text-blue-800";case"WARNING":return"bg-yellow-200 text-yellow-800";case"ALERT":return"bg-red-200 text-red-800";case"SYSTEM":return"bg-purple-200 text-purple-800";default:return"bg-gray-200 text-gray-800"}}return K(async()=>{y.value.length===0&&await C.fetchAllUsers(),await E()}),Q(n,()=>{v.value=!1},{deep:!0}),(o,e)=>{var i,w,M,V,R,D;return a(),r("div",null,[X(te,{title:"Notifications Management",subtitle:"View and send notifications"}),t("div",se,[t("div",oe,[e[15]||(e[15]=t("h2",{class:"text-2xl font-bold mb-4"},"Create New Notification",-1)),t("form",{onSubmit:Z(L,["prevent"])},[t("div",le,[t("div",re,[e[9]||(e[9]=t("label",{class:"block text-sm font-medium text-gray-700 mb-1"}," Title ",-1)),b(t("input",{"onUpdate:modelValue":e[0]||(e[0]=s=>n.value.title=s),type:"text",required:"",class:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"},null,512),[[z,n.value.title]])]),t("div",ae,[e[10]||(e[10]=t("label",{class:"block text-sm font-medium text-gray-700 mb-1"}," Message ",-1)),b(t("textarea",{"onUpdate:modelValue":e[1]||(e[1]=s=>n.value.message=s),required:"",rows:"3",class:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"},null,512),[[z,n.value.message]])]),t("div",null,[e[12]||(e[12]=t("label",{class:"block text-sm font-medium text-gray-700 mb-1"}," Type ",-1)),b(t("select",{"onUpdate:modelValue":e[2]||(e[2]=s=>n.value.type=s),required:"",class:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"},e[11]||(e[11]=[t("option",{value:"SYSTEM"},"System",-1),t("option",{value:"INFO"},"Information",-1),t("option",{value:"WARNING"},"Warning",-1),t("option",{value:"ALERT"},"Alert",-1)]),512),[[N,n.value.type]])]),t("div",null,[e[14]||(e[14]=t("label",{class:"block text-sm font-medium text-gray-700 mb-1"}," User ",-1)),b(t("select",{"onUpdate:modelValue":e[3]||(e[3]=s=>n.value.userId=s),required:"",class:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"},[e[13]||(e[13]=t("option",{value:""},"All Users",-1)),(a(!0),r($,null,I(j(y),s=>(a(),r("option",{key:s.id,value:s.id},l(s.firstName)+" "+l(s.lastName)+" ("+l(s.email)+") ",9,ne))),128))],512),[[N,n.value.userId]])]),t("div",ie,[t("button",{type:"submit",class:"bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",disabled:x.value},l(x.value?"Sending...":"Send Notification"),9,de),h.value?(a(),r("div",ue,l(h.value),1)):_("",!0),v.value?(a(),r("div",ce," Notification sent successfully! ")):_("",!0)])])],32)]),t("div",fe,[t("div",pe,[e[20]||(e[20]=t("h2",{class:"text-2xl font-bold"},"All Notifications",-1)),t("div",be,[e[18]||(e[18]=t("label",{class:"text-sm font-medium text-gray-700"}," Filter by User: ",-1)),b(t("select",{"onUpdate:modelValue":e[4]||(e[4]=s=>c.value.userId=s),class:"px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"},[e[16]||(e[16]=t("option",{value:""},"All Users",-1)),(a(!0),r($,null,I(j(y),s=>(a(),r("option",{key:s.id,value:s.id},l(s.firstName)+" "+l(s.lastName),9,me))),128))],512),[[N,c.value.userId]]),e[19]||(e[19]=t("label",{class:"text-sm font-medium text-gray-700 ml-4"}," Show: ",-1)),b(t("select",{"onUpdate:modelValue":e[5]||(e[5]=s=>c.value.read=s),class:"px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"},e[17]||(e[17]=[t("option",{value:""},"All",-1),t("option",{value:!1},"Unread",-1),t("option",{value:!0},"Read",-1)]),512),[[N,c.value.read]])])]),A.value?(a(),r("div",ve,e[21]||(e[21]=[t("p",null,"Loading notifications...",-1)]))):g.value?(a(),r("div",ye,l(g.value),1)):T.value.length===0?(a(),r("div",ge,e[22]||(e[22]=[t("p",null,"No notifications found.",-1)]))):(a(),r("div",xe,[t("table",he,[e[23]||(e[23]=t("thead",null,[t("tr",null,[t("th",{class:"py-2 px-4 border-b text-left"},"Title"),t("th",{class:"py-2 px-4 border-b text-left"},"Message"),t("th",{class:"py-2 px-4 border-b text-left"},"Type"),t("th",{class:"py-2 px-4 border-b text-left"},"User"),t("th",{class:"py-2 px-4 border-b text-left"},"Created"),t("th",{class:"py-2 px-4 border-b text-left"},"Status"),t("th",{class:"py-2 px-4 border-b text-center"},"Actions")])],-1)),t("tbody",null,[(a(!0),r($,null,I(T.value,s=>(a(),r("tr",{key:s.id,class:S({"bg-blue-50":!s.read})},[t("td",we,l(s.title),1),t("td",ke,l(s.message.length>50?s.message.substring(0,50)+"...":s.message),1),t("td",_e,[t("span",{class:S(["px-2 py-1 text-xs font-bold rounded",G(s.type)])},l(s.type),3)]),t("td",Ne,l(F(s.userId)),1),t("td",Ue,l(B(s.createdAt)),1),t("td",Ae,[t("span",{class:S(["px-2 py-1 text-xs font-bold rounded",s.read?"bg-gray-200 text-gray-800":"bg-green-200 text-green-800"])},l(s.read?"Read":"Unread"),3)]),t("td",$e,[t("button",{onClick:k=>W(s),class:"bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"}," View ",8,Ie),t("button",{onClick:k=>O(s.id),class:"bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"}," Delete ",8,Se)])],2))),128))])])]))])]),p.value?(a(),r("div",Ce,[t("div",Te,[t("div",Ee,[t("h3",Be,l((i=f.value)==null?void 0:i.title),1),t("button",{onClick:e[6]||(e[6]=s=>p.value=!1),class:"text-gray-500 hover:text-gray-700"},e[24]||(e[24]=[t("span",{class:"text-2xl"},"×",-1)]))]),t("div",Fe,[t("p",Me,l(B((w=f.value)==null?void 0:w.createdAt))+" • "+l(F((M=f.value)==null?void 0:M.userId))+" • "+l((V=f.value)==null?void 0:V.type),1)]),t("div",Ve,[t("p",Re,l((R=f.value)==null?void 0:R.message),1)]),t("div",De,[t("button",{onClick:e[7]||(e[7]=s=>p.value=!1),class:"bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"}," Close "),(D=f.value)!=null&&D.read?_("",!0):(a(),r("button",{key:0,onClick:e[8]||(e[8]=s=>{var k;return q((k=f.value)==null?void 0:k.id)}),class:"bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}," Mark as Read "))])])])):_("",!0)])}}});export{qe as default};
