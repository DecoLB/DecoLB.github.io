
(() => {
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

// language
let lang=localStorage.getItem('alb-lang')||'pt';
const lbtn=$('#langToggle');
function setLang(){document.documentElement.lang=lang==='pt'?'pt-BR':'en';$$('[data-pt][data-en]').forEach(el=>el.textContent=el.dataset[lang]);if(lbtn)lbtn.textContent=lang==='pt'?'EN':'PT'}
setLang();lbtn?.addEventListener('click',()=>{lang=lang==='pt'?'en':'pt';localStorage.setItem('alb-lang',lang);setLang()});

// mouse glow follows cursor
const glow=$('#mouseGlow');
addEventListener('mousemove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true});
addEventListener('mouseleave',()=>glow.style.opacity='.2');addEventListener('mouseenter',()=>glow.style.opacity='.9');

// progress + parallax
const prog=$('#scrollProgress');
function scrollEffects(){
 const max=document.documentElement.scrollHeight-innerHeight;
 prog.style.width=(max?scrollY/max*100:0)+'%';
 $$('.parallax').forEach(el=>{
   const d=parseFloat(el.dataset.depth||0), rect=el.parentElement.getBoundingClientRect();
   const offset=(innerHeight/2-(rect.top+rect.height/2))*d;
   el.style.translate=`0 ${offset}px`;
 });
}
addEventListener('scroll',scrollEffects,{passive:true});scrollEffects();

// reveal
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(x=>obs.observe(x));

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
mObs.observe($('#metricGrid'));

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
