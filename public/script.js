const $=(selector,context=document)=>context.querySelector(selector);
const $$=(selector,context=document)=>[...context.querySelectorAll(selector)];
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

const nav=$('#siteNav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>60),{passive:true});

const hero=$('.astra-hero');
const stage=$('.astra-sticky');
const cover=$('#astraCover');
const heroVideo=$('.cover-video');
const progressLabel=$('#heroProgress');
const blueBreak=$('.blue-break');
let frameRequested=false;

if(reducedMotion)heroVideo?.pause();

function updateAstra(){
  frameRequested=false;
  if(reducedMotion)return;
  const heroMax=Math.max(hero.offsetHeight-innerHeight,1);
  const heroProgress=Math.min(Math.max(-hero.getBoundingClientRect().top/heroMax,0),1);
  const zoomRaw=Math.min(heroProgress/.46,1);
  const enter=zoomRaw*zoomRaw*(3-2*zoomRaw);
  const scale=1+enter*.16;
  cover.style.setProperty('--cover-scale',scale.toFixed(3));
  cover.style.setProperty('--cover-y','0px');
  cover.style.setProperty('--cover-rx','0deg');
  cover.style.setProperty('--cover-radius','0px');
  cover.style.setProperty('--image-y',`${heroProgress*-7}vh`);
  cover.style.setProperty('--image-scale',String(1.04+enter*.1));
  stage.style.setProperty('--progress',`${heroProgress*100}%`);
  progressLabel.textContent=String(Math.round(heroProgress*100)).padStart(2,'0');

  const breakRect=blueBreak.getBoundingClientRect();
  const breakProgress=Math.min(Math.max((innerHeight-breakRect.top)/(innerHeight+breakRect.height),0),1);
  blueBreak.style.setProperty('--break-y',`${(breakProgress-.5)*14}vh`);
}

function requestAstra(){if(!frameRequested){frameRequested=true;requestAnimationFrame(updateAstra)}}
addEventListener('scroll',requestAstra,{passive:true});
addEventListener('resize',requestAstra,{passive:true});

if(!reducedMotion){
  cover.addEventListener('pointermove',event=>{
    const bounds=cover.getBoundingClientRect();
    const x=(event.clientX-bounds.left)/bounds.width-.5;
    const y=(event.clientY-bounds.top)/bounds.height-.5;
    cover.style.setProperty('--mx',`${x*14}px`);
    cover.style.setProperty('--my',`${y*10}px`);
    cover.style.setProperty('--cover-ry',`${x*5}deg`);
  });
  cover.addEventListener('pointerleave',()=>{
    cover.style.setProperty('--mx','0px');
    cover.style.setProperty('--my','0px');
    cover.style.setProperty('--cover-ry','0deg');
  });
  updateAstra();
}

document.body.classList.add('motion-ready');
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}
}),{threshold:.13});
$$('.reveal').forEach(element=>revealObserver.observe(element));
setTimeout(()=>$$('.reveal').forEach(element=>element.classList.add('visible')),1400);

const routes=[
  {area:'NAHA · 17:40',title:'시장과 골목 사이,<br />여행의 첫 저녁',desc:'마키시 시장에서 제철 식재료를 맛보고, 츠보야 도자기 거리와 작은 아와모리 바를 걷습니다.',image:'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?auto=format&fit=crop&w=1500&q=86'},
  {area:'YOMITAN · 10:20',title:'산호빛 바다를 따라<br />서쪽 해안 드라이브',desc:'사람이 적은 해변과 작은 로스터리, 잔파곶의 긴 수평선을 여유롭게 이어갑니다.',image:'https://images.unsplash.com/photo-1583212226174-d3be61463c8d?auto=format&fit=crop&w=1500&q=86'},
  {area:'YANBARU · 08:30',title:'숲의 숨결과<br />오래된 류큐 마을',desc:'얀바루 숲을 현지 가이드와 걷고, 전통 가옥에서 섬 채소로 차린 점심을 만납니다.',image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1500&q=86'},
  {area:'NANJO · 14:10',title:'남쪽 바다와<br />마지막 고요',desc:'세이화 우타키의 숲과 남쪽 해안의 카페를 지나, 수평선 위로 지는 해를 바라봅니다.',image:'https://images.unsplash.com/photo-1757803143865-dc0a9d681623?auto=format&fit=crop&w=1500&q=86'}
];

$$('[data-route]').forEach(button=>button.addEventListener('click',()=>{
  const index=Number(button.dataset.route);
  const route=routes[index];
  $$('[data-route]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-selected',String(active))});
  $('#routeNumber').textContent=String(index+1).padStart(2,'0');
  $('#routeArea').textContent=route.area;
  $('#routeTitle').innerHTML=route.title;
  $('#routeDesc').textContent=route.desc;
  $('#routeVisual').style.backgroundImage=`linear-gradient(0deg,rgba(0,43,80,.72),transparent 72%),url("${route.image}")`;
}));

$$('[data-package-filter]').forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.packageFilter;
  $$('[data-package-filter]').forEach(item=>item.classList.toggle('active',item===button));
  $$('[data-package-category]').forEach(card=>{
    card.classList.toggle('filtered-out',filter!=='all'&&card.dataset.packageCategory!==filter);
  });
}));

const modal=$('#plannerModal');
$$('[data-open-planner]').forEach(button=>button.addEventListener('click',()=>{
  $('.planner-result').classList.remove('visible');
  $('#plannerMessage').textContent='';
  modal.showModal();
}));
$('.modal-close').addEventListener('click',()=>modal.close());
modal.addEventListener('click',event=>{if(event.target===modal)modal.close()});
$$('[data-product]').forEach(button=>button.addEventListener('click',()=>{
  $('#plannerResult').textContent=`${button.dataset.product} 상품 상담을 준비할게요. 인원과 희망 출발일을 확인해 맞춤 견적을 보내드립니다.`;
  $('.planner-result').classList.add('visible');
  $('#plannerMessage').textContent='';
  modal.showModal();
  $('#plannerEmail').focus();
}));
$$('[data-choice]').forEach(button=>button.addEventListener('click',()=>{
  $('#plannerResult').textContent=`“${button.dataset.choice}”을 중심으로 4일의 오키나와 여정을 준비할게요.`;
  $('.planner-result').classList.add('visible');
  $('#plannerEmail').focus();
}));
$('#plannerSubmit').addEventListener('click',()=>{
  const email=$('#plannerEmail');
  if(!email.value||!email.checkValidity()){email.focus();$('#plannerMessage').textContent='이메일 주소를 확인해 주세요.';return}
  $('#plannerMessage').textContent='완료되었습니다. 곧 첫 번째 여정을 보내드릴게요.';
});
