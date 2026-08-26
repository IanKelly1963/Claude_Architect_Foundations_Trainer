
{ ts:"5.1", title:"Managing conversation context over long interactions",
  core:"Summarisation is lossy in exactly the places that matter: numbers, dates and what the customer actually asked for. Keep those in a separate structured layer that is never summarised.",
  facts:[
    "Progressive summarisation condenses numerical values, percentages, dates and customer-stated expectations into vague prose. Those are the facts a resolution depends on.",
    "The fix is a persistent 'case facts' block, carrying amounts, dates, order numbers and statuses, included in every prompt and held outside the summarised history.",
    "For multi-issue sessions, persist structured issue data (order IDs, amounts, statuses) into that separate context layer.",
    "The 'lost in the middle' effect: models process the beginning and end of a long input reliably, but may omit findings from the middle. Put key-findings summaries at the start of aggregated inputs and use explicit section headers.",
    "Tool results accumulate and consume tokens out of all proportion to their relevance, for example 40+ fields returned per order lookup when 5 matter. Trim verbose outputs to relevant fields before they enter context.",
    "The API is stateless, so complete conversation history must be passed in each request to maintain coherence.",
    "Require subagents to include metadata (dates, source locations, methodological context) in structured output so downstream synthesis is accurate.",
    "When a downstream agent has a limited context budget, have upstream agents return structured data (key facts, citations, relevance scores) rather than verbose content and reasoning chains."
  ],
  traps:[
    "Summarising more aggressively when detail is being lost. That accelerates the problem.",
    "Assuming a long-context model reads the middle as reliably as the ends."
  ],
  refs:[R_CTX] },

{ ts:"5.2", title:"Escalation and ambiguity resolution",
  core:"Escalate on explicit request, on policy gaps, and on genuine inability to progress. Do not escalate on sentiment, and do not trust the model's own confidence score.",
  facts:[
    "The legitimate triggers are: the customer asks for a human, the policy has an exception or a gap, or the agent cannot make meaningful progress.",
    "When a customer explicitly demands a human, honour it immediately rather than investigating first.",
    "When the issue is straightforward and within capability, acknowledge frustration and offer resolution; escalate only if the customer reiterates the preference for a human.",
    "Escalate when policy is silent or ambiguous on the specific request, for example competitor price matching when the policy addresses only your own site's adjustments. A gap is not the same as a hard case.",
    "When a lookup returns multiple matches, instruct the agent to ask for an additional identifier rather than picking by heuristic.",
    "Explicit escalation criteria plus few-shot examples showing escalate-versus-resolve is the proportionate first fix for poor calibration."
  ],
  traps:[
    "Self-reported confidence thresholds. An agent that mishandles hard cases is precisely the agent that is confidently wrong about them.",
    "Sentiment-triggered escalation. Frustration does not correlate with complexity, which is the actual variable.",
    "Training a separate classifier before trying prompt fixes. That is ML infrastructure for a prompt problem."
  ],
  refs:[R_PROMPT] },

{ ts:"5.3", title:"Error propagation across multi-agent systems",
  core:"An error crossing an agent boundary should carry enough context for the coordinator to make a decision: what failed, what was attempted, what partial results exist, and what else might work.",
  facts:[
    "Return structured error context: failure type, the query attempted, any partial results, and potential alternative approaches.",
    "Distinguish access failures (a timeout needing a retry decision) from valid empty results (a successful query with no matches). Conflating them destroys the coordinator's ability to respond correctly.",
    "Generic statuses such as 'search unavailable' hide the context the coordinator needs.",
    "Subagents should handle transient failures locally and propagate only what they cannot resolve, along with what was attempted and any partial results.",
    "Annotate synthesis output with coverage: which findings are well supported, and which topic areas have gaps because sources were unavailable."
  ],
  traps:[
    "Silently returning an empty result set marked successful. It prevents recovery and quietly ships incomplete research.",
    "Terminating the whole workflow on one subagent failure, when partial results plus an annotated gap would have been useful.",
    "Retrying inside the subagent and then reporting only a generic failure. The retries were fine; discarding the context was not."
  ],
  refs:[R_SUB] },

{ ts:"5.4", title:"Context in large codebase exploration",
  core:"Long sessions degrade in a recognisable way: the agent starts describing typical patterns instead of the specific classes it found earlier. Persist findings outside the context window.",
  facts:[
    "Context degradation shows up as inconsistent answers and references to 'typical patterns' rather than the specific classes discovered earlier in the session.",
    "Scratchpad files persist key findings across context boundaries; have the agent write to one and consult it for later questions.",
    "Delegate verbose investigation to subagents ('find all test files', 'trace refund flow dependencies') while the main agent keeps high-level coordination.",
    "Summarise the key findings of one exploration phase before spawning subagents for the next, and inject that summary into their initial context.",
    "For crash recovery, have each agent export structured state to a known location and have the coordinator load a manifest on resume, injecting it into agent prompts.",
    "`/compact` reduces context usage during extended sessions filled with verbose discovery output."
  ],
  traps:[
    "Pushing through a degrading session because the information was discovered 'already'. If it has fallen out of context, it is gone.",
    "Reading everything into the main agent instead of delegating the verbose parts."
  ],
  refs:[R_CTX, R_SUB] },

{ ts:"5.5", title:"Human review workflows and confidence calibration",
  core:"A high aggregate accuracy number can hide a document type that fails badly. Segment before you automate.",
  facts:[
    "Aggregate metrics such as 97% overall can mask poor performance on a specific document type or a specific field.",
    "Analyse accuracy by document type and by field, confirming consistency across all segments, before reducing human review.",
    "Use stratified random sampling of high-confidence extractions to keep measuring the error rate and to detect novel error patterns after automation.",
    "Have the model output field-level confidence scores, then calibrate the review thresholds against a labelled validation set rather than trusting raw scores.",
    "Route low-confidence extractions, and those from ambiguous or self-contradictory documents, to human review so limited reviewer capacity goes where it pays."
  ],
  traps:[
    "Automating everything above a confidence threshold that was never calibrated.",
    "Sampling only what failed. You learn nothing about the errors hiding in the high-confidence bucket."
  ],
  refs:[R_STRUCT] },

{ ts:"5.6", title:"Provenance and uncertainty in multi-source synthesis",
  core:"Attribution is lost at summarisation steps unless claim-to-source mappings are made explicit and required to survive each hop.",
  facts:[
    "Require subagents to emit structured claim-source mappings: source URL or document name, the relevant excerpt, and the claim it supports. Downstream agents must preserve and merge these rather than compressing them away.",
    "When credible sources disagree, annotate the conflict with attribution for each value. Do not silently pick one.",
    "Complete the document analysis with both conflicting values included and explicitly flagged, and let the coordinator decide how to reconcile before synthesis.",
    "Require publication or data-collection dates in structured output, so a temporal difference is not misread as a contradiction.",
    "Structure reports to separate well-established findings from contested ones, preserving each source's original characterisation and methodological context.",
    "Render content types appropriately in synthesis: financial data as tables, news as prose, technical findings as structured lists, rather than flattening everything into one format."
  ],
  traps:[
    "Averaging two conflicting statistics, or choosing the more recent one, without telling the reader there was a conflict.",
    "Letting the synthesis step compress findings into prose that no longer says where anything came from."
  ],
  refs:[R_SUB] }

];
