
/* ---- Domain 5 expansion: task statements 5.4, 5.5 and 5.6 ---- */

{ id:"d5-5.4-g", domain:5, ts:"5.4", scenario:2, type:"single",
  stem:"An agent exploring a large service starts citing 'typical repository conventions' instead of the modules it identified an hour earlier. What is the remedy?",
  options:[
    {k:"A", text:"Keep a scratchpad file and consult it."},
    {k:"B", text:"Restart the session with the same approach."},
    {k:"C", text:"Re-read every one of the files examined so far."},
    {k:"D", text:"Switch to a model with a larger window."}
  ],
  correct:["A"],
  explain:{
    why:"A file survives the context window entirely, so findings can be read back whenever they are needed rather than depending on what remains in the conversation.",
    distractors:{
      B:"Restarting identically reproduces the same degradation a few hours later.",
      C:"Re-reading refills the window with the same volume that displaced the findings.",
      D:"A larger window postpones the problem without changing its shape."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.4-h", domain:5, ts:"5.4", scenario:2, type:"single",
  stem:"You need answers to 'where are the integration tests?' and 'what calls the billing API?' while keeping the main agent focused. What structure fits?",
  options:[
    {k:"A", text:"A subagent per question, returning only answers."},
    {k:"B", text:"Answer both questions in the main session, then compact it."},
    {k:"C", text:"Answer them in a separate session and paste results back."},
    {k:"D", text:"Defer both until the main work finishes."}
  ],
  correct:["A"],
  explain:{
    why:"Delegation isolates the verbose search output in the subagent's window and returns conclusions, which is exactly what keeps the main conversation coherent.",
    distractors:{
      B:"The output enters the main context before compaction can act, and compaction is lossy.",
      C:"This works but is manual, and pasting large results reintroduces much of the bulk.",
      D:"The billing dependency may well inform the main work, so deferring is not free."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.4-i", domain:5, ts:"5.4", scenario:2, type:"single",
  stem:"Moving from discovery into implementation with several subagents, what should be done at the boundary?",
  options:[
    {k:"A", text:"Summarise discovery and inject it into each subagent prompt."},
    {k:"B", text:"Pass the full discovery transcript to each subagent."},
    {k:"C", text:"Let each subagent rediscover what it needs."},
    {k:"D", text:"Keep discovery in the coordinator and have subagents query it."}
  ],
  correct:["A"],
  explain:{
    why:"Subagents inherit nothing, so a compact summary is what carries the discovery forward, and summarising first keeps that injection affordable across several of them.",
    distractors:{
      B:"A full transcript per subagent multiplies cost and reintroduces the verbosity the boundary was a chance to shed.",
      C:"Rediscovery repeats work and risks each subagent reaching a different conclusion.",
      D:"Subagents cannot query the coordinator mid-execution; the prompt is the only channel."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.4-j", domain:5, ts:"5.4", scenario:5, type:"single",
  stem:"A long multi-agent analysis must survive a crash without repeating completed work. What design supports that?",
  options:[
    {k:"A", text:"Structured state exports plus a manifest loaded on resume."},
    {k:"B", text:"A longer session timeout."},
    {k:"C", text:"Running all agents in one process."},
    {k:"D", text:"Relying on session resumption to restore agent state."}
  ],
  correct:["A"],
  explain:{
    why:"Durable state written to a known location, with a manifest the coordinator reads on resume, makes recovery a designed feature rather than an accident.",
    distractors:{
      D:"Session resumption restores a conversation, not the internal state of subagents that ran within it.",
      B:"A longer timeout reduces one cause of interruption without providing recovery.",
      C:"Consistent total failure is not recovery."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.4-k", domain:5, ts:"5.4", scenario:2, type:"single",
  stem:"Which command reduces context usage in an extended session?",
  options:[
    {k:"A", text:"`/compact`"},
    {k:"B", text:"`/clear`"},
    {k:"C", text:"`/reset`"},
    {k:"D", text:"`/trim`"}
  ],
  correct:["A"],
  explain:{
    why:"Compaction condenses accumulated content to reclaim room while keeping the session going, which is the documented remedy for a window filling with discovery output.",
    distractors:{
      B:"Clearing discards the conversation rather than condensing it.",
      C:"Not the documented command for reducing context in an ongoing session.",
      D:"Not a Claude Code command."
    }
  },
  refs:[R_MEM] },

{ id:"d5-5.4-l", domain:5, ts:"5.4", scenario:5, type:"single",
  stem:"What advantage does a scratchpad file have over relying on the conversation?",
  options:[
    {k:"A", text:"It survives compaction and session boundaries."},
    {k:"B", text:"It is read back faster than conversation context."},
    {k:"C", text:"It is injected into every subagent's context automatically."},
    {k:"D", text:"Its contents do not consume tokens when the agent reads it."}
  ],
  correct:["A"],
  explain:{
    why:"Being on disk makes it independent of the window entirely, which is what a multi-day investigation needs.",
    distractors:{
      B:"Reading a file costs a tool call and adds latency.",
      C:"Nothing is injected automatically; the agent must be told to read it.",
      D:"File contents consume input tokens once read, like any other context."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.4-m", domain:5, ts:"5.4", scenario:5, type:"multi",
  stem:"Which two practices counteract context degradation in long explorations? (Select 2.)",
  options:[
    {k:"A", text:"Persisting key findings to a file."},
    {k:"B", text:"Delegating verbose investigation to subagents."},
    {k:"C", text:"Increasing the context window."},
    {k:"D", text:"Asking the model to remember carefully."}
  ],
  correct:["A","B"],
  explain:{
    why:"One moves findings outside the window; the other keeps bulky intermediate work from entering it. Both attack the cause rather than the symptom.",
    distractors:{
      C:"A larger window fills with the same material and degrades later.",
      D:"Retention is not something the model controls by intention."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.4-n", domain:5, ts:"5.4", scenario:5, type:"single",
  stem:"An agent has read 60 files and answers are becoming vague. Which action best preserves progress?",
  options:[
    {k:"A", text:"Write current conclusions to disk before continuing."},
    {k:"B", text:"Continue and hope the relevant detail survives."},
    {k:"C", text:"Start a new session with no carried context."},
    {k:"D", text:"Re-read the 60 files to refresh them."}
  ],
  correct:["A"],
  explain:{
    why:"Capturing conclusions while they are still accurate means the next step, whether compaction or a fresh session, cannot lose them.",
    distractors:{
      C:"Starting fresh without capturing anything discards the analysis entirely.",
      B:"Continuing without capture is how the findings are lost.",
      D:"Re-reading consumes the remaining window with the same content."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.4-o", domain:5, ts:"5.4", scenario:2, type:"single",
  stem:"A research coordinator's context fills with subagent outputs before synthesis. What is the most effective change?",
  options:[
    {k:"A", text:"Have subagents return structured findings rather than narratives."},
    {k:"B", text:"Compact the coordinator's context between each of the delegations."},
    {k:"C", text:"Reduce the number of subagents."},
    {k:"D", text:"Increase the coordinator's window."}
  ],
  correct:["A"],
  explain:{
    why:"The volume is produced upstream, so constraining what subagents return is where the saving is largest and the information loss smallest.",
    distractors:{
      B:"Compaction after the fact is lossy and repeats every delegation.",
      C:"Fewer subagents means less coverage, which is a real cost to the research.",
      D:"A larger window accommodates the verbosity rather than removing it."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.4-p", domain:5, ts:"5.4", scenario:5, type:"single",
  stem:"Why delegate exploration to a subagent rather than exploring in the main session?",
  options:[
    {k:"A", text:"The verbose output stays out of the main window."},
    {k:"B", text:"Subagents search faster than the main agent does."},
    {k:"C", text:"Subagents have access to more tools."},
    {k:"D", text:"Subagent output is automatically summarised on return."}
  ],
  correct:["A"],
  explain:{
    why:"Isolation is the point: the subagent's window absorbs the search transcripts and only its conclusion crosses back, leaving the main conversation for coordination.",
    distractors:{
      D:"The subagent returns what it decides to return; nothing summarises automatically.",
      B:"Search speed is the same; the difference is where the output lands.",
      C:"Subagents typically hold fewer tools, by design."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.4-q", domain:5, ts:"5.4", scenario:2, type:"single",
  stem:"A developer runs `/compact` and later finds a specific decision has become vague. What trade-off did they accept?",
  options:[
    {k:"A", text:"Room reclaimed at the cost of specificity."},
    {k:"B", text:"Older turns deleted rather than condensed."},
    {k:"C", text:"Tool results kept and reasoning discarded."},
    {k:"D", text:"The session restarted with no history."}
  ],
  correct:["A"],
  explain:{
    why:"Compaction summarises, and specifics are the first casualty of summarisation. Anything that must survive should be written down outside the conversation.",
    distractors:{
      B:"Content is condensed rather than deleted outright, which is why some of it survives in general form.",
      C:"It does not preferentially keep one and drop the other.",
      D:"The session continues with a compacted history."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.4-r", domain:5, ts:"5.4", scenario:6, type:"single",
  stem:"A crash-recovery design has each agent write state to a shared directory. What must the coordinator do on resume?",
  options:[
    {k:"A", text:"Load the manifest and inject the relevant state into prompts."},
    {k:"B", text:"Re-run every agent to rebuild state."},
    {k:"C", text:"Resume the prior session to recover agent memory."},
    {k:"D", text:"Read every state file into its own context."}
  ],
  correct:["A"],
  explain:{
    why:"The manifest tells the coordinator what exists, and each agent needs its own state placed in its prompt, since none of it is inherited.",
    distractors:{
      D:"Loading everything into the coordinator wastes its window on state belonging to individual agents.",
      B:"Re-running discards exactly the completed work the exports preserve.",
      C:"Session resumption does not restore subagent state."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.4-s", domain:5, ts:"5.4", scenario:6, type:"single",
  stem:"An engineer proposes never delegating, so all context stays in one place. What is the cost?",
  options:[
    {k:"A", text:"Verbose intermediate work displaces the high-level thread."},
    {k:"B", text:"Investigation becomes slower to execute from end to end across the session."},
    {k:"C", text:"Findings cannot be persisted to disk."},
    {k:"D", text:"Tool access becomes more limited."}
  ],
  correct:["A"],
  explain:{
    why:"A single window has to hold both the coordination and every search transcript, and the transcripts crowd out the reasoning that was supposed to sit above them.",
    distractors:{
      B:"Single-session work can be faster in wall-clock terms; the cost is contextual.",
      C:"Persistence is available either way.",
      D:"Tool access is unaffected by whether work is delegated."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.4-t", domain:5, ts:"5.4", scenario:6, type:"single",
  stem:"What is the clearest early warning that a session's context has degraded?",
  options:[
    {k:"A", text:"Answers shift from specific findings to general patterns."},
    {k:"B", text:"Responses become shorter."},
    {k:"C", text:"Tool calls take longer to return."},
    {k:"D", text:"The model asks more clarifying questions."}
  ],
  correct:["A"],
  explain:{
    why:"Falling back on how things are usually done is what happens when the specifics discovered earlier are no longer available to reference.",
    distractors:{
      D:"More questions can indicate lost context but also simply an ambiguous request.",
      B:"Response length varies with the question being asked.",
      C:"Tool latency is an infrastructure property."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.5-g", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"Extraction reports 96% accuracy overall. Before automating, what should be checked?",
  options:[
    {k:"A", text:"Accuracy per document type and per field."},
    {k:"B", text:"That the sample exceeded 1,000 documents."},
    {k:"C", text:"That the confidence threshold sits above the corpus mean."},
    {k:"D", text:"That processing latency is acceptable at volume."}
  ],
  correct:["A"],
  explain:{
    why:"An aggregate can conceal a document type or field performing far worse. Segmenting is what reveals whether the number holds everywhere it will be applied.",
    distractors:{
      B:"Sample size firms up the aggregate without saying anything about variation between segments.",
      C:"A threshold set from the corpus mean is arbitrary and unrelated to calibration.",
      D:"Latency is operational and does not bear on correctness."
    }
  },
  refs:[R_STRUCT] },

{ id:"d5-5.5-h", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"After automating high-confidence extractions, how should the error rate in that population be measured?",
  options:[
    {k:"A", text:"Stratified random sampling reviewed on an ongoing basis."},
    {k:"B", text:"Reviewing only downstream rejections."},
    {k:"C", text:"Reviewing the lowest-confidence items in the band."},
    {k:"D", text:"Re-running with a second model and reviewing disagreements."}
  ],
  correct:["A"],
  explain:{
    why:"An unbiased sample of the automated population is the only way to know its true error rate and to notice error types no existing check looks for.",
    distractors:{
      D:"Model agreement is a useful signal, but two models share failure modes and agree confidently on the same mistakes.",
      B:"Downstream rejections catch only errors that break something, missing plausible wrong values.",
      C:"Sampling the bottom of the band overstates the rate and misses high-confidence errors."
    }
  },
  refs:[R_STRUCT] },

{ id:"d5-5.5-i", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"Field-level accuracy is 99% for invoice numbers, 98% for dates and 71% for line-item descriptions. What follows?",
  options:[
    {k:"A", text:"Automate the strong fields; route descriptions to review."},
    {k:"B", text:"Withhold automation until every field matches."},
    {k:"C", text:"Automate everything, since the aggregate is high."},
    {k:"D", text:"Remove descriptions from the schema."}
  ],
  correct:["A"],
  explain:{
    why:"Field-level measurement exists so routing can be field-level too. Mixed handling captures most of the value while keeping human attention on the 29% failure rate.",
    distractors:{
      B:"Blocking everything on the weakest field forfeits the gains available on the strong ones.",
      C:"This is exactly the trap segmentation revealed.",
      D:"Removing a needed field solves the metric rather than the requirement."
    }
  },
  refs:[R_STRUCT] },

{ id:"d5-5.5-j", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"What makes model-reported confidence usable for routing?",
  options:[
    {k:"A", text:"Calibrating thresholds against a labelled validation set."},
    {k:"B", text:"Instructing the model to be conservative."},
    {k:"C", text:"Averaging scores across three runs."},
    {k:"D", text:"Normalising scores to a uniform distribution."}
  ],
  correct:["A"],
  explain:{
    why:"Comparing scores against known-correct labels tells you what a given score means in error-rate terms, which is the only sound basis for a routing threshold.",
    distractors:{
      C:"Averaging reduces variance, but an average of uncalibrated scores is still uncalibrated.",
      B:"Asking for conservatism shifts the numbers without establishing what they mean.",
      D:"Forcing a uniform distribution destroys whatever real signal was present."
    }
  },
  refs:[R_STRUCT] },

{ id:"d5-5.5-k", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"Reviewer capacity covers 12% of daily volume. Where should it go?",
  options:[
    {k:"A", text:"Low-confidence extractions and self-contradictory documents."},
    {k:"B", text:"A uniform random sample covering twelve per cent of the daily volume."},
    {k:"C", text:"The 12% highest-value documents."},
    {k:"D", text:"The 12% longest documents."}
  ],
  correct:["A"],
  explain:{
    why:"Limited review should go where errors are most likely, and those two signals are the best available predictors of an extraction needing adjudication.",
    distractors:{
      B:"Uniform sampling is right for measuring the rate but spends most reviewer time on correct extractions.",
      C:"Value indicates the cost of an error rather than its likelihood, though it is reasonable as a secondary weighting.",
      D:"Length is a weak proxy for difficulty."
    }
  },
  refs:[R_STRUCT] },

{ id:"d5-5.5-l", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"Why sample high-confidence extractions rather than only reviewing flagged ones?",
  options:[
    {k:"A", text:"To find error types no existing check flags."},
    {k:"B", text:"To reduce total reviewer hours."},
    {k:"C", text:"To raise the measured accuracy figure."},
    {k:"D", text:"To replace confidence scoring."}
  ],
  correct:["A"],
  explain:{
    why:"Reviewing only what your checks caught can confirm what they already detect. Sampling the confident population is how you discover failure modes nobody thought to check for.",
    distractors:{
      B:"Sampling is additional work rather than a reduction.",
      C:"It usually reveals errors and lowers the measured figure, which is the point.",
      D:"The two are complementary; the sample is how scores get calibrated."
    }
  },
  refs:[R_STRUCT] },

{ id:"d5-5.5-m", domain:5, ts:"5.5", scenario:6, type:"multi",
  stem:"Which two signals best predict an extraction needing human review? (Select 2.)",
  options:[
    {k:"A", text:"Low calibrated confidence on a field."},
    {k:"B", text:"The source contradicting itself."},
    {k:"C", text:"The document exceeding average length."},
    {k:"D", text:"The document arriving outside business hours."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both are properties of the extraction or its source that genuinely correlate with error, and both describe something a reviewer can resolve by reading.",
    distractors:{
      C:"Length is weakly related to difficulty and would flag many clean documents.",
      D:"Arrival time carries no information about extraction quality."
    }
  },
  refs:[R_STRUCT] },

{ id:"d5-5.5-n", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"A team automates everything above 0.9 confidence without validating the scores. What is the risk?",
  options:[
    {k:"A", text:"0.9 may correspond to a much higher error rate than assumed."},
    {k:"B", text:"Confidence scores cannot be produced per field."},
    {k:"C", text:"The threshold will drift over time automatically."},
    {k:"D", text:"Scores above 0.9 are always correct."}
  ],
  correct:["A"],
  explain:{
    why:"An uncalibrated score is a number without a meaning. Until it is compared against labelled data, 0.9 might correspond to a 2% error rate or a 20% one.",
    distractors:{
      C:"Thresholds do not drift on their own, though the underlying distribution can shift as inputs change.",
      B:"Per-field scores are producible; the question is what they are worth.",
      D:"High confidence is compatible with being wrong, which is the whole concern."
    }
  },
  refs:[R_STRUCT] },

{ id:"d5-5.5-o", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"Accuracy is uniform across fields but one document type performs far worse. What does this argue for?",
  options:[
    {k:"A", text:"Routing that document type to review while automating the rest."},
    {k:"B", text:"Withholding automation entirely."},
    {k:"C", text:"Averaging across types and automating everything."},
    {k:"D", text:"Removing that document type from the pipeline."}
  ],
  correct:["A"],
  explain:{
    why:"Segmentation lets you automate where performance justifies it and hold back exactly the segment that does not, which captures most of the value safely.",
    distractors:{
      B:"Blocking everything forfeits the gains on types that perform well.",
      C:"Averaging is what concealed the problem.",
      D:"The documents still need processing; removing them moves the work rather than doing it."
    }
  },
  refs:[R_STRUCT] },

{ id:"d5-5.5-p", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"What does stratified sampling provide that simple random sampling does not?",
  options:[
    {k:"A", text:"Adequate coverage of each segment, including rare ones."},
    {k:"B", text:"A smaller required sample size overall."},
    {k:"C", text:"Elimination of sampling error."},
    {k:"D", text:"Automatic detection of novel error types."}
  ],
  correct:["A"],
  explain:{
    why:"Stratifying guarantees that each document type or confidence band is represented, so a segment that is 3% of volume still gets enough sample to say something about.",
    distractors:{
      B:"Sample size requirements are similar and can be larger when many strata must each be covered.",
      C:"Sampling error is reduced within strata, not eliminated.",
      D:"Detection comes from human review of the sample rather than from the sampling scheme."
    }
  },
  refs:[R_STRUCT] },

{ id:"d5-5.5-q", domain:5, ts:"5.5", scenario:5, type:"single",
  stem:"A CI reviewer reports per-finding confidence. How should it be used?",
  options:[
    {k:"A", text:"Route uncertain findings to a more experienced reviewer."},
    {k:"B", text:"Suppress findings below a threshold."},
    {k:"C", text:"Rank findings by confidence and show the top ten."},
    {k:"D", text:"Re-run the review when average confidence is low."}
  ],
  correct:["A"],
  explain:{
    why:"Confidence is useful for directing attention. Uncertain findings are exactly the ones where an experienced judgement adds most, so they should be routed rather than discarded.",
    distractors:{
      B:"Suppression on an uncalibrated score discards true positives with the false ones.",
      C:"A top-ten cut hides real findings below the line.",
      D:"Re-running does not resolve uncertainty about specific findings."
    }
  },
  refs:[R_PROMPT] },

{ id:"d5-5.5-r", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"A validation set is drawn entirely from last quarter's documents. What is the risk when calibrating against it?",
  options:[
    {k:"A", text:"Thresholds may not hold as the document mix changes."},
    {k:"B", text:"Calibration requires at least a year of data."},
    {k:"C", text:"Recent documents cannot be labelled reliably."},
    {k:"D", text:"Calibration only applies to the documents it was drawn from."}
  ],
  correct:["A"],
  explain:{
    why:"Calibration is only valid over the distribution it was measured on. If the incoming mix shifts, a threshold tuned on last quarter may admit more errors than intended.",
    distractors:{
      D:"Too strong: calibration generalises to similar documents, which is why it is useful at all.",
      B:"There is no fixed minimum period; representativeness matters more than duration.",
      C:"Recent documents are labelled the same way as older ones."
    }
  },
  refs:[R_STRUCT] },

{ id:"d5-5.5-s", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"Why is an aggregate accuracy figure insufficient for an automation decision?",
  options:[
    {k:"A", text:"It can hide a segment performing far below the average."},
    {k:"B", text:"It is usually computed on too small a sample."},
    {k:"C", text:"It cannot be computed per field."},
    {k:"D", text:"It changes each time it is measured."}
  ],
  correct:["A"],
  explain:{
    why:"Automation applies to every segment, so a figure that averages a strong majority with a weak minority tells you nothing about how the weak part will fare.",
    distractors:{
      B:"Sample size is a separate concern and can be perfectly adequate.",
      C:"Per-field accuracy is computable, which is precisely the recommended breakdown.",
      D:"Measurement variation is normal and not the reason segmentation matters."
    }
  },
  refs:[R_STRUCT] },

{ id:"d5-5.5-t", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"After reducing human review, what ongoing measurement should continue?",
  options:[
    {k:"A", text:"Sampled review of the automated population."},
    {k:"B", text:"The original pre-automation accuracy figure."},
    {k:"C", text:"Only the volume of documents processed."},
    {k:"D", text:"Nothing, once accuracy has been established."}
  ],
  correct:["A"],
  explain:{
    why:"Accuracy established once is a snapshot. Continued sampling is what detects drift as document mixes change and catches novel error types.",
    distractors:{
      B:"A historical figure says nothing about current performance.",
      C:"Throughput is operational and carries no quality signal.",
      D:"Treating accuracy as settled is how drift goes unnoticed until it causes a problem."
    }
  },
  refs:[R_STRUCT] },

{ id:"d5-5.6-g", domain:5, ts:"5.6", scenario:2, type:"single",
  stem:"Two credible sources give market sizes of $2.1B and $3.4B. What should the report do?",
  options:[
    {k:"A", text:"Present both with attribution and flag the conflict."},
    {k:"B", text:"Report the average of the two figures, noting that the sources vary."},
    {k:"C", text:"Report the more recent figure."},
    {k:"D", text:"Omit the figure."}
  ],
  correct:["A"],
  explain:{
    why:"Different figures usually reflect different definitions of the market rather than an error. Showing both with sources lets the reader judge which methodology they trust.",
    distractors:{
      B:"An average of two differently-defined measurements is a number no source supports.",
      C:"Recency is not authority, and the difference may not be temporal at all.",
      D:"Omission hides real information the reader can act on."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.6-h", domain:5, ts:"5.6", scenario:2, type:"single",
  stem:"Citations are correct at analysis and lost by synthesis. What structural requirement fixes this?",
  options:[
    {k:"A", text:"Claim-source mappings each hop must preserve."},
    {k:"B", text:"A bibliography appended to the report."},
    {k:"C", text:"An instruction to cite carefully."},
    {k:"D", text:"Full source text passed to synthesis."}
  ],
  correct:["A"],
  explain:{
    why:"Attribution is lost at compression steps unless the claim-to-source link is an explicit field that each hop is obliged to carry forward.",
    distractors:{
      D:"Full text is expensive and still leaves the model to work out which passage supports which claim.",
      B:"A detached bibliography lists what was read without mapping claims to entries.",
      C:"An instruction cannot recover a mapping the input never contained."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.6-i", domain:5, ts:"5.6", scenario:2, type:"single",
  stem:"Adoption is reported as 31% in one source and 58% in another, three years apart, with no dates recorded. What is the risk?",
  options:[
    {k:"A", text:"Growth is presented as disagreement."},
    {k:"B", text:"Both figures are discarded as unreliable."},
    {k:"C", text:"The average is reported instead."},
    {k:"D", text:"The larger figure is always chosen."}
  ],
  correct:["A"],
  explain:{
    why:"Without dates the two look like conflicting claims about the same thing, when they are consistent observations of a changing quantity.",
    distractors:{
      C:"Averaging is one bad outcome among several, and it is not the fundamental error.",
      B:"Discarding both loses genuine information.",
      D:"There is no such rule, and preferring the larger figure would be arbitrary."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.6-j", domain:5, ts:"5.6", scenario:2, type:"single",
  stem:"A document-analysis subagent finds two contradictory figures within one source. What should it return?",
  options:[
    {k:"A", text:"Both, explicitly annotated as conflicting."},
    {k:"B", text:"An error, since the document is unreliable."},
    {k:"C", text:"The figure from the summary section."},
    {k:"D", text:"The rest of the analysis, omitting both figures."}
  ],
  correct:["A"],
  explain:{
    why:"Reporting what the source actually says, including that it disagrees with itself, gives the coordinator an accurate picture and the ability to reconcile with wider context.",
    distractors:{
      C:"Summary sections often carry stale figures, so treating them as authoritative is unfounded.",
      B:"One inconsistent figure does not invalidate the rest of the document.",
      D:"Silent omission loses information and hides a quality signal about the source."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.6-k", domain:5, ts:"5.6", scenario:2, type:"single",
  stem:"A report presents financial comparisons, news context and technical findings in one uniform bulleted list. Readers struggle. What is the guidance?",
  options:[
    {k:"A", text:"Render each content type in its natural form."},
    {k:"B", text:"Keep the uniform format and add a reading guide."},
    {k:"C", text:"Convert everything to prose."},
    {k:"D", text:"Split the report into one document per content type."}
  ],
  correct:["A"],
  explain:{
    why:"Comparative figures belong in a table where columns align, narrative belongs in prose, and technical findings in structured lists. Flattening destroys the structure that makes each readable.",
    distractors:{
      B:"Explaining a poor format does not make it serve the content.",
      C:"Prose is a poor vehicle for multi-dimensional numeric comparison.",
      D:"Splitting fragments the narrative the report should present whole."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.6-l", domain:5, ts:"5.6", scenario:2, type:"single",
  stem:"How should a report distinguish well-established findings from contested ones?",
  options:[
    {k:"A", text:"Explicit sections preserving each source's characterisation."},
    {k:"B", text:"Ordering the findings by the number of sources that support each one."},
    {k:"C", text:"Including only well-established findings."},
    {k:"D", text:"A numeric confidence score per finding."}
  ],
  correct:["A"],
  explain:{
    why:"Sectioning makes the epistemic status unmissable, and preserving how each source framed its own finding lets readers evaluate the disagreement themselves.",
    distractors:{
      D:"A synthesised score compresses away the reasons for disagreement, which is what the reader needs.",
      B:"Ordering is an implicit signal readers routinely miss, and source count is a crude proxy.",
      C:"Contested findings are often the most important."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.6-m", domain:5, ts:"5.6", scenario:2, type:"multi",
  stem:"Which two belong in a subagent's structured finding to support downstream synthesis? (Select 2.)",
  options:[
    {k:"A", text:"The source URL or document name."},
    {k:"B", text:"The publication or collection date."},
    {k:"C", text:"The subagent's confidence in its own reading."},
    {k:"D", text:"The time the retrieval took."}
  ],
  correct:["A","B"],
  explain:{
    why:"Source identity supports attribution and dates support temporal interpretation. Both are needed for synthesis to combine findings without distorting them.",
    distractors:{
      C:"Self-reported confidence is poorly calibrated and not what synthesis needs to attribute a claim.",
      D:"Retrieval duration is operational telemetry."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.6-n", domain:5, ts:"5.6", scenario:2, type:"single",
  stem:"Where in a pipeline is source attribution most often lost?",
  options:[
    {k:"A", text:"At summarisation steps that compress findings."},
    {k:"B", text:"At retrieval, when sources are fetched."},
    {k:"C", text:"At the final rendering step."},
    {k:"D", text:"At the coordinator's delegation step."}
  ],
  correct:["A"],
  explain:{
    why:"Compression keeps the substance and drops the metadata, so a claim survives while the record of where it came from does not.",
    distractors:{
      B:"Retrieval is where attribution originates and is usually intact.",
      C:"Rendering can only present what it was given.",
      D:"Delegation carries prompts rather than findings."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.6-o", domain:5, ts:"5.6", scenario:2, type:"single",
  stem:"A synthesis agent merges findings from two subagents that used the same source. What should happen to the attribution?",
  options:[
    {k:"A", text:"Merge the claims while keeping the single shared source."},
    {k:"B", text:"Record it as two independent corroborating sources."},
    {k:"C", text:"Keep only the first subagent's version."},
    {k:"D", text:"Drop attribution, since it is duplicated."}
  ],
  correct:["A"],
  explain:{
    why:"Two agents reading one document is one piece of evidence. Preserving that keeps the report from implying corroboration that does not exist.",
    distractors:{
      B:"This manufactures false corroboration, which is the most misleading option available.",
      C:"Discarding one version may lose detail the other captured.",
      D:"Dropping attribution removes the citation the report depends on."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.6-p", domain:5, ts:"5.6", scenario:2, type:"single",
  stem:"Why annotate a conflict rather than let the coordinator pick a value?",
  options:[
    {k:"A", text:"The disagreement is itself information the reader needs."},
    {k:"B", text:"Coordinators cannot compare numeric values."},
    {k:"C", text:"Annotation is cheaper than reconciliation."},
    {k:"D", text:"Picking a value would violate the schema."}
  ],
  correct:["A"],
  explain:{
    why:"That credible sources disagree tells the reader something true about the state of the evidence, and silently resolving it presents a certainty the sources do not support.",
    distractors:{
      C:"Cost is not the argument; fidelity is.",
      B:"Comparison is trivial; the question is whether choosing is appropriate.",
      D:"A well-designed schema accommodates conflicting values, which is the point of the flag."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.6-q", domain:5, ts:"5.6", scenario:2, type:"single",
  stem:"A report cites a statistic with no source. Tracing it shows the analysis subagent had the source but synthesis dropped it. What is the fix?",
  options:[
    {k:"A", text:"Require synthesis to carry the source field through."},
    {k:"B", text:"Have the coordinator add citations afterwards."},
    {k:"C", text:"Have synthesis re-derive the source by searching."},
    {k:"D", text:"Remove statistics that cannot be cited."}
  ],
  correct:["A"],
  explain:{
    why:"The mapping existed and was discarded, so the fix belongs at the step that discarded it. Making the field mandatory through synthesis preserves it by construction.",
    distractors:{
      B:"Post-hoc attribution is guesswork about which source supported which claim.",
      C:"Re-searching may find a different source that happens to agree, which is not the same citation.",
      D:"Removing the statistic loses a genuine finding over a recoverable process defect."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.6-r", domain:5, ts:"5.6", scenario:2, type:"single",
  stem:"Which report structure best serves a reader who must act on contested evidence?",
  options:[
    {k:"A", text:"Established findings, then contested ones with each position."},
    {k:"B", text:"All findings merged into a single narrative."},
    {k:"C", text:"Findings ranked by a synthesised confidence score."},
    {k:"D", text:"Only the findings the synthesis agent judged correct."}
  ],
  correct:["A"],
  explain:{
    why:"Separating the two lets the reader rely on the settled material and apply their own judgement where the evidence genuinely diverges, with both positions in front of them.",
    distractors:{
      C:"A single score hides which specific findings are disputed and why.",
      B:"A merged narrative flattens the distinction between certainty and dispute.",
      D:"Filtering to one view removes exactly the material requiring judgement."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.6-s", domain:5, ts:"5.6", scenario:6, type:"single",
  stem:"An extraction pipeline records values without noting which page they came from. A reviewer disputes one. What is the cost?",
  options:[
    {k:"A", text:"The value cannot be checked without re-reading the document."},
    {k:"B", text:"The extraction must be discarded entirely."},
    {k:"C", text:"The schema becomes invalid."},
    {k:"D", text:"Downstream systems reject the record."}
  ],
  correct:["A"],
  explain:{
    why:"Provenance is what makes verification cheap. Without it, checking one disputed field means re-reading the whole document.",
    distractors:{
      B:"The extraction is probably fine; it is simply expensive to verify.",
      C:"Omitting provenance does not violate a schema that never required it.",
      D:"Downstream systems accept the record; the difficulty is auditing it."
    }
  },
  refs:[R_STRUCT] },

{ id:"d5-5.6-t", domain:5, ts:"5.6", scenario:2, type:"single",
  stem:"What is the strongest argument for preserving each source's own characterisation of a finding?",
  options:[
    {k:"A", text:"Methodological caveats change how a figure should be read."},
    {k:"B", text:"It makes the report longer and more thorough."},
    {k:"C", text:"It avoids paraphrasing, which risks copyright issues."},
    {k:"D", text:"It allows the report to be generated faster."}
  ],
  correct:["A"],
  explain:{
    why:"A figure described by its author as preliminary, or limited to one region, means something different from the bare number. Stripping that framing changes what the reader concludes.",
    distractors:{
      B:"Length is not a virtue in itself.",
      C:"Copyright is a real consideration but not why the framing matters analytically.",
      D:"Generation speed is unaffected."
    }
  },
  refs:[R_SUB] },
