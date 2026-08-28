
/* ---- Domain 4 expansion: task statements 4.4, 4.5 and 4.6 ---- */

{ id:"d4-4.4-g", domain:4, ts:"4.4", scenario:6, type:"single",
  stem:"Validation rejects an extraction because a date arrived as `15/03/2026` where an ISO string was expected. Will a retry with the error attached succeed?",
  options:[
    {k:"A", text:"Usually; the value is present and only its form is wrong."},
    {k:"B", text:"No; format errors indicate the field is absent."},
    {k:"C", text:"Only if the schema is relaxed to accept both forms."},
    {k:"D", text:"Only if the document is re-scanned at higher quality."}
  ],
  correct:["A"],
  explain:{
    why:"The information was found; it was simply expressed in the wrong shape. Told exactly what the validator objected to, the model can re-emit the same data correctly.",
    distractors:{
      C:"Relaxing the schema removes the error by accepting inconsistent data, which defeats the normalisation the schema exists to provide.",
      B:"The value is plainly present, so absence is not the failure.",
      D:"Scan quality is irrelevant when the value was read correctly."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.4-h", domain:4, ts:"4.4", scenario:6, type:"single",
  stem:"An extraction fails validation because `parent_company` is empty, and investigation shows it appears only in a corporate registry you do not supply. What should the pipeline do?",
  options:[
    {k:"A", text:"Stop retrying and route the document for enrichment."},
    {k:"B", text:"Retry with a stronger instruction that the field is required."},
    {k:"C", text:"Retry with an example of a correctly extracted parent company."},
    {k:"D", text:"Relax the schema so the field is optional and continue."}
  ],
  correct:["A"],
  explain:{
    why:"No reformulation can produce information that is not in the source. Recognising this and sending the document somewhere the fact can be looked up is the only path that ends well.",
    distractors:{
      D:"Making it optional does stop the failure, but it silently ships records missing a field the business needs.",
      B:"Emphasis pressures the model to invent a plausible parent company.",
      C:"An example teaches the format, not this document's missing content."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.4-i", domain:4, ts:"4.4", scenario:6, type:"single",
  stem:"What should a retry request contain for the model to self-correct effectively?",
  options:[
    {k:"A", text:"The document, the failed output and the errors."},
    {k:"B", text:"The document and an instruction to try harder."},
    {k:"C", text:"The failed output and the schema."},
    {k:"D", text:"The document alone, so the model starts fresh."}
  ],
  correct:["A"],
  explain:{
    why:"Correction needs all three: the source to re-read, the attempt to correct, and a precise statement of what was wrong with it.",
    distractors:{
      C:"Without the document the model cannot check its values against anything.",
      D:"Starting fresh discards the information about what failed, so the same error is likely.",
      B:"Effort instructions carry no information about the defect."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.4-j", domain:4, ts:"4.4", scenario:6, type:"single",
  stem:"A source document states a total in two places with different values. What extraction design surfaces this rather than hiding it?",
  options:[
    {k:"A", text:"A `conflict_detected` flag plus both values."},
    {k:"B", text:"Take the value nearer the document's end."},
    {k:"C", text:"Take the value that appears more often."},
    {k:"D", text:"Fail the document and route it to manual entry."}
  ],
  correct:["A"],
  explain:{
    why:"An explicit flag with both values preserves what the source actually says, so a reviewer can adjudicate with full information rather than inheriting a silent guess.",
    distractors:{
      D:"Failing the whole document discards every correctly extracted field over one conflicted value.",
      B:"Position is not evidence of correctness; a later figure can equally be a typo.",
      C:"A repeated error is still an error."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.4-k", domain:4, ts:"4.4", scenario:5, type:"single",
  stem:"Developers dismiss many findings and you cannot tell which code shapes trigger the bad ones. What addition to the finding schema helps?",
  options:[
    {k:"A", text:"A `detected_pattern` field naming the construct."},
    {k:"B", text:"A free-text field explaining the reasoning."},
    {k:"C", text:"A timestamp for each finding."},
    {k:"D", text:"A severity label."}
  ],
  correct:["A"],
  explain:{
    why:"A named construct makes dismissals groupable, so you can see that a particular idiom accounts for most of them and fix that criterion specifically.",
    distractors:{
      B:"Free text cannot be aggregated across thousands of findings without heavy processing.",
      C:"Timestamps support trend analysis rather than attribution to code shapes.",
      D:"Severity is already known and does not identify the trigger."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.4-l", domain:4, ts:"4.4", scenario:6, type:"single",
  stem:"A pipeline retries every validation failure up to five times. Cost is high and the success rate on retries is 30%. What would improve it most?",
  options:[
    {k:"A", text:"Retry only categories retries can fix."},
    {k:"B", text:"Increase the retry limit to ten."},
    {k:"C", text:"Retry with higher temperature for variety."},
    {k:"D", text:"Retry with a larger model."}
  ],
  correct:["A"],
  explain:{
    why:"The 70% that never succeed are mostly missing-information failures, which no retry can resolve. Classifying first means the budget goes only where it can pay off.",
    distractors:{
      B:"More attempts at unfixable failures multiplies the waste.",
      C:"Variance does not conjure absent information and destabilises fields that were correct.",
      D:"A stronger model still cannot read what is not in the document."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.4-m", domain:4, ts:"4.4", scenario:6, type:"multi",
  stem:"Which two validation failures are usually fixable by retry with feedback? (Select 2.)",
  options:[
    {k:"A", text:"A nested object returned as flat top-level keys."},
    {k:"B", text:"A number returned as a formatted string."},
    {k:"C", text:"A field the document genuinely does not contain."},
    {k:"D", text:"A field whose value lives in a system not provided."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both are representation errors: the data was found and only its shape is wrong, which a precise error message lets the model correct.",
    distractors:{
      C:"There is nothing to extract, so the correct output is a null and the schema should allow one.",
      D:"The information is outside the model's context entirely, so no retry can reach it."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.4-n", domain:4, ts:"4.4", scenario:6, type:"single",
  stem:"Which failure is a semantic error rather than a schema error?",
  options:[
    {k:"A", text:"A shipping address in the billing field."},
    {k:"B", text:"A missing required property."},
    {k:"C", text:"A string where an integer was declared."},
    {k:"D", text:"An enum value outside the permitted set."}
  ],
  correct:["A"],
  explain:{
    why:"Both fields are valid strings and the record conforms perfectly. The error is that the value was taken from the wrong part of the document, which no schema can detect.",
    distractors:{
      B:"Presence is a structural property the schema checks.",
      C:"Type mismatch is exactly what schema validation catches.",
      D:"Enum membership is a declared constraint."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.4-o", domain:4, ts:"4.4", scenario:6, type:"single",
  stem:"After adding retry-with-feedback, some documents loop through all retries and still fail with the same error. What should the pipeline record?",
  options:[
    {k:"A", text:"The failure category, so unfixable classes can be excluded."},
    {k:"B", text:"Only the final error, since intermediates are redundant."},
    {k:"C", text:"Nothing; repeated failures are self-evident."},
    {k:"D", text:"The full text of every attempt for manual comparison."}
  ],
  correct:["A"],
  explain:{
    why:"Categorised failures are what let you notice that a whole class never succeeds, and then stop spending retries on it. That is the feedback loop closing.",
    distractors:{
      D:"Full transcripts are useful for one-off debugging but do not aggregate into a decision.",
      B:"The final error alone loses whether the attempts were converging or identical.",
      C:"Without a record there is no way to see the pattern across documents."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.4-p", domain:4, ts:"4.4", scenario:5, type:"single",
  stem:"A CI reviewer's structured findings lack any field identifying what triggered them. What analysis becomes impossible?",
  options:[
    {k:"A", text:"Which code shapes generate the false positives."},
    {k:"B", text:"Counting findings per pull request."},
    {k:"C", text:"Measuring the dismissal rate overall."},
    {k:"D", text:"Sorting findings by severity."}
  ],
  correct:["A"],
  explain:{
    why:"Aggregate rates tell you there is a problem; attribution tells you which criterion to fix. Without a trigger field the dismissals cannot be grouped by cause.",
    distractors:{
      B:"Counting needs only the findings themselves.",
      C:"An overall rate is computable from outcomes alone.",
      D:"Severity is a separate field and remains sortable."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.4-q", domain:4, ts:"4.4", scenario:6, type:"single",
  stem:"Why is a self-correction loop preferable to relaxing the schema when validation fails often?",
  options:[
    {k:"A", text:"Relaxing accepts bad data; correcting fixes it."},
    {k:"B", text:"Relaxing costs more tokens than retrying."},
    {k:"C", text:"Relaxed schemas cannot be used with tool use."},
    {k:"D", text:"Correction always succeeds on the first retry."}
  ],
  correct:["A"],
  explain:{
    why:"A looser schema makes the error disappear by admitting the malformed record downstream, where the problem resurfaces as bad data nobody flagged.",
    distractors:{
      B:"Relaxing is cheaper in tokens, which is part of its appeal and why the data-quality argument matters.",
      C:"Any valid schema works with tool use, strict or permissive.",
      D:"Correction often needs more than one attempt and sometimes cannot succeed at all."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.4-r", domain:4, ts:"4.4", scenario:6, type:"single",
  stem:"A validator checks only that required fields are present. Extraction quality is poor despite everything passing. What is missing?",
  options:[
    {k:"A", text:"Checks between values."},
    {k:"B", text:"Stricter type declarations."},
    {k:"C", text:"More required fields."},
    {k:"D", text:"A larger validation sample."}
  ],
  correct:["A"],
  explain:{
    why:"Presence says a field was filled, not that it was filled correctly. Cross-field checks such as totals summing or dates ordering are what catch a plausible but wrong record.",
    distractors:{
      C:"More required fields increases the pressure to fabricate rather than improving quality.",
      B:"Types are already being enforced by the schema and were not the failure.",
      D:"A larger sample measures the problem better without detecting it in any individual record."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.4-s", domain:4, ts:"4.4", scenario:6, type:"single",
  stem:"What is the practical benefit of distinguishing retryable from non-retryable validation failures?",
  options:[
    {k:"A", text:"Retry budget goes only where it can succeed."},
    {k:"B", text:"Retryable failures can use a cheaper model."},
    {k:"C", text:"Non-retryable failures can be ignored entirely."},
    {k:"D", text:"The schema can be simplified."}
  ],
  correct:["A"],
  explain:{
    why:"Retries are not free, and a missing-information failure will consume the entire budget to arrive at the same result. Classifying first directs the spend at the failures that respond.",
    distractors:{
      C:"Non-retryable failures still need handling, usually enrichment or human review.",
      B:"Model choice is independent of the failure category.",
      D:"The schema is unchanged by how failures are classified."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.4-t", domain:4, ts:"4.4", scenario:6, type:"single",
  stem:"An extraction returns a total of 12,400 where the line items sum to 11,900. What should the pipeline do?",
  options:[
    {k:"A", text:"Record both and flag the discrepancy for review."},
    {k:"B", text:"Overwrite the stated total with the computed one."},
    {k:"C", text:"Retry until the two agree."},
    {k:"D", text:"Accept the stated total, since the document is authoritative."}
  ],
  correct:["A"],
  explain:{
    why:"The mismatch may be an extraction error or an error in the document itself, and only a human reading it can tell. Recording both preserves the evidence for that decision.",
    distractors:{
      B:"Silently overwriting hides a genuine discrepancy in the source.",
      C:"Retrying until agreement selects for a consistent answer rather than a correct one.",
      D:"Source documents contain arithmetic errors, so authority is not a safe assumption."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.5-g", domain:4, ts:"4.5", scenario:6, type:"single",
  stem:"You must guarantee results within 30 hours using an API whose worst case is 24. What submission cadence works?",
  options:[
    {k:"A", text:"Every 4 hours."},
    {k:"B", text:"Once daily."},
    {k:"C", text:"Every 30 hours."},
    {k:"D", text:"Once weekly with priority flags."}
  ],
  correct:["A"],
  explain:{
    why:"Total latency is queue wait plus processing. A four-hour cadence caps the wait at four, giving a 28-hour worst case inside the SLA.",
    distractors:{
      B:"A document arriving just after submission waits nearly 24 hours, then up to 24 more.",
      C:"A 30-hour cadence exhausts the SLA before processing begins.",
      D:"Weekly submission misses the SLA by days, and there are no priority flags."
    }
  },
  refs:[R_BATCH] },

{ id:"d4-4.5-h", domain:4, ts:"4.5", scenario:6, type:"single",
  stem:"Of 500 batched documents, 12 failed for exceeding the context limit. What is the correct recovery?",
  options:[
    {k:"A", text:"Resubmit those 12 by `custom_id`, chunked."},
    {k:"B", text:"Resubmit all 500 with chunking applied."},
    {k:"C", text:"Process the 12 synchronously instead."},
    {k:"D", text:"Drop the 12 and report 97.6% coverage."}
  ],
  correct:["A"],
  explain:{
    why:"`custom_id` identifies exactly which items failed, so only those need reprocessing, and chunking addresses the reason they failed.",
    distractors:{
      C:"The context limit applies to the synchronous API too, so the same documents fail there.",
      B:"Reprocessing 488 successes doubles their cost and may degrade extractions that were fine.",
      D:"Silently dropping 2.4% of the corpus is a data quality failure with a straightforward fix available."
    }
  },
  refs:[R_BATCH] },

{ id:"d4-4.5-i", domain:4, ts:"4.5", scenario:5, type:"single",
  stem:"Which workflow is unsuitable for the batch API?",
  options:[
    {k:"A", text:"A pre-merge check a developer waits on."},
    {k:"B", text:"An overnight technical debt report."},
    {k:"C", text:"A weekly compliance audit."},
    {k:"D", text:"A nightly test generation run."}
  ],
  correct:["A"],
  explain:{
    why:"Batch offers up to a 24-hour window with no latency guarantee, which is unusable when someone is blocked on the answer.",
    distractors:{
      B:"Overnight reports are the archetypal batch workload.",
      C:"A weekly audit has enormous latency tolerance.",
      D:"Nightly generation is read the next morning and tolerates the window."
    }
  },
  refs:[R_BATCH] },

{ id:"d4-4.5-j", domain:4, ts:"4.5", scenario:6, type:"single",
  stem:"An extraction workflow calls a lookup tool mid-request and continues with the result. Can it move to batch unchanged?",
  options:[
    {k:"A", text:"No; batch does not support multi-turn tool calling in one request."},
    {k:"B", text:"Yes, provided the tools are declared in the batch request."},
    {k:"C", text:"Yes, provided the tool responds within the window."},
    {k:"D", text:"No; batch does not accept tool definitions at all."}
  ],
  correct:["A"],
  explain:{
    why:"The workflow depends on executing a tool mid-request and feeding the result back, which batch cannot do. It has to be restructured, typically by enriching before submission.",
    distractors:{
      B:"Declaring tools does not enable the execution loop the workflow requires.",
      C:"The limitation is structural rather than about timing.",
      D:"This overstates it; the specific constraint is the multi-turn loop."
    }
  },
  refs:[R_BATCH] },

{ id:"d4-4.5-k", domain:4, ts:"4.5", scenario:6, type:"single",
  stem:"Before batching 80,000 documents with a new prompt, what is the most valuable preparation?",
  options:[
    {k:"A", text:"Refine the prompt on a small sample first."},
    {k:"B", text:"Split into 800 batches of 100."},
    {k:"C", text:"Submit everything and resubmit failures."},
    {k:"D", text:"Run the whole corpus synchronously to validate."}
  ],
  correct:["A"],
  explain:{
    why:"A systematic prompt flaw discovered after 80,000 documents means paying for the corpus twice and waiting through two windows. A sample finds it for almost nothing.",
    distractors:{
      B:"Smaller batches limit blast radius slightly, but a systematic flaw affects them all equally.",
      C:"Resubmission is available, and is exactly the cost the sample avoids.",
      D:"Running everything synchronously discards the 50% saving and is the most expensive option."
    }
  },
  refs:[R_BATCH] },

{ id:"d4-4.5-l", domain:4, ts:"4.5", scenario:6, type:"single",
  stem:"What is `custom_id` for?",
  options:[
    {k:"A", text:"Correlating each request with its response."},
    {k:"B", text:"Setting processing priority within a batch."},
    {k:"C", text:"Grouping requests onto one worker."},
    {k:"D", text:"Selecting which model handles the request."}
  ],
  correct:["A"],
  explain:{
    why:"Results are not guaranteed to return in submission order, so the identifier is how each response is matched to its request and how failures are identified.",
    distractors:{
      B:"There is no per-request priority mechanism.",
      C:"It does not influence scheduling or worker assignment.",
      D:"Model selection is a per-request parameter, not the identifier."
    }
  },
  refs:[R_BATCH] },

{ id:"d4-4.5-m", domain:4, ts:"4.5", scenario:5, type:"single",
  stem:"A manager proposes batch for both a blocking check and an overnight report, citing the 50% saving. How should you respond?",
  options:[
    {k:"A", text:"Batch the report; keep the check synchronous."},
    {k:"B", text:"Batch both and poll for completion."},
    {k:"C", text:"Keep both synchronous to avoid ordering issues."},
    {k:"D", text:"Batch both with a synchronous fallback on delay."}
  ],
  correct:["A"],
  explain:{
    why:"Match each workload to its latency tolerance. The report has hours to spare; the check has a developer waiting.",
    distractors:{
      B:"Polling does not change the underlying guarantee, so the developer can still wait hours.",
      C:"Ordering is not a problem, since `custom_id` correlates results.",
      D:"A dual path is more complexity than simply using the right API for each."
    }
  },
  refs:[R_BATCH] },

{ id:"d4-4.5-n", domain:4, ts:"4.5", scenario:6, type:"multi",
  stem:"Which two are accurate properties of the Message Batches API? (Select 2.)",
  options:[
    {k:"A", text:"Roughly 50% cost saving against standard rates."},
    {k:"B", text:"A processing window of up to 24 hours with no latency SLA."},
    {k:"C", text:"Guaranteed completion within one hour."},
    {k:"D", text:"Responses returned in submission order."}
  ],
  correct:["A","B"],
  explain:{
    why:"The saving and the unguaranteed window are the two defining characteristics, and together they determine which workloads suit it.",
    distractors:{
      C:"No latency guarantee is offered, which is precisely why blocking workflows are unsuitable.",
      D:"Order is not guaranteed, which is why `custom_id` exists."
    }
  },
  refs:[R_BATCH] },

{ id:"d4-4.5-o", domain:4, ts:"4.5", scenario:6, type:"single",
  stem:"A team reports that batches usually finish in 20 minutes and proposes using batch for a user-facing feature. What is the flaw?",
  options:[
    {k:"A", text:"Usual is not guaranteed, and the tail is what users get."},
    {k:"B", text:"Batch cannot serve user-facing features technically."},
    {k:"C", text:"Batch results cannot be correlated to users."},
    {k:"D", text:"Batch responses omit token usage data."}
  ],
  correct:["A"],
  explain:{
    why:"Typical latency is not a service level. The occasional request that takes hours is the one that defines the user experience, and there is no commitment preventing it.",
    distractors:{
      C:"`custom_id` correlates results perfectly well.",
      B:"There is no technical prohibition; the objection is about the latency guarantee.",
      D:"Usage data is returned."
    }
  },
  refs:[R_BATCH] },

{ id:"d4-4.5-p", domain:4, ts:"4.5", scenario:6, type:"single",
  stem:"A batch of 100,000 requests is rejected. What is the most likely cause?",
  options:[
    {k:"A", text:"A scale limit on requests or total size was exceeded."},
    {k:"B", text:"Batches must contain fewer than 1,000 requests."},
    {k:"C", text:"Duplicate `custom_id` values were used."},
    {k:"D", text:"Batches cannot mix models."}
  ],
  correct:["A"],
  explain:{
    why:"Batches are bounded by both a request count and a total payload size, and a submission of this scale is at the edge of those limits.",
    distractors:{
      C:"Duplicate identifiers are a real error worth checking, but they are less likely than a size limit at this scale.",
      B:"The limit is far above 1,000.",
      D:"Requests within a batch can specify different models."
    }
  },
  refs:[R_BATCH] },

{ id:"d4-4.5-q", domain:4, ts:"4.5", scenario:5, type:"single",
  stem:"Which factor should drive the choice between batch and synchronous processing?",
  options:[
    {k:"A", text:"Whether anything is blocked on the result."},
    {k:"B", text:"The number of requests involved."},
    {k:"C", text:"Whether the prompts use tools."},
    {k:"D", text:"The size of each individual document."}
  ],
  correct:["A"],
  explain:{
    why:"Latency tolerance is the discriminator. Everything else being equal, work nobody waits on should take the cheaper path.",
    distractors:{
      C:"Tool use does constrain batch, but it is a secondary consideration once latency has decided the question.",
      B:"Volume affects cost rather than which API is appropriate.",
      D:"Document size affects chunking rather than the batch decision."
    }
  },
  refs:[R_BATCH] },

{ id:"d4-4.5-r", domain:4, ts:"4.5", scenario:6, type:"single",
  stem:"After a batch completes, 40 requests have no corresponding response. What is the first thing to check?",
  options:[
    {k:"A", text:"Whether those requests expired past the window."},
    {k:"B", text:"Whether the model was overloaded at submission."},
    {k:"C", text:"Whether the responses were returned out of order."},
    {k:"D", text:"Whether the batch exceeded its token budget."}
  ],
  correct:["A"],
  explain:{
    why:"Requests that do not complete within the window expire, and expired requests are not billed. Reconciling by `custom_id` shows exactly which ones.",
    distractors:{
      C:"Out-of-order responses are expected and are matched by identifier, so nothing would be missing.",
      B:"Load affects timing rather than causing responses to vanish.",
      D:"There is no per-batch token budget that silently drops requests."
    }
  },
  refs:[R_BATCH] },

{ id:"d4-4.5-s", domain:4, ts:"4.5", scenario:6, type:"single",
  stem:"A pipeline submits one document per batch, several thousand times a day. What is wrong with this?",
  options:[
    {k:"A", text:"It takes the latency penalty without the batching benefit."},
    {k:"B", text:"Single-request batches are rejected."},
    {k:"C", text:"The cost saving does not apply below ten requests."},
    {k:"D", text:"Each batch requires a separate API key."}
  ],
  correct:["A"],
  explain:{
    why:"You accept the unguaranteed window, which is the cost of batching, while gaining none of the operational simplicity of submitting many items together.",
    distractors:{
      C:"The discount applies regardless of batch size, so the saving is real; the waste is elsewhere.",
      B:"Single-request batches are permitted.",
      D:"One key serves all batches."
    }
  },
  refs:[R_BATCH] },

{ id:"d4-4.5-t", domain:4, ts:"4.5", scenario:6, type:"single",
  stem:"How should a batch pipeline handle a mix of successes and failures?",
  options:[
    {k:"A", text:"Process the successes and resubmit only the failures."},
    {k:"B", text:"Discard the batch and resubmit everything."},
    {k:"C", text:"Wait for a fully successful batch before processing any results."},
    {k:"D", text:"Process only if the success rate exceeds 95%."}
  ],
  correct:["A"],
  explain:{
    why:"Partial success is the normal outcome, and `custom_id` makes it straightforward to take what worked and retry the rest with whatever modification their failure calls for.",
    distractors:{
      B:"Discarding successes doubles their cost for no benefit.",
      C:"Waiting for perfection stalls the pipeline on documents that may never succeed.",
      D:"An arbitrary threshold blocks useful results and does not address the failures."
    }
  },
  refs:[R_BATCH] },

{ id:"d4-4.6-g", domain:4, ts:"4.6", scenario:5, type:"single",
  stem:"A generation session is asked to review its own output and reports no issues. An independent instance finds three. What explains the difference?",
  options:[
    {k:"A", text:"The generating session re-accepts its own justifications."},
    {k:"B", text:"The independent instance used a larger context window."},
    {k:"C", text:"The generating session had already exhausted its context."},
    {k:"D", text:"Self-review is disabled within a generation session."}
  ],
  correct:["A"],
  explain:{
    why:"Every decision in the code was made for a reason the session still holds, so reviewing from inside that frame confirms rather than questions. A fresh instance sees only the code.",
    distractors:{
      C:"Remaining capacity is a practical factor but the bias persists with plenty of context left.",
      B:"Window size is a configuration choice available to either.",
      D:"Nothing disables it; it simply performs poorly."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.6-h", domain:4, ts:"4.6", scenario:5, type:"single",
  stem:"A 14-file review produces detailed feedback on some files and superficial comments on others, plus contradictory findings. What restructuring addresses this?",
  options:[
    {k:"A", text:"Per-file passes plus a separate integration pass."},
    {k:"B", text:"A model with a larger context window."},
    {k:"C", text:"Requiring developers to submit smaller pull requests."},
    {k:"D", text:"Three passes, reporting only findings seen twice."}
  ],
  correct:["A"],
  explain:{
    why:"Uneven depth across one diff is attention dilution. Per-file passes give each file the same focus, and a dedicated integration pass covers what only appears across boundaries.",
    distractors:{
      B:"The files already fit; attention quality and capacity are different things.",
      C:"This moves the burden to developers without improving the system.",
      D:"Consensus filtering suppresses subtle bugs caught in only one pass."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.6-i", domain:4, ts:"4.6", scenario:5, type:"single",
  stem:"What should a verification pass that reports confidence alongside each finding be used for?",
  options:[
    {k:"A", text:"Routing findings to the right level of reviewer."},
    {k:"B", text:"Discarding findings below a threshold."},
    {k:"C", text:"Ranking findings by severity."},
    {k:"D", text:"Deciding whether to run the review again."}
  ],
  correct:["A"],
  explain:{
    why:"Confidence is useful for directing attention rather than filtering. Uncertain findings go to someone more experienced instead of being thrown away.",
    distractors:{
      B:"Discarding on an uncalibrated score loses true positives along with false ones.",
      C:"Confidence is about whether a finding is real; severity is about its impact if it is.",
      D:"Re-running does not resolve uncertainty about a specific finding."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.6-j", domain:4, ts:"4.6", scenario:5, type:"single",
  stem:"An integration pass is added but receives only the diff. Cross-file breakage still slips through. Why?",
  options:[
    {k:"A", text:"Unchanged callers do not appear in a diff."},
    {k:"B", text:"Integration passes cannot detect signature changes."},
    {k:"C", text:"The pass runs before the per-file passes."},
    {k:"D", text:"Diffs omit file paths needed for cross-referencing."}
  ],
  correct:["A"],
  explain:{
    why:"The breakage is in code that did not change, so a pass restricted to the diff is structurally blind to exactly what it was added to find.",
    distractors:{
      B:"Signature mismatches are among the easiest cross-file checks when the call sites are visible.",
      C:"Ordering affects use of per-file findings, not whether callers are visible.",
      D:"Diffs include paths; the problem is which files are included at all."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.6-k", domain:4, ts:"4.6", scenario:5, type:"single",
  stem:"Why does adding extended thinking to a self-review not substitute for an independent instance?",
  options:[
    {k:"A", text:"It deepens reasoning without removing the commitment."},
    {k:"B", text:"Extended thinking cannot be used for review tasks."},
    {k:"C", text:"It consumes the context the review needs."},
    {k:"D", text:"It applies only to the first turn of a session."}
  ],
  correct:["A"],
  explain:{
    why:"The bias comes from having already decided, not from thinking too little. More careful reasoning within the same frame tends to produce a better-argued version of the same conclusion.",
    distractors:{
      C:"Context cost is real but secondary; the bias would remain with ample room.",
      B:"It is perfectly usable for review.",
      D:"It is not restricted to the first turn."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.6-l", domain:4, ts:"4.6", scenario:5, type:"multi",
  stem:"Which two make up a complete multi-pass review architecture for a large diff? (Select 2.)",
  options:[
    {k:"A", text:"Per-file passes for local issues."},
    {k:"B", text:"An integration pass for cross-file data flow."},
    {k:"C", text:"A consensus vote across repeated full passes."},
    {k:"D", text:"A summary pass consolidating the findings."}
  ],
  correct:["A","B"],
  explain:{
    why:"Local depth and cross-boundary coverage are the two things a single pass fails at, and each needs its own pass to be done properly.",
    distractors:{
      C:"Consensus filtering suppresses genuine intermittent findings.",
      D:"Consolidation is presentation; it finds nothing the passes did not."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.6-m", domain:4, ts:"4.6", scenario:5, type:"single",
  stem:"A team runs three review passes and reports only findings appearing in two. Real bugs start slipping through. Why?",
  options:[
    {k:"A", text:"Subtle bugs are often caught in only one pass."},
    {k:"B", text:"Three passes exceed the recommended maximum."},
    {k:"C", text:"Passes interfere when run against the same diff."},
    {k:"D", text:"Consensus requires an even number of passes."}
  ],
  correct:["A"],
  explain:{
    why:"Requiring agreement selects for the obvious. The findings that need a reviewer most are exactly the ones a given pass may or may not notice, and those fail the two-of-three test.",
    distractors:{
      B:"There is no such maximum.",
      C:"Independent passes do not interfere with one another.",
      D:"Odd numbers are the usual choice for voting; the flaw is voting at all here."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.6-n", domain:4, ts:"4.6", scenario:5, type:"single",
  stem:"What does an independent review instance lack that makes it a better reviewer?",
  options:[
    {k:"A", text:"The reasoning that produced the code."},
    {k:"B", text:"Access to the repository."},
    {k:"C", text:"Knowledge of the language."},
    {k:"D", text:"The project's coding standards."}
  ],
  correct:["A"],
  explain:{
    why:"What is absent is the chain of justifications. Without it there is nothing to defend, so questionable decisions are evaluated rather than assumed settled.",
    distractors:{
      B:"Repository access is a configuration choice and is usually desirable.",
      C:"Language knowledge is required for any useful review.",
      D:"Standards should be supplied, typically through CLAUDE.md."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.6-o", domain:4, ts:"4.6", scenario:3, type:"single",
  stem:"A research pipeline has the synthesis agent check its own citations. Errors persist. What would improve it?",
  options:[
    {k:"A", text:"A separate verification pass without the synthesis reasoning."},
    {k:"B", text:"An instruction to check citations twice."},
    {k:"C", text:"A larger model for synthesis."},
    {k:"D", text:"Citations checked before synthesis rather than after."}
  ],
  correct:["A"],
  explain:{
    why:"The same bias applies to citations as to code: the agent that chose them re-accepts its choices. A separate pass evaluates each claim-source pair on its own terms.",
    distractors:{
      D:"Pre-synthesis checking is worth doing, but it cannot verify citations that synthesis itself introduces or reattributes.",
      B:"Repetition within the same frame reproduces the same acceptances.",
      C:"Capability does not remove the attachment to one's own prior choices."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.6-p", domain:4, ts:"4.6", scenario:5, type:"single",
  stem:"Which is the strongest reason to split a review by file rather than by concern?",
  options:[
    {k:"A", text:"Each file gets the same depth of attention."},
    {k:"B", text:"Concern-based passes cannot be automated."},
    {k:"C", text:"Files are smaller than concerns."},
    {k:"D", text:"Concerns overlap and produce duplicate findings."}
  ],
  correct:["A"],
  explain:{
    why:"The defect being solved is uneven attention across a large diff, and giving each file its own pass is what equalises it.",
    distractors:{
      D:"Overlap between concerns is a real drawback and a reasonable secondary argument, but it is not the primary reason for splitting by file.",
      B:"Concern-based passes automate perfectly well.",
      C:"Size varies in both directions and is not the operative property."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.6-q", domain:4, ts:"4.6", scenario:5, type:"single",
  stem:"After splitting into per-file passes, the same style issue is reported in nine files. What would improve the output?",
  options:[
    {k:"A", text:"Consolidate repeated findings into one with all locations."},
    {k:"B", text:"Report only the first occurrence and drop the rest."},
    {k:"C", text:"Return to a single pass over all files."},
    {k:"D", text:"Suppress style findings entirely."}
  ],
  correct:["A"],
  explain:{
    why:"The finding is real in all nine places, so nothing should be discarded. Grouping them presents one actionable item with a complete list of sites.",
    distractors:{
      B:"Dropping eight real occurrences leaves work undone and the reader unaware of the scope.",
      C:"Reverting reintroduces the uneven depth the split fixed.",
      D:"Suppressing a whole category to fix a presentation problem is disproportionate."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.6-r", domain:4, ts:"4.6", scenario:5, type:"single",
  stem:"A single-pass review of 20 files flags a pattern as a problem in one file and approves identical code in another. What does this indicate?",
  options:[
    {k:"A", text:"Attention is unevenly distributed across the diff."},
    {k:"B", text:"The two files differ in ways not visible in the diff."},
    {k:"C", text:"The model is applying different standards deliberately."},
    {k:"D", text:"The review ran twice with different settings."}
  ],
  correct:["A"],
  explain:{
    why:"Contradictory treatment of identical code within one pass is the clearest signature of attention dilution, and it is what per-file passes exist to remove.",
    distractors:{
      B:"Surrounding context can genuinely change whether a pattern is a problem, which is worth checking, but identical code treated inconsistently points at attention first.",
      C:"There is no basis for a deliberate distinction between identical code.",
      D:"A single pass produced both findings."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.6-s", domain:4, ts:"4.6", scenario:5, type:"single",
  stem:"What is the cost of a multi-pass architecture that a team should weigh?",
  options:[
    {k:"A", text:"More calls and more findings to consolidate."},
    {k:"B", text:"Reduced ability to detect local issues."},
    {k:"C", text:"Loss of cross-file coverage."},
    {k:"D", text:"Incompatibility with structured output."}
  ],
  correct:["A"],
  explain:{
    why:"Splitting multiplies the number of requests and produces findings that need deduplicating and ordering. That overhead is the honest trade against better attention.",
    distractors:{
      B:"Local detection improves, since each file gets a focused pass.",
      C:"Cross-file coverage is preserved by the integration pass.",
      D:"Each pass can return structured findings normally."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.6-t", domain:4, ts:"4.6", scenario:5, type:"single",
  stem:"When is a single review pass the right choice?",
  options:[
    {k:"A", text:"When the diff is small enough to attend to evenly."},
    {k:"B", text:"When the diff spans many unrelated modules."},
    {k:"C", text:"When cross-file consistency is the main risk."},
    {k:"D", text:"When findings must be highly consistent."}
  ],
  correct:["A"],
  explain:{
    why:"Decomposition has real overhead, and on a small diff there is no attention problem to solve, so a single pass is cheaper and simpler.",
    distractors:{
      B:"Many unrelated modules is precisely where attention spreads thin.",
      C:"Cross-file risk argues for a dedicated integration pass.",
      D:"Consistency is what a single pass over a large diff fails to deliver."
    }
  },
  refs:[R_PROMPT] },
