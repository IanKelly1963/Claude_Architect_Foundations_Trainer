
/* ---------------- Domain 4: Prompt Engineering & Structured Output ---------------- */

{ id:"d4-4.1-a", domain:4, ts:"4.1", scenario:1, type:"single",
  stem:"Your automated reviewer flags outdated comments with a 70% false positive rate. The current instruction is 'check that comments are accurate'. Adding 'be conservative and only report high-confidence findings' did not help. What will?",
  options:[
    {k:"A", text:"Replace it with an explicit criterion: flag only where the comment contradicts the code."},
    {k:"B", text:"Ask the model to output a confidence score and suppress findings below 0.8."},
    {k:"C", text:"Instruct the model to flag a comment only when it is highly confident that the comment is genuinely wrong about the code."},
    {k:"D", text:"Increase the amount of surrounding code provided with each comment."}
  ],
  correct:["A"],
  explain:{
    why:"Vague calibration language does not improve precision, because the model's sense of 'conservative' is not anchored to anything. A categorical criterion names the exact condition, a contradiction between claim and behaviour, which excludes merely stale phrasing or imprecise wording.",
    distractors:{
      B:"Self-reported confidence is poorly calibrated to correctness, so thresholding on it discards true positives and keeps confident false ones.",
      C:"This is the same vague instruction that already failed, reworded.",
      D:"More context helps if the failure came from insufficient information, but a 70% false positive rate against a vague criterion points at the criterion."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.1-b", domain:4, ts:"4.1", scenario:1, type:"single",
  stem:"Your reviewer produces accurate security and bug findings but very noisy style findings. Developers have started ignoring all its comments. What is the pragmatic response?",
  options:[
    {k:"A", text:"Temporarily disable the style category while you improve its criteria."},
    {k:"B", text:"Keep all of the categories running and add a standing note explaining that style findings are known to be less reliable."},
    {k:"C", text:"Raise the overall confidence threshold so fewer findings of every category are posted."},
    {k:"D", text:"Post style findings to a separate channel that developers can opt into."}
  ],
  correct:["A"],
  explain:{
    why:"False positives are contagious to trust: one noisy category undermines confidence in the accurate ones. Removing the noisy category restores the signal quality of what remains while you fix it properly.",
    distractors:{
      B:"A caveat does not stop the noise appearing in the review, and developers still have to triage it.",
      C:"A global threshold suppresses accurate security and bug findings to fix a problem confined to style.",
      D:"This is better than nothing, but the noisy category still exists uncorrected and few will opt in."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.1-c", domain:4, ts:"4.1", scenario:1, type:"single",
  stem:"Severity labels from your reviewer are inconsistent: the same class of issue is marked critical in one run and minor in another. What produces consistent classification?",
  options:[
    {k:"A", text:"Define explicit severity criteria with a concrete code example illustrating each level."},
    {k:"B", text:"Reduce the severity scale from five levels to two, critical and non-critical."},
    {k:"C", text:"Ask the model to explain its severity reasoning, which will make it more careful."},
    {k:"D", text:"Set temperature to 0 so the same input always yields the same severity."}
  ],
  correct:["A"],
  explain:{
    why:"Consistency requires a shared definition of each level. Concrete code examples anchor the labels to observable properties instead of leaving 'critical' to be re-interpreted on every run.",
    distractors:{
      B:"Fewer levels reduces the surface for inconsistency without defining where the remaining boundary sits, so the same disagreement reappears at that boundary.",
      C:"Explanations improve transparency but do not supply the missing definition.",
      D:"Temperature 0 makes identical inputs deterministic. Different pull requests are not identical inputs, so cross-run inconsistency persists."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.1-d", domain:4, ts:"4.1", scenario:1, type:"single",
  stem:"Which prompt instruction is most likely to actually reduce false positives?",
  options:[
    {k:"A", text:"'Report only issues causing incorrect behaviour, data loss or a security vulnerability.'"},
    {k:"B", text:"'Be conservative in your findings, avoid reporting anything speculative, and use your judgement about what is worth raising.'"},
    {k:"C", text:"'Only report issues you are highly confident about.'"},
    {k:"D", text:"'Prioritise precision over recall when deciding whether to report an issue.'"}
  ],
  correct:["A"],
  explain:{
    why:"This names categories to report and categories to skip, which is a decision rule the model can apply consistently to any given finding.",
    distractors:{
      B:"'Conservative' and 'speculative' are undefined, so this shifts behaviour unpredictably rather than reliably.",
      C:"This delegates the decision to a confidence judgement the model is not well calibrated to make.",
      D:"The precision-recall framing is abstract; it does not tell the model which concrete findings fall on which side."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.1-e", domain:4, ts:"4.1", scenario:1, type:"single",
  stem:"Why do false positives in one review category matter beyond the wasted triage time?",
  options:[
    {k:"A", text:"They undermine developer trust in the accurate categories."},
    {k:"B", text:"They consume the token budget that accurate findings would otherwise use."},
    {k:"C", text:"They cause the model to learn from its own incorrect output when the same review is run again in subsequent passes."},
    {k:"D", text:"They increase the review latency past the threshold developers will tolerate."}
  ],
  correct:["A"],
  explain:{
    why:"Trust is the currency of an automated reviewer. Once developers learn that a share of its comments are wrong, the cheapest strategy becomes ignoring all of them, which destroys the value of the correct findings too.",
    distractors:{
      B:"Token cost is real but minor next to the behavioural effect on the team.",
      C:"The model does not learn from its outputs between runs; there is no such feedback loop unless you build one.",
      D:"Latency is not materially affected by a few extra findings."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.1-f", domain:4, ts:"4.1", scenario:2, type:"single",
  stem:"A colleague argues that if false positives are high, the fix is always a more capable model. When is that reasoning wrong?",
  options:[
    {k:"A", text:"When the criteria themselves are ambiguous, since capability cannot resolve an unclear rule."},
    {k:"B", text:"Never, since model capability is the dominant factor in finding quality."},
    {k:"C", text:"Only when the codebase is small enough that any reasonably capable model would perform more or less equivalently on it."},
    {k:"D", text:"Only when cost constraints make the larger model impractical."}
  ],
  correct:["A"],
  explain:{
    why:"If the specification does not say what counts as a defect, no amount of capability supplies that. A stronger model applies the ambiguous rule more fluently, which can raise confidence without raising correctness.",
    distractors:{
      B:"Capability helps on genuinely hard judgements, but it cannot resolve an underspecified task.",
      C:"Codebase size is not the relevant variable; criteria clarity is.",
      D:"Cost is a practical constraint, not a reason the reasoning is technically wrong."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.2-a", domain:4, ts:"4.2", scenario:1, type:"single",
  stem:"Your review output format varies run to run despite detailed formatting instructions: sometimes bulleted, sometimes prose, sometimes missing the suggested fix. What is the most effective technique?",
  options:[
    {k:"A", text:"Add few-shot examples of the desired shape: location, issue, severity, suggested fix."},
    {k:"B", text:"Repeat the formatting instructions at both the start and the end of the prompt so they are more salient to the model."},
    {k:"C", text:"Increase `max_tokens` so the model has room to include every field."},
    {k:"D", text:"Instruct the model to double-check its formatting before responding."}
  ],
  correct:["A"],
  explain:{
    why:"Few-shot examples are the most effective technique for consistent formatting when detailed instructions alone are not landing. A worked example shows the shape unambiguously in a way a description of the shape does not.",
    distractors:{
      B:"Repetition raises salience slightly and does not fix the underlying gap between described and demonstrated format.",
      C:"Missing fields are not a length problem; the model is omitting them by choice, not truncation.",
      D:"Self-checking against the same ambiguous description reproduces the same variance."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.2-b", domain:4, ts:"4.2", scenario:1, type:"single",
  stem:"Your extraction system handles research papers well when citations are inline, but returns nulls when the paper uses a numbered bibliography, or embeds methodology details in prose. What addresses this?",
  options:[
    {k:"A", text:"Few-shot examples demonstrating correct extraction from documents with each of the varied structures."},
    {k:"B", text:"A preprocessing step that converts every document into one canonical structure before extraction."},
    {k:"C", text:"Making the affected fields required in the schema so the model cannot return null."},
    {k:"D", text:"Splitting each document into sections and extracting from each section independently."}
  ],
  correct:["A"],
  explain:{
    why:"Examples that span the structural variety teach the model to recognise the same information in different presentations, and generalise to structures you did not include.",
    distractors:{
      B:"Canonicalising arbitrary academic formats is a large and fragile engineering effort, and the converter faces the same recognition problem.",
      C:"Forcing a required field on information the model failed to locate pressures it to fabricate a value, turning a visible null into an invisible error.",
      D:"Section splitting helps with length, but the model still has to recognise a bibliography entry as a citation, which is the actual gap."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.2-c", domain:4, ts:"4.2", scenario:3, type:"single",
  stem:"How many few-shot examples does the guidance suggest for clarifying an ambiguous scenario, and what should they demonstrate?",
  options:[
    {k:"A", text:"Two to four examples, showing the reasoning for why one action was chosen over a plausible alternative."},
    {k:"B", text:"Ten to fifteen, to cover the full space of cases the model may encounter."},
    {k:"C", text:"One, since a single canonical example avoids introducing conflicting patterns."},
    {k:"D", text:"As many as the context window will allow, on the basis that additional examples always improve accuracy."}
  ],
  correct:["A"],
  explain:{
    why:"A small number of targeted examples is enough, and showing why one option was preferred over a plausible alternative is what teaches judgement rather than mere pattern matching.",
    distractors:{
      B:"Ten to fifteen consumes substantial context on every request with diminishing returns.",
      C:"One example cannot show a contrast, and contrast is what conveys where the boundary lies.",
      D:"Returns diminish quickly and the token cost is paid on every call."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.2-d", domain:4, ts:"4.2", scenario:1, type:"single",
  stem:"You want to reduce false positives without making the reviewer blind to novel variants of the same problem. Which use of few-shot examples fits?",
  options:[
    {k:"A", text:"Examples contrasting acceptable code patterns with genuine issues."},
    {k:"B", text:"An enumerated list of every specific pattern that should never be flagged."},
    {k:"C", text:"Examples showing only genuine issues, so that the model learns what a real defect looks like in practice."},
    {k:"D", text:"Examples of the output format, so findings are at least consistently presented."}
  ],
  correct:["A"],
  explain:{
    why:"Contrastive examples teach the boundary rather than a list of instances, which is what lets the model generalise judgement to patterns you never enumerated.",
    distractors:{
      B:"An exhaustive denylist is impossible to maintain and fails on the first variant not on the list.",
      C:"Positive-only examples leave the model without a sense of what is acceptable, which is where false positives come from.",
      D:"Format examples improve presentation, not the accuracy of what is reported."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.2-e", domain:4, ts:"4.2", scenario:1, type:"single",
  stem:"Your support agent handles clear requests well but is erratic on ambiguous ones, such as a customer who mentions both a return and a warranty question without specifying which they want resolved. What is the most effective intervention?",
  options:[
    {k:"A", text:"Few-shot examples of ambiguous requests showing which action was chosen, and why."},
    {k:"B", text:"An instruction to always ask a clarifying question when a request is ambiguous."},
    {k:"C", text:"A larger tool set, so that the agent has a distinct option available for every possible interpretation of the request."},
    {k:"D", text:"A rule to always handle the first-mentioned issue and ignore the rest."}
  ],
  correct:["A"],
  explain:{
    why:"Ambiguous-case handling is exactly what few-shot examples convey well. Showing the reasoning behind choosing one action over another teaches a judgement the model can transfer to ambiguous cases you did not anticipate.",
    distractors:{
      B:"Always asking turns every ambiguous message into an extra round trip, which harms first-contact resolution when the right action was inferable.",
      C:"More tools worsens selection reliability and does nothing about interpreting the request.",
      D:"A positional rule ignores the customer's actual priority and drops legitimate concerns."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.2-f", domain:4, ts:"4.2", scenario:2, type:"single",
  stem:"Your reviewer reports whole-file coverage gaps but misses branch-level ones, such as an untested error path inside a tested function. What helps most?",
  options:[
    {k:"A", text:"Few-shot examples identifying branch-level gaps inside otherwise covered functions."},
    {k:"B", text:"An instruction to analyse test coverage at branch granularity rather than at whole-file granularity."},
    {k:"C", text:"Feeding the coverage report percentages into the prompt alongside the source."},
    {k:"D", text:"Running the analysis once per function rather than once per file."}
  ],
  correct:["A"],
  explain:{
    why:"This is a judgement about what counts as a gap, and examples showing a covered function with an untested error branch communicate that far more effectively than an abstract instruction about granularity.",
    distractors:{
      B:"The instruction names the granularity but not what a branch gap looks like in practice, which is the recognition problem.",
      C:"Coverage percentages tell you a number is below target without identifying which branch is untested or whether it matters.",
      D:"Per-function analysis narrows the scope but the model still needs to recognise the untested branch within it."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.3-a", domain:4, ts:"4.3", scenario:2, type:"single",
  stem:"Your extraction pipeline parses JSON out of the model's text responses and roughly 4% of responses fail to parse due to trailing commas, unescaped quotes or markdown fences. What eliminates this class of failure?",
  options:[
    {k:"A", text:"Define the extraction contract as a tool with a JSON schema, then read the data from the `tool_use` response."},
    {k:"B", text:"Add an instruction to return only raw JSON with no markdown formatting."},
    {k:"C", text:"Add a repair step that fixes common JSON syntax errors before parsing."},
    {k:"D", text:"Lower the sampling temperature to 0 so that the JSON structure is emitted deterministically every time."}
  ],
  correct:["A"],
  explain:{
    why:"Tool use with a JSON schema is the reliable route to guaranteed schema-compliant structured output. The model fills a defined structure rather than typing JSON as prose, so syntax errors disappear entirely.",
    distractors:{
      B:"Instructions reduce the rate but leave a residual, which is exactly the 4% you are trying to remove.",
      C:"A repair step is a fragile patch, and some malformations are ambiguous to repair correctly.",
      D:"Temperature 0 does not guarantee well-formed JSON; the model can deterministically produce a malformed string."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d4-4.3-b", domain:4, ts:"4.3", scenario:2, type:"single",
  stem:"After moving to tool use with a strict JSON schema, you still see invoices where the line items do not sum to the stated total. What does this indicate?",
  options:[
    {k:"A", text:"Strict schemas eliminate syntax errors but not semantic ones, so arithmetic needs separate validation."},
    {k:"B", text:"The schema is not marked strict, so numeric constraints are not being enforced."},
    {k:"C", text:"The `total` field should be typed as a string so the model does not attempt arithmetic."},
    {k:"D", text:"Tool use is unsuitable for numeric extraction, and free-text output with downstream parsing should be used instead."}
  ],
  correct:["A"],
  explain:{
    why:"A schema constrains structure and types, not relationships between values. Every field can be a valid number while the arithmetic between them is wrong, so semantic validation is a separate layer.",
    distractors:{
      B:"JSON Schema has no facility for cross-field arithmetic constraints, strict or otherwise.",
      C:"Making the total a string removes type safety without doing anything about the arithmetic.",
      D:"Tool use is the right mechanism; it simply does not cover semantic validation, which nothing at the schema layer would."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d4-4.3-c", domain:4, ts:"4.3", scenario:2, type:"single",
  stem:"Roughly 15% of your source contracts genuinely do not state a renewal date, but the model always produces one, sometimes inventing plausible values. The field is marked required. What is the fix?",
  options:[
    {k:"A", text:"Make the field optional or nullable, so absence can be represented without fabrication."},
    {k:"B", text:"Add an instruction that the model must never guess a renewal date."},
    {k:"C", text:"Add a `renewal_date_confidence` field so downstream systems can filter low-confidence values."},
    {k:"D", text:"Post-process by checking each extracted date against the document text and discarding unmatched ones."}
  ],
  correct:["A"],
  explain:{
    why:"A required field creates pressure to produce something to satisfy the schema. Making it nullable gives the model a correct way to say the information is absent, which is what removes the incentive to invent.",
    distractors:{
      B:"The instruction conflicts with the schema requirement, and the schema constraint is the stronger force.",
      C:"A confidence field adds a signal without removing the fabricated value, and the confidence on an invented date is itself unreliable.",
      D:"Verification catches some fabrications, but it is work to compensate for a schema that should not have demanded the value."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d4-4.3-d", domain:4, ts:"4.3", scenario:2, type:"single",
  stem:"Your `document_type` enum has eight values. New document types keep appearing and the model forces them into the closest existing value, corrupting downstream routing. How should the schema change?",
  options:[
    {k:"A", text:"Add an `other` enum value paired with a free-text detail field describing the actual type."},
    {k:"B", text:"Remove the enum constraint and accept any string for `document_type`."},
    {k:"C", text:"Expand the enum to thirty values covering every type you can currently foresee."},
    {k:"D", text:"Add a second boolean field indicating whether the chosen enum value is a good fit."}
  ],
  correct:["A"],
  explain:{
    why:"The `other` plus detail-string pattern makes the category set extensible: unrecognised types are labelled honestly and the detail field captures what they actually are, which also tells you which values to promote to the enum next.",
    distractors:{
      B:"Free-form strings destroy the routing guarantees the enum provides and produce many spellings of the same type.",
      C:"Thirty values is still a closed set, so the same problem recurs with the thirty-first type, and the larger enum is harder to classify against.",
      D:"A fit flag records the problem without giving the model a correct way to express the real type."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d4-4.3-e", domain:4, ts:"4.3", scenario:2, type:"single",
  stem:"Source documents write dates as `03/04/2026`, `4 March 2026` and `2026-03-04`. Your schema specifies an ISO date string. Where should the normalisation rule live?",
  options:[
    {k:"A", text:"In the prompt, alongside the schema, stating how ambiguous formats should be read."},
    {k:"B", text:"In the JSON schema's `pattern` field, which will coerce non-conforming inputs into the required format."},
    {k:"C", text:"In a downstream service that reformats whatever string the model returns."},
    {k:"D", text:"Nowhere; a strict schema type of `date` handles format conversion automatically."}
  ],
  correct:["A"],
  explain:{
    why:"The schema constrains the output format but says nothing about how to interpret an ambiguous input such as `03/04/2026`. Format normalisation rules in the prompt tell the model which convention to assume, and the schema then enforces the shape.",
    distractors:{
      B:"`pattern` validates a string against a regular expression. It rejects non-conforming values; it does not coerce them.",
      C:"Downstream reformatting cannot resolve day-month ambiguity once the original context is gone.",
      D:"A date type constrains the format but does not resolve which of two readings of `03/04` was intended."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d4-4.3-f", domain:4, ts:"4.3", scenario:2, type:"single",
  stem:"Which schema design choice best handles a field where the source is genuinely ambiguous, as opposed to simply absent?",
  options:[
    {k:"A", text:"Include an `unclear` enum value so ambiguity can be reported distinctly from absence."},
    {k:"B", text:"Return null, since ambiguous and absent both mean no reliable value."},
    {k:"C", text:"Return the most likely interpretation, since a best guess is more useful than nothing."},
    {k:"D", text:"Return an array of all plausible interpretations for downstream systems to choose from."}
  ],
  correct:["A"],
  explain:{
    why:"Ambiguous and absent call for different handling: an ambiguous field has content a human reviewer can adjudicate, while an absent one does not. An explicit `unclear` value preserves that distinction for review routing.",
    distractors:{
      B:"Collapsing the two loses the signal that a human could resolve this one by reading the document.",
      C:"A silent best guess is exactly the fabrication risk that careful schema design is meant to avoid.",
      D:"An array complicates the contract, and downstream systems have less context than the extractor for choosing between the options."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d4-4.4-a", domain:4, ts:"4.4", scenario:2, type:"single",
  stem:"Pydantic validation rejects an extraction because a field arrived as a string where a number was expected. What is the most effective retry design?",
  options:[
    {k:"A", text:"Send a follow-up containing the original document, the failed extraction and the specific validation error."},
    {k:"B", text:"Retry the original request unchanged, since ordinary sampling variation may well produce a valid result."},
    {k:"C", text:"Retry with temperature raised, to explore a different output path."},
    {k:"D", text:"Discard the document and flag it for manual extraction."}
  ],
  correct:["A"],
  explain:{
    why:"Retry with error feedback gives the model everything it needs to self-correct: the source, its own failed attempt, and precisely what was wrong. That converts a blind retry into a targeted correction.",
    distractors:{
      B:"An unchanged retry relies on luck and frequently reproduces the same error.",
      C:"Higher temperature increases variance, making a valid result no more likely and other fields less reliable.",
      D:"A format mismatch is exactly the category retry handles well, so escalating to a human immediately wastes the cheap fix."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d4-4.4-b", domain:4, ts:"4.4", scenario:2, type:"single",
  stem:"An extraction repeatedly fails validation because the `parent_company` field is empty. Investigation shows the source document never names a parent company; that information lives in a separate corporate registry. What should happen?",
  options:[
    {k:"A", text:"Stop retrying, because the information is absent from the source."},
    {k:"B", text:"Retry with a stronger instruction emphasising that `parent_company` is required."},
    {k:"C", text:"Retry with the full document re-sent, in case the earlier request was truncated."},
    {k:"D", text:"Retry with an example showing a correctly extracted parent company from a different document."}
  ],
  correct:["A"],
  explain:{
    why:"Retry is effective for format and structural errors, and ineffective when the information simply is not in the source. Recognising which category you are in is what prevents burning cost on requests that cannot succeed.",
    distractors:{
      B:"Emphasising a requirement the document cannot satisfy pressures the model to invent a parent company, which is worse than the empty field.",
      C:"Re-sending is worth one attempt if truncation is plausible, but the investigation already established the information is not there.",
      D:"An example from another document teaches the format, not this document's missing content."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d4-4.4-c", domain:4, ts:"4.4", scenario:2, type:"single",
  stem:"You want extraction output to make arithmetic inconsistencies visible without a separate validation service. What schema design accomplishes this?",
  options:[
    {k:"A", text:"Extract `calculated_total` alongside `stated_total` so discrepancies are observable."},
    {k:"B", text:"Extract only `stated_total` and trust the document's own arithmetic."},
    {k:"C", text:"Extract only the line items and compute the total in downstream code."},
    {k:"D", text:"Add a `math_is_correct` boolean that the model sets after checking its own arithmetic on the extracted values."}
  ],
  correct:["A"],
  explain:{
    why:"Capturing both the document's stated figure and the figure implied by the line items makes the inconsistency a comparison of two extracted fields, which is trivially checkable and also flags errors in the source document itself.",
    distractors:{
      B:"Source documents contain arithmetic errors, and trusting the stated total means propagating them silently.",
      C:"Computing downstream is reasonable, but discards the document's own stated total, which is precisely the value you need to compare against.",
      D:"A self-assessed boolean is an unverified claim about arithmetic rather than the two numbers you can check yourself."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d4-4.4-d", domain:4, ts:"4.4", scenario:2, type:"single",
  stem:"Developers dismiss many findings but you cannot tell which code constructs trigger the bad ones. What addition to the structured finding output enables systematic analysis?",
  options:[
    {k:"A", text:"A `detected_pattern` field naming the trigger."},
    {k:"B", text:"A free-text `notes` field where the model explains its reasoning."},
    {k:"C", text:"A timestamp so dismissals can be correlated with deployment dates."},
    {k:"D", text:"A `severity` field so dismissals can be grouped by severity level."}
  ],
  correct:["A"],
  explain:{
    why:"Recording which construct triggered each finding turns dismissal data into an analysable signal: you can group dismissals by pattern and see that, say, findings triggered by a particular idiom are dismissed 80% of the time, then fix that specific criterion.",
    distractors:{
      B:"Free-text reasoning cannot be aggregated across thousands of findings without heavy processing.",
      C:"Timestamps support trend analysis over time but not attribution to code constructs.",
      D:"Severity is already known and does not identify what in the code produced the finding."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d4-4.4-e", domain:4, ts:"4.4", scenario:3, type:"single",
  stem:"A source document states two different values for the same figure in different sections. What extraction design surfaces this rather than hiding it?",
  options:[
    {k:"A", text:"Add a `conflict_detected` boolean plus fields capturing both values."},
    {k:"B", text:"Extract whichever value appears later in the document, on the basis that it is most likely a correction."},
    {k:"C", text:"Extract whichever value appears more often in the document."},
    {k:"D", text:"Return a validation error and route the whole document to manual extraction."}
  ],
  correct:["A"],
  explain:{
    why:"An explicit conflict flag with both values preserves the fact that the source itself disagrees, and lets a reviewer adjudicate with full information rather than silently inheriting a guess.",
    distractors:{
      B:"Position is not evidence of correctness; a later mention can equally be a typo.",
      C:"Frequency is not evidence either, and a repeated error is still an error.",
      D:"Failing the entire document discards every correctly extracted field over one conflicted value."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d4-4.4-f", domain:4, ts:"4.4", scenario:3, type:"multi",
  stem:"Which two validation failures are likely to be resolved by a retry with error feedback? (Select 2.)",
  options:[
    {k:"A", text:"A numeric field returned as a formatted string such as `\"1,240.00\"` instead of a number."},
    {k:"B", text:"A nested object returned as a flat set of top-level keys."},
    {k:"C", text:"A required field whose value appears only in a document you did not supply."},
    {k:"D", text:"A field the source document genuinely leaves blank."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both are format and structure problems. The information is present and correct; only its representation is wrong, and telling the model precisely what the validator objected to lets it re-emit the same data in the right shape.",
    distractors:{
      C:"The information is not in the model's context at all. No number of retries will produce it; supplying the other document would.",
      D:"There is nothing to extract. The correct response is a null, which means the schema should permit one."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d4-4.5-a", domain:4, ts:"4.5", scenario:3, type:"single",
  stem:"Two workflows currently use real-time calls: a blocking pre-merge check developers wait on, and an overnight technical debt report reviewed the next morning. Your manager proposes switching both to the Message Batches API for its 50% saving. How should you evaluate this?",
  options:[
    {k:"A", text:"Use batch for the technical debt reports only; keep real-time for the pre-merge checks."},
    {k:"B", text:"Switch both to batch processing with status polling to check for completion."},
    {k:"C", text:"Keep real-time calls for both, to avoid batch result ordering issues."},
    {k:"D", text:"Switch both workflows to batch, with a timeout fallback to real-time whenever a batch takes too long."}
  ],
  correct:["A"],
  explain:{
    why:"Batch offers 50% savings with a processing window of up to 24 hours and no latency SLA. That is ideal for an overnight report and unacceptable for a check a developer is blocked on. Match each API to its workload.",
    distractors:{
      B:"Polling does not change the underlying latency guarantee. A developer could still wait hours for a merge check.",
      C:"This reflects a misconception: batch results are correlated with `custom_id`, so ordering is not a problem.",
      D:"A dual-path implementation with fallback is significant extra complexity when simply matching each API to its use case is simpler and better."
    }
  },
  refs:[{label:"API: Batch processing", url:"https://platform.claude.com/docs/en/build-with-claude/batch-processing"}] },

{ id:"d4-4.5-b", domain:4, ts:"4.5", scenario:3, type:"single",
  stem:"You must guarantee results within 30 hours of a document arriving, using the batch API whose worst case is 24 hours. What submission cadence achieves this?",
  options:[
    {k:"A", text:"Submit every 4 hours, so worst-case wait plus worst-case processing stays within 28 hours."},
    {k:"B", text:"Submit once daily, since 24 hours of processing fits inside the 30-hour SLA."},
    {k:"C", text:"Submit every 30 hours, matching the SLA period exactly."},
    {k:"D", text:"Submit continuously as documents arrive, which makes cadence irrelevant to the SLA."}
  ],
  correct:["A"],
  explain:{
    why:"Total latency is queue wait plus processing. A 4-hour cadence means a document waits at most 4 hours before submission, and 24 hours of processing gives a 28-hour worst case inside the 30-hour SLA.",
    distractors:{
      B:"A daily cadence means a document arriving just after submission waits nearly 24 hours, then up to 24 more processing, for a 48-hour worst case.",
      C:"A 30-hour cadence blows the SLA before processing even begins.",
      D:"Continuous submission of single-document batches forfeits the batching efficiency and is not what the batch API is designed for."
    }
  },
  refs:[{label:"API: Batch processing", url:"https://platform.claude.com/docs/en/build-with-claude/batch-processing"}] },

{ id:"d4-4.5-c", domain:4, ts:"4.5", scenario:3, type:"single",
  stem:"Of 100 documents in a batch, 6 failed because they exceeded the context limit. What is the correct recovery?",
  options:[
    {k:"A", text:"Resubmit only those 6, identified by `custom_id`, after chunking them to fit."},
    {k:"B", text:"Resubmit the entire batch of 100 with chunking applied to every document."},
    {k:"C", text:"Process the 6 through the real-time API instead, since batch cannot handle large documents."},
    {k:"D", text:"Discard the 6 and report 94% coverage, since oversized documents are rare."}
  ],
  correct:["A"],
  explain:{
    why:"`custom_id` correlates each request with its response, so you can identify exactly which failed and resubmit only those, with the modification their failure calls for.",
    distractors:{
      B:"Reprocessing 94 successful documents doubles their cost for no benefit, and chunking documents that did not need it may degrade their extractions.",
      C:"The batch API is not the constraint; the context limit applies to the real-time API too, so the same documents would fail there.",
      D:"Silently dropping 6% of the corpus is a data quality failure, and chunking is a straightforward fix."
    }
  },
  refs:[{label:"API: Batch processing", url:"https://platform.claude.com/docs/en/build-with-claude/batch-processing"}] },

{ id:"d4-4.5-d", domain:4, ts:"4.5", scenario:3, type:"single",
  stem:"Your extraction workflow calls a lookup tool mid-request to enrich each document, then continues. Can this move to the batch API as-is?",
  options:[
    {k:"A", text:"No, because the batch API does not support multi-turn tool calling within a single request."},
    {k:"B", text:"Yes, provided each tool is declared in the batch request's tools array."},
    {k:"C", text:"Yes, provided the tools respond within the 24-hour processing window."},
    {k:"D", text:"No, because the batch API does not support tool definitions of any kind within a request."}
  ],
  correct:["A"],
  explain:{
    why:"Batch cannot execute tools mid-request and feed results back for another turn. A workflow that depends on that loop must be restructured, for instance by doing the enrichment before submission.",
    distractors:{
      B:"Declaring tools does not enable the multi-turn execution loop the workflow depends on.",
      C:"The limitation is structural rather than a matter of timing within the window.",
      D:"This overstates it. The specific limitation is multi-turn tool calling within one request, not the presence of tool definitions."
    }
  },
  refs:[{label:"API: Batch processing", url:"https://platform.claude.com/docs/en/build-with-claude/batch-processing"}] },

{ id:"d4-4.5-e", domain:4, ts:"4.5", scenario:3, type:"single",
  stem:"You are about to batch-process 50,000 documents with a newly written extraction prompt. What should you do first?",
  options:[
    {k:"A", text:"Refine the prompt on a small sample before committing the full volume."},
    {k:"B", text:"Submit all 50,000 immediately, since failures can be resubmitted by `custom_id` anyway."},
    {k:"C", text:"Split into 500 batches of 100 so failures are contained to small groups."},
    {k:"D", text:"Run the whole corpus through the real-time API first, to validate the prompt at full production scale."}
  ],
  correct:["A"],
  explain:{
    why:"Prompt refinement on a sample maximises first-pass success across the full volume. A systematic prompt flaw discovered after 50,000 documents means paying for the whole corpus twice.",
    distractors:{
      B:"Resubmission is available, but a systematic flaw fails most of the corpus, so you pay for it twice and wait through two processing windows.",
      C:"Smaller batches limit blast radius slightly but a systematic prompt problem affects all of them equally.",
      D:"Running everything through the real-time API discards the 50% saving entirely and is the most expensive option available."
    }
  },
  refs:[{label:"API: Batch processing", url:"https://platform.claude.com/docs/en/build-with-claude/batch-processing"}] },

{ id:"d4-4.5-f", domain:4, ts:"4.5", scenario:3, type:"single",
  stem:"What is the role of `custom_id` in the Message Batches API?",
  options:[
    {k:"A", text:"It correlates each request with its corresponding response, and must be unique within the batch."},
    {k:"B", text:"It sets the processing priority of a request within the batch queue."},
    {k:"C", text:"It groups related requests together so that they are processed on the same worker in one pass."},
    {k:"D", text:"It identifies the billing account each request should be charged against."}
  ],
  correct:["A"],
  explain:{
    why:"Batch results are not guaranteed to come back in submission order, so `custom_id` is how you match each response to the request that produced it, and how you identify which items failed.",
    distractors:{
      B:"There is no per-request priority mechanism in a batch.",
      C:"It does not control scheduling or worker assignment.",
      D:"Billing is at the account level, not per request identifier."
    }
  },
  refs:[{label:"API: Batch processing", url:"https://platform.claude.com/docs/en/build-with-claude/batch-processing"}] },

{ id:"d4-4.6-a", domain:4, ts:"4.6", scenario:3, type:"single",
  stem:"You add 'now review your work carefully for bugs' to the end of your code generation prompt. It catches very little. Why?",
  options:[
    {k:"A", text:"The session retains the reasoning that produced the code; an independent instance is needed."},
    {k:"B", text:"Review instructions placed at the end of a prompt receive less attention than those at the start."},
    {k:"C", text:"The model cannot analyse code that it generated within the same response, because that content is not yet available in its context."},
    {k:"D", text:"Self-review requires extended thinking to be enabled, without which it is superficial."}
  ],
  correct:["A"],
  explain:{
    why:"Every decision in the generated code was made for a reason the session still holds. Reviewing from inside that frame means the justifications are re-accepted rather than re-examined. A fresh instance sees only the code.",
    distractors:{
      B:"Position effects are real for very long inputs, but the limitation here persists even in a short prompt.",
      C:"The generated code is in context and can be analysed. Availability is not the problem.",
      D:"Extended thinking improves reasoning depth but does not remove the bias toward one's own prior conclusions."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.6-b", domain:4, ts:"4.6", scenario:4, type:"single",
  stem:"You want reviewer output that supports routing some findings straight to developers and others to a senior engineer. What review architecture supports this?",
  options:[
    {k:"A", text:"A verification pass where the model self-reports confidence alongside each finding."},
    {k:"B", text:"Two full review passes, routing any finding that appears in both directly to developers."},
    {k:"C", text:"Routing by severity alone, since severity already reflects how certain the finding is."},
    {k:"D", text:"Routing by file, sending any change in a critical module to the senior engineer regardless of what the finding actually says."}
  ],
  correct:["A"],
  explain:{
    why:"A verification pass that attaches confidence to each finding gives a per-finding signal for routing. Note this is routing attention, not filtering: low-confidence findings go to a more experienced reviewer rather than being discarded.",
    distractors:{
      B:"Agreement between passes is a coarse binary signal and, used as a filter, suppresses genuine issues caught intermittently.",
      C:"Severity is about impact if real; confidence is about whether it is real. A high-severity finding can be highly uncertain.",
      D:"File-based routing ignores the findings themselves, so a trivial issue in a critical module still consumes senior time."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.6-c", domain:4, ts:"4.6", scenario:4, type:"single",
  stem:"Which review structure best catches a bug where one file's function signature changed and callers in other files were not updated?",
  options:[
    {k:"A", text:"An integration pass dedicated to cross-file data flow, run in addition to per-file passes."},
    {k:"B", text:"A per-file pass with instructions to consider how each function might be used elsewhere."},
    {k:"C", text:"A single pass over all files together, so every relationship is visible at once."},
    {k:"D", text:"Three independent passes over the changed file, to maximise the chance of noticing the signature change."}
  ],
  correct:["A"],
  explain:{
    why:"This defect exists only in the relationship between files, so a pass whose explicit job is cross-file consistency is what surfaces it. Per-file passes handle local issues; the integration pass handles the seams.",
    distractors:{
      B:"Speculating about possible usage is not the same as checking actual call sites in other files, which the per-file pass cannot see.",
      C:"A single combined pass is what produced the attention dilution and inconsistent depth in the first place.",
      D:"Repeated passes over the changed file still never look at the callers, which is where the breakage is."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.6-d", domain:4, ts:"4.6", scenario:4, type:"single",
  stem:"What distinguishes an independent review instance from a self-review instruction, in practical terms?",
  options:[
    {k:"A", text:"The independent instance has no prior reasoning context, so it evaluates on the merits."},
    {k:"B", text:"The independent instance runs with different sampling parameters, producing more varied analysis."},
    {k:"C", text:"The independent instance is given access to the full repository, whereas the generating session only ever sees the files it touched."},
    {k:"D", text:"The independent instance is not subject to context window limits during review."}
  ],
  correct:["A"],
  explain:{
    why:"The difference is what is absent. Without the chain of reasoning that produced each decision, there is nothing to defend, so questionable choices are evaluated rather than assumed settled.",
    distractors:{
      B:"Sampling parameters are configurable in both cases and are not the operative distinction.",
      C:"Repository access is a configuration choice, not an inherent property of an independent instance.",
      D:"Both are subject to the same context limits."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.6-e", domain:4, ts:"4.6", scenario:4, type:"single",
  stem:"A team proposes running three independent review passes and reporting only findings that appear in at least two. What is the flaw?",
  options:[
    {k:"A", text:"It suppresses genuine bugs that are only caught intermittently."},
    {k:"B", text:"Three passes triple the cost, which outweighs any accuracy gain."},
    {k:"C", text:"Independent passes cannot be compared because their output formats differ."},
    {k:"D", text:"Consensus filtering only works reliably with an odd number of review passes greater than five."}
  ],
  correct:["A"],
  explain:{
    why:"Consensus voting is a precision technique that costs recall, and the recall it costs is concentrated exactly where you least want to lose it: subtle bugs that a given pass may or may not notice, which by construction fail the two-of-three test.",
    distractors:{
      B:"Cost is a real consideration but secondary to the fact that the method discards true positives.",
      C:"Output format is easily standardised and is not the objection.",
      D:"This is invented; there is no such rule about pass counts."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d4-4.6-f", domain:4, ts:"4.6", scenario:4, type:"single",
  stem:"Per-file review passes handle local issues well. What is the correct complement for a complete multi-pass architecture?",
  options:[
    {k:"A", text:"A separate integration pass examining cross-file data flow and interface consistency."},
    {k:"B", text:"A second per-file pass at higher scrutiny for files with the most changes."},
    {k:"C", text:"A summary pass that consolidates the per-file findings into a single report."},
    {k:"D", text:"A performance pass measuring the runtime characteristics of the changed code."}
  ],
  correct:["A"],
  explain:{
    why:"Per-file passes are structurally blind to anything spanning files. The integration pass exists to cover exactly that gap, which completes the architecture.",
    distractors:{
      B:"More scrutiny on individual files deepens local coverage but still never crosses a file boundary.",
      C:"Consolidation is presentation. It finds nothing that the passes did not already find.",
      D:"Performance analysis is a useful separate concern, but it does not address the cross-file correctness gap."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },
