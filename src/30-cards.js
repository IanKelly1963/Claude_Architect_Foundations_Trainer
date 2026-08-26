
/* ==========================================================================
   Flashcards: rapid recall for the factual layer the scenario questions
   assume. Self-graded, so these are tracked but deliberately excluded from
   the mastery model.
   ========================================================================== */

const CARDS = [

/* --- Domain 1 --- */
{ ts:"1.1", front:"What ends an agentic loop?", back:"`stop_reason` becomes `end_turn`. While it is `tool_use`, execute the requested tools and iterate." },
{ ts:"1.1", front:"How are tool results returned to the model?", back:"As `tool_result` blocks inside a **user** message, each keyed to the `tool_use_id` of the call it answers." },
{ ts:"1.1", front:"Is the Messages API stateful?", back:"No. The complete conversation history, including all prior tool calls and results, must be resent on every request." },
{ ts:"1.1", front:"Three agentic-loop anti-patterns", back:"Parsing assistant text for completion phrases; using an iteration cap as the primary stopping rule; treating the presence of text content as a completion signal." },
{ ts:"1.1", front:"Multiple `tool_use` blocks in one turn: what do you do?", back:"Execute all of them, return all results together in a single following user message." },
{ ts:"1.1", front:"Model-driven vs pre-configured control flow", back:"Claude reasons over accumulated context to pick the next tool. A fixed sequence discards that adaptability." },

{ ts:"1.2", front:"Hub-and-spoke: what does the coordinator own?", back:"Task decomposition, delegation, result aggregation, error handling, and deciding which subagents to invoke." },
{ ts:"1.2", front:"Do subagents inherit the coordinator's conversation history?", back:"No. They operate with isolated context. Everything they need goes in the prompt." },
{ ts:"1.2", front:"Why route all subagent communication through the coordinator?", back:"Observability, consistent error handling, and controlled information flow." },
{ ts:"1.2", front:"Report covers only part of a broad topic, but every subagent succeeded. Root cause?", back:"The coordinator's task decomposition was too narrow. Read the decomposition log before blaming downstream agents." },
{ ts:"1.2", front:"How do you stop two search subagents duplicating work?", back:"Partition scope explicitly, by distinct subtopic or distinct source type." },
{ ts:"1.2", front:"What is an iterative refinement loop?", back:"The coordinator evaluates synthesis output for gaps, re-delegates targeted queries, and re-invokes synthesis until coverage is sufficient." },

{ ts:"1.3", front:"Which tool spawns subagents, and what must `allowedTools` contain?", back:"The **Task** tool; `allowedTools` must include `Task` or the coordinator cannot delegate. (Renamed **Agent** in Claude Code v2.1.63; answer `Task` on the exam.)" },
{ ts:"1.3", front:"What is the only channel from parent to subagent?", back:"The prompt string in the Task call. Nothing else is inherited or shared." },
{ ts:"1.3", front:"How do you run subagents in parallel?", back:"Emit multiple Task tool calls in a **single** coordinator response. Across separate turns they run sequentially." },
{ ts:"1.3", front:"What does an `AgentDefinition` configure?", back:"Description (when to use it), system prompt (how it behaves), tool restrictions, and model." },
{ ts:"1.3", front:"Which AgentDefinition field drives subagent selection?", back:"The `description`. Selection happens before invocation, so the description is what the coordinator reads." },
{ ts:"1.3", front:"Coordinator prompt style: procedure or goals?", back:"Goals and quality criteria, not step-by-step procedure, so subagents can adapt to what they find." },

{ ts:"1.4", front:"When do you need programmatic enforcement over prompt guidance?", back:"When deterministic compliance is required. Prompts carry a non-zero failure rate however they are worded." },
{ ts:"1.4", front:"Canonical prerequisite-gate example", back:"Block `process_refund` until `get_customer` has returned a verified customer ID." },
{ ts:"1.4", front:"What belongs in a structured escalation handoff?", back:"Customer ID, root cause analysis, amount in dispute, recommended action. The human has no transcript." },
{ ts:"1.4", front:"How should a multi-concern customer message be handled?", back:"Decompose into distinct items, investigate each in parallel against shared context, synthesise one unified response." },

{ ts:"1.5", front:"`PreToolUse` vs `PostToolUse`", back:"`PreToolUse` intercepts outgoing calls (block/allow). `PostToolUse` intercepts results coming back (normalise/trim)." },
{ ts:"1.5", front:"Four `permissionDecision` values from a PreToolUse hook", back:"`allow`, `deny`, `ask`, `defer`. Returned inside `hookSpecificOutput`." },
{ ts:"1.5", front:"How do you replace a tool's output before Claude sees it?", back:"Set `updatedToolOutput` in a PostToolUse hook. `additionalContext` appends instead of replacing." },
{ ts:"1.5", front:"Canonical PostToolUse normalisation case", back:"Different MCP tools returning Unix timestamps, ISO 8601 and numeric status codes; normalise to one shape before the model reads them." },
{ ts:"1.5", front:"Why is CLAUDE.md not enough for an absolute rule?", back:"It is context, not enforced configuration. Use a PreToolUse hook or a permissions deny rule to block an action regardless of what Claude decides." },

{ ts:"1.6", front:"Prompt chaining vs dynamic decomposition", back:"Prompt chaining for predictable multi-aspect work with known steps. Dynamic decomposition for open-ended investigation where each step determines the next." },
{ ts:"1.6", front:"Fix for inconsistent depth and contradictory findings on a 14-file review", back:"Per-file passes for local issues plus a separate cross-file integration pass. It is attention dilution, not a context-size problem." },
{ ts:"1.6", front:"Why is consensus filtering (2-of-3 passes) a bad idea?", back:"It suppresses genuine bugs that are only caught intermittently, which are often the subtle ones." },
{ ts:"1.6", front:"How to decompose 'add comprehensive tests to a legacy codebase'?", back:"Map structure, identify high-impact areas, build a prioritised plan that adapts as dependencies are discovered." },

{ ts:"1.7", front:"Flag to continue a specific named prior conversation", back:"`--resume <session-name>`" },
{ ts:"1.7", front:"What is `fork_session` for?", back:"Independent branches from a shared analysis baseline, for exploring divergent approaches without repeating the analysis." },
{ ts:"1.7", front:"Resume or start fresh?", back:"Resume when prior context is mostly still valid. Start fresh with an injected summary when prior tool results are stale." },
{ ts:"1.7", front:"Why are stale tool results worse than no context?", back:"The agent has no signal that they are out of date, so it answers confidently from code that no longer exists." },
{ ts:"1.7", front:"Resuming after a colleague changed three files: what do you do?", back:"Tell the agent explicitly which files changed, so it re-analyses those rather than re-exploring everything." },

/* --- Domain 2 --- */
{ ts:"2.1", front:"What is the primary mechanism LLMs use for tool selection?", back:"The tool description. Minimal descriptions are the usual root cause of unreliable selection between similar tools." },
{ ts:"2.1", front:"What belongs in a good tool description?", back:"Input formats handled, example queries, edge cases, and an explicit boundary versus similar tools." },
{ ts:"2.1", front:"Two tools misroute despite good descriptions. What else do you check?", back:"The system prompt, for keyword-sensitive instructions creating unintended tool associations." },
{ ts:"2.1", front:"Fix for a generic `analyze_document` used three ways", back:"Split into purpose-specific tools (`extract_data_points`, `summarize_content`, `verify_claim_against_source`) with defined contracts." },
{ ts:"2.1", front:"Agent prefers built-in Grep over a better MCP tool. Why?", back:"The MCP tool's description does not explain its capabilities and outputs in enough detail to compete." },

{ ts:"2.2", front:"Which MCP flag signals a tool failure?", back:"`isError` on the tool result." },
{ ts:"2.2", front:"Four MCP error categories", back:"Transient (timeout, rate limit), validation (bad input), business (policy violation), permission (access denied)." },
{ ts:"2.2", front:"Which error categories are retryable?", back:"Transient ones. Validation, business and permission errors fail identically on retry." },
{ ts:"2.2", front:"What should a structured error carry?", back:"`errorCategory`, an `isRetryable` boolean, and a human-readable description. For business rules, a customer-friendly explanation." },
{ ts:"2.2", front:"Access failure vs valid empty result", back:"Access failure = could not run the query (may warrant retry). Empty result = query ran, matched nothing. Conflating them breaks recovery." },
{ ts:"2.2", front:"Subagent hits a transient error and recovers on retry. What does it report?", back:"Just the successful results. Recover locally; propagate only what you cannot resolve." },

{ ts:"2.3", front:"Why is 18 tools worse than 4-5?", back:"Selection reliability degrades as decision complexity rises. Scope each agent to the tools its role needs." },
{ ts:"2.3", front:"Four `tool_choice` values", back:"`auto` (may return text), `any` (must call some tool), `{\"type\":\"tool\",\"name\":\"...\"}` (must call that one), `none` (no tools)." },
{ ts:"2.3", front:"Which `tool_choice` guarantees structured output when the document type is unknown?", back:"`any`. It forces a tool call but lets the model pick the right schema." },
{ ts:"2.3", front:"How do you guarantee `extract_metadata` runs first?", back:"Forced selection: `tool_choice: {\"type\":\"tool\",\"name\":\"extract_metadata\"}`, then handle later steps in follow-up turns." },
{ ts:"2.3", front:"85% of a subagent's verifications are simple lookups. What do you do?", back:"Give it a scoped `verify_fact` tool for the common case; route the complex 15% through the coordinator." },
{ ts:"2.3", front:"Subagent using `fetch_url` too broadly. Fix?", back:"Replace it with a constrained tool such as `load_document` that validates the URL is a document source." },

{ ts:"2.4", front:"Which MCP scope is shared with the team via version control?", back:"Project scope, in `.mcp.json` at the repository root." },
{ ts:"2.4", front:"Environment variable expansion syntax in `.mcp.json`", back:"`${VAR}` and `${VAR:-default}`. Works in `command`, `args`, `env`, `url` and `headers`." },
{ ts:"2.4", front:"Unset variable with no default in `.mcp.json`: what happens?", back:"The config still loads with a missing-variable warning, and the literal `${VAR}` text is used unexpanded." },
{ ts:"2.4", front:"When are MCP tools discovered?", back:"At connection time. Tools from all configured servers are available to the agent simultaneously." },
{ ts:"2.4", front:"What are MCP resources for?", back:"Exposing content catalogues (issue summaries, doc hierarchies, DB schemas) so agents see available data without exploratory tool calls." },
{ ts:"2.4", front:"Community MCP server or custom build?", back:"Use the community server for standard integrations like Jira. Reserve custom servers for team-specific workflows." },
{ ts:"2.4", front:"The three MCP scopes in current docs", back:"**local** (default, per-project in `~/.claude.json`, private), **project** (`.mcp.json`, shared), **user** (`~/.claude.json`, all projects, private). Precedence: local, project, user." },

{ ts:"2.5", front:"Grep vs Glob", back:"Grep searches file **contents**. Glob matches file **paths**." },
{ ts:"2.5", front:"Edit fails on a non-unique anchor. Fallback?", back:"Read the full file, then Write it back with the modification applied." },
{ ts:"2.5", front:"How do you build codebase understanding incrementally?", back:"Grep for entry points, then Read selectively to follow imports and trace flows. Never read everything upfront." },
{ ts:"2.5", front:"Tracing a utility re-exported through wrapper modules", back:"First identify all the names it is exported under, then search for each name across the codebase." },
{ ts:"2.5", front:"Find all React test files scattered beside their components", back:"Glob with `**/*.test.tsx`. Filename pattern, any depth." },

/* --- Domain 3 --- */
{ ts:"3.1", front:"CLAUDE.md scopes, broad to specific", back:"Managed policy, user (`~/.claude/CLAUDE.md`), project (`./CLAUDE.md` or `./.claude/CLAUDE.md`), then directory-level files." },
{ ts:"3.1", front:"Teammate does not get your instructions. Likely cause?", back:"They are in user-level `~/.claude/CLAUDE.md`, which is never shared via version control. Move them to project level." },
{ ts:"3.1", front:"How are multiple CLAUDE.md files combined?", back:"Concatenated into context, not overridden, ordered from filesystem root down to the working directory." },
{ ts:"3.1", front:"Import syntax, and does it save context?", back:"`@path/to/file`. It aids organisation but **not** context cost, since imports are expanded and loaded at launch. Max depth four hops." },
{ ts:"3.1", front:"Recommended CLAUDE.md size", back:"Under about 200 lines. Longer files consume more context and reduce adherence." },
{ ts:"3.1", front:"Command to verify loaded memory files", back:"`/memory` on the exam. In current Claude Code, `/memory` lists locations and `/context` shows what actually loaded." },

{ ts:"3.2", front:"Where do project-scoped slash commands live?", back:"`.claude/commands/` in the repository, version controlled and available to everyone on clone or pull." },
{ ts:"3.2", front:"What does `context: fork` do?", back:"Runs the skill in an isolated subagent with a fresh context window, so verbose output does not pollute the main conversation." },
{ ts:"3.2", front:"Which frontmatter field restricts tool access during a skill?", back:"`allowed-tools`." },
{ ts:"3.2", front:"What does `argument-hint` do?", back:"Shows a hint in the slash-command autocomplete. Display-only; it is a Claude Code extension, not part of the base Agent Skills spec." },
{ ts:"3.2", front:"Skill or CLAUDE.md?", back:"Skill for on-demand, task-specific workflows. CLAUDE.md for always-loaded universal standards." },
{ ts:"3.2", front:"Customising a shared skill for yourself only", back:"Create a personal variant in `~/.claude/skills/` under a different name." },

{ ts:"3.3", front:"How are rules scoped to file paths?", back:"YAML frontmatter `paths:` with a list of glob patterns, in a `.claude/rules/` file." },
{ ts:"3.3", front:"A rule file with no `paths` field: when does it load?", back:"Unconditionally at launch, at the same priority as `.claude/CLAUDE.md`." },
{ ts:"3.3", front:"Why glob rules beat subdirectory CLAUDE.md for test conventions", back:"Test files spread across many directories. CLAUDE.md files are directory-bound; `**/*.test.tsx` follows the file type anywhere." },
{ ts:"3.3", front:"Match both `.ts` and `.tsx` under `src/` in one pattern", back:"`\"src/**/*.{ts,tsx}\"` using brace expansion. Quote patterns starting with `{` or `*` in YAML." },

{ ts:"3.4", front:"When does plan mode earn its cost?", back:"Large-scale changes, multiple valid approaches, architectural decisions, multi-file modifications." },
{ ts:"3.4", front:"When is direct execution right?", back:"Simple, well-scoped changes: a single-file bug fix with a clear stack trace, adding one validation conditional." },
{ ts:"3.4", front:"What is the Explore subagent for?", back:"Isolating verbose discovery output and returning a summary, preserving main-conversation context during multi-phase tasks." },
{ ts:"3.4", front:"Migrating a library across 45 files with two viable approaches", back:"Plan mode to investigate and choose; direct execution to implement the chosen approach." },

{ ts:"3.5", front:"Prose keeps being interpreted inconsistently. What works?", back:"Two to three concrete input/output examples showing exactly what the transformation should produce." },
{ ts:"3.5", front:"What is the interview pattern?", back:"Have Claude ask you questions to surface considerations you had not anticipated, before implementing in an unfamiliar domain." },
{ ts:"3.5", front:"Interacting bugs vs independent bugs", back:"Interacting: fix all in one detailed message. Independent: iterate sequentially, verifying each." },
{ ts:"3.5", front:"Test-driven iteration order", back:"Write the test suite first (behaviour, edge cases, performance), then iterate by sharing the failures." },

{ ts:"3.6", front:"Flag for non-interactive Claude Code in CI", back:"`-p` (or `--print`). Processes the prompt, prints to stdout, exits." },
{ ts:"3.6", front:"Flags for machine-parseable structured CI output", back:"`--output-format json` with `--json-schema`. The result appears in a `structured_output` field." },
{ ts:"3.6", front:"Two CI flags that do NOT exist", back:"`CLAUDE_HEADLESS=true` and `--batch`. Both are common distractors." },
{ ts:"3.6", front:"Reviewer reposts the same findings each push. Fix?", back:"Include prior findings in context and instruct it to report only new or still-unaddressed issues." },
{ ts:"3.6", front:"Test generator produces low-value tests. Fix?", back:"Document testing standards, what makes a test valuable, and available fixtures in CLAUDE.md." },
{ ts:"3.6", front:"Why not let the generating session review its own code?", back:"It retains the reasoning that produced the code, so it re-accepts its own justifications. Use an independent instance." },

/* --- Domain 4 --- */
{ ts:"4.1", front:"Why does 'be conservative' fail to reduce false positives?", back:"It is not anchored to anything. Specific categorical criteria naming what to report and what to skip do work." },
{ ts:"4.1", front:"Example of an explicit review criterion", back:"'Flag a comment only when its claimed behaviour contradicts the actual code behaviour' beats 'check that comments are accurate'." },
{ ts:"4.1", front:"How do you get consistent severity classification?", back:"Define explicit severity criteria with a concrete code example at each level." },
{ ts:"4.1", front:"Why does one noisy finding category matter?", back:"False positives are contagious to trust: developers start ignoring the accurate categories too." },

{ ts:"4.2", front:"How many few-shot examples, and showing what?", back:"Two to four, showing the reasoning for why one action was chosen over a plausible alternative." },
{ ts:"4.2", front:"When are few-shot examples the right tool?", back:"When detailed instructions still produce inconsistent output, and for teaching judgement on ambiguous cases." },
{ ts:"4.2", front:"How do you reduce false positives without losing generalisation?", back:"Contrastive examples: acceptable patterns beside genuine issues, so the model learns the boundary rather than a list." },
{ ts:"4.2", front:"Extraction returns nulls on varied document structures. Fix?", back:"Few-shot examples spanning the structural variety (inline citations vs bibliographies, prose vs tables)." },

{ ts:"4.3", front:"Most reliable route to schema-compliant structured output", back:"Tool use with a JSON schema as the tool's `input_schema`; read the data from the `tool_use` response." },
{ ts:"4.3", front:"What do strict schemas NOT prevent?", back:"Semantic errors. Line items that do not sum to the total, or values in the wrong field, still validate." },
{ ts:"4.3", front:"Model invents values for missing information. Fix?", back:"Make the field optional or nullable. A required field pressures the model to fabricate something." },
{ ts:"4.3", front:"Pattern for an extensible category enum", back:"An `other` value paired with a free-text detail field. Add `unclear` for genuinely ambiguous cases." },
{ ts:"4.3", front:"Where do format normalisation rules live?", back:"In the prompt, alongside the strict output schema. The schema constrains shape; the prompt resolves ambiguous input." },

{ ts:"4.4", front:"How do you structure a retry after validation failure?", back:"Follow-up containing the original document, the failed extraction, and the specific validation errors." },
{ ts:"4.4", front:"When will retry NOT work?", back:"When the information is absent from the source. Retries fix format and structural errors, not missing data." },
{ ts:"4.4", front:"How do you make arithmetic inconsistencies visible in extraction?", back:"Extract `calculated_total` alongside `stated_total`; add a `conflict_detected` boolean for inconsistent source data." },
{ ts:"4.4", front:"What is a `detected_pattern` field for?", back:"Recording which code construct triggered a finding, so dismissal patterns can be analysed systematically." },

{ ts:"4.5", front:"Message Batches API: cost, window, SLA", back:"50% cost saving, up to a 24-hour processing window, no guaranteed latency SLA." },
{ ts:"4.5", front:"What is `custom_id` for?", back:"Correlating each request with its response, and identifying which items failed. Must be unique within the batch." },
{ ts:"4.5", front:"Key batch API limitation on tools", back:"No multi-turn tool calling within a single request; you cannot execute tools mid-request and feed results back." },
{ ts:"4.5", front:"Cadence to guarantee a 30-hour SLA with a 24-hour batch window", back:"Submit every 4 hours: 4 hours max queue wait plus 24 hours processing gives a 28-hour worst case." },
{ ts:"4.5", front:"Before batching 50,000 documents, what do you do?", back:"Refine the prompt on a small sample, to maximise first-pass success and avoid paying for the corpus twice." },
{ ts:"4.5", front:"Batch or real-time for a blocking pre-merge check?", back:"Real-time. Batch has no latency guarantee, so it is unusable when a developer is waiting." },

{ ts:"4.6", front:"Why is self-review weak?", back:"The session retains the reasoning that produced the code, so it is unlikely to question its own decisions." },
{ ts:"4.6", front:"What beats self-review instructions and extended thinking?", back:"An independent review instance with no prior reasoning context." },
{ ts:"4.6", front:"Complete multi-pass review architecture", back:"Per-file passes for local issues, plus a separate integration pass for cross-file data flow and interface consistency." },
{ ts:"4.6", front:"Confidence scores in review: filter or route?", back:"Route. Send low-confidence findings to a more experienced reviewer rather than discarding them." },

/* --- Domain 5 --- */
{ ts:"5.1", front:"What does progressive summarisation lose?", back:"Numerical values, percentages, dates and customer-stated expectations, exactly the facts a resolution depends on." },
{ ts:"5.1", front:"Fix for facts lost to summarisation", back:"A persistent 'case facts' block with amounts, dates, order numbers and statuses, included in each prompt outside the summarised history." },
{ ts:"5.1", front:"What is the 'lost in the middle' effect, and the mitigation?", back:"Beginnings and ends are processed reliably; middles get omitted. Put a key-findings summary first and use explicit section headers." },
{ ts:"5.1", front:"Tool result returns 40+ fields, 5 are relevant. What do you do?", back:"Trim verbose tool output to relevant fields before it enters context, for example in a PostToolUse hook." },
{ ts:"5.1", front:"Downstream agent has a limited context budget. What changes upstream?", back:"Upstream agents return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning chains." },

{ ts:"5.2", front:"Three legitimate escalation triggers", back:"The customer explicitly asks for a human; policy is silent or ambiguous; the agent cannot make meaningful progress." },
{ ts:"5.2", front:"Two unreliable escalation signals", back:"Sentiment analysis and model self-reported confidence. Neither correlates with case complexity." },
{ ts:"5.2", front:"Customer demands a human on their first message. What do you do?", back:"Escalate immediately. Honour the explicit request without first attempting investigation." },
{ ts:"5.2", front:"Policy covers own-site price adjustments; customer wants competitor matching. What is this?", back:"A policy gap, which is a legitimate escalation trigger. Do not reason by analogy from adjacent policy." },
{ ts:"5.2", front:"Customer lookup returns three matches. What do you do?", back:"Ask for an additional identifier. Never select by heuristic such as most recent activity." },
{ ts:"5.2", front:"Frustrated customer, simple resolvable issue, no request for a human", back:"Acknowledge the frustration and offer the resolution. Escalate only if they then ask for a human." },

{ ts:"5.3", front:"What should a propagated error carry?", back:"Failure type, the query attempted, any partial results, and potential alternative approaches." },
{ ts:"5.3", front:"Two error-propagation anti-patterns", back:"Silently returning empty results as success, and terminating the entire workflow on one subagent failure." },
{ ts:"5.3", front:"Why is a generic 'search unavailable' status bad?", back:"It hides the context the coordinator needs to choose between retrying, trying an alternative, or proceeding with partial results." },
{ ts:"5.3", front:"How should synthesis report an unresearched topic area?", back:"With coverage annotations distinguishing well-supported findings from gaps caused by unavailable sources." },

{ ts:"5.4", front:"What does context degradation look like in a long session?", back:"Inconsistent answers, and references to 'typical patterns' rather than the specific classes discovered earlier." },
{ ts:"5.4", front:"Countermeasure for context degradation", back:"A scratchpad file recording key findings, consulted for subsequent questions. It survives compaction and session ends." },
{ ts:"5.4", front:"Command to reduce context usage mid-session", back:"`/compact`." },
{ ts:"5.4", front:"Crash recovery design for multi-agent work", back:"Each agent exports structured state to a known location; the coordinator loads a manifest on resume and injects it into agent prompts." },
{ ts:"5.4", front:"Moving between exploration phases with subagents", back:"Summarise the phase's key findings first, then inject that summary into each subagent's initial context." },

{ ts:"5.5", front:"What can a 97% aggregate accuracy hide?", back:"Poor performance on a specific document type or field. Segment by both before reducing human review." },
{ ts:"5.5", front:"How do you measure error rates after automating high-confidence extractions?", back:"Stratified random sampling of the high-confidence population, to measure the true rate and detect novel error patterns." },
{ ts:"5.5", front:"How do you make confidence scores trustworthy?", back:"Calibrate review thresholds against a labelled validation set. Raw self-reported scores are not inherently calibrated." },
{ ts:"5.5", front:"Where should limited reviewer capacity go?", back:"Low model confidence, and documents that are ambiguous or self-contradictory." },

{ ts:"5.6", front:"Two credible sources give different figures. What do you do?", back:"Present both with source attribution and annotate the conflict. Never average or silently pick one." },
{ ts:"5.6", front:"Where is source attribution lost, and how do you prevent it?", back:"At summarisation steps. Require structured claim-source mappings that downstream agents must preserve and merge." },
{ ts:"5.6", front:"Why require publication or collection dates in subagent output?", back:"So a temporal difference (34% in 2023 vs 58% in 2026) is not misread as a contradiction." },
{ ts:"5.6", front:"Subagent finds two contradictory values in one document", back:"Complete the analysis with both included and explicitly annotated; let the coordinator reconcile." },
{ ts:"5.6", front:"How should mixed content be rendered in a report?", back:"By type: financial data as tables, news as prose, technical findings as structured lists. Not one uniform format." },
{ ts:"5.6", front:"How do you separate established from contested findings?", back:"Explicit sections, preserving each source's original characterisation and methodological context." }

];
