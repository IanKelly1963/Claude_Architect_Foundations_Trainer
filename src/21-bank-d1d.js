
/* ---- Domain 1 expansion: task statements 1.3 and 1.4 ---- */

{ id:"d1-1.3-h", domain:1, ts:"1.3", scenario:3, type:"single",
  stem:"Your coordinator passes the synthesis subagent a 40,000-token dump of raw search results. The subagent's report is shallow and misses several findings buried in the middle. What should the coordinator pass instead?",
  options:[
    {k:"A", text:"Structured findings pairing claim, excerpt and source, not raw retrieved text."},
    {k:"B", text:"The same dump, split across several sequential Task calls to the same subagent."},
    {k:"C", text:"A summary the coordinator writes itself, discarding the underlying source material."},
    {k:"D", text:"The raw dump unchanged, with an instruction to read through it twice before drawing any conclusions."}
  ],
  correct:["A"],
  explain:{
    why:"Raw retrieval is mostly noise, and material in the middle of a very long input is the least reliably attended. Structured findings carry what synthesis needs at a fraction of the tokens, and keep attribution attached to each claim.",
    distractors:{
      B:"Splitting helps with sheer length, but each call still receives unstructured text, and the subagent now cannot see all the findings together to combine them.",
      C:"A coordinator-written summary is more compact, but it strips the evidence and sources that make a synthesised report citable.",
      D:"Instructing more careful reading does not change the attention profile of a very long input; the middle stays weakest."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.3-i", domain:1, ts:"1.3", scenario:4, type:"single",
  stem:"A coordinator spawns an exploration subagent with the prompt 'Investigate the authentication module.' The subagent returns a general description of authentication patterns rather than findings about this codebase. What is missing?",
  options:[
    {k:"A", text:"The paths, entry points and specific questions that make the task concrete."},
    {k:"B", text:"A tool restriction limiting the subagent to read-only operations."},
    {k:"C", text:"A larger model, since the assigned model lacked the depth for code analysis."},
    {k:"D", text:"An instruction to avoid drawing on background knowledge of authentication patterns."}
  ],
  correct:["A"],
  explain:{
    why:"A subagent inherits nothing, so 'the authentication module' names something it cannot locate. With no starting path and no specific question, describing authentication in general is the only response the prompt actually supports.",
    distractors:{
      B:"Read-only restrictions are good hygiene for exploration, but they constrain what the subagent may do rather than telling it where to look.",
      C:"Model capability is not the limit here; no model can investigate a module it has not been pointed at.",
      D:"Forbidding background knowledge removes the fallback without supplying the specifics, so the subagent would have even less to work with."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.3-j", domain:1, ts:"1.3", scenario:3, type:"single",
  stem:"You define a subagent whose description reads 'Handles analysis tasks.' The coordinator routes document analysis, statistical work and code review to it indiscriminately. What is the fix?",
  options:[
    {k:"A", text:"Rewrite the description to state the specific work it does and what it should not receive."},
    {k:"B", text:"Add a tool restriction so it can only perform document analysis."},
    {k:"C", text:"Give the coordinator a routing table mapping task keywords to subagent names."},
    {k:"D", text:"Rename the subagent to `document_analysis_agent` and leave the description as it is."}
  ],
  correct:["A"],
  explain:{
    why:"The description is what the coordinator reads when choosing, and 'handles analysis tasks' matches all three kinds of work. Naming the intended scope and the boundary against neighbours is what makes the choice determinate.",
    distractors:{
      B:"Restricting tools stops the subagent doing the wrong work well, but it is still selected for it, so those tasks now fail instead of being routed elsewhere.",
      C:"A keyword table is brittle and duplicates a decision the description should already support, though it is a reasonable fallback when descriptions genuinely cannot disambiguate.",
      D:"A better name helps a little, but the description is the primary signal and it still claims all analysis work."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.3-k", domain:1, ts:"1.3", scenario:1, type:"single",
  stem:"A support coordinator invokes a refund subagent with 'Process the refund we discussed.' The subagent asks which order it should refund. Why?",
  options:[
    {k:"A", text:"It has no access to the conversation, so 'we discussed' refers to nothing it can see."},
    {k:"B", text:"The refund tool requires an order ID that this particular subagent lacks permission to look up."},
    {k:"C", text:"The coordinator's context exceeded the size that can be inherited on invocation."},
    {k:"D", text:"Subagents receive the conversation history only on their second and later invocations."}
  ],
  correct:["A"],
  explain:{
    why:"The prompt is the only channel into a subagent. A reference back to a shared conversation is empty from inside an isolated context, so the subagent asks for the one fact it needs and was not given.",
    distractors:{
      B:"A permissions problem would surface as a tool error rather than a clarifying question about which order was meant.",
      C:"Nothing is inherited at any size, so there is no threshold that was crossed here.",
      D:"No invocation inherits history, first or later; each one starts from its prompt alone."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.3-l", domain:1, ts:"1.3", scenario:4, type:"single",
  stem:"You want two subagents to explore the same repository concurrently, one tracing data flow and one cataloguing tests. Which coordinator behaviour achieves that?",
  options:[
    {k:"A", text:"Both Task calls emitted in one assistant turn, each with its own scoped prompt."},
    {k:"B", text:"One Task call whose prompt asks a single subagent to perform both investigations."},
    {k:"C", text:"Two Task calls in consecutive turns, with the second one referencing the first."},
    {k:"D", text:"One Task call repeated twice with the same prompt, relying on sampling variation."}
  ],
  correct:["A"],
  explain:{
    why:"Concurrency comes from multiple Task calls within a single assistant turn. Separate scoped prompts also keep each subagent's context focused on one question rather than two.",
    distractors:{
      B:"A single subagent doing both runs them sequentially inside one context, which is the serialisation you were trying to avoid.",
      C:"Calls in consecutive turns are sequential by construction, since each turn must return before the next begins.",
      D:"Identical prompts produce overlapping work rather than two different investigations, whatever the sampling does."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.3-m", domain:1, ts:"1.3", scenario:3, type:"single",
  stem:"Your subagent definitions all specify the same broad tool set. The document-analysis agent begins issuing web searches when its assigned sources are thin. What does this illustrate?",
  options:[
    {k:"A", text:"An agent given tools beyond its role will use them when its own path is blocked."},
    {k:"B", text:"Tool definitions leak between subagents when they share a coordinator."},
    {k:"C", text:"Document analysis cannot be performed without a web search capability."},
    {k:"D", text:"The coordinator failed to specify which tool each of the subagents ought to call first."}
  ],
  correct:["A"],
  explain:{
    why:"Availability drives use. Faced with thin sources and a search tool in reach, the agent takes the path that produces an answer, which quietly turns your analysis specialist into a second-rate researcher.",
    distractors:{
      B:"Each subagent's tools come from its own definition; nothing is inherited from a sibling.",
      C:"Document analysis operates on supplied documents, and needing to search for more is a sign the assignment was underspecified.",
      D:"Dictating call order would constrain the symptom without removing the capability that made it possible."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.3-n", domain:1, ts:"1.3", scenario:1, type:"single",
  stem:"A coordinator prompt for an escalation subagent reads: 'Escalate this. Include everything relevant.' Handoffs vary widely in what they contain. What would improve consistency most?",
  options:[
    {k:"A", text:"Naming the required fields, so every handoff carries the same structure."},
    {k:"B", text:"Asking the subagent to be thorough and to double-check before submitting."},
    {k:"C", text:"Giving the subagent access to the full transcript so it can decide what matters."},
    {k:"D", text:"Increasing the subagent's output token limit so that nothing is truncated."}
  ],
  correct:["A"],
  explain:{
    why:"'Everything relevant' is a judgement the subagent re-makes each time. Listing customer ID, root cause, amount and recommended action turns it into a form to complete, which is why the output stops varying.",
    distractors:{
      B:"Thoroughness instructions raise effort without defining what a complete handoff contains, so the variation persists.",
      C:"More material to sift through widens the judgement rather than narrowing it, and the human receiving the handoff still gets a different shape each time.",
      D:"Truncation is not the issue; the handoffs differ in what they choose to include, not in being cut off."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.3-o", domain:1, ts:"1.3", scenario:4, type:"single",
  stem:"An engineer argues that since subagents cannot see the parent conversation, the coordinator should paste its entire history into every subagent prompt. What is the objection?",
  options:[
    {k:"A", text:"It spends the subagent's context on material irrelevant to its narrow task."},
    {k:"B", text:"Conversation history cannot be embedded in a Task prompt for structural reasons."},
    {k:"C", text:"The subagent would then inherit the coordinator's tools along with its history."},
    {k:"D", text:"Pasted history is treated as instructions, so the subagent would follow the user's earlier requests."}
  ],
  correct:["A"],
  explain:{
    why:"Isolation exists so a subagent works in a clean window on one question. Pasting everything in forfeits that benefit and pushes the relevant instruction into the middle of a long input, where it is least reliably read.",
    distractors:{
      B:"History is just text and embeds fine; the objection is about what it costs, not whether it is possible.",
      C:"Tools come from the subagent's own definition and are unaffected by what its prompt contains.",
      D:"This is a real hazard worth care in prompt construction, but it is a framing problem rather than the primary reason to avoid wholesale pasting."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.3-p", domain:1, ts:"1.3", scenario:3, type:"single",
  stem:"You need the synthesis subagent to keep source attribution intact. Which prompt structure best supports that?",
  options:[
    {k:"A", text:"Discrete records pairing claim, source and excerpt."},
    {k:"B", text:"Findings as prose, with a numbered bibliography appended at the end."},
    {k:"C", text:"Findings as prose, with an instruction to cite carefully throughout."},
    {k:"D", text:"Findings as prose, followed by the full text of every source consulted."}
  ],
  correct:["A"],
  explain:{
    why:"Attribution survives a hop when the claim-to-source link is a structural property of the input rather than something to be inferred. Discrete records make the mapping explicit and hard to lose in compression.",
    distractors:{
      B:"A detached bibliography lists what was read without saying which entry supports which claim, so the mapping must be guessed.",
      C:"An instruction to cite carefully cannot recover a mapping the input never contained.",
      D:"Full source text is expensive and still leaves the subagent to work out which passage backs which statement."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.3-q", domain:1, ts:"1.3", scenario:1, type:"single",
  stem:"Which statement about the `AgentDefinition` tools field is correct?",
  options:[
    {k:"A", text:"It bounds what the subagent may do, but not whether it is selected."},
    {k:"B", text:"It is the primary signal the coordinator uses when choosing between subagents."},
    {k:"C", text:"It is merged with the coordinator's own tool set at invocation time."},
    {k:"D", text:"It must list every tool the coordinator holds, or the invocation is rejected."}
  ],
  correct:["A"],
  explain:{
    why:"Selection happens before invocation and is driven by the description. The tool list takes effect afterwards, constraining what the chosen subagent can actually do.",
    distractors:{
      B:"The description carries the selection signal; the tool list is not what the coordinator reads when deciding.",
      C:"Tool sets are per-definition and are not merged, which is precisely how scoped access is achieved.",
      D:"A subagent normally holds a narrower set than its coordinator, and that difference is the point."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.3-r", domain:1, ts:"1.3", scenario:6, type:"single",
  stem:"An extraction coordinator invokes a validation subagent after each document. The validator reports every document as valid, including ones with obvious field errors. Its prompt contains only the extracted JSON. What is missing?",
  options:[
    {k:"A", text:"The source document, without which there is nothing to check against."},
    {k:"B", text:"A stricter instruction emphasising that it should look hard for errors."},
    {k:"C", text:"The JSON schema, so the validator can confirm the structure is well formed."},
    {k:"D", text:"Field-level confidence scores from the extraction step to guide its attention."}
  ],
  correct:["A"],
  explain:{
    why:"Validation is a comparison. Given only the output, the validator can confirm it looks like a well-formed record but has nothing to check the values against, so everything passes.",
    distractors:{
      C:"A schema catches structural problems, but tool-use extraction has already guaranteed those; the errors here are in the values.",
      B:"Exhortation cannot supply the missing half of a comparison, so the validator would look hard at the only thing it has.",
      D:"Confidence scores help route attention, but with no source to compare against there is still nothing to verify."
    }
  },
  refs:[R_STRUCT] },

{ id:"d1-1.3-s", domain:1, ts:"1.3", scenario:2, type:"single",
  stem:"You are exploring two refactoring strategies from a shared codebase analysis, and want each branch to inherit that analysis without seeing the other's reasoning. Which mechanism fits?",
  options:[
    {k:"A", text:"Forking once the analysis is complete, so both branches share a baseline."},
    {k:"B", text:"Spawning two subagents, each passed the analysis in its prompt."},
    {k:"C", text:"Running both strategies in one session and comparing at the end."},
    {k:"D", text:"Resuming the analysis session twice in sequence, once per strategy."}
  ],
  correct:["A"],
  explain:{
    why:"Forking is built for divergent exploration from a common point: both branches carry the completed analysis and then evolve independently, which is exactly the comparison you want.",
    distractors:{
      B:"Subagents would work, but each pays to re-ingest the analysis through its prompt and returns a summary rather than an explorable branch you can continue.",
      C:"One session means the second strategy is anchored on the first, which is the contamination the requirement rules out.",
      D:"Sequential resumption of the same session carries the first exploration into the second, so the branches are not independent."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.3-t", domain:1, ts:"1.3", scenario:4, type:"single",
  stem:"A coordinator emits three Task calls in one turn. Two subagents succeed and one fails. What should the coordinator receive?",
  options:[
    {k:"A", text:"All three results together, with the failure reported as such alongside the two successes."},
    {k:"B", text:"Only the two successful results, with the failure retried transparently before anything is returned to the coordinator."},
    {k:"C", text:"An error for the whole turn, since one call in the batch did not complete."},
    {k:"D", text:"The two successes immediately and the failure in a later turn once it resolves."}
  ],
  correct:["A"],
  explain:{
    why:"Every call in the turn is answered, and a failure is a legitimate answer. The coordinator can then decide whether to proceed on partial results, re-delegate, or annotate a gap.",
    distractors:{
      B:"Silent retries hide information the coordinator may want, and if the retry also fails you have delayed the decision without improving it.",
      C:"Failing the whole turn discards two successful investigations over one problem that may well be routable around.",
      D:"Deferring part of a turn leaves calls unanswered within it, which is not a valid continuation of that turn."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.4-h", domain:1, ts:"1.4", scenario:1, type:"single",
  stem:"Your prerequisite gate blocks `process_refund` until `get_customer` succeeds. A customer with a verified identity is refused because the verification happened three turns earlier and the gate only inspects the current turn. What is the defect?",
  options:[
    {k:"A", text:"The gate should evaluate conversation state, not a single turn."},
    {k:"B", text:"The gate should be removed, since it now blocks legitimate refunds."},
    {k:"C", text:"`get_customer` should be re-called before every refund regardless of prior verification."},
    {k:"D", text:"The gate should trust the model's assertion that verification already occurred."}
  ],
  correct:["A"],
  explain:{
    why:"The prerequisite is a property of the conversation: this customer has been verified. Scoping the check to one turn makes a satisfied condition look unsatisfied whenever the steps are not adjacent.",
    distractors:{
      B:"Removing the gate reinstates the unverified-refund risk it exists to prevent, trading a false refusal for a real financial error.",
      C:"Re-verifying every time is safe and would work, but it adds a redundant call to every refund to compensate for a gate that is simply looking in the wrong place.",
      D:"Trusting the model's word reduces the gate to a prompt instruction, discarding the deterministic guarantee that motivated it."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.4-i", domain:1, ts:"1.4", scenario:1, type:"single",
  stem:"A customer raises three issues. Your agent investigates all three in parallel, then sends three separate replies in quick succession. First-contact resolution does not improve. What step was skipped?",
  options:[
    {k:"A", text:"Synthesising the findings into one reply that resolves the contact as a whole."},
    {k:"B", text:"Investigating the issues sequentially so each reply reflects the previous one."},
    {k:"C", text:"Asking the customer to confirm the three issues before starting work."},
    {k:"D", text:"Escalating the contact, since three concurrent issues exceed autonomous handling."}
  ],
  correct:["A"],
  explain:{
    why:"Decomposition is only half the pattern. Three replies leave the customer to assemble their own resolution and may contradict one another on shared facts such as the refund total.",
    distractors:{
      B:"Sequential investigation costs latency and does not by itself produce a single coherent reply.",
      C:"A confirmation round adds a turn before any work starts, which pushes resolution further away rather than closer.",
      D:"Three routine issues are well within autonomous capability; escalating them wastes human capacity and fails the target outright."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.4-j", domain:1, ts:"1.4", scenario:4, type:"single",
  stem:"A developer-productivity agent must never modify files outside the repository. Which control gives that guarantee?",
  options:[
    {k:"A", text:"Intercepting write calls and denying any path that resolves outside the project root."},
    {k:"B", text:"A CLAUDE.md instruction stating that files outside the repository are off limits."},
    {k:"C", text:"Removing the Write tool, leaving only Read and Grep available."},
    {k:"D", text:"Few-shot examples showing the agent declining out-of-repository edits."}
  ],
  correct:["A"],
  explain:{
    why:"Path resolution at the point of the call is deterministic: the check sees the actual target and can refuse it. That is what makes the boundary hold regardless of how the model reasoned about the request.",
    distractors:{
      B:"CLAUDE.md is context rather than enforcement, which the documentation states plainly; it lowers the rate without removing it.",
      C:"Removing writes does enforce it absolutely, but it also removes the agent's ability to do the editing work it exists for.",
      D:"Examples shape behaviour probabilistically and offer no guarantee on the case that was never exemplified."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.4-k", domain:1, ts:"1.4", scenario:1, type:"single",
  stem:"Your escalation handoff includes customer ID, root cause, amount and recommended action. Human agents still ask the customer to repeat what happened. What is likely missing?",
  options:[
    {k:"A", text:"What the agent already told the customer, so the human does not repeat it."},
    {k:"B", text:"The full conversation transcript appended to the structured fields."},
    {k:"C", text:"A confidence score indicating how certain the agent is about the root cause."},
    {k:"D", text:"The timestamps of each tool call the agent made over the course of the investigation."}
  ],
  correct:["A"],
  explain:{
    why:"The handoff describes the case but not the conversation. Without knowing what has already been said and promised, the human has to re-establish it with the customer, which is what the structured summary was meant to prevent.",
    distractors:{
      B:"A transcript contains the information but returns the human to reading the whole exchange, which is the cost the summary exists to remove.",
      C:"A self-reported confidence figure is poorly calibrated and tells the human nothing about what the customer has been told.",
      D:"Call timestamps support debugging the agent rather than resuming the conversation."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.4-l", domain:1, ts:"1.4", scenario:3, type:"single",
  stem:"A research coordinator must always run a fact-check pass before publishing. The team disagrees on whether to enforce it in the pipeline or instruct it in the coordinator prompt. What determines the answer?",
  options:[
    {k:"A", text:"Whether a single unchecked publication is acceptable."},
    {k:"B", text:"Whether the fact-check step takes longer than the synthesis step."},
    {k:"C", text:"Whether the coordinator uses a model large enough to follow multi-step instructions."},
    {k:"D", text:"Whether the pipeline already contains other programmatic gates."}
  ],
  correct:["A"],
  explain:{
    why:"The criterion is the cost of the exception, not the shape of the workflow. If one unchecked report reaching a customer is tolerable, a prompt is proportionate; if it is not, only a gate gives the guarantee.",
    distractors:{
      B:"Relative duration affects scheduling and cost, not whether the ordering can be allowed to fail occasionally.",
      C:"Larger models comply more often, but more often is still not always, and the decision turns on whether the residual matters.",
      D:"Consistency with existing gates is a reasonable secondary consideration, but it does not tell you whether this step needs one."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.4-m", domain:1, ts:"1.4", scenario:1, type:"single",
  stem:"A hook blocks a $900 refund. The agent tells the customer 'That request was denied by policy' and closes. What is wrong with this outcome?",
  options:[
    {k:"A", text:"A blocked action should route into the alternative workflow, not terminate the contact."},
    {k:"B", text:"The agent should have retried the refund at a lower amount to stay within policy."},
    {k:"C", text:"The block should have been silent, so the customer never learns a limit exists."},
    {k:"D", text:"The hook should have allowed the refund and flagged it for later audit."}
  ],
  correct:["A"],
  explain:{
    why:"The threshold marks the point where a human decides, not where the customer's claim becomes invalid. Handing the case to escalation keeps the policy intact and still resolves the customer's issue.",
    distractors:{
      B:"Silently reducing the amount gives the customer less than they are owed while implying the matter is settled.",
      C:"Concealing the reason leaves the customer with no path forward and no idea why, which is worse service than an honest referral.",
      D:"Allowing it and auditing afterwards means the money has already moved, which is exactly what the threshold exists to prevent."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.4-n", domain:1, ts:"1.4", scenario:4, type:"single",
  stem:"A team wants generated code to always be formatted before commit. They are choosing between a prompt instruction, a skill, and a hook. Which gives the guarantee, and why?",
  options:[
    {k:"A", text:"A hook, because it runs at a fixed lifecycle point regardless of what the model decides."},
    {k:"B", text:"A skill, because its frontmatter can restrict tools to formatting operations."},
    {k:"C", text:"A prompt instruction, because formatting is simple enough to be followed reliably."},
    {k:"D", text:"Any of the three, since all are equally binding once configured."}
  ],
  correct:["A"],
  explain:{
    why:"Hooks execute as shell commands at defined lifecycle events, so the formatter runs whether or not the model thought of it. That is the property the requirement asks for.",
    distractors:{
      B:"A skill has to be invoked, so a commit that never invokes it is never formatted.",
      C:"Simplicity raises the compliance rate but does not make it certain, and 'always' rules out a residual.",
      D:"Only the hook is enforced by the harness; the other two shape behaviour without binding it."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.4-o", domain:1, ts:"1.4", scenario:1, type:"multi",
  stem:"Which two facts belong in a structured escalation handoff to a human agent who cannot see the conversation? (Select 2.)",
  options:[
    {k:"A", text:"The diagnosed root cause of the customer's problem."},
    {k:"B", text:"The specific action the agent recommends the human take."},
    {k:"C", text:"The number of tool calls the agent made while investigating."},
    {k:"D", text:"The model and temperature settings used for the conversation."}
  ],
  correct:["A","B"],
  explain:{
    why:"The human needs to understand the case and know what is being proposed. Root cause and recommended action are the two things that let them verify quickly and act, rather than restarting the investigation.",
    distractors:{
      C:"Call count is an operational metric. It says nothing about what the customer needs.",
      D:"Model configuration matters when debugging the agent, not when resolving the customer's issue."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.4-p", domain:1, ts:"1.4", scenario:5, type:"single",
  stem:"A CI pipeline must not post review comments when the test suite failed, because the failures make the diff misleading. Where does this belong?",
  options:[
    {k:"A", text:"In the pipeline, gating the review job on the test job's exit status."},
    {k:"B", text:"In the review prompt, telling Claude to check whether tests passed first."},
    {k:"C", text:"In CLAUDE.md, documenting that reviews assume a green test suite."},
    {k:"D", text:"In a post-processing filter that deletes comments after they are posted."}
  ],
  correct:["A"],
  explain:{
    why:"Job ordering is exactly what a pipeline expresses, and an exit-status dependency cannot be talked out of. The review simply does not run.",
    distractors:{
      B:"This asks the model to check something the pipeline already knows, and it can misread or skip the check.",
      C:"Documenting an assumption records the intent without preventing the run.",
      D:"Deleting after posting means reviewers have already seen and possibly acted on misleading comments."
    }
  },
  refs:[R_HEAD] },

{ id:"d1-1.4-q", domain:1, ts:"1.4", scenario:4, type:"single",
  stem:"An engineer adds a gate requiring `run_tests` before `commit_changes`. The agent now calls `run_tests` with an empty filter to satisfy the gate cheaply. What does this reveal?",
  options:[
    {k:"A", text:"The gate checks that a call happened, not that it accomplished anything."},
    {k:"B", text:"Gates cannot inspect the arguments of the calls they intercept."},
    {k:"C", text:"The agent is behaving adversarially and should be given a stricter system prompt."},
    {k:"D", text:"Prerequisite gates are unsuitable for any workflow involving test execution."}
  ],
  correct:["A"],
  explain:{
    why:"A prerequisite expressed as 'this tool was invoked' is satisfied by any invocation. Conditioning on the result instead, such as a non-empty run that passed, closes the gap.",
    distractors:{
      B:"Arguments and results are both available at interception, which is precisely how the stronger condition can be written.",
      C:"The agent is satisfying the stated condition in the cheapest way, which is ordinary behaviour rather than adversarial intent.",
      D:"Gates work well here; this one was simply specified too loosely."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.4-r", domain:1, ts:"1.4", scenario:6, type:"single",
  stem:"An extraction pipeline must never write to the downstream database when validation failed. Which design makes that structurally impossible?",
  options:[
    {k:"A", text:"Making the write step consume the validator's output, so it cannot run without a pass."},
    {k:"B", text:"Instructing the agent to check validation status before calling the write tool."},
    {k:"C", text:"Logging validation failures so a human can reverse any bad writes afterwards."},
    {k:"D", text:"Running validation and writing concurrently to reduce total latency."}
  ],
  correct:["A"],
  explain:{
    why:"A data dependency is stronger than a rule about ordering: with nothing to consume, the write has no input and cannot proceed. The constraint stops being something anyone has to remember.",
    distractors:{
      B:"An instruction is followed most of the time, and the exceptions are corrupt rows in the database.",
      C:"Reversal is after the fact, and downstream consumers may already have read the bad data.",
      D:"Concurrency removes the ordering guarantee entirely, allowing a write before validation completes."
    }
  },
  refs:[R_STRUCT] },

{ id:"d1-1.4-s", domain:1, ts:"1.4", scenario:1, type:"single",
  stem:"Your team asks why the refund threshold is enforced in a hook rather than simply given to the model as a rule, when the model has never violated it in testing. What is the strongest response?",
  options:[
    {k:"A", text:"Testing bounds the observed rate, not the true one."},
    {k:"B", text:"Hooks execute faster than the model's own reasoning about the threshold."},
    {k:"C", text:"Models cannot compare numeric values reliably enough to apply a threshold."},
    {k:"D", text:"Prompt rules stop applying once the conversation exceeds the context window."}
  ],
  correct:["A"],
  explain:{
    why:"A clean test run raises confidence without establishing that the rate is zero, and production inputs are more varied than any test set. When each exception is an unauthorised payment, the residual is the entire concern.",
    distractors:{
      B:"Latency is negligible either way and is not why the control exists.",
      C:"Models compare numbers perfectly well; the issue is compliance under unusual framing, not arithmetic.",
      D:"Long conversations do dilute instructions, but the rule does not simply switch off at a boundary, and the argument would not hold for short ones."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.4-t", domain:1, ts:"1.4", scenario:3, type:"single",
  stem:"A research coordinator must cite every statistic in the final report. Which approach makes an uncited statistic structurally unlikely rather than merely discouraged?",
  options:[
    {k:"A", text:"Requiring each finding to arrive already bound to its source."},
    {k:"B", text:"Instructing the synthesis agent to add a citation to every number it writes."},
    {k:"C", text:"Running a checker that flags uncited statistics after the report is produced."},
    {k:"D", text:"Limiting the report to statistics that appeared in more than one source."}
  ],
  correct:["A"],
  explain:{
    why:"If the only statistics in scope arrive already bound to a source, writing an uncited one means inventing it rather than merely omitting a citation. The structure of the input carries the guarantee.",
    distractors:{
      B:"The instruction is sound, but a synthesis agent handed unattributed numbers has nothing to cite them to.",
      C:"A checker catches the problem after the fact and cannot recover the mapping once it is lost.",
      D:"Corroboration is a different quality bar, and single-source statistics are often the most important ones in the report."
    }
  },
  refs:[R_SUB] },
