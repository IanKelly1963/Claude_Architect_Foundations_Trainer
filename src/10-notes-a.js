
/* ==========================================================================
   Learn notes: one per task statement.
   Written against the exam guide's objectives and checked against current
   Anthropic documentation. Where the two have diverged, `note` carries the
   discrepancy, and the exam-canonical answer is taught first.
   ========================================================================== */

const R_SUB   = {label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"};
const R_HOOK  = {label:"Agent SDK: Hooks", url:"https://code.claude.com/docs/en/agent-sdk/hooks"};
const R_MEM   = {label:"Claude Code: Memory", url:"https://code.claude.com/docs/en/memory"};
const R_MCP   = {label:"Claude Code: MCP", url:"https://code.claude.com/docs/en/mcp"};
const R_SKILL = {label:"Claude Code: Skills", url:"https://code.claude.com/docs/en/skills"};
const R_HEAD  = {label:"Claude Code: Headless", url:"https://code.claude.com/docs/en/headless"};
const R_TOOL  = {label:"API: How tool use works", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works"};
const R_TOVR  = {label:"API: Tool use overview", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"};
const R_BATCH = {label:"API: Batch processing", url:"https://platform.claude.com/docs/en/build-with-claude/batch-processing"};
const R_STRUCT= {label:"API: Structured outputs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"};
const R_CTX   = {label:"API: Context windows", url:"https://platform.claude.com/docs/en/build-with-claude/context-windows"};
const R_PROMPT= {label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"};

const NOTES = [

{ ts:"1.1", title:"Design and implement agentic loops",
  core:"The agentic loop is driven by `stop_reason`, not by reading what the model wrote. Send a request, inspect `stop_reason`, execute any requested tools, append the results, send again. Stop when `stop_reason` is `end_turn`.",
  facts:[
    "The cycle: a request goes to Claude and you inspect `stop_reason`. If it is `tool_use`, execute the requested tool or tools, append the results to the conversation, and send the whole thing again. If it is `end_turn`, the model has finished and you present the answer.",
    "Tool results are returned as a `user` message containing `tool_result` blocks, each keyed to the `tool_use_id` from the assistant's request. That is how the model connects a result to the call that produced it.",
    "The Messages API is stateless. The complete conversation history, including every prior tool call and result, must be resent on each iteration; nothing is remembered server-side.",
    "Appending tool results to the conversation is what lets the model reason about the next action. It incorporates the new information into the same context it used to choose the first tool.",
    "Control flow is model-driven: Claude reasons about which tool to call next from accumulated context, rather than following a pre-configured decision tree or fixed tool sequence.",
    "A single assistant turn can contain several `tool_use` blocks. Execute all of them and return all the results in one following user message."
  ],
  traps:[
    "Parsing the assistant's natural-language text for phrases like 'I have finished' to decide when to break. That is a probabilistic reading of something the API states deterministically.",
    "Using an arbitrary iteration cap as the primary stopping mechanism. A cap is a sensible runaway guard, but `stop_reason` is what ends the loop.",
    "Treating the presence of text content as a completion indicator. A turn can contain both text and `tool_use` blocks at once.",
    "Hard-coding the tool order, which throws away the model's ability to adapt to what the results actually said."
  ],
  refs:[R_TOOL, R_TOVR] },

{ ts:"1.2", title:"Orchestrate coordinator-subagent systems",
  core:"Hub and spoke. The coordinator decomposes the task, chooses which subagents to run, aggregates their output and owns all error handling. Subagents never talk to each other.",
  facts:[
    "The coordinator's jobs are task decomposition, delegation, result aggregation, and deciding which subagents to invoke based on the complexity of the query.",
    "Subagents operate with isolated context. They do not automatically inherit the coordinator's conversation history.",
    "Routing every subagent message through the coordinator is what buys observability, consistent error handling and controlled information flow.",
    "A good coordinator selects subagents dynamically rather than always pushing every query through the full pipeline.",
    "Partition scope deliberately across subagents, by distinct subtopic or by source type, so two agents do not research the same ground.",
    "Iterative refinement: the coordinator evaluates the synthesis output for gaps, re-delegates targeted queries to the search and analysis subagents, and re-invokes synthesis until coverage is sufficient."
  ],
  traps:[
    "Blaming a downstream agent for incomplete output when every subagent succeeded at what it was asked to do. If each agent worked correctly but whole domains of the topic are missing, the coordinator's decomposition was too narrow. Read the decomposition log before blaming the workers.",
    "Letting subagents call each other directly to save a hop. It costs you the single point of observability and error handling.",
    "Running the full pipeline for every query regardless of what was actually asked."
  ],
  refs:[R_SUB] },

{ ts:"1.3", title:"Subagent invocation, context passing, spawning",
  core:"The prompt string is the only channel from parent to subagent. Anything the subagent needs must be written into it explicitly.",
  facts:[
    "The Task tool is the mechanism for spawning subagents. A coordinator's `allowedTools` must include `Task`, or it cannot delegate at all.",
    "Subagent context must be provided explicitly in the prompt. Subagents inherit no parent context and share no memory between invocations.",
    "`AgentDefinition` configures each subagent type: a description of when to use it, a system prompt defining its behaviour, and tool restrictions.",
    "Pass complete findings from prior agents directly in the prompt, for example putting the web search results and the document analysis output into the synthesis subagent's prompt.",
    "Use structured formats that keep content separate from metadata (source URLs, document names, page numbers) so attribution survives the handoff.",
    "To run subagents in parallel, emit multiple Task tool calls in a single coordinator response. Spreading them across separate turns runs them sequentially.",
    "Fork-based session management explores divergent approaches from a shared analysis baseline.",
    "Coordinator prompts should state research goals and quality criteria rather than step-by-step procedure, so subagents can adapt to what they find."
  ],
  traps:[
    "Assuming a subagent can see the conversation that spawned it. It cannot.",
    "Emitting Task calls in consecutive turns and expecting them to run in parallel."
  ],
  note:"The guide says `allowedTools` must include **Task**, and that is the exam answer. In current Claude Code the tool was renamed **Agent** in v2.1.63, though SDK releases still emit `Task` in the `system:init` tool list and in permission-denial records. Answer `Task` on the exam; expect to see `Agent` in today's tool_use blocks.",
  refs:[R_SUB] },

{ ts:"1.4", title:"Multi-step workflows: enforcement and handoff",
  core:"Prompt instructions are probabilistic. When an ordering must hold every single time, especially before a financial operation, enforce it in code.",
  facts:[
    "Programmatic enforcement (hooks, prerequisite gates) gives deterministic guarantees. Prompt-based guidance does not; it carries a non-zero failure rate however the prompt is worded.",
    "Implement prerequisites that block downstream tool calls until earlier steps complete, for example blocking `process_refund` until `get_customer` has returned a verified customer ID.",
    "Decompose multi-concern customer messages into distinct items, investigate each in parallel against shared context, then synthesise one unified resolution rather than answering only the first issue.",
    "A structured handoff on escalation must carry the customer ID, root cause analysis, amounts and a recommended action, because the human receiving it has no access to the conversation transcript."
  ],
  traps:[
    "Strengthening the system prompt to say verification is mandatory. It reduces the failure rate; it does not remove it. When errors move money, that gap is the whole problem.",
    "Adding few-shot examples of the correct ordering. Same probabilistic weakness as the prompt fix.",
    "Deploying a routing classifier that changes which tools are available, when the actual defect is the order the tools are called in. That solves a different problem."
  ],
  refs:[R_HOOK] },

{ ts:"1.5", title:"Agent SDK hooks for interception and normalisation",
  core:"Hooks are the deterministic control layer wrapped around a probabilistic model. PostToolUse reshapes results coming back; PreToolUse polices calls going out.",
  facts:[
    "`PostToolUse` intercepts tool results before the model processes them. The classic use is normalising heterogeneous formats from different MCP tools, such as Unix timestamps, ISO 8601 strings and numeric status codes, into one consistent shape.",
    "`PreToolUse` intercepts outgoing tool calls, so it is where you block policy-violating actions, for example refusing refunds over $500 and redirecting to a human escalation workflow.",
    "A `PreToolUse` hook returns `hookSpecificOutput` carrying a `permissionDecision`: `allow`, `deny`, `ask` or `defer`.",
    "`PostToolUse` can attach `additionalContext` to append information to the result, or set `updatedToolOutput` to replace the tool's output entirely before Claude sees it.",
    "Reach for hooks whenever a business rule needs guaranteed compliance rather than best-effort adherence."
  ],
  traps:[
    "Choosing prompt wording for a rule that contains a hard threshold. Thresholds are exactly what hooks exist for.",
    "Describing data formats in the system prompt and hoping the model normalises them, rather than transforming them in a PostToolUse hook."
  ],
  refs:[R_HOOK] },

{ ts:"1.6", title:"Task decomposition strategies",
  core:"Fixed sequential chains for predictable, multi-aspect work. Adaptive decomposition when the shape of the problem only emerges as you investigate.",
  facts:[
    "Prompt chaining breaks work into fixed sequential steps and suits predictable multi-aspect reviews.",
    "Dynamic decomposition generates subtasks from what was discovered at the previous step, and suits open-ended investigation.",
    "For a large code review, split into per-file local analysis passes plus a separate cross-file integration pass. This is the standard fix for inconsistent depth and contradictory findings across a big diff.",
    "For an open-ended task such as adding tests to a legacy codebase: map the structure first, identify high-impact areas, then build a prioritised plan that adapts as dependencies are discovered."
  ],
  traps:[
    "Reaching for a bigger context window when a single pass gives detailed feedback on some files and superficial feedback on others. That is attention dilution, and more context does not fix it.",
    "Pushing the work back onto developers by requiring smaller pull requests. It shifts burden without improving the system.",
    "Running the review three times and only reporting findings that appear twice. Consensus filtering suppresses genuine bugs that are caught intermittently."
  ],
  refs:[R_SUB] },

{ ts:"1.7", title:"Session state, resumption, and forking",
  core:"Resume when the prior context is mostly still true. Start fresh with an injected summary when the prior tool results have gone stale.",
  facts:[
    "`--resume <session-name>` continues a specific named prior conversation across working sessions.",
    "`fork_session` creates independent branches from a shared analysis baseline, so you can compare two refactoring or testing strategies without repeating the underlying exploration.",
    "When resuming after code has changed, tell the agent which specific files changed so it re-analyses those, rather than forcing a full re-exploration.",
    "Starting a new session with a structured summary is more reliable than resuming when the prior session's tool results no longer reflect the code. Stale file reads actively mislead."
  ],
  traps:[
    "Resuming a long session after a large refactor and assuming the agent knows what moved.",
    "Re-running the entire exploration when a targeted note about the three changed files would do."
  ],
  refs:[R_SUB] },

{ ts:"2.1", title:"Tool interfaces, descriptions, and boundaries",
  core:"The tool description is the primary mechanism the model uses to choose a tool. When selection is unreliable between similar tools, the description is almost always the root cause and the cheapest fix.",
  facts:[
    "Descriptions should state the input formats handled, example queries, edge cases, and an explicit boundary explaining when to use this tool versus a similar one.",
    "Ambiguous or overlapping descriptions cause misrouting. Two tools described as 'Retrieves customer information' and 'Retrieves order details' that both accept similar identifiers will be confused.",
    "Fix overlap by renaming and re-describing, for example renaming `analyze_content` to `extract_web_results` with a web-specific description.",
    "Split a generic tool into purpose-specific tools with defined input/output contracts, for example splitting `analyze_document` into `extract_data_points`, `summarize_content` and `verify_claim_against_source`.",
    "Review the system prompt for keyword-sensitive instructions that can create unintended tool associations and override otherwise well-written descriptions."
  ],
  traps:[
    "Adding five to eight few-shot examples of correct routing. It adds token overhead on every request without fixing the underlying ambiguity.",
    "Building a keyword-based routing layer that pre-selects the tool. Over-engineered, and it bypasses the model's language understanding.",
    "Consolidating two tools into one generic `lookup_entity`. A defensible architecture, but far more work than a 'first step' warrants when the real problem is thin descriptions."
  ],
  refs:[R_TOVR] },

{ ts:"2.2", title:"Structured error responses for MCP tools",
  core:"An error is information the agent has to act on. A uniform 'Operation failed' string tells it nothing, so it cannot choose between retrying, rephrasing, and explaining to the user.",
  facts:[
    "MCP communicates tool failure with the `isError` flag, so the model knows execution failed and can reason about recovery.",
    "Four categories matter and behave differently: transient (timeouts, service unavailable, rate limits), validation (bad input), business (policy violations) and permission (access denied).",
    "Return structured metadata: an `errorCategory`, an `isRetryable` boolean, and a human-readable description.",
    "Transient errors are retryable, ideally with backoff. Business-rule violations never are, so mark them `retriable: false` and include a customer-friendly explanation the agent can relay.",
    "Subagents should recover locally from transient failures and propagate to the coordinator only what they cannot resolve, along with partial results and what was attempted.",
    "Distinguish an access failure (the query could not run) from a valid empty result (the query ran and matched nothing). They demand opposite responses."
  ],
  traps:[
    "Returning the same generic failure message for every error type, which forces the agent to guess.",
    "Retrying a validation error. It will fail identically every time.",
    "Reporting 'no results' when the service was actually unreachable."
  ],
  refs:[R_MCP] },

{ ts:"2.3", title:"Tool distribution and tool_choice configuration",
  core:"Least privilege applies to tools. Give each agent the tools its role needs and little else; selection reliability degrades as the menu grows.",
  facts:[
    "Giving one agent 18 tools instead of 4 or 5 measurably degrades selection reliability by increasing decision complexity.",
    "Agents handed tools outside their specialisation tend to misuse them, such as a synthesis agent attempting its own web searches.",
    "Scope each subagent's tool set to its role, with narrow cross-role tools only for specific high-frequency needs.",
    "Replace over-broad tools with constrained ones, for example swapping `fetch_url` for a `load_document` that validates document URLs.",
    "A scoped cross-role tool is the right answer when a large majority of cases are simple: give the synthesis agent a `verify_fact` tool for straightforward lookups while complex verification still routes through the coordinator.",
    "`tool_choice` options: `auto` (model may return text instead of calling a tool), `any` (must call some tool, its choice), `{\"type\":\"tool\",\"name\":\"...\"}` (must call that specific tool), and `none`.",
    "Use forced selection to guarantee a specific tool runs first, such as `extract_metadata` before enrichment steps, then handle later steps in follow-up turns."
  ],
  traps:[
    "Giving the synthesis agent the full web search toolset to remove round trips. It over-provisions and breaks separation of concerns.",
    "Batching all verification needs to the end. Synthesis steps often depend on facts verified earlier, so batching creates blocking dependencies.",
    "Speculative caching of extra context 'in case' a downstream agent needs it. You cannot reliably predict what it will want to verify."
  ],
  refs:[R_TOVR, R_SUB] },

{ ts:"2.4", title:"Integrating MCP servers into Claude Code",
  core:"Scope decides who gets the server. Project scope in `.mcp.json` is committed and shared with the team; personal servers stay in your own configuration.",
  facts:[
    "Project scope lives in `.mcp.json` at the project root, is checked into version control, and is how a team shares MCP tooling. Claude Code asks for approval before using project-scoped servers.",
    "`.mcp.json` supports environment variable expansion, `${VAR}` and `${VAR:-default}`, so tokens are referenced rather than committed.",
    "Tools from every configured MCP server are discovered at connection time and are all available to the agent simultaneously.",
    "MCP resources expose content catalogues (issue summaries, documentation hierarchies, database schemas), giving agents visibility into available data without exploratory tool calls.",
    "Write detailed MCP tool descriptions explaining capabilities and outputs, or the agent will fall back to built-in tools like Grep even when the MCP tool is more capable.",
    "Prefer an existing community MCP server for a standard integration such as Jira; reserve custom servers for team-specific workflows."
  ],
  traps:[
    "Committing credentials into `.mcp.json` instead of referencing environment variables.",
    "Assuming a thin tool description is enough. Built-in tools compete with your MCP tools for selection."
  ],
  note:"The guide contrasts two scopes, project (`.mcp.json`) and user (`~/.claude.json`). Current Claude Code documents **three**: **local** (the default, stored per-project inside `~/.claude.json`, private to you), **project** (`.mcp.json`, shared), and **user** (`~/.claude.json`, all your projects, private). Precedence when a name is defined more than once is local, then project, then user. For the exam, the project-versus-personal distinction is the point being tested.",
  refs:[R_MCP] },

{ ts:"2.5", title:"Selecting built-in tools effectively",
  core:"Grep searches file contents. Glob matches file paths. Read and Write handle whole files, Edit makes targeted changes and needs a unique anchor.",
  facts:[
    "Use Grep to search code content across a codebase: finding callers of a function, locating an error message, tracing import statements.",
    "Use Glob to find files by name or extension pattern, such as `**/*.test.tsx`.",
    "Edit modifies a file by matching unique text. When the anchor text is not unique, Edit fails, and Read followed by Write is the reliable fallback.",
    "Build codebase understanding incrementally: Grep for entry points, then Read to follow imports and trace flows. Do not read every file upfront.",
    "To trace usage across wrapper modules, first identify all exported names, then search for each name across the codebase."
  ],
  traps:[
    "Using Glob when the target is file content rather than a filename.",
    "Reading the whole repository into context before knowing what matters. That is how a session runs out of context window."
  ],
  refs:[R_SUB] },
