// تحميل الإعدادات من Supabase (لو متاحة) + تسجيل الزيارات والضغطات (بدون أي بيانات شخصية)
(function(){
  var C = window.FLEX_CONFIG || {}, ok = !!(C.url && C.key && C.url.indexOf("YOUR")<0);
  var KEY = "flex_settings_v1";
  function merge(a,b){for(var k in b){if(b[k]&&typeof b[k]=="object"&&!Array.isArray(b[k])&&a[k]&&typeof a[k]=="object")merge(a[k],b[k]);else a[k]=b[k]}return a}
  window.FLEX_READY = new Promise(function(res){
    if(!ok){res();return}
    try{var c=JSON.parse(localStorage.getItem(KEY)||"null");if(c)merge(window.FLEX,c)}catch(e){}
    var done=false;function fin(){if(!done){done=true;res()}}
    setTimeout(fin,2500);
    fetch(C.url+"/rest/v1/site_settings?id=eq.1&select=data",{headers:{apikey:C.key}})
      .then(function(r){return r.json()})
      .then(function(j){if(j&&j[0]&&j[0].data&&Object.keys(j[0].data).length){merge(window.FLEX,j[0].data);try{localStorage.setItem(KEY,JSON.stringify(j[0].data))}catch(e){}}fin()})
      .catch(fin);
  });
  var page = (location.pathname.split("/").pop() || "index.html");
  function track(kind){
    if(!ok) return;
    try{fetch(C.url+"/rest/v1/events",{method:"POST",keepalive:true,headers:{apikey:C.key,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({page:page,kind:kind})}).catch(function(){})}catch(e){}
  }
  window.FLEX_TRACK = track;
  try{ if(!sessionStorage.getItem("fv:"+page)){sessionStorage.setItem("fv:"+page,"1");track("visit")} }catch(e){ track("visit") }
  var names={app:"open_app",dial:"dial_code",cn:"copy_number",cc:"copy_code",wa:"whatsapp",pay:"pay_link",cl:"copy_link",nf:"no_app"};
  document.addEventListener("click",function(e){
    var el=e.target.closest&&e.target.closest("[id],a.s,a.pk");
    if(!el) return;
    if(el.matches("a.s,a.pk")){track("go:"+(el.getAttribute("href")||"").replace(".html",""));return}
    if(names[el.id]) track(page.replace(".html","")+":"+names[el.id]);
  });
})();
