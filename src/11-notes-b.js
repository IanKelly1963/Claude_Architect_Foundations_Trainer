
{ ts:"3.1", title:"CLAUDE.md hierarchy, scoping, modular organisation",
  core:"Where a CLAUDE.md lives decides who gets it. Instructions a teammate must also receive belong in the project file, committed to version control.",
  facts:[
    "The hierarchy runs from broad to specific: managed policy (organisation-wide), user (`~/.claude/CLAUDE.md`), project (`./CLAUDE.md` or `./.claude/CLAUDE.md`), and directory-level files in subdirectories.",
    "User-level instructions in `~/.claude/CLAUDE.md` apply only to that user and are not shared with teammates through version control. This is the classic cause of 'it works for me but the new hire gets different behaviour'.",
    "Files are concatenated into context, not overridden, ordered from the filesystem root down to the working directory.",
    "`@path/to/file` imports keep CLAUDE.md modular, so each package can pull in only the standards files its maintainers need. Imports resolve relative to the file containing them and nest up to four hops deep.",
    "`.claude/rules/` holds topic-specific rule files as an alternative to one monolithic CLAUDE.md, for example `testing.md`, `api-conventions.md`, `deployment.md`.",
    "Aim to keep each CLAUDE.md under about 200 lines. Longer files consume more context and reduce adherence.",
    "CLAUDE.md is context, not enforced configuration. To block an action regardless of what Claude decides, use a PreToolUse hook."
  ],
  traps:[
    "Putting team standards in the user-level file and wondering why they are not applied for anyone else.",
    "Assuming imports reduce context usage. Imported files are expanded and loaded at launch just the same.",
    "Expecting CLAUDE.md to guarantee behaviour. It shapes behaviour; hooks enforce it."
  ],
  note:"The guide says to use `/memory` to verify which memory files are loaded. In current Claude Code, `/memory` lists and opens memory file *locations*, while **`/context`** is what shows which files actually loaded into the current session. If an exam item offers only `/memory`, that is the intended answer.",
  refs:[R_MEM] },

{ ts:"3.2", title:"Custom slash commands and skills",
  core:"Project-scoped things are shared through the repository; user-scoped things stay personal. Skills load on demand, CLAUDE.md loads always.",
  facts:[
    "Project-scoped slash commands live in `.claude/commands/` and reach every developer through version control. User-scoped commands in `~/.claude/commands/` are personal and are not shared.",
    "Skills live in `.claude/skills/` with a `SKILL.md` carrying frontmatter.",
    "`context: fork` runs a skill in an isolated subagent with a fresh context window, so verbose output such as codebase analysis, or exploratory brainstorming, never pollutes the main conversation.",
    "`allowed-tools` in the frontmatter restricts tool access while the skill runs, for example limiting it to file writes to prevent destructive actions.",
    "`argument-hint` prompts the developer for required parameters when the skill is invoked without arguments.",
    "Choose skills for on-demand, task-specific workflows; choose CLAUDE.md for always-loaded universal standards.",
    "To customise a shared skill for yourself, create a personal variant in `~/.claude/skills/` under a different name so teammates are unaffected."
  ],
  traps:[
    "Putting a command in `~/.claude/commands/` and expecting the team to get it on `git pull`.",
    "Using a skill when the requirement is deterministic, automatic application. Skills are invoked, not automatically applied by file path."
  ],
  note:"`argument-hint` is a Claude Code extension. The base Agent Skills specification lists only `allowed-tools`, `compatibility`, `description`, `license`, `metadata` and `name`.",
  refs:[R_SKILL] },

{ ts:"3.3", title:"Path-specific rules for conditional loading",
  core:"Glob-scoped rules follow file type wherever the file lives. That is what makes them the right answer for conventions spread across many directories.",
  facts:[
    "Rule files in `.claude/rules/` take YAML frontmatter with a `paths` field holding glob patterns. The rule loads only when Claude works with a matching file.",
    "Path scoping reduces irrelevant context and token usage, because conventions load only when they apply.",
    "Glob rules beat directory-level CLAUDE.md files whenever a convention spans directories. Test files sitting next to the code they test, as `Button.test.tsx` beside `Button.tsx`, is the canonical case: no single directory contains them all.",
    "Rules without a `paths` field load unconditionally, at the same priority as `.claude/CLAUDE.md`.",
    "Patterns support brace expansion, for example `src/**/*.{ts,tsx}`. Quote patterns that begin with `{` or `*` in YAML.",
    "Path-scoped rules trigger when Claude reads a matching file, not on every tool use."
  ],
  traps:[
    "Consolidating everything under headings in one CLAUDE.md and relying on the model to infer which section applies. Inference is not deterministic matching.",
    "Using subdirectory CLAUDE.md files for a file type that appears in dozens of directories. CLAUDE.md files are directory-bound.",
    "Using skills for this. Skills are invoked on demand, which contradicts a requirement for automatic application by path."
  ],
  refs:[R_MEM] },

{ ts:"3.4", title:"Plan mode vs direct execution",
  core:"Plan mode earns its cost when the change is large, architectural, or has several defensible approaches. A well-scoped fix does not need it.",
  facts:[
    "Plan mode is designed for complex work: large-scale changes, multiple valid approaches, architectural decisions, and multi-file modifications.",
    "It enables safe exploration and design before any change is committed, which is what prevents expensive rework.",
    "Direct execution suits simple, well-scoped changes, such as adding one validation check to one function, or a single-file bug fix with a clear stack trace.",
    "The Explore subagent isolates verbose discovery output and returns a summary, preserving the main conversation's context during multi-phase work.",
    "The two combine well: plan the migration, then execute the planned approach directly."
  ],
  traps:[
    "Starting direct and switching to plan mode only if complexity appears. When the requirements already state the change spans dozens of files and needs service-boundary decisions, the complexity is not hypothetical.",
    "Writing comprehensive upfront instructions for a restructuring you have not explored yet. That assumes you already know the right structure.",
    "Letting implementation 'reveal' natural boundaries. Dependencies discovered late are the expensive kind."
  ],
  refs:[R_SUB] },

{ ts:"3.5", title:"Iterative refinement techniques",
  core:"When prose is being interpreted inconsistently, stop rewriting the prose. Show two or three concrete input/output pairs instead.",
  facts:[
    "Concrete input/output examples are the most effective way to communicate an expected transformation when prose descriptions produce inconsistent results. Two or three are usually enough.",
    "Test-driven iteration: write the test suite first covering expected behaviour, edge cases and performance, then iterate by sharing the failures.",
    "The interview pattern has Claude ask you questions before implementing, surfacing considerations you had not anticipated, such as cache invalidation strategy or failure modes in an unfamiliar domain.",
    "Fix interacting problems together in one detailed message, because fixing them one at a time makes each fix disturb the others. Fix independent problems sequentially.",
    "For an edge case, give the specific input and the expected output rather than describing the rule."
  ],
  traps:[
    "Rewording the same abstract description a third time and expecting a different outcome.",
    "Reporting a batch of independent issues as one wall of text, or drip-feeding interacting ones."
  ],
  refs:[R_PROMPT] },

{ ts:"3.6", title:"Claude Code in CI/CD pipelines",
  core:"`-p` makes it non-interactive. `--output-format json` with `--json-schema` makes the result machine-parseable. CLAUDE.md supplies the project context CI cannot infer.",
  facts:[
    "The `-p` (or `--print`) flag runs Claude Code non-interactively: it processes the prompt, prints the result to stdout and exits. Without it, a pipeline job waiting for interactive input hangs.",
    "`--output-format json` wraps the response in structured JSON with the assistant message, tool calls, token usage and session metadata. Adding `--json-schema` constrains output to your schema, returned in a `structured_output` field.",
    "That combination is what lets a pipeline parse findings and post them as inline PR comments.",
    "CLAUDE.md is how CI-invoked Claude Code gets testing standards, fixture conventions and review criteria. Documenting these reduces low-value test output.",
    "When re-running a review after new commits, include the prior findings and instruct Claude to report only new or still-unaddressed issues, so it does not repost duplicates.",
    "Provide the existing test files in context so generated tests do not duplicate scenarios already covered.",
    "The session that generated code is a poor reviewer of that same code; it retains its own reasoning and is less likely to question its decisions. Use an independent instance."
  ],
  traps:[
    "Reaching for invented flags. `CLAUDE_HEADLESS=true` and `--batch` do not exist.",
    "Redirecting stdin from /dev/null as a workaround. It does not address the command's actual mode."
  ],
  refs:[R_HEAD] },

{ ts:"4.1", title:"Explicit criteria to reduce false positives",
  core:"Vague calibration instructions like 'be conservative' do not improve precision. Categorical criteria that name what to report and what to skip do.",
  facts:[
    "Specific criteria beat vague instruction. 'Flag a comment only when the claimed behaviour contradicts the actual code behaviour' works; 'check that comments are accurate' does not.",
    "General instructions such as 'be conservative' or 'only report high-confidence findings' fail to improve precision, because the model's confidence is not well calibrated to correctness.",
    "Define which categories to report (bugs, security) and which to skip (minor style, local conventions), rather than filtering on confidence.",
    "Define explicit severity criteria with a concrete code example at each level to get consistent classification.",
    "False positives are contagious to trust: one noisy category undermines developer confidence in the accurate ones. Temporarily disabling a high-false-positive category while you improve its prompt is a legitimate move to restore trust."
  ],
  traps:[
    "Asking for a confidence score and thresholding on it. The model is often confidently wrong.",
    "Assuming a more capable model fixes precision when the criteria themselves are ambiguous."
  ],
  refs:[R_PROMPT] },

{ ts:"4.2", title:"Few-shot prompting for consistency",
  core:"When detailed instructions still produce inconsistent output, examples are the highest-leverage fix. They also teach judgement on ambiguous cases in a way rules cannot.",
  facts:[
    "Few-shot examples are the most effective technique for consistently formatted, actionable output when instructions alone are not landing.",
    "Two to four targeted examples for ambiguous scenarios work best, and should show the reasoning for why one action was chosen over a plausible alternative.",
    "Examples let the model generalise judgement to novel patterns, rather than matching only the cases you enumerated.",
    "They demonstrate the desired output shape concretely: location, issue, severity, suggested fix.",
    "In extraction they reduce hallucination and handle structural variety: inline citations versus bibliographies, methodology sections versus details embedded in prose, narrative descriptions versus structured tables.",
    "Examples that contrast an acceptable pattern with a genuine issue reduce false positives while preserving generalisation."
  ],
  traps:[
    "Adding examples when the real defect is a thin tool description. Examples cost tokens on every call and leave the root cause in place.",
    "Providing only positive examples when the difficulty is telling acceptable from unacceptable."
  ],
  refs:[R_PROMPT] },

{ ts:"4.3", title:"Structured output via tool use and JSON schemas",
  core:"Tool use with a JSON schema is the reliable way to guarantee schema-compliant output. It removes syntax errors entirely; it does not remove semantic errors.",
  facts:[
    "Define the extraction contract as a tool whose `input_schema` is your JSON schema, then read the structured data out of the `tool_use` response.",
    "`tool_choice: \"auto\"` lets the model answer with text instead of calling the tool. `any` forces some tool call but lets the model pick which. `{\"type\":\"tool\",\"name\":\"...\"}` forces one named tool.",
    "Use `any` to guarantee structured output when several extraction schemas exist and the document type is not known in advance.",
    "Use forced selection to make a specific extraction run first, such as `extract_metadata` before enrichment steps.",
    "Strict schemas eliminate JSON syntax errors but not semantic ones: line items that do not sum to the stated total, or a value placed in the wrong field, still validate.",
    "Make fields optional or nullable when the source may genuinely not contain them. A required field pressures the model to fabricate a value to satisfy the schema.",
    "Design enums for the real world: add `unclear` for ambiguous cases, and an `other` value paired with a detail string for extensible categories.",
    "Put format normalisation rules in the prompt alongside the schema to handle inconsistent source formatting."
  ],
  traps:[
    "Marking everything required and then wondering why absent information comes back invented.",
    "Believing schema validation catches arithmetic or placement mistakes."
  ],
  note:"Tool use with a JSON schema is the exam's answer and remains valid. Current Anthropic docs also offer native **Structured Outputs** through the `output_format` parameter, which constrains generation to a schema directly. If an exam item offers only the tool-use route, that is the intended answer.",
  refs:[R_TOVR, R_STRUCT] },

{ ts:"4.4", title:"Validation, retry, and feedback loops",
  core:"Retry works when the model got the shape wrong. It cannot work when the information was never in the document.",
  facts:[
    "Retry with error feedback: send a follow-up containing the original document, the failed extraction and the specific validation errors, so the model can self-correct.",
    "Retries succeed on format mismatches and structural output errors. They fail on missing information, for example a value that exists only in an external document you did not provide. Re-asking cannot conjure it.",
    "Semantic validation errors (values that do not sum, fields transposed) are distinct from schema syntax errors, which tool use has already eliminated.",
    "Build self-correction into the schema: extract `calculated_total` alongside `stated_total` so a discrepancy is visible, and add a `conflict_detected` boolean for inconsistent source data.",
    "Add a `detected_pattern` field to structured findings so you can analyse which code constructs trigger dismissals and fix false-positive patterns systematically."
  ],
  traps:[
    "Retrying indefinitely on a document that simply lacks the field.",
    "Treating a validation failure as a model failure without checking which category it is."
  ],
  refs:[R_STRUCT] },

{ ts:"4.5", title:"Efficient batch processing strategies",
  core:"Batch trades latency for cost. Anything a human is actively waiting on cannot use it.",
  facts:[
    "The Message Batches API gives 50% cost savings, with a processing window of up to 24 hours and no guaranteed latency SLA.",
    "It suits non-blocking, latency-tolerant work: overnight reports, weekly audits, nightly test generation. It is unsuitable for blocking workflows such as a pre-merge check a developer is waiting on.",
    "The batch API does not support multi-turn tool calling within a single request; you cannot execute tools mid-request and feed results back.",
    "`custom_id` correlates each request with its response, and must be unique within a batch.",
    "Size submission frequency from the SLA. To guarantee a 30-hour turnaround against a 24-hour worst case, submit every 4 hours rather than once daily.",
    "On failure, resubmit only the failed documents by `custom_id`, with modifications such as chunking anything that exceeded the context limit.",
    "Refine the prompt on a small sample before batching large volumes, to maximise first-pass success and avoid paying for resubmission cycles."
  ],
  traps:[
    "Justifying batch for a blocking check on the grounds that it is 'usually faster than the SLA'. Usually is not a guarantee.",
    "Believing batch results cannot be correlated. That is what `custom_id` is for.",
    "Adding a real-time fallback when batches run long, which is more complexity than simply matching each API to its workload."
  ],
  refs:[R_BATCH] },

{ ts:"4.6", title:"Multi-instance and multi-pass review architectures",
  core:"A model reviewing its own output in the same session carries the reasoning that produced it, and is unlikely to question its own decisions. Use a fresh instance.",
  facts:[
    "Self-review is weak because the generating session retains its own justifications. Asking it to check its work, or enabling extended thinking, does not remove that bias.",
    "An independent review instance, with no prior reasoning context, catches subtle issues more effectively.",
    "Split a large multi-file review into per-file passes for local issues, plus a separate integration pass for cross-file data flow. This avoids attention dilution and the contradictory findings it produces.",
    "A verification pass where the model reports confidence alongside each finding supports calibrated routing of review attention."
  ],
  traps:[
    "Adding 'now carefully review your own work' to the same session and considering it independent review.",
    "Believing a larger context window fixes uneven attention across many files."
  ],
  refs:[R_PROMPT] },
