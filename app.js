const IC={play:'<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>',
pause:'<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><rect x="5.5" y="4" width="4.5" height="16" rx="1.2"/><rect x="14" y="4" width="4.5" height="16" rx="1.2"/></svg>',
prev:'<svg viewBox="0 0 28 24" width="1.2em" height="1em" fill="currentColor" aria-hidden="true"><path d="M13 5.2v13.6a.8.8 0 0 1-1.2.7L2.6 12.7a.8.8 0 0 1 0-1.4l9.2-6.8a.8.8 0 0 1 1.2.7zM25 5.2v13.6a.8.8 0 0 1-1.2.7l-9.2-6.8a.8.8 0 0 1 0-1.4l9.2-6.8a.8.8 0 0 1 1.2.7z"/></svg>',
next:'<svg viewBox="0 0 28 24" width="1.2em" height="1em" fill="currentColor" aria-hidden="true"><path d="M3 5.2v13.6a.8.8 0 0 0 1.2.7l9.2-6.8a.8.8 0 0 0 0-1.4L4.2 4.5A.8.8 0 0 0 3 5.2zM15 5.2v13.6a.8.8 0 0 0 1.2.7l9.2-6.8a.8.8 0 0 0 0-1.4l-9.2-6.8a.8.8 0 0 0-1.2.7z"/></svg>',
heart:'<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.4C1.5 7.8 3.7 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.3 0 5.5 3.3 4.3 6.6-1.8 4.8-9.3 9.4-9.3 9.4z"/></svg>',
heartOn:'<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.4C1.5 7.8 3.7 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.3 0 5.5 3.3 4.3 6.6-1.8 4.8-9.3 9.4-9.3 9.4z"/></svg>'};
function setHeart(el,on){el.innerHTML=on?IC.heartOn:IC.heart;el.classList.toggle('liked',!!on);el.setAttribute('aria-pressed',on?'true':'false');}
function seed(t){let h=2166136261;for(const c of String(t||'Sonora'))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
function hues(t){const h=seed(t)%360;return [h,(h+40+seed(t+'x')%60)%360,(h+180)%360];}
function ph(it){const n=(it&&it.name)||'Sonora',[a,b]=hues(n),ini=n.replace(/[^\p{L}\p{N} ]/gu,'').trim().split(/\s+/).slice(0,2).map(w=>w[0]||'').join('').toUpperCase()||'♪';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${a},85%,58%)"/><stop offset="1" stop-color="hsl(${b},80%,34%)"/></linearGradient></defs><rect width="300" height="300" fill="url(#g)"/><path d="M196 70v104a28 28 0 1 1-14-24V100l-60 14v76a28 28 0 1 1-14-24V92z" fill="rgba(255,255,255,.28)"/><text x="24" y="270" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="54" font-weight="700" fill="#fff">${ini.replace(/[<&>]/g,'')}</text></svg>`;
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);}
function artOf(it){return it&&it.img?it.img:ph(it);}
const $=s=>document.querySelector(s),audio=$('#audio');let tab='radio';
const favs=()=>JSON.parse(localStorage.favs||'[]'),isFav=id=>favs().some(f=>f.id===id);
function toggleFav(it){let f=favs();f=isFav(it.id)?f.filter(x=>x.id!==it.id):[...f,it];localStorage.favs=JSON.stringify(f);if(tab==='fav')render(f);}
function render(items,keep){if(!keep){$('#list').innerHTML='';if(!items.length)$('#msg').textContent='Kuch nahi mila.';}
 items.forEach(it=>{const li=document.createElement('li');li.innerHTML=`<img alt=""><div class="t">${it.badge?`<i class="bd">${it.badge}</i>`:''}<b></b><small></small></div><button class="p" aria-label="Play">${IC.play}</button><button class="h" aria-label="Favorite"></button>`;
 li.querySelector('b').textContent=it.name;li.querySelector('small').textContent=it.artist||[it.country,it.tags].filter(Boolean).join(' · ')||it.kind;
 {const im=li.querySelector('img');im.src=artOf(it);im.onerror=()=>{im.onerror=null;im.src=ph(it);};setHeart(li.querySelector('.h'),isFav(it.id));}li._it=it;li.querySelector('.p').onclick=()=>it.kind==='ia'?iaPlay(it):play(it);li.querySelector('.h').onclick=e=>{toggleFav(it);setHeart(e.currentTarget,isFav(it.id));};$('#list').append(li);});}
function play(it){$('#embed').innerHTML='';$('#now').textContent=it.name;
 if(it.kind==='spotify'){audio.pause();$('#embed').innerHTML=`<iframe src="https://open.spotify.com/embed/${it.type}/${it.id}" height="${it.type==='track'?152:380}" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;return;}
 if(it.kind==='archive'){$('#embed').innerHTML=`<iframe src="https://archive.org/embed/${it.id}&playlist=1" height="300" allow="autoplay"></iframe>`;audio.pause();return;}
 useMain();if(anOn())audio.crossOrigin='anonymous';else audio.removeAttribute('crossorigin');audio.src=it.url;audio.play().catch(e=>$('#msg').textContent='Stream nahi chala: '+e.message);
 ms(it);}
const IA='https://archive.org';
async function iaPlay(it){$('#now').textContent='Loading '+it.name;const d=await (await fetch(IA+'/metadata/'+it.id)).json();
 const f=d.files.filter(x=>/\.mp3$/i.test(x.name)).sort((a,b)=>(a.track|0)-(b.track|0))[0];if(!f){$('#msg').textContent='Is item me mp3 nahi mila.';return;}
 play({...it,kind:'radio',url:`https://${d.server}${d.dir}/${encodeURIComponent(f.name)}`,name:it.name+' — '+(f.title||f.name)});}
async function all(q){$('#msg').textContent='Search ho raha hai...';$('#list').innerHTML='';const e=encodeURIComponent(q);
 const [ia,rb]=await Promise.allSettled([
  fetch(IA+'/advancedsearch.php?fl[]=identifier&fl[]=title&fl[]=creator&rows=12&output=json&q='+encodeURIComponent(q+' AND mediatype:audio AND format:"VBR MP3" AND collection:(etree OR netlabels OR opensource_audio OR freemusicarchive OR audio_music)')).then(r=>r.json()),
  fetch('https://de1.api.radio-browser.info/json/stations/search?limit=10&hidebroken=true&order=clickcount&reverse=true&name='+e).then(r=>r.json())]);
 $('#msg').textContent='';const L=$('#list');const sec=(t,items,fail)=>{const h=document.createElement('h3');h.textContent=t+(fail?' (load nahi hua)':items.length?'':' (kuch nahi mila)');L.append(h);render(items,true);};
 sec('Free Full Tracks • Internet Archive',ia.value?.response?.docs?.map(d=>({id:d.identifier,name:d.title,artist:[].concat(d.creator||'').join(', '),img:'',kind:'ia',badge:'Archive'}))||[],ia.status!=='fulfilled');
 sec('Radio • Radio Browser',rb.value?.map(s=>({id:s.stationuuid,name:s.name.trim(),url:s.url_resolved||s.url,img:(s.favicon||'').startsWith('https')?s.favicon:'',country:s.country,kind:'radio',badge:'Radio'})).filter(s=>s.url.startsWith('https://'))||[],rb.status!=='fulfilled');}
async function search(params){if(tab==='all')return all(new URLSearchParams(params).get('q')||'');$('#msg').textContent='Load ho raha hai...';$('#list').innerHTML='';
 try{const P=new URLSearchParams(params);
 if(tab==='spotify'){const m=(P.get('q')||'').match(/(track|album|playlist|episode|show|artist)[\/:]([A-Za-z0-9]{22})/);
  if(!m)throw new Error('Spotify track/album/playlist ka link paste karo (open.spotify.com/...).');$('#msg').textContent='';play({kind:'spotify',type:m[1],id:m[2],name:'Spotify '+m[1]});return;}
 if(tab==='radio'){const p=new URLSearchParams({limit:'40',hidebroken:'true',order:'clickcount',reverse:'true'});
  for(const k of['tag','country','language'])if(P.get(k))p.set(k,P.get(k));if(P.get('q'))p.set('name',P.get('q'));
  const j=await (await fetch('https://de1.api.radio-browser.info/json/stations/search?'+p)).json();$('#msg').textContent='';
  render(j.map(s=>({id:s.stationuuid,name:s.name.trim(),url:s.url_resolved||s.url,img:(s.favicon||'').startsWith('https')?s.favicon:'',country:s.country,tags:s.tags,kind:'radio'})).filter(s=>s.url.startsWith('https://')));return;}
 const j=await (await fetch('https://archive.org/advancedsearch.php?fl[]=identifier&fl[]=title&fl[]=creator&rows=20&output=json&q='+encodeURIComponent((P.get('q')||'music')+' AND mediatype:audio'))).json();$('#msg').textContent='';
 render(j.response.docs.map(d=>({id:d.identifier,name:d.title,artist:[].concat(d.creator||'').join(', '),kind:'archive'})));}
 catch(e){$('#msg').textContent=e.message;}}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button').forEach(x=>x.classList.remove('on'));b.classList.add('on');tab=b.dataset.t;$('#presets').style.display=tab==='radio'?'flex':'none';$('#msg').textContent=tab==='spotify'?'Spotify link paste karke Search dabao. Full gaane ke liye Safari mein Spotify login hona chahiye, warna 30s preview.':'';$('#list').innerHTML='';if(tab==='fav')render(favs());});
document.querySelectorAll('#presets button').forEach(b=>b.onclick=()=>search(b.dataset.p));
$('#f').onsubmit=e=>{e.preventDefault();if(tab!=='fav')search('q='+encodeURIComponent($('#q').value));};
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');document.querySelector('nav button[data-t=all]').click();search('q=bollywood');

let cur=null;
function queue(){return [...document.querySelectorAll('#list li')].map(l=>l._it).filter(i=>i&&i.kind!=='spotify');}
function step(d){const q=queue(),i=q.findIndex(x=>x.id===cur?.id),n=q[(i+d+q.length)%q.length];if(n)(n.kind==='ia'?iaPlay(n):play(n));}
function ms(it){cur=it;if(!('mediaSession'in navigator))return;const m=navigator.mediaSession,src=it.img||'./icon-512.png';
 const art=it.img&&it.img.includes('100x100')?[96,128,192,256,384,512].map(z=>({src:it.img.replace('100x100',z+'x'+z),sizes:z+'x'+z,type:'image/jpeg'})):[96,192,512].map(z=>({src,sizes:z+'x'+z}));
 m.metadata=new MediaMetadata({title:it.name,artist:it.artist||it.country||'Sonora',album:it.badge||'Sonora',artwork:art});
 const h={play:()=>A().play(),pause:()=>A().pause(),previoustrack:()=>step(-1),nexttrack:()=>step(1),
  seekto:e=>{if(isFinite(audio.duration)){audio.currentTime=e.seekTime;pos();}},seekbackward:e=>{audio.currentTime=Math.max(0,audio.currentTime-(e.seekOffset||10))},seekforward:e=>{audio.currentTime+= (e.seekOffset||10)}};
 for(const k in h)try{m.setActionHandler(k,h[k])}catch(_){}}
function pos(){const m=navigator.mediaSession;if(m&&m.setPositionState&&isFinite(audio.duration)&&audio.duration>0)try{m.setPositionState({duration:audio.duration,playbackRate:audio.playbackRate,position:Math.min(audio.currentTime,audio.duration)})}catch(_){}}
['loadedmetadata','seeked','ratechange','play'].forEach(e=>audio.addEventListener(e,pos));
audio.addEventListener('play',()=>navigator.mediaSession&&(navigator.mediaSession.playbackState='playing'));
audio.addEventListener('pause',()=>navigator.mediaSession&&(navigator.mediaSession.playbackState='paused'));
audio.addEventListener('ended',()=>step(1));

// Beat Haptics: read-only analysis -> navigator.vibrate (Android only)
const hx=$('#hx'),IOS=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),canV='vibrate' in navigator&&!IOS;let actx,an,buf,last=0,avg=0,graph=false;
function hOn(){return canV&&localStorage.haptics==='1';}
if(!canV){hx.disabled=true;if(IOS)$('#hn').textContent='iPhone par available nahi';}else hx.checked=hOn();
hx.onchange=()=>{localStorage.haptics=hx.checked?'1':'0';if(hx.checked)attach();};
function attach(){if(graph||!anOn())return;try{actx=actx||new AudioContext();const src=actx.createMediaElementSource(audio);an=actx.createAnalyser();an.fftSize=512;
 src.connect(an);an.connect(actx.destination);buf=new Uint8Array(an.frequencyBinCount);graph=true;loop();}catch(e){hx.checked=false;localStorage.haptics='0';}}
function loop(){requestAnimationFrame(loop);if(audio.paused||!analysable||document.hidden)return;an.getByteFrequencyData(buf);bands();if(!hOn())return;let e=0;for(let i=1;i<8;i++)e+=buf[i];e/=7;
 avg=avg*.95+e*.05;const t=performance.now();if(e>avg*1.35&&e>120&&t-last>180){navigator.vibrate(25);last=t;}}
audio.addEventListener('play',()=>{if(anOn()){attach();actx&&actx.resume();}});


const ht=$('#ht');if(!canV){ht.disabled=true;if(IOS)$('#hr').textContent='iPhone/iOS Safari vibrate API support nahi karta.';}
ht.onclick=()=>{const sup='vibrate' in navigator;let r=false;if(sup)r=navigator.vibrate([120,80,120,80,240]);
 $('#hr').textContent=`API supported: ${sup?'yes':'no'} · return: ${r} · userActivation.hasBeenActive: ${navigator.userActivation?navigator.userActivation.hasBeenActive:'n/a'}`;};

// Onboarding
const ob=$('#ob'),standalone=navigator.standalone||matchMedia('(display-mode: standalone)').matches;
if(IOS)$('#obh').textContent='Haptics iPhone par supported nahi.';else if(!canV)$('#obh').textContent='';
function showOb(){ob.hidden=false;}
if(!localStorage.onboard)showOb();
$('#set').onclick=()=>{$('#st').hidden=false;};$('#stc').onclick=()=>{$('#st').hidden=true;};$('#sob').onclick=()=>{$('#st').hidden=true;showOb();};
$('#oy').onclick=()=>{try{const c=actx||(actx=new AudioContext());const b=c.createBuffer(1,1,22050),n=c.createBufferSource();n.buffer=b;n.connect(c.destination);n.start(0);c.resume();}catch(_){}
 localStorage.sound='1';localStorage.onboard='allow';if(canV){localStorage.haptics='1';hx.checked=true;navigator.vibrate(60);}ob.hidden=true;};
$('#on').onclick=()=>{localStorage.sound='0';localStorage.haptics='0';hx.checked=false;localStorage.onboard='later';ob.hidden=true;};
// Analysis availability + silent fallback for non-CORS streams (no reload)
let analysable=false;const fb=document.createElement('audio');fb.controls=true;fb.setAttribute('playsinline','');fb.hidden=true;audio.after(fb);
function A(){return fb.hidden?audio:fb;}
function anOn(){return hOn()||ambOn()||edgeOn();}
function useMain(){if(!fb.hidden){fb.pause();fb.removeAttribute('src');fb.load();fb.hidden=true;audio.hidden=false;}}
audio.addEventListener('playing',()=>{if(anOn()&&audio.crossOrigin==='anonymous'){attach();actx&&actx.resume();}analysable=graph&&audio.crossOrigin==='anonymous';ambState();});
audio.addEventListener('error',()=>{if(!audio.crossOrigin||!audio.src)return;const u=audio.src;analysable=false;
 if(graph){audio.removeAttribute('src');audio.hidden=true;fb.hidden=false;fb.src=u;fb.play().catch(()=>{});}
 else{audio.removeAttribute('crossorigin');audio.src=u;audio.play().catch(()=>{});}});
['play','pause','ended'].forEach(e=>fb.addEventListener(e,()=>audio.dispatchEvent(new Event(e))));
// Ambient background + Edge Lighting
const amb=document.createElement('div');amb.id='amb';amb.innerHTML='<img alt=""><i></i>';document.body.prepend(amb);
const edge=document.createElement('div');edge.id='edge';document.body.append(edge);
const ambImg=amb.querySelector('img'),RM=matchMedia('(prefers-reduced-motion: reduce)');
function ambOn(){return localStorage.ambient!=='0';}
function edgeOn(){return localStorage.edge==='1';}
const ax=$('#ax'),ex=$('#ex');ax.checked=ambOn();ex.checked=edgeOn();amb.hidden=!ambOn();edge.hidden=!edgeOn();
ax.onchange=()=>{localStorage.ambient=ax.checked?'1':'0';amb.hidden=!ax.checked;};
ex.onchange=()=>{localStorage.edge=ex.checked?'1':'0';edge.hidden=!ex.checked;};
const PAL=['#ff1f5a','#6a2cff','#ff7a00'];
function setPal(c){c.forEach((v,i)=>document.documentElement.style.setProperty('--a'+i,v));}
setPal(PAL);
function phPal(it){const L=document.documentElement.dataset.theme==='light';return hues(it&&it.name).map(h=>`hsl(${h},95%,${L?42:55}%)`);}
let palIt=null;function colors(src){if(!src){setPal(palIt?phPal(palIt):PAL);ambImg.src=ph(palIt);return;}const im=new Image();im.crossOrigin='anonymous';
 im.onload=()=>{ambImg.src=src;try{const c=document.createElement('canvas');c.width=c.height=24;const x=c.getContext('2d');x.drawImage(im,0,0,24,24);
  const d=x.getImageData(0,0,24,24).data,bk={};for(let i=0;i<d.length;i+=4){const l=d[i]+d[i+1]+d[i+2];if(l<60||l>700)continue;const k=(d[i]>>5)+','+(d[i+1]>>5)+','+(d[i+2]>>5);(bk[k]=bk[k]||[0,0,0,0]);bk[k][0]+=d[i];bk[k][1]+=d[i+1];bk[k][2]+=d[i+2];bk[k][3]++;}
  const t=Object.values(bk).sort((a,b)=>b[3]-a[3]).slice(0,3).map(v=>`rgb(${v[0]/v[3]|0},${v[1]/v[3]|0},${v[2]/v[3]|0})`);setPal(t.length?[...t,...PAL].slice(0,3):PAL);}catch(_){setPal(palIt?phPal(palIt):PAL);}};
 im.onerror=()=>{setPal(palIt?phPal(palIt):PAL);ambImg.src=ph(palIt);};im.src=src;}
const _play=play;play=function(it){palIt=it;colors(it.img);if(it.kind!=='radio')analysable=false;return _play(it);};
let bv=[0,0,0];const R=document.documentElement.style;
function bands(){if(RM.matches||(!ambOn()&&!edgeOn()))return;const n=buf.length,seg=(a,b)=>{let s=0;for(let i=a;i<b;i++)s+=buf[i];return s/(b-a)/255;};
 const t=[seg(1,8),seg(8,40),seg(40,n/2|0)];bv=bv.map((v,i)=>v*.8+t[i]*.2);
 R.setProperty('--s',(1.05+bv[0]*.25).toFixed(3));R.setProperty('--b',(.55+bv[1]*.6).toFixed(3));R.setProperty('--h',(bv[2]*60|0)+'deg');R.setProperty('--e',(.25+bv[0]*.75).toFixed(3));}
function ambState(){const live=analysable&&!A().paused&&!RM.matches,p=document.hidden||RM.matches;[amb,edge].forEach(el=>{el.classList.toggle('live',live);el.classList.toggle('paused',p);});}
setInterval(ambState,500);document.addEventListener('visibilitychange',ambState);

// Mini player + Now Playing sheet
const np=$('#np'),fmt=t=>isFinite(t)?(t/60|0)+':'+String(t%60|0).padStart(2,'0'):'--:--';
function sync(){const a=A(),it=cur||{};const pl=!a.paused;$('#mpp').innerHTML=$('#npp').innerHTML=pl?IC.pause:IC.play;
 $('#nt').textContent=it.name||'—';$('#na').textContent=it.artist||it.country||'';$('#mar').textContent=it.artist||it.country||it.badge||'';
 const art=cur?artOf(it):'./icon-512.png';$('#nart').src=art;$('#mart').src=cur?art:'./icon-192.png';$('#nart').onerror=$('#mart').onerror=function(){this.onerror=null;this.src=ph(it);};
 setHeart($('#nfav'),it.id&&isFav(it.id));
 const sk=$('#seek');if(isFinite(a.duration)&&a.duration>0){sk.disabled=false;if(!sk._drag)sk.value=a.currentTime/a.duration*100;}else{sk.disabled=true;sk.value=0;}
 $('#tc').textContent=fmt(a.currentTime);$('#td').textContent=isFinite(a.duration)?fmt(a.duration):'LIVE';}
['play','pause','timeupdate','loadedmetadata','ended'].forEach(e=>{audio.addEventListener(e,sync);fb.addEventListener(e,sync);});
const tp=()=>{const a=A();if(!a.src)return;a.paused?a.play():a.pause();};
$('#mpp').onclick=e=>{e.stopPropagation();tp();};$('#npp').onclick=tp;$('#nprev').onclick=()=>step(-1);$('#nnext').onclick=()=>step(1);
$('#nfav').onclick=()=>{if(cur){toggleFav(cur);sync();}};
$('#player').onclick=()=>{np.hidden=false;requestAnimationFrame(()=>np.classList.add('up'));sync();};
function closeNp(){np.classList.remove('up');setTimeout(()=>np.hidden=true,250);}
$('#npc').onclick=closeNp;let y0=null;np.addEventListener('touchstart',e=>{y0=e.touches[0].clientY},{passive:true});
np.addEventListener('touchend',e=>{if(y0!==null&&e.changedTouches[0].clientY-y0>90&&e.target.id!=='seek')closeNp();y0=null;});
const sk=$('#seek');sk.oninput=()=>{sk._drag=true;};sk.onchange=()=>{const a=A();if(isFinite(a.duration))a.currentTime=sk.value/100*a.duration;sk._drag=false;};
const _p2=play;play=function(it){const r=_p2(it);cur=it;sync();return r;};

const thm=$('#thm');thm.value=document.documentElement.dataset.theme;
thm.onchange=()=>{const t=thm.value;localStorage.theme=t;document.documentElement.dataset.theme=t;document.querySelector('meta[name=theme-color]').content=t==='light'?'#ffffff':'#0b0b0f';
 const s=document.querySelector('meta[name=apple-mobile-web-app-status-bar-style]');if(s)s.content=t==='light'?'default':'black-translucent';};

$('#nprev').innerHTML=IC.prev;$('#nnext').innerHTML=IC.next;$('#npp').innerHTML=$('#mpp').innerHTML=IC.play;setHeart($('#nfav'),false);
thm.addEventListener('change',()=>{if(palIt&&!palIt.img)setPal(phPal(palIt));});
