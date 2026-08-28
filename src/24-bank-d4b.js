
/* ---- Domain 4 expansion: task statements 4.1, 4.2 and 4.3 ---- */

{ id:"d4-4.1-g", domain:4, ts:"4.1", scenario:4, type:"single",
  stem:"A reviewer flags 'possible race condition' on any code touching shared state, and 90% are dismissed. Which instruction change is most likely to help?",
  options:[
    {k:"A", text:"Require an interleaving that produces the fault."},
    {k:"B", text:"Ask it to flag races only when confident."},
    {k:"C", text:"Ask it to consider whether locking is present before flagging."},
    {k:"D", text:"Reduce the number of race findings per review to three."}
  ],
  correct:["A"],
  explain:{
    why:"Demanding a concrete failing interleaving turns a vague suspicion into a testable claim, which excludes the shared-state code that is in fact correctly synchronised.",
    distractors:{
      C:"Checking for locking is a step in the right direction, but it still leaves the model judging sufficiency rather than demonstrating a fault.",
      B:"Confidence language is not anchored to anything and does not reliably shift behaviour.",
      D:"A cap hides findings without improving which ones survive."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.1-h", domain:4, ts:"4.1", scenario:4, type:"single",
  stem:"Two categories perform very differently: security findings are 92% accepted, style findings 20%. What is the most sensible immediate action?",
  options:[
    {k:"A", text:"Turn off style findings while their criteria are rewritten."},
    {k:"B", text:"Apply a single higher threshold across both categories."},
    {k:"C", text:"Present both but sort security findings first."},
    {k:"D", text:"Accept the mix, since the average is acceptable."}
  ],
  correct:["A"],
  explain:{
    why:"A category dismissed four times out of five is training developers to skim past everything the tool says. Removing it protects the credibility of the category that works.",
    distractors:{
      B:"A shared threshold suppresses accurate security findings to fix a problem confined to style.",
      C:"Ordering helps readability while the noise is still present and still corrosive.",
      D:"Averaging conceals that one category is actively damaging trust in the other."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.1-i", domain:4, ts:"4.1", scenario:4, type:"single",
  stem:"A team writes 'flag anything that could confuse a new developer'. Findings vary wildly between runs. What is the underlying problem?",
  options:[
    {k:"A", text:"The criterion rests on an imagined reader, not the code."},
    {k:"B", text:"The instruction is too short to be actionable."},
    {k:"C", text:"New developers are not a clearly defined role in this codebase."},
    {k:"D", text:"Confusion is subjective and so cannot be reviewed at all."}
  ],
  correct:["A"],
  explain:{
    why:"Anchoring on a hypothetical person makes the standard shift with whatever the model imagines about them. Observable properties of the code give a stable basis instead.",
    distractors:{
      D:"Readability is reviewable when expressed as concrete properties such as function length or naming consistency.",
      B:"Length is not the issue; a short but observable criterion would work fine.",
      C:"Defining the role more precisely still leaves the judgement resting on an imagined reader."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.1-j", domain:4, ts:"4.1", scenario:4, type:"single",
  stem:"Severity labels are inconsistent between runs on similar issues. What produces stable classification?",
  options:[
    {k:"A", text:"A concrete code example illustrating each level."},
    {k:"B", text:"Fewer severity levels."},
    {k:"C", text:"A request to explain each severity choice."},
    {k:"D", text:"Temperature set to zero."}
  ],
  correct:["A"],
  explain:{
    why:"Examples anchor each label to observable properties, so 'critical' stops being re-interpreted from scratch on every run.",
    distractors:{
      B:"Fewer levels narrows where disagreement can occur without defining the remaining boundary.",
      C:"Explanations improve transparency without supplying the missing definition.",
      D:"Determinism applies to identical inputs; different pull requests are not identical."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.1-k", domain:4, ts:"4.1", scenario:4, type:"single",
  stem:"An extraction validator flags 'unusual formatting' on a third of documents, nearly all correctly extracted. What should replace that criterion?",
  options:[
    {k:"A", text:"Named conditions that actually threaten extraction accuracy."},
    {k:"B", text:"A stricter definition of what counts as unusual."},
    {k:"C", text:"A confidence score with a threshold."},
    {k:"D", text:"Sampling one document in ten instead of all of them."}
  ],
  correct:["A"],
  explain:{
    why:"Unusual formatting is not itself a problem; extraction failure is. Naming the conditions that actually cause failure targets the flag at cases worth a human's time.",
    distractors:{
      B:"Tightening a definition of the wrong property still flags on the wrong property.",
      C:"A threshold on an uncalibrated score trades one arbitrary filter for another.",
      D:"Sampling reduces the volume of noise without improving what is flagged."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.1-l", domain:4, ts:"4.1", scenario:4, type:"single",
  stem:"Why does 'only report high-confidence findings' fail to reduce false positives?",
  options:[
    {k:"A", text:"Model confidence is poorly calibrated to correctness."},
    {k:"B", text:"The model cannot compute confidence at all."},
    {k:"C", text:"The instruction is ignored unless placed first."},
    {k:"D", text:"Confidence applies to whole responses rather than to individual findings."}
  ],
  correct:["A"],
  explain:{
    why:"A model can be entirely confident about a wrong finding, so filtering on confidence removes true positives roughly as readily as false ones.",
    distractors:{
      B:"It produces confidence judgements readily; they are simply unreliable as a filter.",
      C:"Position affects salience but is not why the approach fails.",
      D:"Per-finding confidence can be produced; the problem is what it is worth."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.1-m", domain:4, ts:"4.1", scenario:1, type:"single",
  stem:"A support quality checker flags responses as 'unhelpful' with poor agreement against human raters. What would improve alignment?",
  options:[
    {k:"A", text:"Define the observable failures that make a reply unhelpful."},
    {k:"B", text:"Have it rate helpfulness on a ten-point scale."},
    {k:"C", text:"Compare each reply against a model-written ideal answer for that case."},
    {k:"D", text:"Have it flag only replies shorter than a threshold."}
  ],
  correct:["A"],
  explain:{
    why:"Naming the failures, such as the customer's question going unanswered or a promised action being omitted, gives the checker the same standard the human raters are applying.",
    distractors:{
      C:"Comparison against a generated ideal is a real technique, but it measures divergence from one plausible answer rather than whether the reply served the customer.",
      B:"A finer scale on an undefined property adds precision without accuracy.",
      D:"Length is a weak proxy; a short accurate answer is often the best one."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.1-n", domain:4, ts:"4.1", scenario:4, type:"multi",
  stem:"Which two instructions are likely to genuinely improve precision? (Select 2.)",
  options:[
    {k:"A", text:"'Report a finding only when the code produces incorrect output for some input.'"},
    {k:"B", text:"'Do not report naming, formatting or import ordering.'"},
    {k:"C", text:"'Use your best judgement about what is worth raising.'"},
    {k:"D", text:"'Aim for a false positive rate below 10%.'"}
  ],
  correct:["A","B"],
  explain:{
    why:"Both are categorical and checkable against a given finding: one states the condition for reporting, the other names what to skip.",
    distractors:{
      C:"Delegating to judgement is what produced the inconsistency in the first place.",
      D:"The model cannot measure its own false positive rate, so the target is unactionable."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.1-o", domain:4, ts:"4.1", scenario:4, type:"single",
  stem:"After disabling a noisy category, developers begin engaging with the remaining findings again. What does this demonstrate?",
  options:[
    {k:"A", text:"Trust is shared across categories."},
    {k:"B", text:"Fewer findings are always better for developers."},
    {k:"C", text:"Developers prefer security findings to style findings."},
    {k:"D", text:"The remaining categories improved when the noisy one was removed."}
  ],
  correct:["A"],
  explain:{
    why:"Nothing about the accurate categories changed. What changed is that developers stopped filtering out the whole tool, which is why one noisy category is disproportionately costly.",
    distractors:{
      B:"Fewer accurate findings would be worse; volume is not the variable.",
      C:"Preference may exist but does not explain a change in engagement with unchanged categories.",
      D:"They were unchanged, which is precisely the point."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.1-p", domain:4, ts:"4.1", scenario:6, type:"single",
  stem:"Which criterion is most defensible for flagging an extracted field for review?",
  options:[
    {k:"A", text:"The source states two different values for it."},
    {k:"B", text:"The field is one the business considers important."},
    {k:"C", text:"The document is longer than average."},
    {k:"D", text:"The extraction took longer than usual."}
  ],
  correct:["A"],
  explain:{
    why:"An internal contradiction in the source is an observable condition that genuinely predicts an unreliable extraction, and a human can resolve it by reading.",
    distractors:{
      B:"Importance says what an error would cost, not whether one is likely, though it is reasonable as a secondary weighting.",
      C:"Length correlates weakly with difficulty and would flag many clean documents.",
      D:"Processing time reflects infrastructure rather than extraction quality."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.1-q", domain:4, ts:"4.1", scenario:5, type:"single",
  stem:"A team argues that a more capable model would fix their false positive rate. When is that reasoning sound?",
  options:[
    {k:"A", text:"When criteria are clear and judgements hard."},
    {k:"B", text:"Always, since capability dominates finding quality."},
    {k:"C", text:"Never, since the criteria are the only factor that matters."},
    {k:"D", text:"When the codebase is unusually large."}
  ],
  correct:["A"],
  explain:{
    why:"Capability helps where the task is well specified but difficult. It cannot help where the specification itself is ambiguous, because there is no fact of the matter to be more capable about.",
    distractors:{
      B:"A stronger model applies an unclear rule more fluently rather than more correctly.",
      C:"Too strong: with clear criteria, harder judgements genuinely do benefit from capability.",
      D:"Codebase size affects cost and context strategy rather than criterion clarity."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.1-r", domain:4, ts:"4.1", scenario:5, type:"single",
  stem:"A reviewer correctly identifies a real bug but describes it so vaguely that developers cannot act. Is this a precision problem?",
  options:[
    {k:"A", text:"No; it is actionability, not precision."},
    {k:"B", text:"Yes; vague findings count as false positives."},
    {k:"C", text:"No; it is a model capability problem instead."},
    {k:"D", text:"Yes; unclear findings are dismissed and so are false by outcome."}
  ],
  correct:["A"],
  explain:{
    why:"The finding is true, so precision is unaffected. What is missing is location, severity and a suggested fix, which is a specification of the output rather than of the criteria.",
    distractors:{
      D:"Dismissal rate conflates two different failures and would send you to fix criteria that are working.",
      B:"A true finding is not a false positive however it is worded.",
      C:"Capability is not the constraint when the required output shape was never stated."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.1-s", domain:4, ts:"4.1", scenario:1, type:"single",
  stem:"An escalation checker flags conversations as 'should have escalated' using its own judgement, disagreeing with supervisors half the time. What is the fix?",
  options:[
    {k:"A", text:"Encode the organisation's escalation triggers explicitly."},
    {k:"B", text:"Have supervisors review every flagged conversation."},
    {k:"C", text:"Raise the bar so it flags fewer conversations."},
    {k:"D", text:"Have the checker rate its own certainty."}
  ],
  correct:["A"],
  explain:{
    why:"Disagreement at chance level means the checker is applying a different standard. Writing down the organisation's actual triggers makes both parties judge the same thing.",
    distractors:{
      B:"Reviewing everything is the manual effort the checker was meant to reduce.",
      C:"A higher bar on the wrong criterion produces fewer, equally misaligned flags.",
      D:"Self-rated certainty about a wrong standard adds nothing."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.1-t", domain:4, ts:"4.1", scenario:5, type:"single",
  stem:"Which is the clearest example of an explicit review criterion?",
  options:[
    {k:"A", text:"'Flag when stated behaviour contradicts the code.'"},
    {k:"B", text:"'Flag comments that seem out of date.'"},
    {k:"C", text:"'Flag comments you would rewrite.'"},
    {k:"D", text:"'Flag comments that add little value.'"}
  ],
  correct:["A"],
  explain:{
    why:"It names a checkable relation between two things in front of the model, so any given comment either satisfies it or does not.",
    distractors:{
      B:"'Seems out of date' is an impression rather than a test, and stale phrasing is not the same as a contradiction.",
      C:"Rewriting preference varies with style and says nothing about correctness.",
      D:"Value is undefined and highly subjective."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.2-g", domain:4, ts:"4.2", scenario:6, type:"single",
  stem:"An extraction model handles clean invoices well but fails on scanned ones with headers in unusual positions. What is the most effective intervention?",
  options:[
    {k:"A", text:"Few-shot examples drawn from the awkward layouts."},
    {k:"B", text:"An instruction to expect varied layouts."},
    {k:"C", text:"A preprocessing step that normalises layout."},
    {k:"D", text:"A stricter schema requiring every field."}
  ],
  correct:["A"],
  explain:{
    why:"Examples of the actual failing layouts teach the model to recognise the same fields in different positions, and it generalises to layouts you did not include.",
    distractors:{
      C:"Layout normalisation can help but is substantial engineering, and the normaliser faces the same recognition problem.",
      B:"Being told layouts vary does not convey what the variants look like.",
      D:"Requiring every field pressures the model to invent values it cannot locate."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.2-h", domain:4, ts:"4.2", scenario:5, type:"single",
  stem:"How many few-shot examples does the guidance suggest for an ambiguous scenario, and what should they show?",
  options:[
    {k:"A", text:"Two to four, showing why one action beat another."},
    {k:"B", text:"One clear example, so that conflicting signals cannot arise."},
    {k:"C", text:"Ten or more, covering the full space."},
    {k:"D", text:"As many as context allows."}
  ],
  correct:["A"],
  explain:{
    why:"A small number is enough, and showing the reasoning for preferring one option over another is what teaches judgement rather than surface pattern matching.",
    distractors:{
      B:"One example cannot express a contrast, and contrast is what conveys the boundary.",
      C:"Ten costs context on every request for diminishing benefit.",
      D:"Filling the window with examples displaces the actual task."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.2-i", domain:4, ts:"4.2", scenario:5, type:"single",
  stem:"A reviewer flags a legitimate idiom the team uses deliberately. Which few-shot approach fixes this without blinding it to real issues?",
  options:[
    {k:"A", text:"Contrast the accepted idiom with a faulty variant."},
    {k:"B", text:"List the idiom as never to be flagged."},
    {k:"C", text:"Show three more examples of real bugs."},
    {k:"D", text:"Instruct it to trust existing code."}
  ],
  correct:["A"],
  explain:{
    why:"A contrastive pair teaches the distinction, so the model can still flag a superficially similar case that is actually broken. A bare exclusion could not.",
    distractors:{
      B:"An exclusion list suppresses the whole shape, including instances that are genuinely wrong.",
      C:"More positive examples sharpen what a bug looks like without addressing the acceptable case.",
      D:"Trusting existing code disables review of everything already committed."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.2-j", domain:4, ts:"4.2", scenario:1, type:"single",
  stem:"A support agent handles clear requests well but is erratic when a customer raises two issues with conflicting urgency. What helps most?",
  options:[
    {k:"A", text:"Examples showing which issue was taken first, and why."},
    {k:"B", text:"An instruction to always ask the customer which issue to address first."},
    {k:"C", text:"A rule to handle the first-mentioned issue."},
    {k:"D", text:"More tools so every interpretation is available."}
  ],
  correct:["A"],
  explain:{
    why:"Worked ambiguous cases with the reasoning attached transfer to ambiguous cases you did not anticipate, which a positional rule cannot.",
    distractors:{
      B:"Always asking adds a turn to every multi-issue contact and harms first-contact resolution.",
      C:"Order of mention has no relationship to urgency.",
      D:"More tools worsens selection and does nothing about interpreting the request."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.2-k", domain:4, ts:"4.2", scenario:6, type:"single",
  stem:"Extraction returns null for a field that is present but phrased unusually, such as 'due within thirty days of receipt'. What addresses this?",
  options:[
    {k:"A", text:"Examples showing that phrasing mapped to the field."},
    {k:"B", text:"Making the field required so null is impossible."},
    {k:"C", text:"A regular expression pre-pass extracting the value."},
    {k:"D", text:"An instruction to read the document carefully."}
  ],
  correct:["A"],
  explain:{
    why:"The model is not recognising a natural-language expression of the value. Showing the mapping teaches the recognition, and it generalises to related phrasings.",
    distractors:{
      C:"A regular expression handles the phrasings you enumerate and misses the rest, which is the same problem in a more brittle form.",
      B:"Forcing the field replaces a null with an invented value.",
      D:"Exhortation does not supply the missing recognition."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.2-l", domain:4, ts:"4.2", scenario:5, type:"single",
  stem:"When are few-shot examples the right tool rather than clearer instructions?",
  options:[
    {k:"A", text:"When good instructions still give inconsistency."},
    {k:"B", text:"When the task is simple and well specified."},
    {k:"C", text:"When token budget is the binding constraint."},
    {k:"D", text:"When the output has no fixed shape."}
  ],
  correct:["A"],
  explain:{
    why:"Persistent inconsistency despite good instructions is the signal that description has reached its limit and demonstration is needed.",
    distractors:{
      B:"A simple well-specified task rarely needs examples at all.",
      C:"Examples increase token cost, so a tight budget argues against them.",
      D:"With no fixed shape there is nothing for an example to demonstrate."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.2-m", domain:4, ts:"4.2", scenario:6, type:"single",
  stem:"An extraction prompt includes eight examples, all invoices from one supplier. Accuracy on that supplier is excellent and poor elsewhere. What went wrong?",
  options:[
    {k:"A", text:"They taught one layout rather than the task."},
    {k:"B", text:"Eight examples exceeds the useful number for one prompt."},
    {k:"C", text:"The examples should have appeared after the document."},
    {k:"D", text:"Invoices are unsuitable for few-shot prompting."}
  ],
  correct:["A"],
  explain:{
    why:"Examples define what the model generalises from. Eight instances of one layout describe that layout, so anything different falls outside what was demonstrated.",
    distractors:{
      B:"Eight is more than needed, but the decisive fault is that they were all alike.",
      C:"Position matters less than variety here.",
      D:"Invoices are a standard and successful few-shot target when the examples vary."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.2-n", domain:4, ts:"4.2", scenario:5, type:"single",
  stem:"Why can few-shot examples generalise where an enumerated rule list cannot?",
  options:[
    {k:"A", text:"They convey the distinction, not just instances."},
    {k:"B", text:"They are processed with higher weight than instructions."},
    {k:"C", text:"They bypass the model's ordinary instruction following."},
    {k:"D", text:"They are cached and reused across requests."}
  ],
  correct:["A"],
  explain:{
    why:"Well-chosen examples show the principle separating the cases, so novel instances on either side of that principle are handled correctly. A list only covers what it lists.",
    distractors:{
      B:"There is no weighting mechanism that privileges examples.",
      C:"Examples work through instruction following rather than around it.",
      D:"Caching affects cost rather than generalisation."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.2-o", domain:4, ts:"4.2", scenario:3, type:"single",
  stem:"A research synthesis agent formats findings inconsistently despite a detailed style guide in the prompt. What is the most effective addition?",
  options:[
    {k:"A", text:"One worked example of a formatted finding."},
    {k:"B", text:"A restatement of the style guide at the end."},
    {k:"C", text:"A request to follow the style guide exactly."},
    {k:"D", text:"A shorter style guide."}
  ],
  correct:["A"],
  explain:{
    why:"A worked instance shows the shape unambiguously, which is what a description of the shape has already failed to do.",
    distractors:{
      D:"A shorter guide may be clearer and is worth doing, but it is still description rather than demonstration.",
      B:"Repetition raises salience without closing the gap.",
      C:"'Exactly' does not resolve what the guide left open to interpretation."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.2-p", domain:4, ts:"4.2", scenario:6, type:"multi",
  stem:"Which two properties make a few-shot example set effective? (Select 2.)",
  options:[
    {k:"A", text:"Coverage of the structural variety the model will meet."},
    {k:"B", text:"Reasoning showing why the chosen handling was correct."},
    {k:"C", text:"All examples drawn from the most common case."},
    {k:"D", text:"Examples longer than the inputs they illustrate."}
  ],
  correct:["A","B"],
  explain:{
    why:"Variety defines the space the model generalises over, and visible reasoning conveys the principle rather than a surface pattern.",
    distractors:{
      C:"Concentrating on the common case is what produces good performance there and poor performance everywhere else.",
      D:"Length is irrelevant, and very long examples crowd out the actual input."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.2-q", domain:4, ts:"4.2", scenario:5, type:"single",
  stem:"A reviewer misses test-coverage gaps inside functions that have some tests. What kind of example would help?",
  options:[
    {k:"A", text:"A tested function with one untested branch."},
    {k:"B", text:"A wholly untested function, marked as a gap."},
    {k:"C", text:"A fully tested function, marked as acceptable."},
    {k:"D", text:"A coverage report showing the branch percentage."}
  ],
  correct:["A"],
  explain:{
    why:"The missed case is precisely a partly-tested function, so the example has to show that shape being treated as a gap.",
    distractors:{
      B:"Wholly untested functions are already being caught, so this reinforces what works.",
      C:"An acceptable example is useful for contrast but does not demonstrate the missed case.",
      D:"A percentage says coverage is incomplete without identifying which branch."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.2-r", domain:4, ts:"4.2", scenario:1, type:"single",
  stem:"An engineer proposes replacing all escalation criteria with twenty few-shot examples. What is the objection?",
  options:[
    {k:"A", text:"Examples illustrate criteria; they do not replace them."},
    {k:"B", text:"Twenty examples exceed the model's example limit."},
    {k:"C", text:"Examples cannot express escalation decisions."},
    {k:"D", text:"Criteria and examples cannot appear in the same prompt."}
  ],
  correct:["A"],
  explain:{
    why:"Stated criteria give the general rule; examples calibrate it on the hard cases. Removing the rule leaves the model inferring policy from instances, and it may infer the wrong one.",
    distractors:{
      B:"There is no fixed limit, though twenty is expensive on every request.",
      C:"Examples express escalation decisions well, which is why they belong alongside criteria.",
      D:"The two are routinely and effectively combined."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.2-s", domain:4, ts:"4.2", scenario:6, type:"single",
  stem:"Which example set best supports extraction from documents with varied citation styles?",
  options:[
    {k:"A", text:"One inline-citation and one bibliography document."},
    {k:"B", text:"Four inline-citation documents."},
    {k:"C", text:"One document with no citations at all."},
    {k:"D", text:"A description of both citation styles."}
  ],
  correct:["A"],
  explain:{
    why:"Two examples spanning the structural variety teach that the same information appears in different forms, which is the generalisation required.",
    distractors:{
      B:"Four of one style teaches that style thoroughly and the other not at all.",
      C:"A document with no citations demonstrates neither style.",
      D:"Description is what has already proved insufficient."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.2-t", domain:4, ts:"4.2", scenario:5, type:"single",
  stem:"A prompt contains examples that conflict with its written instructions. Which tends to win?",
  options:[
    {k:"A", text:"The examples, so conflicts must be removed."},
    {k:"B", text:"The instructions, since they are stated as rules."},
    {k:"C", text:"Whichever appears later in the prompt."},
    {k:"D", text:"Neither; the model refuses to proceed."}
  ],
  correct:["A"],
  explain:{
    why:"Demonstrated behaviour is a strong signal, so examples that contradict the instructions tend to be followed. The practical lesson is to keep them consistent.",
    distractors:{
      B:"Stating something as a rule does not outweigh showing the opposite being done.",
      C:"Position has some effect but does not reliably decide the conflict.",
      D:"The model proceeds and produces something, which is what makes the conflict dangerous."
    }
  },
  refs:[R_PROMPT] },

{ id:"d4-4.3-g", domain:4, ts:"4.3", scenario:6, type:"single",
  stem:"Extraction JSON parsed from text fails roughly 4% of the time on trailing commas and markdown fences. What removes this class of failure?",
  options:[
    {k:"A", text:"Define the contract as a tool with a JSON schema."},
    {k:"B", text:"Instruct the model to emit raw JSON only."},
    {k:"C", text:"Add a repair pass for common syntax errors."},
    {k:"D", text:"Set temperature to zero."}
  ],
  correct:["A"],
  explain:{
    why:"Filling a defined structure removes the possibility of malformed output entirely, rather than reducing how often it occurs.",
    distractors:{
      C:"A repair pass fixes the common cases and leaves ambiguous malformations, so a residual remains.",
      B:"Instructions lower the rate without eliminating it, which is the 4% you are trying to remove.",
      D:"Determinism does not imply well-formedness; the model can deterministically emit a fenced block."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.3-h", domain:4, ts:"4.3", scenario:6, type:"single",
  stem:"After moving to schema-constrained tool use, line items still fail to sum to the stated total. What does this show?",
  options:[
    {k:"A", text:"Schemas constrain structure, not relationships."},
    {k:"B", text:"The schema is not marked strict."},
    {k:"C", text:"Numeric fields should be strings."},
    {k:"D", text:"Tool use is unsuitable for numeric extraction of any kind."}
  ],
  correct:["A"],
  explain:{
    why:"Every field can be a valid number while the arithmetic between them is wrong. Cross-field consistency is a semantic property that no schema expresses.",
    distractors:{
      B:"Strictness governs conformance to declared types, not arithmetic between fields.",
      C:"Making numbers strings removes type safety and changes nothing about the sum.",
      D:"Tool use is the right mechanism; it simply does not cover semantics."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.3-i", domain:4, ts:"4.3", scenario:6, type:"single",
  stem:"A required `termination_date` is invented for contracts that are open-ended. What is the fix?",
  options:[
    {k:"A", text:"Make the field nullable so absence is expressible."},
    {k:"B", text:"Instruct the model never to guess dates."},
    {k:"C", text:"Add a confidence score for the field."},
    {k:"D", text:"Verify each extracted date against the document text afterwards."}
  ],
  correct:["A"],
  explain:{
    why:"A required field creates pressure to supply something. Allowing null gives the model a correct way to say the contract has no termination date.",
    distractors:{
      B:"The instruction contradicts the schema requirement, and the schema is the stronger constraint.",
      C:"A confidence score annotates the invented value without removing it.",
      D:"Verification catches some fabrications after paying to produce them."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.3-j", domain:4, ts:"4.3", scenario:6, type:"single",
  stem:"New document categories keep appearing and are forced into the nearest existing enum value, corrupting routing. What schema change helps?",
  options:[
    {k:"A", text:"An `other` value plus a free-text detail field."},
    {k:"B", text:"Removing the enum and accepting any string."},
    {k:"C", text:"Expanding the enum to thirty foreseeable values."},
    {k:"D", text:"A boolean indicating whether the value fits well."}
  ],
  correct:["A"],
  explain:{
    why:"This keeps the closed set that routing depends on while giving unrecognised types an honest home, and the detail field tells you which values to promote next.",
    distractors:{
      C:"Thirty is still closed, so the thirty-first type recreates the problem.",
      B:"Free-form strings destroy the routing guarantee and produce many spellings of one type.",
      D:"A fit flag records the problem without providing a correct value."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.3-k", domain:4, ts:"4.3", scenario:6, type:"single",
  stem:"Where do rules for interpreting ambiguous source formats belong?",
  options:[
    {k:"A", text:"In the prompt, alongside the schema."},
    {k:"B", text:"In the schema's `pattern` field."},
    {k:"C", text:"In a downstream normalisation service."},
    {k:"D", text:"Nowhere; a typed field resolves it."}
  ],
  correct:["A"],
  explain:{
    why:"The schema constrains the output shape but says nothing about how to read an ambiguous input such as `03/04/2026`. That convention has to be stated where the model can apply it.",
    distractors:{
      B:"`pattern` validates a string against an expression; it does not resolve which reading was intended.",
      C:"Downstream normalisation cannot recover the ambiguity once the original context is gone.",
      D:"A date type constrains the format without deciding between two readings."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.3-l", domain:4, ts:"4.3", scenario:6, type:"single",
  stem:"Which `tool_choice` guarantees structured output when the document type is unknown?",
  options:[
    {k:"A", text:"`any`"},
    {k:"B", text:"`auto`"},
    {k:"C", text:"`none`"},
    {k:"D", text:"A forced named tool"}
  ],
  correct:["A"],
  explain:{
    why:"It requires a tool call while leaving the schema choice to the model, which is what an unknown document type needs.",
    distractors:{
      D:"Forcing one schema misclassifies every document of another type.",
      B:"`auto` permits a text reply, losing the guarantee.",
      C:"`none` forbids tools entirely."
    }
  },
  refs:[R_TOVR] },

{ id:"d4-4.3-m", domain:4, ts:"4.3", scenario:6, type:"single",
  stem:"How should a genuinely ambiguous field be distinguished from an absent one?",
  options:[
    {k:"A", text:"An `unclear` enum value, separate from null."},
    {k:"B", text:"Null for both, since neither is reliable."},
    {k:"C", text:"The most likely reading, with a note."},
    {k:"D", text:"An array of all plausible readings."}
  ],
  correct:["A"],
  explain:{
    why:"They need different handling: an ambiguous field has content a reviewer can adjudicate, an absent one does not. Keeping them distinct lets review routing work.",
    distractors:{
      B:"Collapsing them loses the signal that a human could resolve this case by reading.",
      C:"A silent best guess is the fabrication risk the schema design is meant to avoid.",
      D:"An array complicates the contract and pushes the decision downstream, where there is less context."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.3-n", domain:4, ts:"4.3", scenario:6, type:"single",
  stem:"A schema marks 18 of 20 fields required, and hallucinated values appear in roughly one document in six. What is the most likely relationship?",
  options:[
    {k:"A", text:"Required fields pressure the model to supply something."},
    {k:"B", text:"Twenty fields is beyond what one call can extract."},
    {k:"C", text:"Required fields are validated more loosely."},
    {k:"D", text:"The two are unrelated."}
  ],
  correct:["A"],
  explain:{
    why:"When a field must be present and the document does not contain it, producing a plausible value is the only way to satisfy the contract. Nullable fields remove that pressure.",
    distractors:{
      B:"Twenty fields is well within a single extraction's capability.",
      C:"Required fields are validated for presence and type like any other.",
      D:"The relationship is direct and is the standard explanation for this pattern."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.3-o", domain:4, ts:"4.3", scenario:6, type:"multi",
  stem:"Which two schema choices reduce fabricated values? (Select 2.)",
  options:[
    {k:"A", text:"Making fields nullable where the source may omit them."},
    {k:"B", text:"Providing an `unclear` value for ambiguous cases."},
    {k:"C", text:"Marking every field required for completeness."},
    {k:"D", text:"Removing enums so any value is acceptable."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both give the model a truthful way to represent what it found, which removes the incentive to invent something that satisfies the contract.",
    distractors:{
      C:"Universal requirement is the main driver of fabrication.",
      D:"Free-form values reduce validation errors while making bad data harder to detect."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.3-p", domain:4, ts:"4.3", scenario:5, type:"single",
  stem:"A CI job needs findings as structured objects rather than prose. Which approach is most reliable?",
  options:[
    {k:"A", text:"A tool whose schema defines the finding shape."},
    {k:"B", text:"A prompt describing the desired JSON shape in detail."},
    {k:"C", text:"A markdown template parsed afterwards."},
    {k:"D", text:"A regular expression applied over the model's prose response."}
  ],
  correct:["A"],
  explain:{
    why:"A schema makes the shape a contract the response must satisfy, so downstream parsing stops depending on how the model phrased things.",
    distractors:{
      B:"A description is followed most of the time, which leaves a residual the pipeline must handle.",
      C:"Templates are conventions rather than constraints and drift as wording changes.",
      D:"Regular expressions over prose are the fragility being removed."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.3-q", domain:4, ts:"4.3", scenario:6, type:"single",
  stem:"What does a strict JSON schema via tool use guarantee, and what does it not?",
  options:[
    {k:"A", text:"Shape and types, but not that the values are right."},
    {k:"B", text:"Both shape and semantic correctness."},
    {k:"C", text:"That every field was located in the right part of the document."},
    {k:"D", text:"Neither; schemas are advisory."}
  ],
  correct:["A"],
  explain:{
    why:"Conformance is structural. A correctly typed, correctly shaped record can still contain a value read from the wrong part of the document.",
    distractors:{
      B:"No schema can express whether a value was read correctly.",
      C:"Locating a value correctly is precisely what a schema cannot check; a field read from the wrong table still conforms.",
      D:"Schema conformance under tool use is enforced rather than advisory."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.3-r", domain:4, ts:"4.3", scenario:6, type:"single",
  stem:"Why extract `calculated_total` alongside `stated_total`?",
  options:[
    {k:"A", text:"A discrepancy between them becomes checkable."},
    {k:"B", text:"It doubles the chance that one of the values is correct."},
    {k:"C", text:"Schemas require a derived field for each stated one."},
    {k:"D", text:"It lets the model choose the more plausible value."}
  ],
  correct:["A"],
  explain:{
    why:"Capturing both the document's figure and the one implied by the line items turns a semantic check into a comparison of two extracted fields, and it also surfaces arithmetic errors in the source.",
    distractors:{
      B:"Two values do not improve the odds; the point is that disagreement is informative.",
      C:"No such schema requirement exists.",
      D:"The model should not silently pick; the discrepancy is the signal to preserve."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.3-s", domain:4, ts:"4.3", scenario:6, type:"single",
  stem:"A team wants one extraction call to also decide which downstream queue a document goes to. What is the cleanest schema approach?",
  options:[
    {k:"A", text:"A routing field with a closed enum plus an `other` escape."},
    {k:"B", text:"A free-text field naming the queue."},
    {k:"C", text:"A separate model call after extraction."},
    {k:"D", text:"Infer the queue downstream from the extracted fields."}
  ],
  correct:["A"],
  explain:{
    why:"A closed enum is what downstream routing can rely on, and the escape value keeps unrecognised cases visible rather than forcing them into a wrong queue.",
    distractors:{
      D:"Downstream inference duplicates a judgement the extractor is better placed to make, having read the document.",
      B:"Free text produces queue names that do not exist or vary in spelling.",
      C:"A second call costs a round trip for a decision the first call can make."
    }
  },
  refs:[R_STRUCT] },

{ id:"d4-4.3-t", domain:4, ts:"4.3", scenario:6, type:"single",
  stem:"Which statement about `tool_choice` and structured output is correct?",
  options:[
    {k:"A", text:"`auto` may return text, so it cannot guarantee structured output."},
    {k:"B", text:"`auto` guarantees a tool call when a schema is defined."},
    {k:"C", text:"`any` forces a specific named tool."},
    {k:"D", text:"Forced selection permits a text response alongside the call."}
  ],
  correct:["A"],
  explain:{
    why:"Under `auto` the model may judge that no tool is needed and answer in prose, which is exactly the outcome a structured pipeline cannot accept.",
    distractors:{
      B:"Defining a schema does not change whether a call is required.",
      C:"`any` requires some call but leaves the choice open; forcing a named tool is a different setting.",
      D:"Forced selection requires that tool to be called."
    }
  },
  refs:[R_TOVR] },
