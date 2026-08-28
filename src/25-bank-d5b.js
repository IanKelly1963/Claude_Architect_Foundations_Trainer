
/* ---- Domain 5 expansion: task statements 5.1, 5.2 and 5.3 ---- */

{ id:"d5-5.1-g", domain:5, ts:"5.1", scenario:1, type:"single",
  stem:"By turn 30 a support agent has forgotten the customer said they were travelling until the 14th, and offers a delivery date they cannot receive. What design prevents this?",
  options:[
    {k:"A", text:"Keep customer-stated constraints in an unsummarised facts block."},
    {k:"B", text:"Summarise less often so more of the conversation survives."},
    {k:"C", text:"Ask the customer to restate constraints periodically."},
    {k:"D", text:"Increase the context window so summarisation is unnecessary."}
  ],
  correct:["A"],
  explain:{
    why:"Stated constraints are exactly what summarisation loses first, and they are load-bearing for the resolution. Holding them outside the compressed history makes them immune to it.",
    distractors:{
      B:"Less frequent summarisation delays the loss and gives up the savings that motivated it.",
      C:"Asking the customer to repeat themselves is poor service and signals the agent was not listening.",
      D:"A larger window postpones the problem to a longer conversation."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.1-h", domain:5, ts:"5.1", scenario:3, type:"single",
  stem:"A synthesis agent receives 60 findings and consistently omits those in positions 20 to 40. What mitigation applies?",
  options:[
    {k:"A", text:"Lead with a key-findings summary and use section headers."},
    {k:"B", text:"Sort by relevance and truncate the tail."},
    {k:"C", text:"Pass 20 findings at a time in three calls."},
    {k:"D", text:"Repeat the middle findings at the end."}
  ],
  correct:["A"],
  explain:{
    why:"Beginnings and ends are attended most reliably. A summary at the front puts every key point in a strong position, and headers give structural anchors for locating detail in the body.",
    distractors:{
      C:"Batching is a reasonable fallback, but synthesis needs to see findings together to combine them.",
      B:"Truncation discards real findings, which is worse than under-weighting them.",
      D:"Duplication inflates the input and blurs whether repeated items are distinct."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.1-i", domain:5, ts:"5.1", scenario:1, type:"single",
  stem:"An order lookup returns 43 fields of which 5 matter. Across 20 turns this crowds out the conversation. Where should trimming happen?",
  options:[
    {k:"A", text:"Before the result enters context."},
    {k:"B", text:"During summarisation, once context is under pressure."},
    {k:"C", text:"In the prompt, by asking the model to ignore extra fields."},
    {k:"D", text:"Not at all; the extra fields may prove useful."}
  ],
  correct:["A"],
  explain:{
    why:"Trimming at entry means the 38 irrelevant fields never occupy the window at all, so nothing has to be compressed later to make room for them.",
    distractors:{
      B:"By then the space is already spent, and summarisation compresses the valuable history to accommodate noise.",
      C:"Ignoring is not the same as absent; the tokens are still consumed.",
      D:"Speculative retention is what created the problem, and a later need can be met with another call."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.1-j", domain:5, ts:"5.1", scenario:3, type:"single",
  stem:"Upstream agents return long prose with full reasoning. The synthesis agent's budget is tight. What change helps most?",
  options:[
    {k:"A", text:"Have upstream agents return structured facts and citations."},
    {k:"B", text:"Have synthesis summarise each input as it arrives."},
    {k:"C", text:"Truncate each input to a fixed length."},
    {k:"D", text:"Pass inputs one at a time."}
  ],
  correct:["A"],
  explain:{
    why:"Fixing this at the producer is far cheaper than at the consumer: structured facts carry what synthesis needs at a fraction of the tokens and keep attribution attached.",
    distractors:{
      B:"The verbose content must enter context before it can be summarised, so the budget is spent regardless.",
      C:"Fixed truncation cuts arbitrarily and removes conclusions as readily as filler.",
      D:"Synthesis needs findings together to combine them."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.1-k", domain:5, ts:"5.1", scenario:1, type:"single",
  stem:"A session covers three issues and the agent conflates their amounts. What structural change helps?",
  options:[
    {k:"A", text:"A separate record per issue, keyed by issue."},
    {k:"B", text:"Ask the customer which issue each message concerns."},
    {k:"C", text:"Handle one issue per conversation."},
    {k:"D", text:"Summarise the older issues more aggressively."}
  ],
  correct:["A"],
  explain:{
    why:"Per-issue records remove the inference step that produces conflation, because each amount is attached to the issue it belongs to rather than floating in narrative.",
    distractors:{
      B:"Pushing disambiguation onto the customer degrades service for a problem the system created.",
      C:"Splitting into separate conversations directly harms first-contact resolution.",
      D:"Compressing older issues loses their facts entirely."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.1-l", domain:5, ts:"5.1", scenario:4, type:"single",
  stem:"An exploration session's answers become generic after two hours, referring to typical patterns rather than the classes it found. What is happening?",
  options:[
    {k:"A", text:"The specific findings have fallen out of context."},
    {k:"B", text:"The model has degraded through repeated sampling."},
    {k:"C", text:"The repository changed during the session."},
    {k:"D", text:"Temperature has drifted upward."}
  ],
  correct:["A"],
  explain:{
    why:"Falling back on general patterns is the signature of the specifics no longer being available. The remedy is to persist findings outside the conversation.",
    distractors:{
      B:"Models do not degrade over a session; the context does.",
      C:"Nothing suggests the code changed, and that would produce contradictions rather than vagueness.",
      D:"Temperature is whatever each request specifies and does not drift."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.1-m", domain:5, ts:"5.1", scenario:3, type:"single",
  stem:"Why require subagents to include collection dates in their structured output?",
  options:[
    {k:"A", text:"So temporal change is not misread as contradiction."},
    {k:"B", text:"So findings can be sorted chronologically."},
    {k:"C", text:"So stale findings can be deleted automatically."},
    {k:"D", text:"So the report can cite retrieval times."}
  ],
  correct:["A"],
  explain:{
    why:"Two figures differing across three years is growth, not disagreement. Without dates, synthesis has no way to tell those apart.",
    distractors:{
      B:"Sorting is a minor convenience that does not affect interpretation.",
      C:"Automatic deletion would discard the historical baseline that makes a trend visible.",
      D:"Retrieval time is an operational detail rather than an interpretive one."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.1-n", domain:5, ts:"5.1", scenario:1, type:"multi",
  stem:"Which two facts belong in a persistent case-facts block rather than the summarised history? (Select 2.)",
  options:[
    {k:"A", text:"The disputed amount and the order number."},
    {k:"B", text:"The customer's stated expectation of a full refund."},
    {k:"C", text:"The agent's greeting at the start of the conversation."},
    {k:"D", text:"A restatement of the returns policy."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both are precise, load-bearing and exactly what summarisation blurs. The resolution depends on getting them exactly right.",
    distractors:{
      C:"Pleasantries carry no information the resolution depends on.",
      D:"Policy is stable reference material better supplied from its source than carried per conversation."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.1-o", domain:5, ts:"5.1", scenario:6, type:"single",
  stem:"An extraction agent processes a 300-page document page by page and loses detail from early pages. What is the appropriate design?",
  options:[
    {k:"A", text:"Extract structured facts per page and carry only those forward."},
    {k:"B", text:"Increase the context window and keep every page."},
    {k:"C", text:"Process pages in reverse so early pages are freshest."},
    {k:"D", text:"Summarise the whole document before extracting."}
  ],
  correct:["A"],
  explain:{
    why:"Carrying compact structured facts instead of raw pages keeps what matters while the window stays manageable, however long the document is.",
    distractors:{
      D:"Summarising first loses the detail extraction is meant to capture.",
      B:"A larger window delays the same failure on a longer document.",
      C:"Reversing shifts which pages are weakly attended rather than fixing it."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.1-p", domain:5, ts:"5.1", scenario:3, type:"single",
  stem:"A coordinator passes a subagent 40,000 tokens of raw retrieval. The subagent's output is shallow. What is the most likely cause?",
  options:[
    {k:"A", text:"Signal is diluted across a large volume of low-relevance text."},
    {k:"B", text:"The subagent's context limit was exceeded and input truncated."},
    {k:"C", text:"Raw text cannot be passed in a Task prompt."},
    {k:"D", text:"The subagent lacked tools to process the input."}
  ],
  correct:["A"],
  explain:{
    why:"Most retrieval is noise. Buried in it, the findings that matter are attended no more strongly than the surrounding filler, so the output reflects the average rather than the best material.",
    distractors:{
      B:"Truncation is worth checking, but 40,000 tokens is within modern limits and the symptom is shallowness rather than a hard cut.",
      C:"Text passes fine in a prompt.",
      D:"No tools are needed to read text that is already in context."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.1-q", domain:5, ts:"5.1", scenario:2, type:"single",
  stem:"A long coding session starts giving inconsistent answers about a class it analysed earlier. What is the most reliable remedy?",
  options:[
    {k:"A", text:"Write the findings to a file and consult it."},
    {k:"B", text:"Run `/compact` and continue."},
    {k:"C", text:"Ask the model to recall its earlier analysis."},
    {k:"D", text:"Re-read every file analysed so far."}
  ],
  correct:["A"],
  explain:{
    why:"A file outlives the context window, compaction and the session itself, so the findings can be reconstituted whenever they are needed.",
    distractors:{
      B:"Compaction frees space by summarising, which blurs exactly the specifics being lost.",
      C:"Asking it to recall what has fallen out of context invites reconstruction rather than recall.",
      D:"Re-reading everything is expensive and refills the window with the same volume."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.1-r", domain:5, ts:"5.1", scenario:1, type:"single",
  stem:"Why is the API being stateless relevant to context management?",
  options:[
    {k:"A", text:"Full history must be resent, so its size is a per-request cost."},
    {k:"B", text:"History is stored server-side and cannot be edited."},
    {k:"C", text:"Only the last ten turns are retained."},
    {k:"D", text:"Statelessness prevents summarisation."}
  ],
  correct:["A"],
  explain:{
    why:"Because nothing is remembered between calls, everything the model should know travels with each request. That makes what you choose to carry a recurring cost rather than a one-off.",
    distractors:{
      B:"There is no server-side history, which is precisely what statelessness means.",
      C:"Retention of that kind would be a server-side behaviour, and the conversation you send is exactly the conversation the model sees.",
      D:"Statelessness is what makes summarisation your responsibility, not something it prevents."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.1-s", domain:5, ts:"5.1", scenario:6, type:"single",
  stem:"Which practice best preserves numeric precision across a long extraction session?",
  options:[
    {k:"A", text:"Record values in a structured store as they are found."},
    {k:"B", text:"Instruct the summariser to keep all numbers."},
    {k:"C", text:"Repeat key figures in every prompt."},
    {k:"D", text:"Use a model with stronger arithmetic."}
  ],
  correct:["A"],
  explain:{
    why:"Values written to a structured store are exact and permanent, and can be read back without depending on what survived compression.",
    distractors:{
      B:"An instruction applied on every summarisation pass degrades gradually over many turns.",
      C:"Repetition inflates every prompt and does not scale past a handful of figures.",
      D:"Arithmetic capability is not the issue; retention is."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.1-t", domain:5, ts:"5.1", scenario:3, type:"single",
  stem:"What is the 'lost in the middle' effect?",
  options:[
    {k:"A", text:"Content between the start and end of a long input is attended least reliably."},
    {k:"B", text:"Tokens in the middle of a response are more likely to be wrong."},
    {k:"C", text:"Middle turns of a conversation are dropped first under compaction."},
    {k:"D", text:"Mid-sized inputs perform worse than short or long ones."}
  ],
  correct:["A"],
  explain:{
    why:"Models process the beginning and end of a long input reliably and may omit material from the middle, which is why key points belong at the front and structure matters.",
    distractors:{
      C:"Compaction is a separate mechanism operating on conversation history rather than a single input.",
      B:"It is about position within the input, not within the generated response.",
      D:"It concerns position inside one input, not the overall size of the input."
    }
  },
  refs:[R_CTX] },

{ id:"d5-5.2-g", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"A customer writes 'this is the third time I've had to contact you about this'. The issue is a standard replacement the agent can process. What should it do?",
  options:[
    {k:"A", text:"Acknowledge the repetition and resolve it now."},
    {k:"B", text:"Escalate, since repeated contact signals complexity."},
    {k:"C", text:"Resolve it without commenting on the contact history."},
    {k:"D", text:"Ask why the previous contacts did not resolve it."}
  ],
  correct:["A"],
  explain:{
    why:"Repeated contact is a service failure, not a complexity signal. Acknowledging it and resolving in this contact is what turns the pattern around.",
    distractors:{
      B:"Escalating a resolvable issue makes it a fourth contact without resolving anything.",
      C:"Ignoring the history reads as not listening, which is what produced the frustration.",
      D:"Investigating past failures delays the resolution the customer came for."
    }
  },
  refs:[R_PROMPT] },

{ id:"d5-5.2-h", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"Policy covers refunds for defective goods but is silent on goods damaged by a courier. What should the agent do?",
  options:[
    {k:"A", text:"Escalate, since policy does not address this case."},
    {k:"B", text:"Apply the defective-goods policy by analogy."},
    {k:"C", text:"Refuse, since no policy permits it."},
    {k:"D", text:"Approve, since the customer is not at fault."}
  ],
  correct:["A"],
  explain:{
    why:"A gap is a distinct escalation trigger. The case is easy to understand but nobody has decided whether it is covered, and that decision is not the agent's to make.",
    distractors:{
      B:"Reasoning by analogy from adjacent policy is the agent making policy.",
      C:"Defaulting to refusal turns every unaddressed case into a rejection.",
      D:"Fault is relevant to the decision but does not authorise the agent to make it."
    }
  },
  refs:[R_PROMPT] },

{ id:"d5-5.2-i", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"An agent has attempted the same lookup four times with different spellings and cannot locate the account. What is the appropriate action?",
  options:[
    {k:"A", text:"Escalate, having made no meaningful progress."},
    {k:"B", text:"Continue trying further spelling variants."},
    {k:"C", text:"Create a new account for the customer."},
    {k:"D", text:"Close the contact as unresolvable."}
  ],
  correct:["A"],
  explain:{
    why:"Inability to make progress is one of the legitimate escalation triggers. A human has tools and discretion the agent does not.",
    distractors:{
      B:"Four failures suggest the account is not findable this way, so more variants are unlikely to help.",
      C:"Creating an account fabricates state and may duplicate an existing customer.",
      D:"Closing without resolution abandons a customer whose problem a human could solve."
    }
  },
  refs:[R_PROMPT] },

{ id:"d5-5.2-j", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"An agent escalates 40% of contacts, mostly straightforward. What is the most proportionate first intervention?",
  options:[
    {k:"A", text:"Explicit criteria with examples of resolve versus escalate."},
    {k:"B", text:"A confidence threshold below which it escalates."},
    {k:"C", text:"A classifier trained on historical tickets."},
    {k:"D", text:"A cap on escalations per day."}
  ],
  correct:["A"],
  explain:{
    why:"Over-escalation on easy cases means the boundary is unclear. Stating it and demonstrating it on both sides is the direct and cheapest fix.",
    distractors:{
      B:"Self-reported confidence is poorly calibrated, and an agent unsure about easy cases will not score them accurately.",
      C:"A trained classifier is substantial infrastructure before prompt work has been tried.",
      D:"A cap forces the agent to handle cases it should escalate once the quota is used."
    }
  },
  refs:[R_PROMPT] },

{ id:"d5-5.2-k", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"A lookup returns two customers with the same name and city. What should the agent do?",
  options:[
    {k:"A", text:"Ask for another identifier."},
    {k:"B", text:"Choose the one with recent activity."},
    {k:"C", text:"Choose the older account as the primary."},
    {k:"D", text:"Escalate for manual identification."}
  ],
  correct:["A"],
  explain:{
    why:"One clarifying question resolves the ambiguity definitively and cheaply, and avoids acting on the wrong person's account.",
    distractors:{
      D:"Escalation is disproportionate when a single question settles it, and it costs first-contact resolution.",
      B:"Recency is a guess, and acting on the wrong account risks exposing another customer's data.",
      C:"Account age is equally arbitrary."
    }
  },
  refs:[R_PROMPT] },

{ id:"d5-5.2-l", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"Why is sentiment a poor escalation trigger?",
  options:[
    {k:"A", text:"Frustration does not track case complexity."},
    {k:"B", text:"Sentiment analysis is too slow for live conversation."},
    {k:"C", text:"Customers rarely express frustration in writing."},
    {k:"D", text:"Sentiment scores cannot be thresholded reliably."}
  ],
  correct:["A"],
  explain:{
    why:"Frustrated customers frequently have simple problems, and calm ones sometimes have genuinely hard ones. Routing on sentiment sends the wrong cases to humans in both directions.",
    distractors:{
      D:"Thresholding is technically straightforward; the trouble is what is being thresholded.",
      B:"Sentiment classification is fast enough for live use.",
      C:"Frustration is expressed readily in writing."
    }
  },
  refs:[R_PROMPT] },

{ id:"d5-5.2-m", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"A customer asks for a manager mid-conversation, after the agent has already diagnosed the issue. What should happen?",
  options:[
    {k:"A", text:"Escalate, passing the diagnosis in a structured handoff."},
    {k:"B", text:"Complete the resolution first, and then offer escalation."},
    {k:"C", text:"Explain that the agent can resolve it faster."},
    {k:"D", text:"Escalate without context, letting the manager start fresh."}
  ],
  correct:["A"],
  explain:{
    why:"The request is honoured immediately, and the work already done travels with it so the manager does not restart the investigation.",
    distractors:{
      B:"Finishing first overrides an explicit request the customer has already made.",
      C:"Arguing with a stated preference is exactly what escalates complaints.",
      D:"Discarding the diagnosis wastes it and makes the customer repeat themselves."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.2-n", domain:5, ts:"5.2", scenario:1, type:"multi",
  stem:"Which two are legitimate reasons to escalate? (Select 2.)",
  options:[
    {k:"A", text:"The customer has asked for a human."},
    {k:"B", text:"The agent cannot make meaningful progress."},
    {k:"C", text:"The conversation has exceeded ten turns."},
    {k:"D", text:"The customer's message is written in capitals."}
  ],
  correct:["A","B"],
  explain:{
    why:"An explicit request and genuine inability to progress are two of the three documented triggers, the third being a policy gap.",
    distractors:{
      C:"Turn count reflects conversational style as much as difficulty.",
      D:"Capitalisation is a sentiment proxy, and sentiment does not track complexity."
    }
  },
  refs:[R_PROMPT] },

{ id:"d5-5.2-o", domain:5, ts:"5.2", scenario:6, type:"single",
  stem:"An extraction pipeline routes documents to human review when the model reports low confidence. Reviewers find most of them fine. What should be re-examined?",
  options:[
    {k:"A", text:"Whether the confidence scores are calibrated."},
    {k:"B", text:"Whether the reviewers themselves are being thorough enough."},
    {k:"C", text:"Whether the threshold should be lowered further."},
    {k:"D", text:"Whether the schema is too strict."}
  ],
  correct:["A"],
  explain:{
    why:"Raw scores are not inherently meaningful. Checking them against labelled data tells you what a given score implies for error rate, which is what a routing threshold should rest on.",
    distractors:{
      C:"Lowering the threshold sends even more correct extractions to review.",
      B:"Reviewers finding documents fine is evidence about the routing, not about their diligence.",
      D:"Schema strictness would surface as validation failures rather than low confidence."
    }
  },
  refs:[R_STRUCT] },

{ id:"d5-5.2-p", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"What is the difference between a complex case and a policy gap, for escalation purposes?",
  options:[
    {k:"A", text:"A gap means nobody has decided; complexity means the answer is hard to work out."},
    {k:"B", text:"A gap always involves money, whereas complexity does not necessarily involve any."},
    {k:"C", text:"Complexity warrants escalation; a gap does not."},
    {k:"D", text:"They are the same and both warrant escalation."}
  ],
  correct:["A"],
  explain:{
    why:"The distinction matters because a complex case may still be within the agent's authority, whereas a gap is outside it regardless of how simple the case looks.",
    distractors:{
      C:"This is inverted: a gap is the clearer trigger, since authority rather than difficulty is missing.",
      B:"Gaps arise in non-financial policy areas too.",
      D:"Conflating them leads to escalating hard-but-permitted cases and deciding unauthorised ones."
    }
  },
  refs:[R_PROMPT] },

{ id:"d5-5.2-q", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"An agent reports 9 out of 10 confidence and gets the case wrong. What does this illustrate?",
  options:[
    {k:"A", text:"Self-reported confidence is poorly calibrated to correctness."},
    {k:"B", text:"The confidence scale needs more granularity."},
    {k:"C", text:"The agent should report confidence after acting."},
    {k:"D", text:"Confidence should be reported per tool call."}
  ],
  correct:["A"],
  explain:{
    why:"A model can be entirely confident and wrong, which is why routing on self-assessment fails precisely on the cases where a human was most needed.",
    distractors:{
      B:"A finer scale on an uncalibrated signal adds precision without accuracy.",
      C:"Timing does not repair the underlying calibration.",
      D:"Per-call scores multiply an unreliable signal."
    }
  },
  refs:[R_PROMPT] },

{ id:"d5-5.2-r", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"A frustrated customer describes a delayed order the agent can resolve with a reshipment, and has not asked for a human. What is the right response?",
  options:[
    {k:"A", text:"Acknowledge the frustration and offer the reshipment."},
    {k:"B", text:"Escalate, since frustration indicates the case needs a human."},
    {k:"C", text:"Process the reshipment without commenting on how they feel."},
    {k:"D", text:"Ask whether they would prefer a human before proceeding."}
  ],
  correct:["A"],
  explain:{
    why:"The issue is within capability, so resolving it in this contact is the best outcome. Acknowledging the frustration costs nothing and is what makes the resolution land well.",
    distractors:{
      B:"Escalating on sentiment sends resolvable cases to humans.",
      C:"Ignoring evident frustration reads as tone-deaf even when the outcome is right.",
      D:"Offering escalation unprompted invites it and adds a handoff to a closable case."
    }
  },
  refs:[R_PROMPT] },

{ id:"d5-5.2-s", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"A team proposes escalating any request the agent has not seen before. What is the objection?",
  options:[
    {k:"A", text:"Novelty is not the same as being outside authority."},
    {k:"B", text:"Novel requests cannot be detected reliably."},
    {k:"C", text:"Escalation queues cannot handle the volume."},
    {k:"D", text:"Novel requests are usually invalid."}
  ],
  correct:["A"],
  explain:{
    why:"Most novel requests are ordinary combinations of things the agent handles routinely. What warrants escalation is a gap in policy, not unfamiliarity of phrasing.",
    distractors:{
      C:"Volume is a real consequence but follows from the criterion being wrong.",
      B:"Novelty detection is feasible; the problem is that it is the wrong signal.",
      D:"Novel requests are usually perfectly valid."
    }
  },
  refs:[R_PROMPT] },

{ id:"d5-5.2-t", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"What most improves escalation calibration in a system prompt?",
  options:[
    {k:"A", text:"Named triggers plus examples on both sides of the line."},
    {k:"B", text:"An instruction to escalate when uncertain."},
    {k:"C", text:"A list of every case handled in the last year."},
    {k:"D", text:"A target escalation rate."}
  ],
  correct:["A"],
  explain:{
    why:"Triggers give the rule and contrastive examples calibrate it on the hard cases, which is what a boundary judgement needs.",
    distractors:{
      B:"Uncertainty is precisely what the agent judges badly, so this delegates the decision to an unreliable signal.",
      C:"An exhaustive list is enormous and still fails on the first genuinely new case.",
      D:"A rate target invites gaming without saying which cases belong on which side."
    }
  },
  refs:[R_PROMPT] },

{ id:"d5-5.3-g", domain:5, ts:"5.3", scenario:3, type:"single",
  stem:"A subagent times out. Which response gives the coordinator the most useful basis for recovery?",
  options:[
    {k:"A", text:"Failure type, attempted query, partial results and alternatives."},
    {k:"B", text:"A generic 'search unavailable' after internal retries."},
    {k:"C", text:"An empty result set marked successful."},
    {k:"D", text:"An exception terminating the workflow."}
  ],
  correct:["A"],
  explain:{
    why:"Each recovery option the coordinator has depends on knowing what was tried and what came back. Structured context is what makes an informed choice possible.",
    distractors:{
      B:"The internal retries are sensible; discarding the context is what removes the coordinator's options.",
      C:"Reporting failure as success prevents recovery and silently ships incomplete work.",
      D:"Terminating everything discards research that succeeded."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.3-h", domain:5, ts:"5.3", scenario:3, type:"single",
  stem:"Why is marking a failed search as an empty success the most damaging error-handling choice?",
  options:[
    {k:"A", text:"It removes any chance of recovery and hides the gap."},
    {k:"B", text:"It causes infinite retries."},
    {k:"C", text:"It violates the MCP specification."},
    {k:"D", text:"It consumes more context than an error."}
  ],
  correct:["A"],
  explain:{
    why:"An error that reports itself as success is invisible. The coordinator moves on believing the topic was covered, and the final report claims coverage it does not have.",
    distractors:{
      B:"There is no retry; the success status is accepted and the run continues.",
      C:"The protocol issue is secondary to the silent data loss.",
      D:"Context cost is trivial and beside the point."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.3-i", domain:5, ts:"5.3", scenario:3, type:"single",
  stem:"Two of six topics could not be researched. What should the report do?",
  options:[
    {k:"A", text:"Annotate which areas have gaps and why."},
    {k:"B", text:"Omit those topics without comment."},
    {k:"C", text:"Fill them from background knowledge, marked provisional."},
    {k:"D", text:"Fail and re-run the whole pipeline."}
  ],
  correct:["A"],
  explain:{
    why:"An explicit gap annotation is honest and actionable: the reader knows which conclusions rest on evidence and which area remains open.",
    distractors:{
      C:"Background knowledge produces unsourced claims in a report whose value is being cited, and 'provisional' is easily lost downstream.",
      B:"Silent omission implies comprehensiveness the report does not have.",
      D:"Re-running discards four well-covered areas to retry two whose sources may still be unavailable."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.3-j", domain:5, ts:"5.3", scenario:3, type:"single",
  stem:"A subagent resolves a rate limit locally and hits an unresolvable permission error. What should it propagate?",
  options:[
    {k:"A", text:"The permission error, with what was attempted and partial results."},
    {k:"B", text:"Both errors, so that the coordinator has complete visibility of what happened."},
    {k:"C", text:"Neither; return whatever data it gathered."},
    {k:"D", text:"The rate limit, as evidence of systemic load."}
  ],
  correct:["A"],
  explain:{
    why:"Propagate what needs a decision. The rate limit was handled; the permission error blocks work and only the coordinator can choose how to route around it.",
    distractors:{
      B:"Reporting the resolved failure adds noise and may trigger unnecessary recovery.",
      C:"Suppressing the permission error hides a genuine coverage gap.",
      D:"This is inverted: the transient failure is the one that needs no attention."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.3-k", domain:5, ts:"5.3", scenario:3, type:"single",
  stem:"A query runs correctly and matches nothing. How should it be reported?",
  options:[
    {k:"A", text:"As a success with zero matches, distinct from a failure."},
    {k:"B", text:"As an error, since nothing was returned."},
    {k:"C", text:"As transient, so the coordinator retries."},
    {k:"D", text:"As a partial result."}
  ],
  correct:["A"],
  explain:{
    why:"A query that ran and matched nothing is a definitive, informative answer. Labelling it a success with zero matches lets the coordinator distinguish it from being unable to look.",
    distractors:{
      B:"The subagent did its job; calling it an error triggers pointless recovery.",
      C:"Retrying a definitive negative produces the same result at extra cost.",
      D:"'Partial' implies some data was retrieved, which misrepresents a complete query."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.3-l", domain:5, ts:"5.3", scenario:3, type:"single",
  stem:"Which decision can a coordinator NOT make given only 'search unavailable'?",
  options:[
    {k:"A", text:"Whether a narrower query would succeed."},
    {k:"B", text:"Whether to log the failure."},
    {k:"C", text:"Whether to mark the run degraded."},
    {k:"D", text:"Whether to alert an operator."}
  ],
  correct:["A"],
  explain:{
    why:"Reformulating requires knowing what was tried and whether anything came back. The other three need only the fact that something failed.",
    distractors:{
      B:"Logging needs only the failure itself.",
      C:"Marking degraded is a coarse decision the status supports.",
      D:"Alerting likewise needs only the fact of failure."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.3-m", domain:5, ts:"5.3", scenario:2, type:"single",
  stem:"A support subagent's tool fails and it returns 'I was unable to complete that request'. What is missing for the coordinator?",
  options:[
    {k:"A", text:"Whether the failure was transient, policy or permission."},
    {k:"B", text:"A friendlier phrasing for the customer."},
    {k:"C", text:"The number of retries attempted."},
    {k:"D", text:"The elapsed time before failure."}
  ],
  correct:["A"],
  explain:{
    why:"The category determines the response: retry, explain the policy, or escalate for access. Without it the coordinator has to guess between three quite different actions.",
    distractors:{
      B:"Phrasing matters for the customer once the action is decided, not for deciding it.",
      C:"Retry count is diagnostic detail rather than a basis for the next decision.",
      D:"Duration is operational telemetry."
    }
  },
  refs:[R_MCP] },

{ id:"d5-5.3-n", domain:5, ts:"5.3", scenario:3, type:"multi",
  stem:"Which two belong in structured error context passed to a coordinator? (Select 2.)",
  options:[
    {k:"A", text:"What was attempted."},
    {k:"B", text:"Any partial results obtained."},
    {k:"C", text:"The subagent's system prompt."},
    {k:"D", text:"The model and temperature used."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both bear directly on the recovery decision: what was tried shapes what to try next, and partial results may be enough to proceed with an annotated gap.",
    distractors:{
      C:"The system prompt is configuration the coordinator already controls.",
      D:"Model settings are operational detail rather than recovery input."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.3-o", domain:5, ts:"5.3", scenario:2, type:"single",
  stem:"A file-read tool returns one generic error for missing files, permission denials and directories. What is the effect on the agent?",
  options:[
    {k:"A", text:"It cannot tell which recovery to attempt."},
    {k:"B", text:"It abandons the tool entirely."},
    {k:"C", text:"It treats the file as empty."},
    {k:"D", text:"It retries indefinitely."}
  ],
  correct:["A"],
  explain:{
    why:"Correcting a path, requesting access and listing a directory are three different remedies. Collapsing the causes leaves the agent guessing which applies.",
    distractors:{
      D:"Retrying is one guess it might make, but the general problem is that no recovery is determinable.",
      B:"Abandoning the tool after one failure is unusual behaviour.",
      C:"An explicit error is not the same as an empty result."
    }
  },
  refs:[R_MCP] },

{ id:"d5-5.3-p", domain:5, ts:"5.3", scenario:2, type:"single",
  stem:"Why should a subagent handle transient failures locally rather than propagating them?",
  options:[
    {k:"A", text:"They need no coordinator decision once resolved."},
    {k:"B", text:"Coordinators cannot process error responses at all."},
    {k:"C", text:"Propagated errors terminate the workflow."},
    {k:"D", text:"Local retries are cheaper than coordinator retries."}
  ],
  correct:["A"],
  explain:{
    why:"A blip the subagent recovered from changes nothing about what the coordinator should do next, so reporting it spends context and invites unnecessary intervention.",
    distractors:{
      D:"Cost is similar either way; the argument is about whose decision it is.",
      B:"Coordinators handle errors routinely.",
      C:"Propagation does not automatically terminate anything."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.3-q", domain:5, ts:"5.3", scenario:6, type:"single",
  stem:"An extraction subagent fails on 4 of 60 documents and returns the 56 successes only. What is wrong?",
  options:[
    {k:"A", text:"The coordinator will believe all 60 were processed."},
    {k:"B", text:"Partial results should never be returned."},
    {k:"C", text:"The 56 results are unreliable without the 4."},
    {k:"D", text:"Batch results must be returned complete."}
  ],
  correct:["A"],
  explain:{
    why:"Silence about the four makes the run look complete, so nobody retries them and downstream counts are quietly wrong.",
    distractors:{
      B:"Partial results are the normal and desirable outcome, provided the gaps are declared.",
      C:"The 56 are perfectly reliable; the problem is the missing four being invisible.",
      D:"Completeness is not required; visibility of what is missing is."
    }
  },
  refs:[R_MCP] },

{ id:"d5-5.3-r", domain:5, ts:"5.3", scenario:2, type:"single",
  stem:"A coordinator receives structured errors from three subagents and proceeds with partial results. What must the final output include?",
  options:[
    {k:"A", text:"Coverage annotations for the affected areas."},
    {k:"B", text:"The raw error payloads verbatim."},
    {k:"C", text:"A single confidence score covering the whole report."},
    {k:"D", text:"Nothing; partial results should read as complete."}
  ],
  correct:["A"],
  explain:{
    why:"The reader needs to know which conclusions are well supported and which areas are thin because sources were unavailable. That is what makes a partial report trustworthy.",
    distractors:{
      B:"Raw payloads are for operators rather than readers of the report.",
      C:"A single aggregate score obscures which specific areas are affected.",
      D:"Presenting partial coverage as complete is the failure the annotations prevent."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.3-s", domain:5, ts:"5.3", scenario:2, type:"single",
  stem:"What distinguishes an access failure from a valid empty result?",
  options:[
    {k:"A", text:"Whether the query ran at all."},
    {k:"B", text:"Whether any documents exist in the source."},
    {k:"C", text:"Whether the subagent retried."},
    {k:"D", text:"Whether the coordinator requested the query."}
  ],
  correct:["A"],
  explain:{
    why:"An access failure means the question was never answered; an empty result means it was answered and the answer is 'none'. That difference determines whether retrying makes any sense.",
    distractors:{
      B:"The source may be full of documents while the query legitimately matches none.",
      C:"Retrying is a response to the failure rather than what defines it.",
      D:"Both arise from requested queries."
    }
  },
  refs:[R_SUB] },

{ id:"d5-5.3-t", domain:5, ts:"5.3", scenario:2, type:"single",
  stem:"An engineer proposes that any subagent error should terminate the research run, for safety. What is the objection?",
  options:[
    {k:"A", text:"It discards completed work over a recoverable failure."},
    {k:"B", text:"Termination is not supported by the coordinator."},
    {k:"C", text:"Errors are rare enough to ignore."},
    {k:"D", text:"Partial results are always unusable."}
  ],
  correct:["A"],
  explain:{
    why:"Most subagent failures are routable around. Failing the whole run throws away everything that succeeded to avoid a gap that could have been annotated.",
    distractors:{
      D:"Partial results with declared gaps are frequently the most useful available output.",
      C:"Errors are common enough that the policy would fire often.",
      B:"Termination is implementable; the objection is that it is wasteful."
    }
  },
  refs:[R_SUB] },
