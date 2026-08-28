
/* ---------------- Domain 3: Claude Code Configuration & Workflows ---------------- */

{ id:"d3-3.1-a", domain:3, ts:"3.1", scenario:2, type:"single",
  stem:"You documented your team's commit and testing conventions months ago and Claude follows them reliably for you. A new team member reports Claude ignores all of them. You put the instructions in `~/.claude/CLAUDE.md`. What is the diagnosis?",
  options:[
    {k:"A", text:"User-level configuration is not shared via version control; use project-level CLAUDE.md."},
    {k:"B", text:"The new member's Claude Code version predates CLAUDE.md support and needs upgrading."},
    {k:"C", text:"CLAUDE.md files must be regenerated with `/init` on each machine before they take effect."},
    {k:"D", text:"The new member is working in a subdirectory, and CLAUDE.md instructions only apply at the repository root and are not inherited downwards."}
  ],
  correct:["A"],
  explain:{
    why:"`~/.claude/CLAUDE.md` is personal configuration on your machine. It is never committed, so a teammate cloning the repository receives none of it. Team standards must live in the project file so version control distributes them.",
    distractors:{
      B:"A version mismatch would affect your own machine equally; the asymmetry points at scope, not tooling.",
      C:"`/init` generates a starting file. It is not a per-machine activation step for existing files.",
      D:"Claude Code loads CLAUDE.md from the working directory and every directory above it, so a subdirectory still picks up the root file."
    }
  },
  refs:[{label:"Claude Code: Memory", url:"https://code.claude.com/docs/en/memory"}] },

{ id:"d3-3.1-b", domain:3, ts:"3.1", scenario:2, type:"single",
  stem:"A monorepo's root CLAUDE.md has grown to 900 lines covering testing, API conventions and deployment. Adherence has visibly degraded. What is the recommended restructuring?",
  options:[
    {k:"A", text:"Split it into focused topic files under `.claude/rules/`, such as `testing.md` and `deployment.md`."},
    {k:"B", text:"Split it into several files and pull them all back in with `@import`, which reduces the total context cost at session start."},
    {k:"C", text:"Move the content into a skill so it loads only when explicitly invoked."},
    {k:"D", text:"Leave it as one file but reorder it so the most important rules appear first."}
  ],
  correct:["A"],
  explain:{
    why:"`.claude/rules/` is designed for exactly this: modular, topic-scoped instruction files that are easier to maintain, and which can additionally be path-scoped so they load only when relevant.",
    distractors:{
      B:"Imports help organisation but not context cost. Imported files are expanded and loaded at launch just the same, so the 900 lines still enter context.",
      C:"Universal standards must apply always. A skill loads on invocation, which is the wrong model for conventions that should govern every edit.",
      D:"Ordering helps marginally, but the file still consumes the same context and the documented guidance is to target under about 200 lines per file."
    }
  },
  refs:[{label:"Claude Code: Memory", url:"https://code.claude.com/docs/en/memory"}] },

{ id:"d3-3.1-c", domain:3, ts:"3.1", scenario:3, type:"single",
  stem:"In a monorepo, each package should pull in only the standards files its maintainers consider relevant. Which CLAUDE.md feature supports this?",
  options:[
    {k:"A", text:"`@path/to/file` import syntax, letting each package reference the standards files it needs."},
    {k:"B", text:"A `scope` frontmatter field in each standards file, naming the specific packages that it should apply to at load time."},
    {k:"C", text:"Symlinking the root CLAUDE.md into each package directory."},
    {k:"D", text:"A `packages` array in `.claude/settings.json` mapping directories to standards files."}
  ],
  correct:["A"],
  explain:{
    why:"`@path/to/file` imports let each package compose its own instruction set from shared standards files, so a Go service and a React app can pull in different subsets while sharing the ones they have in common.",
    distractors:{
      B:"CLAUDE.md files do not take a `scope` frontmatter field. Path scoping is a `.claude/rules/` feature, via `paths`.",
      C:"Symlinking the same file everywhere gives every package identical instructions, which is the opposite of selective inclusion.",
      D:"No such settings mapping exists."
    }
  },
  refs:[{label:"Claude Code: Memory", url:"https://code.claude.com/docs/en/memory"}] },

{ id:"d3-3.1-d", domain:3, ts:"3.1", scenario:1, type:"single",
  stem:"Behaviour differs between two of your sessions and you suspect different memory files are loading. Which command does the exam guide direct you to for verifying which memory files are loaded?",
  options:[
    {k:"A", text:"`/memory`"},
    {k:"B", text:"`/status`"},
    {k:"C", text:"`/config`"},
    {k:"D", text:"`/doctor`"}
  ],
  correct:["A"],
  explain:{
    why:"The exam guide names `/memory` as the command for verifying which memory files are loaded and diagnosing inconsistent behaviour across sessions.",
    distractors:{
      B:"`/status` is not the documented command for inspecting memory files.",
      C:"`/config` opens configuration settings, not the memory file listing.",
      D:"`/doctor` runs a general configuration checkup, and while it can propose CLAUDE.md trims it is not the memory-inspection command."
    }
  },
  note:"Answer `/memory` on the exam. In current Claude Code the two have separated: **`/memory`** lists and opens memory file *locations* and toggles auto memory, while **`/context`** shows which files actually **loaded** into the current session. For live debugging today, `/context` is the one that answers 'did it load?'.",
  refs:[{label:"Claude Code: Memory", url:"https://code.claude.com/docs/en/memory"}] },

{ id:"d3-3.1-e", domain:3, ts:"3.1", scenario:4, type:"single",
  stem:"How does Claude Code combine CLAUDE.md files found at several levels of the directory hierarchy?",
  options:[
    {k:"A", text:"All discovered files are concatenated into context, ordered from the root downwards."},
    {k:"B", text:"Only the most specific file applies; files higher in the tree are overridden entirely."},
    {k:"C", text:"Only the file at the repository root applies; subdirectory files are ignored."},
    {k:"D", text:"Files are merged section by section, with conflicting sections resolved by the modification time of each file."}
  ],
  correct:["A"],
  explain:{
    why:"Discovered files are concatenated rather than overriding one another, ordered root-downwards so instructions closest to where you launched Claude are read last. This is why contradictory instructions across levels are a real hazard worth periodically auditing.",
    distractors:{
      B:"Nothing is discarded. A user-level file and a project file both contribute.",
      C:"Subdirectory files are discovered and load on demand when Claude reads files in those directories.",
      D:"There is no section-level merge, and modification time plays no part."
    }
  },
  refs:[{label:"Claude Code: Memory", url:"https://code.claude.com/docs/en/memory"}] },

{ id:"d3-3.1-f", domain:3, ts:"3.1", scenario:2, type:"single",
  stem:"A rule in your CLAUDE.md says 'never push directly to main', and Claude has pushed to main twice this month. What does this tell you about CLAUDE.md?",
  options:[
    {k:"A", text:"It is context that shapes behaviour, not enforced configuration; use a hook to guarantee it."},
    {k:"B", text:"The instruction is too short; expanding it with rationale would make it binding."},
    {k:"C", text:"Negative instructions are unsupported in CLAUDE.md and must always be rephrased as positive statements before they take effect."},
    {k:"D", text:"The file exceeded the size limit and that instruction was truncated from context."}
  ],
  correct:["A"],
  explain:{
    why:"The documentation is explicit that CLAUDE.md is delivered as context and carries no guarantee of strict compliance. To block an action regardless of what Claude decides, you need a PreToolUse hook or a permissions deny rule.",
    distractors:{
      B:"Rationale improves adherence somewhat but still yields context, not enforcement.",
      C:"Negative instructions are perfectly valid; specificity matters more than polarity.",
      D:"Truncation applies to files over a very large limit, and a normal CLAUDE.md is nowhere near it."
    }
  },
  refs:[{label:"Claude Code: Memory", url:"https://code.claude.com/docs/en/memory"}] },

{ id:"d3-3.2-a", domain:3, ts:"3.2", scenario:2, type:"single",
  stem:"You want a custom `/review` slash command running your team's review checklist, available to every developer when they clone or pull the repository. Where should the command file live?",
  options:[
    {k:"A", text:"In the `.claude/commands/` directory in the project repository."},
    {k:"B", text:"In `~/.claude/commands/` in each developer's home directory."},
    {k:"C", text:"In the CLAUDE.md file at the project root."},
    {k:"D", text:"In a `.claude/config.json` file with a `commands` array."}
  ],
  correct:["A"],
  explain:{
    why:"Project-scoped commands live in `.claude/commands/`, are version controlled, and become available to everyone automatically on clone or pull.",
    distractors:{
      B:"`~/.claude/commands/` holds personal commands that are not shared through version control, so each developer would have to create it themselves.",
      C:"CLAUDE.md carries project instructions and context. It is not where command definitions go.",
      D:"This describes a configuration mechanism that does not exist in Claude Code."
    }
  },
  refs:[{label:"Claude Code: Skills", url:"https://code.claude.com/docs/en/skills"}] },

{ id:"d3-3.2-b", domain:3, ts:"3.2", scenario:2, type:"single",
  stem:"A codebase-analysis skill produces several thousand lines of exploration output, and after running it the main conversation is cluttered and subsequent answers degrade. Which frontmatter option addresses this?",
  options:[
    {k:"A", text:"`context: fork`, which runs the skill in an isolated subagent with a fresh context window."},
    {k:"B", text:"`allowed-tools`, restricting the skill to read-only tools so it produces less output."},
    {k:"C", text:"`model`, setting a model with a larger context window for the skill."},
    {k:"D", text:"`disable-model-invocation`, so the skill runs only when explicitly requested."}
  ],
  correct:["A"],
  explain:{
    why:"`context: fork` isolates the skill in a subagent with its own context window, so verbose output never enters the main conversation. Only the result comes back.",
    distractors:{
      B:"`allowed-tools` restricts which tools may be used. Read-only tools can still generate thousands of lines of output.",
      C:"A larger window for the skill does not stop its output landing in the main conversation afterwards.",
      D:"That controls when the skill is invoked, not where its output accumulates."
    }
  },
  refs:[{label:"Claude Code: Skills", url:"https://code.claude.com/docs/en/skills"}] },

{ id:"d3-3.2-c", domain:3, ts:"3.2", scenario:2, type:"single",
  stem:"A shared skill performs a refactor you want to run slightly differently, but your teammates depend on the current behaviour. What is the appropriate approach?",
  options:[
    {k:"A", text:"Create a personal variant in `~/.claude/skills/` under a different name."},
    {k:"B", text:"Edit the project skill and add a parameter that switches between the two behaviours."},
    {k:"C", text:"Copy the skill into `.claude/skills/` under the same name so that your local copy takes precedence over the shared one."},
    {k:"D", text:"Edit the project skill directly and revert your changes before each commit."}
  ],
  correct:["A"],
  explain:{
    why:"A differently-named personal skill in your user directory gives you the variant you want with no effect on teammates and nothing to coordinate.",
    distractors:{
      B:"Adding a parameter for one person's preference complicates a shared asset everyone else must now understand.",
      C:"A same-named copy in the project directory would be committed and would collide with the shared skill for everyone.",
      D:"Editing and reverting shared files is error-prone and one forgotten revert changes behaviour for the whole team."
    }
  },
  refs:[{label:"Claude Code: Skills", url:"https://code.claude.com/docs/en/skills"}] },

{ id:"d3-3.2-d", domain:3, ts:"3.2", scenario:2, type:"single",
  stem:"A skill performs file cleanup and you want to ensure it can never run destructive shell commands, regardless of what the model decides mid-execution. Which frontmatter field applies?",
  options:[
    {k:"A", text:"`allowed-tools`, restricting tool access while the skill is active."},
    {k:"B", text:"`argument-hint`, prompting for confirmation before destructive operations."},
    {k:"C", text:"`context: fork`, isolating the skill so any damage is contained to the subagent."},
    {k:"D", text:"`description`, stating clearly that the skill must not delete files."}
  ],
  correct:["A"],
  explain:{
    why:"`allowed-tools` constrains which tools are available during skill execution. Omitting Bash from that list means destructive shell commands are simply not available to run.",
    distractors:{
      B:"`argument-hint` is a display-only autocomplete hint. It does not gate anything.",
      C:"Forking isolates context, not filesystem effects. A subagent with Bash can still delete real files.",
      D:"A description is guidance to the model, not a constraint on capability."
    }
  },
  refs:[{label:"Claude Code: Skills", url:"https://code.claude.com/docs/en/skills"}] },

{ id:"d3-3.2-e", domain:3, ts:"3.2", scenario:1, type:"single",
  stem:"Which frontmatter field prompts developers for required parameters when they invoke a skill without arguments?",
  options:[
    {k:"A", text:"`argument-hint`"},
    {k:"B", text:"`allowed-tools`"},
    {k:"C", text:"`context`"},
    {k:"D", text:"`required-args`"}
  ],
  correct:["A"],
  explain:{
    why:"`argument-hint` supplies the hint shown in the slash-command autocomplete, telling the developer what arguments the skill expects.",
    distractors:{
      B:"`allowed-tools` restricts tool access during execution.",
      C:"`context` controls execution context, with `fork` running the skill in an isolated subagent.",
      D:"There is no `required-args` field."
    }
  },
  note:"`argument-hint` is a Claude Code extension rather than part of the base Agent Skills specification, which lists only `allowed-tools`, `compatibility`, `description`, `license`, `metadata` and `name`. It is also display-only: it prompts, but does not enforce that arguments are supplied.",
  refs:[{label:"Claude Code: Skills", url:"https://code.claude.com/docs/en/skills"}] },

{ id:"d3-3.2-f", domain:3, ts:"3.2", scenario:6, type:"single",
  stem:"When should a convention live in CLAUDE.md rather than in a skill?",
  options:[
    {k:"A", text:"When it is a universal standard that should apply in every session without needing to be invoked."},
    {k:"B", text:"When it is a multi-step procedure used occasionally for a specific task."},
    {k:"C", text:"When it produces verbose output that should not be allowed to pollute the main conversation."},
    {k:"D", text:"When it must be restricted to a limited set of tools during execution."}
  ],
  correct:["A"],
  explain:{
    why:"CLAUDE.md is loaded into every session, which suits always-on universal standards. Skills load on demand, which suits task-specific workflows.",
    distractors:{
      B:"An occasional multi-step procedure is the canonical case for a skill; putting it in CLAUDE.md spends context on it every session.",
      C:"That is an argument for a skill with `context: fork`, not for CLAUDE.md.",
      D:"Tool restriction is a skill frontmatter capability. CLAUDE.md cannot restrict tools."
    }
  },
  refs:[{label:"Claude Code: Skills", url:"https://code.claude.com/docs/en/skills"}] },

{ id:"d3-3.3-a", domain:3, ts:"3.3", scenario:2, type:"single",
  stem:"Your codebase has distinct conventions per area, and test files sit beside the code they test (`Button.test.tsx` next to `Button.tsx`). You want all tests to follow the same conventions regardless of location. What is the most maintainable approach?",
  options:[
    {k:"A", text:"Create `.claude/rules/` files with YAML frontmatter glob patterns applying conventions by path."},
    {k:"B", text:"Consolidate all conventions in the root CLAUDE.md under headers per area, relying on Claude to infer which section applies."},
    {k:"C", text:"Create skills in `.claude/skills/` for each code type, with the conventions in their SKILL.md files."},
    {k:"D", text:"Place a separate CLAUDE.md in each subdirectory containing that area's conventions."}
  ],
  correct:["A"],
  explain:{
    why:"A glob such as `**/*.test.tsx` follows the file type wherever it lives, which is precisely what is needed when test files are scattered across every component directory. The rule loads automatically when Claude touches a matching file.",
    distractors:{
      B:"This relies on the model inferring which section applies, which is not deterministic matching.",
      C:"Skills are invoked on demand or when Claude judges them relevant, which contradicts a requirement for automatic application by file path.",
      D:"CLAUDE.md files are directory-bound, so covering tests spread across dozens of directories would mean maintaining dozens of near-identical files."
    }
  },
  refs:[{label:"Claude Code: Memory", url:"https://code.claude.com/docs/en/memory"}] },

{ id:"d3-3.3-b", domain:3, ts:"3.3", scenario:2, type:"single",
  stem:"You want a rule to apply only when Claude works with Terraform files. Which frontmatter achieves this?",
  options:[
    {k:"A", text:"`paths:` with a glob list such as `[\"terraform/**/*\"]`."},
    {k:"B", text:"`scope: terraform` naming the directory."},
    {k:"C", text:"`applies-to: \"*.tf\"` as a single string value."},
    {k:"D", text:"`when: editing terraform` as a natural language condition."}
  ],
  correct:["A"],
  explain:{
    why:"`.claude/rules/` files take a `paths` frontmatter field holding a list of glob patterns. The rule loads only when Claude reads a file matching one of them.",
    distractors:{
      B:"There is no `scope` field for rule files.",
      C:"Path scoping takes a list of glob patterns rather than a single string value, and the key that carries it is `paths`.",
      D:"Rule scoping is by glob pattern, not by a natural language condition."
    }
  },
  refs:[{label:"Claude Code: Memory", url:"https://code.claude.com/docs/en/memory"}] },

{ id:"d3-3.3-c", domain:3, ts:"3.3", scenario:4, type:"single",
  stem:"What is the context-cost advantage of path-scoped rules over unconditional instructions?",
  options:[
    {k:"A", text:"They load only when Claude works with matching files, so irrelevant context is avoided."},
    {k:"B", text:"They are compressed before loading, so they consume roughly half the tokens."},
    {k:"C", text:"They are stored server-side and referenced by ID rather than being sent with each individual API request."},
    {k:"D", text:"They replace rather than add to CLAUDE.md, reducing the total instruction volume."}
  ],
  correct:["A"],
  explain:{
    why:"Conditional loading is the whole benefit: a session that never touches Terraform never pays for the Terraform conventions. That leaves more of the window for the actual work.",
    distractors:{
      B:"There is no compression step; the text loads as written.",
      C:"Instructions are sent as context with requests, not referenced by a server-side ID.",
      D:"Rules complement CLAUDE.md rather than replacing it, and rules without `paths` load unconditionally alongside it."
    }
  },
  refs:[{label:"Claude Code: Memory", url:"https://code.claude.com/docs/en/memory"}] },

{ id:"d3-3.3-d", domain:3, ts:"3.3", scenario:1, type:"single",
  stem:"A rule file in `.claude/rules/` has no `paths` frontmatter. When does it load?",
  options:[
    {k:"A", text:"Unconditionally at launch, at the same priority as `.claude/CLAUDE.md`."},
    {k:"B", text:"Never, since a rule without `paths` has no activation condition."},
    {k:"C", text:"Only when the user explicitly references it by filename."},
    {k:"D", text:"Only when Claude reads a file in the same directory as the rule file."}
  ],
  correct:["A"],
  explain:{
    why:"Rules without a `paths` field are loaded unconditionally at launch and apply to all files, at the same priority as the project CLAUDE.md. The `paths` field is what makes a rule conditional.",
    distractors:{
      B:"Absence of `paths` means always, not never.",
      C:"Rules are not invoked by name; that is closer to how skills work.",
      D:"Rule files live in `.claude/rules/` and are not scoped to that directory's siblings."
    }
  },
  refs:[{label:"Claude Code: Memory", url:"https://code.claude.com/docs/en/memory"}] },

{ id:"d3-3.3-e", domain:3, ts:"3.3", scenario:2, type:"single",
  stem:"You need one rule to cover both `.ts` and `.tsx` files under `src/`. Which pattern is correct?",
  options:[
    {k:"A", text:"`\"src/**/*.{ts,tsx}\"`, using brace expansion."},
    {k:"B", text:"`\"src/**/*.ts|tsx\"`, using an alternation pipe."},
    {k:"C", text:"`\"src/**/*.ts*\"`, relying on the trailing wildcard."},
    {k:"D", text:"`\"src/**/*.[ts|tsx]\"`, using a bracket expression."}
  ],
  correct:["A"],
  explain:{
    why:"Brace expansion is the supported way to match multiple extensions in one pattern, and `src/**/*.{ts,tsx}` expands to the two patterns you want.",
    distractors:{
      B:"Glob syntax does not use a pipe for alternation; that is regular expression syntax.",
      C:"A trailing wildcard would also match unintended extensions such as `.tsbuildinfo`.",
      D:"Brackets denote a character class, so this would match single characters from that set rather than the two extensions."
    }
  },
  refs:[{label:"Claude Code: Memory", url:"https://code.claude.com/docs/en/memory"}] },

{ id:"d3-3.3-f", domain:3, ts:"3.3", scenario:4, type:"single",
  stem:"When should you prefer a path-scoped rule over a subdirectory CLAUDE.md?",
  options:[
    {k:"A", text:"When the convention applies to a file type that appears across many different directories."},
    {k:"B", text:"When the convention applies to everything within one self-contained package directory."},
    {k:"C", text:"When the convention must be shared with teammates via version control."},
    {k:"D", text:"When the convention is short enough to fit in a few lines."}
  ],
  correct:["A"],
  explain:{
    why:"Glob patterns follow file type regardless of location, which is what makes them right for conventions that cut across the directory structure. A subdirectory CLAUDE.md can only cover one subtree.",
    distractors:{
      B:"A self-contained package directory is exactly the case a subdirectory CLAUDE.md handles well.",
      C:"Both are committed to the repository, so sharing does not distinguish them.",
      D:"Length is irrelevant to the choice; scope shape is what matters."
    }
  },
  refs:[{label:"Claude Code: Memory", url:"https://code.claude.com/docs/en/memory"}] },

{ id:"d3-3.4-a", domain:3, ts:"3.4", scenario:2, type:"single",
  stem:"You have been assigned to restructure a monolithic application into microservices. This involves changes across dozens of files and requires decisions about service boundaries and module dependencies. Which approach should you take?",
  options:[
    {k:"A", text:"Enter plan mode to explore the codebase, understand dependencies and design an approach before making changes."},
    {k:"B", text:"Start with direct execution and make changes incrementally, letting the implementation reveal the natural service boundaries."},
    {k:"C", text:"Use direct execution with comprehensive upfront instructions detailing exactly how each service should be structured."},
    {k:"D", text:"Begin in direct execution and switch to plan mode only if you hit unexpected complexity."}
  ],
  correct:["A"],
  explain:{
    why:"Plan mode exists for large-scale changes with architectural decisions and multiple valid approaches, which is exactly this task. Exploring dependencies before committing to a structure is what prevents expensive rework.",
    distractors:{
      B:"Letting boundaries emerge risks discovering a circular dependency after twenty files have been moved, which is the costly kind of late discovery.",
      C:"Comprehensive upfront instructions assume you already know the right structure, but the dependency map is precisely what you have not yet examined.",
      D:"The complexity is stated in the requirements rather than being a possibility that might emerge later, so waiting for it is waiting for something already present."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d3-3.4-b", domain:3, ts:"3.4", scenario:2, type:"single",
  stem:"A bug report includes a clear stack trace pointing at one function that fails on null dates. The fix is a single conditional. What is the appropriate mode?",
  options:[
    {k:"A", text:"Direct execution, since the change is well-scoped with one clear valid approach."},
    {k:"B", text:"Plan mode, because all production bug fixes warrant a documented plan before implementation."},
    {k:"C", text:"Plan mode, because null handling can have subtle implications elsewhere in the codebase."},
    {k:"D", text:"Direct execution, but only after an Explore subagent maps every caller of the function."}
  ],
  correct:["A"],
  explain:{
    why:"Plan mode has a cost, and it earns that cost on architectural or multi-approach work. A single-file fix with a clear stack trace and one obvious remedy is the canonical direct-execution case.",
    distractors:{
      B:"A blanket rule ignores the criterion that actually matters, which is scope and ambiguity rather than the fact of it being a bug fix.",
      C:"This is possible in principle, but the stack trace has already localised the cause; speculative breadth here is disproportionate.",
      D:"Mapping every caller before adding one conditional is exploration effort out of all proportion to the change."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d3-3.4-c", domain:3, ts:"3.4", scenario:2, type:"single",
  stem:"During a multi-phase migration, the discovery phase generates thousands of lines of file listings and search output, and by the implementation phase the agent has lost track of earlier decisions. What should you use?",
  options:[
    {k:"A", text:"The Explore subagent for the discovery phase, so only a summary returns."},
    {k:"B", text:"A larger context window model, so that the discovery output and the implementation work both fit comfortably."},
    {k:"C", text:"Plan mode for the whole task, since plan mode does not consume context."},
    {k:"D", text:"Splitting the work across two developers so each context stays smaller."}
  ],
  correct:["A"],
  explain:{
    why:"The Explore subagent isolates verbose discovery in its own context and returns a summary, which preserves the main conversation for the decisions and implementation that follow.",
    distractors:{
      B:"A bigger window delays exhaustion and still leaves the main conversation diluted by thousands of lines of listings.",
      C:"Plan mode absolutely consumes context; exploration during planning fills the window just as it does otherwise.",
      D:"Dividing the work between people does not address how one agent's context is being consumed."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d3-3.4-d", domain:3, ts:"3.4", scenario:2, type:"single",
  stem:"You are migrating a library used in 45 files and there are two viable integration approaches with different infrastructure implications. How should plan mode and direct execution be combined?",
  options:[
    {k:"A", text:"Use plan mode to choose the approach, then direct execution to implement it."},
    {k:"B", text:"Use plan mode throughout, since the change spans 45 files from start to finish."},
    {k:"C", text:"Use direct execution throughout, checking in with the team after every fifth file."},
    {k:"D", text:"Use plan mode for the first file, then direct execution to replicate the pattern across the rest."}
  ],
  correct:["A"],
  explain:{
    why:"The uncertainty is concentrated in the choice between approaches. Plan mode resolves that, and once the approach is settled the remaining work is mechanical and well-suited to direct execution.",
    distractors:{
      B:"Staying in plan mode past the point of decision adds ceremony to work whose shape is now known.",
      C:"Starting direct means committing to one of the two approaches before evaluating either, with 45 files of rework at stake.",
      D:"One file is unlikely to surface the infrastructure differences that distinguish the approaches, which is what the decision hinges on."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d3-3.4-e", domain:3, ts:"3.4", scenario:4, type:"multi",
  stem:"Which two characteristics indicate that a task warrants plan mode? (Select 2.)",
  options:[
    {k:"A", text:"Several valid approaches exist, with materially different trade-offs between them."},
    {k:"B", text:"The change has architectural implications across many files."},
    {k:"C", text:"The task involves editing a file type you have not worked with before."},
    {k:"D", text:"The task will take more than thirty minutes of wall-clock time."}
  ],
  correct:["A","B"],
  explain:{
    why:"Plan mode earns its cost where a wrong early commitment is expensive: when the approach is genuinely contested, and when the blast radius spans architecture and many files.",
    distractors:{
      C:"Unfamiliar syntax is a knowledge gap, not an architectural decision. A single unfamiliar file edit is still a single file edit.",
      D:"Duration is not the criterion. A long mechanical refactor with one obvious approach does not need planning; a short but contested design decision might."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d3-3.4-f", domain:3, ts:"3.4", scenario:3, type:"single",
  stem:"What is the primary benefit plan mode provides beyond simply thinking before acting?",
  options:[
    {k:"A", text:"It enables safe exploration of the codebase before any change is committed."},
    {k:"B", text:"It runs the proposed changes in a sandbox so their effects can be measured before they are applied to the working tree."},
    {k:"C", text:"It automatically generates a rollback commit so any change can be undone."},
    {k:"D", text:"It reduces token usage by preventing the agent from reading files during the design phase."}
  ],
  correct:["A"],
  explain:{
    why:"The value is exploring and designing without mutating anything. You learn what the dependency structure actually is while the cost of changing your mind is still near zero.",
    distractors:{
      B:"Plan mode does not execute changes in a sandbox; it refrains from making them at all.",
      C:"Rollback commits are a version control practice, not a plan mode feature.",
      D:"Plan mode encourages reading files. It restricts writes, not reads."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d3-3.5-a", domain:3, ts:"3.5", scenario:2, type:"single",
  stem:"You have described a data transformation in prose three times and each attempt produces a different interpretation of how edge cases should be handled. What is the most effective next step?",
  options:[
    {k:"A", text:"Provide two or three concrete input/output examples of what the transformation should produce."},
    {k:"B", text:"Rewrite the description a fourth time with more precise vocabulary and formal terminology."},
    {k:"C", text:"Break the description into numbered steps so each part is unambiguous in isolation."},
    {k:"D", text:"Ask the model to restate the requirement in its own words before implementing."}
  ],
  correct:["A"],
  explain:{
    why:"Concrete input/output pairs communicate a transformation unambiguously in a way prose repeatedly fails to. Two or three examples pin down exactly the edge-case behaviour the descriptions kept leaving open.",
    distractors:{
      B:"Three failed attempts is strong evidence that the medium is the problem, not the wording.",
      C:"Numbered steps make the procedure clearer but still leave each step's edge cases open to interpretation.",
      D:"Restating can surface a misunderstanding, but it does not tell the model what the right answer is."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d3-3.5-b", domain:3, ts:"3.5", scenario:2, type:"single",
  stem:"You are about to implement a caching layer in a domain you do not know well and are unsure what considerations you might be missing. Which technique surfaces them before implementation?",
  options:[
    {k:"A", text:"The interview pattern: have Claude ask questions to surface unanticipated considerations."},
    {k:"B", text:"Ask for three complete implementations and compare them."},
    {k:"C", text:"Ask for the implementation first, then review the result against a checklist of domain considerations afterwards."},
    {k:"D", text:"Provide input/output examples of the cache behaviour you expect."}
  ],
  correct:["A"],
  explain:{
    why:"The interview pattern inverts the flow: rather than you specifying what you do not know you need, the model raises invalidation strategy, failure modes and consistency requirements as questions, before any code is written.",
    distractors:{
      B:"Three implementations built on the same incomplete understanding will share the same blind spots.",
      C:"Reviewing afterwards catches issues once the design has already been committed to code.",
      D:"Examples work when you know the expected behaviour. Here the problem is that you do not yet know what to specify."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d3-3.5-c", domain:3, ts:"3.5", scenario:2, type:"single",
  stem:"A generated function has four defects. Fixing the pagination bug changes how the retry logic must work, and the error-handling fix depends on both. How should you report them?",
  options:[
    {k:"A", text:"In a single detailed message covering all four issues, because the fixes interact."},
    {k:"B", text:"One at a time in dependency order, verifying each fix before reporting the next."},
    {k:"C", text:"One at a time in severity order, starting with the most serious."},
    {k:"D", text:"In two messages, splitting them into interacting and independent pairs."}
  ],
  correct:["A"],
  explain:{
    why:"When fixes interact, addressing them one at a time means each fix is made without knowledge of the others, so later fixes disturb earlier ones. A single message lets the model design a coherent solution across all four.",
    distractors:{
      B:"Sequential fixing is the right approach for independent problems, but here each fix would be immediately invalidated by the next.",
      C:"Severity ordering does not address the interaction; the same churn occurs.",
      D:"The premise states three of them interact, so splitting still separates fixes that depend on each other."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d3-3.5-d", domain:3, ts:"3.5", scenario:2, type:"single",
  stem:"You want to guide implementation of a complex parser toward correctness progressively. Which approach fits test-driven iteration?",
  options:[
    {k:"A", text:"Write a test suite covering behaviour, edge cases and performance, then share the failures."},
    {k:"B", text:"Implement first, then write tests against whatever the implementation produces."},
    {k:"C", text:"Write tests and implementation together in one request so they stay consistent."},
    {k:"D", text:"Write only performance tests, since correctness is easier to verify by reading through the finished code directly."}
  ],
  correct:["A"],
  explain:{
    why:"Tests written first are an executable specification. Sharing concrete failures then gives precise, verifiable feedback each round, which is what makes the iteration converge.",
    distractors:{
      B:"Tests written against the implementation encode its bugs as expected behaviour.",
      C:"Generating both together means the tests inherit whatever misunderstanding shaped the implementation, so they pass while being wrong.",
      D:"Performance tests say nothing about correctness, which is the harder property for a parser."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d3-3.5-e", domain:3, ts:"3.5", scenario:2, type:"single",
  stem:"A migration script mishandles null values in one column. What is the most effective way to communicate the fix?",
  options:[
    {k:"A", text:"Provide a specific test case with the null-containing input and the exact expected output."},
    {k:"B", text:"State clearly that the script must handle null values correctly in every affected column."},
    {k:"C", text:"Ask for defensive null checks to be added throughout the script."},
    {k:"D", text:"Share the database schema so the nullable columns are visible."}
  ],
  correct:["A"],
  explain:{
    why:"A concrete input with its expected output removes all ambiguity about what correct handling means here, whether the null should become a default, be skipped, or propagate.",
    distractors:{
      B:"'Handle nulls correctly' does not say what correct is, which is precisely the ambiguity to resolve.",
      C:"Blanket defensive checks add noise throughout and still do not specify the intended semantics.",
      D:"The schema shows which columns are nullable but not what should happen when a null is found."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d3-3.5-f", domain:3, ts:"3.5", scenario:4, type:"single",
  stem:"When is sequential iteration, fixing one issue at a time, the better choice?",
  options:[
    {k:"A", text:"When the issues are independent, so that each fix can be verified without disturbing the others."},
    {k:"B", text:"Always, since smaller changes are easier to review."},
    {k:"C", text:"When the issues interact, so that each fix can properly account for the one applied before it."},
    {k:"D", text:"When there are more than three issues, regardless of how they relate."}
  ],
  correct:["A"],
  explain:{
    why:"Independent problems are exactly the case where one-at-a-time works well: each fix is isolated and verifiable, and nothing you do next invalidates it.",
    distractors:{
      B:"For interacting problems, sequential fixing produces churn as each change disturbs the last.",
      C:"This is inverted. Interacting issues should be addressed together in one detailed message.",
      D:"Count is not the criterion; whether the fixes interact is."
    }
  },
  refs:[{label:"API: Prompting best practices", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"}] },

{ id:"d3-3.6-a", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"Your pipeline script runs `claude \"Analyze this pull request for security issues\"` but the job hangs indefinitely. Logs indicate Claude Code is waiting for interactive input. What is the correct approach?",
  options:[
    {k:"A", text:"Add the `-p` flag: `claude -p \"Analyze this pull request\"`"},
    {k:"B", text:"Set the environment variable `CLAUDE_HEADLESS=true` before running the command."},
    {k:"C", text:"Redirect stdin from /dev/null after the command."},
    {k:"D", text:"Add the `--batch` flag."}
  ],
  correct:["A"],
  explain:{
    why:"`-p` (or `--print`) is the documented non-interactive mode: it processes the prompt, writes the result to stdout and exits without waiting for input, which is exactly what a pipeline needs.",
    distractors:{
      B:"`CLAUDE_HEADLESS` is not a real environment variable.",
      C:"Redirecting stdin is a Unix workaround that does not address the command's mode, and leaves other interactive behaviour in place.",
      D:"`--batch` is not a Claude Code flag."
    }
  },
  refs:[{label:"Claude Code: Headless", url:"https://code.claude.com/docs/en/headless"}] },

{ id:"d3-3.6-b", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"Your CI job needs review findings in a machine-parseable form so a later step can post them as inline PR comments. Which flags produce this?",
  options:[
    {k:"A", text:"`--output-format json` together with `--json-schema` defining the finding structure."},
    {k:"B", text:"`--output-format markdown`, then parse the headings with a regular expression."},
    {k:"C", text:"`--verbose`, which includes structured metadata alongside the prose response."},
    {k:"D", text:"`--print-json`, which is the single flag that enables schema-conformant output."}
  ],
  correct:["A"],
  explain:{
    why:"`--output-format json` wraps the response in structured JSON, and `--json-schema` constrains the content to your schema, returned in a `structured_output` field. That combination is the canonical recipe for pipeline-parseable findings.",
    distractors:{
      B:"Parsing markdown headings with regular expressions is brittle and breaks whenever the prose format shifts, which is the problem structured output eliminates.",
      C:"`--verbose` increases logging detail; it does not constrain output to a schema.",
      D:"`--print-json` is not a Claude Code flag."
    }
  },
  refs:[{label:"Claude Code: Headless", url:"https://code.claude.com/docs/en/headless"}] },

{ id:"d3-3.6-c", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"Your automated reviewer re-runs on every push and reposts the same three findings each time, frustrating developers. What is the fix?",
  options:[
    {k:"A", text:"Include prior findings in context and report only new or still-unaddressed issues."},
    {k:"B", text:"Run the review only on the first push of each pull request."},
    {k:"C", text:"Deduplicate comments in the posting step by comparing each finding's text against the comments already on the pull request."},
    {k:"D", text:"Lower the review sensitivity so fewer findings are produced overall."}
  ],
  correct:["A"],
  explain:{
    why:"Giving the reviewer its own prior findings lets it distinguish what is new from what it already said, and it can also recognise when a previous finding has since been fixed.",
    distractors:{
      B:"Reviewing only the first push means later commits, which are often where fixes introduce new problems, go unreviewed.",
      C:"Text comparison is fragile, since the same issue is easily reworded between runs, and it cannot tell that an old finding is now resolved.",
      D:"Reducing sensitivity suppresses genuine findings to solve a duplication problem."
    }
  },
  refs:[{label:"Claude Code: Headless", url:"https://code.claude.com/docs/en/headless"}] },

{ id:"d3-3.6-d", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"Your CI test generator produces many low-value tests, such as asserting that a getter returns the value that was set. How should you improve output quality?",
  options:[
    {k:"A", text:"Document testing standards, what makes a test valuable, and the fixtures in CLAUDE.md."},
    {k:"B", text:"Add a post-processing step that discards any generated test under five lines."},
    {k:"C", text:"Reduce the number of tests requested per run so only the best are produced."},
    {k:"D", text:"Switch the generator to a larger model, which tends to produce more sophisticated and valuable tests."}
  ],
  correct:["A"],
  explain:{
    why:"CLAUDE.md is the documented mechanism for giving CI-invoked Claude Code its project context. Stating what your team considers a valuable test, and which fixtures exist, directly addresses why trivial tests are being produced.",
    distractors:{
      B:"Line count is a poor proxy for value; some important assertions are short and some trivial ones are verbose.",
      C:"Asking for fewer tests does not make the model prioritise better, so you get fewer tests of the same quality.",
      D:"A larger model without criteria still has to guess what your team values, and will guess plausibly rather than correctly."
    }
  },
  refs:[{label:"Claude Code: Headless", url:"https://code.claude.com/docs/en/headless"}] },

{ id:"d3-3.6-e", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"Your test generator keeps proposing scenarios the existing suite already covers. What is the most direct fix?",
  options:[
    {k:"A", text:"Provide the existing test files in context so generation avoids covered scenarios."},
    {k:"B", text:"Instruct the model not to generate duplicate tests."},
    {k:"C", text:"Run each generated test and discard any of them that pass without needing any modification at all."},
    {k:"D", text:"Generate tests only for files changed in the current pull request."}
  ],
  correct:["A"],
  explain:{
    why:"The model cannot avoid duplicating tests it has never seen. Supplying the existing suite lets it identify genuine coverage gaps instead of regenerating what exists.",
    distractors:{
      B:"The instruction is unactionable without knowledge of what is already covered.",
      C:"Passing is not evidence of duplication; a well-written new test for correct code also passes.",
      D:"This narrows the scope but the changed files may already have thorough coverage, so duplication persists within them."
    }
  },
  refs:[{label:"Claude Code: Headless", url:"https://code.claude.com/docs/en/headless"}] },

{ id:"d3-3.6-f", domain:3, ts:"3.6", scenario:5, type:"single",
  stem:"Why is the same Claude session that generated a piece of code a weaker reviewer of it than a fresh instance?",
  options:[
    {k:"A", text:"It retains the reasoning context that produced the code, so it rarely questions it."},
    {k:"B", text:"Its context window is already partly consumed, so it has less capacity for review."},
    {k:"C", text:"Review requires a different model configuration that cannot be changed mid-session."},
    {k:"D", text:"Generated code is cached within the session and re-read from that cache rather than being analysed afresh."}
  ],
  correct:["A"],
  explain:{
    why:"Having just justified each decision, the session treats those justifications as settled. An independent instance sees only the code, with no attachment to the reasoning behind it, and questions things the author would not.",
    distractors:{
      B:"Remaining capacity is a practical consideration but not the reason self-review is weak; the bias persists even with plenty of context left.",
      C:"Review does not require a different model configuration.",
      D:"There is no cache that bypasses analysis; the code is in context and is read normally."
    }
  },
  refs:[{label:"Claude Code: Headless", url:"https://code.claude.com/docs/en/headless"}] },
