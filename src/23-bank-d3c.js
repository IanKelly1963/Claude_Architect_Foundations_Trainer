
/* ---- Domain 3 expansion: task statements 3.4, 3.5 and 3.6 ---- */

{ id:"d3-3.4-g", domain:3, ts:"3.4", scenario:4, type:"single",
  stem:"A ticket reads: 'Add a null check to `formatDate` so it returns an empty string for null input.' Which mode fits?",
  options:[
    {k:"A", text:"Direct execution."},
    {k:"B", text:"Plan mode, to check every caller first."},
    {k:"C", text:"Plan mode, since date handling is subtle."},
    {k:"D", text:"Direct execution, after an Explore subagent maps the callers."}
  ],
  correct:["A"],
  explain:{
    why:"The change is one conditional in one function, the desired behaviour is stated, and there is no competing approach. That is the canonical direct-execution case.",
    distractors:{
      B:"Checking callers is prudent in general, but the specified behaviour is a safe default that does not change existing non-null results.",
      C:"Date handling can be subtle, though the subtlety here is already resolved by the ticket saying what null should produce.",
      D:"An exploration pass before a one-line change costs more than the change itself."
    }
  },
  refs:[R_SUB] },

{ id:"d3-3.4-h", domain:3, ts:"3.4", scenario:4, type:"single",
  stem:"You must choose between two authentication libraries with different session models, affecting roughly 30 files. Which approach fits?",
  options:[
    {k:"A", text:"Plan mode, since two viable approaches differ architecturally."},
    {k:"B", text:"Direct execution with the more popular library."},
    {k:"C", text:"Direct execution of both, then keep whichever is cleaner."},
    {k:"D", text:"Plan mode only if the first attempt runs into trouble."}
  ],
  correct:["A"],
  explain:{
    why:"Two defensible options with different downstream consequences is exactly what planning is for. The cost of choosing wrong is 30 files of rework.",
    distractors:{
      B:"Popularity is a weak proxy for fit, and the session models are what actually differ.",
      C:"Implementing both is a genuine spike technique, but at 30 files each it is far more expensive than comparing designs first.",
      D:"The difficulty is stated in the requirement rather than something that might emerge later."
    }
  },
  refs:[R_SUB] },

{ id:"d3-3.4-i", domain:3, ts:"3.4", scenario:4, type:"single",
  stem:"A discovery phase produces thousands of lines of search output, and by implementation the agent has lost earlier decisions. What addresses this?",
  options:[
    {k:"A", text:"Run discovery in an Explore subagent and return a summary."},
    {k:"B", text:"Increase the context window for the whole session."},
    {k:"C", text:"Run `/compact` between the phases."},
    {k:"D", text:"Repeat the decisions in the implementation prompt."}
  ],
  correct:["A"],
  explain:{
    why:"Isolating discovery keeps the verbose output out of the main window entirely, so the conversation retains the decisions rather than the search transcripts.",
    distractors:{
      C:"Compaction reclaims room after the output has already displaced the decisions, and summarises lossily.",
      B:"A bigger window holds more search output alongside the decisions rather than separating them.",
      D:"Restating decisions helps but treats the symptom while the transcripts keep accumulating."
    }
  },
  refs:[R_SUB] },

{ id:"d3-3.4-j", domain:3, ts:"3.4", scenario:1, type:"single",
  stem:"What does plan mode chiefly protect against?",
  options:[
    {k:"A", text:"Committing to a structure too early."},
    {k:"B", text:"Writing code that fails to compile at build time."},
    {k:"C", text:"Exceeding the session's token budget."},
    {k:"D", text:"Editing files outside the repository."}
  ],
  correct:["A"],
  explain:{
    why:"It allows exploration and design while changing nothing, so a wrong structural assumption is discovered when correcting it is still cheap.",
    distractors:{
      B:"Compilation errors are caught by building and are not what planning addresses.",
      C:"Exploration during planning consumes tokens like any other work.",
      D:"Path restrictions are a permissions concern rather than a mode concern."
    }
  },
  refs:[R_SUB] },

{ id:"d3-3.4-k", domain:3, ts:"3.4", scenario:4, type:"single",
  stem:"A developer stays in plan mode for a mechanical rename across 45 files after the approach is settled. What is the cost?",
  options:[
    {k:"A", text:"Ceremony on work whose shape is already known."},
    {k:"B", text:"Plan mode cannot express changes spanning multiple files."},
    {k:"C", text:"The plan expires before the edits can be applied."},
    {k:"D", text:"Plan mode forbids more than ten files per plan."}
  ],
  correct:["A"],
  explain:{
    why:"Once the approach is decided the remaining work is execution. Continuing to plan adds review overhead without reducing any remaining risk.",
    distractors:{
      B:"Plans routinely describe multi-file changes.",
      C:"Plans do not expire.",
      D:"There is no such file limit."
    }
  },
  refs:[R_SUB] },

{ id:"d3-3.4-l", domain:3, ts:"3.4", scenario:4, type:"single",
  stem:"A bug report includes a stack trace pointing at one line, and the fix is evident from it. A colleague insists on plan mode for all production fixes. What is the strongest counter-argument?",
  options:[
    {k:"A", text:"The criterion is ambiguity, not environment."},
    {k:"B", text:"Plan mode is unavailable for hotfixes."},
    {k:"C", text:"Production fixes are too urgent to spend time planning."},
    {k:"D", text:"A stack trace already constitutes a plan in itself."}
  ],
  correct:["A"],
  explain:{
    why:"What earns planning is competing approaches or a wide blast radius. A localised fix with an evident cause has neither, whatever environment it is destined for.",
    distractors:{
      C:"Urgency is a poor reason to skip design on a genuinely ambiguous change, so this proves too much.",
      B:"Plan mode is available for any change.",
      D:"A stack trace localises a fault; it does not weigh alternatives or scope."
    }
  },
  refs:[R_SUB] },

{ id:"d3-3.4-m", domain:3, ts:"3.4", scenario:4, type:"single",
  stem:"Which pair of tasks is correctly assigned?",
  options:[
    {k:"A", text:"Service extraction to plan mode; a typo fix to direct execution."},
    {k:"B", text:"A typo fix to plan mode; service extraction to direct execution."},
    {k:"C", text:"Both to plan mode, for consistency."},
    {k:"D", text:"Both to direct execution, since planning slows delivery."}
  ],
  correct:["A"],
  explain:{
    why:"Service extraction involves boundary decisions and many files; a typo has one obvious correct outcome. The modes match the risk.",
    distractors:{
      B:"Exactly inverted, and the expensive half is the extraction.",
      C:"Uniform planning adds overhead to trivial work without reducing any risk.",
      D:"Uniform direct execution commits to a service structure before examining dependencies."
    }
  },
  refs:[R_SUB] },

{ id:"d3-3.4-n", domain:3, ts:"3.4", scenario:4, type:"single",
  stem:"A plan is approved and implementation begins, but a dependency emerges that invalidates part of it. What is the appropriate response?",
  options:[
    {k:"A", text:"Return to planning for the affected part, keeping the rest."},
    {k:"B", text:"Continue exactly as planned and fix the consequences afterwards."},
    {k:"C", text:"Abandon the plan entirely and restart."},
    {k:"D", text:"Implement a workaround so that the original plan still holds."}
  ],
  correct:["A"],
  explain:{
    why:"Plans are hypotheses about a codebase. New evidence invalidates the part it touches, and re-planning that part is cheaper than either forcing it through or discarding sound work.",
    distractors:{
      B:"Proceeding on a known-invalid plan is how expensive rework happens.",
      C:"Discarding the whole plan throws away the parts the discovery did not affect.",
      D:"A workaround preserves the plan at the cost of the design it was supposed to produce."
    }
  },
  refs:[R_SUB] },

{ id:"d3-3.4-o", domain:3, ts:"3.4", scenario:4, type:"multi",
  stem:"Which two are appropriate uses of the Explore subagent? (Select 2.)",
  options:[
    {k:"A", text:"Locating every file matching several naming conventions."},
    {k:"B", text:"Mapping how a feature is wired across an unfamiliar service."},
    {k:"C", text:"Applying a rename across files already identified."},
    {k:"D", text:"Writing the implementation once the design is agreed."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both are broad discovery producing verbose intermediate output where only the conclusion matters, which is what the subagent isolates.",
    distractors:{
      C:"Applying a known change to a known list is execution, not discovery.",
      D:"Implementation belongs in the main session where the decisions live."
    }
  },
  refs:[R_SUB] },

{ id:"d3-3.4-p", domain:3, ts:"3.4", scenario:3, type:"single",
  stem:"A developer says plan mode is unnecessary because they can always undo changes with version control. What does that miss?",
  options:[
    {k:"A", text:"Reverting recovers the files but not the time or the reasoning."},
    {k:"B", text:"Version control cannot revert multi-file changes."},
    {k:"C", text:"Plan mode commits changes that cannot be reverted."},
    {k:"D", text:"Reverting requires a clean working tree, which is rare."}
  ],
  correct:["A"],
  explain:{
    why:"Undo restores the code, not the hours spent going the wrong way or the design insight that would have avoided it. Planning is about choosing well, not about recoverability.",
    distractors:{
      B:"Multi-file reverts are routine.",
      C:"Plan mode makes no changes at all, which is its defining property.",
      D:"A dirty tree complicates reverting but is not the substantive objection."
    }
  },
  refs:[R_SUB] },

{ id:"d3-3.4-q", domain:3, ts:"3.4", scenario:5, type:"single",
  stem:"A CI job runs Claude Code non-interactively to apply a scripted refactor. Is plan mode relevant?",
  options:[
    {k:"A", text:"No; the approach is decided and nobody reads the plan."},
    {k:"B", text:"Yes; every automated change should be planned before it runs."},
    {k:"C", text:"Yes; plan mode is required for all non-interactive runs."},
    {k:"D", text:"No; plan mode is unavailable outside interactive sessions."}
  ],
  correct:["A"],
  explain:{
    why:"Planning exists to inform a decision. In an unattended run applying a predetermined transformation, there is no decision left and nobody to read the output.",
    distractors:{
      B:"Automation is a reason to have decided carefully beforehand, not to plan on every execution.",
      C:"Nothing requires it, and it would block the job waiting for approval.",
      D:"Availability is not the point; relevance is, and the decision was made before the run."
    }
  },
  refs:[R_HEAD] },

{ id:"d3-3.4-r", domain:3, ts:"3.4", scenario:6, type:"single",
  stem:"Which signal most strongly indicates a task needs plan mode?",
  options:[
    {k:"A", text:"Several defensible approaches with differing costs."},
    {k:"B", text:"The task will touch more than five files."},
    {k:"C", text:"The developer is unfamiliar with the language."},
    {k:"D", text:"The task is expected to take over an hour."}
  ],
  correct:["A"],
  explain:{
    why:"Genuine choice between approaches is where a wrong early commitment is expensive, and where exploring before deciding pays for itself.",
    distractors:{
      B:"File count correlates loosely but a mechanical change across twenty files needs no plan.",
      C:"Unfamiliarity argues for reading and asking questions rather than for a formal plan.",
      D:"Duration follows from the work rather than from whether the approach is contested."
    }
  },
  refs:[R_SUB] },

{ id:"d3-3.4-s", domain:3, ts:"3.4", scenario:4, type:"single",
  stem:"During planning the agent proposes a design that assumes a caching layer the codebase does not have. What does this indicate about the planning phase?",
  options:[
    {k:"A", text:"Exploration was too shallow before the design was drawn."},
    {k:"B", text:"Plan mode cannot inspect the codebase."},
    {k:"C", text:"The plan should be implemented and the cache added."},
    {k:"D", text:"Planning always produces idealised designs."}
  ],
  correct:["A"],
  explain:{
    why:"Planning is exploration followed by design. A design resting on something that does not exist means the exploration did not go far enough to establish what does.",
    distractors:{
      C:"Building a caching layer to satisfy a plan inverts the dependency and expands scope considerably.",
      B:"Reading the codebase is exactly what plan mode is for.",
      D:"A plan grounded in real exploration describes the codebase as it is."
    }
  },
  refs:[R_SUB] },

{ id:"d3-3.4-t", domain:3, ts:"3.4", scenario:4, type:"single",
  stem:"How do plan mode and direct execution combine on a large migration?",
  options:[
    {k:"A", text:"Plan the approach, then execute it directly."},
    {k:"B", text:"Plan and then execute each file in alternation."},
    {k:"C", text:"Execute first, then plan the remaining files."},
    {k:"D", text:"They are alternatives and should not be combined."}
  ],
  correct:["A"],
  explain:{
    why:"Uncertainty concentrates in the choice of approach. Resolve that first, then the remaining work is mechanical and suits direct execution.",
    distractors:{
      B:"Alternating per file re-opens a decision that was already made once.",
      C:"Executing before deciding is what planning exists to prevent.",
      D:"Combining them is the recommended pattern for exactly this shape of work."
    }
  },
  refs:[R_SUB] },

{ id:"d3-3.5-g", domain:3, ts:"3.5", scenario:5, type:"single",
  stem:"A developer has described a formatting requirement three times in prose and received three different interpretations. What should they try next?",
  options:[
    {k:"A", text:"Give two or three input/output examples."},
    {k:"B", text:"Rewrite the description using more precise terminology."},
    {k:"C", text:"Break the description into numbered steps."},
    {k:"D", text:"Ask the model to restate the requirement first."}
  ],
  correct:["A"],
  explain:{
    why:"Three failures is evidence that prose is the wrong medium here. Concrete pairs pin down exactly the edge behaviour the descriptions kept leaving open.",
    distractors:{
      D:"Restating surfaces a misunderstanding but does not supply the correct answer.",
      B:"More precise words is the fourth attempt at the approach that has already failed three times.",
      C:"Numbering clarifies sequence while leaving each step's edge cases open."
    }
  },
  refs:[R_PROMPT] },

{ id:"d3-3.5-h", domain:3, ts:"3.5", scenario:5, type:"single",
  stem:"You are about to implement rate limiting in a domain you do not know well. Which technique surfaces considerations you have not thought of?",
  options:[
    {k:"A", text:"Have Claude ask you questions before implementing."},
    {k:"B", text:"Ask for three implementations and compare."},
    {k:"C", text:"Implement, then review against a checklist."},
    {k:"D", text:"Supply examples of the behaviour you expect."}
  ],
  correct:["A"],
  explain:{
    why:"The interview pattern inverts the flow: rather than you specifying what you do not know to specify, the model raises burst handling, storage and failure modes as questions before any code exists.",
    distractors:{
      B:"Three implementations built on the same incomplete understanding share its blind spots.",
      C:"Reviewing afterwards catches problems once the design is already in code.",
      D:"Examples require knowing the expected behaviour, which is the gap."
    }
  },
  refs:[R_PROMPT] },

{ id:"d3-3.5-i", domain:3, ts:"3.5", scenario:6, type:"single",
  stem:"Four defects are found. Fixing the pagination bug changes what the retry logic must do, and the error handling depends on both. How should they be reported?",
  options:[
    {k:"A", text:"Together, because the fixes interact."},
    {k:"B", text:"One at a time in dependency order."},
    {k:"C", text:"One at a time in severity order."},
    {k:"D", text:"Split into two messages by subsystem."}
  ],
  correct:["A"],
  explain:{
    why:"Interacting fixes made one at a time each disturb the last. Reporting them together lets the model design a coherent solution across all four at once.",
    distractors:{
      B:"Dependency order is the best of the sequential options, but each fix is still made without sight of the others.",
      C:"Severity ordering ignores the interaction entirely.",
      D:"The premise says three of the four interact, so splitting separates dependent fixes."
    }
  },
  refs:[R_PROMPT] },

{ id:"d3-3.5-j", domain:3, ts:"3.5", scenario:6, type:"single",
  stem:"Which order supports test-driven iteration?",
  options:[
    {k:"A", text:"Write the tests first, then iterate on failures."},
    {k:"B", text:"Implement, then write tests matching the implementation."},
    {k:"C", text:"Write tests and implementation in a single request."},
    {k:"D", text:"Write performance tests only, and check correctness by reading."}
  ],
  correct:["A"],
  explain:{
    why:"Tests written first are an executable specification, and each failure is precise, verifiable feedback that drives the next iteration.",
    distractors:{
      B:"Tests derived from the implementation encode its bugs as expected behaviour.",
      C:"Generating both together means the tests inherit whatever misunderstanding shaped the code, so they pass while being wrong.",
      D:"Performance says nothing about correctness."
    }
  },
  refs:[R_PROMPT] },

{ id:"d3-3.5-k", domain:3, ts:"3.5", scenario:5, type:"single",
  stem:"A migration script mishandles nulls in one column. What communicates the fix most reliably?",
  options:[
    {k:"A", text:"A test case with the null input and expected output."},
    {k:"B", text:"An instruction to handle nulls correctly."},
    {k:"C", text:"A request for defensive null checks throughout."},
    {k:"D", text:"The schema, showing which columns are nullable."}
  ],
  correct:["A"],
  explain:{
    why:"A concrete pair says what correct means here: whether the null should become a default, be skipped, or propagate. That is precisely the ambiguity the instruction leaves open.",
    distractors:{
      B:"'Correctly' is the undefined term, so this restates the problem.",
      C:"Blanket checks add noise everywhere without specifying the intended semantics.",
      D:"The schema shows which columns can be null, not what should happen when they are."
    }
  },
  refs:[R_PROMPT] },

{ id:"d3-3.5-l", domain:3, ts:"3.5", scenario:5, type:"single",
  stem:"A CI reviewer's output format varies between runs despite detailed formatting instructions. What is the most effective fix?",
  options:[
    {k:"A", text:"Few-shot examples of the exact output shape."},
    {k:"B", text:"Repeating the format instructions at the end of the prompt."},
    {k:"C", text:"Raising `max_tokens` so nothing is truncated."},
    {k:"D", text:"Asking the model to check its formatting before responding."}
  ],
  correct:["A"],
  explain:{
    why:"Demonstration beats description for format. A worked example shows the shape unambiguously in a way that instructions about the shape do not.",
    distractors:{
      B:"Repetition raises salience slightly and leaves the description-versus-demonstration gap in place.",
      C:"Variation is not truncation; fields are being omitted by choice.",
      D:"Self-checking against the same ambiguous description reproduces the same variance."
    }
  },
  refs:[R_PROMPT] },

{ id:"d3-3.5-m", domain:3, ts:"3.5", scenario:3, type:"single",
  stem:"When is fixing issues one at a time the better approach?",
  options:[
    {k:"A", text:"When the issues are independent."},
    {k:"B", text:"When there are more than three issues."},
    {k:"C", text:"When the issues interact."},
    {k:"D", text:"Always, since smaller changes review more easily."}
  ],
  correct:["A"],
  explain:{
    why:"Independent problems can each be fixed and verified without disturbing the others, which is what makes sequential iteration clean.",
    distractors:{
      C:"Interacting issues are the case for a single combined message.",
      B:"Count is not the criterion; whether the fixes interact is.",
      D:"For interacting problems, small sequential changes produce churn as each undoes the last."
    }
  },
  refs:[R_PROMPT] },

{ id:"d3-3.5-n", domain:3, ts:"3.5", scenario:1, type:"single",
  stem:"How many input/output examples does the guidance suggest for clarifying a transformation?",
  options:[
    {k:"A", text:"Two or three."},
    {k:"B", text:"One, to avoid conflicting patterns."},
    {k:"C", text:"Ten or more, for full coverage."},
    {k:"D", text:"As many as fit in the context window."}
  ],
  correct:["A"],
  explain:{
    why:"A small number is enough to pin down the transformation, including its edge behaviour, without spending context on redundant demonstrations.",
    distractors:{
      B:"One example cannot show a contrast, and contrast is what conveys where the boundary lies.",
      C:"Ten costs substantial context for diminishing returns.",
      D:"Filling the window with examples crowds out the work itself."
    }
  },
  refs:[R_PROMPT] },

{ id:"d3-3.5-o", domain:3, ts:"3.5", scenario:4, type:"single",
  stem:"An agent generates a utility that passes tests but uses an approach the team would reject in review. What would have surfaced this earlier?",
  options:[
    {k:"A", text:"Stating the constraints the team cares about upfront."},
    {k:"B", text:"Writing more tests covering additional inputs."},
    {k:"C", text:"Asking for a second implementation to compare."},
    {k:"D", text:"Running the code under a profiler."}
  ],
  correct:["A"],
  explain:{
    why:"Tests encode behaviour, not house preferences about approach. If the team cares about a particular style or dependency policy, that has to be stated or it cannot be satisfied.",
    distractors:{
      C:"A second implementation might happen to be acceptable, but the criterion is still unstated so it is a coin flip.",
      B:"More tests deepen behavioural coverage without expressing a preference about approach.",
      D:"Profiling measures performance rather than acceptability."
    }
  },
  refs:[R_PROMPT] },

{ id:"d3-3.5-p", domain:3, ts:"3.5", scenario:6, type:"multi",
  stem:"Which two are effective iterative refinement techniques? (Select 2.)",
  options:[
    {k:"A", text:"Sharing specific test failures rather than describing them."},
    {k:"B", text:"Having the model ask questions before implementing."},
    {k:"C", text:"Repeating the same instruction with stronger wording."},
    {k:"D", text:"Raising the temperature to explore alternatives."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both replace vague direction with concrete signal: an actual failure says exactly what is wrong, and an interview surfaces requirements before code is written.",
    distractors:{
      C:"Emphasis does not add information, so it tends to reproduce the same output.",
      D:"Higher temperature adds variance rather than insight, and degrades unrelated parts of the output."
    }
  },
  refs:[R_PROMPT] },

{ id:"d3-3.5-q", domain:3, ts:"3.5", scenario:5, type:"single",
  stem:"A test-generation prompt produces tests for behaviour the team considers not worth testing. What is the most direct fix?",
  options:[
    {k:"A", text:"Document what makes a test valuable here."},
    {k:"B", text:"Request fewer tests per run."},
    {k:"C", text:"Filter out short tests afterwards."},
    {k:"D", text:"Use a larger model."}
  ],
  correct:["A"],
  explain:{
    why:"'Worth testing' is a team judgement the model cannot infer. Writing the criteria down is what lets it prioritise the same way the team would.",
    distractors:{
      B:"Fewer tests of the same kind is less noise, not better selection.",
      C:"Length is a poor proxy for value; some important assertions are short.",
      D:"A stronger model still has to guess at an unstated standard."
    }
  },
  refs:[R_HEAD] },

{ id:"d3-3.5-r", domain:3, ts:"3.5", scenario:5, type:"single",
  stem:"A developer reports 'this function is too slow' and receives three unrelated optimisations. What was missing?",
  options:[
    {k:"A", text:"A measurement of where the time goes."},
    {k:"B", text:"An instruction to optimise only the hot path."},
    {k:"C", text:"A larger context window for the analysis."},
    {k:"D", text:"An example of acceptable performance."}
  ],
  correct:["A"],
  explain:{
    why:"Without a profile, optimisation is guesswork over plausible candidates. A measurement turns it into a targeted change against evidence.",
    distractors:{
      D:"A target figure defines success but still does not say which code to change.",
      B:"Naming the hot path presumes you know which it is, which is what the measurement establishes.",
      C:"Context capacity is not the limit; evidence is."
    }
  },
  refs:[R_PROMPT] },

{ id:"d3-3.5-s", domain:3, ts:"3.5", scenario:3, type:"single",
  stem:"Why are concrete examples more effective than prose for communicating a transformation?",
  options:[
    {k:"A", text:"They pin down edge behaviour that prose leaves implicit."},
    {k:"B", text:"They consume fewer tokens than prose."},
    {k:"C", text:"They are processed before the rest of the prompt."},
    {k:"D", text:"They cannot be misinterpreted by the model under any circumstances."}
  ],
  correct:["A"],
  explain:{
    why:"A description covers the general case and leaves boundaries to inference. A pair showing what a specific awkward input should produce settles those boundaries directly.",
    distractors:{
      B:"Examples often cost more tokens than a sentence; their advantage is precision.",
      C:"Position in the prompt confers no processing priority.",
      D:"Examples can still be over- or under-generalised; they are better, not infallible."
    }
  },
  refs:[R_PROMPT] },

{ id:"d3-3.5-t", domain:3, ts:"3.5", scenario:4, type:"single",
  stem:"An agent asked to refactor a module produces a change that is correct but much larger than intended. What would have constrained it?",
  options:[
    {k:"A", text:"Stating the scope boundary before starting."},
    {k:"B", text:"Asking for the change in smaller instalments afterwards."},
    {k:"C", text:"Reviewing the diff and reverting the excess."},
    {k:"D", text:"Restricting the tools to read-only."}
  ],
  correct:["A"],
  explain:{
    why:"Scope is a requirement like any other. Saying which files or concerns are in bounds prevents the sprawl rather than pruning it afterwards.",
    distractors:{
      B:"Splitting after the fact means the oversized change was already produced and reviewed.",
      C:"Reverting parts of an interdependent refactor is delicate and may leave it inconsistent.",
      D:"Read-only tools prevent refactoring altogether."
    }
  },
  refs:[R_PROMPT] },

{ id:"d3-3.6-g", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"A pipeline step parses Claude Code's response with a regular expression over prose, and breaks whenever the wording changes. What should it use instead?",
  options:[
    {k:"A", text:"`--output-format json` with `--json-schema`."},
    {k:"B", text:"`--output-format text` with a stricter prompt."},
    {k:"C", text:"A post-processing model call to extract fields."},
    {k:"D", text:"A fixed template in the system prompt."}
  ],
  correct:["A"],
  explain:{
    why:"A declared schema makes the response shape a contract rather than a convention, so downstream parsing stops depending on phrasing.",
    distractors:{
      B:"A stricter prompt reduces variation without guaranteeing it, so the regular expression stays fragile.",
      C:"A second model call to parse the first is expensive and introduces its own variability.",
      D:"A template guides output without constraining it."
    }
  },
  refs:[R_HEAD] },

{ id:"d3-3.6-h", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"A CI job invoking `claude` hangs with no output. Logs show it waiting for input. What is the fix?",
  options:[
    {k:"A", text:"Add `-p` to run non-interactively."},
    {k:"B", text:"Set `CI=true` in the environment."},
    {k:"C", text:"Pipe `yes` into the command."},
    {k:"D", text:"Add `--no-tty` to the invocation."}
  ],
  correct:["A"],
  explain:{
    why:"`-p` is the documented print mode: it processes the prompt, writes the result to stdout and exits without waiting for input.",
    distractors:{
      B:"A conventional CI variable is respected by many tools but is not what switches Claude Code's mode.",
      C:"Feeding input to a prompt that expects none is a workaround that does not change the command's mode.",
      D:"`--no-tty` is not a Claude Code flag."
    }
  },
  refs:[R_HEAD] },

{ id:"d3-3.6-i", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"An automated reviewer posts the same three findings on every push. What is the most direct fix?",
  options:[
    {k:"A", text:"Supply prior findings and ask for new or unaddressed ones."},
    {k:"B", text:"Review only the first push of each pull request."},
    {k:"C", text:"Deduplicate by comparing comment text before posting."},
    {k:"D", text:"Reduce sensitivity so fewer findings are produced."}
  ],
  correct:["A"],
  explain:{
    why:"Giving the reviewer its own prior output lets it distinguish what is new, and also lets it notice when an earlier finding has since been fixed.",
    distractors:{
      C:"Text comparison is brittle when the same issue is reworded, and it cannot tell that a finding is now resolved.",
      B:"Reviewing only the first push leaves later commits, where fixes often introduce new problems, unreviewed.",
      D:"Lowering sensitivity suppresses genuine findings to solve a duplication problem."
    }
  },
  refs:[R_HEAD] },

{ id:"d3-3.6-j", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"Generated tests duplicate scenarios the suite already covers. What is the most direct remedy?",
  options:[
    {k:"A", text:"Include the existing tests in context."},
    {k:"B", text:"Instruct the model not to duplicate tests."},
    {k:"C", text:"Discard generated tests that pass immediately."},
    {k:"D", text:"Generate tests only for changed files."}
  ],
  correct:["A"],
  explain:{
    why:"The model cannot avoid duplicating what it has never seen. Supplying the suite lets it identify genuine gaps instead of regenerating coverage.",
    distractors:{
      B:"The instruction is unactionable without knowledge of what exists.",
      C:"Passing is not evidence of duplication; a good new test for correct code also passes.",
      D:"Narrowing scope helps but duplication persists within the changed files."
    }
  },
  refs:[R_HEAD] },

{ id:"d3-3.6-k", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"Why is an independent instance better than the generating session for reviewing generated code?",
  options:[
    {k:"A", text:"It carries no attachment to the code's reasoning."},
    {k:"B", text:"It runs with a larger context window."},
    {k:"C", text:"It has access to the full repository history."},
    {k:"D", text:"It uses a different model version."}
  ],
  correct:["A"],
  explain:{
    why:"The generating session already justified each decision and tends to re-accept those justifications. A fresh instance evaluates the code as written.",
    distractors:{
      B:"Window size is a configuration choice available to either.",
      C:"Repository access is likewise a configuration matter.",
      D:"Both typically run the same model; independence is about context, not version."
    }
  },
  refs:[R_HEAD] },

{ id:"d3-3.6-l", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"Which flag combination produces machine-parseable structured findings from a CI run?",
  options:[
    {k:"A", text:"`-p --output-format json --json-schema`"},
    {k:"B", text:"`-p --format structured`"},
    {k:"C", text:"`--print-json --schema <schema>`"},
    {k:"D", text:"`-p --output json`"}
  ],
  correct:["A"],
  explain:{
    why:"`-p` gives non-interactive execution, `--output-format json` wraps the response, and `--json-schema` constrains the content, which appears in a `structured_output` field.",
    distractors:{
      B:"`--format structured` is not a Claude Code flag.",
      C:"Neither `--print-json` nor a bare `--schema` exists.",
      D:"The flag is `--output-format`, not `--output`."
    }
  },
  refs:[R_HEAD] },

{ id:"d3-3.6-m", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"A CI review misses issues that depend on project conventions it has no knowledge of. Where should those conventions live?",
  options:[
    {k:"A", text:"In CLAUDE.md, which loads on every run."},
    {k:"B", text:"In the pipeline's environment variables."},
    {k:"C", text:"In a wiki the reviewer is told to consult."},
    {k:"D", text:"In comments in the source files."}
  ],
  correct:["A"],
  explain:{
    why:"CLAUDE.md is committed with the code and loads automatically, so a fresh CI session has the project's standards without any extra plumbing.",
    distractors:{
      C:"A wiki the agent cannot fetch is not context, and telling it to consult one it cannot reach changes nothing.",
      B:"Environment variables carry configuration values rather than review criteria.",
      D:"Source comments are seen only when that file is read, so cross-cutting conventions are missed."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.6-n", domain:3, ts:"3.6", scenario:5, type:"multi",
  stem:"Which two practices improve automated review quality in CI? (Select 2.)",
  options:[
    {k:"A", text:"Passing prior findings so only new issues are reported."},
    {k:"B", text:"Documenting review criteria in CLAUDE.md."},
    {k:"C", text:"Reusing the session that generated the code."},
    {k:"D", text:"Raising the temperature to surface more findings."}
  ],
  correct:["A","B"],
  explain:{
    why:"One removes duplicate noise across pushes, the other gives the reviewer the project-specific standards it otherwise has to guess at. Both raise signal.",
    distractors:{
      C:"The generating session carries its own justifications and is the weaker reviewer.",
      D:"Higher temperature adds variance rather than insight, and inflates false positives."
    }
  },
  refs:[R_HEAD] },

{ id:"d3-3.6-o", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"A team wants CI output to be reproducible regardless of a developer's local configuration. Which consideration matters?",
  options:[
    {k:"A", text:"Ensuring the run does not inherit ambient local settings."},
    {k:"B", text:"Pinning the temperature to 0."},
    {k:"C", text:"Running the job on the same machine each time."},
    {k:"D", text:"Using exactly the same prompt wording that developers use when running it locally."}
  ],
  correct:["A"],
  explain:{
    why:"Reproducibility in CI depends on the run being hermetic. If local configuration can leak in, the same commit produces different behaviour on different machines.",
    distractors:{
      B:"Temperature affects sampling variation but not configuration drift, which is the stated concern.",
      C:"A fixed machine hides the problem rather than removing it, and defeats elastic runners.",
      D:"Matching wording aids comparison but does not control which settings are loaded."
    }
  },
  refs:[R_HEAD] },

{ id:"d3-3.6-p", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"A pipeline needs to branch on whether the review found blocking issues. What makes that reliable?",
  options:[
    {k:"A", text:"A schema field the pipeline reads, rather than parsing prose."},
    {k:"B", text:"Grepping the output for the word 'blocking'."},
    {k:"C", text:"Counting the number of findings returned."},
    {k:"D", text:"Checking whether the response exceeds a length threshold."}
  ],
  correct:["A"],
  explain:{
    why:"A declared field is a stable contract. Anything that branches on the result should read a value the schema guarantees rather than inferring it from wording.",
    distractors:{
      B:"Keyword matching breaks the moment the phrasing changes, which is the fragility being removed.",
      C:"Finding count says nothing about severity; ten trivial notes are not a blocker.",
      D:"Response length is unrelated to whether anything blocking was found."
    }
  },
  refs:[R_HEAD] },

{ id:"d3-3.6-q", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"A nightly job analyses the whole repository for technical debt; results are read the next morning. Which API suits it?",
  options:[
    {k:"A", text:"The batch API, for the cost saving."},
    {k:"B", text:"The synchronous API, for predictable completion."},
    {k:"C", text:"Either, since latency is irrelevant overnight."},
    {k:"D", text:"The batch API, but only if results are needed within an hour."}
  ],
  correct:["A"],
  explain:{
    why:"Nothing is blocked on the result until morning, which is exactly the latency-tolerant profile the batch API is priced for.",
    distractors:{
      C:"Both would work, but choosing the synchronous API forfeits a substantial saving for no benefit.",
      B:"Predictability has no value when nobody is waiting.",
      D:"An hourly requirement would argue against batch, which has no latency guarantee."
    }
  },
  refs:[R_BATCH] },

{ id:"d3-3.6-r", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"A CI reviewer flags many findings developers dismiss. Which change most directly improves precision?",
  options:[
    {k:"A", text:"Define which categories to report and which to skip."},
    {k:"B", text:"Ask the model to be more conservative."},
    {k:"C", text:"Report only those findings that sit above a confidence threshold."},
    {k:"D", text:"Limit the reviewer to five findings per pull request."}
  ],
  correct:["A"],
  explain:{
    why:"Categorical criteria are a decision rule the model can apply consistently. Vague calibration language is not anchored to anything and does not reliably shift behaviour.",
    distractors:{
      B:"'Conservative' is undefined, so the effect is unpredictable.",
      C:"Self-reported confidence is poorly calibrated to correctness.",
      D:"A cap hides findings without improving which ones are chosen."
    }
  },
  refs:[R_PROMPT] },

{ id:"d3-3.6-s", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"Why does `-p` matter specifically for CI rather than being a convenience?",
  options:[
    {k:"A", text:"Without it the job blocks waiting for input."},
    {k:"B", text:"Without it the output is not written to stdout."},
    {k:"C", text:"Without it tool use is disabled."},
    {k:"D", text:"Without it the exit code is always reported as zero."}
  ],
  correct:["A"],
  explain:{
    why:"Interactive mode expects a terminal and a person. In CI there is neither, so the job hangs until the runner's timeout rather than failing usefully.",
    distractors:{
      B:"Print mode is what routes the result to stdout, but the blocking behaviour is the reason the job never completes at all.",
      C:"Tool use is available in both modes.",
      D:"Exit codes are not governed by this flag."
    }
  },
  refs:[R_HEAD] },

{ id:"d3-3.6-t", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"A team asks whether to run the pre-merge check through the batch API to save cost. What is the correct advice?",
  options:[
    {k:"A", text:"No; developers are blocked and batch has no latency guarantee."},
    {k:"B", text:"Yes; batch usually completes within minutes."},
    {k:"C", text:"Yes, with a synchronous fallback if the batch is slow."},
    {k:"D", text:"No; the batch API cannot process code."}
  ],
  correct:["A"],
  explain:{
    why:"Batch offers up to a 24-hour window with no guaranteed latency, which is unusable when a merge is waiting on the answer.",
    distractors:{
      B:"Usual completion time is not a guarantee, and the tail is what blocks a developer.",
      C:"A dual path is more complexity than simply matching each API to its workload.",
      D:"Batch processes any content; the constraint is latency, not subject matter."
    }
  },
  refs:[R_BATCH] },
