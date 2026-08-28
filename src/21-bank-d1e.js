
/* ---- Domain 1 expansion: task statements 1.5, 1.6 and 1.7 ---- */

{ id:"d1-1.5-h", domain:1, ts:"1.5", scenario:1, type:"single",
  stem:"Three MCP tools return customer status as `active`, `1`, and `ACTIVE_SUBSCRIBER`. The agent applies different eligibility rules depending on which tool it happened to call. What is the cleanest fix?",
  options:[
    {k:"A", text:"Normalise the status vocabulary in a `PostToolUse` hook."},
    {k:"B", text:"Document each tool's status vocabulary in the system prompt and let the agent translate between them as needed."},
    {k:"C", text:"Add few-shot examples covering eligibility decisions for each of the three status formats."},
    {k:"D", text:"Have the agent call all three tools every time and take the majority status value."}
  ],
  correct:["A"],
  explain:{
    why:"Reshaping results on the way back is what `PostToolUse` is for. One conversion in code, applied to every call, removes the ambiguity before the model ever reasons about eligibility.",
    distractors:{
      B:"This does work much of the time, but it asks the model to perform a translation on every decision, and the failures are silent eligibility errors rather than visible ones.",
      C:"Examples raise accuracy without removing the underlying inconsistency, so a fourth backend or an unusual value reintroduces it.",
      D:"Calling three backends for one fact triples cost and latency, and a majority vote across different vocabularies is not meaningful."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.5-i", domain:1, ts:"1.5", scenario:4, type:"single",
  stem:"You want to log every file an agent reads for an audit trail, without changing what the agent sees. Which hook fits?",
  options:[
    {k:"A", text:"`PostToolUse`, recording the call and returning the result unchanged."},
    {k:"B", text:"`PreToolUse` returning `deny`, then re-issuing the call yourself after logging it."},
    {k:"C", text:"`Stop`, which fires once per turn and can enumerate the tools that were used."},
    {k:"D", text:"`PostToolUse` with `updatedToolOutput` set to the original content plus a log marker."}
  ],
  correct:["A"],
  explain:{
    why:"Observation without modification is the simplest use of a post-execution hook: you see the call and its result, write your record, and pass the output through untouched.",
    distractors:{
      B:"Denying and re-issuing changes the control flow, risks double execution, and surfaces a denial the model has to reason about.",
      C:"A turn-level event can report that tools ran but is a poor place to capture per-call arguments, and it fires too late for a per-read trail.",
      D:"Appending a marker satisfies the logging requirement but violates the constraint that the agent's view stays unchanged."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.5-j", domain:1, ts:"1.5", scenario:1, type:"single",
  stem:"A `PreToolUse` hook returns `ask` for refunds between $200 and $500. What behaviour does that produce?",
  options:[
    {k:"A", text:"The decision is escalated to the user rather than settled in the hook."},
    {k:"B", text:"The call is blocked, and the model is told to try a smaller amount."},
    {k:"C", text:"The call proceeds, and a warning is attached to the result."},
    {k:"D", text:"The hook defers to the next hook in the chain for that tool."}
  ],
  correct:["A"],
  explain:{
    why:"`ask` hands the choice to the human in the loop, which suits a middle band where neither automatic approval nor outright refusal is right.",
    distractors:{
      B:"`deny` blocks the call; `ask` does not decide the outcome at all, it defers it to a person.",
      C:"Allowing with an annotation would be `allow` combined with post-execution context, which is a different decision.",
      D:"Passing to the normal permission flow rather than settling it is `defer`, which is a distinct value."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.5-k", domain:1, ts:"1.5", scenario:3, type:"single",
  stem:"A research agent's `search_web` tool returns 30 results with full page text. Context fills after four searches. Which hook change helps most?",
  options:[
    {k:"A", text:"Trim each result to title, URL and a short excerpt in `PostToolUse`."},
    {k:"B", text:"Block the fifth and later searches in `PreToolUse` to protect the context window."},
    {k:"C", text:"Rewrite the search arguments in `PreToolUse` to request fewer results per call."},
    {k:"D", text:"Summarise the whole conversation in a `Stop` hook once context passes a threshold."}
  ],
  correct:["A"],
  explain:{
    why:"The waste is per result, not per search. Trimming at the point of entry keeps thirty relevant titles for the cost of a few full pages, and the agent still sees everything it found.",
    distractors:{
      C:"Fewer results per call is a genuine improvement and worth doing, but it narrows coverage to solve a problem caused by verbosity rather than count.",
      B:"Capping searches protects the window by preventing research, which defeats the agent's purpose.",
      D:"Turn-end summarisation compresses after the damage is done, and it is lossy exactly where the sources are."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.5-l", domain:1, ts:"1.5", scenario:2, type:"single",
  stem:"A team adds a hook denying `Bash` commands containing `rm -rf`. An engineer points out the agent can still write a shell script and execute it. What does this show?",
  options:[
    {k:"A", text:"Matching on command text is a denylist, and denylists miss what they omit."},
    {k:"B", text:"Hooks cannot inspect Bash arguments, only the tool name."},
    {k:"C", text:"The hook should have used `ask` rather than `deny` for destructive commands."},
    {k:"D", text:"Bash should be replaced with individual tools for each permitted operation."}
  ],
  correct:["A"],
  explain:{
    why:"Blocking a string blocks that string. Anything that reaches the same effect by another route passes, which is why a narrow permit list beats an open denylist for destructive capability.",
    distractors:{
      B:"Hooks see the full command, which is how the original pattern match worked at all.",
      C:"Prompting a human on every destructive-looking command is exhausting and still relies on recognising the pattern.",
      D:"This is a defensible redesign and would help, but it is a larger change than the question's point about why the current control leaks."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.5-m", domain:1, ts:"1.5", scenario:6, type:"single",
  stem:"An extraction agent receives dates from three sources in different formats. Where should conversion happen, and why?",
  options:[
    {k:"A", text:"In a `PostToolUse` hook, so the model only ever sees one format."},
    {k:"B", text:"In the extraction schema, using a `format` keyword to coerce incoming values."},
    {k:"C", text:"In the prompt, by describing each source's format to the model."},
    {k:"D", text:"In the downstream consumer, which can normalise whatever the pipeline emits."}
  ],
  correct:["A"],
  explain:{
    why:"Converting once in code, before the model reads anything, makes every subsequent comparison and calculation operate on a single representation. The ambiguity never reaches the reasoning.",
    distractors:{
      B:"JSON Schema `format` annotates and validates; it does not coerce a value from one representation to another.",
      C:"Describing the formats works often enough to be tempting, but it leaves date arithmetic to the model and the failures are silent.",
      D:"Fixing it downstream means the model has already reasoned about mixed formats, and any date comparison it made is suspect."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.5-n", domain:1, ts:"1.5", scenario:1, type:"single",
  stem:"Your hook denies a policy-violating call and returns the message 'Denied.' The agent retries the same call four times before giving up. What should the denial include?",
  options:[
    {k:"A", text:"Why it was denied and what would be permitted instead."},
    {k:"B", text:"A retry counter, so the agent knows how many attempts remain."},
    {k:"C", text:"Nothing further; the agent should treat any denial as final."},
    {k:"D", text:"The full policy document, so the agent can determine the rule itself."}
  ],
  correct:["A"],
  explain:{
    why:"A denial is information the agent has to act on. Saying that the amount exceeds a threshold and that escalation is the route turns a dead end into a next step, which is why the retries stop.",
    distractors:{
      B:"A counter tells the agent when to stop repeating a mistake without telling it what to do instead.",
      C:"Treating denials as final is a reasonable default, but here it leaves a legitimate customer request unresolved when a route existed.",
      D:"A whole policy document is a large amount of context for one decision, and the agent still has to infer which clause applied."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.5-o", domain:1, ts:"1.5", scenario:4, type:"single",
  stem:"Which pair correctly matches hook event to capability?",
  options:[
    {k:"A", text:"`PreToolUse` decides whether a call runs; `PostToolUse` reshapes what comes back."},
    {k:"B", text:"`PreToolUse` reshapes arguments only; `PostToolUse` decides whether the call runs."},
    {k:"C", text:"Both can block a call, but only `PreToolUse` can modify the result."},
    {k:"D", text:"`PreToolUse` fires per turn; `PostToolUse` fires per tool call."}
  ],
  correct:["A"],
  explain:{
    why:"One runs before execution and controls whether it happens; the other runs after and controls what the model sees. That split is the whole design.",
    distractors:{
      B:"This inverts them. By the time `PostToolUse` runs, the call has already executed and its side effects have happened.",
      C:"`PostToolUse` cannot block anything, since the call is already complete when it fires.",
      D:"Both fire per tool call; neither is a turn-level event."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.5-p", domain:1, ts:"1.5", scenario:3, type:"single",
  stem:"A hook rewrites subagent results to strip reasoning chains before the coordinator reads them. Coordinator quality improves, but it can no longer explain why a subagent reached a conclusion. What is the trade-off being made?",
  options:[
    {k:"A", text:"Context efficiency against the ability to audit a subagent's reasoning."},
    {k:"B", text:"Latency against accuracy, since stripping adds a processing step."},
    {k:"C", text:"Determinism against flexibility, since hooks always run."},
    {k:"D", text:"Cost against coverage, since fewer subagents can now be invoked."}
  ],
  correct:["A"],
  explain:{
    why:"Reasoning chains are expensive in context and rarely needed for the coordinator's next decision, but they are exactly what you want when a conclusion looks wrong. Stripping buys room and gives up explicability.",
    distractors:{
      B:"The stripping step is negligible in time, and accuracy improved rather than fell.",
      C:"Determinism is unchanged; the hook runs consistently either way.",
      D:"Coverage is unaffected, and freeing context makes more invocations possible rather than fewer."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.5-q", domain:1, ts:"1.5", scenario:3, type:"single",
  stem:"An engineer wants a hook to enforce that commit messages follow a house format. The hook rejects messages it dislikes, and the agent rewrites and retries until one passes. Is this a sound design?",
  options:[
    {k:"A", text:"Yes, provided the rejection explains the rule so the retries converge."},
    {k:"B", text:"No, because hooks cannot inspect the arguments of a commit call."},
    {k:"C", text:"No, because format is a style matter and never warrants enforcement."},
    {k:"D", text:"Yes, and no explanation is needed since the agent will infer the rule from repeated rejection."}
  ],
  correct:["A"],
  explain:{
    why:"A rejection carrying the rule turns retries into correction rather than guessing, and the deterministic check means no badly formatted message gets through regardless of how many attempts it takes.",
    distractors:{
      B:"Hooks see the arguments, which is what makes inspecting the message possible at all.",
      C:"House format is a legitimate thing to enforce; whether it is worth a hook depends on how much the team cares, not on it being style.",
      D:"Inference from bare rejection is slow and unreliable, and the agent may converge on something that merely passes rather than the intended format."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.5-r", domain:1, ts:"1.5", scenario:5, type:"single",
  stem:"A CI agent posts review comments through a `post_comment` tool. You need to guarantee no comment is posted to a closed pull request. Which control fits?",
  options:[
    {k:"A", text:"A `PreToolUse` check on the PR state, denying the call when it is closed."},
    {k:"B", text:"A `PostToolUse` hook that deletes comments posted to closed pull requests."},
    {k:"C", text:"A review prompt instruction to check PR state before commenting."},
    {k:"D", text:"A scheduled cleanup job that removes stray comments each night."}
  ],
  correct:["A"],
  explain:{
    why:"The check has to happen before the call, because posting is the side effect you are trying to prevent. Denying on state gives that guarantee.",
    distractors:{
      B:"Deleting afterwards means the comment existed, notifications fired, and subscribers may already have seen it.",
      C:"The instruction is reasonable and will usually be followed, but 'no comment ever' rules out the residual failures.",
      D:"Nightly cleanup leaves comments visible for hours and does not prevent the notification."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.5-s", domain:1, ts:"1.5", scenario:1, type:"single",
  stem:"Which task is a `PostToolUse` hook unable to accomplish?",
  options:[
    {k:"A", text:"Preventing a refund from being issued."},
    {k:"B", text:"Removing sensitive fields from a customer record before the model reads it."},
    {k:"C", text:"Converting a Unix timestamp in the result into an ISO 8601 string."},
    {k:"D", text:"Appending a note to the result explaining a status code."}
  ],
  correct:["A"],
  explain:{
    why:"By the time a post-execution hook runs the refund has already been issued. Preventing an action requires intercepting it before it executes.",
    distractors:{
      B:"Redaction before the model reads the result is exactly what replacing the tool output achieves.",
      C:"Format conversion on the way back is the archetypal use of this hook.",
      D:"Adding context to a result is directly supported and does not require replacing it."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.5-t", domain:1, ts:"1.5", scenario:4, type:"single",
  stem:"A hook denies a call, and the team is surprised that the agent's next action ignores the denial entirely and calls a different tool to achieve the same end. What does this indicate?",
  options:[
    {k:"A", text:"The control guards one tool rather than the capability behind it."},
    {k:"B", text:"The denial was not returned in a form the model could read."},
    {k:"C", text:"Hooks apply to a single call and are cleared afterwards."},
    {k:"D", text:"The agent is malfunctioning and should be restarted."}
  ],
  correct:["A"],
  explain:{
    why:"Guarding one tool while an equivalent route stays open protects the name rather than the effect. The control belongs wherever the capability is reachable.",
    distractors:{
      B:"A readable denial would change how the agent explains itself, but it would not close the alternative route.",
      C:"Hooks apply on every matching call, not once; the second call simply did not match.",
      D:"Finding another way to complete the task is ordinary agent behaviour, not a fault."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.6-h", domain:1, ts:"1.6", scenario:5, type:"single",
  stem:"A pull request touches 3 files with 900 lines of change concentrated in one algorithm. Your per-file plus integration pass structure produces thin feedback. Why might it be the wrong shape here?",
  options:[
    {k:"A", text:"The complexity is within one file, not across the three."},
    {k:"B", text:"Per-file passes cannot be applied to changes under 1,000 lines."},
    {k:"C", text:"Three files is below the minimum for an integration pass to run."},
    {k:"D", text:"Line count rather than file count determines whether decomposition applies."}
  ],
  correct:["A"],
  explain:{
    why:"Decomposition should follow where the difficulty lives. Splitting by file helps when attention is spread thin across many files; here it isolates one dense algorithm that would benefit from several focused passes of its own.",
    distractors:{
      D:"Line count is a better signal than file count in this case, but stating it as the general rule misses that the real question is where the complexity is concentrated.",
      B:"There is no size threshold below which per-file review stops working.",
      C:"An integration pass over three files is perfectly meaningful; it simply has little to find here."
    }
  },
  refs:[R_PROMPT] },

{ id:"d1-1.6-i", domain:1, ts:"1.6", scenario:4, type:"single",
  stem:"An agent is asked to 'find out why the nightly job started failing last week.' Which decomposition suits it?",
  options:[
    {k:"A", text:"Adaptive: follow the evidence, letting each finding determine the next step."},
    {k:"B", text:"Fixed: check the code, then the config, then the infrastructure, then the data."},
    {k:"C", text:"Parallel: investigate all four layers simultaneously and merge conclusions."},
    {k:"D", text:"Exhaustive: review every change made in the last week in chronological order."}
  ],
  correct:["A"],
  explain:{
    why:"Diagnosis is driven by what you find. A stack trace pointing at a config value makes the code review irrelevant, and only an adaptive plan can act on that.",
    distractors:{
      B:"A fixed order investigates layers that the first finding may already have ruled out, at full cost.",
      C:"Parallel investigation of all layers is fast but spends effort on three areas that are usually innocent, and merging unrelated conclusions is awkward.",
      D:"Chronological review is thorough and sometimes necessary, but it is the most expensive option and ignores the evidence the failure itself provides."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.6-j", domain:1, ts:"1.6", scenario:3, type:"single",
  stem:"A coordinator decomposes 'the economics of remote work' into four subtopics and researches each. The report is coherent but shallow on labour-market effects, which turned out to be the largest area. What should the decomposition have done?",
  options:[
    {k:"A", text:"Sized each subtask to the breadth of its subtopic rather than splitting evenly."},
    {k:"B", text:"Used a single subagent for the whole topic to avoid uneven splits."},
    {k:"C", text:"Decomposed into eight subtopics instead of four."},
    {k:"D", text:"Researched the subtopics sequentially so later ones could learn from earlier ones."}
  ],
  correct:["A"],
  explain:{
    why:"Equal division assumes equal size. When one subtopic is much larger, it needs proportionally more capacity or its own second-level split, or the report is thin exactly where it matters most.",
    distractors:{
      C:"Eight even splits is still even division, so the largest area remains under-resourced relative to its size.",
      B:"One agent for everything removes the imbalance by removing the parallelism, and depth falls across the board.",
      D:"Sequential research allows learning between subtopics but does nothing about how the effort was allocated."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.6-k", domain:1, ts:"1.6", scenario:5, type:"single",
  stem:"Your integration pass reports 'no cross-file issues' on every pull request, including ones where a signature changed and callers were missed. What is the most likely defect?",
  options:[
    {k:"A", text:"It receives only the diff, so the unchanged callers are invisible to it."},
    {k:"B", text:"It runs before the per-file passes and so has no findings to integrate."},
    {k:"C", text:"Integration passes cannot detect signature changes by design."},
    {k:"D", text:"The per-file passes already reported the issue, so it is suppressed as a duplicate."}
  ],
  correct:["A"],
  explain:{
    why:"A caller that was not updated does not appear in the diff. An integration pass restricted to changed lines is structurally blind to exactly the breakage it exists to find.",
    distractors:{
      B:"Ordering matters for using per-file findings, but a pass with the right files can find cross-file breakage regardless of when it runs.",
      C:"Signature mismatches are among the most tractable cross-file checks when the caller sites are visible.",
      D:"Per-file passes cannot see other files, so they never reported it and there is nothing to deduplicate."
    }
  },
  refs:[R_PROMPT] },

{ id:"d1-1.6-l", domain:1, ts:"1.6", scenario:4, type:"single",
  stem:"A developer asks whether to plan a large refactor as one task or decompose it. The refactor has a known, mechanical shape across 60 files. What is the better answer?",
  options:[
    {k:"A", text:"Chain it: the steps are known, so a fixed sequence is predictable and cheap."},
    {k:"B", text:"Decompose adaptively, since 60 files is too many for a fixed plan."},
    {k:"C", text:"Treat each file as an independent investigation with its own plan."},
    {k:"D", text:"Avoid decomposition entirely and process all 60 files in a single pass."}
  ],
  correct:["A"],
  explain:{
    why:"Adaptivity earns its cost when the shape is unknown. A mechanical change with a known pattern is exactly the case for a fixed chain, which is cheaper and easier to verify.",
    distractors:{
      B:"File count does not make a plan uncertain. A known transformation stays known at 60 files.",
      C:"Per-file planning re-derives the same conclusion 60 times.",
      D:"A single pass over 60 files reintroduces attention dilution, which is what decomposition avoids."
    }
  },
  refs:[R_PROMPT] },

{ id:"d1-1.6-m", domain:1, ts:"1.6", scenario:4, type:"single",
  stem:"An agent asked to 'improve test coverage' generates tests for the easiest functions first, reaching 85% coverage while the payment engine stays untested. What was missing from the decomposition?",
  options:[
    {k:"A", text:"A prioritisation step ranking areas by risk rather than by ease."},
    {k:"B", text:"A coverage target expressed per file rather than for the repository."},
    {k:"C", text:"An instruction to write more tests per function."},
    {k:"D", text:"A restriction preventing the agent from testing trivial functions."}
  ],
  correct:["A"],
  explain:{
    why:"Coverage optimises for lines touched, which rewards the cheapest code. Mapping structure and ranking by impact first is what points the effort at the payment engine.",
    distractors:{
      B:"Per-file targets spread effort evenly, which still treats a config module as equal in importance to payments.",
      C:"More tests per function deepens coverage of whatever was already chosen, and the choice was the problem.",
      D:"Banning trivial functions removes the cheapest wins without establishing what actually matters."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.6-n", domain:1, ts:"1.6", scenario:3, type:"single",
  stem:"Which signal most reliably indicates that a task needs adaptive decomposition rather than a fixed chain?",
  options:[
    {k:"A", text:"The next useful step depends on what the previous step found."},
    {k:"B", text:"The task involves more than four distinct stages."},
    {k:"C", text:"The task will run for more than a few minutes."},
    {k:"D", text:"The task spans several different tools."}
  ],
  correct:["A"],
  explain:{
    why:"Dependence of the plan on intermediate findings is the defining property. If you can write the steps down before starting, a chain will do.",
    distractors:{
      B:"Stage count says nothing about whether the stages were knowable in advance; a ten-step checklist is still a checklist.",
      C:"Duration follows from the work rather than from whether the plan is discoverable upfront.",
      D:"Tool variety is common in entirely predictable pipelines."
    }
  },
  refs:[R_PROMPT] },

{ id:"d1-1.6-o", domain:1, ts:"1.6", scenario:5, type:"single",
  stem:"A team splits reviews into six passes: style, security, performance, tests, documentation and naming. Reviewers complain the output is repetitive and long. What is the likely cause?",
  options:[
    {k:"A", text:"Overlapping passes report the same underlying issue from several angles."},
    {k:"B", text:"Six passes exceeds the maximum supported decomposition depth."},
    {k:"C", text:"Each pass sees the whole diff, so attention dilution persists."},
    {k:"D", text:"The passes run in parallel, so their findings arrive interleaved."}
  ],
  correct:["A"],
  explain:{
    why:"Decomposition helps when the parts are distinct. A poorly named function with no test can surface under naming, tests and documentation, so the reader sees one problem three times.",
    distractors:{
      C:"Seeing the whole diff is fine when each pass has a narrow question; the repetition comes from the questions overlapping.",
      B:"There is no such depth limit.",
      D:"Interleaving affects presentation order and could be fixed by sorting, but the duplication would remain."
    }
  },
  refs:[R_PROMPT] },

{ id:"d1-1.6-p", domain:1, ts:"1.6", scenario:2, type:"single",
  stem:"An engineer proposes decomposing every task, on the grounds that focused passes always beat single passes. Where does that reasoning fail?",
  options:[
    {k:"A", text:"On small tasks, where the coordination cost exceeds any attention benefit."},
    {k:"B", text:"On large tasks, where too many subtasks exhaust the context window."},
    {k:"C", text:"On tasks using MCP tools, which cannot be split across passes."},
    {k:"D", text:"It does not fail; decomposition is beneficial at every scale."}
  ],
  correct:["A"],
  explain:{
    why:"Splitting has overhead: prompts to write, results to combine, and more round trips. On a two-file change that overhead buys nothing, because attention was never stretched.",
    distractors:{
      B:"Decomposition reduces per-pass context rather than exhausting it; that is much of the point.",
      C:"MCP tools are usable from any pass and impose no such constraint.",
      D:"This is the claim under examination, and it ignores the fixed cost that decomposition adds."
    }
  },
  refs:[R_PROMPT] },

{ id:"d1-1.6-q", domain:1, ts:"1.6", scenario:4, type:"multi",
  stem:"Which two tasks are better served by adaptive decomposition than by a fixed chain? (Select 2.)",
  options:[
    {k:"A", text:"Tracing why a specific customer's data went missing."},
    {k:"B", text:"Understanding how an unfamiliar service handles retries."},
    {k:"C", text:"Applying a known rename across every file that imports a module."},
    {k:"D", text:"Generating a changelog entry for each merged pull request."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both are investigations whose next step depends on what the last one revealed. The route through the code or the data is not knowable before you start looking.",
    distractors:{
      C:"A known rename across known importers is mechanical, and the file list can be produced before any work begins.",
      D:"Changelog generation is a uniform transformation applied per pull request, with no discovery involved."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.6-r", domain:1, ts:"1.6", scenario:3, type:"single",
  stem:"A coordinator's decomposition is reviewed and found sound, yet the report still misses a major area. Logs show one subagent returned an error the coordinator ignored. Where is the defect now?",
  options:[
    {k:"A", text:"In error handling, not in decomposition."},
    {k:"B", text:"In the decomposition, which should have allocated two subagents to that area."},
    {k:"C", text:"In the synthesis agent, which should have noticed the gap."},
    {k:"D", text:"In the subagent, which should have retried until it succeeded."}
  ],
  correct:["A"],
  explain:{
    why:"A correct plan can still produce an incomplete result if a failure is swallowed. Once the decomposition is verified sound, the next place to look is what happened to each delegation.",
    distractors:{
      B:"Duplicating coverage would mask a failure rather than handle it, and doubles cost across the board.",
      C:"Gap detection in synthesis is a useful safety net, but the area was never researched, so there is nothing for it to work from.",
      D:"Local retry is right for transient failures, but the coordinator ignoring a reported error is the defect regardless of what the subagent tried."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.6-s", domain:1, ts:"1.6", scenario:5, type:"single",
  stem:"Your per-file review passes each receive one file and its full history. Reviews are slow and cite commits from years ago as relevant context. What should change?",
  options:[
    {k:"A", text:"Pass only the current file and the diff, unless history is specifically needed."},
    {k:"B", text:"Pass the full history but instruct the reviewer to ignore old commits."},
    {k:"C", text:"Merge the per-file passes back into a single pass to reduce total context."},
    {k:"D", text:"Pass the history summarised to one line per commit."}
  ],
  correct:["A"],
  explain:{
    why:"Scope the input to the question. A review of this change needs this change, and history that was included will be used, however tangential.",
    distractors:{
      D:"Summarised history is cheaper and a reasonable middle ground, but it still invites the reviewer to reach for context the task does not require.",
      B:"Instructing the model to ignore material you have supplied is weaker than not supplying it.",
      C:"Merging passes reintroduces attention dilution to solve an input-scoping problem."
    }
  },
  refs:[R_CTX] },

{ id:"d1-1.6-t", domain:1, ts:"1.6", scenario:6, type:"single",
  stem:"An extraction pipeline processes contracts of wildly varying length, from two pages to four hundred. A single fixed chunking strategy performs poorly at both extremes. What does this suggest?",
  options:[
    {k:"A", text:"Chunking should adapt to document structure rather than to a fixed size."},
    {k:"B", text:"Long documents should be rejected and handled manually."},
    {k:"C", text:"The chunk size should be set to the average document length."},
    {k:"D", text:"Every document should be split into exactly the same number of chunks."}
  ],
  correct:["A"],
  explain:{
    why:"A two-page contract has no natural split, and a four-hundred-page one has many. Splitting on structure such as clauses or sections keeps each chunk coherent at either extreme.",
    distractors:{
      C:"An average sits between the two failure modes and performs badly at both, which is the situation described.",
      B:"Rejecting long documents removes the hardest and often most valuable cases from the pipeline.",
      D:"A fixed chunk count makes short-document chunks meaninglessly small and long-document chunks unusably large."
    }
  },
  refs:[R_BATCH] },

{ id:"d1-1.7-h", domain:1, ts:"1.7", scenario:4, type:"single",
  stem:"You resume a week-old exploration session and immediately ask a question about a file. The answer describes code that was deleted in Tuesday's refactor. What went wrong?",
  options:[
    {k:"A", text:"The session holds the old file contents and has no signal that they changed."},
    {k:"B", text:"Resumption reloads files from disk, so the answer should have been current."},
    {k:"C", text:"The session's context was compacted, losing the accurate version."},
    {k:"D", text:"The file was renamed, so the agent answered about a different file."}
  ],
  correct:["A"],
  explain:{
    why:"Resumption restores the conversation, including whatever the files looked like when they were read. Nothing re-reads them, and nothing tells the agent that the disk has moved on.",
    distractors:{
      B:"Resumption does not re-read anything; that assumption is exactly what makes stale answers surprising.",
      C:"Compaction summarises rather than substituting older content for newer, and would not produce a confident description of deleted code.",
      D:"A rename would surface as a missing file rather than a fluent description of code that no longer exists."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.7-i", domain:1, ts:"1.7", scenario:2, type:"single",
  stem:"A developer keeps one long-running session for an entire feature, spanning several days and many unrelated sub-tasks. Answers become inconsistent. What practice would help most?",
  options:[
    {k:"A", text:"Start a fresh session per sub-task, carrying forward a short summary."},
    {k:"B", text:"Keep the single session and run `/compact` whenever answers drift."},
    {k:"C", text:"Keep the single session but raise the context window size."},
    {k:"D", text:"Fork the session at the start of each sub-task."}
  ],
  correct:["A"],
  explain:{
    why:"Unrelated sub-tasks accumulate context that is irrelevant to whatever is current. A fresh session per task keeps the window filled with material that bears on the question, and a short summary carries the decisions forward.",
    distractors:{
      B:"Compaction reclaims room but preserves the mixture of unrelated topics in summary form, so the drift returns.",
      C:"A larger window holds more irrelevant material rather than less.",
      D:"Forking is for exploring alternatives from a shared baseline; here the sub-tasks are unrelated, so the baseline is not worth carrying."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.7-j", domain:1, ts:"1.7", scenario:4, type:"single",
  stem:"You want to compare two migration strategies, each explored in depth, from the same completed dependency analysis. Which is the decisive advantage of forking over two fresh sessions?",
  options:[
    {k:"A", text:"Both branches start from provably identical analysis."},
    {k:"B", text:"Forked sessions run concurrently, whereas fresh sessions cannot."},
    {k:"C", text:"Forked sessions share a context window and so cost less."},
    {k:"D", text:"Only forked sessions can be resumed later by name."}
  ],
  correct:["A"],
  explain:{
    why:"A fair comparison needs the same starting evidence. Two fresh analyses might differ in what they noticed, so any difference in outcome could come from the baseline rather than the strategy.",
    distractors:{
      C:"Forked branches have independent context; nothing is shared after the split.",
      B:"Concurrency is available either way and is not what forking provides.",
      D:"Named resumption is not exclusive to forks."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.7-k", domain:1, ts:"1.7", scenario:1, type:"single",
  stem:"A support agent resumes a conversation after the customer replies two days later. The refund amount discussed earlier is now wrong, because the order was partially returned in between. What design would prevent this?",
  options:[
    {k:"A", text:"Re-fetch the transactional facts on resume rather than trusting the stored ones."},
    {k:"B", text:"Refuse to resume conversations older than 24 hours."},
    {k:"C", text:"Store the refund amount in the system prompt so it cannot be lost."},
    {k:"D", text:"Summarise the earlier conversation more aggressively before resuming."}
  ],
  correct:["A"],
  explain:{
    why:"Transactional facts have a lifetime. Anything that can change on the backend between turns should be read again at the point of use rather than carried forward from an earlier turn.",
    distractors:{
      B:"A hard cut-off protects correctness by refusing legitimate follow-ups, which is poor service.",
      C:"Pinning the number makes the stale value more durable, which is the opposite of what is needed.",
      D:"Summarisation compresses the conversation; it does nothing about the world having changed."
    }
  },
  refs:[R_CTX] },

{ id:"d1-1.7-l", domain:1, ts:"1.7", scenario:4, type:"single",
  stem:"Which situation most clearly favours resuming rather than starting fresh?",
  options:[
    {k:"A", text:"Continuing yesterday's analysis of code nobody has touched since."},
    {k:"B", text:"Revisiting an investigation after a large refactor landed."},
    {k:"C", text:"Beginning an unrelated task in the same repository."},
    {k:"D", text:"Comparing two approaches that must not influence each other."}
  ],
  correct:["A"],
  explain:{
    why:"Resumption pays off when the prior context is still true. Unchanged code means yesterday's reads remain accurate and the analysis can continue directly.",
    distractors:{
      B:"After a refactor much of the stored context describes code that no longer exists, which misleads rather than helps.",
      C:"An unrelated task gains nothing from the previous conversation and inherits its clutter.",
      D:"Independent comparison is what forking is for, since resumption would let the first exploration colour the second."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.7-m", domain:1, ts:"1.7", scenario:2, type:"single",
  stem:"After resuming, an engineer tells the agent 'I changed some files since last time.' The agent re-reads nothing and continues from stale content. Why?",
  options:[
    {k:"A", text:"The statement names no files, so there is nothing specific to re-read."},
    {k:"B", text:"Resumed sessions ignore user messages until the first tool call."},
    {k:"C", text:"The agent lacks file tools after resumption and cannot re-read."},
    {k:"D", text:"Re-reading requires an explicit `--refresh` flag at resume time."}
  ],
  correct:["A"],
  explain:{
    why:"Vague notice gives the agent no target. Naming the files converts the warning into an actionable re-read of exactly what moved.",
    distractors:{
      B:"User messages are processed normally throughout a resumed session.",
      C:"Tool availability is unchanged by resumption.",
      D:"No such flag exists, and re-reading is an ordinary tool call rather than a session-level setting."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.7-n", domain:1, ts:"1.7", scenario:6, type:"single",
  stem:"A long extraction run is interrupted after 700 of 1,000 documents. On restart it begins again at document one. What design would avoid the rework?",
  options:[
    {k:"A", text:"Persist per-document completion state, and resume from what is unfinished."},
    {k:"B", text:"Resume the agent session, which retains how far it had progressed."},
    {k:"C", text:"Increase the timeout so the run is less likely to be interrupted."},
    {k:"D", text:"Process the documents in reverse order on the second attempt."}
  ],
  correct:["A"],
  explain:{
    why:"Durable progress belongs outside the session. A record of which documents are done makes restart a matter of filtering the remaining work, independent of what the agent remembers.",
    distractors:{
      B:"Session resumption restores a conversation, not a reliable record of which side effects completed.",
      C:"A longer timeout reduces one cause of interruption without providing recovery when it happens anyway.",
      D:"Reversing the order re-processes the same 700 documents from the other end."
    }
  },
  refs:[R_CTX] },

{ id:"d1-1.7-o", domain:1, ts:"1.7", scenario:3, type:"single",
  stem:"A research run is resumed the next day and the coordinator re-delegates work that already completed. What is the most likely cause?",
  options:[
    {k:"A", text:"Subagent results were never persisted, so the resumed run has no record."},
    {k:"B", text:"Resumption always clears the coordinator's memory of prior delegations."},
    {k:"C", text:"Subagents cannot be invoked twice with the same prompt."},
    {k:"D", text:"The coordinator's context window was exceeded during the original run."}
  ],
  correct:["A"],
  explain:{
    why:"If findings lived only inside subagent invocations, a resumed coordinator sees delegations without results and reasonably concludes the work still needs doing.",
    distractors:{
      B:"Resumption restores the conversation rather than wiping it, so prior turns are present.",
      C:"Repeat invocation with the same prompt is permitted, which is precisely why the duplicate work ran.",
      D:"Exceeding the window would show as degraded answers during the original run rather than duplicate delegation after it."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.7-p", domain:1, ts:"1.7", scenario:4, type:"single",
  stem:"An engineer resumes a session and immediately runs `/compact` to make room, then finds the agent has forgotten a decision made earlier. What is the trade-off they hit?",
  options:[
    {k:"A", text:"Compaction reclaims context by summarising, and summaries lose specifics."},
    {k:"B", text:"Compaction deletes the oldest turns entirely rather than summarising them."},
    {k:"C", text:"Compaction cannot be run in a resumed session and silently failed."},
    {k:"D", text:"Compaction discards tool results but preserves all assistant reasoning."}
  ],
  correct:["A"],
  explain:{
    why:"Summarisation is lossy, and specific decisions are exactly the kind of detail that condenses away. Anything that must survive should be written down outside the conversation.",
    distractors:{
      B:"Compaction condenses rather than truncating, which is why some information survives in general form.",
      C:"It works normally in resumed sessions.",
      D:"It does not preserve reasoning wholesale while dropping results; both are subject to summarisation."
    }
  },
  refs:[R_CTX] },

{ id:"d1-1.7-q", domain:1, ts:"1.7", scenario:1, type:"single",
  stem:"Which practice best protects a multi-day investigation against context loss?",
  options:[
    {k:"A", text:"Writing key findings to a file the agent re-reads each session."},
    {k:"B", text:"Resuming the same session every day without starting new ones."},
    {k:"C", text:"Running `/compact` at the end of each working day."},
    {k:"D", text:"Keeping every session under one hour."}
  ],
  correct:["A"],
  explain:{
    why:"A file on disk is independent of context windows, compaction and session lifetimes. Reading it back at the start of each session reconstitutes the findings whatever happened to the conversation.",
    distractors:{
      B:"A single long-lived session accumulates clutter and still degrades, and it goes stale as the code changes.",
      C:"End-of-day compaction reduces size while making the surviving record vaguer.",
      D:"Short sessions limit accumulation but also fragment the work, with nothing carrying findings between them."
    }
  },
  refs:[R_CTX] },

{ id:"d1-1.7-r", domain:1, ts:"1.7", scenario:2, type:"single",
  stem:"A team wants every investigation session to be resumable by a meaningful name rather than an opaque identifier. What does this require?",
  options:[
    {k:"A", text:"Naming the session when it is created, so it can be resumed by that name."},
    {k:"B", text:"Recording the identifier in a shared document after each session."},
    {k:"C", text:"Using a fork, since only forks can carry names."},
    {k:"D", text:"Nothing; sessions are automatically named after their first prompt."}
  ],
  correct:["A"],
  explain:{
    why:"Resumption accepts a name as well as an identifier, but the name has to be assigned when the session starts. Choosing it up front is what makes later resumption human-friendly.",
    distractors:{
      B:"A registry of opaque identifiers works but recreates the lookup problem the team is trying to remove.",
      C:"Forking creates a branch and is unrelated to how sessions are addressed.",
      D:"Automatic naming from the first prompt is not something to rely on for deliberate, memorable session names."
    }
  },
  refs:[{label:"Claude Code: CLI reference", url:"https://code.claude.com/docs/en/cli-reference"}] },

{ id:"d1-1.7-s", domain:1, ts:"1.7", scenario:5, type:"single",
  stem:"A CI job resumes a named session for each run so the reviewer 'remembers' the project. Reviews slowly fill with stale findings about code that has since changed. What should change?",
  options:[
    {k:"A", text:"Start each run fresh, supplying project context from CLAUDE.md instead."},
    {k:"B", text:"Resume the session but run `/compact` at the start of every job."},
    {k:"C", text:"Resume a different named session for each day of the week."},
    {k:"D", text:"Keep resuming, and instruct the reviewer to ignore findings older than a week."}
  ],
  correct:["A"],
  explain:{
    why:"CI runs against a moving codebase, so accumulated conversation goes stale by construction. Durable project knowledge belongs in CLAUDE.md, which is re-read fresh on every run.",
    distractors:{
      B:"Compaction shrinks the stale content without making it current.",
      C:"Rotating sessions spreads the staleness across seven conversations rather than removing it.",
      D:"Asking the model to disregard material you supplied is weaker than not supplying it."
    }
  },
  refs:[R_MEM] },

{ id:"d1-1.7-t", domain:1, ts:"1.7", scenario:6, type:"single",
  stem:"Which is the strongest argument for injecting a written summary into a fresh session rather than resuming?",
  options:[
    {k:"A", text:"You control exactly what carries forward, and nothing stale comes with it."},
    {k:"B", text:"Fresh sessions have larger context windows than resumed ones."},
    {k:"C", text:"Summaries are cheaper to produce than the original conversation."},
    {k:"D", text:"Resumed sessions cannot call tools that the original session did not use."}
  ],
  correct:["A"],
  explain:{
    why:"A summary is a deliberate selection. Resumption is all-or-nothing, so it brings the stale tool results along with the conclusions worth keeping.",
    distractors:{
      B:"Window size is a property of the model and configuration, not of how the session began.",
      C:"Producing the summary is an extra step, so it costs more rather than less; the benefit is control.",
      D:"Tool availability comes from configuration and is unaffected by what was used previously."
    }
  },
  refs:[R_SUB] },
