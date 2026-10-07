(function(){
var $=function(i){return document.getElementById(i)},hd=$('hd'),rm=matchMedia('(prefers-reduced-motion:reduce)'),Q=function(s,f){[].forEach.call(document.querySelectorAll(s),f)};
var pb=document.createElement('div');pb.id='pb';document.body.appendChild(pb);
var cs=document.querySelector('.cs'),tk=$('tk'),lastS=0;
function circ(){if(!cs||!tk||!cs.offsetParent)return;var s=innerWidth<700?Math.max(250,Math.min(innerWidth*.78,300)):Math.max(280,Math.min(380,innerWidth*.27)),s=Math.max(150,Math.min(s,innerHeight*.4/.866));var h=Math.round(s*.866);
if(s!==lastS){lastS=s;tk.style.setProperty('--s',s+'px');tk.querySelectorAll('.ci').forEach(function(c){c.style.cssText='width:'+s+'px;height:'+h+'px;min-width:'+s+'px;min-height:'+h+'px;max-width:'+s+'px;max-height:'+h+'px;flex:none'});$('cr').style.height=(h+40)+'px'}
if(rm.matches){tk.style.transform='none';$('cr').style.overflowX='auto';return}
var r=cs.getBoundingClientRect(),H=r.height-innerHeight,p=H>0?Math.min(1,Math.max(0,-r.top/(H*.7))):1,W=innerWidth,T=tk.offsetWidth,lc=tk.lastElementChild,end=T<=W?(W-T)/2:W/2-(lc.offsetLeft+lc.offsetWidth/2);tk.style.transform='translateX('+(W+(end-W)*p)+'px)'}
function onS(){hd.classList.toggle('sc',scrollY>20);var m=document.documentElement.scrollHeight-innerHeight;pb.style.width=(m>0?scrollY/m*100:0)+'%';circ();
Q('.tm2',function(m){if(!m.offsetParent)return;var r=m.getBoundingClientRect();m.style.setProperty('--p',Math.min(1,Math.max(0,(innerHeight*.65-r.top)/r.height)))});
Q('.toc',function(tc){if(!tc.offsetParent)return;var bs=tc.querySelectorAll('button'),act=0;bs.forEach(function(b,i){var s=$(b.dataset.go);if(s&&s.getBoundingClientRect().top<160)act=i});bs.forEach(function(b,i){b.classList.toggle('on',i===act)})})}
addEventListener('scroll',onS,{passive:true});addEventListener('resize',circ);
var dr=$('dr');function tg(o){document.documentElement.style.overflow=o?'hidden':'';dr.classList.toggle('open',o);dr.setAttribute('aria-hidden',!o)}
$('bg').onclick=function(){tg(true)};$('dx').onclick=function(){tg(false)};
dr.querySelectorAll('a').forEach(function(a){a.onclick=function(){tg(false)}});
addEventListener('keydown',function(e){if(e.key==='Escape')tg(false)});
Q('.bars',function(b){[3,1,2,1,4,1,1,3,2,1,3,1,2,2,1,4,1,2,3,1,1,2,4,1,2,1,3,2].forEach(function(n,i){var s=document.createElement('i');s.style.flex=n;if(i%2)s.style.background='transparent';b.insertBefore(s,b.firstChild)})});
var car=$('car');if(car){var cds=[].slice.call(car.children),pl=function(){return parseFloat(getComputedStyle(car).paddingLeft)};
function cur(){var l=car.scrollLeft,k=0,m=1e9;cds.forEach(function(x,i){var d=Math.abs(x.offsetLeft-car.offsetLeft-l-pl());if(d<m){m=d;k=i}});return k}
car.addEventListener('scroll',function(){clearTimeout(car._t);car._t=setTimeout(function(){var k=cur();cds.forEach(function(x,i){x.classList.toggle('on',i===k)})},60)},{passive:true});
function go(d){var k=Math.max(0,Math.min(cds.length-1,cur()+d));car.scrollTo({left:cds[k].offsetLeft-car.offsetLeft-pl(),behavior:'smooth'})}
$('pv').onclick=function(){go(-1)};$('nx').onclick=function(){go(1)};car.addEventListener('keydown',function(e){if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)})}
var tl=$('tl');if(tl){var S=[['Discover','Understand the business process, SAP landscape, users and integration expectations.'],['Design','Document requirements, process flows, data mapping, exception handling and integration design.'],['Build &amp; Configure','Coordinate agreed SAP configuration, development and integration work with the relevant teams.'],['Test &amp; Validate','Unit, SIT, UAT and regression testing, with defect tracking and go-live readiness checks.'],['Go-Live &amp; Support','User training, hypercare, production support and continuous improvement.']];
function sel(i){[].forEach.call(tl.children,function(x,j){x.setAttribute('aria-selected',j===i)});$('ts').textContent='Step 0'+(i+1)+' of 05';$('tt').innerHTML='<b>'+S[i][0]+'</b>';$('td').innerHTML=S[i][1]}
S.forEach(function(s,i){var x=document.createElement('button');x.setAttribute('role','tab');x.innerHTML='<b>0'+(i+1)+'</b>'+s[0];x.onclick=function(){sel(i)};x.onmouseenter=function(){if(matchMedia('(hover:hover)').matches)sel(i)};tl.appendChild(x)});sel(0)}
Q('.tabs',function(w){var bs=w.querySelectorAll('.tl button'),ps=w.querySelectorAll('.tpn');function s(i){bs.forEach(function(b,j){b.setAttribute('aria-selected',j===i)});ps.forEach(function(p,j){p.classList.toggle('on',j===i)})}bs.forEach(function(b,i){b.onclick=function(){s(i)}});s(0)});
Q('.fc',function(c){c.onclick=function(){c.classList.toggle('fl')}});
Q('[data-go]',function(b){b.onclick=function(){var x=$(b.dataset.go);if(x)x.scrollIntoView({behavior:'smooth',block:'start'})}});
Q('.flt',function(w){var bs=w.querySelectorAll('button');bs.forEach(function(b){b.onclick=function(){bs.forEach(function(x){x.setAttribute('aria-pressed',x===b)});Q('.rf2',function(c){c.classList.toggle('off',!(b.dataset.f==='all'||c.dataset.c===b.dataset.f))})}})});
var ck=$('ck');if(ck){var cb=ck.querySelectorAll('.chk');function cc(){var n=ck.querySelectorAll('[aria-pressed=true]').length;$('cn').textContent=n+' of '+cb.length+' selected'}
cb.forEach(function(b){b.onclick=function(){b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true');cc()}});
$('cs').onclick=function(){var l=[].map.call(ck.querySelectorAll('[aria-pressed=true]'),function(b){return '- '+b.textContent}).join('\n')||'(none selected yet)';location.href='mailto:customersupport@thanstonespact.com?subject='+encodeURIComponent('SAP discovery checklist')+'&body='+encodeURIComponent('Hello THANSTONES team,\n\nInputs we already have:\n'+l+'\n\nName / company:\n')}}
var pk=$('pk');if(pk){pk.querySelectorAll('.chk').forEach(function(b){b.onclick=function(){pk.querySelectorAll('.chk').forEach(function(x){x.setAttribute('aria-pressed',x===b)});var r=$('r'),pf='Interested in: '+b.dataset.pick+'\n';r.value=pf+r.value.replace(/^Interested in: .*\n?/,'')}})}
Q('.cnt',function(c){var to=+c.dataset.to,go=function(){if(rm.matches){c.textContent=to;return}var t0=null;function st(t){t0=t0||t;var p=Math.min(1,(t-t0)/1200);c.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(st)}requestAnimationFrame(st)};c._go=go});
var rv=document.querySelectorAll('.rv');
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vis');Q('.cnt',function(c){if(e.target.contains(c)&&c._go){c._go();c._go=null}});io.unobserve(e.target)}})},{threshold:.1});rv.forEach(function(e){io.observe(e)});
var mo=new IntersectionObserver(function(es){$('mb').classList.toggle('hide',es.some(function(x){return x.isIntersecting}))},{threshold:.15});['cta','ctp'].forEach(function(i){if($(i))mo.observe($(i))})}else{rv.forEach(function(e){e.classList.add('vis')});Q('.cnt',function(c){c.textContent=c.dataset.to})}
var f=$('fm');if(f)f.addEventListener('submit',function(ev){ev.preventDefault();var ok=true;
[['n','Enter your name.'],['e','Enter a valid email address.'],['r','Describe your requirement.']].forEach(function(x){var i=$(x[0]),v=i.value.trim(),bad=!v||(x[0]==='e'&&!/^\S+@\S+\.\S+$/.test(v));i.parentNode.querySelector('.err').textContent=bad?x[1]:'';i.setAttribute('aria-invalid',bad);if(bad)ok=false});
if(!ok)return;$('ok').style.display='block';
location.href='mailto:customersupport@thanstonespact.com?subject='+encodeURIComponent('Website enquiry')+'&body='+encodeURIComponent('Name: '+$('n').value+'\nCompany: '+$('c').value+'\nEmail: '+$('e').value+'\nPhone: '+$('p').value+'\n\n'+$('r').value)});

/* theme (contrast) toggle */
var tb=$('tb'),de=document.documentElement;
function sTh(d,save){d?de.setAttribute('data-theme','dark'):de.removeAttribute('data-theme');if(tb){tb.setAttribute('aria-pressed',d);tb.setAttribute('aria-label',d?'Switch to light mode':'Switch to dark mode')}if(save){try{localStorage.setItem('tp-theme',d?'dark':'light')}catch(e){}}}
if(tb){sTh(de.getAttribute('data-theme')==='dark',false);tb.onclick=function(){sTh(de.getAttribute('data-theme')!=='dark',true)}}
/* site search */
var IDX=[['Services', 'services.html', 'SAP consulting, integration, technical, support, data, testing, digital transformation'], ['Industries', 'industries.html', 'Retail, manufacturing, wholesale, supply chain, hospitality, IT services, construction, export'], ['Export Services', 'export.html', 'Export business, documentation, market development'], ['Stories', 'experience.html', 'AIMS Foodics POS to SAP integration, Gopalan Enterprises SAP support'], ['Insights', 'insights.html', 'SAP guides, integration, S/4HANA, data migration'], ['About Us', 'about.html', 'Company, vision and mission'], ['Careers', 'careers.html', 'Connect with our team'], ['Contact Us', 'contact.html', 'Enquiry form, phone, WhatsApp, email, Chennai address'], ['Privacy Policy', 'privacy.html', 'How personal information is handled'], ['Terms & Conditions', 'terms.html', 'Terms of use'], ['SAP Consulting & Implementation', 'services.html#svc-1', ''], ['SAP Integration Services', 'services.html#svc-2', ''], ['SAP Technical Services', 'services.html#svc-3', ''], ['SAP Application Support & Managed Services', 'services.html#svc-4', ''], ['SAP Data & Analytics', 'services.html#svc-5', ''], ['SAP Testing & Quality Assurance', 'services.html#svc-6', ''], ['Digital Transformation & Cloud Services', 'services.html#svc-7', ''], ['Industry-Specific Solutions', 'services.html#svc-8', ''], ['SAP Training & Consulting Resources', 'services.html#svc-9', '']];
var sr=$('sr'),si=$('si'),sl=$('sl'),sbt=$('sb'),sel2=-1;
function srOpen(o){if(!sr)return;sr.classList.toggle('open',o);de.style.overflow=o?'hidden':'';if(o){si.value='';srRender('');si.focus()}else if(sbt)sbt.focus()}
function srRender(q){q=q.trim().toLowerCase();sl.innerHTML='';sel2=-1;var r=IDX.filter(function(x){return !q||(x[0]+' '+x[2]).toLowerCase().indexOf(q)>-1});
if(!r.length){var n=document.createElement('li');n.className='none';n.textContent='No matches. Try \u201CSAP\u201D, \u201Ccontact\u201D or \u201Capproach\u201D.';sl.appendChild(n);return}
r.forEach(function(x){var li=document.createElement('li'),a=document.createElement('a'),b=document.createElement('strong'),d=document.createElement('span');a.href=x[1];b.textContent=x[0];d.textContent=x[2];a.appendChild(b);a.appendChild(d);li.appendChild(a);sl.appendChild(li)})}
function srMove(d){var as=sl.querySelectorAll('a');if(!as.length)return;sel2=(sel2+d+as.length)%as.length;as.forEach(function(a,i){a.classList.toggle('on',i===sel2)});as[sel2].scrollIntoView({block:'nearest'})}
if(sr){sbt.onclick=function(){srOpen(true)};$('sx').onclick=function(){srOpen(false)};sr.addEventListener('mousedown',function(e){if(e.target===sr)srOpen(false)});
si.addEventListener('input',function(){srRender(si.value)});
si.addEventListener('keydown',function(e){if(e.key==='ArrowDown'){e.preventDefault();srMove(1)}else if(e.key==='ArrowUp'){e.preventDefault();srMove(-1)}else if(e.key==='Enter'){var a=sl.querySelectorAll('a')[Math.max(sel2,0)];if(a)location.href=a.getAttribute('href')}});
addEventListener('keydown',function(e){if(e.key==='Escape'&&sr.classList.contains('open'))srOpen(false);if(e.key==='/'&&!/INPUT|TEXTAREA/.test((document.activeElement||{}).tagName)&&!sr.classList.contains('open')){e.preventDefault();srOpen(true)}})}

var hm=location.hash.match(/^#svc-(\d)$/);if(hm){var sb2=document.querySelectorAll('.tabs .tl button')[+hm[1]-1];if(sb2){sb2.click();var tw=document.querySelector('.tabs');if(tw)setTimeout(function(){tw.scrollIntoView({block:'center'})},60)}}
onS();
})();
var sh2=location.hash&&document.querySelector('details'+location.hash);if(sh2){sh2.open=true;if(location.hash==='#svc-5'){var t6=document.getElementById('svc-6');if(t6)t6.open=true}setTimeout(function(){sh2.scrollIntoView({block:'start'})},80)}
addEventListener('hashchange',function(){var d=location.hash&&document.querySelector('details'+location.hash);if(d){d.open=true;d.scrollIntoView({block:'start'})}});
