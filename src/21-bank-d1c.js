
/* ---- Domain 1 expansion: task statements 1.1 and 1.2 ---- */

{ id:"d1-1.1-h", domain:1, ts:"1.1", scenario:1, type:"single",
  stem:"Your loop executes the requested tool, then sends a fresh request containing only the tool result and the original system prompt. The agent asks the customer for their order number a second time. What is missing?",
  options:[
    {k:"A", text:"Every prior turn, including the assistant's tool calls, must be resent alongside the new result."},
    {k:"B", text:"The system prompt should be repeated at the end of the request as well as the beginning."},
    {k:"C", text:"The tool result needs a `cache_control` marker so the model retains it across requests."},
    {k:"D", text:"The session identifier from the first response must be echoed back to restore server-side state."}
  ],
  correct:["A"],
  explain:{
    why:"The API is stateless. A request containing only the newest result gives the model no record of what the customer already said, so it re-asks. Conversation history is the agent's entire memory and has to travel with every call.",
    distractors:{
      B:"Repeating the system prompt is a real technique for keeping instructions salient in long contexts, but it carries no conversational content, so the order number is still absent.",
      C:"`cache_control` reduces the cost of resending a stable prefix. It is an optimisation over history you are already sending, not a substitute for sending it.",
      D:"This is a reasonable instinct from stateful APIs, but there is no server-side conversation state to restore; the identifier would carry nothing."
    }
  },
  refs:[R_CTX] },

{ id:"d1-1.1-i", domain:1, ts:"1.1", scenario:3, type:"single",
  stem:"A research agent's loop treats any response containing a text block as final. Roughly one turn in six, Claude writes 'Let me search for that' and emits a `tool_use` block in the same turn. What happens?",
  options:[
    {k:"A", text:"The loop stops with the search unexecuted and presents the narration as the answer."},
    {k:"B", text:"The loop executes the search but discards the result, because the text block was seen first."},
    {k:"C", text:"The API rejects the response outright, since text and `tool_use` blocks cannot appear together in one turn."},
    {k:"D", text:"The loop retries the same request until a turn arrives with no text block."}
  ],
  correct:["A"],
  explain:{
    why:"Treating text presence as completion terminates a turn that was in fact requesting a tool. The user receives the model's narration of what it intended to do, with none of it done, which reads as a confident but empty answer.",
    distractors:{
      B:"Nothing executes the search. The loop has already exited on seeing text, so no tool call is dispatched at all.",
      C:"Mixed text and `tool_use` in a single turn is normal and expected; the API returns it happily.",
      D:"There is no retry in this design. The loop treats the turn as complete and returns, which is precisely the bug."
    }
  },
  refs:[R_TOOL] },

{ id:"d1-1.1-j", domain:1, ts:"1.1", scenario:4, type:"single",
  stem:"A code-exploration tool fails and your handler returns the error as ordinary text in the `tool_result`. The agent proceeds as though the file were empty. How should a failed tool execution be returned?",
  options:[
    {k:"A", text:"As a `tool_result` marked as an error, so the model can distinguish failure from an empty result."},
    {k:"B", text:"By omitting the `tool_result` block entirely, so the model retries the call."},
    {k:"C", text:"By raising the exception to the caller and terminating the loop for that request."},
    {k:"D", text:"As a `tool_result` containing an empty string, leaving the model to infer that nothing was found."}
  ],
  correct:["A"],
  explain:{
    why:"An error and an empty file are different facts, and the model can only act on the difference if you signal it. Marking the result as an error lets it retry, try another path, or report the problem instead of reasoning from a false premise.",
    distractors:{
      B:"Omitting the block leaves the tool call unanswered, which breaks the pairing the turn requires and typically causes the model to re-request rather than recover.",
      C:"Terminating on any tool failure throws away an otherwise healthy session for something the model could often route around.",
      D:"An empty string is exactly the ambiguity to avoid: it is indistinguishable from a genuinely empty file, which is how the agent reached the wrong conclusion."
    }
  },
  refs:[R_TOOL] },

{ id:"d1-1.1-k", domain:1, ts:"1.1", scenario:1, type:"single",
  stem:"Your support loop caps iterations at five. A refund case legitimately needs seven tool calls: verify customer, look up two orders, check policy, calculate, process, confirm. What does the student need to understand about the cap?",
  options:[
    {k:"A", text:"It is a runaway guard, and using it to terminate normal work truncates legitimate cases."},
    {k:"B", text:"It should be raised to match the longest workflow, then left as the termination condition."},
    {k:"C", text:"It is the only bound on cost, so `stop_reason` checking becomes redundant once it is set."},
    {k:"D", text:"It should be applied per tool rather than per loop, so that each tool gets five attempts."}
  ],
  correct:["A"],
  explain:{
    why:"A cap answers 'has something gone wrong?', not 'is the model finished?'. When it fires during legitimate work the case ends half-processed, which with a refund means money moved but never confirmed.",
    distractors:{
      B:"Raising it helps this case but reinstates the same failure at a higher number, and the next unusual case exceeds it too. The cap should not be the thing deciding completion.",
      C:"This has it backwards. `stop_reason` is what detects completion; the cap only bounds pathological behaviour, and relying on it alone truncates every long task.",
      D:"Per-tool retry budgets are a sensible idea for transient failures, but they do not address when the overall loop should end."
    }
  },
  refs:[R_TOVR] },

{ id:"d1-1.1-l", domain:1, ts:"1.1", scenario:3, type:"single",
  stem:"Claude returns one turn containing four `tool_use` blocks: three web searches and one document fetch. Your loop executes them and sends four separate user messages, one per result. What goes wrong?",
  options:[
    {k:"A", text:"Each message leaves the remaining calls unanswered, breaking the pairing within that turn."},
    {k:"B", text:"The four results arrive out of order, so the model attributes them to the wrong calls."},
    {k:"C", text:"Only the last message is retained, because each new user message supersedes the one before it."},
    {k:"D", text:"The searches execute sequentially rather than in parallel, costing latency but nothing else."}
  ],
  correct:["A"],
  explain:{
    why:"A turn requesting four tools is answered by one user message carrying all four `tool_result` blocks. Splitting it sends a message that answers one call while three remain outstanding, which is not a valid continuation of that turn.",
    distractors:{
      B:"Ordering is not the risk, since each result carries the `tool_use_id` of the call it answers; the problem is structural rather than a mix-up.",
      C:"User messages accumulate in the conversation rather than replacing one another, so nothing is superseded.",
      D:"Execution order is your choice and unrelated to how results are returned. The defect here is the message structure, not the latency."
    }
  },
  refs:[R_TOOL] },

{ id:"d1-1.1-m", domain:1, ts:"1.1", scenario:4, type:"single",
  stem:"A developer proposes a loop that inspects the arguments of each `tool_use` block and, if the agent asks to read a file it has already read, substitutes a cached result rather than re-reading. What is the main risk?",
  options:[
    {k:"A", text:"The file may have changed since the first read, so the agent reasons from stale content."},
    {k:"B", text:"Caching breaks the `tool_use_id` pairing, so the model cannot match the result to its call."},
    {k:"C", text:"The model will detect the substitution and re-request the file with different arguments."},
    {k:"D", text:"Cached results cannot be placed in a `tool_result` block, so the turn cannot be completed."}
  ],
  correct:["A"],
  explain:{
    why:"Agents often re-read a file precisely because they have just edited it. Serving a cached copy hands back the pre-edit content, and the agent then reasons confidently from a version that no longer exists on disk.",
    distractors:{
      B:"The pairing is preserved as long as you return the result under the same `tool_use_id`; the cache is invisible at that level.",
      C:"The model has no way to tell a cached result from a fresh one, which is what makes the staleness dangerous rather than self-correcting.",
      D:"A cached string goes into a `tool_result` exactly like a fresh one; there is no structural obstacle."
    }
  },
  refs:[R_TOOL] },

{ id:"d1-1.1-n", domain:1, ts:"1.1", scenario:6, type:"single",
  stem:"An extraction agent loops over a 200-page document, calling a page-reader tool. After 40 iterations the responses start omitting details from pages read early in the run. What is the most likely cause?",
  options:[
    {k:"A", text:"Accumulated tool results have filled the context, so early pages are no longer well attended."},
    {k:"B", text:"The loop has exceeded the maximum number of `tool_result` blocks a conversation can hold."},
    {k:"C", text:"`stop_reason` has switched to `max_tokens`, silently truncating the earlier history."},
    {k:"D", text:"The tool is returning pages in a different format after the fortieth call."}
  ],
  correct:["A"],
  explain:{
    why:"Forty pages of tool output is a large amount of context, and material in the middle of a long input is the least reliably attended. The fix is to extract what matters from each page as you go rather than carrying every page forward whole.",
    distractors:{
      B:"There is no cap on the number of `tool_result` blocks in a conversation; the constraint is the context window, which is a different thing.",
      C:"`max_tokens` bounds the length of a single response and does not retroactively remove earlier history from the conversation you send.",
      D:"A format change would show as parsing failures or obviously wrong values on recent pages, not as gradual loss of detail from early ones."
    }
  },
  refs:[R_CTX] },

{ id:"d1-1.1-o", domain:1, ts:"1.1", scenario:1, type:"single",
  stem:"Which sequence correctly describes one full iteration of an agentic loop?",
  options:[
    {k:"A", text:"Send history, read `stop_reason`, execute any requested tools, append results, send again."},
    {k:"B", text:"Send history, execute the tools named in the system prompt, read `stop_reason`, append results."},
    {k:"C", text:"Execute the next tool in the configured sequence, send the result, then read `stop_reason`."},
    {k:"D", text:"Send history, wait for `end_turn`, execute all tools the model mentioned, then send again."}
  ],
  correct:["A"],
  explain:{
    why:"The model decides what to call, so nothing is executed until its response has been read. `stop_reason` tells you whether tools were requested, the results are appended, and the enlarged conversation goes back for the next decision.",
    distractors:{
      B:"Tools are requested by the model in its response, not enumerated in the system prompt, so there is nothing to execute before reading the reply.",
      C:"A configured sequence is a pipeline rather than an agentic loop, and it removes the model's ability to choose the next action from what it has learned.",
      D:"`end_turn` means the model has finished and is requesting nothing, so waiting for it before executing tools means no tool ever runs."
    }
  },
  refs:[R_TOOL] },

{ id:"d1-1.1-p", domain:1, ts:"1.1", scenario:5, type:"single",
  stem:"A CI review agent runs a loop over a pull request. It sometimes ends after a single turn with a partial review, and the logs show `stop_reason: \"max_tokens\"`. What should the loop do?",
  options:[
    {k:"A", text:"Treat it as truncated rather than complete, and continue generation."},
    {k:"B", text:"Treat it as equivalent to `end_turn`, since the model has stopped producing output either way."},
    {k:"C", text:"Retry the identical request, since truncation is a transient sampling artefact."},
    {k:"D", text:"Discard the turn and reduce the number of files in the request until the response fits."}
  ],
  correct:["A"],
  explain:{
    why:"`max_tokens` means the response hit its output limit mid-thought. It is neither a finished turn nor a tool request, and presenting it ships a review that stops in the middle of a sentence.",
    distractors:{
      B:"Both stop generation, but only `end_turn` means the model considered itself finished. Conflating them is how truncated output reaches the user as though it were complete.",
      C:"Truncation is deterministic given the same input and limit, so an identical retry truncates at the same place.",
      D:"Reducing scope is a reasonable longer-term response to persistently oversized reviews, but it discards work already generated and does not handle the case in front of you."
    }
  },
  refs:[R_TOOL] },

{ id:"d1-1.1-q", domain:1, ts:"1.1", scenario:2, type:"single",
  stem:"Your loop appends tool results but reconstructs the assistant's turn from scratch, keeping only its text and dropping the `tool_use` blocks. What breaks?",
  options:[
    {k:"A", text:"The results answer calls with no matching request, so the conversation is inconsistent."},
    {k:"B", text:"Nothing breaks; `tool_use` blocks are only needed at the moment of execution."},
    {k:"C", text:"The model loses its system prompt, since it is carried on the assistant turn."},
    {k:"D", text:"Token usage rises, because the model regenerates the dropped blocks on the following turn."}
  ],
  correct:["A"],
  explain:{
    why:"A `tool_result` refers back to a `tool_use_id`. Removing the assistant's `tool_use` blocks leaves results pointing at calls that no longer appear anywhere in the history, so the record of what the agent did is incoherent.",
    distractors:{
      B:"This is a tempting simplification because execution is already finished, but the blocks are also the conversational record of what was requested, and the results depend on them.",
      C:"The system prompt is a separate top-level parameter and is unaffected by what the assistant turn contains.",
      D:"The model does not regenerate prior turns. The consequence is an inconsistent history, not extra generation."
    }
  },
  refs:[R_TOOL] },

{ id:"d1-1.1-r", domain:1, ts:"1.1", scenario:3, type:"multi",
  stem:"Your loop must decide what to do with a response. Which two `stop_reason` values mean the loop should NOT execute any tools for that turn? (Select 2.)",
  options:[
    {k:"A", text:"`end_turn`"},
    {k:"B", text:"`max_tokens`"},
    {k:"C", text:"`tool_use`"},
    {k:"D", text:"`pause_turn`"}
  ],
  correct:["A","B"],
  explain:{
    why:"`end_turn` means the model has finished and requested nothing. `max_tokens` means it was cut off mid-response, so any partially formed request is not something to act on. Neither is an instruction to run a tool.",
    distractors:{
      C:"`tool_use` is precisely the case where tools should be executed and their results returned.",
      D:"`pause_turn` indicates a long-running turn that should be continued by sending the response back, so the turn is not finished and work does continue."
    }
  },
  refs:[R_TOOL] },

{ id:"d1-1.1-s", domain:1, ts:"1.1", scenario:4, type:"single",
  stem:"An engineer wants the agent to always call `list_files` before `read_file`, and proposes enforcing it inside the loop by rejecting any `read_file` call that arrives first. What is the trade-off?",
  options:[
    {k:"A", text:"It is deterministic, but it removes the model's ability to skip a listing it does not need."},
    {k:"B", text:"It cannot work, because the loop has no visibility of which tool the model requested."},
    {k:"C", text:"It is equivalent to a system prompt instruction, so it adds complexity for no gain."},
    {k:"D", text:"It guarantees ordering only when both tools appear in the same turn."}
  ],
  correct:["A"],
  explain:{
    why:"Loop-level gating does give a hard guarantee, which is right when the ordering is a genuine safety requirement. The cost is that a model given an exact path it already knows now has to make a redundant call first.",
    distractors:{
      B:"The loop reads every `tool_use` block before executing it, so it has full visibility of the tool name and arguments.",
      C:"The two are not equivalent at all: the prompt version is followed most of the time, and the gate is followed every time. That difference is the whole reason to consider it.",
      D:"A gate can track what has already been called across the whole conversation, so it is not limited to a single turn."
    }
  },
  refs:[R_HOOK] },

{ id:"d1-1.1-t", domain:1, ts:"1.1", scenario:6, type:"single",
  stem:"An extraction loop sends `tool_choice: \"any\"` on every iteration to guarantee structured output. After the extraction succeeds the loop never terminates. Why?",
  options:[
    {k:"A", text:"`any` forbids a text-only reply, so `end_turn` can never be reached."},
    {k:"B", text:"`any` disables `stop_reason`, so the loop has nothing to test against."},
    {k:"C", text:"`any` retries the same tool until its output validates against the schema."},
    {k:"D", text:"`any` is only valid on the first request and is silently ignored afterwards."}
  ],
  correct:["A"],
  explain:{
    why:"Forcing a tool call on every turn removes the model's only way to say it has finished. The setting is right for the extraction request itself and wrong as a permanent loop-wide default; relax it once the structured output has been captured.",
    distractors:{
      B:"`stop_reason` is returned on every response regardless of `tool_choice`; it simply keeps reporting `tool_use`.",
      C:"`tool_choice` does not validate output or drive retries; schema validation is something you do with the result.",
      D:"The parameter applies to whichever request carries it, so sending it every time keeps forcing a call every time."
    }
  },
  refs:[R_TOVR] },

{ id:"d1-1.2-h", domain:1, ts:"1.2", scenario:3, type:"single",
  stem:"Your coordinator delegates to four subagents and aggregates their output, but when the document-analysis subagent returns nothing usable the coordinator still runs synthesis and ships the report. What is missing from the coordinator's role?",
  options:[
    {k:"A", text:"Evaluating results before deciding the next step, rather than aggregating whatever arrives."},
    {k:"B", text:"A longer timeout on the document-analysis subagent so it has more chance to succeed."},
    {k:"C", text:"Instructions to the synthesis subagent to refuse input it judges insufficient."},
    {k:"D", text:"A larger context window on the coordinator so it can hold all four outputs at once."}
  ],
  correct:["A"],
  explain:{
    why:"Aggregation is only half the coordinator's job. It also has to judge whether what came back is good enough to proceed on, and re-delegate when it is not. Without that step the pipeline runs to completion regardless of quality.",
    distractors:{
      B:"A longer timeout helps if the cause was slowness, but it does nothing about the coordinator proceeding on a poor result once it arrives.",
      C:"Pushing the judgement downstream puts it in the agent with the least context about what was requested, and the synthesis agent still has to produce something.",
      D:"Context capacity is not the constraint; the coordinator received all four outputs and chose to proceed."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.2-i", domain:1, ts:"1.2", scenario:3, type:"single",
  stem:"A coordinator dispatches the same broad query to three research subagents and merges the results, reasoning that three attempts beat one. Cost triples and coverage improves by under 5%. What went wrong?",
  options:[
    {k:"A", text:"Identical assignments produce overlapping work rather than additional coverage."},
    {k:"B", text:"The three subagents shared a context window, so later ones saw the earlier results."},
    {k:"C", text:"Merging by union discards findings that appear in only one of the three."},
    {k:"D", text:"Three subagents exceed the recommended fan-out, so the third was silently dropped."}
  ],
  correct:["A"],
  explain:{
    why:"Parallel capacity only buys coverage if the assignments differ. Given the same query, three agents largely retrace the same ground, so you pay three times for close to one agent's result.",
    distractors:{
      B:"Subagents have isolated context by design, so none of them could see what the others were finding.",
      C:"A union merge keeps everything including singletons; the shortfall is in what was gathered, not in how it was combined.",
      D:"There is no such fan-out limit, and all three ran, which is exactly why the cost tripled."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.2-j", domain:1, ts:"1.2", scenario:1, type:"single",
  stem:"A support coordinator delegates a billing question to a specialist subagent, which returns a correct but bare figure. The customer reply omits the context they asked for. Where should the shortfall be addressed?",
  options:[
    {k:"A", text:"In the coordinator, which owns composing the customer-facing response from subagent output."},
    {k:"B", text:"In the billing subagent, which should write the full customer reply itself."},
    {k:"C", text:"In the system prompt, by asking every one of the subagents to write in a customer-friendly register."},
    {k:"D", text:"In the customer's original message, which should be rewritten before delegation."}
  ],
  correct:["A"],
  explain:{
    why:"Subagents return findings; the coordinator turns findings into a resolution. It is the only component that saw the whole customer message, so it is the only one that knows which parts of the question remain unanswered.",
    distractors:{
      B:"A specialist writing the final reply has only its own slice of the case, so it cannot address the concerns handled elsewhere in the same message.",
      C:"Register is a reasonable thing to standardise, but tone was not the gap; the missing context was.",
      D:"Rewriting the customer's words risks discarding the very detail that is missing from the reply."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.2-k", domain:1, ts:"1.2", scenario:3, type:"single",
  stem:"Which responsibility belongs to the coordinator rather than to a subagent?",
  options:[
    {k:"A", text:"Deciding which subagents a given query actually requires."},
    {k:"B", text:"Choosing which search terms to use for an assigned subtopic."},
    {k:"C", text:"Recovering locally from a transient timeout on its own tool call."},
    {k:"D", text:"Judging whether a retrieved source is relevant to its assigned scope."}
  ],
  correct:["A"],
  explain:{
    why:"Only the coordinator sees the whole query and the full roster, so routing is its decision. The others are judgements a specialist makes within the scope it was given.",
    distractors:{
      B:"Query formulation is exactly what a search subagent is specialised for, and dictating terms from above removes its ability to adapt.",
      C:"Local recovery from transient failures is the subagent's job; escalating every retry would flood the coordinator with noise it cannot act on.",
      D:"Relevance within an assigned scope is a specialist judgement, and the coordinator lacks the retrieved material to make it."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.2-l", domain:1, ts:"1.2", scenario:4, type:"single",
  stem:"A codebase-exploration coordinator spawns a subagent per directory. On a repository with 300 directories the run costs far more than reading the code directly. What principle was missed?",
  options:[
    {k:"A", text:"Decomposition should follow the shape of the question, not the shape of the filesystem."},
    {k:"B", text:"Subagents should always be spawned sequentially rather than in parallel."},
    {k:"C", text:"Each subagent should have been given the full repository for context."},
    {k:"D", text:"Directory-level work should sit with the coordinator and file-level work be delegated out."}
  ],
  correct:["A"],
  explain:{
    why:"Delegation earns its cost when a subtask is substantial and self-contained. Mapping one subagent onto each directory ignores whether that directory has anything to do with the question, so most of the fan-out investigates nothing relevant.",
    distractors:{
      B:"Sequential execution would make the same 300 investigations slower without making any of them more useful.",
      C:"Giving each subagent the whole repository multiplies the context cost by 300 and still does not make the irrelevant directories worth visiting.",
      D:"Swapping which layer handles which granularity leaves the same problem: the work is being divided by structure rather than by relevance."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.2-m", domain:1, ts:"1.2", scenario:3, type:"single",
  stem:"After adding an iterative refinement loop, your coordinator re-delegates and re-synthesises up to twelve times on broad topics before it is satisfied. What should bound it?",
  options:[
    {k:"A", text:"An explicit coverage criterion, so the loop ends on the goal being met."},
    {k:"B", text:"A hard cap of two refinement rounds, applied to every topic regardless of breadth."},
    {k:"C", text:"Removing refinement entirely, since the first synthesis is usually adequate."},
    {k:"D", text:"Delegating the stopping decision to the synthesis subagent, which sees the report."}
  ],
  correct:["A"],
  explain:{
    why:"A refinement loop needs a definition of done. Stated coverage criteria let a narrow topic finish in one round and a broad one take four, and both terminate for the same principled reason.",
    distractors:{
      B:"A flat cap is simple and predictable, but it truncates genuinely broad topics at the same point it comfortably fits narrow ones.",
      C:"Removing refinement returns you to shipping whatever the first pass produced, which is the gap the loop was added to close.",
      D:"The synthesis subagent sees only the findings it was handed, so it cannot tell whether the topic as a whole has been covered."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.2-n", domain:1, ts:"1.2", scenario:3, type:"single",
  stem:"Two subagents report contradictory findings on the same sub-question. What should the coordinator do?",
  options:[
    {k:"A", text:"Carry both forward with attribution and let synthesis present the disagreement."},
    {k:"B", text:"Re-run both subagents until they converge on the same answer."},
    {k:"C", text:"Accept the finding from whichever subagent returned more sources."},
    {k:"D", text:"Drop the sub-question from the report, since the evidence is unreliable."}
  ],
  correct:["A"],
  explain:{
    why:"Two credible agents disagreeing is usually a real disagreement in the sources, not a bug. Preserving both with attribution tells the reader something true; silently resolving it invents a certainty the evidence does not support.",
    distractors:{
      B:"Re-running until agreement selects for consensus rather than accuracy, and may simply converge on whichever answer is easier to find.",
      C:"Source count measures how much was written, not which account is correct; a well-covered error is still an error.",
      D:"Dropping the sub-question hides a genuine finding, and contested points are often the ones most worth reporting."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.2-o", domain:1, ts:"1.2", scenario:1, type:"single",
  stem:"A customer message needs an order lookup and a policy check. Your coordinator runs them sequentially because the policy check 'might depend on' the order. Inspection shows it never does. What is the cost?",
  options:[
    {k:"A", text:"Latency roughly doubles for no benefit, since the two are genuinely independent."},
    {k:"B", text:"The policy check receives stale order data, because it runs after the lookup completes."},
    {k:"C", text:"The coordinator cannot aggregate results that arrived at different times."},
    {k:"D", text:"Sequential delegation prevents the two subagents from sharing customer context."},
  ],
  correct:["A"],
  explain:{
    why:"Two independent lookups run concurrently in the time of the slower one. Serialising them on a dependency that does not exist is a straight latency loss, which matters when a customer is waiting.",
    distractors:{
      B:"Running later means fresher data, not staler, so ordering does not harm correctness here.",
      C:"Aggregation is unaffected by arrival time; the coordinator simply waits for both.",
      D:"Shared context comes from what the coordinator puts in each prompt, and is available whether the calls are concurrent or not."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.2-p", domain:1, ts:"1.2", scenario:5, type:"single",
  stem:"A CI coordinator delegates per-file review to subagents, then asks a final subagent to write the summary comment. The summary contradicts individual file findings. What is the likely cause?",
  options:[
    {k:"A", text:"The summariser was given the files rather than the findings, so it reviewed afresh."},
    {k:"B", text:"The per-file subagents ran in parallel, so their findings arrived in a non-deterministic order."},
    {k:"C", text:"The summary subagent inherited the coordinator's context and merged it with its own."},
    {k:"D", text:"Contradictions are unavoidable when more than one subagent reviews the same pull request."}
  ],
  correct:["A"],
  explain:{
    why:"A summariser handed source files does the review again, in a single pass, with none of the depth the per-file agents applied. Give it the findings and its job becomes combining them, which is what you actually wanted.",
    distractors:{
      B:"Arrival order affects how you assemble the list, not whether the conclusions conflict.",
      C:"Subagents do not inherit coordinator context; whatever this one saw was placed in its prompt deliberately.",
      D:"Contradictions are avoidable precisely by having the summary work from the findings rather than forming independent ones."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.2-q", domain:1, ts:"1.2", scenario:3, type:"multi",
  stem:"Which two are genuine reasons to route all subagent communication through the coordinator? (Select 2.)",
  options:[
    {k:"A", text:"One component sees every delegation, so failures are observable in a single place."},
    {k:"B", text:"Error handling stays consistent, rather than each agent inventing its own recovery."},
    {k:"C", text:"It reduces total token usage, because messages travel a shorter path."},
    {k:"D", text:"It allows subagents to share a single context window and avoid duplication."}
  ],
  correct:["A","B"],
  explain:{
    why:"Hub-and-spoke buys observability and consistency. Every delegation and every failure passes through one component, so behaviour can be seen and error policy applied uniformly.",
    distractors:{
      C:"Routing through a hub adds a hop rather than removing one, so token usage goes up slightly, not down.",
      D:"Subagents keep isolated context under any topology; the coordinator does not merge their windows."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.2-r", domain:1, ts:"1.2", scenario:4, type:"single",
  stem:"An engineer proposes that the coordinator write its delegation decisions to a log the subagents can read, so they know what the others are doing. What is the strongest objection?",
  options:[
    {k:"A", text:"It rebuilds shared state, reintroducing the coupling isolation removes."},
    {k:"B", text:"Subagents cannot perform file reads at all, so they would have no way to access the log."},
    {k:"C", text:"The log would exceed the context window of any subagent that tried to read it."},
    {k:"D", text:"Delegation decisions are not knowable until every subagent has returned."}
  ],
  correct:["A"],
  explain:{
    why:"Isolation is what keeps a subagent's behaviour a function of its prompt alone, which makes it testable and its failures local. A shared log recreates a channel between peers with none of the coordinator's oversight.",
    distractors:{
      B:"Subagents routinely have file tools, so access is a configuration matter rather than an obstacle.",
      C:"A delegation log is small, and size would not be the reason to reject the design.",
      D:"The coordinator makes each decision before dispatching, so they are available to write down at the time."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.2-s", domain:1, ts:"1.2", scenario:6, type:"single",
  stem:"An extraction pipeline uses a coordinator with one subagent per document type. A new document type appears and is routed to the closest existing subagent, producing confidently wrong output. What should change?",
  options:[
    {k:"A", text:"The coordinator should recognise when no subagent fits and route the document for review."},
    {k:"B", text:"The closest subagent should be broadened until it covers every document type."},
    {k:"C", text:"A subagent should be created for every document type the business might ever receive."},
    {k:"D", text:"The document should be reformatted to match the nearest supported type before it is routed."}
  ],
  correct:["A"],
  explain:{
    why:"Forced routing turns an unknown into a plausible-looking error. A coordinator that can say 'none of these fit' converts a silent extraction failure into a visible one a human can resolve.",
    distractors:{
      B:"A subagent broad enough for everything loses the specialisation that made per-type extraction accurate in the first place.",
      C:"Enumerating future document types in advance is not achievable, and the next unanticipated one recreates the problem.",
      D:"Reshaping a document to fit a schema it does not match discards or distorts exactly the fields that differ."
    }
  },
  refs:[R_SUB] },

{ id:"d1-1.2-t", domain:1, ts:"1.2", scenario:2, type:"single",
  stem:"A developer asks why the coordinator should decide which subagents to run, rather than running all of them and letting each decide whether it has anything to contribute. What is the strongest answer?",
  options:[
    {k:"A", text:"An agent asked whether it is relevant will usually find something to say."},
    {k:"B", text:"Subagents cannot decline an invocation once it has been dispatched."},
    {k:"C", text:"Running every subagent exceeds the maximum concurrent delegations allowed."},
    {k:"D", text:"Only the coordinator has permission to invoke tools on the subagents' behalf."}
  ],
  correct:["A"],
  explain:{
    why:"Self-selection is weak: a document-analysis agent handed an irrelevant query tends to produce a thin, plausible answer rather than an abstention, and that output then flows into synthesis as though it were a finding.",
    distractors:{
      B:"An agent can certainly return an empty result; the difficulty is that it usually will not.",
      C:"There is no such concurrency ceiling, and the objection would be about cost rather than correctness.",
      D:"Subagents invoke their own tools; the coordinator does not proxy for them."
    }
  },
  refs:[R_SUB] },
