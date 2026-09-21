
(() => {
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

// language: PT / EN / ES
let lang=localStorage.getItem('alb-lang')||'pt';
if(!['pt','en','es'].includes(lang)) lang='pt';
function setLang(){
 document.documentElement.lang=lang==='pt'?'pt-BR':(lang==='es'?'es':'en');
 $$('[data-pt][data-en][data-es]').forEach(el=>{el.textContent=el.dataset[lang]||el.dataset.pt});
 $$('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
}
setLang();
$$('.lang-btn').forEach(b=>b.addEventListener('click',()=>{lang=b.dataset.lang;localStorage.setItem('alb-lang',lang);setLang()}));

// mouse glow follows cursor
const glow=$('#mouseGlow');
addEventListener('mousemove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true});
addEventListener('mouseleave',()=>glow.style.opacity='.2');addEventListener('mouseenter',()=>glow.style.opacity='.9');

// progress + parallax
const prog=$('#scrollProgress');
function scrollEffects(){
 const max=document.documentElement.scrollHeight-innerHeight;
 if(prog) prog.style.width=(max?scrollY/max*100:0)+'%';
 document.querySelectorAll('[data-parallax-speed]').forEach(el=>{
   const s=parseFloat(el.dataset.parallaxSpeed||0);
   const r=el.closest('section')?.getBoundingClientRect();
   if(!r) return;
   const center=r.top+r.height/2-innerHeight/2;
   el.style.transform=`translate3d(0,${(-center*s).toFixed(1)}px,0)`;
 });
 document.querySelectorAll('.hero .parallax').forEach(el=>{
   const d=parseFloat(el.dataset.depth||0);
   el.style.translate=`0 ${(scrollY*d*2.2).toFixed(1)}px`;
 });
}
addEventListener('scroll',scrollEffects,{passive:true});scrollEffects();

// reveal
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.12});
$$('.reveal,.reveal-up,.reveal-left,.reveal-right').forEach(x=>obs.observe(x));
document.body.classList.add('motion-ready');

// endlessly animate factual charts: up -> hold 2s -> reset -> repeat
function tween(duration, cb, done){
 const st=performance.now();
 function frame(now){const t=Math.min(1,(now-st)/duration),ease=1-Math.pow(1-t,4);cb(ease);if(t<1)requestAnimationFrame(frame);else done&&done()}
 requestAnimationFrame(frame);
}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
async function metricLoop(card){
 const strong=$('strong',card),target=+card.dataset.target,prefix=card.dataset.prefix||'',suffix=card.dataset.suffix||'',bar=$('i b',card),bw=+(bar?.dataset.width||0);
 while(true){
  await new Promise(res=>tween(1400,t=>{strong.textContent=prefix+Math.round(target*t)+suffix;if(bar)bar.style.width=(bw*t)+'%'},res));
  await sleep(2000);
  await new Promise(res=>tween(500,t=>{strong.textContent=prefix+Math.round(target*(1-t))+suffix;if(bar)bar.style.width=(bw*(1-t))+'%'},res));
  await sleep(350);
 }
}
let metricsStarted=false;
const mObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!metricsStarted){metricsStarted=true;$$('.metric').forEach((c,i)=>setTimeout(()=>metricLoop(c),i*120));mObs.disconnect()}}),{threshold:.25});
const __metricGrid = $('#metricGrid'); if (__metricGrid) mObs.observe(__metricGrid);

async function donutLoop(d){
 const target=+d.dataset.value,ring=$('.donut-ring',d),label=$('.donut-ring span',d);
 while(true){
  await new Promise(res=>tween(1400,t=>{const v=Math.round(target*t);ring.style.setProperty('--p',v);label.textContent=v+'%'},res));
  await sleep(2000);
  await new Promise(res=>tween(500,t=>{const v=Math.round(target*(1-t));ring.style.setProperty('--p',v);label.textContent=v+'%'},res));
  await sleep(350);
 }
}
let donutsStarted=false;
const dObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!donutsStarted){donutsStarted=true;$$('.factual-donut').forEach((d,i)=>setTimeout(()=>donutLoop(d),i*180));dObs.disconnect()}}),{threshold:.3});
const firstDonut=$('.factual-donut');if(firstDonut)dObs.observe(firstDonut);

// governance loop
let gi=0;setInterval(()=>{const nodes=$$('#governanceCycle div');nodes.forEach(n=>n.classList.remove('active'));nodes[gi%nodes.length]?.classList.add('active');gi++},900);

// tabs
$$('.tab').forEach(t=>t.addEventListener('click',()=>{$$('.tab').forEach(x=>x.classList.remove('active'));$$('.panel').forEach(x=>x.classList.remove('active'));t.classList.add('active');$('#'+t.dataset.panel)?.classList.add('active');$$('#'+t.dataset.panel+' .reveal').forEach(x=>x.classList.add('visible'))}));

// professional deterrence (not real security)
['copy','cut','dragstart'].forEach(ev=>document.addEventListener(ev,e=>e.preventDefault()));
document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('keydown',e=>{const k=(e.key||'').toLowerCase();if(e.key==='F12'||(e.ctrlKey&&e.shiftKey&&['i','j','c'].includes(k))||(e.ctrlKey&&['u','s'].includes(k))||((e.ctrlKey||e.metaKey)&&['c','x'].includes(k))){e.preventDefault();e.stopPropagation()}},true);
})();


// V6 official logo loader: fallback remains visible if the remote official mark fails.
if(location.protocol!=='file:') document.querySelectorAll('.brand-logo img[data-src]').forEach(img=>{
  const src=img.dataset.src;
  const probe=new Image();
  probe.onload=()=>{img.src=src;img.classList.add('loaded')};
  probe.onerror=()=>{};
  probe.src=src;
});

// V6 pronounced cursor halo + comet trail rendered on canvas.
const __canvas=document.getElementById('cursorFX');
if(__canvas){
  const ctx=__canvas.getContext('2d');
  let dpr=Math.min(devicePixelRatio||1,2), pts=[], mx=innerWidth/2,my=innerHeight/2,tx=mx,ty=my;
  function resize(){dpr=Math.min(devicePixelRatio||1,2);__canvas.width=innerWidth*dpr;__canvas.height=innerHeight*dpr;__canvas.style.width=innerWidth+'px';__canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
  resize();addEventListener('resize',resize,{passive:true});
  addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY},{passive:true});
  function drawCursor(){
    mx+=(tx-mx)*.23;my+=(ty-my)*.23;
    pts.unshift({x:mx,y:my});if(pts.length>18)pts.pop();
    ctx.clearRect(0,0,innerWidth,innerHeight);
    const halo=ctx.createRadialGradient(mx,my,0,mx,my,120);halo.addColorStop(0,'rgba(82,205,255,.26)');halo.addColorStop(.28,'rgba(33,148,194,.15)');halo.addColorStop(.62,'rgba(250,164,5,.055)');halo.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=halo;ctx.beginPath();ctx.arc(mx,my,120,0,Math.PI*2);ctx.fill();
    pts.forEach((p,i)=>{const a=(1-i/pts.length)*.55;const r=Math.max(3,15-i*.65);ctx.fillStyle=`rgba(52,188,235,${a})`;ctx.shadowBlur=22;ctx.shadowColor='rgba(33,148,194,.75)';ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill()});ctx.shadowBlur=0;
    requestAnimationFrame(drawCursor);
  }requestAnimationFrame(drawCursor);
}

// Stagger transition timings for visual rhythm.
document.querySelectorAll('.metric,.expertise-card,.cert-card,.brand-card,.pub-card,.career-item').forEach((el,i)=>el.style.transitionDelay=((i%6)*65)+'ms');


function v6Tween(duration,cb){return new Promise(resolve=>{const st=performance.now();function f(now){const t=Math.min(1,(now-st)/duration),e=1-Math.pow(1-t,4);cb(e);if(t<1)requestAnimationFrame(f);else resolve()}requestAnimationFrame(f)})}
const v6Sleep=ms=>new Promise(r=>setTimeout(r,ms));
document.querySelectorAll('.cycle-counter').forEach((card,idx)=>{const el=card.querySelector('strong');if(!el)return;const target=+card.dataset.target,p=card.dataset.prefix||'',s=card.dataset.suffix||'';async function run(){while(true){await v6Tween(1350,t=>el.textContent=p+Math.round(target*t)+s);await v6Sleep(2000);await v6Tween(500,t=>el.textContent=p+Math.round(target*(1-t))+s);await v6Sleep(350)}}setTimeout(run,idx*170)});
