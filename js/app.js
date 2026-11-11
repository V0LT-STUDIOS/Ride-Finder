(function () {
  'use strict';
  const { bikes, retailers } = window.RF_DATA;
  const $ = (selector) => document.querySelector(selector);
  const byId = (id) => document.getElementById(id);
  const money = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const categories = { emoto: 'E-MOTO', pit: 'PIT BIKE', pedal: 'PEDAL E-BIKE', motorcycle: 'ELECTRIC MOTO' };
  const sizes = { compact: 'Compact', mid: 'Mid-size', full: 'Full-size' };
  const questions = [
    { id: 'terrain', title: 'Where do you ride most?', description: 'Choose the terrain you care about most. Lots of bikes work on multiple surfaces.', options: [
      ['trail', 'Trails & dirt', 'Technical trails, jumps, open dirt'], ['mixed', 'A little of everything', 'A versatile all-rounder'], ['paved', 'Pavement', 'Mostly hard surfaces, with suitable tires'], ['track', 'Track & motocross', 'Dedicated off-road performance'] ] },
    { id: 'skill', title: 'How experienced are you?', description: 'We weigh manageable power more heavily for newer riders.', options: [
      [1, 'New rider', 'I want something approachable'], [2, 'Some experience', 'I have time on an e-bike or dirt bike'], [3, 'Very experienced', 'I am comfortable on powerful motorcycles'] ] },
    { id: 'budget', title: 'What is your bike budget?', description: 'Bike only, before tax, shipping and extra gear.', options: [
      [2500, 'Up to $2,500', 'Entry-level picks'], [3500, 'Up to $3,500', 'Affordable performance'], [4500, 'Up to $4,500', 'Popular midrange'], [6000, 'Up to $6,000', 'More performance options'], [10000, 'Up to $10,000', 'Premium models'], [20000, 'Flexible budget', 'Show me the full range'] ] },
    { id: 'power', title: 'How much power feels right?', description: 'Peak motor power is an approximate comparison tool, not a safety rating.', options: [
      [4, 'Easygoing', 'Under ~6 kW peak'], [10, 'Quick & playful', 'Around 6–12 kW'], [18, 'Seriously quick', 'Around 12–25 kW'], [40, 'Maximum performance', 'High-power competition territory'] ] },
    { id: 'size', title: 'How big should it feel?', description: 'Bike size is approximate. Always check seat height, weight and fit in person.', options: [
      ['compact', 'Compact', 'Smaller, lighter, more flickable'], ['mid', 'Mid-size', 'A popular balanced size'], ['full', 'Full-size', 'Larger motorcycle-style chassis'], ['any', 'No preference', 'Keep my options open'] ] },
    { id: 'kind', title: 'What kind of ride?', description: 'Pedal e-bikes and off-road e-motos are legally different vehicle types.', options: [
      ['emoto', 'Electric dirt bike', 'E-motos and off-road bikes'], ['pedal', 'Pedal e-bike', 'With working pedals'], ['motorcycle', 'Electric motorcycle', 'Full-size motorcycle feel'], ['any', 'Open to anything', 'Surprise me'] ] },
    { id: 'street', title: 'How will you use pavement?', description: 'Pavement capability and public-road legality are separate things.', options: [
      ['offroad', 'Private property / trails', 'Road registration is not my priority'], ['capable', 'Pavement-capable', 'I know the bike may be off-road only'], ['legal', 'Public road use', 'Prioritize potential legal road-use categories'] ] }
  ];
  const state = { step: 0, answers: {}, results: [], compare: new Set(), saved: loadSaved(), toastTimeout: null };

  function loadSaved() {
    try { const value = JSON.parse(localStorage.getItem('ridefinder-saved-v1') || '[]'); return new Set(Array.isArray(value) ? value.filter((id) => bikes.some((b) => b.id === id)) : []); }
    catch { return new Set(); }
  }
  function storeSaved() {
    try { localStorage.setItem('ridefinder-saved-v1', JSON.stringify([...state.saved])); } catch { /* private mode */ }
  }
  function toast(message) {
    const el = byId('toast'); el.textContent = message; el.classList.add('show');
    clearTimeout(state.toastTimeout); state.toastTimeout = setTimeout(() => el.classList.remove('show'), 2600);
  }
  function renderQuiz() {
    const q = questions[state.step];
    byId('results').hidden = true; byId('quiz').hidden = false;
    const choice = state.answers[q.id];
    byId('quiz').innerHTML = `
      <div class="quiz-head"><span>QUESTION ${String(state.step + 1).padStart(2,'0')} OF ${questions.length}</span><span>${Math.round((state.step / questions.length) * 100)}% COMPLETE</span></div>
      <div class="progress"><span style="width:${((state.step + 1) / questions.length) * 100}%"></span></div>
      <div class="question"><h3>${escapeHTML(q.title)}</h3><p class="question-description">${escapeHTML(q.description)}</p>
        <div class="choices">${q.options.map(([value, title, detail]) => `<button type="button" class="choice ${choice === value ? 'selected' : ''}" data-choice="${escapeHTML(value)}" aria-pressed="${choice === value}"><span><strong>${escapeHTML(title)}</strong><small>${escapeHTML(detail)}</small></span><span class="choice-tick" aria-hidden="true">✓</span></button>`).join('')}</div></div>
      <div class="quiz-controls"><button type="button" class="button-plain" data-step="back" ${state.step === 0 ? 'disabled' : ''}>← BACK</button><button type="button" class="button button-primary" data-step="next" ${choice === undefined ? 'disabled' : ''}>${state.step === questions.length - 1 ? 'SHOW MY MATCHES' : 'NEXT QUESTION'} <span aria-hidden="true">→</span></button></div>
      <p class="quiz-note">No account, email or payment details needed. Your picks stay in this browser.</p>`;
  }
  function selectAnswer(value) {
    const q = questions[state.step];
    const option = q.options.find(([v]) => String(v) === String(value));
    if (!option) return;
    state.answers[q.id] = option[0]; renderQuiz();
  }
  function step(direction) {
    if (direction === 'back') { state.step = Math.max(0, state.step - 1); renderQuiz(); return; }
    if (direction === 'restart') { state.answers = {}; state.step = 0; renderQuiz(); return; }
    const q = questions[state.step]; if (state.answers[q.id] === undefined) return;
    if (state.step === questions.length - 1) { renderResults(); return; }
    state.step++; renderQuiz();
  }
  function rankBike(b) {
    const a = state.answers;
    let score = 88;
    if (b.price > a.budget) score -= 42 + Math.min(25, Math.round((b.price - a.budget) / Math.max(a.budget, 1) * 50));
    else score += 3;
    if (b.terrains.includes(a.terrain)) score += 8; else score -= 17;
    if (a.size !== 'any') score += b.size === a.size ? 7 : -14;
    if (a.kind !== 'any') {
      const same = a.kind === 'emoto' ? (b.kind === 'emoto' || b.kind === 'pit') : b.kind === a.kind;
      score += same ? 9 : -33;
    }
    if (a.street === 'legal') score += b.roadStatus !== 'offroad' ? 12 : -50;
    if (a.street === 'capable') score += b.terrains.includes('paved') ? 7 : -9;
    if (b.level > a.skill) score -= (b.level - a.skill) * 22;
    if (b.level < a.skill - 1) score -= 5;
    const relativePower = Math.abs(Math.log2((b.peakKW + 2) / (Number(a.power) + 2)));
    score -= Math.min(26, Math.round(relativePower * 12));
    if (a.skill === 1 && b.peakKW > 15) score -= 20;
    return Math.max(1, Math.min(98, Math.round(score)));
  }
  function reasonFor(b) {
    const reasons = [];
    const a = state.answers;
    if (b.price <= a.budget) reasons.push('within your budget');
    if (b.terrains.includes(a.terrain)) reasons.push('fits your terrain');
    if (a.size !== 'any' && b.size === a.size) reasons.push('your preferred size');
    if (a.street === 'legal' && b.roadStatus !== 'offroad') reasons.push('a more relevant vehicle category for public roads');
    if (b.level <= a.skill) reasons.push('experience-aligned');
    return reasons.length ? `Good match: ${reasons.slice(0,3).join(' · ')}.` : 'A possible alternative, but it involves tradeoffs against your choices.';
  }
  function renderResults(scrollToResults = true) {
    const eligibleBikes = state.answers.street === 'legal' ? bikes.filter((b) => b.roadStatus !== 'offroad') : bikes;
    state.results = eligibleBikes.map((bike) => ({ bike, score: rankBike(bike) })).sort((a,b) => b.score - a.score || a.bike.price - b.bike.price).slice(0, 6);
    byId('quiz').hidden = true; byId('results').hidden = false;
    const resultHTML = state.results.map(({bike:b,score},i) => `<div class="result-item"><span class="result-rank">${String(i+1).padStart(2,'0')}</span><div><div class="tiny">${escapeHTML(b.brand.toUpperCase())} / ${escapeHTML(categories[b.kind])}</div><h4>${escapeHTML(b.model)}</h4><p>${escapeHTML(reasonFor(b))}</p><div class="result-links"><button data-action="save" data-id="${b.id}">${state.saved.has(b.id)?'REMOVE SAVED':'SAVE BIKE +'}</button>${shopLink(b)}</div></div><span class="match-score">${score}% MATCH</span></div>`).join('');
    byId('results').innerHTML = `<div class="result-heading"><div><span class="kicker">YOUR RIDER PROFILE</span><h3>YOUR TOP MATCHES.</h3><p>Ranked from your answers. A match score is a guideline, not a safety or fit certification.</p></div></div><div class="result-action"><button data-action="export-results">DOWNLOAD RESULTS ↓</button><button data-step="restart">RETAKE QUIZ ↻</button></div>${resultHTML}<p class="quiz-note">Check seat height, total weight, real pricing, age requirements and local riding rules with the seller. Street legality is not guaranteed.</p>`;
    if (scrollToResults) byId('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function shopLink(b) {
    if (b.sellers.length) {
      const seller = retailers[b.sellers[0]];
      return `<a href="${escapeHTML(seller.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(seller.label)} ↗</a>`;
    }
    if (b.homepage) return `<a href="${escapeHTML(b.homepage)}" target="_blank" rel="noopener noreferrer">MANUFACTURER ↗</a>`;
    const search = `https://www.google.com/search?q=${encodeURIComponent(b.brand + ' ' + b.model + ' official dealer')}`;
    return `<a href="${escapeHTML(search)}" target="_blank" rel="noopener noreferrer">FIND SELLERS ↗</a>`;
  }
  function bikeCard(b) {
    const saved = state.saved.has(b.id); const comparing = state.compare.has(b.id);
    return `<article class="bike-card"><div class="card-top"><span class="card-type">${escapeHTML(categories[b.kind])} / ${escapeHTML(sizes[b.size].toUpperCase())}</span><button class="save-btn ${saved?'saved':''}" type="button" data-action="save" data-id="${b.id}" aria-label="${saved?'Remove':'Save'} ${escapeHTML(b.brand)} ${escapeHTML(b.model)}" aria-pressed="${saved}">${saved?'✓':'+'}</button></div><div class="bike-card-body"><span class="bike-card-brand">${escapeHTML(b.brand)}</span><h3>${escapeHTML(b.model)}</h3><p>${escapeHTML(b.description)}</p><div class="card-specs"><div><strong>${money(b.price)}</strong><small>REF. PRICE</small></div><div><strong>${b.peakKW} kW</strong><small>EST. PEAK</small></div><div><strong>${escapeHTML(sizes[b.size])}</strong><small>CHASSIS</small></div></div></div><div class="card-footer"><button type="button" class="secondary" data-action="compare" data-id="${b.id}">${comparing?'✓ SELECTED':'COMPARE +'}</button>${b.sellers.length || b.homepage ? `<a href="${escapeHTML(b.sellers.length?retailers[b.sellers[0]].url:b.homepage)}" target="_blank" rel="noopener noreferrer">${b.sellers.length?'SHOP OPTIONS ↗':'OFFICIAL SITE ↗'}</a>` : `<a href="https://www.google.com/search?q=${encodeURIComponent(b.brand+' '+b.model+' dealer')}" target="_blank" rel="noopener noreferrer">FIND DEALER ↗</a>`}</div></article>`;
  }
  function renderCatalog() {
    const search = byId('catalogSearch').value.trim().toLowerCase();
    const brand = byId('brandFilter').value, type = byId('typeFilter').value, max = Number(byId('priceFilter').value), sort = byId('sortFilter').value;
    const matches = bikes.filter((b) => (brand==='all'||b.brand===brand) && (type==='all'||b.kind===type) && b.price<=max && `${b.brand} ${b.model} ${b.description}`.toLowerCase().includes(search));
    matches.sort((a,b) => sort==='low'?a.price-b.price:sort==='high'?b.price-a.price:sort==='power'?b.peakKW-a.peakKW:sort==='name'?(a.brand+a.model).localeCompare(b.brand+b.model):bikes.indexOf(a)-bikes.indexOf(b));
    byId('catalogStatus').textContent = `${matches.length} OF ${bikes.length} BIKES`;
    byId('catalogGrid').innerHTML = matches.length ? matches.map(bikeCard).join('') : `<div class="empty"><h3>NO BIKES FOUND.</h3><p>Try a different brand, budget or search term.</p></div>`;
  }
  function renderSaved() {
    const chosen = bikes.filter((b) => state.saved.has(b.id));
    byId('savedCount').textContent = chosen.length;
    if (!chosen.length) {
      byId('savedPanel').innerHTML = `<div class="empty"><h3>NOTHING SAVED YET.</h3><p>Tap the + on any bike to build your shortlist. Your choices stay saved in this browser.</p><a class="button button-outline" href="#catalog">BROWSE BIKES ↗</a></div>`;
      return;
    }
    byId('savedPanel').innerHTML = `<div class="saved-toolbar"><strong>${chosen.length} SAVED ${chosen.length===1?'BIKE':'BIKES'}</strong><div class="actions"><button data-action="compare-open">COMPARE SELECTED (${state.compare.size})</button><button class="secondary" data-action="export-saved">DOWNLOAD CSV ↓</button><button class="secondary" data-action="clear-saved">CLEAR ALL</button></div></div><div class="saved-list">${chosen.map(bikeCard).join('')}</div><div class="dealer-lookup"><label>YOUR CITY OR ZIP CODE<input id="dealerPlace" type="text" placeholder="e.g. Newton, NJ" autocomplete="address-level2"></label><button data-action="dealer">FIND NEARBY DEALERS ↗</button><p>Opens Google Maps to search for dealers near your entered location. It does not check inventory or confirm availability.</p></div>`;
  }
  function toggleSave(id) {
    if (state.saved.has(id)) { state.saved.delete(id); toast('Removed from saved bikes'); }
    else { state.saved.add(id); toast('Added to your shortlist'); }
    storeSaved(); renderSaved(); renderCatalog();
    if (!byId('results').hidden) renderResultsWithoutReRank();
  }
  function renderResultsWithoutReRank() {
    if (Object.keys(state.answers).length === questions.length) renderResults(false);
  }
  function toggleCompare(id) {
    if (state.compare.has(id)) state.compare.delete(id);
    else if (state.compare.size >= 3) { toast('Compare up to 3 bikes at once'); return; }
    else state.compare.add(id);
    renderCatalog(); renderSaved(); toast(`${state.compare.size} bike${state.compare.size===1?'':'s'} selected for comparison`);
  }
  function compareOpen() {
    const selected = bikes.filter((b) => state.compare.has(b.id));
    if (selected.length < 2) { toast('Select at least 2 bikes with COMPARE +'); return; }
    const row = (label, value) => `<tr><th scope="row">${label}</th>${selected.map((b) => `<td>${escapeHTML(value(b))}</td>`).join('')}</tr>`;
    byId('compareContent').innerHTML = `<div class="compare-scroll"><table class="compare-table"><thead><tr><th>SPECIFICATION</th>${selected.map((b) => `<th>${escapeHTML(b.brand)}<br>${escapeHTML(b.model)}</th>`).join('')}</tr></thead><tbody>${row('Reference price',b=>money(b.price))}${row('Estimated peak power',b=>b.peakKW+' kW')}${row('Size',b=>sizes[b.size])}${row('Category',b=>categories[b.kind])}${row('Intended skill',b=>['','Entry','Intermediate','Advanced'][b.level])}${row('Road category',b=>b.roadStatus==='pedal'?'Pedal e-bike':b.roadStatus==='motorcycle'?'Motorcycle — registration required':'Off-road; not presumed street-legal')}${row('Terrain',b=>b.terrains.join(', '))}</tbody></table><p class="data-note">Reference numbers are approximate; verify model-specific specifications with a dealer.</p></div>`;
    byId('compareDialog').showModal();
  }
  function download(filename, content, mime) {
    const blob = new Blob([content], { type: mime }); const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1200);
  }
  function csv(rows) {
    const header = ['Brand','Model','Reference Price USD','Estimated Peak kW','Size','Type','Retailer/Brand URL'];
    const quote = (x) => '"' + String(x).replace(/"/g,'""') + '"';
    return [header, ...rows.map((b) => [b.brand,b.model,b.price,b.peakKW,sizes[b.size],categories[b.kind],b.sellers.length?retailers[b.sellers[0]].url:b.homepage])].map((row) => row.map(quote).join(',')).join('\r\n')+'\r\n';
  }
  function dealers() {
    const city = byId('dealerPlace')?.value.trim();
    if (!city) { toast('Enter a city or ZIP code first'); byId('dealerPlace')?.focus(); return; }
    const first = bikes.find((b) => state.saved.has(b.id));
    const keywords = first ? `${first.brand} ${first.model} electric bike dealer near ${city}` : `electric dirt bike dealer near ${city}`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(keywords)}`,'_blank','noopener,noreferrer');
  }
  function init() {
    byId('bikeCount').textContent = `${bikes.length}`;
    const brands = [...new Set(bikes.map((b) => b.brand))].sort((a,b) => a.localeCompare(b));
    byId('brandFilter').insertAdjacentHTML('beforeend',brands.map((brand)=>`<option value="${escapeHTML(brand)}">${escapeHTML(brand)}</option>`).join(''));
    ['catalogSearch','brandFilter','typeFilter','priceFilter','sortFilter'].forEach((id)=>byId(id).addEventListener(id==='catalogSearch'?'input':'change',renderCatalog));
    byId('resetFilters').addEventListener('click',()=>{byId('catalogSearch').value='';byId('brandFilter').value='all';byId('typeFilter').value='all';byId('priceFilter').value='99999';byId('sortFilter').value='featured';renderCatalog();});
    byId('closeCompare').addEventListener('click',()=>byId('compareDialog').close());
    byId('compareDialog').addEventListener('click',(e)=>{if(e.target===byId('compareDialog'))byId('compareDialog').close();});
    byId('menuToggle').addEventListener('click',()=>{const nav=$('.nav');const isOpen=nav.classList.toggle('open');byId('menuToggle').setAttribute('aria-expanded',String(isOpen));});
    $('.nav').addEventListener('click',(e)=>{if(e.target.closest('a')){$('.nav').classList.remove('open');byId('menuToggle').setAttribute('aria-expanded','false');}});
    document.body.addEventListener('click',(event)=>{
      const chosen = event.target.closest('[data-choice]'); if(chosen){selectAnswer(chosen.dataset.choice);return;}
      const stepButton=event.target.closest('[data-step]');if(stepButton){step(stepButton.dataset.step);return;}
      const action=event.target.closest('[data-action]');if(!action)return;
      const id=action.dataset.id;
      switch(action.dataset.action){
        case 'save': toggleSave(id);break;
        case 'compare': toggleCompare(id);break;
        case 'compare-open': compareOpen();break;
        case 'export-saved': download('ridefinder-shortlist.csv',csv(bikes.filter(b=>state.saved.has(b.id))),'text/csv;charset=utf-8');toast('Shortlist downloaded');break;
        case 'export-results': download('ridefinder-matches.csv',csv(state.results.map(({bike})=>bike)),'text/csv;charset=utf-8');toast('Matches downloaded');break;
        case 'clear-saved': if(window.confirm('Clear your saved bikes?')){state.saved.clear();storeSaved();renderSaved();renderCatalog();toast('Shortlist cleared');}break;
        case 'dealer': dealers();break;
      }
    });
    renderQuiz();renderCatalog();renderSaved();
  }
  document.addEventListener('DOMContentLoaded',init);
})();
