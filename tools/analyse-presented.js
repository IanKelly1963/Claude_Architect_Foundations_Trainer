/* Measures the bank AS PRESENTED to a student: options are permuted at
   quiz-build time, so stored order is irrelevant to what they actually see. */
const BANK = require("./bank.js");
function shuffle(a){const r=a.slice();for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=r[i];r[i]=r[j];r[j]=t;}return r;}
function present(q){
  const perm=shuffle(q.options), map={};
  const options=perm.map((o,i)=>{const nk=String.fromCharCode(65+i);map[o.k]=nk;return {k:nk,text:o.text};});
  return {id:q.id,type:q.type,options,correct:q.correct.map(k=>map[k]).sort()};
}
function chi2(o,e){return o.reduce((s,x)=>s+Math.pow(x-e,2)/e,0);}
const single=BANK.filter(q=>q.type!=="multi"), multi=BANK.filter(q=>q.type==="multi");
const TRIALS=300;
const keyCount={A:0,B:0,C:0,D:0}; let keyN=0;
let longestHit=0, longestN=0, multiHit=0, multiN=0;
const rank={1:0,2:0,3:0,4:0};
for(let t=0;t<TRIALS;t++){
  single.forEach(q=>{
    const p=present(q); keyCount[p.correct[0]]++; keyN++;
    const lens=p.options.map(o=>o.text.length), max=Math.max(...lens);
    const cl=p.options.find(o=>o.k===p.correct[0]).text.length;
    if(cl===max) longestHit++; longestN++;
    rank[1+p.options.filter(o=>o.text.length>cl).length]++;
  });
  multi.forEach(q=>{
    const p=present(q);
    const pick=p.options.slice().sort((a,b)=>b.text.length-a.text.length).slice(0,p.correct.length).map(o=>o.k).sort().join("");
    if(pick===p.correct.join("")) multiHit++; multiN++;
  });
}
const pc=n=>(n*100).toFixed(1)+"%";
console.log("="

.repeat(70));
console.log("AS PRESENTED TO THE STUDENT  ("+TRIALS+" simulated presentations of all "+BANK.length+" items)");
console.log("=".repeat(70));
console.log("\n1. ANSWER POSITION");
["A","B","C","D"].forEach(k=>console.log("   "+k+": "+pc(keyCount[k]/keyN)));
const x2k=chi2(["A","B","C","D"].map(k=>keyCount[k]),keyN/4);
console.log("   chi-square = "+x2k.toFixed(2)+" (df=3, 7.81=p.05) -> "+(x2k<7.81?"UNIFORM - no position tell":"SKEWED"));
console.log("\n2. LENGTH");
console.log("   correct answer is longest: "+pc(longestHit/longestN)+"   (25.0% = chance)");
console.log("   rank histogram: "+[1,2,3,4].map(r=>r+":"+pc(rank[r]/longestN)).join("  "));
// chi-square scales with the number of simulated presentations, so test on the
// per-item distribution (n = one presentation of each item) and report effect size.
const perItem=[1,2,3,4].map(r=>rank[r]/TRIALS);
const x2l=chi2(perItem,single.length/4);
const maxDev=Math.max(...[1,2,3,4].map(r=>Math.abs(rank[r]/longestN-0.25)));
console.log("   chi-square on per-item distribution = "+x2l.toFixed(2)+" (df=3, 7.81=p.05) -> "+(x2l<7.81?"NO LENGTH TELL":"length tell present"));
console.log("   largest deviation from 25%: "+(maxDev*100).toFixed(1)+" points");
console.log("\n3. NAIVE STRATEGIES (random guessing = 25.0% single / 16.7% multi)");
console.log("   always answer A:            "+pc(keyCount.A/keyN));
console.log("   always pick longest option: "+pc(longestHit/longestN));
console.log("   pick longest-N on multi:    "+pc(multiHit/multiN));
console.log("");
