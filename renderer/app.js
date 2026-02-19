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

const BAR   = ['#f0a843','#5a9ef5','#5acc8a','#a78bfa','#e05a5a','#22d3ee','#f472b6','#fb923c'];
function meetingColor(title){ let h=0; for(let i=0;i<title.length;i++) h=(h*31+title.charCodeAt(i))>>>0; return BAR[h%BAR.length]; }
const ICONS = ['globe','link','github','figma','code-2','terminal','folder','database','monitor','smartphone','mail','book','youtube','music','image','box','cloud','coffee','settings','send','layers','trello','slack','pen-tool'];

let DB       = { projects:[], settings:{ accent:'#f0a843', font:'Syne', kanriPath:'', joplinPath:'' } };
let active   = null, editNote = null, editProj = null, pickCol = 'amber', pickIcon = 'globe', calView = 'today';

function save(){ localStorage.setItem('hub5', JSON.stringify(DB)); }
function load(){
  try { const d=localStorage.getItem('hub5'); if(d) DB=JSON.parse(d); else seed(); }
  catch(e){ seed(); }
  if(DB.projects.length) active=DB.projects[0].id;
  applyTheme();
}
function seed(){
  const work=np('Work','blue',true);
  work.links=[{id:uid(),icon:'github',name:'GitHub',url:'https://github.com'},{id:uid(),icon:'figma',name:'Figma',url:'https://figma.com'},{id:uid(),icon:'mail',name:'Gmail',url:'https://mail.google.com'}];
  work.tasks=[{id:uid(),text:'Import your .ics calendar file',done:false},{id:uid(),text:'Connect Kanri in settings',done:false}];
  work.events=[
    {id:uid(),title:'Morning standup',time:'9:00 AM',endTime:'9:15 AM',joinUrl:'https://meet.google.com',note:'Daily sync',dayLabel:'Today',isToday:true},
    {id:uid(),title:'Design review',time:'2:00 PM',endTime:'3:00 PM',joinUrl:'https://meet.google.com',note:'Figma handoff',dayLabel:'Today',isToday:true},
    {id:uid(),title:'Sprint planning',time:'10:00 AM',endTime:'11:00 AM',joinUrl:'',note:'',dayLabel:'Tomorrow',isToday:false},
  ];
  work.folders=[{id:uid(),name:'Docs',path:'C:\\Users\\Dev\\Documents\\Work'}];

  const personal=np('Personal','amber',false);
  personal.links=[{id:uid(),icon:'youtube',name:'YouTube',url:'https://youtube.com'},{id:uid(),icon:'coffee',name:'Reddit',url:'https://reddit.com'}];
  personal.tasks=[{id:uid(),text:'Add your personal links',done:false}];
  personal.notes=[{id:uid(),title:'Ideas',body:'Side project brainstorm...',date:ds()}];

  DB.projects=[work,personal]; active=work.id; save();
}
function np(name,color,workMode){ return {id:uid(),name,color,workMode:!!workMode,joplin:'',links:[],tasks:[],notes:[],events:[],folders:[]}; }
function uid(){ return Math.random().toString(36).slice(2,9); }
function ds(){ return new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'}); }
function localDateStr(d){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function ga(){ return DB.projects.find(p=>p.id===active); }
function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function ri(){ if(window.lucide) lucide.createIcons(); }

// Theme
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
}
function setAccent(v){ DB.settings.accent=v; applyTheme(); save(); }
function setFont(el){ DB.settings.font=el.dataset.f; applyTheme(); save(); }
function savePaths(){ DB.settings.kanriPath=document.getElementById('kanri-path').value; DB.settings.joplinPath=document.getElementById('joplin-path').value; save(); }

// Render
function render(){ renderSidebar(); renderMain(); ri(); }

function renderSidebar(){
  const list=document.getElementById('proj-list'); list.innerHTML='';
  DB.projects.forEach(p=>{
    const el=document.createElement('div');
    el.className='proj-item'+(p.id===active?' active':'');
    el.dataset.id=p.id;
    el.innerHTML=`<div class="proj-dot" style="background:${DOT[p.color]||'var(--accent)'}"></div><div class="proj-name">${esc(p.name)}</div>${p.workMode?`<span class="proj-badge">work</span>`:''}<div class="proj-edit" data-action="edit"><i data-lucide="pencil"></i></div><div class="proj-del" data-action="del"><i data-lucide="x"></i></div>`;
    el.addEventListener('click', e=>{
      const action=e.target.closest('[data-action]')?.dataset?.action;
      if(action==='del'){ e.stopPropagation(); delProj(p.id); }
      else if(action==='edit'){ e.stopPropagation(); editProject(p.id); }
      else { active=p.id; calView='today'; render(); }
    });
    list.appendChild(el);
  });
}

function renderMain(){
  const p=ga();
  const mc=document.getElementById('main-content');
  mc.innerHTML='';
  if(!p){ document.getElementById('ptitle').textContent='Select a project'; return; }
  document.getElementById('ptitle').innerHTML=`${esc(p.name)} <span style="color:${DOT[p.color]||'var(--accent)'};margin-left:2px">·</span>`;
  const done=(p.tasks||[]).filter(t=>t.done).length, tot=(p.tasks||[]).length;
  document.getElementById('pmeta').textContent=tot?`${done}/${tot} tasks`:'';

  if(p.workMode){
    // Row 1: Meetings | Links
    const r1=document.createElement('div'); r1.className='card-row cols-2'; mc.appendChild(r1);
    const s1=document.createElement('div'); r1.appendChild(s1);
    const s2=document.createElement('div'); r1.appendChild(s2);
    buildMeetingsCard(p, s1);
    buildLinksCard(p, s2);
    // Row 2: Tasks | Notes
    const r2=document.createElement('div'); r2.className='card-row cols-2'; mc.appendChild(r2);
    const s3=document.createElement('div'); r2.appendChild(s3);
    const s4=document.createElement('div'); r2.appendChild(s4);
    buildTasksCard(p, s3);
    buildNotesCard(p, s4);
  } else {
    // Row 1: Links | Tasks
    const r1=document.createElement('div'); r1.className='card-row cols-2'; mc.appendChild(r1);
    const s1=document.createElement('div'); r1.appendChild(s1);
    const s2=document.createElement('div'); r1.appendChild(s2);
    buildLinksCard(p, s1);
    buildTasksCard(p, s2);
    // Row 2: Notes full-width
    const r2=document.createElement('div'); r2.className='card-row'; mc.appendChild(r2);
    buildNotesCard(p, r2);
  }
}

// ── Card builders ─────────────────────────────────────────────────────────

function buildMeetingsCard(p, slot){
  const card=document.createElement('div'); card.className='card'; slot.appendChild(card);
  // Head
  const head=document.createElement('div'); head.className='card-head'; card.appendChild(head);
  head.innerHTML=`<div class="card-label"><i data-lucide="video"></i> Meetings</div>
    <div class="card-acts">
      <button class="cbtn ${calView==='today'?'tab-on':''}" onclick="setCalView('today')">Today</button>
      <button class="cbtn ${calView==='upcoming'?'tab-on':''}" onclick="setCalView('upcoming')">Upcoming</button>
      <button class="cbtn" onclick="triggerICS()"><i data-lucide="upload"></i> .ics</button>
      <button class="cbtn" onclick="openEventModal()"><i data-lucide="plus"></i></button>
    </div>`;
  // Body
  const body=document.createElement('div'); body.className='card-body'; card.appendChild(body);
  // ICS input
  const icsInp=document.createElement('input'); icsInp.type='file'; icsInp.id='ics-inp'; icsInp.accept='.ics'; icsInp.style.display='none'; icsInp.onchange=importICS; card.appendChild(icsInp);

  const todayStr=localDateStr(new Date());
  const todayEvs=(p.events||[]).filter(e=>e.dateStr?e.dateStr===todayStr:(e.isToday||e.dayLabel==='Today')).sort((a,b)=>(a.time||'').localeCompare(b.time||''));
  const upcomingEvs=(p.events||[]).filter(e=>e.dateStr?e.dateStr>todayStr:(!e.isToday&&e.dayLabel&&e.dayLabel!=='Today')).sort((a,b)=>{ const da=a.dateStr||'zzz',db=b.dateStr||'zzz'; return da!==db?(da<db?-1:1):(a.time||'').localeCompare(b.time||''); });

  if(calView==='today'){
    if(!todayEvs.length){
      const em=document.createElement('div'); em.className='empty'; em.textContent='No meetings today — import .ics or add manually'; body.appendChild(em);
    } else {
      todayEvs.forEach(ev=>{
        const nowMark=isNowBetween(ev.time,ev.endTime);
        const col=meetingColor(ev.title);
        const el=document.createElement('div'); el.className='meeting-row'+(nowMark?' now':'');
        el.innerHTML=`<div class="meeting-time-block"><div class="meeting-time">${esc(ev.time||'')}</div>${ev.endTime?`<div class="meeting-end">${esc(ev.endTime)}</div>`:''}</div><div class="meeting-divider" style="background:${col}"></div><div class="meeting-info"><div class="meeting-title">${esc(ev.title)}</div>${ev.note?`<div class="meeting-sub">${esc(ev.note)}</div>`:''}</div>${nowMark?`<div class="meeting-now-pill">Now</div>`:''} ${ev.joinUrl?`<button class="join-btn" onclick="openURL('${esc(ev.joinUrl)}')"><i data-lucide="video"></i> Join</button>`:''}<div class="meeting-del" onclick="delEvent('${ev.id}')"><i data-lucide="x"></i></div>`;
        body.appendChild(el);
      });
    }
  } else {
    if(!upcomingEvs.length){
      const em=document.createElement('div'); em.className='empty'; em.textContent='No upcoming events'; body.appendChild(em);
    } else {
      const groups=new Map();
      upcomingEvs.forEach(ev=>{ const k=ev.dateStr?dayLabel(new Date(ev.dateStr+'T12:00:00')):(ev.dayLabel||'Later'); if(!groups.has(k)) groups.set(k,[]); groups.get(k).push(ev); });
      groups.forEach((evs,day)=>{
        const lbl=document.createElement('div'); lbl.className='ev-day'; lbl.textContent=day; body.appendChild(lbl);
        evs.forEach(ev=>{
          const el=document.createElement('div'); el.className='ev-row';
          el.innerHTML=`<div class="ev-time">${esc(ev.time||'')}</div><div class="ev-bar" style="background:${meetingColor(ev.title)}"></div><div class="ev-body"><div class="ev-title">${esc(ev.title)}</div>${ev.note?`<div class="ev-sub">${esc(ev.note)}</div>`:''}</div>${ev.joinUrl?`<div class="ev-join" onclick="openURL('${esc(ev.joinUrl)}')"><i data-lucide="video"></i> Join</div>`:''}<div class="evdel" onclick="delEvent('${ev.id}')"><i data-lucide="x"></i></div>`;
          body.appendChild(el);
        });
      });
    }
  }
}

function buildLinksCard(p, slot){
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

  // ── File Directories section ──────────────────────────────────────────
  const folders=p.folders||[];
  if(folders.length){
    const sec=document.createElement('div'); sec.className='folders-section'; body.appendChild(sec);
    const lbl=document.createElement('div'); lbl.className='folders-section-label';
    lbl.innerHTML=`<i data-lucide="folder"></i> File Directories`;
    sec.appendChild(lbl);
    const list=document.createElement('div'); list.className='folder-dir-list'; sec.appendChild(list);
    folders.forEach(f=>{
      const row=document.createElement('div'); row.className='folder-dir-row';
      row.innerHTML=`<div class="folder-dir-icon"><i data-lucide="folder-open"></i></div><div class="folder-dir-info"><div class="folder-dir-name">${esc(f.name)}</div><div class="folder-dir-path">${esc(f.path)}</div></div><button class="cbtn" onclick="event.stopPropagation();openFolder('${esc(f.path)}')"><i data-lucide="external-link"></i> Open</button><div class="fdel" onclick="event.stopPropagation();delFolder('${f.id}')"><i data-lucide="x"></i></div>`;
      row.onclick=()=>openFolder(f.path);
      list.appendChild(row);
    });
  }
}

function buildTasksCard(p, slot){
  const tasks=p.tasks||[];
  const done=tasks.filter(t=>t.done).length;
  const card=document.createElement('div'); card.className='card'; slot.appendChild(card);
  card.innerHTML=`<div class="card-head"><div class="card-label"><i data-lucide="check-square"></i> Tasks</div><div class="card-acts"><span style="font-size:10px;font-family:var(--mono);color:var(--text3)">${tasks.length?`${done} / ${tasks.length}`:''}</span></div></div>`;
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
  const hintRow=document.createElement('div'); hintRow.className='tool-hint-row';
  hintRow.innerHTML=`<span class="hint-text">Advanced tasks in Kanri</span><button class="cbtn ext" onclick="openKanri()"><i data-lucide="external-link"></i> Open</button>`;
  footer.appendChild(hintRow);
  setTimeout(()=>{ const i=document.getElementById('tinp'); if(i) i.addEventListener('keydown',e=>{ if(e.key==='Enter') addTask(); }); },0);
}

function buildNotesCard(p, slot){
  const card=document.createElement('div'); card.className='card'; slot.appendChild(card);
  card.innerHTML=`<div class="card-head"><div class="card-label"><i data-lucide="file-text"></i> Notes</div><div class="card-acts"><button class="cbtn ext" onclick="openJoplin()"><i data-lucide="external-link"></i> Joplin</button><button class="cbtn" onclick="openNoteEditor(null)"><i data-lucide="plus"></i> New</button></div></div>`;
  const body=document.createElement('div'); body.className='card-body'; card.appendChild(body);
  const notes=p.notes||[];
  if(!notes.length){ const em=document.createElement('div'); em.className='empty'; em.textContent='No notes yet'; body.appendChild(em); return; }
  [...notes].reverse().forEach(n=>{
    const el=document.createElement('div'); el.className='note-row';
    el.innerHTML=`<div class="note-ico"><i data-lucide="file-text"></i></div><div class="note-content"><div class="note-t">${esc(n.title||'Untitled')}</div><div class="note-p">${esc((n.body||'').slice(0,55))}</div></div><div class="note-d">${n.date||''}</div><div class="ndel" onclick="event.stopPropagation();delNote('${n.id}')"><i data-lucide="x"></i></div>`;
    el.onclick=()=>openNoteEditor(n.id); body.appendChild(el);
  });
}

// ── Actions ───────────────────────────────────────────────────────────────
function openURL(url){ if(!url) return; if(window.require){ try{ window.require('electron').shell.openExternal(url); return; }catch(e){} } window.open(url,'_blank'); }
function openFolder(p){ if(!p) return; if(window.require){ try{ window.require('electron').shell.openPath(p); return; }catch(e){} } window.open('file://'+p,'_blank'); }
function openApp(filePath){ if(!filePath) return; if(window.require){ try{ window.require('electron').shell.openPath(filePath); return; }catch(e){} } }
function openKanri(){ const kanriPath=DB.settings.kanriPath; if(!kanriPath){ openOv('ov-settings'); return; } openApp(kanriPath); }
function openJoplin(){ const p=ga(), nb=p?.joplin?`joplin://x-callback-url/openNote?notebook=${encodeURIComponent(p.joplin)}`:'joplin://'; openURL(nb); }
function setCalView(v){ calView=v; render(); }
function toggleTask(id){ const p=ga(); if(!p) return; const t=p.tasks.find(t=>t.id===id); if(t) t.done=!t.done; save(); render(); }
function addTask(){ const i=document.getElementById('tinp'),txt=i?.value.trim(); if(!txt) return; const p=ga(); if(!p) return; p.tasks.push({id:uid(),text:txt,done:false}); save(); render(); }
function delTask(id){ const p=ga(); if(!p) return; p.tasks=p.tasks.filter(t=>t.id!==id); save(); render(); }
function delLink(id){ const p=ga(); if(!p) return; p.links=p.links.filter(l=>l.id!==id); save(); render(); }
function delFolder(id){ const p=ga(); if(!p) return; p.folders=(p.folders||[]).filter(f=>f.id!==id); save(); render(); }
function delEvent(id){ const p=ga(); if(!p) return; p.events=p.events.filter(e=>e.id!==id); save(); render(); }
function delNote(id){ const p=ga(); if(!p) return; p.notes=p.notes.filter(n=>n.id!==id); save(); render(); }
function editProject(id){ const p=DB.projects.find(p=>p.id===id); if(!p) return; editProj=id; document.getElementById('proj-name').value=p.name; document.getElementById('proj-joplin').value=p.joplin||''; document.getElementById('proj-work').checked=!!p.workMode; document.getElementById('proj-h').textContent='Edit Project'; document.getElementById('proj-folder-list').innerHTML=''; pickCol=p.color||'amber'; document.querySelectorAll('#proj-dots .cdot').forEach(d=>d.classList.toggle('sel',d.dataset.c===pickCol)); (p.folders||[]).forEach(f=>addFolderEntry(f.name,f.path)); openOv('ov-proj'); }
function delProj(id){ if(!confirm('Delete this project?')) return; DB.projects=DB.projects.filter(p=>p.id!==id); if(active===id) active=DB.projects[0]?.id||null; save(); render(); }

// ICS
function triggerICS(){ document.getElementById('ics-inp')?.click(); }
function importICS(e){
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{ const evs=parseICS(ev.target.result); const p=ga(); if(!p) return; p.events=evs; save(); render(); e.target.value=''; };
  reader.readAsText(file);
}
function parseICS(text){
  const out=[],now=new Date(),todayStart=new Date(now.getFullYear(),now.getMonth(),now.getDate()),soon=new Date(now.getTime()+60*24*60*60*1000);
  text.split('BEGIN:VEVENT').slice(1).forEach(block=>{
    const get=k=>{ const m=block.match(new RegExp(`(?:^|[\\r\\n])${k}[^:]*:([^\\r\\n]+)`)); return m?m[1].trim():''; };
    const summary=get('SUMMARY'),dtstart=get('DTSTART'),dtend=get('DTEND'),location=get('LOCATION'),desc=get('DESCRIPTION'),urlF=get('URL');
    if(!summary||!dtstart) return;
    const startDate=icsDate(dtstart); if(!startDate||startDate<todayStart||startDate>soon) return;
    const endDate=dtend?icsDate(dtend):null;
    const dl=dayLabel(startDate),isToday=dl==='Today';
    const joinUrl=urlF||extractURL(desc)||extractURL(location)||'';
    const dateStr=localDateStr(startDate);
    out.push({id:uid(),title:summary,dateStr,dayLabel:dl,isToday,time:fmtTime(startDate,dtstart),endTime:endDate?fmtTime(endDate,dtend):'',joinUrl,note:location||''});
  });
  return out;
}
function extractURL(s){ if(!s) return ''; const m=s.match(/https?:\/\/[^\s<>"\\]+/); return m?m[0]:''; }
function icsDate(s){ const isUTC=s.endsWith('Z'); const c=s.replace(/[TZ]/g,''); if(c.length<8) return null; return new Date(`${c.slice(0,4)}-${c.slice(4,6)}-${c.slice(6,8)}T${c.slice(8,10)||'00'}:${c.slice(10,12)||'00'}:00${isUTC?'Z':''}`); }
function dayLabel(d){ const now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate()),day=new Date(d.getFullYear(),d.getMonth(),d.getDate()),diff=Math.round((day-today)/86400000); if(diff===0) return 'Today'; if(diff===1) return 'Tomorrow'; if(diff<7) return d.toLocaleDateString('en-US',{weekday:'long'}); return d.toLocaleDateString('en-US',{month:'short',day:'numeric'}); }
function fmtTime(d,raw){ if(!raw||raw.length<=8) return 'All day'; return d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}); }
function isNowBetween(s,e){ if(!s) return false; try{ const parse=str=>{ const m=str.match(/(\d+):(\d+)\s*(AM|PM)?/i); if(!m) return null; let h=parseInt(m[1]),mn=parseInt(m[2]); const ap=(m[3]||'').toUpperCase(); if(ap==='PM'&&h!==12) h+=12; if(ap==='AM'&&h===12) h=0; return h*60+mn; }; const now=new Date(),nm=now.getHours()*60+now.getMinutes(),st=parse(s),en=e?parse(e):st+60; return st!==null&&nm>=st&&nm<=(en||st+60); }catch(e){ return false; } }

// Overlays
function openOv(id){ document.getElementById(id).classList.add('open'); ri(); }
function closeOv(id){ document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.overlay').forEach(el=>el.addEventListener('click',e=>{ if(e.target===el) el.classList.remove('open'); }));
document.addEventListener('keydown',e=>{ if(e.key==='Escape') document.querySelectorAll('.overlay.open').forEach(el=>el.classList.remove('open')); });

// Project modal
function pickColor(el){ document.querySelectorAll('#proj-dots .cdot').forEach(d=>d.classList.remove('sel')); el.classList.add('sel'); pickCol=el.dataset.c; }
function addFolderEntry(nv,pv){
  const list=document.getElementById('proj-folder-list');
  const row=document.createElement('div'); row.className='folder-entry';
  row.innerHTML=`<input type="text" placeholder="Name" value="${esc(nv||'')}" style="flex:0 0 100px"><input type="text" placeholder="C:\\path\\to\\folder" value="${esc(pv||'')}"><div class="folder-entry-del" onclick="this.parentElement.remove()"><i data-lucide="x"></i></div>`;
  list.appendChild(row); ri();
}
document.getElementById('add-proj').onclick=()=>{
  editProj=null; document.getElementById('proj-name').value=''; document.getElementById('proj-joplin').value='';
  document.getElementById('proj-work').checked=false; document.getElementById('proj-h').textContent='New Project';
  document.getElementById('proj-folder-list').innerHTML=''; pickCol='amber';
  document.querySelectorAll('#proj-dots .cdot').forEach(d=>d.classList.toggle('sel',d.dataset.c==='amber'));
  openOv('ov-proj');
};
function saveProject(){
  const name=document.getElementById('proj-name').value.trim(); if(!name) return;
  const joplin=document.getElementById('proj-joplin').value.trim();
  const workMode=document.getElementById('proj-work').checked;
  const folders=[];
  document.querySelectorAll('#proj-folder-list .folder-entry').forEach(row=>{
    const ins=row.querySelectorAll('input');
    const fn=(ins[0]?.value||'').trim(),fp=(ins[1]?.value||'').trim();
    if(fp) folders.push({id:uid(),name:fn||fp,path:fp});
  });
  if(editProj){ const p=DB.projects.find(p=>p.id===editProj); if(p){p.name=name;p.color=pickCol;p.workMode=workMode;p.joplin=joplin;p.folders=folders;} }
  else{ const p=np(name,pickCol,workMode); p.joplin=joplin; p.folders=folders; DB.projects.push(p); active=p.id; }
  save(); closeOv('ov-proj'); render();
}

// Link modal
function buildIconGrid(){ const g=document.getElementById('icon-grid'); g.innerHTML=''; ICONS.forEach(name=>{ const el=document.createElement('div'); el.className='icon-opt'+(name===pickIcon?' sel':''); el.dataset.icon=name; el.innerHTML=`<i data-lucide="${name}"></i>`; el.onclick=()=>{ document.querySelectorAll('.icon-opt').forEach(e=>e.classList.remove('sel')); el.classList.add('sel'); pickIcon=name; ri(); }; g.appendChild(el); }); }
function openLinkModal(){ document.getElementById('l-name').value=''; document.getElementById('l-url').value=''; pickIcon='globe'; buildIconGrid(); openOv('ov-link'); }
function saveLink(){ const name=document.getElementById('l-name').value.trim(),url=document.getElementById('l-url').value.trim(); if(!name||!url) return; const p=ga(); if(!p) return; p.links.push({id:uid(),icon:pickIcon,name,url}); save(); closeOv('ov-link'); render(); }

// Event modal
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

// Note modal
function openNoteEditor(id){ editNote=id; if(id){ const n=ga()?.notes.find(n=>n.id===id); if(n){document.getElementById('n-title').value=n.title||''; document.getElementById('n-body').value=n.body||'';} } else{ document.getElementById('n-title').value=''; document.getElementById('n-body').value=''; } openOv('ov-note'); setTimeout(()=>document.getElementById('n-title').focus(),80); }
function saveNote(){ const title=document.getElementById('n-title').value.trim(),body=document.getElementById('n-body').value.trim(); if(!title&&!body){ closeOv('ov-note'); return; } const p=ga(); if(!p) return; if(editNote){ const n=p.notes.find(n=>n.id===editNote); if(n){n.title=title||'Untitled';n.body=body;n.date=ds();} } else{ p.notes.push({id:uid(),title:title||'Untitled',body,date:ds()}); } save(); closeOv('ov-note'); render(); }

// Clock
function tick(){ const now=new Date(); document.getElementById('clock').textContent=now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false}); document.getElementById('cdate').textContent=now.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}); }

load(); render(); tick(); setInterval(tick,15000);
