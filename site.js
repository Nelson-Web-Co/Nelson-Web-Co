// Nav turns solid once you scroll past the photo
  var nav=document.getElementById('nav');
  function setNav(){ if(nav) nav.classList.add('solid'); }
  window.addEventListener('scroll', setNav, {passive:true}); setNav();

  // Mobile menu
  var menuBtn=document.getElementById('menuBtn'), links=document.getElementById('navLinks');
  menuBtn.addEventListener('click', function(){
    var open=links.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', open); setNav();
  });
  links.addEventListener('click', function(e){ if(e.target.tagName==='A'){ links.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false'); setNav(); } });

  var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();


  // Example sites carousel: slides on its own, pauses when someone is looking or touching
  (function(){
    var track=document.getElementById('workTrack'); if(!track) return;
    var slides=[].slice.call(track.children), dotsEl=document.getElementById('carDots');
    var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches, timer=null, paused=false;
    function step(){ return slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap||28); }
    function perView(){ return Math.max(1, Math.round(track.clientWidth / step())); }
    function index(){ return Math.round(track.scrollLeft / step()); }
    function maxIndex(){ return Math.max(0, slides.length - perView()); }
    function go(i){ var m=maxIndex(); if(i>m) i=0; if(i<0) i=m; track.scrollTo({left:i*step()}); }
    function buildDots(){
      dotsEl.innerHTML='';
      for(var i=0;i<=maxIndex();i++){ var b=document.createElement('button'); b.setAttribute('aria-label','Show site '+(i+1)); (function(n){ b.addEventListener('click',function(){ go(n); restart(); }); })(i); dotsEl.appendChild(b); }
      mark();
    }
    function mark(){ var i=index(); [].forEach.call(dotsEl.children,function(d,n){ d.setAttribute('aria-current', n===i ? 'true':'false'); }); }
    function start(){ if(reduce) return; stop(); timer=setInterval(function(){ if(!paused && !document.hidden) go(index()+1); }, 4500); }
    function stop(){ if(timer) clearInterval(timer); timer=null; }
    function restart(){ stop(); start(); }
    document.getElementById('carPrev').addEventListener('click',function(){ go(index()-1); restart(); });
    document.getElementById('carNext').addEventListener('click',function(){ go(index()+1); restart(); });
    track.addEventListener('scroll',function(){ window.requestAnimationFrame(mark); },{passive:true});
    ['mouseenter','focusin','touchstart'].forEach(function(e){ track.addEventListener(e,function(){ paused=true; },{passive:true}); });
    ['mouseleave','focusout'].forEach(function(e){ track.addEventListener(e,function(){ paused=false; }); });
    track.addEventListener('touchend',function(){ setTimeout(function(){ paused=false; },4000); },{passive:true});
    window.addEventListener('resize',buildDots);
    buildDots(); start();
  })();

  // Contact form (Web3Forms)
  var cf=document.getElementById('contactForm'); if(cf) cf.addEventListener('submit', async function(e){
    e.preventDefault();
    var btn=document.getElementById('submitBtn'), msg=document.getElementById('formMsg');
    btn.textContent='Sending...'; btn.disabled=true; msg.textContent='';
    try{
      var res=await fetch('https://api.web3forms.com/submit',{method:'POST',body:new FormData(this)});
      var data=await res.json();
      if(!data.success) throw new Error();
      msg.style.color='#1f7a3a'; msg.textContent="Message sent. I'll be in touch within 24 hours."; this.reset();
    }catch(err){
      msg.style.color='#b42318'; msg.textContent="Your message couldn't be sent. Please try again, or email blake@nelsonwebco.co.nz.";
    }
    btn.textContent='Send message'; btn.disabled=false;
  });


  (function(){
    var b=document.getElementById('topBtn'); if(!b) return;
    function t(){ b.classList.toggle('show', window.scrollY > 600); }
    window.addEventListener('scroll', t, {passive:true}); t();
    b.addEventListener('click', function(){ window.scrollTo({top:0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}); });
  })();
