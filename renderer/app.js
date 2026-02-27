// ── Colour palette for project dots ──────────────────────────────────────
const DOT = {
  amber:  '#f0a843',
  blue:   '#5a9ef5',
  green:  '#5acc8a',
  red:    '#e05a5a',
  purple: '#a78bfa',
  cyan:   '#22d3ee',
  pink:   '#f472b6',
  orange: '#fb923c',
  teal:   '#2dd4bf',
  indigo: '#818cf8',
  sky:    '#38bdf8',
};

const BAR = ['#f0a843','#5a9ef5','#5acc8a','#a78bfa','#e05a5a','#22d3ee','#f472b6','#fb923c'];
function meetingColor(title){ let h=0; for(let i=0;i<title.length;i++) h=(h*31+title.charCodeAt(i))>>>0; return BAR[h%BAR.length]; }
const ICONS = ['globe','link','github','figma','code-2','terminal','folder','database','monitor','smartphone','mail','book','youtube','music','image','box','cloud','coffee','settings','send','layers','trello','slack','pen-tool'];

let DB = { projects:[], settings:{ accent:'#f0a843', font:'Syne', kanriPath:'', joplinPath:'', markTextPath:'', lastActive:null } };

// Kanri data / preview state
let kanriData = null;
let kanriPreviewing = false;
let boardView = 'overview';

// In-memory cache for Joplin notes keyed by project id
const joplinCache = {};

// ── Executable detection ──────────────────────────────────────────────────
function detectKanri(){
  if(!window.require) return '';
  const fs = window.require('fs'), os = window.require('os'), path = window.require('path');
  const h = os.homedir();
  const candidates = [
    path.join(h,'AppData','Local','Programs','Kanri','Kanri.exe'),
    path.join(process.env.PROGRAMFILES||'','Kanri','Kanri.exe'),
    path.join(process.env['PROGRAMFILES(X86)']||'','Kanri','Kanri.exe'),
  ];
  for(const c of candidates){ try{ if(fs.existsSync(c)) return c; }catch(e){} }
  return '';
}

function detectJoplin(){
  if(!window.require) return '';
  const fs = window.require('fs'), os = window.require('os'), path = window.require('path');
  const h = os.homedir();
  const candidates = [
    path.join(h,'AppData','Local','Programs','Joplin','Joplin.exe'),
    path.join(process.env.PROGRAMFILES||'','Joplin','Joplin.exe'),
    path.join(process.env['PROGRAMFILES(X86)']||'','Joplin','Joplin.exe'),
  ];
  for(const c of candidates){ try{ if(fs.existsSync(c)) return c; }catch(e){} }
  return '';
}

function detectMarkText(){
  if(!window.require) return '';
  const fs = window.require('fs'), os = window.require('os'), path = window.require('path');
  const h = os.homedir();
  const candidates = [
    path.join(h,'AppData','Local','Programs','marktext','marktext.exe'),
    path.join(h,'AppData','Local','marktext','marktext.exe'),
    path.join(h,'AppData','Local','Programs','MarkText','MarkText.exe'),
    path.join(process.env.PROGRAMFILES||'','marktext','marktext.exe'),
    path.join(process.env['PROGRAMFILES(X86)']||'','marktext','marktext.exe'),
  ];
  for(const c of candidates){ try{ if(fs.existsSync(c)) return c; }catch(e){} }
  return '';
}

let active = null, editNote = null, editProj = null, pickCol = 'amber', pickIcon = 'globe', calView = 'today';

// ── Persistence ───────────────────────────────────────────────────────────
function save(){ localStorage.setItem('hub5', JSON.stringify(DB)); }
function load(){
  try{ const d=localStorage.getItem('hub5'); if(d) DB=JSON.parse(d); else seed(); }
  catch(e){ seed(); }
  if(!DB.settings.markTextPath) DB.settings.markTextPath='';
  if(DB.projects.length){
    const last=DB.settings.lastActive;
    active=(last&&DB.projects.find(p=>p.id===last))?last:DB.projects[0].id;
  }
  applyTheme();
}
function seed(){
  const work=np('Work','blue',true);
  work.links=[{id:uid(),icon:'github',name:'GitHub',url:'https://github.com'},{id:uid(),icon:'figma',name:'Figma',url:'https://figma.com'},{id:uid(),icon:'mail',name:'Gmail',url:'https://mail.google.com'}];
  work.tasks=[{id:uid(),text:'Import your .ics calendar file',done:false},{id:uid(),text:'Connect Kanri in settings',done:false}];
  work.events=[
    {id:uid(),title:'Morning standup',time:'9:00 AM',endTime:'9:15 AM',joinUrl:'https://meet.google.com',note:'Daily sync',dateStr:localDateStr(new Date()),dayLabel:'Today',isToday:true},
    {id:uid(),title:'Design review',time:'2:00 PM',endTime:'3:00 PM',joinUrl:'https://meet.google.com',note:'Figma handoff',dateStr:localDateStr(new Date()),dayLabel:'Today',isToday:true},
    {id:uid(),title:'Sprint planning',time:'10:00 AM',endTime:'11:00 AM',joinUrl:'',note:'',dateStr:localDateStr(new Date(Date.now()+86400000)),dayLabel:'Tomorrow',isToday:false},
  ];
  work.folders=[{id:uid(),name:'Docs',path:'C:\\Users\\Dev\\Documents\\Work'}];
  work.docFolders=[{id:uid(),name:'Notes Vault',path:'C:\\Users\\Dev\\Documents\\Notes'}];

  const personal=np('Personal','amber',false);
  personal.links=[{id:uid(),icon:'youtube',name:'YouTube',url:'https://youtube.com'},{id:uid(),icon:'coffee',name:'Reddit',url:'https://reddit.com'}];
  personal.tasks=[{id:uid(),text:'Add your personal links',done:false}];
  personal.notes=[{id:uid(),title:'Ideas',body:'Side project brainstorm...',date:ds()}];
  personal.docFolders=[];

  DB.projects=[work,personal]; active=work.id; save();
}
function np(name,color,workMode){ return {id:uid(),name,color,workMode:!!workMode,joplin:'',kanriBoard:'',links:[],tasks:[],notes:[],events:[],folders:[],docFolders:[]}; }
function uid(){ return Math.random().toString(36).slice(2,9); }
function ds(){ return new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'}); }
function localDateStr(d){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function ga(){ return DB.projects.find(p=>p.id===active); }
function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function escJS(s){ return String(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\r/g,'\\r').replace(/\n/g,'\\n').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029'); }
function ri(){ if(window.lucide) lucide.createIcons(); }

// ── Theme ─────────────────────────────────────────────────────────────────
function applyTheme(){
  const s=DB.settings;
  document.documentElement.style.setProperty('--accent',s.accent);
  const r=parseInt(s.accent.slice(1,3),16),g=parseInt(s.accent.slice(3,5),16),b=parseInt(s.accent.slice(5,7),16);
  document.documentElement.style.setProperty('--accent-dim',`rgba(${r},${g},${b},0.10)`);
  document.documentElement.style.setProperty('--accent-glow',`rgba(${r},${g},${b},0.05)`);
  document.documentElement.style.setProperty('--font',`'${s.font}', sans-serif`);
  const ap=document.getElementById('acc-pick'); if(ap) ap.value=s.accent;
  const apv=document.getElementById('acc-prev'); if(apv) apv.style.background=s.accent;
  const ah=document.getElementById('acc-hex'); if(ah) ah.textContent=s.accent;
  document.querySelectorAll('.font-opt').forEach(e=>e.classList.toggle('sel',e.dataset.f===s.font));
  const kp=document.getElementById('kanri-path'); if(kp&&s.kanriPath) kp.value=s.kanriPath;
  const jp=document.getElementById('joplin-path'); if(jp&&s.joplinPath) jp.value=s.joplinPath;
  const mp=document.getElementById('marktext-path'); if(mp&&s.markTextPath) mp.value=s.markTextPath;
}
function setAccent(v){ DB.settings.accent=v; applyTheme(); save(); }
function setFont(el){ DB.settings.font=el.dataset.f; applyTheme(); save(); }
function savePaths(){
  DB.settings.kanriPath=document.getElementById('kanri-path').value;
  DB.settings.joplinPath=document.getElementById('joplin-path').value;
  const tokEl=document.getElementById('joplin-token'); if(tokEl) DB.settings.joplinToken=tokEl.value.trim();
  const mp=document.getElementById('marktext-path'); if(mp) DB.settings.markTextPath=mp.value.trim();
  loadKanriData();
  save();
}
function detectKanriPath(){ const f=detectKanri(); if(f){ document.getElementById('kanri-path').value=f; savePaths(); alert('Detected Kanri at '+f); } else alert('Unable to auto-detect Kanri. Please enter the path manually.'); }
function detectJoplinPath(){ const f=detectJoplin(); if(f){ document.getElementById('joplin-path').value=f; savePaths(); alert('Detected Joplin at '+f); } else alert('Unable to auto-detect Joplin. Please enter the path manually.'); }
function detectMarkTextPath(){ const f=detectMarkText(); if(f){ document.getElementById('marktext-path').value=f; savePaths(); alert('Detected MarkText at '+f); } else alert('Unable to auto-detect MarkText. Please enter the path manually.'); }

// ── MarkText ──────────────────────────────────────────────────────────────
function openMarkText(folderPath){
  let mt=DB.settings.markTextPath||'';
  if(!mt){ mt=detectMarkText(); if(mt){ DB.settings.markTextPath=mt; save(); } }
  if(!mt){ openOv('ov-settings'); return; }
  if(window.require){
    try{
      const fs=window.require('fs'), path=window.require('path');
      if(fs.existsSync(mt)&&fs.statSync(mt).isDirectory()){ const exe=path.join(mt,'marktext.exe'); if(fs.existsSync(exe)) mt=exe; }
      const args=folderPath?[folderPath]:[];
      window.require('child_process').spawn(mt,args,{detached:true});
      return;
    }catch(e){}
  }
  openApp(mt);
}

// ── Kanri ─────────────────────────────────────────────────────────────────
function loadKanriData(){
  kanriData=null;
  if(!window.require) return;
  const fs=window.require('fs'), path=window.require('path');
  let kp=DB.settings.kanriPath||''; if(!kp) return;
  try{ if(fs.statSync(kp).isFile()) kp=path.dirname(kp); }catch(e){}
  const candidates=[path.join(kp,'data','kanri-data.json'),path.join(path.dirname(kp),'data','kanri-data.json')];
  for(const c of candidates){ try{ if(fs.existsSync(c)){ kanriData=JSON.parse(fs.readFileSync(c,'utf8')); return; } }catch(e){} }
}
function getKanriBoards(){ if(!kanriData) return []; if(Array.isArray(kanriData.boards)) return kanriData.boards; if(Array.isArray(kanriData)) return kanriData; return []; }
function populateKanriSelector(selected){
  const sel=document.getElementById('proj-kanri'); if(!sel) return;
  sel.innerHTML='';
  const none=document.createElement('option'); none.value=''; none.textContent='(none)'; sel.appendChild(none);
  getKanriBoards().forEach(b=>{ const o=document.createElement('option'); o.value=b.id||b.name||b.title||''; o.textContent=b.name||b.title||o.value; if(o.value===selected) o.selected=true; sel.appendChild(o); });
}
function setBoardView(v){ boardView=v; render(); }

// ── Joplin ────────────────────────────────────────────────────────────────
async function loadJoplinForProject(p){
  if(!p||!p.joplin||!DB.settings.joplinToken) return;
  const token=DB.settings.joplinToken;
  try{
    const resp=await fetch(`http://localhost:41184/folders?token=${encodeURIComponent(token)}`);
    if(!resp.ok) throw new Error();
    const folders=await resp.json();
    const folder=(folders.items||folders).find(f=>f.title===p.joplin||f.name===p.joplin);
    if(!folder){ joplinCache[p.id]={notes:[],offline:false}; render(); return; }
    const nr=await fetch(`http://localhost:41184/folders/${folder.id}/notes?token=${encodeURIComponent(token)}&fields=id,title,body,updated_time`);
    if(!nr.ok) throw new Error();
    const nd=await nr.json();
    joplinCache[p.id]={notes:nd.items||nd,offline:false};
  }catch(err){ joplinCache[p.id]=joplinCache[p.id]||{notes:[]}; joplinCache[p.id].offline=true; }
  render();
}
function openJoplinNote(id){ if(!id) return; const url=`joplin://x-callback-url/openNote?id=${encodeURIComponent(id)}`; if(window.require){ try{ window.require('child_process').exec(`start ${url}`); return; }catch(e){} } openURL(url); }

// ── Data export / import ──────────────────────────────────────────────────
function exportData(){
  try{
    const blob=new Blob([JSON.stringify(DB,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url; a.download='workhub-data.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }catch(e){ alert('Failed to export data: '+e); }
}
function triggerImportData(){ document.getElementById('data-inp')?.click(); }
function importData(e){
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try{
      const obj=JSON.parse(ev.target.result);
      if(obj&&typeof obj==='object'&&Array.isArray(obj.projects)&&obj.settings){
        if(confirm('This will replace your current data. Continue?')){ DB=obj; save(); render(); }
      } else throw new Error('Invalid data format');
    }catch(err){ alert('Import failed: '+err.message); }
    e.target.value='';
  };
  reader.onerror=()=>{ alert('Failed to read file'); e.target.value=''; };
  reader.readAsText(file);
}

// ── Render ────────────────────────────────────────────────────────────────
function render(){ renderSidebar(); renderMain(); ri(); }

function renderSidebar(){
  const list=document.getElementById('proj-list'); list.innerHTML='';
  DB.projects.forEach(p=>{
    const el=document.createElement('div');
    el.className='proj-item'+(p.id===active?' active':'');
    el.innerHTML=`<div class="proj-dot" style="background:${DOT[p.color]||'var(--accent)'}"></div><div class="proj-name">${esc(p.name)}</div>${p.workMode?`<span class="proj-badge">work</span>`:''}<div class="proj-edit" data-action="edit"><i data-lucide="pencil"></i></div><div class="proj-del" data-action="del"><i data-lucide="x"></i></div>`;
    el.addEventListener('click',e=>{
      const action=e.target.closest('[data-action]')?.dataset?.action;
      if(action==='del'){ e.stopPropagation(); delProj(p.id); }
      else if(action==='edit'){ e.stopPropagation(); editProject(p.id); }
      else{ active=p.id; DB.settings.lastActive=p.id; calView='today'; kanriPreviewing=false; boardView='overview'; save(); render(); }
    });
    list.appendChild(el);
  });
}

function renderMain(){
  const p=ga();
  const mc=document.getElementById('main-content');
  mc.innerHTML='';

  if(kanriPreviewing){
    document.getElementById('ptitle').textContent='Kanri Boards';
    document.getElementById('pmeta').textContent='';
    renderKanriPreview(mc);
    return;
  }

  if(!p){ document.getElementById('ptitle').textContent='Select a project'; return; }
  document.getElementById('ptitle').innerHTML=`${esc(p.name)} <span style="color:${DOT[p.color]||'var(--accent)'};margin-left:2px">·</span>`;
  document.getElementById('pmeta').textContent='';

  if(renderMain.prevProj!==p.id){
    if(p.joplin&&DB.settings.joplinToken) loadJoplinForProject(p);
    renderMain.prevProj=p.id;
  }

  const tabs=document.getElementById('page-tabs');
  if(p.kanriBoard){
    tabs.innerHTML=`<button class="cbtn ${boardView==='overview'?'tab-on':''}" onclick="setBoardView('overview')">Overview</button>
                    <button class="cbtn ${boardView==='board'?'tab-on':''}" onclick="setBoardView('board')">Board</button>`;
  } else { tabs.innerHTML=''; }

  if(boardView==='board'&&p.kanriBoard){ renderProjectBoard(mc,p); return; }

  if(p.workMode){
    // Row 1: Meetings | Links
    const r1=document.createElement('div'); r1.className='card-row cols-2'; mc.appendChild(r1);
    const s1=document.createElement('div'); r1.appendChild(s1);
    const s2=document.createElement('div'); r1.appendChild(s2);
    buildMeetingsCard(p,s1);
    buildLinksCard(p,s2);
    // Row 2: Tasks | Notes | Docs
    const r2=document.createElement('div'); r2.className='card-row cols-3'; mc.appendChild(r2);
    const s3=document.createElement('div'); r2.appendChild(s3);
    const s4=document.createElement('div'); r2.appendChild(s4);
    const s5=document.createElement('div'); r2.appendChild(s5);
    buildTasksCard(p,s3);
    buildNotesCard(p,s4);
    buildDocsCard(p,s5);
  } else {
    // Row 1: Links | Tasks
    const r1=document.createElement('div'); r1.className='card-row cols-2'; mc.appendChild(r1);
    const s1=document.createElement('div'); r1.appendChild(s1);
    const s2=document.createElement('div'); r1.appendChild(s2);
    buildLinksCard(p,s1);
    buildTasksCard(p,s2);
    // Row 2: Notes | Docs
    const r2=document.createElement('div'); r2.className='card-row cols-2'; mc.appendChild(r2);
    const s3=document.createElement('div'); r2.appendChild(s3);
    const s4=document.createElement('div'); r2.appendChild(s4);
    buildNotesCard(p,s3);
    buildDocsCard(p,s4);
  }
}

// ── Card builders ─────────────────────────────────────────────────────────

function buildMeetingsCard(p,slot){
  const card=document.createElement('div'); card.className='card'; slot.appendChild(card);
  const head=document.createElement('div'); head.className='card-head'; card.appendChild(head);
  head.innerHTML=`<div class="card-label"><i data-lucide="video"></i> Meetings</div>
    <div class="card-acts">
      <button class="cbtn ${calView==='today'?'tab-on':''}" onclick="setCalView('today')">Today</button>
      <button class="cbtn ${calView==='upcoming'?'tab-on':''}" onclick="setCalView('upcoming')">Upcoming</button>
      <button class="cbtn" onclick="triggerICS()"><i data-lucide="upload"></i> .ics</button>
      <button class="cbtn" onclick="openEventModal()"><i data-lucide="plus"></i></button>
    </div>`;
  const body=document.createElement('div'); body.className='card-body'; card.appendChild(body);
  const icsInp=document.createElement('input'); icsInp.type='file'; icsInp.id='ics-inp'; icsInp.accept='.ics'; icsInp.style.display='none'; icsInp.onchange=importICS; card.appendChild(icsInp);

  const todayStr=localDateStr(new Date());
  const _wn=new Date(),_dts=(7-_wn.getDay())%7||7,endOfWeekStr=localDateStr(new Date(_wn.getFullYear(),_wn.getMonth(),_wn.getDate()+_dts));
  const todayEvs=(p.events||[]).filter(e=>e.dateStr?e.dateStr===todayStr:(e.isToday||e.dayLabel==='Today')).sort((a,b)=>parseMinutes(a.time)-parseMinutes(b.time));
  const upcomingEvs=(p.events||[]).filter(e=>e.dateStr?e.dateStr>todayStr&&e.dateStr<=endOfWeekStr:(!e.isToday&&e.dayLabel&&e.dayLabel!=='Today')).sort((a,b)=>{ const da=a.dateStr||'zzz',db=b.dateStr||'zzz'; return da!==db?(da<db?-1:1):parseMinutes(a.time)-parseMinutes(b.time); });

  if(calView==='today'){
    if(!todayEvs.length){ const em=document.createElement('div'); em.className='empty'; em.textContent='No meetings today — import .ics or add manually'; body.appendChild(em); }
    else todayEvs.forEach(ev=>{
      const nowMark=isNowBetween(ev.time,ev.endTime), col=meetingColor(ev.title);
      const el=document.createElement('div'); el.className='meeting-row'+(nowMark?' now':'');
      el.innerHTML=`<div class="meeting-time-block"><div class="meeting-time">${esc(ev.time||'')}</div>${ev.endTime?`<div class="meeting-end">${esc(ev.endTime)}</div>`:''}</div><div class="meeting-divider" style="background:${col}"></div><div class="meeting-info"><div class="meeting-title">${esc(ev.title)}</div>${ev.note?`<div class="meeting-sub">${esc(ev.note)}</div>`:''}</div>${nowMark?`<div class="meeting-now-pill">Now</div>`:''} ${ev.joinUrl?`<button class="join-btn" onclick="openURL('${esc(escJS(ev.joinUrl))}')"><i data-lucide="video"></i> Join</button>`:''}<div class="meeting-del" onclick="delEvent('${ev.id}')"><i data-lucide="x"></i></div>`;
      body.appendChild(el);
    });
  } else {
    if(!upcomingEvs.length){ const em=document.createElement('div'); em.className='empty'; em.textContent='No upcoming events'; body.appendChild(em); }
    else {
      const groups=new Map();
      upcomingEvs.forEach(ev=>{ const k=ev.dateStr?dayLabel(new Date(ev.dateStr+'T12:00:00')):(ev.dayLabel||'Later'); if(!groups.has(k)) groups.set(k,[]); groups.get(k).push(ev); });
      groups.forEach((evs,day)=>{
        const lbl=document.createElement('div'); lbl.className='ev-day'; lbl.textContent=day; body.appendChild(lbl);
        evs.forEach(ev=>{
          const el=document.createElement('div'); el.className='ev-row';
          el.innerHTML=`<div class="ev-time">${esc(ev.time||'')}</div><div class="ev-bar" style="background:${meetingColor(ev.title)}"></div><div class="ev-body"><div class="ev-title">${esc(ev.title)}</div>${ev.note?`<div class="ev-sub">${esc(ev.note)}</div>`:''}</div>${ev.joinUrl?`<div class="ev-join" onclick="openURL('${esc(escJS(ev.joinUrl))}')"><i data-lucide="video"></i> Join</div>`:''}<div class="evdel" onclick="delEvent('${ev.id}')"><i data-lucide="x"></i></div>`;
          body.appendChild(el);
        });
      });
    }
  }
}

function buildLinksCard(p,slot){
  const card=document.createElement('div'); card.className='card'; slot.appendChild(card);
  card.innerHTML=`<div class="card-head"><div class="card-label"><i data-lucide="zap"></i> Quick Links</div><div class="card-acts"><button class="cbtn" onclick="openLinkModal()"><i data-lucide="plus"></i> Add</button></div></div>`;
  const body=document.createElement('div'); body.className='card-body'; card.appendChild(body);
  const grid=document.createElement('div'); grid.className='links-grid'; body.appendChild(grid);

  (p.links||[]).forEach(l=>{
    const el=document.createElement('div'); el.className='link-tile';
    el.innerHTML=`<div class="tile-del" onclick="event.stopPropagation();delLink('${l.id}')"><i data-lucide="x"></i></div><i data-lucide="${l.icon||'link'}"></i><div class="link-tile-name">${esc(l.name)}</div>`;
    el.onclick=()=>openURL(l.url); grid.appendChild(el);
  });
  const add=document.createElement('div'); add.className='add-tile';
  add.innerHTML='<i data-lucide="plus"></i><span>Add</span>'; add.onclick=()=>openLinkModal(); grid.appendChild(add);

  const folders=p.folders||[];
  if(folders.length){
    const sec=document.createElement('div'); sec.className='folders-section'; body.appendChild(sec);
    sec.innerHTML=`<div class="folders-section-label"><i data-lucide="folder"></i> File Directories</div>`;
    const list=document.createElement('div'); list.className='folder-dir-list'; sec.appendChild(list);
    folders.forEach(f=>{
      const row=document.createElement('div'); row.className='folder-dir-row';
      row.innerHTML=`<div class="folder-dir-icon"><i data-lucide="folder-open"></i></div><div class="folder-dir-info"><div class="folder-dir-name">${esc(f.name)}</div><div class="folder-dir-path">${esc(f.path)}</div></div><button class="cbtn" onclick="event.stopPropagation();openFolder('${esc(escJS(f.path))}')"><i data-lucide="external-link"></i> Open</button><div class="fdel" onclick="event.stopPropagation();delFolder('${f.id}')"><i data-lucide="x"></i></div>`;
      row.onclick=()=>openFolder(f.path); list.appendChild(row);
    });
  }
}

function buildTasksCard(p,slot){
  const tasks=p.tasks||[];
  const card=document.createElement('div'); card.className='card'; slot.appendChild(card);
  card.innerHTML=`<div class="card-head"><div class="card-label"><i data-lucide="check-square"></i> Tasks</div><div class="card-acts"><button class="cbtn ext" onclick="openKanri()"><i data-lucide="kanban"></i> Kanri</button></div></div>`;
  const body=document.createElement('div'); body.className='card-body'; card.appendChild(body);

  if(!tasks.length){ const em=document.createElement('div'); em.className='empty'; em.textContent='No tasks yet'; body.appendChild(em); }
  tasks.forEach(t=>{
    const el=document.createElement('div'); el.className='task-row';
    el.innerHTML=`<div class="tcheck${t.done?' done':''}" onclick="toggleTask('${t.id}')"><i data-lucide="check"></i></div><div class="ttext${t.done?' done':''}">${esc(t.text)}</div><div class="tdel" onclick="delTask('${t.id}')"><i data-lucide="x"></i></div>`;
    body.appendChild(el);
  });

  const footer=document.createElement('div'); footer.className='card-footer'; card.appendChild(footer);
  const inputRow=document.createElement('div'); inputRow.className='task-input-row';
  inputRow.innerHTML=`<input type="text" id="tinp" placeholder="Add a task…" style="flex:1"><button class="btn btn-p" onclick="addTask()" style="padding:6px 11px"><i data-lucide="plus"></i></button>`;
  footer.appendChild(inputRow);
  setTimeout(()=>{ const i=document.getElementById('tinp'); if(i) i.addEventListener('keydown',e=>{ if(e.key==='Enter') addTask(); }); },0);
}

function buildNotesCard(p,slot){
  const card=document.createElement('div'); card.className='card'; slot.appendChild(card);
  card.innerHTML=`<div class="card-head"><div class="card-label"><i data-lucide="file-text"></i> Notes</div><div class="card-acts"><button class="cbtn ext" onclick="openJoplin()"><i data-lucide="notebook"></i> Joplin</button><button class="cbtn" onclick="openNoteEditor(null)"><i data-lucide="plus"></i> New</button></div></div>`;
  const body=document.createElement('div'); body.className='card-body'; card.appendChild(body);
  const notes=p.notes||[];
  if(!notes.length){ const em=document.createElement('div'); em.className='empty'; em.textContent='No notes yet'; body.appendChild(em); return; }
  [...notes].reverse().forEach(n=>{
    const el=document.createElement('div'); el.className='note-row';
    el.innerHTML=`<div class="note-ico"><i data-lucide="file-text"></i></div><div class="note-content"><div class="note-t">${esc(n.title||'Untitled')}</div><div class="note-p">${esc((n.body||'').slice(0,55))}</div></div><div class="note-d">${n.date||''}</div><div class="ndel" onclick="event.stopPropagation();delNote('${n.id}')"><i data-lucide="x"></i></div>`;
    el.onclick=()=>openNoteEditor(n.id); body.appendChild(el);
  });
}

function buildDocsCard(p,slot){
  const card=document.createElement('div'); card.className='card'; slot.appendChild(card);
  const head=document.createElement('div'); head.className='card-head'; card.appendChild(head);
  head.innerHTML=`<div class="card-label"><i data-lucide="book-open"></i> Docs</div>
    <div class="card-acts">
      <button class="cbtn" onclick="openDocFolderModal()"><i data-lucide="folder-plus"></i> Add</button>
      <button class="cbtn ext" onclick="openMarkText()"><i data-lucide="pen-line"></i> MarkText</button>
    </div>`;
  const body=document.createElement('div'); body.className='card-body'; card.appendChild(body);
  const docFolders=p.docFolders||[];

  if(!docFolders.length){
    const em=document.createElement('div'); em.className='empty';
    em.innerHTML='No doc folders yet<br><span style="font-size:9px;opacity:0.6">Add markdown vaults &amp; directories</span>';
    body.appendChild(em); return;
  }

  const list=document.createElement('div'); list.className='doc-folder-list'; body.appendChild(list);
  docFolders.forEach(f=>{
    const row=document.createElement('div'); row.className='doc-folder-row';
    let mdCount='';
    if(window.require){
      try{
        const fs=window.require('fs'), path=window.require('path');
        if(fs.existsSync(f.path)){
          const count=fs.readdirSync(f.path).filter(fn=>fn.endsWith('.md')||fn.endsWith('.markdown')).length;
          if(count>0) mdCount=`<span class="doc-folder-count">${count} .md</span>`;
        }
      }catch(e){}
    }
    row.innerHTML=`
      <div class="doc-folder-ico"><i data-lucide="folder-open"></i></div>
      <div class="doc-folder-info">
        <div class="doc-folder-name">${esc(f.name)}${mdCount}</div>
        <div class="doc-folder-path">${esc(f.path)}</div>
      </div>
      <div class="doc-folder-actions">
        <button class="cbtn" onclick="event.stopPropagation();openMarkText('${esc(escJS(f.path))}')" title="Open in MarkText"><i data-lucide="pen-line"></i> Edit</button>
        <button class="cbtn" onclick="event.stopPropagation();openFolder('${esc(escJS(f.path))}')" title="Open in Explorer"><i data-lucide="folder-open"></i></button>
        <div class="doc-fdel" onclick="event.stopPropagation();delDocFolder('${f.id}')"><i data-lucide="x"></i></div>
      </div>`;
    row.onclick=()=>openMarkText(f.path);
    list.appendChild(row);
  });
}

// ── Actions ───────────────────────────────────────────────────────────────
function openURL(url){ if(!url) return; if(window.require){ try{ window.require('electron').shell.openExternal(url); return; }catch(e){} } window.open(url,'_blank'); }
function openFolder(p){ if(!p) return; if(window.require){ try{ window.require('electron').shell.openPath(p); return; }catch(e){} } window.open('file://'+p,'_blank'); }
function openApp(filePath){ if(!filePath) return; if(window.require){ try{ window.require('electron').shell.openPath(filePath); return; }catch(e){} } }

function openKanri(){
  let kp=DB.settings.kanriPath||'';
  if(!kp){ kp=detectKanri(); if(kp){ DB.settings.kanriPath=kp; save(); } }
  if(!kp){ openOv('ov-settings'); return; }
  if(window.require){ try{ const fs=window.require('fs'),path=window.require('path'); if(fs.existsSync(kp)&&fs.statSync(kp).isDirectory()){ const exe=path.join(kp,'Kanri.exe'); if(fs.existsSync(exe)) kp=exe; } }catch(e){} }
  loadKanriData(); kanriPreviewing=true; boardView='overview'; render();
  openApp(kp);
}

function openJoplin(){
  let jp=DB.settings.joplinPath||'';
  if(!jp){ jp=detectJoplin(); if(jp){ DB.settings.joplinPath=jp; save(); } }
  if(jp){
    if(window.require){ try{ const fs=window.require('fs'),path=window.require('path'); if(fs.existsSync(jp)&&fs.statSync(jp).isDirectory()){ const exe=path.join(jp,'Joplin.exe'); if(fs.existsSync(exe)) jp=exe; } }catch(e){} }
    openApp(jp); return;
  }
  const p=ga();
  openURL(p?.joplin?`joplin://x-callback-url/openNote?notebook=${encodeURIComponent(p.joplin)}`:'joplin://');
}

function setCalView(v){ calView=v; render(); }
function toggleTask(id){ const p=ga(); if(!p) return; const t=p.tasks.find(t=>t.id===id); if(t) t.done=!t.done; save(); render(); }
function addTask(){ const i=document.getElementById('tinp'),txt=i?.value.trim(); if(!txt) return; const p=ga(); if(!p) return; p.tasks.push({id:uid(),text:txt,done:false}); save(); render(); setTimeout(()=>{ const ni=document.getElementById('tinp'); if(ni) ni.focus(); },0); }
function delTask(id){ const p=ga(); if(!p) return; p.tasks=p.tasks.filter(t=>t.id!==id); save(); render(); }
function delLink(id){ const p=ga(); if(!p) return; p.links=p.links.filter(l=>l.id!==id); save(); render(); }
function delFolder(id){ const p=ga(); if(!p) return; p.folders=(p.folders||[]).filter(f=>f.id!==id); save(); render(); }
function delDocFolder(id){ const p=ga(); if(!p) return; p.docFolders=(p.docFolders||[]).filter(f=>f.id!==id); save(); render(); }
function delEvent(id){ const p=ga(); if(!p) return; p.events=p.events.filter(e=>e.id!==id); save(); render(); }
function delNote(id){ const p=ga(); if(!p) return; p.notes=p.notes.filter(n=>n.id!==id); save(); render(); }

function editProject(id){
  const p=DB.projects.find(p=>p.id===id); if(!p) return;
  editProj=id;
  document.getElementById('proj-name').value=p.name;
  document.getElementById('proj-joplin').value=p.joplin||'';
  document.getElementById('proj-work').checked=!!p.workMode;
  document.getElementById('proj-h').textContent='Edit Project';
  document.getElementById('proj-folder-list').innerHTML='';
  document.getElementById('proj-docfolder-list').innerHTML='';
  pickCol=p.color||'amber';
  document.querySelectorAll('#proj-dots .cdot').forEach(d=>d.classList.toggle('sel',d.dataset.c===pickCol));
  (p.folders||[]).forEach(f=>addFolderEntry(f.name,f.path));
  (p.docFolders||[]).forEach(f=>addDocFolderEntry(f.name,f.path));
  loadKanriData(); populateKanriSelector(p.kanriBoard||'');
  openOv('ov-proj');
}
function delProj(id){ if(!confirm('Delete this project?')) return; DB.projects=DB.projects.filter(p=>p.id!==id); if(active===id){ active=DB.projects[0]?.id||null; DB.settings.lastActive=active; } save(); render(); }

function openDocFolderModal(){ document.getElementById('df-name').value=''; document.getElementById('df-path').value=''; openOv('ov-docfolder'); }
function saveDocFolder(){
  const name=document.getElementById('df-name').value.trim(), path=document.getElementById('df-path').value.trim();
  if(!path) return;
  const p=ga(); if(!p) return;
  if(!p.docFolders) p.docFolders=[];
  p.docFolders.push({id:uid(),name:name||path,path});
  save(); closeOv('ov-docfolder'); render();
}

// ── ICS ───────────────────────────────────────────────────────────────────
function triggerICS(){ document.getElementById('ics-inp')?.click(); }
function importICS(e){
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{ const evs=parseICS(ev.target.result); const p=ga(); if(!p) return; p.events=evs; save(); render(); e.target.value=''; };
  reader.onerror=()=>{ alert('Failed to read the .ics file.'); e.target.value=''; };
  reader.readAsText(file);
}
function parseICS(text){
  const out=[];
  const now=new Date(),todayStart=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const windowEnd=new Date(todayStart); windowEnd.setDate(windowEnd.getDate()+60);
  const DAY_MAP={MO:1,TU:2,WE:3,TH:4,FR:5,SA:6,SU:0};
  text.split('BEGIN:VEVENT').slice(1).forEach(block=>{
    const unfolded=block.replace(/\r?\n[ \t]/g,'');
    const get=k=>{ const m=unfolded.match(new RegExp(`(?:^|[\\r\\n])${k}[^:]*:([^\\r\\n]+)`)); return m?m[1].trim():''; };
    const summary=get('SUMMARY'),dtstart=get('DTSTART'),dtend=get('DTEND'),location=get('LOCATION'),desc=get('DESCRIPTION'),urlF=get('URL'),rruleStr=get('RRULE');
    if(!summary||!dtstart) return;
    const startDate=icsDate(dtstart); if(!startDate) return;
    const endDate=dtend?icsDate(dtend):null, durationMs=endDate?endDate-startDate:0;
    const joinUrl=urlF||extractURL(desc)||extractURL(location)||'', note=location||'';
    const exdates=new Set();
    const exRe=/(?:^|[\r\n])EXDATE[^:]*:([^\r\n]+)/g; let em;
    while((em=exRe.exec(unfolded))!==null){ em[1].trim().split(',').forEach(s=>{ const d=icsDate(s.trim()); if(d) exdates.add(localDateStr(d)); }); }
    function pushEvent(occStart){
      if(occStart<todayStart||occStart>windowEnd) return;
      const ds=localDateStr(occStart); if(exdates.has(ds)) return;
      const occEnd=durationMs?new Date(occStart.getTime()+durationMs):null;
      const dl=dayLabel(occStart),isToday=dl==='Today';
      out.push({id:uid(),title:summary,dateStr:ds,dayLabel:dl,isToday,time:fmtTime(occStart,dtstart),endTime:occEnd?fmtTime(occEnd,dtend):'',joinUrl,note});
    }
    if(!rruleStr||!rruleStr.includes('FREQ=WEEKLY')){ pushEvent(startDate); return; }
    const rp={}; rruleStr.split(';').forEach(p=>{ const [k,v]=p.split('='); rp[k]=v; });
    const interval=parseInt(rp.INTERVAL||'1');
    const bydays=(rp.BYDAY||'').split(',').map(d=>DAY_MAP[d.trim().replace(/[^A-Z]/g,'')]).filter(d=>d!==undefined);
    const until=rp.UNTIL?icsDate(rp.UNTIL):null, effectiveEnd=until&&until<windowEnd?until:windowEnd;
    const cur=new Date(startDate); cur.setHours(0,0,0,0);
    const weekStart=new Date(cur); weekStart.setDate(weekStart.getDate()-weekStart.getDay()+1);
    for(let w=new Date(weekStart);w<=effectiveEnd;w.setDate(w.getDate()+7*interval)){
      if(bydays.length===0){ const occ=new Date(w); occ.setHours(startDate.getHours(),startDate.getMinutes(),startDate.getSeconds()); if(occ>=startDate) pushEvent(occ); }
      else bydays.forEach(dow=>{ const diff=(dow-1+7)%7, occ=new Date(w); occ.setDate(w.getDate()+diff); occ.setHours(startDate.getHours(),startDate.getMinutes(),startDate.getSeconds()); if(occ>=startDate&&(!until||occ<=until)) pushEvent(occ); });
    }
  });
  return out;
}
function extractURL(s){ if(!s) return ''; const m=s.match(/https?:\/\/[^\s<>"\\]+/); return m?m[0]:''; }
function icsDate(s){ const isUTC=s.endsWith('Z'); const c=s.replace(/[TZ]/g,''); if(c.length<8) return null; return new Date(`${c.slice(0,4)}-${c.slice(4,6)}-${c.slice(6,8)}T${c.slice(8,10)||'00'}:${c.slice(10,12)||'00'}:00${isUTC?'Z':''}`); }
function dayLabel(d){ const now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate()),day=new Date(d.getFullYear(),d.getMonth(),d.getDate()),diff=Math.round((day-today)/86400000); if(diff===0) return 'Today'; if(diff===1) return 'Tomorrow'; if(diff<7) return d.toLocaleDateString('en-US',{weekday:'long'}); return d.toLocaleDateString('en-US',{month:'short',day:'numeric'}); }
function fmtTime(d,raw){ if(!raw||raw.length<=8) return 'All day'; return d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}); }
function parseMinutes(str){ if(!str) return 0; const m=str.match(/(\d+):(\d+)\s*(AM|PM)?/i); if(!m) return 0; let h=parseInt(m[1]),mn=parseInt(m[2]); const ap=(m[3]||'').toUpperCase(); if(ap==='PM'&&h!==12) h+=12; if(ap==='AM'&&h===12) h=0; return h*60+mn; }
function isNowBetween(s,e){ if(!s) return false; try{ const parse=str=>{ const m=str.match(/(\d+):(\d+)\s*(AM|PM)?/i); if(!m) return null; let h=parseInt(m[1]),mn=parseInt(m[2]); const ap=(m[3]||'').toUpperCase(); if(ap==='PM'&&h!==12) h+=12; if(ap==='AM'&&h===12) h=0; return h*60+mn; }; const now=new Date(),nm=now.getHours()*60+now.getMinutes(),st=parse(s),en=e?parse(e):st+60; return st!==null&&nm>=st&&nm<=(en||st+60); }catch(err){ return false; } }

// ── Overlays ──────────────────────────────────────────────────────────────
function openOv(id){ document.getElementById(id).classList.add('open'); ri(); }
function closeOv(id){ document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.overlay').forEach(el=>el.addEventListener('click',e=>{ if(e.target===el) el.classList.remove('open'); }));
document.addEventListener('keydown',e=>{ if(e.key==='Escape') document.querySelectorAll('.overlay.open').forEach(el=>el.classList.remove('open')); });

// ── Project modal ─────────────────────────────────────────────────────────
function pickColor(el){ document.querySelectorAll('#proj-dots .cdot').forEach(d=>d.classList.remove('sel')); el.classList.add('sel'); pickCol=el.dataset.c; }
function addFolderEntry(nv,pv){
  const list=document.getElementById('proj-folder-list');
  const row=document.createElement('div'); row.className='folder-entry';
  row.innerHTML=`<input type="text" placeholder="Name" value="${esc(nv||'')}" style="flex:0 0 100px"><input type="text" placeholder="C:\\path\\to\\folder" value="${esc(pv||'')}"><div class="folder-entry-del" onclick="this.parentElement.remove()"><i data-lucide="x"></i></div>`;
  list.appendChild(row); ri();
}
function addDocFolderEntry(nv,pv){
  const list=document.getElementById('proj-docfolder-list');
  const row=document.createElement('div'); row.className='folder-entry';
  row.innerHTML=`<input type="text" placeholder="Name" value="${esc(nv||'')}" style="flex:0 0 100px"><input type="text" placeholder="C:\\path\\to\\docs" value="${esc(pv||'')}"><div class="folder-entry-del" onclick="this.parentElement.remove()"><i data-lucide="x"></i></div>`;
  list.appendChild(row); ri();
}
document.getElementById('add-proj').onclick=()=>{
  editProj=null; document.getElementById('proj-name').value=''; document.getElementById('proj-joplin').value='';
  document.getElementById('proj-work').checked=false; document.getElementById('proj-h').textContent='New Project';
  document.getElementById('proj-folder-list').innerHTML=''; document.getElementById('proj-docfolder-list').innerHTML='';
  pickCol='amber'; document.querySelectorAll('#proj-dots .cdot').forEach(d=>d.classList.toggle('sel',d.dataset.c==='amber'));
  loadKanriData(); populateKanriSelector(''); openOv('ov-proj');
};
function saveProject(){
  const name=document.getElementById('proj-name').value.trim(); if(!name) return;
  const joplin=document.getElementById('proj-joplin').value.trim();
  const kanriBoard=document.getElementById('proj-kanri')?.value||'';
  const workMode=document.getElementById('proj-work').checked;
  const folders=[], docFolders=[];
  document.querySelectorAll('#proj-folder-list .folder-entry').forEach(row=>{ const ins=row.querySelectorAll('input'); const fn=(ins[0]?.value||'').trim(),fp=(ins[1]?.value||'').trim(); if(fp) folders.push({id:uid(),name:fn||fp,path:fp}); });
  document.querySelectorAll('#proj-docfolder-list .folder-entry').forEach(row=>{ const ins=row.querySelectorAll('input'); const fn=(ins[0]?.value||'').trim(),fp=(ins[1]?.value||'').trim(); if(fp) docFolders.push({id:uid(),name:fn||fp,path:fp}); });
  if(editProj){ const p=DB.projects.find(p=>p.id===editProj); if(p){p.name=name;p.color=pickCol;p.workMode=workMode;p.joplin=joplin;p.kanriBoard=kanriBoard;p.folders=folders;p.docFolders=docFolders;} }
  else{ const p=np(name,pickCol,workMode); p.joplin=joplin; p.kanriBoard=kanriBoard; p.folders=folders; p.docFolders=docFolders; DB.projects.push(p); active=p.id; DB.settings.lastActive=p.id; }
  save(); closeOv('ov-proj'); render();
}

// ── Link modal ────────────────────────────────────────────────────────────
function buildIconGrid(){ const g=document.getElementById('icon-grid'); g.innerHTML=''; ICONS.forEach(name=>{ const el=document.createElement('div'); el.className='icon-opt'+(name===pickIcon?' sel':''); el.dataset.icon=name; el.innerHTML=`<i data-lucide="${name}"></i>`; el.onclick=()=>{ document.querySelectorAll('.icon-opt').forEach(e=>e.classList.remove('sel')); el.classList.add('sel'); pickIcon=name; ri(); }; g.appendChild(el); }); }
function openLinkModal(){ document.getElementById('l-name').value=''; document.getElementById('l-url').value=''; pickIcon='globe'; buildIconGrid(); openOv('ov-link'); }
function saveLink(){ const name=document.getElementById('l-name').value.trim(),url=document.getElementById('l-url').value.trim(); if(!name||!url) return; const p=ga(); if(!p) return; p.links.push({id:uid(),icon:pickIcon,name,url}); save(); closeOv('ov-link'); render(); }

// ── Event modal ───────────────────────────────────────────────────────────
function openEventModal(){ ['ev-t','ev-w','ev-url','ev-n'].forEach(id=>document.getElementById(id).value=''); openOv('ov-event'); }
function saveEvent(){
  const title=document.getElementById('ev-t').value.trim(); if(!title) return;
  const timeStr=document.getElementById('ev-w').value.trim();
  const joinUrl=document.getElementById('ev-url').value.trim();
  const note=document.getElementById('ev-n').value.trim();
  const p=ga(); if(!p) return;
  const parts=timeStr.split(/[-–—]+/).map(s=>s.trim());
  p.events.push({id:uid(),title,dateStr:localDateStr(new Date()),dayLabel:'Today',isToday:true,time:parts[0]||'',endTime:parts[1]||'',joinUrl,note});
  save(); closeOv('ov-event'); render();
}

// ── Note modal ────────────────────────────────────────────────────────────
function openNoteEditor(id){ editNote=id; if(id){ const n=ga()?.notes.find(n=>n.id===id); if(n){document.getElementById('n-title').value=n.title||''; document.getElementById('n-body').value=n.body||'';} } else{ document.getElementById('n-title').value=''; document.getElementById('n-body').value=''; } openOv('ov-note'); setTimeout(()=>document.getElementById('n-title').focus(),80); }
function saveNote(){ const title=document.getElementById('n-title').value.trim(),body=document.getElementById('n-body').value.trim(); if(!title&&!body){ closeOv('ov-note'); return; } const p=ga(); if(!p) return; if(editNote){ const n=p.notes.find(n=>n.id===editNote); if(n){n.title=title||'Untitled';n.body=body;n.date=ds();} } else{ p.notes.push({id:uid(),title:title||'Untitled',body,date:ds()}); } save(); closeOv('ov-note'); render(); }

// ── Clock ─────────────────────────────────────────────────────────────────
function tick(){ const now=new Date(); document.getElementById('clock').textContent=now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false}); document.getElementById('cdate').textContent=now.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}); }

load(); render(); tick(); setInterval(tick,10000);
