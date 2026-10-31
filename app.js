const $=s=>document.querySelector(s),audio=$('#audio');let tab='radio';
const favs=()=>JSON.parse(localStorage.favs||'[]'),isFav=id=>favs().some(f=>f.id===id);
function toggleFav(it){let f=favs();f=isFav(it.id)?f.filter(x=>x.id!==it.id):[...f,it];localStorage.favs=JSON.stringify(f);if(tab==='fav')render(f);}
function render(items,keep){if(!keep){$('#list').innerHTML='';if(!items.length)$('#msg').textContent='Kuch nahi mila.';}
 items.forEach(it=>{const li=document.createElement('li');li.innerHTML=`<img src="${it.img||'./icon-192.png'}" onerror="this.src='./icon-192.png'"><div class="t">${it.badge?`<i class="bd">${it.badge}</i>`:''}<b></b><small></small></div><button class="p">▶</button><button class="h">${isFav(it.id)?'❤️':'🤍'}</button>`;
 li.querySelector('b').textContent=it.name;li.querySelector('small').textContent=it.artist||[it.country,it.tags].filter(Boolean).join(' · ')||it.kind;
 li._it=it;li.querySelector('.p').onclick=()=>it.kind==='ia'?iaPlay(it):play(it);li.querySelector('.h').onclick=e=>{toggleFav(it);e.target.textContent=isFav(it.id)?'❤️':'🤍'};$('#list').append(li);});}
function play(it){$('#embed').innerHTML='';$('#now').textContent='▶ '+it.name;
 if(it.kind==='spotify'){audio.pause();$('#embed').innerHTML=`<iframe src="https://open.spotify.com/embed/${it.type}/${it.id}" height="${it.type==='track'?152:380}" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;return;}
 if(it.kind==='archive'){$('#embed').innerHTML=`<iframe src="https://archive.org/embed/${it.id}&playlist=1" height="300" allow="autoplay"></iframe>`;audio.pause();return;}
 if(hOn())audio.crossOrigin='anonymous';else audio.removeAttribute('crossorigin');audio.src=it.url;audio.play().catch(e=>$('#msg').textContent='Stream nahi chala: '+e.message);
 ms(it);}
const IA='https://archive.org';
async function iaPlay(it){$('#now').textContent='Loading '+it.name;const d=await (await fetch(IA+'/metadata/'+it.id)).json();
 const f=d.files.filter(x=>/\.mp3$/i.test(x.name)).sort((a,b)=>(a.track|0)-(b.track|0))[0];if(!f){$('#msg').textContent='Is item me mp3 nahi mila.';return;}
 play({...it,kind:'radio',url:`https://${d.server}${d.dir}/${encodeURIComponent(f.name)}`,name:it.name+' — '+(f.title||f.name)});}
async function all(q){$('#msg').textContent='Search ho raha hai...';$('#list').innerHTML='';const e=encodeURIComponent(q);
 const [it,ia,rb]=await Promise.allSettled([
  fetch('https://itunes.apple.com/search?media=music&entity=song&limit=10&term='+e).then(r=>r.json()),
  fetch(IA+'/advancedsearch.php?fl[]=identifier&fl[]=title&fl[]=creator&rows=12&output=json&q='+encodeURIComponent(q+' AND mediatype:audio AND format:"VBR MP3" AND collection:(etree OR netlabels OR opensource_audio OR freemusicarchive OR audio_music)')).then(r=>r.json()),
  fetch('https://de1.api.radio-browser.info/json/stations/search?limit=10&hidebroken=true&order=clickcount&reverse=true&name='+e).then(r=>r.json())]);
 $('#msg').textContent='';const L=$('#list');const sec=(t,items,fail)=>{const h=document.createElement('h3');h.textContent=t+(fail?' (load nahi hua)':items.length?'':' (kuch nahi mila)');L.append(h);render(items,true);};
 sec('Songs • iTunes preview (30s)',it.value?.results?.map(x=>({id:'it'+x.trackId,name:x.trackName,artist:x.artistName,img:x.artworkUrl100,url:x.previewUrl,kind:'radio',badge:'iTunes'})).filter(x=>x.url)||[],it.status!=='fulfilled');
 sec('Free Full Tracks • Internet Archive',ia.value?.response?.docs?.map(d=>({id:d.identifier,name:d.title,artist:[].concat(d.creator||'').join(', '),img:IA+'/services/img/'+d.identifier,kind:'ia',badge:'Archive'}))||[],ia.status!=='fulfilled');
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
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button').forEach(x=>x.classList.remove('on'));b.classList.add('on');tab=b.dataset.t;$('#presets').style.display=tab==='radio'?'flex':'none';$('#msg').textContent=tab==='spotify'?'Spotify link paste karke Search dabao.':'';$('#list').innerHTML='';if(tab==='fav')render(favs());});
document.querySelectorAll('#presets button').forEach(b=>b.onclick=()=>search(b.dataset.p));
$('#f').onsubmit=e=>{e.preventDefault();if(tab!=='fav')search('q='+encodeURIComponent($('#q').value));};
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');document.querySelector('nav button[data-t=all]').click();search('q=bollywood');

let cur=null;
function queue(){return [...document.querySelectorAll('#list li')].map(l=>l._it).filter(i=>i&&i.kind!=='spotify');}
function step(d){const q=queue(),i=q.findIndex(x=>x.id===cur?.id),n=q[(i+d+q.length)%q.length];if(n)(n.kind==='ia'?iaPlay(n):play(n));}
function ms(it){cur=it;if(!('mediaSession'in navigator))return;const m=navigator.mediaSession,src=it.img||'./icon-512.png';
 const art=it.img&&it.img.includes('100x100')?[96,128,192,256,384,512].map(z=>({src:it.img.replace('100x100',z+'x'+z),sizes:z+'x'+z,type:'image/jpeg'})):[96,192,512].map(z=>({src,sizes:z+'x'+z}));
 m.metadata=new MediaMetadata({title:it.name,artist:it.artist||it.country||'Sonora',album:it.badge||'Sonora',artwork:art});
 const h={play:()=>audio.play(),pause:()=>audio.pause(),previoustrack:()=>step(-1),nexttrack:()=>step(1),
  seekto:e=>{if(isFinite(audio.duration)){audio.currentTime=e.seekTime;pos();}},seekbackward:e=>{audio.currentTime=Math.max(0,audio.currentTime-(e.seekOffset||10))},seekforward:e=>{audio.currentTime+= (e.seekOffset||10)}};
 for(const k in h)try{m.setActionHandler(k,h[k])}catch(_){}}
function pos(){const m=navigator.mediaSession;if(m&&m.setPositionState&&isFinite(audio.duration)&&audio.duration>0)try{m.setPositionState({duration:audio.duration,playbackRate:audio.playbackRate,position:Math.min(audio.currentTime,audio.duration)})}catch(_){}}
['loadedmetadata','seeked','ratechange','play'].forEach(e=>audio.addEventListener(e,pos));
audio.addEventListener('play',()=>navigator.mediaSession&&(navigator.mediaSession.playbackState='playing'));
audio.addEventListener('pause',()=>navigator.mediaSession&&(navigator.mediaSession.playbackState='paused'));
audio.addEventListener('ended',()=>step(1));

// Beat Haptics: read-only analysis -> navigator.vibrate (Android only)
const hx=$('#hx'),canV='vibrate' in navigator&&!/iPhone|iPad|iPod/.test(navigator.userAgent);let actx,an,buf,last=0,avg=0,graph=false;
function hOn(){return canV&&localStorage.haptics==='1';}
if(!canV){hx.disabled=true;$('#hn').textContent='iPhone par available nahi';}else hx.checked=hOn();
hx.onchange=()=>{localStorage.haptics=hx.checked?'1':'0';if(hx.checked)attach();};
function attach(){if(graph||!hOn())return;try{actx=actx||new AudioContext();const src=actx.createMediaElementSource(audio);an=actx.createAnalyser();an.fftSize=512;
 src.connect(an);an.connect(actx.destination);buf=new Uint8Array(an.frequencyBinCount);graph=true;loop();}catch(e){hx.checked=false;localStorage.haptics='0';}}
function loop(){requestAnimationFrame(loop);if(!hOn()||audio.paused)return;an.getByteFrequencyData(buf);let e=0;for(let i=1;i<8;i++)e+=buf[i];e/=7;
 avg=avg*.95+e*.05;const t=performance.now();if(e>avg*1.35&&e>120&&t-last>180){navigator.vibrate(25);last=t;}}
audio.addEventListener('play',()=>{if(hOn()){attach();actx&&actx.resume();}});
audio.addEventListener('error',()=>{if(graph&&audio.crossOrigin){localStorage.haptics='0';$('#msg').textContent='Ye stream Beat Haptics support nahi karta, haptics band karke reload ho raha hai...';setTimeout(()=>location.reload(),1500);}});
