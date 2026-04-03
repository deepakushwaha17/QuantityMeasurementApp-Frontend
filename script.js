/* ── CONFIG ──────────────────────────────────────── */
const API = 'http://localhost:8080';


// Exact enum values from your QuantityDTO
const UNITS = {
  LengthUnit:      ['FEET','INCHES','YARDS','CENTIMETERS'],
  WeightUnit:      ['KILOGRAM','GRAM','POUND','MILIGRAM','TONNE'],
  TemperatureUnit: ['CELSIUS','FAHRENHEIT'],
  VolumeUnit:      ['LITRE','MILLILITRE','GALLON'],
};
const LABELS = {
  FEET:'Feet', INCHES:'Inches', YARDS:'Yards', CENTIMETERS:'Centimeters',
  KILOGRAM:'Kilogram', GRAM:'Gram', POUND:'Pound', MILIGRAM:'Milligram', TONNE:'Tonne',
  CELSIUS:'Celsius', FAHRENHEIT:'Fahrenheit',
  LITRE:'Litre', MILLILITRE:'Millilitre', GALLON:'Gallon',
};

/* ── STATE ───────────────────────────────────────── */
let token    = localStorage.getItem('qm_token') || null;
let email    = localStorage.getItem('qm_email') || '';
let curType  = 'LengthUnit';
let curAct   = 'compare';   // compare | convert | arithmetic
let curArith = 'add';
let hist     = JSON.parse(localStorage.getItem('qm_hist') || '[]');

/* ── INIT ────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  token ? showMain() : showAuth();
  fillDropdowns();
  renderHist();
  document.getElementById('lEmail').addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });
  document.getElementById('lPass').addEventListener('keydown',  e => { if(e.key==='Enter') doLogin(); });
  document.getElementById('sEmail').addEventListener('keydown', e => { if(e.key==='Enter') doSignup(); });
  document.getElementById('sPass').addEventListener('keydown',  e => { if(e.key==='Enter') doSignup(); });
});

/* ── AUTH TABS ───────────────────────────────────── */
function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t,i) =>
    t.classList.toggle('active', i===(tab==='login'?0:1)));
  document.getElementById('loginForm').style.display  = tab==='login'  ? '':'none';
  document.getElementById('signupForm').style.display = tab==='signup' ? '':'none';
}

/* ── LOGIN ───────────────────────────────────────── */
async function doLogin() {
  const e = document.getElementById('lEmail').value.trim();
  const p = document.getElementById('lPass').value;
  if(!e||!p) return showErr('lErr','Please fill all fields.');
  setBtnLoad('btnLogin',true,'Login');
  try {
    const res = await apiPost(`${API}/auth/login`, { email:e, password:p });
    token = res.token;
    email = e;
    localStorage.setItem('qm_token', token);
    localStorage.setItem('qm_email', email);
    showMain();
    toast('Logged in ✓','ok');
  } catch(err) {
    showErr('lErr', err.message || 'Login failed. Check credentials.');
  } finally {
    setBtnLoad('btnLogin',false,'Login');
  }
}

/* ── SIGNUP ──────────────────────────────────────── */
async function doSignup() {
  const e = document.getElementById('sEmail').value.trim();
  const p = document.getElementById('sPass').value;
  if(!e||!p) return showErr('sErr','Please fill all fields.');
  if(p.length<8) return showErr('sErr','Password must be at least 8 characters.');
  setBtnLoad('btnSignup',true,'Create Account');
  try {
    const res = await apiPost(`${API}/auth/signup`, { email:e, password:p });
    if(res.token) {
      token=res.token; email=e;
      localStorage.setItem('qm_token',token);
      localStorage.setItem('qm_email',email);
      showMain(); toast('Account created ✓','ok');
    } else {
      toast('Account created! Please log in.','ok');
      switchTab('login');
    }
  } catch(err) {
    showErr('sErr', err.message || 'Signup failed.');
  } finally {
    setBtnLoad('btnSignup',false,'Create Account');
  }
}

// Google AUTH
const params = new URLSearchParams(window.location.search);
const googleToken = params.get('token');
const googleEmail = params.get('email'); // if your backend passes it
if (googleToken) {
    token = googleToken;
    email = googleEmail || '';
    localStorage.setItem('qm_token', token);
    if (googleEmail) localStorage.setItem('qm_email', email);
    window.history.replaceState({}, '', window.location.pathname); // clean URL
    showMain();
    toast('Signed in with Google ✓', 'ok');
}

// New function:
function doGoogleAuth() {
    window.location.href = `${API}/oauth2/authorization/google`;
}

/* ── LOGOUT ──────────────────────────────────────── */
function doLogout() {
  token=null; email='';
  localStorage.removeItem('qm_token');
  localStorage.removeItem('qm_email');
  showAuth();
  document.getElementById('lEmail').value='';
  document.getElementById('lPass').value='';
}

/* ── PAGE SWITCH ─────────────────────────────────── */
function showAuth() {
  document.getElementById('authPage').classList.remove('hidden');
  document.getElementById('mainPage').classList.remove('show');
}
function showMain() {
  document.getElementById('authPage').classList.add('hidden');
  document.getElementById('mainPage').classList.add('show');
  document.getElementById('navEmail').textContent = email;
}

/* ── TYPE PICKER ─────────────────────────────────── */
function pickType(card, type) {
  document.querySelectorAll('.type-card').forEach(c=>c.classList.remove('active'));
  card.classList.add('active');
  curType = type;
  fillDropdowns();
  hideResult();
}

/* ── ACTION PICKER ───────────────────────────────── */
function pickAction(btn, act) {
  document.querySelectorAll('#mainTabs .action-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  curAct = act;
  document.getElementById('arithSub').style.display  = act==='arithmetic' ? '':'none';
  document.getElementById('targetRow').style.display = 'none';

  // For convert: Value 2 column becomes the target unit selector — no second value needed
  const val2Group = document.getElementById('val2').closest('.ft-group');
  if(act === 'convert') {
    document.getElementById('lbl2').textContent = 'Convert To (Target Unit)';
    document.getElementById('val2').style.display = 'none'; // hide val2 input — not needed for convert
  } else {
    document.getElementById('lbl2').textContent = 'Value 2';
    document.getElementById('val2').style.display = '';
  }

  if(act==='arithmetic') pickArith(document.querySelector('#arithTabs .action-tab'), 'add');
  hideResult();
}

/* ── ARITH PICKER ────────────────────────────────── */
function pickArith(btn, op) {
  document.querySelectorAll('#arithTabs .action-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  curArith = op;
  // Show target unit row ONLY for add-with-target-unit and subtract-with-target-unit
  document.getElementById('targetRow').style.display = op.includes('with-target') ? '':'none';
  hideResult();
}

/* ── DROPDOWNS ───────────────────────────────────── */
function fillDropdowns() {
  const units = UNITS[curType] || [];
  ['unit1','unit2','targetUnit'].forEach(id => {
    const sel = document.getElementById(id);
    sel.innerHTML = units.map(u=>`<option value="${u}">${LABELS[u]||u}</option>`).join('');
  });
  // Default unit2 and targetUnit to second option so they differ from unit1
  const u2 = document.getElementById('unit2');
  if(u2.options.length>1) u2.selectedIndex=1;
  const tu = document.getElementById('targetUnit');
  if(tu.options.length>1) tu.selectedIndex=1;
}

/* ── RUN OPERATION ───────────────────────────────── */
async function runOp() {
  const v1 = parseFloat(document.getElementById('val1').value);
  const u1 = document.getElementById('unit1').value;
  const u2 = document.getElementById('unit2').value;

  // For convert, val2 is hidden — we only need v1 and the target unit (u2)
  // For all others, we need both values
  const isConvert = curAct === 'convert';
  const v2 = isConvert ? 0.0 : parseFloat(document.getElementById('val2').value);

  if(isNaN(v1)){ 
    toast('Please enter Value 1.','err'); 
    return; 
  }
  if(!isConvert && isNaN(v2)){ 
    toast('Please enter Value 2.','err'); 
    return; 
  }

  const thisQ = { value:v1, unit:u1, measurementType:curType };
  // For convert, thatQuantityDTO carries the target unit (value is irrelevant to backend)
  const thatQ = { value:v2, unit:u2, measurementType:curType };

  let endpoint;
  if(curAct === 'compare') {
    endpoint = 'compare';
  } else if(curAct === 'convert') {
    endpoint = 'convert';
  } else if(curAct === 'arithmetic') {
    if(curArith === 'add-with-target') {
      endpoint = 'add-with-target-unit';
    } else if(curArith === 'subtract-with-target') {
      endpoint = 'subtract-with-target-unit';
    } else {
      endpoint = curArith;  // add | subtract | divide
    }
  }

  // Build body — thatQuantityDTO always carries unit for target-based operations
  const body = { 
    thisQuantityDTO: thisQ, 
    thatQuantityDTO: thatQ,
  };

  // For add-with-target-unit / subtract-with-target-unit:
  // send targetQuantityDTO with only the chosen unit (value:0 is ignored by backend)
  if(endpoint === 'add-with-target-unit' || endpoint === 'subtract-with-target-unit') {
    const tu = document.getElementById('targetUnit').value;
    body.targetQuantityDTO = { value: 0.0, unit: tu, measurementType: curType };
  }

  const btn = document.getElementById('btnRun');
  btn.disabled=true;
  btn.innerHTML='<span class="spin"></span>Running…';

  try {
    const url = `${API}/api/v1/quantities/${endpoint}`;
    console.log('🔗 Calling:', url);
    console.log('📦 Body:', JSON.stringify(body, null, 2));
    
    const res = await apiPostAuth(url, body);
    console.log('✅ Result:', res);
    
    displayResult(res, res.error);
    pushHist(endpoint, res, !!res.error);
    toast('Operation complete ✓','ok');
  } catch(err) {
    console.error('❌ Error:', err);
    displayResult({ errorMessage:err.message, error:true }, true);
    pushHist(endpoint, { errorMessage:err.message }, true);
    toast('Failed: ' + err.message,'err');
  } finally {
    btn.disabled=false;
    btn.textContent='Run Operation';
  }
}

/* ── RESULT ──────────────────────────────────────── */
function displayResult(data, isErr) {
  const box = document.getElementById('resultBox');
  box.className = 'result-box show ' + (isErr||data.error ? 'err':'ok');
  
  let displayValue = '';
  let displayUnit = '';
  
  if(isErr || data.error) {
    displayValue = data.errorMessage || 'Unknown error';
  } else {
    if(data.resultValue === true || data.resultValue === false) {
      displayValue = data.resultValue ? '✅ EQUAL' : '❌ NOT EQUAL';
    } 
    else if(data.resultString) {
      displayValue = data.resultString === 'Equal' ? '✅ EQUAL' : '❌ NOT EQUAL';
    }
    else if(typeof data.resultValue === 'number') {
      displayValue = data.resultValue;
    }
    else {
      displayValue = data.resultValue !== undefined ? data.resultValue : data.value;
    }
    
    displayUnit = data.resultUnit ? data.resultUnit : data.unit;
  }
  
  document.getElementById('resVal').textContent = displayValue;
  document.getElementById('resUnit').textContent = displayUnit ? `Unit: ${displayUnit}` : '';
}

function hideResult() { 
  document.getElementById('resultBox').className='result-box'; 
}

/* ── HISTORY ─────────────────────────────────────── */
function pushHist(op, data, isErr) {
  hist.unshift({
    op,
    isErr,
    type: curType,
    val: isErr ? data.errorMessage 
               : (data.resultString 
                   ? (data.resultString === 'Equal' ? '✅ EQUAL' : '❌ NOT EQUAL') 
                   : (data.resultValue ?? data.value ?? '?')),
    unit: data.resultUnit || data.unit || '',
    time: new Date().toLocaleTimeString(),
  });
  if(hist.length > 100) hist.pop();
  localStorage.setItem('qm_hist', JSON.stringify(hist));
  renderHist();
}

function renderHist(filter='all') {
  const list = document.getElementById('histList');
  let items = hist;
  if(filter==='error')   items=hist.filter(h=>h.isErr);
  else if(filter!=='all') items=hist.filter(h=>h.op.startsWith(filter));
  if(!items.length){
    list.innerHTML='<div class="hist-empty">No records here.</div>'; return;
  }
  list.innerHTML = items.map(h=>`
    <div class="h-item ${h.isErr?'err':''}">
      <div class="h-op">${h.op.toUpperCase()} · ${h.type.replace('Unit','')}</div>
      <div class="h-val">${h.isErr?'⚠ Error':h.val+(h.unit?' '+h.unit:'')}</div>
      <div class="h-time">${h.time}</div>
    </div>
  `).join('');
}

function filterHist(chip, f) {
  document.querySelectorAll('.hchip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  renderHist(f);
}

function clearHist() {
  hist=[]; localStorage.removeItem('qm_hist');
  renderHist(); toast('History cleared','ok');
}

/* ── AJAX ────────────────────────────────────────── */
async function apiPost(url, body) {
  const res = await fetch(url, {
    method:'POST', 
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(body),
  });
  const text = await res.text();
  let data; 
  try{ 
    data=JSON.parse(text); 
  }catch{ 
    data={message:text}; 
  }
  if(!res.ok) throw new Error(data.message||data.error||`HTTP ${res.status}`);
  return data;
}

async function apiPostAuth(url, body) {
  const res = await fetch(url, {
    method:'POST',
    headers:{ 
      'Content-Type':'application/json', 
      'Authorization':`Bearer ${token}` 
    },
    body:JSON.stringify(body),
  });
  const text = await res.text();
  let data; 
  try{ 
    data=JSON.parse(text); 
  }catch{ 
    data={message:text}; 
  }
  if(!res.ok) throw new Error(data.message||data.error||`HTTP ${res.status}`);
  return data;
}

/* ── UI HELPERS ──────────────────────────────────── */
function showErr(id, msg) {
  const el=document.getElementById(id);
  el.textContent=msg; el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),5000);
}
function setBtnLoad(id, loading, label) {
  const btn=document.getElementById(id);
  btn.disabled=loading;
  btn.innerHTML=loading?'<span class="spin"></span>Please wait…':label;
}
let toastT;
function toast(msg,type='ok'){
  const el=document.getElementById('toast');
  el.textContent=msg; el.className=`show ${type}`;
  clearTimeout(toastT);
  toastT=setTimeout(()=>el.className='',3000);
}
