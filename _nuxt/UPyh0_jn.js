import{_ as p}from"./dWVn1WTt.js";import{s as f,j as b,c as s,b as e,a as o,k as l,t as x,w as d,o as a,d as u}from"./BNPd43ba.js";import{u as _}from"./Cp1D7Whl.js";import{_ as g}from"./chYrhXB7.js";import{_ as h}from"./CSs9m7nR.js";const y={class:"mt-8"},k={class:"max-w-3xl mx-auto bg-white p-8 rounded shadow-md"},w={key:0,class:"mt-6"},v={key:1,class:"mt-6"},T={class:"mb-4"},M={class:"flex space-x-4"},L={__name:"index",setup(G){const n=_(),{isAuthenticated:m,user:c}=f(n);return b(async()=>{await n.initAuth()}),(V,t)=>{var i;const r=p;return a(),s("div",null,[e(g,{title:"MTG Tournament Master",subtitle:"Track your Magic: The Gathering cards for tournaments"}),o("div",y,[o("div",k,[t[5]||(t[5]=o("h2",{class:"text-2xl font-bold mb-4"},"Welcome to MTG Collector",-1)),t[6]||(t[6]=o("p",{class:"mb-4"}," This application helps you keep track of your Magic: The Gathering cards for tournaments. Login to view your card collection and manage your tournament decks. ",-1)),l(m)?(a(),s("div",v,[t[4]||(t[4]=o("h3",{class:"text-xl font-semibold mb-2"},"Your Account",-1)),o("p",T,"Welcome back! You're logged in as "+x((i=l(c))==null?void 0:i.name)+".",1),o("div",M,[e(r,{to:"/profile",class:"bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"},{default:d(()=>t[2]||(t[2]=[u(" View Profile ")])),_:1}),e(r,{to:"/cards",class:"bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"},{default:d(()=>t[3]||(t[3]=[u(" View My Cards ")])),_:1})])])):(a(),s("div",w,[t[0]||(t[0]=o("h3",{class:"text-xl font-semibold mb-2"},"Get Started",-1)),t[1]||(t[1]=o("p",{class:"mb-4"},"Login with your Google account to begin tracking your cards.",-1)),e(h)]))])])])}}};export{L as default};
