const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const katexCss = fs.readFileSync(path.join(__dirname,'node_modules/katex/dist/katex.min.css'),'utf8').replace(/url\(fonts\//g,'url(file://'+path.join(__dirname,'node_modules/katex/dist/fonts/')+'/'.replace('//','/'));
const katexJs = fs.readFileSync(path.join(__dirname,'node_modules/katex/dist/katex.min.js'),'utf8');
const AR = fs.readFileSync(path.join(__dirname,'node_modules/katex/dist/contrib/auto-render.min.js'),'utf8');
const [,, dataFile, outDir, lang] = process.argv;
const data = JSON.parse(fs.readFileSync(dataFile,'utf8'));
const figs = {}; for (const f of fs.readdirSync(path.join(__dirname,'figs'))) if (f.endsWith('.png')||f.endsWith('.svg')) figs[f.replace(/\.(png|svg)$/,'')] = 'file://'+path.join(__dirname,'figs',f);
fs.mkdirSync(outDir,{recursive:true});
const esc = s => s;
function fig(name, cls='') { return `<img class="fig ${cls}" src="${figs[name.replace('@',lang)]}">`; }
const PIELEG={ru:["Читают книги","Помогают по дому","Играют в игры","Встречаются с друзьями"],kk:["Кітап оқиды","Үйде көмектеседі","Ойын ойнайды","Достарымен кездеседі"]};
const TBL={ru:["Высота кустарника (см)","Длина тени (см)"],kk:["Бұтаның биіктігі (см)","Көлеңкенің ұзындығы (см)"]};
function pieHtml(){const cols=['#111','#666','#b4b4b4','#fff'];return '<div class="figbox" style="display:flex;justify-content:center;gap:14px;align-items:center"><img class="fig" style="width:220px" src="'+figs['pie']+'"><div style="text-align:left;font-size:13px">'+PIELEG[lang].map((t,i)=>'<div style="margin:5px 0"><span style="display:inline-block;width:14px;height:14px;border:1px solid #000;background:'+cols[i]+';vertical-align:middle;margin-right:6px"></span>'+t+'</div>').join('')+'</div></div>';}
function tableHtml(){const r=[[20,16],[40,32],[60,48],[80,64]];return '<table class="t"><tr><th>'+TBL[lang][0]+'</th><th>'+TBL[lang][1]+'</th></tr>'+r.map(x=>'<tr><td>'+x[0]+'</td><td>'+x[1]+'</td></tr>').join('')+'</table>';}
const QL={ru:{h:"Количественные характеристики: сравните значения в колонках A и B. Выберите ответ:",l:["A — значение в колонке A больше","B — значение в колонке B больше","C — значения равны между собой","D — недостаточно информации"]},kk:{h:"Сандық сипаттамалар: A және B бағандарындағы мәндерді салыстырыңыз. Жауапты таңдаңыз:",l:["A — A бағанындағы мән үлкен","B — B бағанындағы мән үлкен","C — мәндер өзара тең","D — ақпарат жеткіліксіз"]}};
function renderQuant(q){
  const E=t=>String(t).replace(/</g,'&lt;'); const Q=q.quant; const L=QL[lang];
  const cell=(c)=>E(c[lang]||'')+(c.fig?'<div>'+fig(c.fig)+'</div>':'');
  const common=Q.common?`<tr><td></td><td colspan="2" class="cm">${Q.common.raw?Q.common[lang]:E(Q.common[lang]||'')}${Q.common.fig?'<div>'+fig(Q.common.fig)+'</div>':''}</td></tr>`:'';
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${katexCss}
  body{margin:0;background:#fff;font-family:"DejaVu Serif","Liberation Serif",serif;font-size:17px;line-height:1.35;color:#000}
  .q{width:540px}
  .hd{background:#eef1fb;padding:6px 10px;font-family:"DejaVu Sans",sans-serif;font-size:13px;line-height:1.5}
  .hd div.l{display:flex;flex-wrap:wrap}.hd span{width:50%;box-sizing:border-box;padding-right:8px}
  table.qq{border-collapse:collapse;width:100%;margin-top:6px;table-layout:fixed}
  table.qq td{border:1px solid #000;padding:12px 10px;text-align:center;vertical-align:middle}
  table.qq table.t td{padding:2px 6px}
  table.qq td.n{width:40px;text-align:left;vertical-align:top;font-size:17px}
  table.qq td.cm{padding:8px 10px}
  table.qq th{border:1px solid #000;padding:4px;font-weight:normal}
  table.t{border-collapse:collapse;margin:4px auto;font-size:14px}table.qq table.t td,table.t th{border:1px solid #666;padding:2px 7px;text-align:center}table.t th{background:#f3f3f3;font-weight:normal}
  .fig{max-width:100%;max-height:150px;vertical-align:middle}
  </style><script>${katexJs}</script><script>${AR}</script></head><body><div class="q" id="q">
  <div class="hd">${L.h}<div class="l">${L.l.map(x=>'<span>'+x+'</span>').join('')}</div></div>
  <table class="qq"><tr><th style="width:40px"></th><th>A</th><th>B</th></tr>${common}<tr><td class="n">${q.n}.</td><td>${cell(Q.A)}</td><td>${cell(Q.B)}</td></tr></table></div>
  <script>renderMathInElement(document.body,{delimiters:[{left:'\\\\(',right:'\\\\)',display:false},{left:'\\\\[',right:'\\\\]',display:true}]});</script></body></html>`;
}
function render(q) {
  if (q.quant) return renderQuant(q);
  const L0 = q[lang]; const E=t=>String(t).replace(/</g,'&lt;'); const L={q:E(L0.q),opts:(L0.opts||[]).map(E),extra:L0.extra};
  const f = q.fig ? q.fig.map(n=>fig(n)).join('') : '';
  const fl = q.figFloat ? `<div class="float">${fig(q.figFloat)}</div>` : '';
  let opts = (L.opts||[]).map((o,i)=>`<div class="opt">${'ABCDE'[i]}) ${o}</div>`).join('');
  if (q.rawopts) opts = q.rawopts[lang].map((o,i)=>`<div class="row"><span>${'ABCDE'[i]}) ${o[0]}</span><img class="fig" style="height:${o[1]=='f3_2'||o[1]=='f3_3'?34:70}px" src="${figs[o[1]]}"></div>`).join('');
  const extra = L.extra||'';
  const mid = q.figMid ? `<div class="figbox">${q.figMid.map(n=>fig(n)).join('')}</div>` : '';
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${katexCss}
  body{margin:0;background:#fff;font-family:"DejaVu Serif","Liberation Serif",serif;font-size:17px;line-height:1.35;color:#000}
  .q{width:540px;padding:8px 10px 8px 10px;}
  .qt{text-align:left}
  .num{font-weight:bold}
  .opt{margin:3px 0 0 6px}
  .figbox{margin:8px 0;text-align:center}
  .fig{max-width:100%;vertical-align:middle;margin:2px 6px}
  .figbox .fig{max-height:250px}.float{float:right;margin:0 0 6px 12px}.float .fig{width:150px}
  .row{display:flex;gap:14px;align-items:center;margin:2px 0 2px 6px}
  table.t{border-collapse:collapse;margin:8px auto}table.t td,table.t th{border:1px solid #666;padding:4px 14px;text-align:center}
  </style><script>${katexJs}</script><script>${AR}</script></head><body><div class="q" id="q">
  ${q.figTop=='TABLE'?'':(q.figTop?`<div class="figbox">${fig(q.figTop)}</div>`:'')}
  ${fl}<div class="qt"><span class="num">${q.n}.</span> ${L.q}</div>
  ${q.legend?pieHtml():''}${q.tail?`<div class="qt">${q.tail[lang]}</div>`:''}${q.figTop=='TABLE'?tableHtml():''}${mid}${extra}${opts}</div>
  <script>renderMathInElement(document.body,{delimiters:[{left:'\\\\(',right:'\\\\)',display:false},{left:'\\\\[',right:'\\\\]',display:true}]});</script></body></html>`;
  return html;
}
(async()=>{
  const b = await chromium.launch(); const p = await b.newPage({deviceScaleFactor:2, viewport:{width:560,height:400}}); p.on('pageerror',e=>console.log('ERR',e.message)); p.on('console',m=>{if(m.type()=='error')console.log('CON',m.text())});
  for (const q of data) {
    const hf=path.join(__dirname,'tmp_'+lang+'.html'); fs.writeFileSync(hf,render(q)); await p.goto('file://'+hf,{waitUntil:'load'}); await p.waitForTimeout(150);
    const el = await p.$('#q'); const out = path.join(outDir,`q${String(q.n).padStart(2,'0')}.png`);
    await el.screenshot({path:out});
  }
  await b.close();
})();
