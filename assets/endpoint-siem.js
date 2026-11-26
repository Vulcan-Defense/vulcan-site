(function(){
  "use strict";
  var reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  function counters(){document.querySelectorAll("[data-ep-counter]").forEach(function(el){var target=Number(el.dataset.epCounter),dec=Number(el.dataset.decimals||0),prefix=el.dataset.prefix||"",suffix=el.dataset.suffix||"",started=false;function start(){if(started)return;started=true;var began=performance.now(),duration=reduced?0:1000;function frame(now){var p=duration?Math.min((now-began)/duration,1):1,e=1-Math.pow(1-p,3);el.textContent=prefix+(target*e).toLocaleString("pt-BR",{minimumFractionDigits:dec,maximumFractionDigits:dec})+suffix;if(p<1)requestAnimationFrame(frame)}requestAnimationFrame(frame)}if("IntersectionObserver" in window){var o=new IntersectionObserver(function(entries){if(entries[0].isIntersecting){start();o.disconnect()}});o.observe(el)}else start()})}
  var scenarios={ransomware:{severity:"Crítico",title:"Comportamento de ransomware interrompido",description:"Sequência anômala de criptografia detectada no endpoint FIN-042 e correlacionada no SIEM.",id:"INC-4821",mttr:"01m 42s",steps:[["Sinal correlacionado no SIEM","00:00"],["Host isolado via EDR","00:18"],["Hash bloqueado no ambiente","00:41"]]},identity:{severity:"Alto",title:"Desvio de identidade privilegiada",description:"Autenticação anômala correlacionada com contexto de risco do usuário administrativo.",id:"INC-4917",mttr:"03m 08s",steps:[["Anomalia de acesso correlacionada","00:00"],["Sessão privilegiada revogada","00:47"],["Credencial enviada para revisão","01:22"]]},malware:{severity:"Alto",title:"Execução maliciosa bloqueada",description:"Artefato suspeito enriquecido com telemetria e threat intelligence antes da execução completa.",id:"INC-5034",mttr:"00m 56s",steps:[["IOC enriquecido no SIEM","00:00"],["Processo interrompido pelo EDR","00:12"],["Artefato colocado em quarentena","00:29"]]}};
  function scenarioTabs(){var buttons=document.querySelectorAll("[data-scenario]");buttons.forEach(function(button){button.addEventListener("click",function(){var data=scenarios[button.dataset.scenario];buttons.forEach(function(b){b.classList.toggle("is-active",b===button);b.setAttribute("aria-pressed",String(b===button))});document.querySelector("[data-alert-severity]").textContent=data.severity;document.querySelector("[data-alert-title]").textContent=data.title;document.querySelector("[data-alert-description]").textContent=data.description;document.querySelector("[data-alert-id]").textContent=data.id;document.querySelector("[data-alert-mttr]").textContent=data.mttr;document.querySelectorAll("[data-timeline-step]").forEach(function(row,index){row.querySelector("strong").textContent=data.steps[index][0];row.querySelector("time").textContent=data.steps[index][1]})})})}
  var hours=["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];
  var metrics={
    events:{label:"Eventos ingeridos",unit:"eventos",color:"#f6c85f",area:"rgba(246,200,95,",data:[28400,24100,22800,21900,23600,31200,39800,48600,55200,61400,64800,67100,65900,68300,70200,69400,66800,63900,58700,54300,49800,45200,39700,34100],format:function(v){return (v/1000).toFixed(1)+"k"}},
    alerts:{label:"Alertas correlacionados",unit:"alertas",color:"#5edce7",area:"rgba(94,220,231,",data:[6,4,4,3,5,7,10,14,17,19,21,23,20,22,24,23,21,19,17,15,13,11,9,7],format:function(v){return String(Math.round(v))}},
    blocked:{label:"Contenções automatizadas",unit:"ações",color:"#7ee2a8",area:"rgba(126,226,168,",data:[2,1,1,1,2,3,4,6,7,8,9,10,9,10,11,10,9,8,7,6,5,4,3,2],format:function(v){return String(Math.round(v))}}
  };
  function lineChart(){
    var canvas=document.querySelector("[data-ep-line]"),tooltip=canvas&&canvas.parentElement.querySelector(".ep-chart-tooltip"),metric="events",points=[];
    if(!canvas) return;
    function fmt(metricKey,value){return metrics[metricKey].format(value)}
    function draw(progress){
      var rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
      canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
      var ctx=canvas.getContext("2d");ctx.scale(dpr,dpr);
      var w=rect.width,h=rect.height,pad={l:52,r:14,t:18,b:34},data=metrics[metric].data;
      var rawMin=Math.min.apply(null,data),rawMax=Math.max.apply(null,data),range=rawMax-rawMin||1;
      var min=Math.max(0,rawMin-range*0.18),max=rawMax+range*0.18;
      var pw=w-pad.l-pad.r,ph=h-pad.t-pad.b;
      points=data.map(function(v,i){return{x:pad.l+i*(pw/(data.length-1)),y:pad.t+(1-(v-min)/(max-min))*ph,value:v,index:i}});
      ctx.clearRect(0,0,w,h);
      ctx.font="11px Inter,system-ui,sans-serif";ctx.fillStyle="#71818b";ctx.strokeStyle="rgba(255,255,255,.065)";ctx.lineWidth=1;
      var ticks=4;
      for(var i=0;i<=ticks;i++){
        var tv=min+((max-min)/ticks)*(ticks-i),y=pad.t+(ph/ticks)*i;
        ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();
        ctx.fillStyle="#71818b";ctx.fillText(fmt(metric,tv),2,y+4);
      }
      ctx.fillStyle="#71818b";
      [0,6,12,18,23].forEach(function(i){var x=points[i].x,label=hours[i];ctx.fillText(label,Math.min(Math.max(x-14,pad.l),w-pad.r-28),h-8)});
      var visible=points.slice(0,Math.max(2,Math.ceil(points.length*progress)));
      var grad=ctx.createLinearGradient(0,pad.t,0,h-pad.b);grad.addColorStop(0,metrics[metric].area+"0.28)");grad.addColorStop(1,metrics[metric].area+"0)");
      ctx.beginPath();ctx.moveTo(visible[0].x,h-pad.b);visible.forEach(function(p){ctx.lineTo(p.x,p.y)});ctx.lineTo(visible[visible.length-1].x,h-pad.b);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
      ctx.beginPath();visible.forEach(function(p,i){i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)});
      ctx.strokeStyle=metrics[metric].color;ctx.lineWidth=2.6;ctx.lineJoin="round";ctx.lineCap="round";ctx.stroke();
      visible.forEach(function(p,i){if(i%3!==0&&i!==visible.length-1) return;ctx.beginPath();ctx.arc(p.x,p.y,i===visible.length-1?4:2.5,0,Math.PI*2);ctx.fillStyle=i===visible.length-1?metrics[metric].color:"rgba(10,22,31,.95)";ctx.fill();ctx.strokeStyle=metrics[metric].color;ctx.lineWidth=1.5;ctx.stroke()});
      canvas.setAttribute("aria-label",metrics[metric].label+" nas últimas 24 horas. Último valor: "+fmt(metric,data[data.length-1])+" "+metrics[metric].unit+".")
    }
    function animate(){if(reduced){draw(1);return}var start=performance.now();function frame(now){var p=Math.min((now-start)/720,1);draw(1-Math.pow(1-p,3));if(p<1)requestAnimationFrame(frame)}requestAnimationFrame(frame)}
    document.querySelectorAll("[data-ep-metric]").forEach(function(button){button.addEventListener("click",function(){metric=button.dataset.epMetric;document.querySelectorAll("[data-ep-metric]").forEach(function(b){b.classList.toggle("is-active",b===button)});tooltip.classList.remove("is-visible");animate()})});
    canvas.addEventListener("pointermove",function(e){var rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,nearest=points.reduce(function(best,p){return Math.abs(p.x-x)<Math.abs(best.x-x)?p:best});tooltip.innerHTML="<strong>"+fmt(metric,nearest.value)+" "+metrics[metric].unit+"</strong><span>"+metrics[metric].label+" · "+hours[nearest.index]+"</span>";tooltip.style.left=Math.min(Math.max(nearest.x,70),rect.width-70)+"px";tooltip.style.top=nearest.y+"px";tooltip.classList.add("is-visible")});
    canvas.addEventListener("pointerleave",function(){tooltip.classList.remove("is-visible")});
    if("ResizeObserver" in window)new ResizeObserver(function(){draw(1)}).observe(canvas);
    animate();
  }
  function donut(){
    var canvas=document.querySelector("[data-ep-donut]");if(!canvas)return;
    var segments=[{label:"Crítica",value:12,color:"#ff7b7b"},{label:"Alta",value:41,color:"#f6c85f"},{label:"Média",value:116,color:"#5edce7"},{label:"Baixa",value:173,color:"#7b8b96"}];
    var total=segments.reduce(function(s,x){return s+x.value},0);
    var totalEl=document.querySelector("[data-donut-total]"); if(totalEl) totalEl.textContent=String(total);
    var legend=document.querySelector("[data-severity-legend]");
    if(legend){legend.innerHTML=segments.map(function(s){var pct=Math.round((s.value/total)*100);return '<span><i style="background:'+s.color+'"></i><b>'+s.label+'</b><small>'+s.value+' · '+pct+'%</small></span>'}).join("")}
    function draw(progress){
      var rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
      canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
      var ctx=canvas.getContext("2d");ctx.scale(dpr,dpr);
      var cx=rect.width/2,cy=rect.height/2,r=Math.min(rect.width,rect.height)*0.38,lw=Math.max(18,Math.min(24,rect.width*0.09));
      ctx.clearRect(0,0,rect.width,rect.height);
      ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle="rgba(255,255,255,.06)";ctx.lineWidth=lw;ctx.stroke();
      var start=-Math.PI/2,maxAngle=Math.PI*2*progress;
      segments.forEach(function(s){
        var angle=Math.PI*2*(s.value/total);
        var drawAngle=Math.max(0,Math.min(angle,maxAngle));
        if(drawAngle>0){ctx.beginPath();ctx.arc(cx,cy,r,start+0.02,start+drawAngle-0.02);ctx.strokeStyle=s.color;ctx.lineWidth=lw;ctx.lineCap="butt";ctx.stroke()}
        start+=angle;maxAngle-=angle;
      });
      canvas.setAttribute("aria-label","Severidade dos alertas: "+segments.map(function(s){return s.label+" "+s.value+" ("+Math.round((s.value/total)*100)+"%)"}).join(", ")+".")
    }
    function animate(){if(reduced){draw(1);return}var start=performance.now();function frame(now){var p=Math.min((now-start)/760,1);draw(1-Math.pow(1-p,3));if(p<1)requestAnimationFrame(frame)}requestAnimationFrame(frame)}
    if("ResizeObserver" in window)new ResizeObserver(function(){draw(1)}).observe(canvas);
    if("IntersectionObserver" in window){var obs=new IntersectionObserver(function(entries){if(entries[0].isIntersecting){animate();obs.disconnect()}});obs.observe(canvas)} else animate();
  }
  counters();scenarioTabs();lineChart();donut();
})();
