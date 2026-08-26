
/* ==========================================================================
   5c. Option shuffling
   --------------------------------------------------------------------------
   Every item in this bank was authored with the correct answer written first,
   which left it at position A in all 187 items. Presenting the stored order
   would let a student score 100% by always answering A.
   So options are permuted whenever a question is drawn into a quiz: the
   option list, the `correct` keys and the per-letter distractor rationales
   are all relabelled together, and the item keeps its id so scoring is
   unaffected. A student meeting the same question twice sees a different
   arrangement, so answer positions cannot be memorised either.
   ========================================================================== */

function shuffleOptions(q){
  const perm = shuffle(q.options);
  const map = {};
  const options = perm.map(function(o, i){
    const nk = String.fromCharCode(65 + i);
    map[o.k] = nk;
    return { k: nk, text: o.text };
  });
  const correct = q.correct.map(function(k){ return map[k]; }).sort();
  const distractors = {};
  const src = (q.explain && q.explain.distractors) || {};
  Object.keys(src).forEach(function(k){
    if(map[k]) distractors[map[k]] = src[k];
  });
  return Object.assign({}, q, {
    options: options,
    correct: correct,
    explain: { why: q.explain.why, distractors: distractors }
  });
}
