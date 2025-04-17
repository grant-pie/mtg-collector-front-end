import{_ as f}from"./DCxtUBuR.js";import{e as h,p,i as u,f as k,l as g,g as b,q as _,c as l,j as v,a,b as x,t as y,w as R,o as c,d as A}from"./ox6ecJFa.js";const N={class:"flex justify-center items-center min-h-screen"},S={key:0,class:"text-center"},w={key:1,class:"text-center"},V=h({__name:"callback",setup(M){const i=g(),d=_(),m=p(),o=u(!0),t=u(null);return k(async()=>{const r=i.query.data;if(!r||typeof r!="string"){t.value="No authentication data provided",o.value=!1;return}try{const e=JSON.parse(decodeURIComponent(r));console.log("Auth result:",e);const s=e.access_token||e.token;if(s){m.isAuthenticated;const n=b();n.setToken(s),e.rememberMe!==void 0&&(n.setRememberMe(e.rememberMe),console.log("Remember me set to:",e.rememberMe)),e.refresh_token&&(n.setRefreshToken(e.refresh_token),console.log("Refresh token stored")),e.user&&n.setUser(e.user),e.rememberMe&&(console.log("Token in localStorage:",localStorage.getItem("token")),console.log("Refresh token in localStorage:",localStorage.getItem("refreshToken"))),d.push("/profile")}else console.error("Auth response structure:",e),t.value="No token received from server",o.value=!1}catch(e){console.error("Auth callback error:",e),t.value="An error occurred during authentication",o.value=!1}}),(r,e)=>{const s=f;return c(),l("div",N,[o.value?(c(),l("div",S,e[0]||(e[0]=[a("h2",{class:"text-2xl font-bold mb-4"},"Processing login...",-1),a("p",null,"Please wait while we complete your authentication.",-1)]))):t.value?(c(),l("div",w,[e[2]||(e[2]=a("h2",{class:"text-2xl font-bold mb-4 text-red-600"},"Authentication Error",-1)),a("p",null,y(t.value),1),x(s,{to:"/",class:"inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"},{default:R(()=>e[1]||(e[1]=[A(" Return to Home ")])),_:1})])):v("",!0)])}}});export{V as default};
