
(() => {
  const q = (s,ctx=document)=>ctx.querySelector(s);
  const qa = (s,ctx=document)=>[...ctx.querySelectorAll(s)];

  // Language
  let lang = localStorage.getItem('alb-lang') || 'pt';
  const btn = q('#langToggle');
  function applyLang(){
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    qa('[data-pt][data-en]').forEach(el => { el.textContent = el.dataset[lang]; });
    if(btn) btn.textContent = lang === 'pt' ? 'EN' : 'PT';
  }
  applyLang();
  btn?.addEventListener('click',()=>{ lang = lang==='pt'?'en':'pt'; localStorage.setItem('alb-lang',lang); applyLang(); });

  // Scroll progress
  const progress = q('#scrollProgress');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? (scrollY/max)*100 : 0;
    progress.style.width = pct + '%';

    // Parallax layers
    qa('.parallax-layer').forEach(el=>{
      const speed = parseFloat(el.dataset.speed || 0);
      el.style.transform = `translate3d(0, ${scrollY*speed}px, 0) ${el.classList.contains('grid-bg')?'perspective(800px) rotateX(66deg) translateY(30%)':''}`;
    });
  };
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // Reveals
  const revealObs = new IntersectionObserver(entries=>{
    entries.forEach((entry,i)=>{
      if(entry.isIntersecting){
        entry.target.style.transitionDelay = Math.min(i*40,240)+'ms';
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  },{threshold:.12});
  qa('.reveal').forEach(el=>revealObs.observe(el));

  // Counters and metric lines
  const metricObs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const card=entry.target, c=q('.counter',card);
      const target=Number(c.dataset.target||0), prefix=c.dataset.prefix||'', suffix=c.dataset.suffix||'';
      const duration=1400, start=performance.now();
      const step=(now)=>{
        const t=Math.min(1,(now-start)/duration), eased=1-Math.pow(1-t,4);
        c.textContent=prefix+Math.round(target*eased)+suffix;
        if(t<1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      card.classList.add('animated');
      metricObs.unobserve(card);
    });
  },{threshold:.55});
  qa('[data-counter-card]').forEach(el=>metricObs.observe(el));

  // Radials
  const radialObs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const wrap=entry.target, pct=Number(wrap.dataset.progress||0);
      const circle=q('.progress',wrap), circumference=302;
      circle.style.strokeDashoffset=String(circumference-(circumference*pct/100));
      radialObs.unobserve(wrap);
    })
  },{threshold:.6});
  qa('.radial').forEach(el=>radialObs.observe(el));

  // Delivery flow
  const nodes=qa('.flow-node');
  let flowIndex=0;
  setInterval(()=>{
    nodes.forEach(n=>n.classList.remove('active'));
    nodes[flowIndex%nodes.length]?.classList.add('active');
    flowIndex++;
  },1150);

  // Expertise click/touch
  qa('.interactive-card').forEach(card=>{
    card.addEventListener('click',()=>card.classList.toggle('open'));
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.classList.toggle('open')}});
  });

  // Credentials tabs
  qa('.cred-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      qa('.cred-tab').forEach(t=>t.classList.remove('active'));
      qa('.cred-panel').forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');
      q('#'+tab.dataset.tab)?.classList.add('active');
      qa('#'+tab.dataset.tab+' .reveal').forEach(el=>el.classList.add('visible'));
    });
  });

  // Subtle 3D tilt
  qa('.tilt-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg)`;
    });
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });

  // Magnetic buttons
  qa('.magnetic').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.06}px,${(e.clientY-r.top-r.height/2)*.08}px) translateY(-3px)`;
    });
    el.addEventListener('mouseleave',()=>el.style.transform='');
  });

  // Deterrence only: disable selection/copy/context-menu and common DevTools shortcuts.
  // Browser developer tools cannot be truly disabled on a public website.
  ['copy','cut','dragstart'].forEach(evt=>document.addEventListener(evt,e=>e.preventDefault()));
  document.addEventListener('contextmenu',e=>e.preventDefault());
  document.addEventListener('keydown',e=>{
    const k=(e.key||'').toLowerCase();
    const dev = e.key==='F12' || (e.ctrlKey&&e.shiftKey&&['i','j','c'].includes(k)) || (e.ctrlKey&&['u','s'].includes(k));
    const clipboard = (e.ctrlKey||e.metaKey) && ['c','x'].includes(k);
    if(dev||clipboard){e.preventDefault();e.stopPropagation();}
  },true);
})();
