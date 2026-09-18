const KEY="missionExcelV1";
const phases=[
 "Spreadsheet Explorer","Meet the Spreadsheet","Enter & Edit Data","SUM","AVERAGE",
 "MIN & MAX","Basic Calculations","Formula Challenge","Spreadsheet Mission","Reflection","Certificate"
];
const state=Object.assign({
 name:"",phase:0,score:0,earned:{},data:{},reflection:"",completed:false
},JSON.parse(localStorage.getItem(KEY)||"{}"));

const app=document.getElementById("app");
const scoreEl=document.getElementById("score"), phaseLabel=document.getElementById("phaseLabel"), progress=document.getElementById("progress");
function save(){localStorage.setItem(KEY,JSON.stringify(state));updateTop()}
function updateTop(){
 scoreEl.textContent=state.score; phaseLabel.textContent=state.phase?`${state.phase}. ${phases[state.phase-1]}`:"Welcome";
 progress.style.width=state.phase?`${Math.min(100,(state.phase/10)*100)}%`:"0%";
}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function award(key,pts){
 if(!state.earned[key]){state.earned[key]=pts;state.score=Math.min(100,state.score+pts);save();toast(`⭐ +${pts} points!`)}
}
function go(n){state.phase=n;save();render()}
function next(){go(state.phase+1)}
function grade(s){return s>=90?["A","Spreadsheet Expert"]:s>=80?["B","Great Spreadsheet Skills"]:s>=70?["C","Good Progress"]:s>=60?["D","Keep Practicing"]:["Needs More Practice","You're Learning!"]}

function shell(title,sub,body){
 return `<section>
   <div class="lesson-head"><div><div class="eyebrow">Phase ${state.phase} of 10</div><h2>${title}</h2><p class="lead" style="margin:0">${sub}</p></div></div>
   ${body}
 </section>`;
}

function render(){
 updateTop();
 if(state.phase===0) return renderWelcome();
 if(state.phase===1) return renderBasics();
 if(state.phase===2) return renderGrid();
 if(state.phase===3) return renderEdit();
 if(state.phase===4) return renderFormula("SUM");
 if(state.phase===5) return renderFormula("AVERAGE");
 if(state.phase===6) return renderMinMax();
 if(state.phase===7) return renderArithmetic();
 if(state.phase===8) return renderChallenge();
 if(state.phase===9) return renderMission();
 if(state.phase===10) return renderReflection();
 if(state.phase>=11) return renderCertificate();
}

function renderWelcome(){
 app.innerHTML=`<div class="hero"><div class="hero-inner">
 <div class="eyebrow">Interactive spreadsheet course</div><h1>Spreadsheet Skills:<br>Mission Excel</h1>
 <p class="lead">Learn how spreadsheets work, practice real formulas, complete missions, and earn your certificate.</p>
 <div class="card narrow">
 <label class="field"><span>What's your name?</span><input id="name" type="text" maxlength="40" placeholder="Enter your first name"></label>
 <button class="btn" id="start">🚀 Start Lesson</button>
 <p class="small">Your progress is saved only in this browser. No account is required.</p>
 </div>
 <button class="btn ghost no-print" id="teacher">Teacher View</button>
 </div></div>`;
 document.getElementById("name").value=state.name||"";
 document.getElementById("start").onclick=()=>{const n=document.getElementById("name").value.trim();if(!n)return toast("Please enter your name first.");state.name=n;go(1)};
 document.getElementById("teacher").onclick=teacherView;
}
function renderBasics(){
 app.innerHTML=shell("What is a spreadsheet?","A spreadsheet helps us organize information and perform calculations.",`
 <div class="card"><h3>Think of a spreadsheet as a smart table.</h3>
 <p>You can use one to keep track of test scores, plan a class party, track money, record sports scores, make shopping lists, organize supplies, and compare information.</p>
 <div class="chips"><span class="chip">Rows & columns</span><span class="chip">Data</span><span class="chip">Formulas</span><span class="chip">Calculations</span></div>
 <div class="task">Which would be a good use for a spreadsheet?</div>
 <div class="choice-grid" id="choices">
 ${["Drawing a picture","Keeping track of everyone's test scores","Playing a video game","Writing a story"].map((x,i)=>`<button class="choice" data-i="${i}">${x}</button>`).join("")}
 </div><div id="fb"></div></div>`);
 document.querySelectorAll(".choice").forEach(b=>b.onclick=()=>{
   const ok=b.dataset.i==="1";document.querySelectorAll(".choice").forEach(x=>x.classList.remove("wrong","correct"));
   b.classList.add(ok?"correct":"wrong");document.getElementById("fb").innerHTML=`<div class="feedback ${ok?"good":"bad"}">${ok?"✅ Correct! Spreadsheets are great for organizing and calculating scores.":"❌ Not quite. Think about which choice involves organizing information."}</div>`;
   if(ok) {award("p1",10);setTimeout(next,650)}
 });
}

const cols=["A","B","C","D","E","F"];
function cellRef(c,r){return cols[c]+r}
function makeGrid(rows=8,editable=false,values={}){
 let h="<div class='grid-wrap'><table class='sheet'><thead><tr><th class='rowhead'></th>"+cols.slice(0,5).map(c=>`<th>${c}</th>`).join("")+"</tr></thead><tbody>";
 for(let r=1;r<=rows;r++){h+=`<tr><th>${r}</th>`;for(let c=0;c<5;c++){let ref=cellRef(c,r);h+=`<td data-ref="${ref}" ${editable?"contenteditable=true":""}>${esc(values[ref]??"")}</td>`}h+="</tr>"}return h+"</tbody></table></div>";
}
function renderGrid(){
 app.innerHTML=shell("Meet the Spreadsheet","Cells are identified by a column letter and row number.",`
 <div class="card"><p>For example, <span class="ref">A1</span> means <strong>column A, row 1</strong>. Click a cell to see its reference.</p>
 ${makeGrid(8)}<p id="selected" class="task">Click a cell.</p><div id="rangeTask" class="task">Challenge: select the range <strong>B2:B6</strong>.</div><button class="btn" id="continue" disabled>Continue</button></div>`);
 let clicked=false, rangeDone=false, first=null;
 document.querySelectorAll(".sheet td").forEach(td=>td.onclick=()=>{
   document.querySelectorAll(".sheet td").forEach(x=>x.classList.remove("selected","range"));td.classList.add("selected");
   document.getElementById("selected").innerHTML=`You selected <strong>${td.dataset.ref}</strong>.`;
   clicked=true;if(clicked&&rangeDone)document.getElementById("continue").disabled=false;
 });
 document.querySelectorAll(".sheet td").forEach(td=>td.addEventListener("mousedown",e=>{first=td.dataset.ref}));
 document.querySelectorAll(".sheet td").forEach(td=>td.addEventListener("mouseup",e=>{
   if(first==="B2"&&td.dataset.ref==="B6"){
    for(let r=2;r<=6;r++)document.querySelector(`[data-ref=B${r}]`).classList.add("range");
    rangeDone=true;document.getElementById("rangeTask").innerHTML="✅ Range B2:B6 selected!";
    award("p2",10);if(clicked)document.getElementById("continue").disabled=false;
   }
 }));
 document.getElementById("continue").onclick=next;
}
function renderEdit(){
 const vals={A1:"Student",B1:"English",C1:"Math",D1:"Science",A2:"Alex",B2:82,C2:91,D2:76,A3:"Mia",B3:95,C3:88,D3:92,A4:"Ben",B4:74,C4:81,D4:79,A5:"Sam",B5:89,C5:94,D5:87};
 app.innerHTML=shell("Enter & Edit Data","Type directly into spreadsheet cells. Real spreadsheets let you change information whenever you need to.",`
 <div class="card">${makeGrid(5,true,vals)}<div class="task">Tasks: change <strong>C2</strong> to 95 and <strong>D4</strong> to 85.</div><button class="btn" id="check">Check Changes</button><div id="fb"></div></div>`);
 document.getElementById("check").onclick=()=>{
  const c2=document.querySelector('[data-ref=C2]').innerText.trim(),d4=document.querySelector('[data-ref=D4]').innerText.trim();
  const ok=c2==="95"&&d4==="85";document.getElementById("fb").innerHTML=`<div class="feedback ${ok?"good":"bad"}">${ok?"✅ Excellent! You edited both values correctly.":"❌ Not quite. Check C2 and D4 carefully."}</div>`;
  if(ok){award("p3",10);setTimeout(next,700)}
 };
}
function normalize(s){return s.replace(/\s+/g,"").toUpperCase()}
function formulaExpected(kind){
 return kind==="SUM"?["=SUM(B2:B5)","=B2+B3+B4+B5"]:["=AVERAGE(B2:B5)"];
}
function renderFormula(kind){
 const vals={A1:"Student",B1:"Score",A2:"Alex",B2:80,A3:"Mia",B3:90,A4:"Ben",B4:75,A5:"Sam",B5:85};
 const prompt=kind==="SUM"?"Enter a formula that calculates the total score.":"Enter a formula that calculates the average score.";
 app.innerHTML=shell(kind,kind==="SUM"?"SUM adds numbers together.":"AVERAGE finds the mean of a group of numbers.",`
 <div class="card">${makeGrid(5,false,vals)}
 <div class="chips"><span class="chip">=</span><span class="chip">${kind}</span><span class="chip">B2:B5</span></div>
 <p>The formula should use the cells containing the four scores.</p><div class="task">${prompt}</div>
 <div class="formula-box"><input id="formula" placeholder="e.g. =${kind}(B2:B5)"><button class="btn" id="check">Check Formula</button></div>
 <button class="btn ghost" id="hint">Show Hint</button><div id="fb"></div></div>`);
 document.getElementById("hint").onclick=()=>document.getElementById("fb").innerHTML=`<div class="feedback">💡 Hint: ${kind} works with the range <span class="ref">B2:B5</span>.</div>`;
 document.getElementById("check").onclick=()=>{
   const v=normalize(document.getElementById("formula").value), valid=formulaExpected(kind).some(x=>normalize(x)===v);
   document.getElementById("fb").innerHTML=`<div class="feedback ${valid?"good":"bad"}">${valid?"✅ Correct! Your formula calculates the "+(kind==="SUM"?"total.":"average."):"❌ Not quite. Check the cells included in your range."}</div>`;
   if(valid){award(kind==="SUM"?"p4":"p5",15);setTimeout(next,700)}
 };
}
function renderMinMax(){
 app.innerHTML=shell("MIN & MAX","Use MIN for the smallest value and MAX for the largest value.",`
 <div class="card">${makeGrid(7,false,{A1:"Scores",B1:72,B2:91,B3:64,B4:88,B5:79,B6:95})}
 <div class="task">Enter <strong>two formulas</strong>: one for the lowest score and one for the highest score.</div>
 <div class="formula-box"><input id="min" placeholder="=MIN(B1:B6)"><input id="max" placeholder="=MAX(B1:B6)"><button class="btn" id="check">Check</button></div>
 <button class="btn ghost" id="hint">Show Hint</button><div id="fb"></div></div>`);
 document.getElementById("hint").onclick=()=>document.getElementById("fb").innerHTML=`<div class="feedback">💡 Hint: MIN = smallest. MAX = largest. Both can use the range <span class="ref">B1:B6</span>.</div>`;
 document.getElementById("check").onclick=()=>{
  const a=normalize(document.getElementById("min").value),b=normalize(document.getElementById("max").value);
  const ok=a==="=MIN(B1:B6)"&&b==="=MAX(B1:B6)";
  document.getElementById("fb").innerHTML=`<div class="feedback ${ok?"good":"bad"}">${ok?"✅ Great! You found both extremes.":"❌ Check your formula names and range."}</div>`;
  if(ok){award("p6",10);setTimeout(next,700)}
 };
}
function renderArithmetic(){
 app.innerHTML=shell("Other Basic Calculations","Spreadsheets can also use ordinary arithmetic with cell references.",`
 <div class="card"><div class="chips"><span class="chip">+ addition</span><span class="chip">− subtraction</span><span class="chip">* multiplication</span><span class="chip">/ division</span></div>
 ${makeGrid(3,false,{A1:"(A) Item",B1:"(B) Price",C1:"(C) Quantity",A2:"Pencil",B2:10,C2:3})}
 <div class="task">Write a formula to calculate the total cost of the pencils.</div>
 <div class="formula-box"><input id="formula" placeholder="=B2*C2"><button class="btn" id="check">Check Formula</button></div><div id="fb"></div></div>`);
 document.getElementById("check").onclick=()=>{
  const ok=normalize(document.getElementById("formula").value)==="=B2*C2";
  document.getElementById("fb").innerHTML=`<div class="feedback ${ok?"good":"bad"}">${ok?"✅ Correct! 10 × 3 = 30.":"❌ Think about which cells contain price and quantity. Multiplication uses *."}</div>`;
  if(ok){award("p7",10);setTimeout(next,700)}
 };
}
function renderChallenge(){
 const missions=[
  {title:"Find the total",instruction:"Calculate the total amount of all of the items, not the total amount spent. Use SUM.",answer:"=SUM(D2:D6)",hint:"The item totals are in column D. SUM adds a group of numbers."},
  {title:"Find the average",instruction:"Calculate the average cost of one item. Use AVERAGE.",answer:"=AVERAGE(D2:D6)",hint:"Use the range containing the five item totals: D2:D6."},
  {title:"Find the cheapest item",instruction:"Find the lowest item total. Use MIN.",answer:"=MIN(D2:D6)",hint:"MIN finds the smallest number. Look at the totals in column D."},
  {title:"Find the most expensive item",instruction:"Find the highest item total. Use MAX.",answer:"=MAX(D2:D6)",hint:"MAX finds the largest number. Look at the totals in column D."},
  {title:"Calculate the bananas",instruction:"How much did the bananas cost altogether? Write a formula using the banana price and quantity.",answer:"=B3*C3",equivalents:["=C3*B3"],hint:"For bananas, multiply Quantity × Price. The quantity is in B3 and the price is in C3."},
  {title:"Change the apple price",instruction:"Change the price of the apples from 30 to 35. Then type CHANGE below.",answer:"CHANGE",hint:"Find the Apple price in column C. Change 30 to 35, then type CHANGE."}
 ];
 const vals={A1:"(A) Item",B1:"(B) Quantity",C1:"(C) Price",D1:"(D) Total",A2:"Apples",B2:4,C2:30,A3:"Bananas",B3:6,C3:12,A4:"Oranges",B4:3,C4:25,A5:"Milk",B5:2,C5:45,A6:"Bread",B6:3,C6:20};
 app.innerHTML=shell("Formula Challenge","Use the receipt below for every challenge. All the information you need is in the table.",`
 <div class="card">
   <div class="receipt-head"><div><div class="small">SHOPPING RECEIPT</div><h3 style="margin:4px 0 0">Mission Market</h3></div><div class="small">Challenge <span id="mi">1</span> of ${missions.length}</div></div>
   <div class="task" id="task"></div>
   <div class="grid-wrap"><table class="sheet mission-table challenge-sheet"><thead><tr><th></th><th>Item</th><th>Quantity</th><th>Price</th><th>Total</th></tr></thead><tbody>
   ${[2,3,4,5,6].map(r=>`<tr><th>${r}</th><td>${vals["A"+r]}</td><td>${vals["B"+r]}</td><td contenteditable="true" data-ref="C${r}">${vals["C"+r]}</td><td data-ref="D${r}" class="calculated-total">—</td></tr>`).join("")}
   </tbody></table></div>
   <p class="small">The Total column shows what each purchase costs altogether. Try changing a price in the receipt and see how the information changes.</p>
   <div class="formula-box"><input id="answer" placeholder="Type your formula here"><button class="btn" id="check">Check</button></div>
   <button class="btn ghost" id="hint">Show Hint</button><div id="fb"></div>
 </div>`);
 let i=0;
 function calculateTotals(){[2,3,4,5,6].forEach(r=>{const qty=Number(vals["B"+r]);const price=Number(document.querySelector(`[data-ref="C${r}"]`).innerText.trim());const total=document.querySelector(`[data-ref="D${r}"]`);total.textContent=Number.isFinite(qty)&&Number.isFinite(price)?qty*price:"—";});}
 function load(){const m=missions[i];document.getElementById("mi").textContent=i+1;document.getElementById("task").innerHTML=`<strong>${m.title}</strong><br>${m.instruction}`;document.getElementById("answer").value="";document.getElementById("answer").placeholder=i===5?"Type CHANGE after editing the price":"e.g. "+m.answer;document.getElementById("fb").innerHTML="";calculateTotals();}
 load();
 document.querySelectorAll('.challenge-sheet td[contenteditable="true"]').forEach(td=>td.addEventListener("input",calculateTotals));
 document.getElementById("hint").onclick=()=>{const m=missions[i];document.getElementById("fb").innerHTML=`<div class="feedback">💡 Hint: ${m.hint}</div>`;};
 document.getElementById("check").onclick=()=>{const m=missions[i],v=normalize(document.getElementById("answer").value);let ok=false;if(i<5)ok=v===normalize(m.answer)||(m.equivalents||[]).some(x=>v===normalize(x));else{const applePrice=document.querySelector('[data-ref="C2"]').innerText.trim();ok=v==="CHANGE"&&applePrice==="35";}if(!ok){document.getElementById("fb").innerHTML='<div class="feedback bad">❌ Not quite. Try the hint and check the receipt carefully.</div>';return;}document.getElementById("fb").innerHTML='<div class="feedback good">✅ Mission complete!</div>';i++;if(i===missions.length){award("p8",10);setTimeout(next,700);}else setTimeout(load,500);};
}
function renderMission(){
 const vals={A1:"(A) Item",B1:"(B) Price",C1:"(C) Quantity",D1:"(D) Total",A2:"Juice",B2:25,C2:4,A3:"Snacks",B3:40,C3:3,A4:"Fruit",B4:30,C4:5,A5:"Cups",B5:20,C5:2};
 const rowTotal=r=>Number(vals["B"+r])*Number(vals["C"+r]);
 const totals=[2,3,4,5].map(rowTotal);
 const overall=totals.reduce((a,b)=>a+b,0), average=overall/totals.length, cheapest=Math.min(...totals), mostExpensive=Math.max(...totals);
 app.innerHTML=shell("Spreadsheet Mission","Class Party Planner: combine the skills you've learned to solve a realistic problem.",`
 <div class="card"><div class="task">Your mission: calculate each item's total, then use SUM, AVERAGE, MIN and MAX to analyze the party costs.</div>
 <div class="mission-instructions"><strong>How to complete this mission:</strong> In the <b>Total</b> cells, type the formula shown under the table. When your formula is correct, the cell will change to the calculated result. For the four analysis boxes, type the formula and use its <b>Check</b> button to see your result.</div>
 <div class="grid-wrap"><table class="sheet mission-table"><thead><tr><th></th><th>Item</th><th>Price</th><th>Quantity</th><th>Total</th></tr></thead><tbody>
 ${[2,3,4,5].map(r=>`<tr><th>${r}</th><td>${vals["A"+r]}</td><td>${vals["B"+r]}</td><td contenteditable="true" data-ref="C${r}">${vals["C"+r]}</td><td contenteditable="true" data-ref="D${r}" data-expected="=B${r}*C${r}"></td></tr>`).join("")}</tbody></table></div>
 <div class="mission-formula-guide"><div><b>D2</b> → <code>=B2*C2</code></div><div><b>D3</b> → <code>=B3*C3</code></div><div><b>D4</b> → <code>=B4*C4</code></div><div><b>D5</b> → <code>=B5*C5</code></div></div>
 <div class="formula-check-grid">
   <div class="formula-check"><label for="total"><b>Overall Total</b><span>Add all item totals.</span></label><div class="formula-row"><input id="total" placeholder="Type: =SUM(D2:D5)"><button class="btn small-btn" id="checkSum">Check SUM</button></div><div class="result-badge" id="totalResult"></div></div>
   <div class="formula-check"><label for="avg"><b>Average</b><span>Find the average item cost.</span></label><div class="formula-row"><input id="avg" placeholder="Type: =AVERAGE(D2:D5)"><button class="btn small-btn" id="checkAvg">Check Average</button></div><div class="result-badge" id="avgResult"></div></div>
   <div class="formula-check"><label for="min"><b>Cheapest</b><span>Find the smallest total.</span></label><div class="formula-row"><input id="min" placeholder="Type: =MIN(D2:D5)"><button class="btn small-btn" id="checkMin">Check MIN</button></div><div class="result-badge" id="minResult"></div></div>
   <div class="formula-check"><label for="max"><b>Most Expensive</b><span>Find the largest total.</span></label><div class="formula-row"><input id="max" placeholder="Type: =MAX(D2:D5)"><button class="btn small-btn" id="checkMax">Check MAX</button></div><div class="result-badge" id="maxResult"></div></div>
 </div>
 <label class="field"><span><b>Budget: 300</b> — Did the class stay within the budget?</span><input id="budget" placeholder="Type Yes or No"></label>
 <button class="btn" id="check">Complete Mission</button><div id="fb"></div></div>`);

 const clean=s=>normalize(String(s||""));
 const evaluateFormula=(formula)=>{
   const f=clean(formula);
   const values={D2:rowTotal(2),D3:rowTotal(3),D4:rowTotal(4),D5:rowTotal(5)};
   if(f==="=SUM(D2:D5)") return overall;
   if(f==="=AVERAGE(D2:D5)") return average;
   if(f==="=MIN(D2:D5)") return cheapest;
   if(f==="=MAX(D2:D5)") return mostExpensive;
   const m=f.match(/^=(B[2-5])\*(C[2-5])$/);
   if(m && m[1][1]===m[2][1]) return values["D"+m[1][1]];
   const m2=f.match(/^=(C[2-5])\*(B[2-5])$/);
   if(m2 && m2[1][1]===m2[2][1]) return values["D"+m2[1][1]];
   return null;
 };
 const setFeedback=(id,good,message)=>{document.getElementById(id).innerHTML=`<div class="feedback ${good?"good":"bad"}">${good?"✓ ":"✗ "}${message}</div>`};

 [2,3,4,5].forEach(r=>{
   const cell=document.querySelector(`[data-ref=D${r}]`);
   cell.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();cell.blur()}});
   cell.addEventListener("blur",()=>{
     const formula=cell.innerText.trim();
     const result=evaluateFormula(formula);
     if(result!==null){cell.dataset.formula=formula;cell.dataset.result=result;cell.innerText=String(result);cell.classList.add("calculated")}
     else if(formula){cell.classList.remove("calculated");delete cell.dataset.formula;delete cell.dataset.result}
   });
   cell.addEventListener("click",()=>{if(cell.dataset.formula && cell.classList.contains("calculated")){cell.innerText=cell.dataset.formula;cell.classList.remove("calculated");cell.focus()}});
 });

 const analysisChecks=[
   ["checkSum","total","totalResult","=SUM(D2:D5)",overall,"SUM"],
   ["checkAvg","avg","avgResult","=AVERAGE(D2:D5)",average,"AVERAGE"],
   ["checkMin","min","minResult","=MIN(D2:D5)",cheapest,"MIN"],
   ["checkMax","max","maxResult","=MAX(D2:D5)",mostExpensive,"MAX"]
 ];
 analysisChecks.forEach(([buttonId,inputId,resultId,expected,result,display])=>{
   document.getElementById(buttonId).onclick=()=>{
     const input=document.getElementById(inputId);
     const value=clean(input.value);
     if(value===clean(expected)){
       document.getElementById(resultId).innerHTML=`<span class="calculated-result">Result: <strong>${result}</strong></span>`;
       input.classList.add("correct");
       setFeedback("fb",true,`${display} formula is correct.`);
     }else{
       document.getElementById(resultId).innerHTML=`<span class="hint-result">Check the formula shown in the placeholder.</span>`;
       input.classList.remove("correct");
       setFeedback("fb",false,`Your ${display} formula needs another look. Use the Check button again when you have fixed it.`);
     }
   };
 });

 document.getElementById("check").onclick=()=>{
   const formulas=[2,3,4,5].every(r=>document.querySelector(`[data-ref=D${r}]`).dataset.formula && clean(document.querySelector(`[data-ref=D${r}]`).dataset.formula)===clean(`=B${r}*C${r}`));
   const analyses=analysisChecks.every(([,inputId,,expected])=>clean(document.getElementById(inputId).value)===clean(expected));
   const budget=clean(document.getElementById("budget").value)==="NO";
   const correct=formulas&&analyses&&budget;
   if(correct){document.getElementById("fb").innerHTML='<div class="feedback good">🏆 Mission complete! The total is 410, so the class is over the 300 budget.</div>';award("p9",10);setTimeout(next,700)}
   else{
     const missing=[];
     if(!formulas)missing.push("the item totals");
     if(!analyses)missing.push("one or more analysis formulas");
     if(!budget)missing.push("the budget answer");
     document.getElementById("fb").innerHTML=`<div class="feedback bad">❌ Not quite. Check ${missing.join(", ")}. Use the individual Check buttons to find exactly which part needs fixing.</div>`;
   }
 };
}

function renderReflection(){
 app.innerHTML=shell("Think About It","Show what you can take away from this lesson.",`
 <div class="card"><h3>💭 What could you use Excel or spreadsheets for in the future?</h3>
 <p class="small">Write about 2–4 sentences. You can think about school, home, a hobby, organizing information, keeping track of money, or planning something.</p>
 <textarea id="reflection" rows="8" maxlength="1200" placeholder="I could use a spreadsheet to..."></textarea>
 <button class="btn" id="finish">Finish Reflection</button><div id="fb"></div></div>`);
 document.getElementById("reflection").value=state.reflection||"";
 document.getElementById("finish").onclick=()=>{const v=document.getElementById("reflection").value.trim();if(v.length<25)return document.getElementById("fb").innerHTML='<div class="feedback bad">Please write a little more so your reflection has a meaningful response.</div>';state.reflection=v;award("reflection",10);go(11)};
}
function renderCertificate(){
 const [g,label]=grade(state.score);
 app.innerHTML=`<div class="center"><div class="eyebrow">Lesson complete</div><h2>🎉 Great work, ${esc(state.name)}!</h2>
 <div class="card"><div class="results-score">${state.score} / 100</div><div class="grade">${g} — ${label}</div>
 <table class="breakdown"><tbody>${[
 ["Spreadsheet Basics","p1",10],["Cells & References","p2",10],["Entering Data","p3",10],["SUM","p4",15],["AVERAGE","p5",15],["MIN & MAX","p6",10],["Calculations","p7",10],["Formula Challenge","p8",10],["Final Mission","p9",10],["Reflection","reflection",10]
 ].map(x=>`<tr><td>${x[0]}</td><td>${state.earned[x[1]]||0}/${x[2]}</td></tr>`).join("")}</tbody></table></div>
 <div class="certificate" id="certificate"><div class="eyebrow">Certificate of Achievement</div><h2>Excel Guru</h2><p>This certificate is proudly presented to</p><div class="student">${esc(state.name)}</div><p>for successfully completing</p><h3>the level 1 excel Spreadsheet Skill challenge</h3>
 <p>The student demonstrated skills in:</p><div class="cert-list"><span>✓ Cells & References</span><span>✓ Data Entry</span><span>✓ SUM</span><span>✓ AVERAGE</span><span>✓ MIN & MAX</span><span>✓ Calculations</span><span>✓ Problem Solving</span></div>
 <h3>Score: ${state.score} / 100 &nbsp; • &nbsp; Grade: ${g}</h3><p>Date: ${new Date().toLocaleDateString()}</p><p style="margin-top:45px">Teacher: ______________________________</p></div>
 <div class="actions center no-print"><button class="btn" onclick="window.print()">🖨 Print Certificate</button><button class="btn secondary" id="download">⬇ Save Certificate</button><button class="btn ghost" id="restart">Start Again</button></div></div>`;
 document.getElementById("download").onclick=downloadCertificate;
 document.getElementById("restart").onclick=()=>{localStorage.removeItem(KEY);location.reload()};
}
function downloadCertificate(){
 const cert=document.getElementById("certificate").outerHTML;
 const html=`<!doctype html><html><head><meta charset="utf-8"><title>Certificate - ${esc(state.name)}</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#172033}.certificate{text-align:center;border:8px double #27334d;padding:55px}.student{font-size:36px;font-weight:900;margin:25px}.cert-list span{display:inline-block;background:#eee;padding:7px;margin:4px}</style></head><body>${cert}</body></html>`;
 const blob=new Blob([html],{type:"text/html"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`Mission-Excel-${state.name}.html`;a.click();URL.revokeObjectURL(url);
}
function teacherView(){
 app.innerHTML=`<div class="card narrow teacher-panel"><div class="eyebrow">Teacher View</div><h2>Local Results</h2>
 <p>Because this is a static site, results stay in this browser unless a student exports them.</p>
 <table class="breakdown"><tr><th>Student</th><td>${esc(state.name||"Not started")}</td></tr><tr><th>Score</th><td>${state.score}/100</td></tr><tr><th>Grade</th><td>${state.name?grade(state.score).join(" — "):"—"}</td></tr><tr><th>Status</th><td>${state.phase>=11?"Complete":"In progress"}</td></tr></table>
 <h3>Reflection</h3><p>${esc(state.reflection||"No reflection yet.")}</p>
 <div class="actions"><button class="btn ghost" onclick="render()">Back</button><button class="btn" id="copy">Copy Results Summary</button></div></div>`;
 document.getElementById("copy").onclick=async()=>{const txt=`Mission Excel Results\nStudent: ${state.name}\nScore: ${state.score}/100\nGrade: ${state.name?grade(state.score).join(" — "):"—"}\nStatus: ${state.phase>=11?"Complete":"In progress"}\nReflection: ${state.reflection}`;await navigator.clipboard.writeText(txt);toast("Results copied!")};
}
render();
