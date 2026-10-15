'use strict';
// This demo does not submit, fetch, persist, or transmit form values.
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { menu?.setAttribute('aria-expanded', 'false'); nav?.classList.remove('is-open'); }
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);

const outputs = {
  baseline: { label: 'Illustrative output / 01', title: 'Understand the site and its wider setting.', description: 'Baseline information and selected viewpoints help organise the context for an assessment.', points: ['Landscape character and setting', 'Potential visual receptors', 'Viewpoint selection'], image: 'assets/baseline.svg', alt: 'Illustrative landscape plan with conceptual viewpoints and a site boundary; not a real map or GIS analysis.', caption: 'Layout illustration only · Not a real site or GIS analysis', cta: 'Discuss assessment support', service: 'lvia' },
  visual: { label: 'Illustrative output / 02', title: 'Communicate a proposal in context.', description: 'Visual material can help explain how a proposed development relates to its surroundings.', points: ['Existing setting', 'Proposed form in context', 'Clear presentation of the brief'], image: 'assets/visualisation.svg', alt: 'Original landscape illustration with fictional built form; not a verified view or photomontage.', caption: 'Layout illustration only · Not a verified view or photomontage', cta: 'Discuss visualisation', service: 'visualisation' },
  mitigation: { label: 'Illustrative output / 03', title: 'Explore a sensitive design response.', description: 'Mitigation proposals can bring design, planting and landscape management into the assessment discussion.', points: ['Retained landscape elements', 'Proposed planting structure', 'Design and management measures'], image: 'assets/mitigation.svg', alt: 'Illustrative plan showing a fictional building, retained planting and proposed planting; not a real landscape mitigation plan.', caption: 'Layout illustration only · Not a project mitigation plan', cta: 'Discuss mitigation', service: 'mitigation' }
};
const outputTabs = [...document.querySelectorAll('[data-output]')];
const outputImage = document.querySelector('#output-image');
const outputDialog = document.querySelector('#output-dialog');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
function animateChange(element) {
  if (!motionPreference.matches && element?.animate) element.animate([{opacity:.5,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'ease-out'});
}
function selectOutput(button) {
  const item = outputs[button.dataset.output];
  outputTabs.forEach(tab => { const selected = tab === button; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; });
  document.querySelector('#output-panel').setAttribute('aria-labelledby', button.id);
  document.querySelector('.output-label').textContent = item.label;
  document.querySelector('#output-title').textContent = item.title;
  document.querySelector('#output-description').textContent = item.description;
  document.querySelector('#output-points').replaceChildren(...item.points.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  outputImage.src = `${item.image}?v=20261014-client1`; outputImage.alt = item.alt;
  if (button.dataset.output === 'mitigation') { const current = document.querySelector('#mitigation-image'); outputImage.src = current.src; outputImage.alt = current.alt; }
  document.querySelector('#output-caption').textContent = item.caption;
  const link = document.querySelector('#output-enquiry'); link.href = `enquiry.html?v=20261014-client1&service=${item.service}`;
  link.replaceChildren(document.createTextNode(`${item.cta} `)); const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true'); link.append(arrow);
  document.querySelector('#enlarge-output').setAttribute('aria-label', `Enlarge illustrative ${button.textContent.toLowerCase()} diagram`);
  for (const [key,id] of Object.entries({baseline:'baseline-workshop',visual:'visual-workshop',mitigation:'mitigation-workshop'})) document.getElementById(id).hidden = key !== button.dataset.output;
  animateChange(document.querySelector('#output-panel'));
}
outputTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectOutput(tab));
  tab.addEventListener('keydown', event => { let next; if (event.key === 'ArrowRight') next = (index + 1) % outputTabs.length; if (event.key === 'ArrowLeft') next = (index + outputTabs.length - 1) % outputTabs.length; if (event.key === 'Home') next = 0; if (event.key === 'End') next = outputTabs.length - 1; if (next !== undefined) { event.preventDefault(); selectOutput(outputTabs[next]); outputTabs[next].focus(); } });
});
document.querySelector('#enlarge-output')?.addEventListener('click', () => { const large = document.querySelector('#dialog-image'); large.src = outputImage.src; large.alt = outputImage.alt; document.querySelector('#dialog-caption').textContent = document.querySelector('#output-caption').textContent; outputDialog.showModal(); });
document.querySelector('#close-dialog')?.addEventListener('click', () => outputDialog.close());
outputDialog?.addEventListener('click', event => { if (event.target === outputDialog) { const bounds = outputDialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) outputDialog.close(); } });

// Service browsing remains usable as native details when JavaScript is unavailable.
const serviceImages = {lvia:'baseline',lva:'baseline',character:'baseline',ztv:'baseline',visualisation:'visualisation',mitigation:'mitigation'};
document.querySelectorAll('.service-item').forEach(details => details.addEventListener('toggle', () => {
  if (!details.open) return;
  const group = details.closest('.service-group');
  group.querySelectorAll('.service-item').forEach(other => { if (other !== details) other.open = false; });
  const kind = serviceImages[details.dataset.service];
  const preview = group.querySelector('.service-preview');
  const captions = {baseline:'Concept viewpoints · Not a real site or GIS analysis',visualisation:'Concept visualisation · Not a verified view',mitigation:'Concept mitigation · Not a project plan'};
  preview.querySelector('img').src = `assets/${kind}.svg?v=20261014-client1`;
  preview.querySelector('img').alt = `Original ${kind} concept illustration; not an LVIA project.`;
  preview.querySelector('figcaption').textContent = captions[kind];
  animateChange(preview);
}));
document.querySelectorAll('[data-show-output]').forEach(link => link.addEventListener('click',()=> {
  const tab = outputTabs.find(item=>item.dataset.output===link.dataset.showOutput);
  if (tab) selectOutput(tab);
}));

const viewpointCopy = {
  a:'A · Landscape setting — a viewpoint can help describe the wider landscape context.',
  b:'B · Visual receptors — viewpoints can relate to places where people may experience a view.',
  c:'C · Proposal context — a viewpoint can help organise a discussion of the proposed change.'
};
document.querySelectorAll('[data-viewpoint]').forEach(button=>button.addEventListener('click',()=> {
  document.querySelectorAll('[data-viewpoint]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
  document.querySelector('#viewpoint-description').textContent = viewpointCopy[button.dataset.viewpoint];
}));
const comparisonRange = document.querySelector('#comparison-range');
function updateComparison(value) {
  const amount = Math.round(Math.max(0,Math.min(100,Number(value))));
  comparisonRange.value=amount;
  document.querySelector('#comparison').style.setProperty('--comparison',`${amount}%`);
  comparisonRange.setAttribute('aria-valuetext',`${amount} percent concept proposal`);
  document.querySelector('.existing-label').hidden = amount === 100;
  document.querySelector('.proposed-label').hidden = amount === 0;
  document.querySelector('.comparison-line').hidden = amount === 0 || amount === 100;
  document.querySelectorAll('[data-comparison]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.comparison)===amount)));
}
comparisonRange?.addEventListener('input',()=>updateComparison(comparisonRange.value));
document.querySelectorAll('[data-comparison]').forEach(button=>button.addEventListener('click',()=>updateComparison(button.dataset.comparison)));
const comparison = document.querySelector('#comparison');
if (comparison) {
  let dragPointer = null;
  function compareAt(event) {const bounds=comparison.getBoundingClientRect();updateComparison(100-(event.clientX-bounds.left)/bounds.width*100);}
  comparison.addEventListener('pointerdown',event=> {
    if(event.button!==0) return;
    const bounds=comparison.getBoundingClientRect();
    const divider=bounds.left+bounds.width*(1-Number(comparisonRange.value)/100);
    if(event.pointerType==='touch'&&Math.abs(event.clientX-divider)>32) return;
    dragPointer=event.pointerId;comparison.setPointerCapture(dragPointer);compareAt(event);event.preventDefault();
  });
  comparison.addEventListener('pointermove',event=>{if(event.pointerId===dragPointer) compareAt(event);});
  const stopDrag=()=>{dragPointer=null;};
  comparison.addEventListener('pointerup',stopDrag);comparison.addEventListener('pointercancel',stopDrag);comparison.addEventListener('lostpointercapture',stopDrag);
}
document.querySelectorAll('[data-layer]').forEach(button=>button.addEventListener('click',()=> {
  const retained = button.dataset.layer==='retained';
  document.querySelectorAll('[data-layer]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
  document.querySelector('#mitigation-image').src = `assets/${retained?'mitigation-retained':'mitigation'}.svg?v=20261014-client1`;
  document.querySelector('#mitigation-image').alt = retained?'Retained planting in a fictional concept layout.':'Retained planting and proposed measures in a fictional concept layout.';
  document.querySelector('#mitigation-description').textContent = retained?'Retained elements · Consider existing landscape features as part of the site context.':'Concept measures · Explore how proposed planting could form part of a design response.';
  outputImage.src = document.querySelector('#mitigation-image').src;
  outputImage.alt = document.querySelector('#mitigation-image').alt;
  animateChange(document.querySelector('.mitigation-plan'));
}));

const guide = document.querySelector('#guide-form');
const stageNames = {early:'Early feasibility',submission:'Preparing a planning submission',unsure:''};
if (guide) {
  const stage = document.querySelector('#guide-stage');
  const first = document.querySelector('#guide-step-one');
  const second = document.querySelector('#guide-step-two');
  const result = document.querySelector('#guide-result');
  const progress = document.querySelector('#guide-progress');
  document.querySelector('#guide-fields').disabled=false;
  guide.addEventListener('submit',event=>event.preventDefault());
  const resetTopics = ()=> {
    document.querySelectorAll('[data-topic]').forEach(button=>button.setAttribute('aria-pressed','false'));
    result.hidden=true; document.querySelector('#guide-links').replaceChildren();
  };
  stage.addEventListener('change',()=> {stage.removeAttribute('aria-invalid');document.querySelector('#guide-error').hidden=true;resetTopics();});
  document.querySelector('#guide-next').addEventListener('click',()=> {
    if (!Object.hasOwn(stageNames,stage.value)) {document.querySelector('#guide-error').hidden=false;stage.setAttribute('aria-invalid','true');stage.focus();return;}
    first.hidden=true; second.hidden=false;progress.textContent='Step 2 of 2 · Your main question';document.querySelector('#guide-question').focus();
  });
  document.querySelector('#guide-back').addEventListener('click',()=> {first.hidden=false;second.hidden=true;resetTopics();progress.textContent='Step 1 of 2 · Project stage';stage.focus();});
  document.querySelector('#guide-reset').addEventListener('click',()=> {guide.reset();first.hidden=false;second.hidden=true;resetTopics();progress.textContent='Step 1 of 2 · Project stage';stage.focus();});
  const topics = {character:[['character','Landscape / Townscape Character']],effects:[['lvia','Landscape & Visual Impact Assessment'],['lva','Landscape & Visual Appraisal']],visibility:[['ztv','Zone of Theoretical Visibility']],presentation:[['visualisation','Photomontages & Visualisation']],mitigation:[['mitigation','Landscape Mitigation Plans']]};
  document.querySelectorAll('[data-topic]').forEach(button=>button.addEventListener('click',()=> {
    document.querySelectorAll('[data-topic]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
    const links = topics[button.dataset.topic].map(([key,label])=> {
      const link=document.createElement('a');const query=new URLSearchParams({v:'20261014-client1',service:key,stage:stage.value});
      link.href=`enquiry.html?${query}`;link.className='text-link';link.append(document.createTextNode(label+' '));const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');link.append(arrow);return link;
    });
    document.querySelector('#guide-links').replaceChildren(...links);result.hidden=false;progress.textContent='Services to discuss · You can edit your enquiry choices';document.querySelector('#guide-result-title').focus();animateChange(result);
  }));
}

const form = document.querySelector('#enquiry-form');

// A lightweight decorative 3D projection, generated from mathematical waves.
// No geographic data, network dependencies or assessment calculations.
const terrain = document.querySelector('#terrain-canvas');
if (terrain) {
  const context = terrain.getContext('2d');
  const pause = document.querySelector('#terrain-pause');
  const mode = document.querySelector('#terrain-mode');
  const staticPreference = window.matchMedia('(max-width: 680px), (prefers-reduced-motion: reduce)');
  let width=0,height=0,frame=0,lastFrame=0,phase=0,visible=false,userPaused=false,tilt=0;
  function draw() {
    if (!context || !width || !height) return;
    context.clearRect(0,0,width,height);
    const yaw=.18+Math.sin(phase*.15)*.1+tilt;
    const pitch=.42;
    const rows=[];
    for (let row=0;row<13;row++) {
      const points=[];
      for(let column=0;column<23;column++) {
        const x=(column/22-.5)*2.4,z=(row/12-.5)*2.1;
        const y=.2*Math.sin(x*3+z*1.8)+.12*Math.cos(z*4-x);
        const rotatedX=x*Math.cos(yaw)-z*Math.sin(yaw),rotatedZ=x*Math.sin(yaw)+z*Math.cos(yaw);
        const projectedY=y*Math.cos(pitch)+rotatedZ*Math.sin(pitch),depth=-y*Math.sin(pitch)+rotatedZ*Math.cos(pitch);
        const scale=3.5/(3.5+depth);
        points.push({x:width*.5+rotatedX*width*.27*scale,y:height*.53-projectedY*height*.63*scale,depth,scale});
      }
      rows.push(points);
    }
    context.lineWidth=.7;
    for (let row=0;row<rows.length;row++) for(let column=0;column<rows[row].length;column++) {
      const point=rows[row][column];
      context.strokeStyle='rgba(177,198,148,.28)';
      for(const next of [rows[row][column+1],rows[row+1]?.[column]]) if(next) {
        context.beginPath();context.moveTo(point.x,point.y);context.lineTo(next.x,next.y);context.stroke();
      }
      context.fillStyle=`rgba(211,226,182,${Math.max(.35,.85-point.depth*.18)})`;
      context.beginPath();context.arc(point.x,point.y,1.6*point.scale,0,Math.PI*2);context.fill();
    }
  }
  function isRunning() {return !staticPreference.matches&&!userPaused&&visible&&!document.hidden&&!!context;}
  function loop(now) {
    frame=0;
    if(!isRunning()) return;
    if(now-lastFrame>=33) {phase+=.033;draw();lastFrame=now;}
    frame=requestAnimationFrame(loop);
  }
  function sync() {
    if(frame) cancelAnimationFrame(frame);frame=0;
    pause.hidden=staticPreference.matches||!context;
    pause.textContent=userPaused?'Resume motion':'Pause motion';
    pause.setAttribute('aria-pressed',String(userPaused));
    mode.textContent=staticPreference.matches?'Static concept sketch · No geographic data':userPaused?'Motion paused · No geographic data':'Decorative 3D sketch · No geographic data';
    terrain.dataset.motion=staticPreference.matches?'static':isRunning()?'running':'paused';
    draw();if(isRunning()) frame=requestAnimationFrame(loop);
  }
  function resize() {
    const rect=terrain.getBoundingClientRect();width=rect.width;height=rect.height;
    const ratio=Math.min(window.devicePixelRatio||1,2);terrain.width=Math.round(width*ratio);terrain.height=Math.round(height*ratio);
    context?.setTransform(ratio,0,0,ratio,0,0);sync();
  }
  pause.addEventListener('click',()=>{userPaused=!userPaused;sync();});
  terrain.addEventListener('pointermove',event=>{if(!isRunning()) return;const rect=terrain.getBoundingClientRect();tilt=((event.clientX-rect.left)/rect.width-.5)*.15;});
  terrain.addEventListener('pointerleave',()=>{tilt=0;});
  staticPreference.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.1}).observe(terrain);
  new ResizeObserver(resize).observe(terrain);resize();
}

const studyPhoto = document.querySelector('.study-photo');
if (studyPhoto) {
  const photo=studyPhoto.querySelector('img');
  studyPhoto.addEventListener('pointermove',event=> {
    if(motionPreference.matches||window.matchMedia('(max-width: 900px)').matches||event.pointerType!=='mouse') return;
    const bounds=studyPhoto.getBoundingClientRect();
    photo.style.transform=`scale(1.025) translate(${((event.clientX-bounds.left)/bounds.width-.5)*5}px,${((event.clientY-bounds.top)/bounds.height-.5)*5}px)`;
  });
  studyPhoto.addEventListener('pointerleave',()=>{photo.style.transform='';});
  motionPreference.addEventListener('change',()=>{photo.style.transform='';});
}
if (form) {
  const fields = document.querySelector('#form-fields');
  const service = document.querySelector('#service');
  const sector = document.querySelector('#sector');
  const brief = document.querySelector('#brief');
  const params = new URLSearchParams(window.location.search);
  // Internal reviewers can inspect the failure/retry state with ?review=1.
  document.querySelector('.demo-controls').hidden = params.get('review') !== '1';
  const allowedServices = new Set([...service.options].map(option => option.value));
  const allowedSectors = new Set([...sector.options].map(option => option.value));
  if (allowedServices.has(params.get('service'))) service.value = params.get('service');
  if (allowedSectors.has(params.get('sector'))) { sector.value = params.get('sector'); if (sector.value) document.querySelector('#optional-details').open = true; }
  const planningStage = document.querySelector('#stage');
  if (Object.hasOwn(stageNames,params.get('stage')) && stageNames[params.get('stage')]) { planningStage.value=stageNames[params.get('stage')];document.querySelector('#optional-details').open=true; }
  fields.disabled = false;
  function updateContext() {
    const context = document.querySelector('#selection-context'); const texts = [];
    if (service.value !== 'unsure') texts.push(`Selected support: ${service.selectedOptions[0].textContent}`);
    if (sector.value) texts.push(`Project context: ${sector.selectedOptions[0].textContent}`);
    if (planningStage.value) texts.push(`Planning stage: ${planningStage.value}`);
    context.textContent = texts.join(' · '); context.hidden = !texts.length;
  }
  updateContext(); service.addEventListener('change', updateContext); sector.addEventListener('change', updateContext); planningStage.addEventListener('change',updateContext);
  brief.addEventListener('input', () => { document.querySelector('#brief-count').textContent = `${brief.value.length} / 2000`; });
  const validators = {
    name: input => input.value.trim() ? '' : 'Enter your name to continue.',
    email: input => !input.value.trim() ? 'Enter an email address.' : (input.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) ? 'Enter an email address such as alex@example.com.' : '',
    location: input => input.value.trim() ? '' : 'Enter a location, or write “Not yet confirmed”.',
    brief: input => input.value.trim() ? '' : 'Add a short description of your project.',
    link: input => { if (!input.value.trim()) return ''; try { const url = new URL(input.value.trim()); return ['https:', 'http:'].includes(url.protocol) && url.hostname ? '' : 'Use a complete http:// or https:// link.'; } catch { return 'Use a complete http:// or https:// link.'; } }
  };
  const errorSummary = document.querySelector('#error-summary');
  function validateField(id) {
    const input = document.getElementById(id); const message = validators[id](input); const error = document.getElementById(`${id}-error`);
    error.textContent = message; error.hidden = !message; if (message) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    return message;
  }
  Object.keys(validators).forEach(id => document.getElementById(id).addEventListener('input', () => { if (document.getElementById(id).getAttribute('aria-invalid') === 'true') validateField(id); errorSummary.hidden = true; }));
  let processing = false;
  const submit = document.querySelector('#submit-demo');
  const status = document.querySelector('#form-status');
  const failure = document.querySelector('#failure-notice');
  const formView = document.querySelector('#form-view');
  const successView = document.querySelector('#success-view');
  const summary = document.querySelector('#enquiry-summary');
  function buildSummary() {
    const pairs = [['Support', service.selectedOptions[0].textContent], ['Name', document.querySelector('#name').value.trim()], ['Email', document.querySelector('#email').value.trim()], ['Site location', document.querySelector('#location').value.trim()], ['Project brief', brief.value.trim()]];
    if (sector.value) pairs.push(['Project sector', sector.selectedOptions[0].textContent]);
    for (const [id, label] of [['stage','Planning stage'],['company','Company / organisation'],['phone','Phone'],['timing','Target timing'],['link','Supporting link']]) { const value = document.getElementById(id).value.trim(); if (value) pairs.push([label, value]); }
    summary.replaceChildren(...pairs.flatMap(([label, value]) => { const dt = document.createElement('dt'); dt.textContent = label; const dd = document.createElement('dd'); dd.textContent = value; return [dt, dd]; }));
  }
  function restoreForm() { formView.hidden = false; successView.hidden = true; document.querySelector('#form-title').setAttribute('tabindex', '-1'); document.querySelector('#form-title').focus(); }
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (processing) return;
    failure.hidden = true;
    const errors = Object.keys(validators).map(id => ({id, message: validateField(id)})).filter(item => item.message);
    if (errors.length) {
      const heading = document.createElement('strong'); heading.textContent = `Please check ${errors.length} ${errors.length === 1 ? 'field' : 'fields'} before previewing.`;
      const ul = document.createElement('ul');
      errors.forEach(({id, message}) => { const li = document.createElement('li'); const link = document.createElement('a'); link.href = `#${id}`; link.textContent = message; link.addEventListener('click', event => { event.preventDefault(); if (id === 'link') document.querySelector('#optional-details').open = true; document.getElementById(id).focus(); }); li.append(link); ul.append(li); });
      errorSummary.replaceChildren(heading, ul); errorSummary.hidden = false;
      if (errors.some(item => item.id === 'link')) document.querySelector('#optional-details').open = true;
      document.getElementById(errors[0].id).focus(); status.textContent = ''; return;
    }
    errorSummary.hidden = true; processing = true;
    const shouldFail = document.querySelector('#simulate-failure').checked;
    document.querySelector('#simulate-failure').checked = false;
    fields.disabled = true; submit.disabled = true; form.setAttribute('aria-busy', 'true');
    submit.textContent = 'Preparing demo preview…'; status.textContent = 'Simulating processing only. No information is being sent.';
    // Delay demonstrates the processing state; it performs no network operation.
    await new Promise(resolve => window.setTimeout(resolve, 900));
    fields.disabled = false; submit.disabled = false; form.removeAttribute('aria-busy'); processing = false;
    submit.replaceChildren(document.createTextNode('Preview enquiry ')); const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true'); submit.append(arrow);
    status.textContent = '';
    if (shouldFail) { failure.hidden = false; failure.focus(); return; }
    buildSummary(); formView.hidden = true; successView.hidden = false; document.querySelector('#success-title').focus();
  });
  document.querySelector('#retry-demo').addEventListener('click', () => form.requestSubmit());
  document.querySelector('#edit-enquiry').addEventListener('click', restoreForm);
  document.querySelector('#reset-enquiry').addEventListener('click', () => {
    form.reset(); service.value = 'unsure'; sector.value = ''; summary.replaceChildren(); failure.hidden = true; errorSummary.hidden = true;
    Object.keys(validators).forEach(id => { document.getElementById(id).removeAttribute('aria-invalid'); document.getElementById(`${id}-error`).hidden = true; });
    document.querySelector('#simulate-failure').checked = false; document.querySelector('#optional-details').open = false;
    document.querySelector('#brief-count').textContent = '0 / 2000'; updateContext(); restoreForm();
  });
  // Prevent browser back/forward cache from retaining personal demo input.
  window.addEventListener('pageshow', event => { if (event.persisted) { form.reset(); service.value = 'unsure'; sector.value = ''; summary.replaceChildren(); formView.hidden = false; successView.hidden = true; fields.disabled = false; updateContext(); } });
}
