
/* ---------------- Domain 1: Agentic Architecture & Orchestration ---------------- */

{ id:"d1-1.1-a", domain:1, ts:"1.1", scenario:1, type:"single",
  stem:"Your support agent's loop terminates by checking whether the assistant's text contains a completion phrase such as 'Let me know if you need anything else.' In production, roughly 8% of conversations end while a `tool_use` block is still pending, leaving refunds initiated but never confirmed. What is the correct loop termination condition?",
  options:[
    {k:"A", text:"Continue while `stop_reason` is `tool_use`; terminate when `stop_reason` is `end_turn`."},
    {k:"B", text:"Terminate when the assistant returns any text content block, since text signals a user-facing answer."},
    {k:"C", text:"Cap the loop at 10 iterations and return whatever the last assistant message contained."},
    {k:"D", text:"Ask the model to emit a sentinel token such as `<DONE>` and terminate when that token appears."}
  ],
  correct:["A"],
  explain:{
    why:"`stop_reason` is the API's explicit, deterministic statement of whether the model is waiting on tool results or has finished its turn. Reading it removes the guesswork entirely: `tool_use` means execute the requested tools and iterate, `end_turn` means present the answer.",
    distractors:{
      B:"A single assistant turn can contain both text and `tool_use` blocks. The model often narrates what it is about to do and then calls a tool in the same turn, so text presence is not a completion signal.",
      C:"An iteration cap is a reasonable runaway guard but a poor primary stopping rule. It terminates mid-task on legitimately long workflows and does nothing to detect genuine completion.",
      D:"A sentinel token is still parsing natural language output to infer control flow. It is probabilistic, and it can be omitted or emitted early, when the API already reports the state deterministically."
    }
  },
  refs:[{label:"API: How tool use works", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works"}] },

{ id:"d1-1.1-b", domain:1, ts:"1.1", scenario:4, type:"single",
  stem:"After executing a tool your loop sends the result back to Claude, but the model repeatedly re-requests the same tool with identical arguments. Inspection shows you are sending the tool output as a plain text `user` message describing what happened. What is wrong?",
  options:[
    {k:"A", text:"Tool results must be returned as `tool_result` blocks keyed to the originating `tool_use_id`."},
    {k:"B", text:"Tool results must be appended to the assistant message that requested them, rather than being sent back as a separate new message."},
    {k:"C", text:"The system prompt needs an instruction telling Claude not to repeat tool calls it has already made."},
    {k:"D", text:"You must set `tool_choice: \"none\"` on the follow-up request so the model stops calling tools."}
  ],
  correct:["A"],
  explain:{
    why:"A `tool_result` block carries the `tool_use_id` of the call it answers. That identifier is how the model binds a result to the specific request that produced it. A prose description of the outcome is not linked to anything, so from the model's perspective the call is still outstanding.",
    distractors:{
      B:"Assistant messages are not modified after the fact. The protocol is a new user-role message containing the `tool_result` blocks.",
      C:"Prompt instruction cannot repair a structural protocol error; the model is repeating the call because it has no record of the first one being answered.",
      D:"`tool_choice: \"none\"` would suppress further tool calls entirely, breaking any workflow needing more than one step. It masks the bug rather than fixing it."
    }
  },
  refs:[{label:"API: How tool use works", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works"}] },

{ id:"d1-1.1-c", domain:1, ts:"1.1", scenario:3, type:"single",
  stem:"A colleague proposes replacing your agentic loop with a fixed pipeline: always call `search_web`, then always call `analyze_documents`, then always call `synthesize`. They argue this is more predictable. What is the primary architectural cost of that change?",
  options:[
    {k:"A", text:"The system loses model-driven decision-making and cannot adapt to what earlier results revealed."},
    {k:"B", text:"Fixed pipelines cannot return structured output, so downstream parsing becomes unreliable."},
    {k:"C", text:"The `stop_reason` field is no longer populated, so the loop cannot detect completion."},
    {k:"D", text:"Fixed pipelines are incompatible with MCP tools, which require dynamic discovery and cannot be bound to a predetermined call order."}
  ],
  correct:["A"],
  explain:{
    why:"The value of the agentic loop is that Claude reasons over accumulated context to choose the next action. A fixed sequence discards that: if the search returns nothing useful, the pipeline still runs document analysis and synthesis on empty input rather than reformulating the query.",
    distractors:{
      B:"Structured output is orthogonal to control flow; a fixed pipeline can use tool-use schemas just as an agentic loop can.",
      C:"`stop_reason` is returned on every Messages API response regardless of how you orchestrate calls.",
      D:"MCP tools work perfectly well when invoked in a fixed order. Discovery happens at connection time either way."
    }
  },
  refs:[{label:"API: Tool use overview", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"}] },

{ id:"d1-1.1-d", domain:1, ts:"1.1", scenario:0, type:"single",
  stem:"An assistant turn comes back with `stop_reason: \"tool_use\"` and contains three separate `tool_use` blocks. How should the loop handle this iteration?",
  options:[
    {k:"A", text:"Execute all three tools and return all three `tool_result` blocks in one user message."},
    {k:"B", text:"Execute only the first tool and return its result, so the model can reconsider the remaining two."},
    {k:"C", text:"Execute the three tools and send three separate user messages, one result per message."},
    {k:"D", text:"Reject the response and re-request with `disable_parallel_tool_use` set, since multiple calls per turn are unsupported."}
  ],
  correct:["A"],
  explain:{
    why:"Claude can request several tools in one turn precisely so they can be executed together. Returning all results in one user message completes that turn and lets the model reason over the full set at once.",
    distractors:{
      B:"Dropping two requested calls leaves them unanswered. The model asked for all three because it judged all three necessary, and it will typically just re-request them, costing a round trip.",
      C:"Each user message would leave the other tool calls unanswered at the point it is sent, which breaks the pairing between calls and results within the turn.",
      D:"Multiple `tool_use` blocks per turn is supported and desirable. `disable_parallel_tool_use` is an option for when you specifically do not want it, not a requirement."
    }
  },
  refs:[{label:"API: How tool use works", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works"}] },

{ id:"d1-1.1-e", domain:1, ts:"1.1", scenario:1, type:"single",
  stem:"To reduce token spend, an engineer changes the loop to send only the latest user message and the most recent tool result on each iteration, dropping earlier turns. Quality collapses: the agent re-asks for the customer's order number it already retrieved. Why?",
  options:[
    {k:"A", text:"The Messages API is stateless, so complete history must be resent on every iteration."},
    {k:"B", text:"Tool results expire after one iteration and must be re-fetched from the tool to stay valid."},
    {k:"C", text:"Conversation state is held server-side against the session ID, which the change invalidated."},
    {k:"D", text:"Prompt caching was disabled by the change, and the cache is the mechanism that preserves conversational memory across requests to the API."}
  ],
  correct:["A"],
  explain:{
    why:"There is no server-side conversation memory. Each request must carry the full history, including previous tool calls and their results, because that history is the entire basis for the model's reasoning. Truncating it deletes what the agent knows.",
    distractors:{
      B:"Tool results do not expire. They remain valid context for as long as you keep sending them.",
      C:"The Messages API holds no server-side conversation state keyed to a session ID. Statelessness is the point.",
      D:"Prompt caching reduces the cost of resending a stable prefix. It is an optimisation over the history you send, not a store that substitutes for sending it."
    }
  },
  refs:[{label:"API: Context windows", url:"https://platform.claude.com/docs/en/build-with-claude/context-windows"}] },

{ id:"d1-1.1-f", domain:1, ts:"1.1", scenario:6, type:"multi",
  stem:"You are reviewing a colleague's agentic loop implementation before it ships. Which two of the following are genuine anti-patterns that should be flagged? (Select 2.)",
  options:[
    {k:"A", text:"Using a regular expression over the assistant's response text to decide whether the task is complete."},
    {k:"B", text:"Using a maximum iteration count as the sole mechanism for ending the loop."},
    {k:"C", text:"Appending each `tool_result` block to the conversation history before issuing the next request."},
    {k:"D", text:"Inspecting `stop_reason` on every response to decide whether to iterate."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both of these substitute a probabilistic or arbitrary signal for the deterministic one the API provides. Regex over natural language misfires on paraphrase, and an iteration cap has no relationship to whether the work is actually finished; it will cut off long legitimate tasks and let short broken ones run to the limit.",
    distractors:{
      C:"This is correct practice. Appending tool results to the conversation is exactly how the model incorporates new information into its next decision.",
      D:"This is correct practice, and the recommended termination mechanism."
    }
  },
  refs:[{label:"API: How tool use works", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works"}] },

{ id:"d1-1.1-g", domain:1, ts:"1.1", scenario:4, type:"single",
  stem:"Your codebase-exploration agent runs a long loop and occasionally hits a genuine infinite cycle: it Greps, Reads, then Greps the same pattern again indefinitely. You need to stop runaway cost without breaking legitimate long tasks. What is the appropriate role for an iteration cap here?",
  options:[
    {k:"A", text:"Keep `stop_reason` as the termination condition and add the cap as a runaway safety net."},
    {k:"B", text:"Replace `stop_reason` checking with the cap, since the cap is the only mechanism that reliably bounds cost."},
    {k:"C", text:"Remove the cap and instead instruct the model in the system prompt never to repeat an identical tool call."},
    {k:"D", text:"Set the cap to exactly the number of tools the agent has available, since a well-behaved agent should need to call each of them only once."}
  ],
  correct:["A"],
  explain:{
    why:"The two mechanisms answer different questions. `stop_reason` answers 'is the model finished?' and the cap answers 'has something gone wrong?'. Keeping both, and surfacing the incomplete state when the cap fires, preserves correct termination while bounding worst-case cost.",
    distractors:{
      B:"Making the cap primary means every task ends arbitrarily rather than when complete, so correct long-running work is truncated as readily as a broken loop.",
      C:"A prompt instruction cannot guarantee the loop terminates, and legitimate work often does repeat a tool call with the same arguments, for example re-reading a file after editing it.",
      D:"There is no relationship between tool count and iteration count. Agents legitimately call the same tool many times across an exploration."
    }
  },
  refs:[{label:"API: Tool use overview", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"}] },

{ id:"d1-1.2-a", domain:1, ts:"1.2", scenario:3, type:"single",
  stem:"Running the topic 'impact of AI on creative industries', every subagent completes successfully, yet the final report covers only visual arts. The coordinator's log shows it decomposed the topic into 'AI in digital art creation', 'AI in graphic design' and 'AI in photography'. What is the most likely root cause?",
  options:[
    {k:"A", text:"The coordinator's task decomposition was too narrow to cover the whole topic."},
    {k:"B", text:"The synthesis agent lacks instructions for identifying coverage gaps in the findings it receives."},
    {k:"C", text:"The web search agent's queries need broadening to reach more creative-industry sectors."},
    {k:"D", text:"The document analysis agent is filtering out non-visual sources through overly restrictive relevance criteria."}
  ],
  correct:["A"],
  explain:{
    why:"The decomposition log states the cause outright: all three subtasks are visual arts. Every subagent then executed its assignment correctly. When workers succeed at what they were given and the output is still incomplete, the defect is in what they were given.",
    distractors:{
      B:"Gap detection in synthesis would be a useful safety net, but the synthesis agent can only work with findings it receives, and nothing about music or film was ever gathered.",
      C:"The search agent was told to search for digital art, graphic design and photography. It did that correctly; broadening its queries would mean ignoring its assignment.",
      D:"There is no evidence of filtering. No non-visual sources were ever requested, so there were none to filter."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.2-b", domain:1, ts:"1.2", scenario:3, type:"single",
  stem:"To cut latency, a developer proposes letting the document-analysis subagent call the web-search subagent directly whenever it needs a source, bypassing the coordinator. What is the strongest architectural objection?",
  options:[
    {k:"A", text:"Routing all communication through the coordinator preserves observability and error handling."},
    {k:"B", text:"Subagents are technically incapable of invoking other subagents under any configuration."},
    {k:"C", text:"Direct calls would cause the two subagents to share a context window, exhausting it faster."},
    {k:"D", text:"The coordinator would no longer receive `stop_reason` values from the delegated calls, so it could not tell when the subagent had actually finished."}
  ],
  correct:["A"],
  explain:{
    why:"Hub-and-spoke exists so one component sees everything: which delegations happened, which failed, what partial results exist, and how information moved. Peer-to-peer calls create paths the coordinator cannot see, so failures inside them are invisible and error handling becomes inconsistent.",
    distractors:{
      B:"It is a design constraint you impose, not a technical impossibility; a subagent granted the Task tool could spawn others.",
      C:"Subagents have isolated context by design. Direct invocation does not merge context windows.",
      D:"`stop_reason` is a per-request API field, unaffected by which component issues the request."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.2-c", domain:1, ts:"1.2", scenario:3, type:"single",
  stem:"Your coordinator routes every query through all four subagents. For a simple factual query like 'What year was the transformer architecture published?', this costs four delegations and 90 seconds. What change best addresses this without weakening complex-query handling?",
  options:[
    {k:"A", text:"Have the coordinator analyse query requirements and dynamically select which subagents to invoke."},
    {k:"B", text:"Add a caching layer keyed on query text so repeated simple questions skip the pipeline entirely."},
    {k:"C", text:"Reduce the number of subagents from four to two by merging search with analysis and synthesis with reporting."},
    {k:"D", text:"Run all four subagents in parallel so total latency is bounded by the slowest rather than the sum."}
  ],
  correct:["A"],
  explain:{
    why:"Deciding which subagents a query actually needs is a core coordinator responsibility. A simple factual lookup needs search, not document analysis and full synthesis. Dynamic selection cuts the cost of easy queries while leaving the full pipeline available for hard ones.",
    distractors:{
      B:"Caching helps only on repeats. The first instance of every simple query still pays the full four-delegation cost.",
      C:"Merging specialised agents broadens each one's remit and tool set, which degrades tool selection reliability, and it still runs everything for every query.",
      D:"Parallelism reduces wall-clock time but not token cost, and the pipeline is partly sequential anyway since synthesis depends on search and analysis output."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.2-d", domain:1, ts:"1.2", scenario:3, type:"single",
  stem:"Two search subagents working the same topic return heavily overlapping sources: 60% of retrieved URLs are duplicated between them. What is the most effective coordinator-level fix?",
  options:[
    {k:"A", text:"Partition research scope explicitly, giving each subagent distinct subtopics or source types."},
    {k:"B", text:"Deduplicate the merged result set by URL before the combined findings are passed to the synthesis agent for report generation."},
    {k:"C", text:"Reduce to a single search subagent, since parallel search inherently duplicates work."},
    {k:"D", text:"Instruct each search subagent to avoid sources that another subagent might also find."}
  ],
  correct:["A"],
  explain:{
    why:"Duplication here is a delegation problem: both agents were pointed at the same ground. Assigning disjoint subtopics or source types (one takes academic literature, one takes industry reporting) means the parallel capacity buys genuinely additional coverage.",
    distractors:{
      B:"Deduplicating afterwards cleans the output but you have already paid twice for the same searches, and the coverage gap those wasted calls could have filled remains unfilled.",
      C:"This throws away parallel capacity to solve a scoping problem. Properly partitioned parallel search is strictly better than serial search.",
      D:"A subagent has no visibility into what its peers are finding, so it cannot act on this instruction. It has isolated context by design."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.2-e", domain:1, ts:"1.2", scenario:3, type:"single",
  stem:"Your synthesis agent produces a report covering four of the six subtopics the coordinator identified; two are thin because sources were sparse. You want the system to close such gaps automatically rather than shipping a partial report. What pattern should the coordinator implement?",
  options:[
    {k:"A", text:"An iterative refinement loop: evaluate the synthesis for gaps, re-delegate, then re-invoke it."},
    {k:"B", text:"Instruct the synthesis agent to expand thin sections using its own background knowledge, so every subtopic reaches comparable depth and length in the final report."},
    {k:"C", text:"Increase the number of parallel search subagents from two to six, one per subtopic, on every run."},
    {k:"D", text:"Have the synthesis agent return an error whenever any subtopic falls below a source-count threshold."}
  ],
  correct:["A"],
  explain:{
    why:"The coordinator is the component that can see the whole picture and re-delegate. Evaluating the synthesis for gaps and issuing targeted follow-up queries closes them with focused extra work, rather than blanket effort or an unfinished report.",
    distractors:{
      B:"Filling gaps from model background knowledge produces unsourced claims in a report whose whole purpose is to be cited. That trades a visible gap for an invisible accuracy risk.",
      C:"Always running six searches spends the maximum on every topic regardless of need, and still offers no mechanism for noticing a gap that remains after they run.",
      D:"Failing the run discards four good sections. Partial results with an annotated gap are more useful than an error, and the coordinator could have filled the gap instead."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.2-f", domain:1, ts:"1.2", scenario:1, type:"single",
  stem:"A customer message raises three issues at once: a damaged item, a duplicate charge, and a question about upgrading their plan. Your agent resolves the damaged item and ignores the other two. Which coordinator-level approach best fixes this?",
  options:[
    {k:"A", text:"Decompose into distinct items, investigate each in parallel, then synthesise one unified reply."},
    {k:"B", text:"Instruct the agent to handle the highest-priority issue first and ask the customer to open separate tickets for the rest."},
    {k:"C", text:"Add a preprocessing classifier that routes the message to whichever single specialist queue best matches its dominant topic, discarding the secondary concerns."},
    {k:"D", text:"Increase the maximum response length so there is room to address all three concerns."}
  ],
  correct:["A"],
  explain:{
    why:"Multi-concern messages need explicit decomposition, or the agent latches onto the first issue and treats the turn as complete. Investigating each item against shared customer context and then synthesising one reply resolves everything in a single contact, which is what the first-contact-resolution target measures.",
    distractors:{
      B:"Asking the customer to file more tickets pushes work onto them and directly harms first-contact resolution.",
      C:"Routing to one queue by dominant topic structurally guarantees the other two issues are dropped. It formalises the bug.",
      D:"Length is not the constraint. The agent is not truncating a three-part answer; it never investigated the other two issues."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.2-g", domain:1, ts:"1.2", scenario:3, type:"single",
  stem:"Which statement about subagent context in a coordinator-subagent system is correct?",
  options:[
    {k:"A", text:"Subagents operate with isolated context and do not inherit the coordinator's history."},
    {k:"B", text:"Subagents inherit the coordinator's full conversation history automatically, which is why prompts can stay brief."},
    {k:"C", text:"Subagents share a single context window with the coordinator, so total usage is the sum across all agents."},
    {k:"D", text:"Subagents inherit context only on their first invocation; subsequent invocations start empty."}
  ],
  correct:["A"],
  explain:{
    why:"Context isolation is the defining property of subagent delegation, and the reason it helps with context management: the coordinator stays clean while a subagent does verbose work. The corollary is that anything the subagent needs must be written into its prompt.",
    distractors:{
      B:"This is the single most consequential misconception in this domain. Assuming inheritance produces subagents that act on nothing, because their prompt omitted the facts they needed.",
      C:"A shared window would defeat the purpose. Isolation is what prevents verbose subagent work from consuming the coordinator's context.",
      D:"There is no first-invocation special case. No invocation inherits parent context, and nothing is shared between invocations either."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.3-a", domain:1, ts:"1.3", scenario:3, type:"single",
  stem:"Your coordinator's system prompt instructs it to delegate research to specialised subagents, but at runtime it never delegates; it attempts all the work itself. The AgentDefinitions are correctly declared. What should you check first?",
  options:[
    {k:"A", text:"That the coordinator's `allowedTools` includes `Task`, without which it cannot delegate."},
    {k:"B", text:"That each subagent's `description` field is long enough for the coordinator to match against."},
    {k:"C", text:"That the coordinator and subagents are configured with the same model."},
    {k:"D", text:"That the coordinator's context window is large enough to hold all subagent definitions simultaneously."}
  ],
  correct:["A"],
  explain:{
    why:"Task is the mechanism for spawning subagents. If it is absent from `allowedTools`, the coordinator has no way to delegate no matter what its prompt says, so it falls back to doing the work directly. That is exactly the symptom described.",
    distractors:{
      B:"Thin descriptions cause the coordinator to pick the wrong subagent, not to skip delegation entirely while defined agents are available.",
      C:"Coordinator and subagents routinely run different models; a cheaper model for narrow subtasks is a common and valid choice.",
      D:"Agent definitions are small. Running out of context would produce errors or truncation, not a silent refusal to delegate."
    }
  },
  note:"The guide names this tool **Task**, which is the exam answer. Claude Code v2.1.63 renamed it **Agent**, though the SDK still reports `Task` in the `system:init` tool list.",
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.3-b", domain:1, ts:"1.3", scenario:3, type:"single",
  stem:"Your synthesis subagent produces reports that reference 'the study' and 'recent research' without naming sources, even though the web-search and document-analysis subagents both captured URLs and titles. The coordinator invokes synthesis with the prompt 'Synthesise the research findings into a report.' What is the fix?",
  options:[
    {k:"A", text:"Include the prior subagents' findings directly in the synthesis prompt, with metadata kept separate."},
    {k:"B", text:"Instruct the synthesis subagent in its system prompt to always cite sources for every claim it makes."},
    {k:"C", text:"Give the synthesis subagent direct access to the web-search tool so that it can look up citations for its own claims while it is combining the findings it receives."},
    {k:"D", text:"Have the coordinator append citations to the finished report by matching claims against the source list."}
  ],
  correct:["A"],
  explain:{
    why:"The synthesis subagent has isolated context, so the only research it can see is what the prompt hands it. Told merely to 'synthesise the research findings' with no findings attached, it writes from background knowledge and hedges. Passing the actual findings, with source metadata kept structurally separate from claims, is what makes attribution possible.",
    distractors:{
      B:"You cannot cite sources you were never given. The instruction would either be ignored or push the model to fabricate plausible citations, which is worse.",
      C:"This re-researches ground already covered, wastes the earlier subagents' work, and over-provisions a synthesis agent with tools outside its specialisation.",
      D:"Post-hoc matching of claims to a source list is guesswork; the coordinator does not know which source actually supported which claim once that link was lost."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.3-c", domain:1, ts:"1.3", scenario:3, type:"single",
  stem:"You want three independent search subagents to run concurrently. Your coordinator currently emits one Task call, waits for the result, emits the next, and so on. Total latency is 3x a single search. What change achieves parallelism?",
  options:[
    {k:"A", text:"Emit all three Task tool calls within a single coordinator response."},
    {k:"B", text:"Set `disable_parallel_tool_use` to false in the coordinator's request configuration."},
    {k:"C", text:"Define the three subagents with the same `description` so the coordinator treats them as an interchangeable pool."},
    {k:"D", text:"Increase the coordinator's `max_tokens` so it has room to hold three concurrent result sets."}
  ],
  correct:["A"],
  explain:{
    why:"Concurrency comes from multiple Task calls in one assistant turn. Calls issued in separate turns are inherently sequential, because each turn must complete and return before the next begins.",
    distractors:{
      B:"That setting governs whether the model may emit multiple tool calls per turn; it does not cause a coordinator that emits one call per turn to start batching them, which is a prompting and orchestration matter.",
      C:"Identical descriptions destroy the coordinator's ability to choose between subagents, and does nothing to make invocation concurrent.",
      D:"`max_tokens` bounds the response length. It has no bearing on whether calls execute concurrently."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.3-d", domain:1, ts:"1.3", scenario:4, type:"single",
  stem:"A coordinator prompt reads: 'Step 1, call search_codebase with the module name. Step 2, call read_file on each result. Step 3, summarise.' Subagents follow it exactly but perform poorly on unfamiliar repository layouts. What principle is being violated?",
  options:[
    {k:"A", text:"Coordinator prompts should state goals and quality criteria rather than step-by-step procedure."},
    {k:"B", text:"Coordinator prompts must never name specific tools, because tool availability varies between subagent definitions and can change between runs."},
    {k:"C", text:"Procedural prompts must be placed in the subagent's system prompt rather than in the Task invocation."},
    {k:"D", text:"Each step should be issued as a separate Task call so the coordinator can validate output between steps."}
  ],
  correct:["A"],
  explain:{
    why:"Rigid procedure removes the subagent's ability to respond to what it actually encounters. A repository with an unusual layout may need a different search strategy entirely. Specifying the goal and what a good answer looks like lets the subagent adapt while still being held to a standard.",
    distractors:{
      B:"Naming tools is fine and often helpful. The problem is dictating the sequence, not mentioning the tools.",
      C:"Relocating the same rigid procedure to the system prompt makes it apply to every invocation, which is worse rather than better.",
      D:"Splitting a rigid sequence into separately-invoked steps makes it more rigid, adds round trips, and still prevents adaptation."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.3-e", domain:1, ts:"1.3", scenario:2, type:"single",
  stem:"You have analysed a legacy service and want to explore two competing refactoring strategies without repeating that analysis for each. Which session mechanism fits?",
  options:[
    {k:"A", text:"`fork_session`, to create independent branches from the shared analysis baseline."},
    {k:"B", text:"`--resume` with the same session name for both explorations, run one after the other."},
    {k:"C", text:"`/compact` after the analysis, then continue both explorations in the compacted session."},
    {k:"D", text:"Two separate fresh sessions, each re-running the analysis with an identical prompt."}
  ],
  correct:["A"],
  explain:{
    why:"Forking is designed for exactly this: divergent exploration from a common baseline. Each branch inherits the completed analysis and then evolves independently, so the two strategies can be compared without contaminating one another.",
    distractors:{
      B:"Resuming the same session sequentially means the second exploration inherits the first one's reasoning and conclusions, which biases the comparison.",
      C:"`/compact` reduces context usage within one continuing session. It creates no branches, so the two explorations still interleave.",
      D:"This duplicates the analysis cost and risks the two baselines differing, which undermines the comparison you are trying to make."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.3-f", domain:1, ts:"1.3", scenario:3, type:"single",
  stem:"Which element of an `AgentDefinition` most directly determines whether a coordinator picks the right subagent for a given subtask?",
  options:[
    {k:"A", text:"The `description`, which states when the subagent should be used."},
    {k:"B", text:"The system prompt, which defines how the subagent behaves once invoked."},
    {k:"C", text:"The tool restrictions, which bound what the subagent can do."},
    {k:"D", text:"The model selection, which determines the subagent's reasoning capability."}
  ],
  correct:["A"],
  explain:{
    why:"Selection happens before invocation, and the description is what the coordinator reads to make that choice. This mirrors the tool-description principle: the text that says when to use something is what drives selection between similar options.",
    distractors:{
      B:"The system prompt shapes behaviour after the subagent has already been chosen, so it cannot influence the choice itself.",
      C:"Tool restrictions constrain what happens post-invocation and guard against misuse, but they do not tell the coordinator which agent to pick.",
      D:"Model selection affects quality of execution, not which subagent the coordinator routes to."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.3-g", domain:1, ts:"1.3", scenario:3, type:"single",
  stem:"A subagent is invoked twice in one research run. On the second invocation it repeats work it completed on the first. What explains this, and what is the correct remedy?",
  options:[
    {k:"A", text:"Subagents share no memory between invocations, so the coordinator must pass earlier results forward."},
    {k:"B", text:"The subagent's memory was evicted under context pressure; raise its context limit so that state survives between separate invocations."},
    {k:"C", text:"The two invocations used different session IDs; reuse one ID so the subagent recognises the continuation."},
    {k:"D", text:"The subagent's `description` is ambiguous, causing the coordinator to invoke it for a task it already completed."}
  ],
  correct:["A"],
  explain:{
    why:"Each invocation starts clean. There is no persistence between them, so unless the coordinator passes forward what was already established, the second run legitimately has no idea the first happened.",
    distractors:{
      B:"This is not eviction under pressure. Nothing was ever carried between the invocations to evict.",
      C:"Subagent invocations are not continued by reusing an identifier in this way; the prompt is the channel for continuity.",
      D:"A vague description could cause a redundant invocation, but the question describes the subagent redoing work inside an invocation the coordinator intended, which is a context-passing failure."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.4-a", domain:1, ts:"1.4", scenario:1, type:"single",
  stem:"Production data shows that in 12% of cases your agent skips `get_customer` entirely and calls `lookup_order` using only the customer's stated name, occasionally leading to misidentified accounts and incorrect refunds. What change most effectively addresses this?",
  options:[
    {k:"A", text:"Add a programmatic prerequisite that blocks both tools until `get_customer` returns a verified ID."},
    {k:"B", text:"Enhance the system prompt to state that customer verification via `get_customer` is mandatory before any order operations."},
    {k:"C", text:"Add few-shot examples showing the agent always calling `get_customer` first, even when customers volunteer order details."},
    {k:"D", text:"Implement a routing classifier that analyses each request and enables only the subset of tools appropriate for that request type."}
  ],
  correct:["A"],
  explain:{
    why:"When a tool sequence is required for critical business logic, programmatic enforcement gives a deterministic guarantee that prompting cannot. A gate that refuses `process_refund` without a verified customer ID takes the 12% failure rate to zero.",
    distractors:{
      B:"A stronger prompt lowers the failure rate but never eliminates it. With money moving on the outcome, a residual few percent is the entire problem.",
      C:"Few-shot examples have the same probabilistic ceiling as the prompt fix, and add token cost to every request.",
      D:"This changes which tools are available, but the defect is the order in which they are called. Both tools are legitimately needed for this request type."
    }
  },
  refs:[{label:"Agent SDK: Hooks", url:"https://code.claude.com/docs/en/agent-sdk/hooks"}] },

{ id:"d1-1.4-b", domain:1, ts:"1.4", scenario:1, type:"single",
  stem:"Your agent escalates a billing dispute to a human with the message: 'Customer is upset about a charge and wants it resolved. Please assist.' The human agent, who cannot see the conversation, spends eight minutes re-gathering basics. What should the handoff include?",
  options:[
    {k:"A", text:"A structured summary carrying the customer ID, root cause, disputed amount and recommended action."},
    {k:"B", text:"The full verbatim conversation transcript, so the human can read everything the agent saw."},
    {k:"C", text:"A confidence score indicating how certain the agent is about the diagnosis, to guide how much the human should re-check."},
    {k:"D", text:"A link to the customer record in the CRM, so the human can look up whatever they need."}
  ],
  correct:["A"],
  explain:{
    why:"The receiving human has no transcript, so the handoff must be self-contained and actionable. Identity, diagnosed root cause, the amount and a recommendation let them verify and act immediately instead of restarting the investigation.",
    distractors:{
      B:"A raw transcript makes the human do the analysis the agent already did. It is a dump, not a handoff, and it is slower to consume than a structured summary.",
      C:"A self-reported confidence score is poorly calibrated and, on its own, tells the human nothing about what the case actually is.",
      D:"A CRM link provides identity but none of the diagnosis, so the human still has to work out what happened and what to do."
    }
  },
  refs:[{label:"Agent SDK: Hooks", url:"https://code.claude.com/docs/en/agent-sdk/hooks"}] },

{ id:"d1-1.4-c", domain:1, ts:"1.4", scenario:1, type:"single",
  stem:"Company policy caps automated refunds at $500; anything higher needs human approval. Which implementation gives a deterministic guarantee?",
  options:[
    {k:"A", text:"A hook that intercepts `process_refund`, blocks amounts over $500 and redirects to escalation."},
    {k:"B", text:"A system prompt rule stating that refunds over $500 must always be escalated to a human agent."},
    {k:"C", text:"A validation note in the `process_refund` tool description that explains the $500 limit and the policy rationale behind it."},
    {k:"D", text:"A post-processing audit that flags any refund over $500 for next-day human review."}
  ],
  correct:["A"],
  explain:{
    why:"A hard monetary threshold is precisely the case for interception. A PreToolUse-style hook evaluates the actual argument before the call executes and can deny it outright, so the policy holds every time regardless of how the model reasoned.",
    distractors:{
      B:"Prompt rules are followed most of the time, which is not the same as always. The exceptions here are unauthorised payments.",
      C:"A tool description informs the model's choice but does not constrain it. Nothing stops a call with a larger amount.",
      D:"Reviewing the next day means the money has already left. This detects violations rather than preventing them."
    }
  },
  refs:[{label:"Agent SDK: Hooks", url:"https://code.claude.com/docs/en/agent-sdk/hooks"}] },

{ id:"d1-1.4-d", domain:1, ts:"1.4", scenario:0, type:"single",
  stem:"Which statement best captures when to choose programmatic enforcement over prompt-based guidance for workflow ordering?",
  options:[
    {k:"A", text:"When deterministic compliance is required, since prompt instructions have a non-zero failure rate."},
    {k:"B", text:"When the workflow has more than three steps, because prompts cannot reliably encode longer sequences."},
    {k:"C", text:"When the model being used is smaller, since larger models follow prompt instructions reliably enough to skip enforcement."},
    {k:"D", text:"When the tools involved come from MCP servers rather than being built in, since MCP calls bypass prompt constraints."}
  ],
  correct:["A"],
  explain:{
    why:"The criterion is the consequence of failure, not the shape of the workflow. If a single violation is unacceptable, as with verifying identity before moving money, only code-level enforcement gives that guarantee.",
    distractors:{
      B:"Step count is not the deciding factor. A two-step sequence can absolutely require deterministic enforcement if the second step is a payment.",
      C:"Larger models comply more often, but more often is still not always. The residual rate remains unacceptable for critical operations.",
      D:"MCP tool calls are subject to the same hooks and gates as any other. Tool origin is irrelevant to this decision."
    }
  },
  refs:[{label:"Agent SDK: Hooks", url:"https://code.claude.com/docs/en/agent-sdk/hooks"}] },

{ id:"d1-1.4-e", domain:1, ts:"1.4", scenario:1, type:"single",
  stem:"A customer writes: 'My order arrived damaged AND I was charged twice AND I want to know if I can switch to annual billing.' What processing approach best supports first-contact resolution?",
  options:[
    {k:"A", text:"Decompose into three items, investigate each in parallel, then synthesise a single response."},
    {k:"B", text:"Process the items strictly sequentially, fully closing each one before reading the next, to avoid confusing the tool calls."},
    {k:"C", text:"Answer the billing question immediately since it needs no tool calls, and escalate the other two to a human."},
    {k:"D", text:"Ask the customer which of the three issues they would like to address first in this conversation."}
  ],
  correct:["A"],
  explain:{
    why:"All three concerns share the same customer context, so investigating them in parallel and answering once resolves the contact in a single turn. That is what the first-contact resolution metric rewards.",
    distractors:{
      B:"Strict sequencing wastes the shared context and adds latency, and in practice is where agents lose track and drop the later items.",
      C:"The damage claim and duplicate charge are both routine, well within the agent's tool capability. Escalating them wastes human capacity and fails the resolution target.",
      D:"Making the customer triage their own ticket is poor service and structurally guarantees the contact cannot resolve everything."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d1-1.4-f", domain:1, ts:"1.4", scenario:1, type:"single",
  stem:"You add a prerequisite gate blocking `process_refund` until `get_customer` succeeds. In testing, the agent now hits the block, receives a denial, and replies to the customer with a raw error string. What is missing from the design?",
  options:[
    {k:"A", text:"The block should return an actionable reason, so the agent calls `get_customer` and retries."},
    {k:"B", text:"The gate should silently drop the call, so the agent continues without noticing a problem occurred."},
    {k:"C", text:"The gate should be removed and replaced with a prompt instruction, since a hard block confuses the model and produces unhelpful customer-facing errors."},
    {k:"D", text:"The gate should terminate the conversation and escalate to a human whenever it fires."}
  ],
  correct:["A"],
  explain:{
    why:"A denial is information the agent has to act on. Saying why the call was refused, and what would unblock it, turns the gate into a corrective nudge: the agent verifies the customer, then retries successfully.",
    distractors:{
      B:"Silently dropping a call is the worst option. The agent believes the refund happened and tells the customer so.",
      C:"Removing the gate reintroduces the exact defect it was added to prevent. The problem is the denial's ergonomics, not its existence.",
      D:"Escalating on every fire wastes human capacity on cases the agent could resolve itself in one extra tool call."
    }
  },
  refs:[{label:"Agent SDK: Hooks", url:"https://code.claude.com/docs/en/agent-sdk/hooks"}] },

{ id:"d1-1.4-g", domain:1, ts:"1.4", scenario:5, type:"single",
  stem:"Your CI pipeline requires that a security scan tool always runs before Claude Code is allowed to post review comments on a pull request. Which mechanism enforces this ordering reliably?",
  options:[
    {k:"A", text:"A programmatic prerequisite gating the comment step on the scan completing successfully."},
    {k:"B", text:"A CLAUDE.md instruction stating that the security scan must always be consulted before any review comment is posted to the pull request."},
    {k:"C", text:"A few-shot example in the review prompt showing a scan result being referenced before comments are written."},
    {k:"D", text:"Ordering the instructions in the prompt so the scan is described first and commenting last."}
  ],
  correct:["A"],
  explain:{
    why:"Ordering guarantees belong to the pipeline, which controls step execution deterministically. Gating the comment step on the scan step's exit status means the ordering cannot be violated regardless of model behaviour.",
    distractors:{
      B:"CLAUDE.md is context, not enforced configuration. It shapes behaviour without guaranteeing it, which the Claude Code documentation states explicitly.",
      C:"An example demonstrates a pattern; it does not constrain execution order.",
      D:"Prompt ordering influences behaviour weakly and is trivially overridden by the model's own reasoning about what to do first."
    }
  },
  refs:[{label:"Claude Code: Memory", url:"https://code.claude.com/docs/en/memory"}] },
