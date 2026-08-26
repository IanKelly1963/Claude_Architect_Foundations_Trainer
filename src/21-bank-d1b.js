
{ id:"d1-1.5-a", domain:1, ts:"1.5", scenario:1, type:"single",
  stem:"Your agent reads order data from three MCP tools. One returns dates as Unix timestamps, one as ISO 8601 strings, and one as `MM/DD/YYYY`. The agent frequently miscalculates whether a return window has expired. What is the cleanest fix?",
  options:[
    {k:"A", text:"A `PostToolUse` hook that normalises all date formats before the model reads the results."},
    {k:"B", text:"A system prompt section explaining each tool's date format and how to convert between them."},
    {k:"C", text:"A `PreToolUse` hook that rewrites each tool's input arguments so that every backend is asked for a consistent date format."},
    {k:"D", text:"Few-shot examples showing correct return-window calculations for each of the three formats."}
  ],
  correct:["A"],
  explain:{
    why:"`PostToolUse` intercepts results on their way back, which is exactly where format normalisation belongs. Converting every date to one representation before the model sees it removes the arithmetic ambiguity entirely, deterministically, for every call.",
    distractors:{
      B:"This asks the model to perform format detection and conversion on every reasoning step. It will mostly work, and the failures are silent date errors, which is the current problem.",
      C:"`PreToolUse` acts on outgoing calls. These backends return whatever format they return; you cannot fix an inbound format by rewriting the request.",
      D:"Examples improve the odds of correct conversion but leave the model doing conversion work that code should do once, reliably."
    }
  },
  refs:[{label:"Agent SDK: Hooks", url:"https://code.claude.com/docs/en/agent-sdk/hooks"}] },

{ id:"d1-1.5-b", domain:1, ts:"1.5", scenario:0, type:"single",
  stem:"Which hook event intercepts an outgoing tool call so it can be blocked before it executes?",
  options:[
    {k:"A", text:"`PreToolUse`, which returns a `permissionDecision` of `allow`, `deny`, `ask` or `defer` before execution."},
    {k:"B", text:"`PostToolUse`, which inspects the call and can veto it retroactively."},
    {k:"C", text:"`Stop`, which runs at the end of the turn and can roll back any tool effects that have already occurred."},
    {k:"D", text:"`SubagentStart`, which gates any tool call made inside a delegated task."}
  ],
  correct:["A"],
  explain:{
    why:"`PreToolUse` runs before execution, which is what makes blocking possible. It returns `hookSpecificOutput` carrying a `permissionDecision`, and `deny` prevents the call from running at all.",
    distractors:{
      B:"`PostToolUse` runs after the tool has already executed. It can reshape or replace the output, but the side effects have happened.",
      C:"`Stop` is a lifecycle event at turn end. It cannot undo a refund that was already issued.",
      D:"`SubagentStart` fires when a subagent begins, not per tool call, and it does not gate individual invocations."
    }
  },
  refs:[{label:"Agent SDK: Hooks", url:"https://code.claude.com/docs/en/agent-sdk/hooks"}] },

{ id:"d1-1.5-c", domain:1, ts:"1.5", scenario:1, type:"single",
  stem:"A `PostToolUse` hook needs to strip 38 irrelevant fields from a verbose order-lookup response so only the 5 return-relevant fields reach the model. Which hook output field accomplishes this?",
  options:[
    {k:"A", text:"`updatedToolOutput`, which replaces the tool's output before Claude sees it."},
    {k:"B", text:"`additionalContext`, which appends the trimmed version alongside the original."},
    {k:"C", text:"`permissionDecision`, set to `allow` with the trimmed payload attached."},
    {k:"D", text:"`updatedInput`, which rewrites the arguments so the tool returns fewer fields."}
  ],
  correct:["A"],
  explain:{
    why:"`updatedToolOutput` substitutes the result the model receives, so the 38 unwanted fields never enter context at all. That is the difference between trimming and merely annotating.",
    distractors:{
      B:"`additionalContext` appends. The original 43-field payload still enters context, so you have made the problem slightly worse rather than better.",
      C:"`permissionDecision` belongs to `PreToolUse` and governs whether a call runs; it is not a mechanism for reshaping results.",
      D:"`updatedInput` rewrites a call's arguments before execution. It cannot help when the backend returns all fields regardless of what you ask for."
    }
  },
  refs:[{label:"Agent SDK: Hooks", url:"https://code.claude.com/docs/en/agent-sdk/hooks"}] },

{ id:"d1-1.5-d", domain:1, ts:"1.5", scenario:1, type:"single",
  stem:"Your compliance team requires that no refund above $500 can ever be issued automatically, with zero tolerance for exceptions. An engineer argues the system prompt already says this clearly and the model has complied in all 400 test cases. How should you respond?",
  options:[
    {k:"A", text:"Prompt compliance is probabilistic; 400 passing cases do not bound the failure rate."},
    {k:"B", text:"400 consecutive passing cases is statistically sufficient evidence of compliance, so the existing system prompt is adequate as written."},
    {k:"C", text:"Add extended thinking so the model reasons more carefully about the threshold before each refund."},
    {k:"D", text:"Raise the temperature setting to 0, which makes instruction-following deterministic."}
  ],
  correct:["A"],
  explain:{
    why:"Passing tests bound the observed failure rate, not the true one. When the requirement is zero tolerance, the only sound design is one where a violation is structurally impossible, and that means intercepting the call in code.",
    distractors:{
      B:"A clean test run raises confidence but cannot establish that the failure rate is zero, and production inputs will be more varied than the test set.",
      C:"Extended thinking improves reasoning quality on hard problems. It does not convert a probabilistic behaviour into a guarantee.",
      D:"Temperature 0 makes sampling greedy, not instruction-following guaranteed. The model can still deterministically choose to do the wrong thing on an input it reads differently."
    }
  },
  refs:[{label:"Agent SDK: Hooks", url:"https://code.claude.com/docs/en/agent-sdk/hooks"}] },

{ id:"d1-1.5-e", domain:1, ts:"1.5", scenario:0, type:"multi",
  stem:"Which two tasks are appropriate uses of a `PostToolUse` hook? (Select 2.)",
  options:[
    {k:"A", text:"Converting heterogeneous status codes from several different backends into one consistent vocabulary."},
    {k:"B", text:"Trimming a verbose tool response down to the fields the agent actually needs."},
    {k:"C", text:"Preventing a refund above a policy threshold from being issued."},
    {k:"D", text:"Deciding whether the agent should be permitted to call a particular tool before the call executes."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both are transformations of a result on its way back to the model, which is precisely what `PostToolUse` intercepts. Normalising formats and trimming payloads both happen after execution and before the model reads the output.",
    distractors:{
      C:"Blocking an action must happen before it executes, which is `PreToolUse`. By `PostToolUse` the refund has already been issued.",
      D:"Permission to call a tool is decided pre-execution, via the `permissionDecision` returned from `PreToolUse`."
    }
  },
  refs:[{label:"Agent SDK: Hooks", url:"https://code.claude.com/docs/en/agent-sdk/hooks"}] },

{ id:"d1-1.5-f", domain:1, ts:"1.5", scenario:1, type:"single",
  stem:"When a hook blocks a policy-violating refund, what should happen next for the best customer outcome?",
  options:[
    {k:"A", text:"Redirect to an alternative workflow such as human escalation."},
    {k:"B", text:"Return a generic error to the agent so it informs the customer the request cannot be processed."},
    {k:"C", text:"Silently downgrade the refund to the maximum permitted amount and proceed."},
    {k:"D", text:"End the conversation immediately to prevent any further policy risk."}
  ],
  correct:["A"],
  explain:{
    why:"The block exists because this case needs a human, not because the customer's request is invalid. Redirecting into escalation means the policy holds and the customer still gets their issue resolved.",
    distractors:{
      B:"A dead end leaves a legitimate request unresolved and the customer with no path forward.",
      C:"Silently altering the amount is worse than refusing. The customer is told they received a full refund when they did not.",
      D:"Ending the conversation abandons a customer with a valid high-value claim, which is the case most in need of careful handling."
    }
  },
  refs:[{label:"Agent SDK: Hooks", url:"https://code.claude.com/docs/en/agent-sdk/hooks"}] },

{ id:"d1-1.5-g", domain:1, ts:"1.5", scenario:2, type:"single",
  stem:"A team wants Claude Code to always run `make lint` before any commit, without exception. They have added the instruction to CLAUDE.md but it is followed roughly 90% of the time. What is the correct mechanism?",
  options:[
    {k:"A", text:"A hook, because hooks execute at fixed lifecycle events regardless of what Claude decides."},
    {k:"B", text:"Moving the instruction from CLAUDE.md to a `.claude/rules/` file with `paths` frontmatter."},
    {k:"C", text:"Repeating the instruction at both the top and bottom of CLAUDE.md so it appears twice in context."},
    {k:"D", text:"Moving the instruction to the user-level `~/.claude/CLAUDE.md`, which has higher precedence."}
  ],
  correct:["A"],
  explain:{
    why:"The Claude Code documentation is explicit on this: CLAUDE.md is context rather than enforced configuration, and an instruction that must run at a specific point should be written as a hook, which executes as a shell command at a fixed lifecycle event.",
    distractors:{
      B:"Path-scoped rules change when an instruction loads, not whether it is obeyed. It is still context.",
      C:"Duplicating text raises salience marginally and consumes more context. It provides no guarantee.",
      D:"User-level files load before project files and have lower, not higher, precedence, and either way remain non-binding context."
    }
  },
  refs:[{label:"Claude Code: Memory", url:"https://code.claude.com/docs/en/memory"}] },

{ id:"d1-1.6-a", domain:1, ts:"1.6", scenario:5, type:"single",
  stem:"A pull request modifies 14 files across the stock tracking module. Your single-pass review produces detailed feedback on some files, superficial comments on others, misses obvious bugs, and flags a pattern as problematic in one file while approving identical code elsewhere in the same PR. How should you restructure the review?",
  options:[
    {k:"A", text:"Split into per-file passes for local issues, plus a separate cross-file integration pass."},
    {k:"B", text:"Require developers to split large PRs into smaller submissions of 3-4 files before the automated review runs."},
    {k:"C", text:"Switch to a model with a larger context window so all 14 files receive adequate attention in one pass."},
    {k:"D", text:"Run three independent review passes over the full pull request, and only report issues that appear in at least two of the three separate runs."}
  ],
  correct:["A"],
  explain:{
    why:"Inconsistent depth and self-contradictory findings across one diff are the signature of attention dilution. Per-file passes give every file the same focused treatment, and a dedicated integration pass covers what only becomes visible across file boundaries.",
    distractors:{
      B:"This moves the burden to developers without improving the system, and large PRs will still arrive.",
      C:"Attention quality and context capacity are different things. The files already fit; the problem is how attention is distributed across them.",
      D:"Consensus filtering suppresses real bugs. An issue caught in one pass out of three is quite likely a genuine subtle bug, and this rule discards exactly those."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d1-1.6-b", domain:1, ts:"1.6", scenario:4, type:"single",
  stem:"You are asked to 'add comprehensive tests to this legacy codebase' with no further specification. Which decomposition strategy fits best?",
  options:[
    {k:"A", text:"Dynamic decomposition: map the structure, find high-impact areas, then build an adapting plan."},
    {k:"B", text:"A fixed pipeline: enumerate every source file in the repository, then generate exactly one test file per source file, working in alphabetical order."},
    {k:"C", text:"Prompt chaining with three fixed stages: unit tests, then integration tests, then end-to-end tests."},
    {k:"D", text:"Delegate the entire task to a single subagent with a large context window and no intermediate checkpoints."}
  ],
  correct:["A"],
  explain:{
    why:"The task is open-ended and its shape is unknown until you look. Mapping first, prioritising by impact, then adapting as coupling and dependencies surface is what produces valuable tests rather than uniform coverage of trivia.",
    distractors:{
      B:"One test file per source file, alphabetically, spends equal effort on a config constant and on the payment engine. Coverage rises; risk barely moves.",
      C:"A fixed three-stage chain presumes you already know which components warrant which test level, which is exactly what the mapping phase is for.",
      D:"A single large delegation with no checkpoints gives no opportunity to redirect when the map reveals that most risk sits in two modules."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.6-c", domain:1, ts:"1.6", scenario:5, type:"single",
  stem:"Which task is best served by prompt chaining with fixed sequential steps rather than dynamic decomposition?",
  options:[
    {k:"A", text:"A code review covering a fixed set of aspects: style, security, performance, test coverage."},
    {k:"B", text:"Diagnosing an intermittent production outage of unknown cause."},
    {k:"C", text:"Exploring an unfamiliar codebase to understand how a feature is implemented."},
    {k:"D", text:"Researching an open-ended topic where the relevant subdomains cannot be known before the research begins."}
  ],
  correct:["A"],
  explain:{
    why:"Prompt chaining suits predictable, multi-aspect work where the steps are known in advance and do not depend on what earlier steps found. A review with a fixed checklist is exactly that shape.",
    distractors:{
      B:"Outage diagnosis is the archetypal adaptive task: each finding determines what to examine next, and a fixed sequence would investigate irrelevant subsystems.",
      C:"Codebase exploration is driven by what you discover; the next file to read depends on the imports you just saw.",
      D:"When subdomains are unknown upfront, a fixed chain will encode whatever assumptions you started with, which is how coverage gaps get baked in."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d1-1.6-d", domain:1, ts:"1.6", scenario:5, type:"single",
  stem:"After splitting a 14-file review into per-file passes, cross-file bugs start slipping through: a function signature changed in one file while three callers in other files were not updated. What is missing?",
  options:[
    {k:"A", text:"A separate integration pass examining cross-file data flow and interface consistency across files."},
    {k:"B", text:"A larger per-file context window so each pass can also see the files that import it."},
    {k:"C", text:"A rule that per-file passes should flag any exported symbol as potentially breaking."},
    {k:"D", text:"Reverting to single-pass review, since cross-file correctness matters more than per-file depth."}
  ],
  correct:["A"],
  explain:{
    why:"Per-file passes are designed to catch local issues, and by construction cannot see across boundaries. The complete pattern is local passes plus an explicit integration pass whose entire job is the interactions between files.",
    distractors:{
      B:"Widening each pass to include importers recreates the attention-dilution problem the split was introduced to solve.",
      C:"Flagging every exported symbol produces enormous noise, and still does not verify whether callers were actually updated.",
      D:"Reverting reintroduces inconsistent depth and contradictory findings. The fix is to add the missing pass, not to abandon the approach."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d1-1.6-e", domain:1, ts:"1.6", scenario:3, type:"single",
  stem:"A research coordinator uses a fixed three-subtask decomposition for every topic. For 'the effects of remote work', it produces solid coverage; for 'the impact of AI on creative industries', it misses entire sectors. What does this reveal?",
  options:[
    {k:"A", text:"Fixed decomposition width cannot adapt to topics whose breadth varies."},
    {k:"B", text:"The subagents assigned to the AI topic performed worse and need better system prompts."},
    {k:"C", text:"Three subtasks is too few in general and the fixed count should be raised to six."},
    {k:"D", text:"The topic string was too short, and a longer, more explicit topic description would have produced a better decomposition from the coordinator."}
  ],
  correct:["A"],
  explain:{
    why:"Some topics genuinely decompose into three parts and others into eight. A fixed width either wastes effort on narrow topics or truncates broad ones. The coordinator should determine breadth from the topic rather than from a constant.",
    distractors:{
      B:"The subagents completed their assignments correctly in both cases. Their prompts are not the variable that changed.",
      C:"Six is just a different constant, and would over-decompose narrow topics while still capping genuinely broad ones.",
      D:"Topic length is not the issue. 'The impact of AI on creative industries' is perfectly clear; the coordinator simply read 'creative industries' too narrowly."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.6-f", domain:1, ts:"1.6", scenario:4, type:"single",
  stem:"An engineer suggests that any task decomposition problem can be solved by moving to a model with a larger context window. For which of these problems is that actually true?",
  options:[
    {k:"A", text:"None of them; capacity governs how much fits, not how attention is spread across it."},
    {k:"B", text:"Inconsistent review depth across many files, which is caused by exceeding the window."},
    {k:"C", text:"Contradictory findings within one review, which occur when older content is evicted."},
    {k:"D", text:"Missed cross-file bugs, which occur because the related files cannot all be held in context simultaneously."}
  ],
  correct:["A"],
  explain:{
    why:"These symptoms come from attention dilution, not capacity exhaustion. The material already fits; the model is simply not attending to all of it evenly. Decomposition into focused passes addresses that, and a bigger window does not.",
    distractors:{
      B:"Fourteen source files fit comfortably in a modern context window. The unevenness appears well below the limit.",
      C:"Contradictory findings within a single pass are not caused by eviction; all the content was present throughout.",
      D:"Cross-file bugs are missed because no pass was tasked with looking across files, which remains true however large the window is."
    }
  },
  refs:[{label:"API: Context windows", url:"https://platform.claude.com/docs/en/build-with-claude/context-windows"}] },

{ id:"d1-1.6-g", domain:1, ts:"1.6", scenario:0, type:"single",
  stem:"Which pairing of task type to decomposition strategy is correct?",
  options:[
    {k:"A", text:"Predictable multi-aspect review to prompt chaining; open-ended investigation to dynamic decomposition."},
    {k:"B", text:"Predictable multi-aspect review to dynamic decomposition; open-ended investigation to prompt chaining."},
    {k:"C", text:"Both to prompt chaining, since sequential steps are easier to observe and debug."},
    {k:"D", text:"Both to dynamic decomposition, since adaptivity is never a disadvantage."}
  ],
  correct:["A"],
  explain:{
    why:"Prompt chaining fits work whose steps are known in advance and independent of intermediate findings. Dynamic decomposition fits work where each step's results determine what to do next. Matching the strategy to which of those you have is the whole skill.",
    distractors:{
      B:"This is exactly inverted. Adaptivity is wasted on a fixed checklist, and a fixed chain is actively harmful on an investigation.",
      C:"Observability is a real benefit of chaining, but forcing it onto open-ended investigation bakes in assumptions before you have any evidence.",
      D:"Adaptivity costs tokens and latency, and adds nondeterminism where a predictable checklist would have been simpler and cheaper."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d1-1.7-a", domain:1, ts:"1.7", scenario:4, type:"single",
  stem:"You spent yesterday's session having Claude analyse a payments module. Overnight, a colleague refactored three of those files substantially. You want to continue the investigation today. What is the best approach?",
  options:[
    {k:"A", text:"Resume the session and tell it explicitly which three files changed."},
    {k:"B", text:"Resume the session and continue asking questions, since the agent will notice any discrepancies itself."},
    {k:"C", text:"Start a fresh session and re-explore the entire module from scratch to guarantee accuracy."},
    {k:"D", text:"Resume the session and immediately run `/compact` to clear the stale file contents from context."}
  ],
  correct:["A"],
  explain:{
    why:"Most of yesterday's analysis is still valid, so resuming preserves genuine value. Naming the changed files converts the stale portion into a targeted re-read rather than a full re-exploration.",
    distractors:{
      B:"The agent has no way to notice. It holds yesterday's file contents in context and no signal that anything on disk moved, so it will answer confidently from stale reads.",
      C:"This is safe but wasteful, discarding a full session of valid analysis to fix a three-file problem.",
      D:"`/compact` summarises context to reduce usage. It does not selectively evict stale file contents, and may well preserve the stale conclusions in summary form."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.7-b", domain:1, ts:"1.7", scenario:4, type:"single",
  stem:"A week-old investigation session analysed 40 files. Since then the team has completed a major refactor touching most of them. You need to continue the work. What is the better choice and why?",
  options:[
    {k:"A", text:"Start a new session with a structured summary of the prior conclusions."},
    {k:"B", text:"Resume the old session, because session resumption always preserves more useful context than starting fresh and re-injecting a written summary of it."},
    {k:"C", text:"Resume the old session and ask it to re-read all 40 files before answering anything further."},
    {k:"D", text:"Fork the old session, because forking discards stale tool results while keeping conclusions."}
  ],
  correct:["A"],
  explain:{
    why:"Resumption is worth it when prior context is mostly still valid. Once most of the tool results describe code that no longer exists, that context is a liability, and the conclusions worth keeping can be carried forward as an injected summary instead.",
    distractors:{
      B:"Preserving more context is only a benefit when the context is true. Here most of it is not.",
      C:"Re-reading all 40 files inside the resumed session leaves both the stale and fresh versions in context, which is a reliable way to produce confused, contradictory answers.",
      D:"Forking copies the session including its stale tool results. It creates a branch; it does not clean anything."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.7-c", domain:1, ts:"1.7", scenario:2, type:"single",
  stem:"Which flag continues a specific, previously named conversation in Claude Code?",
  options:[
    {k:"A", text:"`--resume <session-name>`"},
    {k:"B", text:"`--continue <session-name>`"},
    {k:"C", text:"`--session <session-name>`"},
    {k:"D", text:"`--restore <session-name>`"}
  ],
  correct:["A"],
  explain:{
    why:"`--resume` with a session name continues that specific prior conversation, which is what makes named investigation sessions usable across days.",
    distractors:{
      B:"Not the documented flag for resuming a named session.",
      C:"Not the documented flag for this purpose.",
      D:"Not a Claude Code flag."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.7-d", domain:1, ts:"1.7", scenario:4, type:"single",
  stem:"You want to compare two testing strategies for the same module, each explored in depth, without either exploration influencing the other, and without repeating the shared codebase analysis. What is the right mechanism?",
  options:[
    {k:"A", text:"`fork_session` from the completed analysis, creating two independent branches."},
    {k:"B", text:"One session where you ask for both strategies in sequence and compare at the end."},
    {k:"C", text:"Two fresh sessions, each performing its own codebase analysis before exploring one strategy."},
    {k:"D", text:"One session with `/compact` between the two explorations to clear the first from context."}
  ],
  correct:["A"],
  explain:{
    why:"Forking gives both branches the identical analysis baseline while keeping their subsequent reasoning independent. That is precisely the comparison you want: same starting evidence, divergent exploration.",
    distractors:{
      B:"Sequential exploration in one session means the second proposal is anchored on the first, which is the contamination you are trying to avoid.",
      C:"This achieves independence but pays for the analysis twice, and the two baselines may differ, weakening the comparison.",
      D:"`/compact` summarises rather than erases. Traces of the first strategy survive into the second exploration."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.7-e", domain:1, ts:"1.7", scenario:0, type:"single",
  stem:"What is the main risk of resuming a long session whose tool results no longer match the state of the code?",
  options:[
    {k:"A", text:"The agent reasons confidently from stale file contents, producing authoritative-looking errors."},
    {k:"B", text:"The session fails to load, because Claude Code validates file checksums on resume."},
    {k:"C", text:"Tool results older than 24 hours are automatically discarded from the session, so the resumed context comes back silently empty."},
    {k:"D", text:"Resumed sessions run at reduced context capacity, so the stale content crowds out new work."}
  ],
  correct:["A"],
  explain:{
    why:"Stale context is worse than absent context. The agent has no signal that what it holds is out of date, so it answers with full confidence from a version of the code that no longer exists.",
    distractors:{
      B:"There is no checksum validation gate on resume; the session loads regardless of what changed on disk.",
      C:"Tool results do not expire on a timer. They persist in the conversation as long as it does.",
      D:"Resumption does not reduce context capacity."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.7-f", domain:1, ts:"1.7", scenario:4, type:"single",
  stem:"A multi-day investigation keeps losing findings between sessions. The team wants findings to survive regardless of whether a session is resumed. What is the most robust addition?",
  options:[
    {k:"A", text:"Have the agent maintain a scratchpad file of key findings on disk."},
    {k:"B", text:"Increase the session retention period so old sessions remain resumable for longer."},
    {k:"C", text:"Always resume with `--resume` rather than starting new sessions."},
    {k:"D", text:"Raise the context window size so that a single session can span the entire multi-day investigation without truncation."}
  ],
  correct:["A"],
  explain:{
    why:"A file on disk outlives context windows, sessions and compaction alike. Writing findings there and reading them back at session start makes persistence independent of session mechanics entirely.",
    distractors:{
      B:"Retention keeps sessions resumable, but the findings still degrade with context pressure and go stale as code changes.",
      C:"Always resuming is the wrong default; when tool results are stale, a fresh session with a summary is more reliable.",
      D:"No context window makes a multi-day investigation fit in one session, and everything is still lost when it ends."
    }
  },
  refs:[{label:"API: Context windows", url:"https://platform.claude.com/docs/en/build-with-claude/context-windows"}] },

{ id:"d1-1.7-g", domain:1, ts:"1.7", scenario:0, type:"multi",
  stem:"Which two situations favour starting a fresh session with an injected summary over resuming the prior one? (Select 2.)",
  options:[
    {k:"A", text:"Most files analysed in the prior session have since been substantially rewritten."},
    {k:"B", text:"The prior session accumulated verbose tool output with little remaining relevance."},
    {k:"C", text:"The prior session ended cleanly yesterday afternoon, and no code in the repository has changed since."},
    {k:"D", text:"You want to compare two approaches from a shared analysis baseline."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both describe context whose value has decayed. Rewritten files make prior reads misleading, and accumulated irrelevant output crowds the window. In each case a compact summary of the conclusions is worth more than the raw history.",
    distractors:{
      C:"This is the ideal case for resumption: the prior context is still accurate and directly useful.",
      D:"That is what `fork_session` is for. Forking preserves the shared baseline, which starting fresh would discard."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },
