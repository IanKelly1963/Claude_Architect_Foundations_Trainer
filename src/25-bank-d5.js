
/* ---------------- Domain 5: Context Management & Reliability ---------------- */

{ id:"d5-5.1-a", domain:5, ts:"5.1", scenario:1, type:"single",
  stem:"In long support conversations your agent summarises earlier turns to control context. By turn 20 it has lost the exact refund amount, the order date and the customer's stated expectation of a full refund, and offers a partial credit instead. What is the fix?",
  options:[
    {k:"A", text:"Extract transactional facts into a persistent case-facts block outside the summarised history."},
    {k:"B", text:"Summarise less aggressively so more of the original conversation survives."},
    {k:"C", text:"Instruct the summariser to preserve all numbers, dates and customer statements verbatim when it compresses the history."},
    {k:"D", text:"Move to a model with a larger context window so summarisation is unnecessary."}
  ],
  correct:["A"],
  explain:{
    why:"Summarisation is lossy precisely where precision matters. Keeping amounts, dates, order numbers and stated expectations in a structured block that is never summarised makes those facts immune to compression while still allowing the narrative to be condensed.",
    distractors:{
      B:"Less aggressive summarisation delays the loss without preventing it, and gives up the context savings that motivated it.",
      C:"This helps somewhat but is still a probabilistic instruction applied to every summarisation pass, so facts degrade gradually over twenty turns.",
      D:"A larger window postpones the problem to a longer conversation, and does nothing about the summarisation already in place."
    }
  },
  refs:[{label:"API: Context windows", url:"https://platform.claude.com/docs/en/build-with-claude/context-windows"}] },

{ id:"d5-5.1-b", domain:5, ts:"5.1", scenario:3, type:"single",
  stem:"Your synthesis agent reliably incorporates findings from the start and end of the aggregated input but frequently omits findings from the middle. What mitigations address this directly?",
  options:[
    {k:"A", text:"Place a key-findings summary first and organise details under explicit section headers."},
    {k:"B", text:"Sort the findings by relevance so the most important are first, and truncate the tail."},
    {k:"C", text:"Reduce the total number of findings passed so everything fits comfortably."},
    {k:"D", text:"Repeat the middle findings again at the end of the input so that they also appear in a well-attended position."}
  ],
  correct:["A"],
  explain:{
    why:"This is the lost-in-the-middle effect. A summary at the front puts every key point in a reliably-attended position, and explicit section headers give the model structural anchors for locating detail in the body.",
    distractors:{
      B:"Truncation discards real findings, which is a worse failure than under-weighting them.",
      C:"Passing fewer findings loses coverage, and the position effect will still apply within whatever remains.",
      D:"Duplicating content inflates the input and creates ambiguity about whether the repeated items are distinct findings."
    }
  },
  refs:[{label:"API: Context windows", url:"https://platform.claude.com/docs/en/build-with-claude/context-windows"}] },

{ id:"d5-5.1-c", domain:5, ts:"5.1", scenario:1, type:"single",
  stem:"Each `lookup_order` call returns more than 40 fields, of which about 5 matter for a return. Across a long conversation these accumulate and crowd out earlier context. What is the appropriate intervention?",
  options:[
    {k:"A", text:"Trim tool outputs to the relevant fields before they enter context."},
    {k:"B", text:"Summarise the conversation more frequently to reclaim the space."},
    {k:"C", text:"Call `lookup_order` less often by caching its results in the prompt."},
    {k:"D", text:"Accept the accumulation, since the extra fields might be needed later."}
  ],
  correct:["A"],
  explain:{
    why:"Tool results consume context out of all proportion to their relevance. Trimming at the point of entry, for instance in a PostToolUse hook, prevents 35 irrelevant fields per call from ever accumulating.",
    distractors:{
      B:"Summarising more often compresses the valuable conversational history to make room for irrelevant tool fields, which is precisely backwards.",
      C:"Caching in the prompt keeps the same bloated payload in context; it reduces calls, not size.",
      D:"Speculative retention is what created the problem, and the rare later need can be met with another call."
    }
  },
  refs:[{label:"API: Context windows", url:"https://platform.claude.com/docs/en/build-with-claude/context-windows"}] },

{ id:"d5-5.1-d", domain:5, ts:"5.1", scenario:3, type:"single",
  stem:"Your synthesis agent has a limited context budget, and upstream agents return long prose passages with their full reasoning chains. What change helps most?",
  options:[
    {k:"A", text:"Have upstream agents return structured key facts, citations and relevance scores."},
    {k:"B", text:"Have the synthesis agent summarise each upstream output as it receives it."},
    {k:"C", text:"Truncate each upstream output to a fixed character limit before it is passed on to the synthesis agent."},
    {k:"D", text:"Pass upstream outputs one at a time so only one is in context at any moment."}
  ],
  correct:["A"],
  explain:{
    why:"Fixing this at the producer is far more efficient than at the consumer. Structured facts with citations carry the information synthesis actually needs at a fraction of the tokens, and preserve attribution as a bonus.",
    distractors:{
      B:"The verbose content must enter context before it can be summarised, so the budget is spent regardless.",
      C:"Fixed-length truncation cuts arbitrarily and will remove a conclusion as readily as filler.",
      D:"Synthesis requires seeing findings together to combine them; serialising them defeats the purpose."
    }
  },
  refs:[{label:"API: Context windows", url:"https://platform.claude.com/docs/en/build-with-claude/context-windows"}] },

{ id:"d5-5.1-e", domain:5, ts:"5.1", scenario:3, type:"single",
  stem:"Downstream synthesis keeps misinterpreting subagent findings because it cannot tell when data was collected or which document a figure came from. What requirement addresses this?",
  options:[
    {k:"A", text:"Require subagents to include dates, source locations and methodological context."},
    {k:"B", text:"Require the synthesis agent to ask the coordinator whenever provenance is unclear."},
    {k:"C", text:"Require subagents to return findings in chronological order of collection."},
    {k:"D", text:"Require the coordinator to append a consolidated source list to the end of every synthesis prompt it issues."}
  ],
  correct:["A"],
  explain:{
    why:"Metadata has to travel with each finding. If it is captured at the point of collection and carried in the structured output, downstream agents can interpret and attribute correctly without asking anyone.",
    distractors:{
      B:"Round-tripping to the coordinator for provenance adds latency, and the coordinator does not have information the subagent failed to capture.",
      C:"Ordering conveys sequence, not which finding came from which source or when the data itself was collected.",
      D:"An unattached source list leaves the model to guess which source supports which claim, which is the mapping that was lost."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d5-5.1-f", domain:5, ts:"5.1", scenario:1, type:"single",
  stem:"A customer session covers three separate issues over many turns and the agent keeps conflating their order numbers and amounts. What structural change helps?",
  options:[
    {k:"A", text:"Persist structured per-issue data into a separate context layer keyed by issue."},
    {k:"B", text:"Ask the customer to confirm which issue each message refers to."},
    {k:"C", text:"Handle only one issue per conversation and open a separate new conversation for each of the others."},
    {k:"D", text:"Increase summarisation frequency so older issues are compressed away."}
  ],
  correct:["A"],
  explain:{
    why:"Keeping each issue's facts in its own structured record removes the ambiguity that causes conflation, because the agent no longer has to infer from narrative context which order number belongs to which complaint.",
    distractors:{
      B:"Pushing disambiguation onto the customer degrades the experience for a problem the system created.",
      C:"Splitting into separate conversations directly harms first-contact resolution.",
      D:"Compressing older issues loses their facts entirely, which is worse than conflating them."
    }
  },
  refs:[{label:"API: Context windows", url:"https://platform.claude.com/docs/en/build-with-claude/context-windows"}] },

{ id:"d5-5.2-a", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"Your agent achieves 55% first-contact resolution against an 80% target. Logs show it escalates straightforward cases (standard damage replacements with photo evidence) while attempting to handle complex situations requiring policy exceptions itself. What is the most effective improvement?",
  options:[
    {k:"A", text:"Add explicit escalation criteria with few-shot examples of escalate versus resolve."},
    {k:"B", text:"Have the agent self-report a numeric confidence score before each response and route to humans whenever it falls below a set threshold."},
    {k:"C", text:"Deploy a separate classifier trained on historical tickets to predict which requests need escalation."},
    {k:"D", text:"Implement sentiment analysis and escalate automatically when negative sentiment exceeds a threshold."}
  ],
  correct:["A"],
  explain:{
    why:"The root cause is unclear decision boundaries, and explicit criteria plus contrastive examples address that directly. It is also the proportionate first step, before adding infrastructure.",
    distractors:{
      B:"Self-reported confidence is poorly calibrated. This agent is already confidently wrong on the hard cases, which is exactly where the score would fail.",
      C:"A trained classifier requires labelled data and ML infrastructure, and is over-engineered before prompt optimisation has been tried.",
      D:"Sentiment does not correlate with case complexity, which is the actual variable. It solves a different problem."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d5-5.2-b", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"A customer's first message reads: 'I don't want to talk to a bot. Put me through to a person.' The issue appears to be a simple address change. What should the agent do?",
  options:[
    {k:"A", text:"Escalate to a human immediately, honouring the explicit request without first attempting to investigate."},
    {k:"B", text:"Resolve the address change first, since it is simple, then offer escalation if the customer is still dissatisfied."},
    {k:"C", text:"Explain that it can handle address changes quickly and proceed unless the customer objects again."},
    {k:"D", text:"Ask the customer why they prefer a human, to determine whether escalation is warranted."}
  ],
  correct:["A"],
  explain:{
    why:"An explicit request for a human is one of the legitimate escalation triggers and should be honoured immediately. Simplicity of the underlying issue does not override a customer stating what they want.",
    distractors:{
      B:"Resolving first ignores the request that was made. The customer asked for a person before describing the issue.",
      C:"Proceeding unless they object again makes the customer refuse twice, which is precisely the friction that generates complaints.",
      D:"Interrogating a customer about their stated preference is poor service and delays a request that should simply be honoured."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d5-5.2-c", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"A customer asks you to match a competitor's lower price. Your policy document covers price adjustments on your own site within 14 days but says nothing about competitor matching. What should the agent do?",
  options:[
    {k:"A", text:"Escalate, because the policy is silent on this request and a gap requires human judgement."},
    {k:"B", text:"Decline, since anything not explicitly permitted by policy should be refused."},
    {k:"C", text:"Apply the own-site adjustment policy by analogy, since the situations are similar."},
    {k:"D", text:"Approve the match, since customer satisfaction is the overriding objective."}
  ],
  correct:["A"],
  explain:{
    why:"A policy gap is a distinct escalation trigger from case complexity. The request is simple to understand but nobody has decided whether it is permitted, and that decision is not the agent's to invent.",
    distractors:{
      B:"Defaulting to refusal turns every unaddressed situation into a rejection, and may contradict what the business would actually want.",
      C:"Reasoning by analogy from an adjacent policy is the agent making policy, which is exactly what it should not do.",
      D:"Approving without authority creates a precedent and a financial commitment the agent is not empowered to make."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d5-5.2-d", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"`get_customer` returns three accounts matching the name and partial postcode the customer supplied. What should the agent do?",
  options:[
    {k:"A", text:"Ask the customer to supply an additional identifier, such as an order number or email address."},
    {k:"B", text:"Select the account with the most recent activity, as it is most likely the active one."},
    {k:"C", text:"Select the account whose details most closely match, and note the uncertainty in the response."},
    {k:"D", text:"Escalate to a human, since ambiguous identity requires manual verification."}
  ],
  correct:["A"],
  explain:{
    why:"Multiple matches call for clarification rather than a heuristic choice. Asking for one more identifier is quick, resolves the ambiguity definitively, and avoids acting on the wrong account.",
    distractors:{
      B:"Recency is a guess. Acting on the wrong account risks exposing one customer's data or refunding another's order.",
      C:"A closest match is still a guess, and a noted caveat does not undo a refund sent to the wrong person.",
      D:"Escalation is disproportionate when a single clarifying question resolves it, and it harms first-contact resolution."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d5-5.2-e", domain:5, ts:"5.2", scenario:1, type:"single",
  stem:"A visibly frustrated customer describes a delayed order that your agent can fully resolve with a standard reshipment. They have not asked for a human. What is the appropriate response?",
  options:[
    {k:"A", text:"Acknowledge the frustration and offer the resolution, escalating only if they insist."},
    {k:"B", text:"Escalate immediately, since frustration signals the case needs human handling."},
    {k:"C", text:"Resolve the issue without acknowledging the frustration at all, on the basis that the outcome is what really matters."},
    {k:"D", text:"Ask whether they would prefer to speak to a human before doing anything else."}
  ],
  correct:["A"],
  explain:{
    why:"Frustration is not a complexity signal. When the issue is squarely within the agent's capability, acknowledging how the customer feels and then resolving it is the better outcome, with escalation held in reserve if they ask.",
    distractors:{
      B:"Escalating on sentiment sends resolvable cases to humans and is the specific anti-pattern this objective warns against.",
      C:"Ignoring evident frustration reads as tone-deaf even when the outcome is correct.",
      D:"Offering escalation unprompted invites it, adding a handoff to a case that could have been closed in one contact."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d5-5.2-f", domain:5, ts:"5.2", scenario:1, type:"multi",
  stem:"Which two are legitimate escalation triggers? (Select 2.)",
  options:[
    {k:"A", text:"The customer explicitly asks to speak with a human."},
    {k:"B", text:"The policy is silent or ambiguous on the customer's specific request."},
    {k:"C", text:"The customer's message expresses strong negative sentiment."},
    {k:"D", text:"The model's self-reported confidence for this case falls below 0.7."}
  ],
  correct:["A","B"],
  explain:{
    why:"An explicit request and a genuine policy gap are both cases where the agent should not proceed alone: one because the customer decided, the other because nobody has decided. Inability to make meaningful progress is the third legitimate trigger.",
    distractors:{
      C:"Sentiment does not track complexity. Frustrated customers frequently have simple, quickly-resolved problems.",
      D:"Self-reported confidence is poorly calibrated, and an agent that mishandles hard cases is typically confident about them."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d5-5.3-a", domain:5, ts:"5.3", scenario:3, type:"single",
  stem:"The web search subagent times out while researching a complex topic. You are designing how that failure reaches the coordinator. Which approach best enables intelligent recovery?",
  options:[
    {k:"A", text:"Return structured error context: failure type, attempted query, partial results, alternatives."},
    {k:"B", text:"Retry internally with exponential backoff and return a generic 'search unavailable' status to the coordinator once all retries are exhausted."},
    {k:"C", text:"Catch the timeout within the subagent and return an empty result set marked successful."},
    {k:"D", text:"Propagate the timeout to a top-level handler that terminates the entire research workflow."}
  ],
  correct:["A"],
  explain:{
    why:"Structured error context is what lets the coordinator decide well: retry with a narrower query, try a different source, or proceed with partial results and annotate the gap. Each option requires knowing what failed and what was already obtained.",
    distractors:{
      B:"The internal retries are fine; discarding the context is not. A generic status hides everything the coordinator would use to choose a recovery.",
      C:"Marking failure as success is the silent-suppression anti-pattern. The coordinator concludes the topic was researched and found nothing.",
      D:"Terminating the whole workflow over one subagent's timeout discards all the other completed research."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d5-5.3-b", domain:5, ts:"5.3", scenario:3, type:"single",
  stem:"Why is returning an empty result set marked successful the worst of the common error-handling choices?",
  options:[
    {k:"A", text:"It prevents any recovery from happening and silently ships incomplete research as though it were complete."},
    {k:"B", text:"It causes the coordinator to retry indefinitely, since empty results trigger automatic re-delegation."},
    {k:"C", text:"It violates the MCP protocol, which requires the `isError` flag on every response."},
    {k:"D", text:"It consumes more context than a structured error, because empty arrays still serialise."}
  ],
  correct:["A"],
  explain:{
    why:"An error reported as success removes any chance of recovery, and the resulting report claims coverage of a topic that was never actually searched. A visible failure is far safer than an invisible one.",
    distractors:{
      B:"There is no automatic re-delegation on empty results; the coordinator accepts the success and moves on, which is the problem.",
      C:"`isError` is required only on actual errors, and the protocol violation is not why this is dangerous.",
      D:"Context cost is trivial and entirely beside the point."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d5-5.3-c", domain:5, ts:"5.3", scenario:3, type:"single",
  stem:"One of six topic areas could not be researched because its sources were unavailable. The other five are well covered. How should the synthesis output handle this?",
  options:[
    {k:"A", text:"Include coverage annotations distinguishing well-supported findings from gaps."},
    {k:"B", text:"Omit the sixth topic silently, on the basis that a report should present only the findings it can properly support."},
    {k:"C", text:"Fill the sixth topic from the model's background knowledge, marked as provisional."},
    {k:"D", text:"Fail the report and re-run the entire research pipeline from the start."}
  ],
  correct:["A"],
  explain:{
    why:"An explicit coverage annotation is honest and actionable: the reader knows which conclusions rest on evidence and which area remains open, and can decide whether the gap matters.",
    distractors:{
      B:"Silent omission misleads the reader into thinking the report is comprehensive, which is the failure mode the annotation exists to prevent.",
      C:"Background knowledge produces unsourced claims in a report whose value is that it is cited, and 'provisional' is easily lost downstream.",
      D:"Re-running everything discards five well-researched areas to retry one whose sources may still be unavailable."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d5-5.3-d", domain:5, ts:"5.3", scenario:3, type:"single",
  stem:"A subagent encounters a transient rate limit, backs off, retries and succeeds. Separately it hits a permission error it cannot resolve. What should it propagate?",
  options:[
    {k:"A", text:"Only the permission error, with what was attempted and any partial results."},
    {k:"B", text:"Both errors, so the coordinator has a complete picture of everything that went wrong."},
    {k:"C", text:"Neither, returning only the data it managed to gather."},
    {k:"D", text:"Only the rate limit, since transient failures indicate systemic problems the coordinator should know about."}
  ],
  correct:["A"],
  explain:{
    why:"The principle is local recovery for what can be resolved, propagation for what cannot. The rate limit was handled and needs no coordinator decision; the permission error blocks work and does.",
    distractors:{
      B:"Reporting the resolved rate limit adds noise to the coordinator's context and may trigger unnecessary recovery for something already fixed.",
      C:"Suppressing the permission error hides a genuine gap, so the coordinator believes coverage is complete.",
      D:"This is inverted: the transient error was resolved, and the unresolved permission error is the one requiring a decision."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d5-5.3-e", domain:5, ts:"5.3", scenario:3, type:"single",
  stem:"A coordinator receives 'search unavailable' from a subagent. Which recovery decision can it NOT make on that information alone?",
  options:[
    {k:"A", text:"Whether to retry with a narrower query, since it knows neither the query nor the partial results."},
    {k:"B", text:"Whether to log the failure for later analysis."},
    {k:"C", text:"Whether to mark the overall run as degraded."},
    {k:"D", text:"Whether to notify a human operator that one of the subagents has failed during the run."}
  ],
  correct:["A"],
  explain:{
    why:"An intelligent retry needs to know what was tried, why it failed and what if anything came back. A bare status supports only crude reactions, which is exactly why structured error context matters.",
    distractors:{
      B:"Logging requires only that something failed, which the status does convey.",
      C:"Marking the run degraded is a coarse decision the status supports.",
      D:"Notifying an operator likewise needs only the fact of failure."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d5-5.3-f", domain:5, ts:"5.3", scenario:3, type:"single",
  stem:"A subagent's query executes successfully against the source repository and matches zero documents. How should this be reported?",
  options:[
    {k:"A", text:"As a successful result containing zero matches, distinguished from an access failure."},
    {k:"B", text:"As an error, since returning nothing means the subagent did not fulfil its task."},
    {k:"C", text:"As a transient failure, so that the coordinator retries the query in case the search index was mid-update."},
    {k:"D", text:"As a partial result, leaving the coordinator to decide whether it was a failure."}
  ],
  correct:["A"],
  explain:{
    why:"A query that ran correctly and matched nothing is a valid, informative answer: there is no evidence in that source. Reporting it as success with zero matches is what lets the coordinator distinguish it from 'we could not look'.",
    distractors:{
      B:"The subagent did its job. Calling a genuine null result an error triggers pointless recovery for a query that will keep returning nothing.",
      C:"Speculating about an index update turns a definitive answer into wasted retries.",
      D:"'Partial' implies something was retrieved and something was not, which misrepresents a complete query with an empty result."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d5-5.4-a", domain:5, ts:"5.4", scenario:4, type:"single",
  stem:"Three hours into exploring a large codebase, the agent starts giving inconsistent answers and referring to 'typical repository patterns' rather than the specific classes it identified earlier. What is happening and what helps?",
  options:[
    {k:"A", text:"Context degradation; have the agent keep a scratchpad file and consult it later."},
    {k:"B", text:"The model is fatigued by the long session; restarting it with the same approach will restore the earlier accuracy."},
    {k:"C", text:"The repository changed during the session; re-read every file to refresh the analysis."},
    {k:"D", text:"The temperature setting has drifted upward over the session; reset it to a lower value."}
  ],
  correct:["A"],
  explain:{
    why:"Referring to typical patterns rather than specific discovered classes is the signature of findings having fallen out of context. A scratchpad on disk persists them independently of the context window, and can be consulted whenever needed.",
    distractors:{
      B:"Models do not fatigue, and restarting with the same approach reproduces the same degradation a few hours later.",
      C:"Nothing suggests the code changed, and re-reading everything would consume the context that is already under pressure.",
      D:"Temperature does not drift during a session; it is whatever each request specifies."
    }
  },
  refs:[{label:"API: Context windows", url:"https://platform.claude.com/docs/en/build-with-claude/context-windows"}] },

{ id:"d5-5.4-b", domain:5, ts:"5.4", scenario:4, type:"single",
  stem:"You need to answer 'where are all the test files?' and 'what does the refund flow depend on?' while keeping the main agent focused on high-level architecture. What is the right structure?",
  options:[
    {k:"A", text:"Spawn a subagent per question, so only the answers return to the main context."},
    {k:"B", text:"Have the main agent answer both directly, then run `/compact` afterwards."},
    {k:"C", text:"Answer both questions in a separate session and paste the results back into the main conversation."},
    {k:"D", text:"Defer both questions until the architectural work is complete."}
  ],
  correct:["A"],
  explain:{
    why:"Subagent delegation isolates verbose investigation in its own context while the main agent retains high-level coordination. The main conversation receives conclusions rather than thousands of lines of search output.",
    distractors:{
      B:"The verbose output enters the main context before `/compact` can act, and compaction summarises lossily rather than removing it cleanly.",
      C:"This works but is manual, and pasting large results back in reintroduces much of the bulk you avoided.",
      D:"The refund flow dependencies may well inform the architectural work, so deferring them is not free."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d5-5.4-c", domain:5, ts:"5.4", scenario:4, type:"single",
  stem:"You are moving from a completed discovery phase into an implementation phase that will use several subagents. What should you do at the transition?",
  options:[
    {k:"A", text:"Summarise the discovery phase and inject that summary into each subagent's context."},
    {k:"B", text:"Pass the full discovery transcript to each subagent so nothing is lost."},
    {k:"C", text:"Let each subagent rediscover what it needs, to avoid biasing it with prior conclusions."},
    {k:"D", text:"Store the discovery output in the coordinator's context only, and have subagents query the coordinator when they need it."}
  ],
  correct:["A"],
  explain:{
    why:"Subagents inherit nothing, so a compact summary injected into each prompt is what carries the discovery forward. Summarising first keeps that injection affordable across several subagents.",
    distractors:{
      B:"A full transcript per subagent multiplies the token cost and reintroduces the verbosity the phase boundary was a chance to shed.",
      C:"Rediscovery repeats work already done and risks each subagent reaching a different conclusion about the same code.",
      D:"Subagents cannot query the coordinator mid-execution; the prompt is the only channel in."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d5-5.4-d", domain:5, ts:"5.4", scenario:4, type:"single",
  stem:"A long-running multi-agent analysis must survive a process crash and resume without repeating completed work. What design supports this?",
  options:[
    {k:"A", text:"Each agent exports structured state, and the coordinator loads a manifest on resume."},
    {k:"B", text:"Increase the session timeout so the process is less likely to be terminated."},
    {k:"C", text:"Run all agents in a single process so a crash affects everything consistently."},
    {k:"D", text:"Rely on ordinary session resumption, which restores all of the subagent state automatically after a crash."}
  ],
  correct:["A"],
  explain:{
    why:"Explicit state export to durable storage plus a manifest the coordinator reads on resume makes recovery a first-class feature rather than an accident. Completed work is reloaded rather than repeated.",
    distractors:{
      B:"A longer timeout reduces one cause of interruption without providing any recovery when interruption happens anyway.",
      C:"Consistent total failure is not recovery; it just guarantees everything is lost together.",
      D:"Session resumption restores a conversation, not the internal state of subagents that ran within it."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d5-5.4-e", domain:5, ts:"5.4", scenario:2, type:"single",
  stem:"An extended session has filled with verbose discovery output and responses are slowing and losing precision. Which built-in command reduces context usage?",
  options:[
    {k:"A", text:"`/compact`"},
    {k:"B", text:"`/clear`"},
    {k:"C", text:"`/reset`"},
    {k:"D", text:"`/trim`"}
  ],
  correct:["A"],
  explain:{
    why:"`/compact` reduces context usage during extended sessions by condensing accumulated content, which is the documented remedy when a session fills with verbose discovery output.",
    distractors:{
      B:"Clearing discards the conversation entirely rather than condensing it, losing the analysis you want to keep.",
      C:"`/reset` is not the documented command for reducing context in an ongoing session.",
      D:"`/trim` is not a Claude Code command."
    }
  },
  refs:[{label:"Claude Code: Memory", url:"https://code.claude.com/docs/en/memory"}] },

{ id:"d5-5.4-f", domain:5, ts:"5.4", scenario:4, type:"single",
  stem:"What is the main advantage of a scratchpad file over relying on the conversation context for a multi-day investigation?",
  options:[
    {k:"A", text:"It persists across context boundaries, compaction and session ends."},
    {k:"B", text:"It is read faster than conversation context, improving response latency."},
    {k:"C", text:"It is automatically injected into every subagent's context without ever needing to be referenced."},
    {k:"D", text:"It is exempt from token costs, since file contents are not counted as input."}
  ],
  correct:["A"],
  explain:{
    why:"A file on disk is independent of the context window entirely. It survives compaction, session ends and crashes, which is exactly what a multi-day investigation needs.",
    distractors:{
      B:"Reading a file costs a tool call and adds latency rather than reducing it.",
      C:"Nothing is injected automatically; the agent must be told to read it.",
      D:"File contents consume input tokens like any other context once read."
    }
  },
  refs:[{label:"API: Context windows", url:"https://platform.claude.com/docs/en/build-with-claude/context-windows"}] },

{ id:"d5-5.5-a", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"Your extraction system reports 97% overall accuracy and the team proposes automating everything above a confidence threshold. What should you verify first?",
  options:[
    {k:"A", text:"Accuracy broken down by document type and by field, to confirm consistency."},
    {k:"B", text:"That the 97% was measured on a sample of at least 1,000 documents."},
    {k:"C", text:"That the confidence threshold has been set above the mean confidence observed across the corpus."},
    {k:"D", text:"That the extraction latency stays within limits at full automation volume."}
  ],
  correct:["A"],
  explain:{
    why:"An aggregate figure can hide a document type that performs far worse. If handwritten forms are 8% of the corpus and 60% accurate, the overall number still reads 97% while automation quietly fails that whole segment.",
    distractors:{
      B:"Sample size supports the aggregate's reliability but says nothing about variation between segments, which is the risk here.",
      C:"A threshold based on the corpus mean is arbitrary and unrelated to whether the confidence signal is calibrated.",
      D:"Latency is an operational concern that does not bear on extraction correctness."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d5-5.5-b", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"After automating high-confidence extractions, how should you keep measuring the error rate in that automated population?",
  options:[
    {k:"A", text:"Stratified random sampling of the high-confidence extractions, reviewed on an ongoing basis."},
    {k:"B", text:"Reviewing only extractions that downstream systems reject, since those are the known errors."},
    {k:"C", text:"Reviewing the lowest-confidence extractions within the automated band."},
    {k:"D", text:"Re-running extraction with a second model and reviewing only disagreements."}
  ],
  correct:["A"],
  explain:{
    why:"Stratified random sampling gives an unbiased view of the automated population, which is the only way to measure its true error rate and to detect novel error patterns that no existing check would flag.",
    distractors:{
      B:"Downstream rejections capture only errors that happen to break something, missing plausible-but-wrong values that pass silently.",
      C:"Sampling only the bottom of the band overstates the error rate and misses errors occurring at high confidence, which are the dangerous ones.",
      D:"Model agreement is a useful signal but two models share failure modes, so agreement on a wrong answer is common."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d5-5.5-c", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"You want confidence scores to be useful for routing rather than decorative. What makes them trustworthy?",
  options:[
    {k:"A", text:"Calibrating the review thresholds against a labelled validation set."},
    {k:"B", text:"Instructing the model to be conservative when assigning confidence."},
    {k:"C", text:"Averaging confidence across three runs of the same document."},
    {k:"D", text:"Normalising the scores so that they are uniformly distributed across the available range."}
  ],
  correct:["A"],
  explain:{
    why:"Raw self-reported confidence is not inherently calibrated. Comparing scores against known-correct labels tells you what a given score actually means in error-rate terms, which is what makes threshold routing sound.",
    distractors:{
      B:"Asking for conservatism shifts the scores without establishing any relationship between a score and an error rate.",
      C:"Averaging reduces variance but an average of three uncalibrated scores is still uncalibrated.",
      D:"Forcing a uniform distribution destroys whatever real signal the scores carried."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d5-5.5-d", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"Reviewer capacity covers about 15% of daily volume. Which routing strategy uses it best?",
  options:[
    {k:"A", text:"Route extractions with low confidence and those from ambiguous or contradictory documents."},
    {k:"B", text:"Route a uniform random 15% sample, so coverage is unbiased across the whole corpus."},
    {k:"C", text:"Route the 15% highest-value documents by monetary amount."},
    {k:"D", text:"Route the 15% longest documents, on the basis that document length correlates with extraction difficulty."}
  ],
  correct:["A"],
  explain:{
    why:"Reviewer time should go where errors are most likely. Low confidence and documents that are internally ambiguous are the two signals that best predict an extraction needing human adjudication.",
    distractors:{
      B:"Uniform sampling is right for measuring the error rate, but as a routing strategy it spends most reviewer time on extractions that were already correct.",
      C:"Monetary value indicates the cost of an error, which is worth weighing, but it does not indicate where errors are likely; a large clean invoice is easy to extract.",
      D:"Length is a weak proxy. A long well-structured document can be easier than a short ambiguous one."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d5-5.5-e", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"Field-level accuracy analysis shows 99% on invoice numbers, 98% on dates and 71% on line-item descriptions. Overall accuracy is 96%. What does this imply for automation?",
  options:[
    {k:"A", text:"Automate the high-accuracy fields and route line-item descriptions to review."},
    {k:"B", text:"Withhold automation entirely until every field reaches the same accuracy level."},
    {k:"C", text:"Automate everything, since 96% overall exceeds the typical threshold."},
    {k:"D", text:"Drop line-item descriptions from the schema entirely, on the basis that they cannot be extracted reliably."}
  ],
  correct:["A"],
  explain:{
    why:"Field-level analysis exists so routing can be field-level too. Two fields are clearly ready and one clearly is not, so mixed handling extracts most of the value while keeping human attention on the 29% failure rate.",
    distractors:{
      B:"Blocking all automation on the weakest field forfeits the substantial gains available on the strong ones.",
      C:"This is exactly the trap the segmentation revealed: the aggregate conceals a field failing nearly a third of the time.",
      D:"Removing a needed field solves the metric rather than the requirement; downstream systems presumably need those descriptions."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d5-5.5-f", domain:5, ts:"5.5", scenario:6, type:"single",
  stem:"Why is stratified sampling preferred over reviewing only flagged or failed extractions?",
  options:[
    {k:"A", text:"It detects novel error patterns that no existing check would flag."},
    {k:"B", text:"It requires fewer reviewer hours than reviewing flagged extractions."},
    {k:"C", text:"It produces a higher measured accuracy figure, which is considerably easier to report to stakeholders."},
    {k:"D", text:"It eliminates the need for confidence scoring altogether."}
  ],
  correct:["A"],
  explain:{
    why:"Reviewing only what your checks flagged can only ever confirm what those checks already detect. Sampling the whole high-confidence population is how you discover error modes nobody thought to check for.",
    distractors:{
      B:"Sampling is additional work, not a reduction.",
      C:"It typically reveals errors and lowers the measured figure, which is the point rather than a drawback.",
      D:"Sampling and confidence scoring are complementary; the sample is how you calibrate the scores."
    }
  },
  refs:[{label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"}] },

{ id:"d5-5.6-a", domain:5, ts:"5.6", scenario:3, type:"single",
  stem:"Two credible sources give different figures for the same market size: $4.2B and $5.1B. What should the synthesis output do?",
  options:[
    {k:"A", text:"Present both values with source attribution and annotate the conflict explicitly."},
    {k:"B", text:"Report the average of the two, noting that sources vary."},
    {k:"C", text:"Report the figure from the more recently published source."},
    {k:"D", text:"Omit the figure entirely, since it cannot be stated reliably from the sources."}
  ],
  correct:["A"],
  explain:{
    why:"Preserving both values with attribution lets the reader see that credible sources disagree and judge which methodology they trust. Different figures often reflect different definitions of the market rather than an error.",
    distractors:{
      B:"An average of two differently-defined measurements is a number no source supports and nobody can verify.",
      C:"Recency is not authority. The older figure may use the sounder methodology, and the discrepancy may not be temporal at all.",
      D:"Omission hides real information. The reader is better served by a documented disagreement than by silence."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d5-5.6-b", domain:5, ts:"5.6", scenario:3, type:"single",
  stem:"Reports from your system cite sources correctly at the analysis stage but lose attribution by the time synthesis produces the final output. What structural requirement fixes this?",
  options:[
    {k:"A", text:"Require subagents to output structured claim-source mappings that downstream agents must preserve and merge."},
    {k:"B", text:"Require the synthesis agent to add citations at the end based on the overall source list."},
    {k:"C", text:"Require the coordinator to verify every citation in the final report against the consolidated source list."},
    {k:"D", text:"Require subagents to include full source text with every finding so nothing is lost."}
  ],
  correct:["A"],
  explain:{
    why:"Attribution is lost at summarisation steps unless the claim-to-source link is an explicit, structured field that each hop is required to carry forward. Making it structural is what stops compression from discarding it.",
    distractors:{
      B:"Adding citations from a general source list at the end is guesswork about which source supported which claim.",
      C:"Verification can detect that a citation is wrong but cannot reconstruct the correct mapping once it is gone.",
      D:"Full source text is enormously expensive in context and still does not record which claim came from which passage."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d5-5.6-c", domain:5, ts:"5.6", scenario:3, type:"single",
  stem:"Two sources report adoption rates of 34% and 58%. One study collected data in 2023 and the other in 2026, but neither subagent recorded collection dates. What requirement prevents this being misread as a contradiction?",
  options:[
    {k:"A", text:"Require publication or data-collection dates in every subagent's structured output for each finding."},
    {k:"B", text:"Require subagents to reject sources older than two years."},
    {k:"C", text:"Require the synthesis step to report only the higher of any two conflicting figures."},
    {k:"D", text:"Require subagents to note whether a source is peer-reviewed."}
  ],
  correct:["A"],
  explain:{
    why:"With dates attached, a jump from 34% to 58% reads as growth over three years rather than as two sources disagreeing. Without them, genuine temporal change is indistinguishable from contradiction.",
    distractors:{
      B:"Discarding older sources throws away the historical baseline that makes the trend visible.",
      C:"Choosing the higher figure is arbitrary and would misreport a genuine decline.",
      D:"Peer-review status speaks to credibility, not to when the data was gathered, which is the variable here."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d5-5.6-d", domain:5, ts:"5.6", scenario:3, type:"single",
  stem:"A document-analysis subagent finds two contradictory values within a single source document. What should it do?",
  options:[
    {k:"A", text:"Complete the analysis with both values included and explicitly annotated."},
    {k:"B", text:"Halt and return an error, since the document cannot be analysed reliably."},
    {k:"C", text:"Select the value that appears in the document's own summary section, on the basis that it is authoritative."},
    {k:"D", text:"Silently exclude the contradictory figures and report the rest of the analysis."}
  ],
  correct:["A"],
  explain:{
    why:"The subagent's job is to report what the source says, including that it says two things. Annotating the conflict passes an accurate picture to the coordinator, which has the broader context needed to reconcile it.",
    distractors:{
      B:"An internal inconsistency in one figure does not invalidate the rest of a document's analysis.",
      C:"Summary sections are frequently where stale figures survive, so treating them as authoritative is unfounded.",
      D:"Silent exclusion loses information the reader needs and hides a genuine quality signal about the source."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d5-5.6-e", domain:5, ts:"5.6", scenario:3, type:"single",
  stem:"Your final report presents all findings in one uniform bulleted format, and readers report that financial comparisons are hard to follow and news context reads as disjointed fragments. What is the guidance?",
  options:[
    {k:"A", text:"Render each content type appropriately: financial data as tables, news as prose."},
    {k:"B", text:"Keep the uniform format for the sake of consistency, and add a preamble explaining to readers how to read it."},
    {k:"C", text:"Convert everything to prose, which reads most naturally for all content types."},
    {k:"D", text:"Split the report into separate documents, one per content type."}
  ],
  correct:["A"],
  explain:{
    why:"Different content has different natural structure. Comparative financial figures belong in a table where columns align; narrative context belongs in prose. Flattening everything into one format destroys the structure that makes each readable.",
    distractors:{
      B:"An explanation of a poor format does not make the format serve the content.",
      C:"Prose is a poor vehicle for multi-dimensional numeric comparison, which is exactly what readers are struggling with.",
      D:"Splitting fragments the narrative and forces the reader to reassemble a picture the report should present whole."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d5-5.6-f", domain:5, ts:"5.6", scenario:3, type:"single",
  stem:"How should a report distinguish findings supported by several concordant sources from those resting on one contested claim?",
  options:[
    {k:"A", text:"Use explicit sections separating well-established findings from contested ones."},
    {k:"B", text:"Order findings by number of supporting sources, leaving the ranking to imply confidence."},
    {k:"C", text:"Include only well-established findings, omitting anything contested."},
    {k:"D", text:"Attach a numeric confidence score to each finding and let readers apply whatever threshold they prefer."}
  ],
  correct:["A"],
  explain:{
    why:"Explicit sectioning makes the epistemic status unmissable, and preserving how each source characterised its own finding, including its methodological caveats, lets readers evaluate the disagreement themselves.",
    distractors:{
      B:"Ordering is an implicit signal readers routinely miss, and source count is a crude proxy for how well-established something is.",
      C:"Contested findings are often the most important, and omitting them presents false consensus.",
      D:"A synthesised numeric score compresses away the reasons for disagreement, which is what a reader needs in order to judge."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },
