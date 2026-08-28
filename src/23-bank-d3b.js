
/* ---- Domain 3 expansion: task statements 3.1, 3.2 and 3.3 ---- */

{ id:"d3-3.1-g", domain:3, ts:"3.1", scenario:2, type:"single",
  stem:"A monorepo has a root CLAUDE.md and one in `packages/api/`. A developer working in `packages/api/` reports that root conventions are being ignored. What is the likely cause?",
  options:[
    {k:"A", text:"The two files contain contradictory guidance."},
    {k:"B", text:"A subdirectory CLAUDE.md replaces any file above it."},
    {k:"C", text:"Only one CLAUDE.md is loaded per session."},
    {k:"D", text:"Subdirectory files load before root files and are overridden."}
  ],
  correct:["A"],
  explain:{
    why:"Both files are concatenated, so nothing is discarded. When two loaded instructions conflict, one is followed arbitrarily, which reads from the outside like the root file being ignored.",
    distractors:{
      B:"Files accumulate rather than replacing one another; the package file adds to the root file.",
      C:"Every file discovered up the tree is loaded, not just one.",
      D:"Content is ordered root-downwards, so the subdirectory file is read last, not overridden."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.1-h", domain:3, ts:"3.1", scenario:4, type:"single",
  stem:"A CLAUDE.md has grown to 1,400 lines and adherence has fallen noticeably. Which explanation fits the documented guidance?",
  options:[
    {k:"A", text:"Longer files consume more context and reduce adherence."},
    {k:"B", text:"Files over 1,000 lines are truncated at load."},
    {k:"C", text:"Instructions past the first 200 lines are ignored."},
    {k:"D", text:"Long files are summarised before being injected."}
  ],
  correct:["A"],
  explain:{
    why:"The guidance is to target under about 200 lines precisely because a large instruction file competes with the work for attention. Nothing is dropped; it simply lands less reliably.",
    distractors:{
      C:"There is no 200-line cutoff for CLAUDE.md; that figure is a target for adherence, and the 200-line limit belongs to the auto-memory index.",
      B:"Truncation applies only far above this size, at several megabytes.",
      D:"CLAUDE.md is injected as written rather than summarised."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.1-i", domain:3, ts:"3.1", scenario:2, type:"single",
  stem:"You want personal project preferences that are not shared with the team but apply to this repository only. Where do they belong?",
  options:[
    {k:"A", text:"`CLAUDE.local.md` at the project root, gitignored."},
    {k:"B", text:"`~/.claude/CLAUDE.md`, which is personal."},
    {k:"C", text:"`.claude/CLAUDE.md`, which is project-scoped."},
    {k:"D", text:"A `personal` section inside the committed CLAUDE.md."}
  ],
  correct:["A"],
  explain:{
    why:"The local file is designed for exactly this: personal, project-specific, and kept out of version control alongside the shared file.",
    distractors:{
      B:"User-level configuration is personal but applies to every project, not just this one.",
      C:"Anything in `.claude/CLAUDE.md` is committed and reaches the whole team.",
      D:"A section inside a committed file is still committed, whatever it is labelled."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.1-j", domain:3, ts:"3.1", scenario:4, type:"single",
  stem:"A developer adds `@../shared/standards.md` to their project CLAUDE.md and is prompted to approve it. Why?",
  options:[
    {k:"A", text:"The import resolves outside the working directory."},
    {k:"B", text:"Imports always require approval on first use."},
    {k:"C", text:"Relative imports are disallowed and must be made absolute."},
    {k:"D", text:"The imported file exceeds the size allowed without confirmation."}
  ],
  correct:["A"],
  explain:{
    why:"An import in a committed project file that points outside the working directory could pull in content the repository does not control, so it is surfaced for a decision the first time.",
    distractors:{
      B:"Imports resolving inside the project load without prompting.",
      C:"Relative paths are supported and resolve against the file containing them.",
      D:"Size is not what triggers the prompt; location is."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.1-k", domain:3, ts:"3.1", scenario:3, type:"single",
  stem:"A team splits a large CLAUDE.md into five files and imports all five with `@`. Context usage is unchanged. Were they misled?",
  options:[
    {k:"A", text:"No: imports aid organisation, and all five still load at launch."},
    {k:"B", text:"Yes: imports should have reduced usage by roughly the split ratio."},
    {k:"C", text:"Yes: imported files load only when referenced in conversation."},
    {k:"D", text:"No: imports increase usage because each file adds a header."}
  ],
  correct:["A"],
  explain:{
    why:"Imports are expanded at launch, so the same content enters context in a tidier arrangement. Reducing what loads requires path-scoped rules, not imports.",
    distractors:{
      B:"No reduction is expected, which is exactly the misunderstanding to correct.",
      C:"Imports are not lazy; they expand when the containing file loads.",
      D:"There is no per-file header overhead of any consequence."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.1-l", domain:3, ts:"3.1", scenario:5, type:"single",
  stem:"A CI run needs project conventions but starts a fresh session each time with no conversation history. Where should those conventions live?",
  options:[
    {k:"A", text:"In the project CLAUDE.md, which loads on every session."},
    {k:"B", text:"In a skill the pipeline invokes before the review step."},
    {k:"C", text:"In the prompt string passed to each CI invocation."},
    {k:"D", text:"In auto memory, which persists across sessions."}
  ],
  correct:["A"],
  explain:{
    why:"CLAUDE.md is committed with the code and loads at the start of every session, so a fresh CI run picks it up without any extra step.",
    distractors:{
      C:"Inlining conventions into the prompt works but duplicates them in pipeline configuration, where they drift from the repository.",
      B:"A skill must be invoked and is better suited to a specific procedure than to always-on standards.",
      D:"Auto memory is machine-local and would not survive an ephemeral CI runner."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.1-m", domain:3, ts:"3.1", scenario:1, type:"single",
  stem:"An instruction in CLAUDE.md is followed in most sessions but not all. The team wants certainty. What should they be told?",
  options:[
    {k:"A", text:"Use a hook; CLAUDE.md is context, not enforcement."},
    {k:"B", text:"Move it to the top of the file, where adherence is highest."},
    {k:"C", text:"Repeat it in a subdirectory CLAUDE.md for reinforcement."},
    {k:"D", text:"Rephrase it as a numbered rule, which is followed more reliably."}
  ],
  correct:["A"],
  explain:{
    why:"The documentation is explicit that CLAUDE.md shapes behaviour without guaranteeing it. Anything that must happen at a specific point belongs in a hook.",
    distractors:{
      B:"Position helps at the margin and is worth doing, but it does not convert guidance into a guarantee.",
      C:"Repetition raises salience and consumes more context, with the same probabilistic outcome.",
      D:"Formatting affects clarity rather than bindingness."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.1-n", domain:3, ts:"3.1", scenario:4, type:"single",
  stem:"In a large monorepo, another team's CLAUDE.md keeps getting picked up because it sits in a parent directory. What addresses this?",
  options:[
    {k:"A", text:"Exclude it by path in local settings."},
    {k:"B", text:"Move your project higher in the tree than theirs."},
    {k:"C", text:"Add a directive at the top of your file overriding theirs."},
    {k:"D", text:"Delete the parent file, since it applies to no one."}
  ],
  correct:["A"],
  explain:{
    why:"Exclusion by path or glob is provided for exactly this monorepo case, and keeping it in local settings means the choice affects only your machine.",
    distractors:{
      B:"Restructuring the repository to change instruction inheritance is a large change for a configuration problem.",
      C:"There is no override directive; files are concatenated rather than ranked.",
      D:"The parent file belongs to another team and presumably applies to them."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.1-o", domain:3, ts:"3.1", scenario:6, type:"multi",
  stem:"Which two locations hold instructions that are shared with teammates through version control? (Select 2.)",
  options:[
    {k:"A", text:"`./CLAUDE.md` at the project root."},
    {k:"B", text:"`.claude/rules/testing.md` in the project."},
    {k:"C", text:"`~/.claude/CLAUDE.md`."},
    {k:"D", text:"`./CLAUDE.local.md`."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both live inside the repository and are committed, so anyone cloning it receives them.",
    distractors:{
      C:"User-level configuration sits in the home directory and is never committed.",
      D:"The local file is intended to be gitignored precisely so it stays personal."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.1-p", domain:3, ts:"3.1", scenario:4, type:"single",
  stem:"After running `/compact`, a developer notices an instruction they gave in conversation is no longer being followed, while CLAUDE.md rules still are. Why?",
  options:[
    {k:"A", text:"Project CLAUDE.md is re-injected; conversation is not."},
    {k:"B", text:"Compaction removes the most recent turns first."},
    {k:"C", text:"Conversation instructions expire after a fixed number of turns."},
    {k:"D", text:"CLAUDE.md is exempt because it is loaded as a system prompt."}
  ],
  correct:["A"],
  explain:{
    why:"The root project file is re-read from disk and re-injected after compaction, so it survives. Anything said only in conversation is subject to summarisation like the rest of the history.",
    distractors:{
      B:"Compaction condenses older content; recent turns are the most likely to survive intact.",
      C:"There is no turn-count expiry on instructions.",
      D:"CLAUDE.md is delivered as a user message after the system prompt, not as part of it."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.1-q", domain:3, ts:"3.1", scenario:1, type:"single",
  stem:"Which command shows which memory files actually loaded into the current session?",
  options:[
    {k:"A", text:"`/context`"},
    {k:"B", text:"`/memory`"},
    {k:"C", text:"`/status`"},
    {k:"D", text:"`/init`"}
  ],
  correct:["A"],
  explain:{
    why:"`/context` reports what is in the current session, including a memory files section, which is what answers 'did it load?'.",
    distractors:{
      B:"`/memory` lists and opens memory file locations and toggles auto memory, which is adjacent but not the same question.",
      C:"`/status` is not the documented command for inspecting loaded memory.",
      D:"`/init` generates a starting CLAUDE.md rather than reporting on one."
    }
  },
  note:"Note the split against the exam guide, which names `/memory` for verifying loaded files. On the exam answer `/memory`; in current Claude Code, `/memory` lists locations and `/context` shows what actually loaded.",
  refs:[R_MEM] },

{ id:"d3-3.1-r", domain:3, ts:"3.1", scenario:4, type:"single",
  stem:"A repository already uses `AGENTS.md` for another coding agent. The team wants both tools to read the same instructions. What is the recommended approach?",
  options:[
    {k:"A", text:"Create a CLAUDE.md that imports `AGENTS.md`."},
    {k:"B", text:"Rename `AGENTS.md` to `CLAUDE.md` and update the other tool."},
    {k:"C", text:"Maintain both files and keep them in sync manually."},
    {k:"D", text:"Configure Claude Code to read `AGENTS.md` directly."}
  ],
  correct:["A"],
  explain:{
    why:"An import keeps one source of truth while letting Claude-specific guidance be appended below it, and both tools keep reading the file they expect.",
    distractors:{
      C:"Manual synchronisation of two instruction files is exactly the drift this avoids.",
      B:"Renaming breaks the other tool unless it is reconfigured, which may not be within your control.",
      D:"Claude Code reads CLAUDE.md; it does not have a setting to read AGENTS.md instead."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.1-s", domain:3, ts:"3.1", scenario:6, type:"single",
  stem:"An organisation wants a coding standard that individual projects cannot switch off. Where should it go?",
  options:[
    {k:"A", text:"The managed policy CLAUDE.md location."},
    {k:"B", text:"A project CLAUDE.md committed to every repository."},
    {k:"C", text:"Each developer's `~/.claude/CLAUDE.md`."},
    {k:"D", text:"A `.claude/rules/` file with no `paths` frontmatter."}
  ],
  correct:["A"],
  explain:{
    why:"Managed policy is deployed centrally and cannot be excluded by individual settings, which is what 'cannot be switched off' requires.",
    distractors:{
      B:"A committed project file can be edited by anyone with repository access.",
      C:"User-level files are personal and easily changed or removed.",
      D:"An unconditional rule still lives in the repository and can be deleted."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.1-t", domain:3, ts:"3.1", scenario:4, type:"single",
  stem:"Two CLAUDE.md files give different indentation rules. What actually happens?",
  options:[
    {k:"A", text:"Both load and one is followed arbitrarily."},
    {k:"B", text:"The more specific file wins deterministically."},
    {k:"C", text:"Claude reports the conflict and asks which to apply."},
    {k:"D", text:"Neither is applied, since the instruction is ambiguous."}
  ],
  correct:["A"],
  explain:{
    why:"Contradictory instructions both enter context and one may be picked arbitrarily, which is why periodically auditing for conflicts across levels is recommended.",
    distractors:{
      B:"Ordering affects reading position rather than establishing precedence between conflicting claims.",
      C:"No conflict detection or prompt exists.",
      D:"Both instructions are present and one will be followed, rather than the topic being skipped."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.2-g", domain:3, ts:"3.2", scenario:2, type:"single",
  stem:"A skill runs a codebase survey and returns a two-line summary, but the main conversation afterwards is full of its intermediate output. Which frontmatter option prevents that?",
  options:[
    {k:"A", text:"`context: fork`"},
    {k:"B", text:"`allowed-tools`"},
    {k:"C", text:"`disable-model-invocation`"},
    {k:"D", text:"`argument-hint`"}
  ],
  correct:["A"],
  explain:{
    why:"Forking runs the skill in an isolated subagent with its own window, so only the result returns and the survey output never enters the main conversation.",
    distractors:{
      B:"Tool restrictions bound what the skill may do; read-only tools can still emit thousands of lines.",
      C:"That governs whether the model may invoke the skill, not where its output lands.",
      D:"An autocomplete hint has no effect on execution."
    }
  },
  refs:[R_SKILL] },

{ id:"d3-3.2-h", domain:3, ts:"3.2", scenario:2, type:"single",
  stem:"You want a slash command available to every developer on the team without them configuring anything. Where does it go?",
  options:[
    {k:"A", text:"`.claude/commands/` in the repository."},
    {k:"B", text:"`~/.claude/commands/` on each machine."},
    {k:"C", text:"A `commands` block in `.claude/settings.json`."},
    {k:"D", text:"A section in the project CLAUDE.md."}
  ],
  correct:["A"],
  explain:{
    why:"Project-scoped commands are committed with the code, so cloning or pulling the repository is all a developer has to do.",
    distractors:{
      B:"Home-directory commands are personal and would need setting up on every machine.",
      C:"Commands are files rather than settings entries.",
      D:"CLAUDE.md carries instructions, not command definitions."
    }
  },
  refs:[R_SKILL] },

{ id:"d3-3.2-i", domain:3, ts:"3.2", scenario:2, type:"single",
  stem:"A skill should never be able to delete files, whatever the model decides mid-run. Which field enforces that?",
  options:[
    {k:"A", text:"`allowed-tools`, omitting anything that can delete."},
    {k:"B", text:"`description`, stating that deletion is out of scope."},
    {k:"C", text:"`context: fork`, isolating any damage to the subagent."},
    {k:"D", text:"`model`, choosing one less prone to destructive actions."}
  ],
  correct:["A"],
  explain:{
    why:"Restricting the tool list removes the capability for the duration of the skill, so nothing depends on the model's judgement.",
    distractors:{
      C:"Forking isolates context, not filesystem effects; a forked subagent with Bash deletes real files.",
      B:"A description guides selection and behaviour without constraining what may be called.",
      D:"Model choice shifts probabilities and provides no guarantee."
    }
  },
  refs:[R_SKILL] },

{ id:"d3-3.2-j", domain:3, ts:"3.2", scenario:3, type:"single",
  stem:"When is a skill the wrong mechanism, and CLAUDE.md the right one?",
  options:[
    {k:"A", text:"When it must apply in every session."},
    {k:"B", text:"When the procedure has more than five steps."},
    {k:"C", text:"When the workflow needs restricted tool access."},
    {k:"D", text:"When the output would be verbose."}
  ],
  correct:["A"],
  explain:{
    why:"Skills load on invocation; CLAUDE.md loads every session. Always-on standards therefore belong in the instruction file.",
    distractors:{
      B:"Step count is a poor criterion, and a long procedure is a strong argument for a skill rather than against one.",
      C:"Tool restriction is a skill capability, so this argues for a skill.",
      D:"Verbose output argues for a forked skill, again not for CLAUDE.md."
    }
  },
  refs:[R_SKILL] },

{ id:"d3-3.2-k", domain:3, ts:"3.2", scenario:2, type:"single",
  stem:"A developer wants a personal variant of a shared team skill, with different defaults. What is the least disruptive approach?",
  options:[
    {k:"A", text:"A differently named skill in their user directory."},
    {k:"B", text:"An identically named skill in their user directory to shadow the shared one."},
    {k:"C", text:"A parameter added to the shared skill selecting between behaviours."},
    {k:"D", text:"A branch of the repository with the skill modified."}
  ],
  correct:["A"],
  explain:{
    why:"A distinct name in personal configuration gives them the variant with no possibility of affecting teammates and nothing to coordinate.",
    distractors:{
      B:"Shadowing by name is confusing when discussing the skill with colleagues, since the same invocation does different things per machine.",
      C:"Adding a parameter for one person's preference complicates a shared asset everyone must now understand.",
      D:"A long-lived branch for a personal preference is a maintenance burden and drifts from main."
    }
  },
  refs:[R_SKILL] },

{ id:"d3-3.2-l", domain:3, ts:"3.2", scenario:1, type:"single",
  stem:"What does `argument-hint` actually do?",
  options:[
    {k:"A", text:"Shows an autocomplete hint; it does not enforce anything."},
    {k:"B", text:"Rejects invocations that omit the named arguments."},
    {k:"C", text:"Supplies default values when arguments are missing."},
    {k:"D", text:"Validates argument types before the skill runs."}
  ],
  correct:["A"],
  explain:{
    why:"It is display-only, appearing in the slash-command menu to tell the developer what the skill expects. Nothing is parsed or enforced from it.",
    distractors:{
      B:"No rejection occurs; the skill runs with whatever it was given.",
      C:"It supplies no values, only a prompt to the human.",
      D:"There is no type validation associated with the field."
    }
  },
  note:"`argument-hint` is a Claude Code extension rather than part of the base Agent Skills specification, which lists only `allowed-tools`, `compatibility`, `description`, `license`, `metadata` and `name`.",
  refs:[R_SKILL] },

{ id:"d3-3.2-m", domain:3, ts:"3.2", scenario:4, type:"single",
  stem:"A brainstorming skill explores several designs and discards most. Afterwards the main session keeps referring to rejected options. What would prevent this?",
  options:[
    {k:"A", text:"Running it forked, so only the chosen design returns."},
    {k:"B", text:"Instructing the skill to state clearly which options it rejected."},
    {k:"C", text:"Running `/compact` after the skill completes."},
    {k:"D", text:"Restricting the skill's tools so it explores fewer options."}
  ],
  correct:["A"],
  explain:{
    why:"Exploratory reasoning is exactly the kind of output that should not persist. Forking keeps it in the subagent and returns only the conclusion.",
    distractors:{
      B:"Explicit rejections still leave the rejected material in context, where it continues to influence later answers.",
      C:"Compaction shrinks the transcript but keeps a summarised trace of the discarded options.",
      D:"Exploring fewer options makes the brainstorm worse to solve a context problem."
    }
  },
  refs:[R_SKILL] },

{ id:"d3-3.2-n", domain:3, ts:"3.2", scenario:2, type:"single",
  stem:"A team keeps a long deployment runbook in CLAUDE.md. It is used roughly once a fortnight. What is the better home for it?",
  options:[
    {k:"A", text:"A skill, invoked when a deployment is happening."},
    {k:"B", text:"A `.claude/rules/` file with no path scoping."},
    {k:"C", text:"A subdirectory CLAUDE.md under the deployment folder."},
    {k:"D", text:"Left where it is, since deployments are important."}
  ],
  correct:["A"],
  explain:{
    why:"A multi-step procedure needed occasionally is the textbook case for a skill: it loads when invoked and costs nothing on the many sessions that never deploy.",
    distractors:{
      C:"A subdirectory file is better than the root, but it still loads whenever anyone touches that directory for unrelated reasons.",
      B:"An unscoped rule loads every session, which is the cost being avoided.",
      D:"Importance is not the criterion; frequency of relevance is."
    }
  },
  refs:[R_SKILL] },

{ id:"d3-3.2-o", domain:3, ts:"3.2", scenario:3, type:"multi",
  stem:"Which two are genuine effects of `context: fork` on a skill? (Select 2.)",
  options:[
    {k:"A", text:"The skill runs with a fresh context window."},
    {k:"B", text:"Its intermediate output stays out of the main conversation."},
    {k:"C", text:"Its file writes are rolled back when it completes."},
    {k:"D", text:"It gains access to tools the main session lacks."}
  ],
  correct:["A","B"],
  explain:{
    why:"Forking is a context mechanism: the skill executes in an isolated subagent and only its result comes back, which is what keeps verbose work from polluting the session.",
    distractors:{
      C:"Filesystem effects are real and permanent; forking isolates context, not side effects.",
      D:"Tool access comes from configuration and `allowed-tools`, not from where the skill runs."
    }
  },
  refs:[R_SKILL] },

{ id:"d3-3.2-p", domain:3, ts:"3.2", scenario:5, type:"single",
  stem:"A CI pipeline needs a repeatable review procedure with restricted tools. Which mechanism fits best?",
  options:[
    {k:"A", text:"A project skill with `allowed-tools` set."},
    {k:"B", text:"A CLAUDE.md section describing the procedure."},
    {k:"C", text:"A shell script that pipes instructions into the prompt."},
    {k:"D", text:"A user-level command on the CI runner."}
  ],
  correct:["A"],
  explain:{
    why:"A skill packages the procedure with its tool restrictions, is committed with the repository, and can be invoked identically by CI and by developers.",
    distractors:{
      C:"Piping instructions works but loses the tool restriction and duplicates the procedure outside the repository.",
      B:"CLAUDE.md cannot restrict tools and would load the procedure into every session.",
      D:"A runner-local command is invisible to developers and lost when the runner is recreated."
    }
  },
  refs:[R_SKILL] },

{ id:"d3-3.2-q", domain:3, ts:"3.2", scenario:1, type:"single",
  stem:"What distinguishes a skill from a slash command in practice?",
  options:[
    {k:"A", text:"Frontmatter controlling tools, model and execution context."},
    {k:"B", text:"A skill can be invoked by the model; a command cannot."},
    {k:"C", text:"A command is project-scoped; a skill is always personal."},
    {k:"D", text:"A command may take arguments; a skill may not."}
  ],
  correct:["A"],
  explain:{
    why:"The frontmatter is the substantive difference: it lets a skill declare tool restrictions, a model, and whether to run forked.",
    distractors:{
      C:"Both can be project-scoped or personal depending on where the file lives.",
      B:"Both can be invoked by name, and skills can additionally be selected by the model.",
      D:"Both accept arguments."
    }
  },
  refs:[R_SKILL] },

{ id:"d3-3.2-r", domain:3, ts:"3.2", scenario:2, type:"single",
  stem:"A skill's description reads 'Helps with database work.' It is invoked for migrations, query tuning and schema review, performing poorly at all three. What is the fix?",
  options:[
    {k:"A", text:"Split it into three skills with specific descriptions."},
    {k:"B", text:"Expand the single skill to handle all three well."},
    {k:"C", text:"Add `disable-model-invocation` so it is only used deliberately."},
    {k:"D", text:"Restrict its tools to database operations."}
  ],
  correct:["A"],
  explain:{
    why:"Three different procedures under one vague description means the wrong one runs. Separate skills give each a description precise enough to be selected correctly.",
    distractors:{
      B:"One skill covering three procedures is long, and the model still has to work out which part applies.",
      C:"Manual invocation stops accidental selection while leaving the developer to pick among three behaviours in one skill.",
      D:"Tool restriction bounds what it may do without clarifying which job it is doing."
    }
  },
  refs:[R_SKILL] },

{ id:"d3-3.2-s", domain:3, ts:"3.2", scenario:4, type:"single",
  stem:"After adding twelve skills, developers report that unexpected ones activate. What is the most likely cause?",
  options:[
    {k:"A", text:"Overlapping descriptions make the model's choice ambiguous."},
    {k:"B", text:"Skills beyond ten are selected at random."},
    {k:"C", text:"Skills without `argument-hint` default to always-on."},
    {k:"D", text:"Project skills override user skills, changing behaviour."}
  ],
  correct:["A"],
  explain:{
    why:"Skill selection is driven by descriptions in the same way tool selection is. Twelve overlapping descriptions make the choice ambiguous, and the symptom is skills firing when a neighbour was meant.",
    distractors:{
      B:"There is no such threshold or randomisation.",
      C:"The hint is display-only and does not affect activation.",
      D:"Precedence between scopes does not by itself cause unexpected activation."
    }
  },
  refs:[R_SKILL] },

{ id:"d3-3.2-t", domain:3, ts:"3.2", scenario:6, type:"single",
  stem:"Which statement about where skills live is correct?",
  options:[
    {k:"A", text:"`.claude/skills/` is shared; `~/.claude/skills/` is personal."},
    {k:"B", text:"Both locations are personal; skills are never shared."},
    {k:"C", text:"Skills must live in `~/.claude/skills/` and be symlinked into projects."},
    {k:"D", text:"Skills are declared in settings rather than as files."}
  ],
  correct:["A"],
  explain:{
    why:"The project directory is committed and reaches the team; the home directory is private to one machine. That mirrors how commands are scoped.",
    distractors:{
      B:"Project skills are shared, which is much of their value.",
      C:"Project skills live in the repository directly; no symlink is required.",
      D:"Skills are directories containing a SKILL.md, not settings entries."
    }
  },
  refs:[R_SKILL] },

{ id:"d3-3.3-g", domain:3, ts:"3.3", scenario:2, type:"single",
  stem:"A rule in `.claude/rules/` has `paths: [\"src/api/**/*.ts\"]`. When does it load?",
  options:[
    {k:"A", text:"When Claude reads a file matching that pattern."},
    {k:"B", text:"At launch, like every other rule file."},
    {k:"C", text:"When any tool call is made inside `src/api/`."},
    {k:"D", text:"When the user mentions the API in conversation."}
  ],
  correct:["A"],
  explain:{
    why:"Path-scoped rules trigger on reading a matching file, which is what keeps unrelated conventions out of context in sessions that never touch that area.",
    distractors:{
      B:"Only rules without a `paths` field load unconditionally at launch.",
      C:"It is reading a matching file that triggers loading, rather than tool use generally.",
      D:"Loading is driven by file paths, not by conversation topic."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.3-h", domain:3, ts:"3.3", scenario:4, type:"single",
  stem:"You need one rule to cover `.ts`, `.tsx` and `.mts` under `src/`. Which frontmatter is correct?",
  options:[
    {k:"A", text:"`paths: [\"src/**/*.{ts,tsx,mts}\"]`"},
    {k:"B", text:"`paths: \"src/**/*.ts,tsx,mts\"`"},
    {k:"C", text:"`paths: [\"src/**/*.(ts|tsx|mts)\"]`"},
    {k:"D", text:"`paths: [\"src/**/*.ts*\"]`"}
  ],
  correct:["A"],
  explain:{
    why:"Brace expansion is the supported way to match several extensions in one glob, and the field takes a list.",
    distractors:{
      D:"A trailing wildcard would also match unintended extensions such as `.tsbuildinfo`.",
      C:"Parenthesised alternation is regular-expression syntax rather than glob syntax.",
      B:"The field expects a list, and comma-separated extensions in one string is not a glob."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.3-i", domain:3, ts:"3.3", scenario:2, type:"single",
  stem:"Conventions for database migrations need to apply wherever migration files live, and they are scattered across several service directories. Which mechanism fits?",
  options:[
    {k:"A", text:"A path-scoped rule on the migration filename."},
    {k:"B", text:"A CLAUDE.md in each service's migrations folder."},
    {k:"C", text:"A section in the root CLAUDE.md."},
    {k:"D", text:"A skill invoked before writing a migration."}
  ],
  correct:["A"],
  explain:{
    why:"A glob follows the file type wherever it lives, which is exactly the case that directory-bound files handle badly.",
    distractors:{
      B:"One file per service duplicates the same conventions and drifts as services are added.",
      C:"A root section loads in every session regardless of relevance and relies on inference.",
      D:"A skill must be invoked, so a migration written without invoking it gets no conventions."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.3-j", domain:3, ts:"3.3", scenario:4, type:"single",
  stem:"A team notices their `paths` glob starting with `**` is not matching. What is the likely YAML problem?",
  options:[
    {k:"A", text:"It needs quoting in YAML."},
    {k:"B", text:"`**` is unsupported and must be written as `*/*`."},
    {k:"C", text:"Globs must be absolute paths from the repository root."},
    {k:"D", text:"The field must be a string rather than a list."}
  ],
  correct:["A"],
  explain:{
    why:"A YAML scalar beginning with `*` is parsed as an alias, so a pattern starting with `**` has to be quoted to be read as text.",
    distractors:{
      B:"`**` is supported and is what crosses directory levels.",
      C:"Patterns are relative to the project and need not be absolute.",
      D:"The field takes a list of patterns."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.3-k", domain:3, ts:"3.3", scenario:1, type:"single",
  stem:"What is the practical difference between a rule with `paths` and one without?",
  options:[
    {k:"A", text:"Without `paths` it always loads; with it, only on matching reads."},
    {k:"B", text:"Without `paths` it never loads; the field is required."},
    {k:"C", text:"Without `paths` it applies only to the rules directory itself."},
    {k:"D", text:"Without `paths` it is treated as documentation and ignored."}
  ],
  correct:["A"],
  explain:{
    why:"The field is what makes a rule conditional. Omitting it gives an unconditional rule loaded at launch, at the same priority as the project CLAUDE.md.",
    distractors:{
      B:"Absence of the field means always rather than never.",
      C:"Rules are not scoped to their own directory.",
      D:"Unconditional rules are loaded and applied, not ignored."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.3-l", domain:3, ts:"3.3", scenario:4, type:"single",
  stem:"A team wants one shared set of security rules used across several repositories. What does the rules directory support?",
  options:[
    {k:"A", text:"Symlinking a shared directory or file into `.claude/rules/`."},
    {k:"B", text:"An `extends` field referencing a remote rules package."},
    {k:"C", text:"A URL in the `paths` field pointing at shared rules."},
    {k:"D", text:"Nothing; rules must be copied into each repository."}
  ],
  correct:["A"],
  explain:{
    why:"Symlinks are resolved and loaded normally, so a single maintained rules directory can be linked into many projects.",
    distractors:{
      B:"There is no `extends` mechanism for rules.",
      C:"`paths` holds file globs, not URLs.",
      D:"Copying works but is what the symlink support exists to avoid."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.3-m", domain:3, ts:"3.3", scenario:3, type:"single",
  stem:"Which is the strongest argument for path-scoped rules over one large CLAUDE.md?",
  options:[
    {k:"A", text:"Irrelevant conventions never enter context."},
    {k:"B", text:"Rules are enforced, whereas CLAUDE.md is advisory."},
    {k:"C", text:"Rules can restrict which tools are available."},
    {k:"D", text:"Rules survive compaction while CLAUDE.md does not."}
  ],
  correct:["A"],
  explain:{
    why:"Conditional loading is the point. A session that never touches Terraform never pays for the Terraform conventions, leaving more of the window for the work.",
    distractors:{
      B:"Both are context and neither is enforced; a hook is what enforces.",
      D:"Project CLAUDE.md is re-injected after compaction, so this has it backwards.",
      C:"Tool restriction is a skill capability, not a rules one."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.3-n", domain:3, ts:"3.3", scenario:3, type:"single",
  stem:"An unconditional rule and the project CLAUDE.md give conflicting advice. Which takes precedence?",
  options:[
    {k:"A", text:"Neither; they load at equal priority."},
    {k:"B", text:"The rule, since `.claude/rules/` is more specific."},
    {k:"C", text:"CLAUDE.md, since it is the primary instruction file."},
    {k:"D", text:"Whichever file was modified most recently."}
  ],
  correct:["A"],
  explain:{
    why:"Rules without `paths` load at the same priority as the project CLAUDE.md, so a contradiction between them has no defined winner and should be removed at source.",
    distractors:{
      B:"Being in the rules directory does not confer precedence when the rule is unconditional.",
      C:"CLAUDE.md has no special standing over an unconditional rule.",
      D:"Modification time plays no part in instruction precedence."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.3-o", domain:3, ts:"3.3", scenario:6, type:"multi",
  stem:"Which two conventions are best expressed as path-scoped rules? (Select 2.)",
  options:[
    {k:"A", text:"Test file conventions, where tests sit beside the code they cover."},
    {k:"B", text:"Terraform standards, where `.tf` files appear under several services."},
    {k:"C", text:"The project's build and test commands."},
    {k:"D", text:"The team's code review etiquette."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both attach to a file type that appears across many directories, which is precisely where a glob beats a directory-bound file.",
    distractors:{
      C:"Build commands are needed in every session regardless of which files are open, so they belong in CLAUDE.md.",
      D:"Review etiquette is not tied to any file pattern."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.3-p", domain:3, ts:"3.3", scenario:4, type:"single",
  stem:"A rule's `paths` list contains one invalid pattern alongside three valid ones. What happens?",
  options:[
    {k:"A", text:"The invalid pattern matches nothing; the others keep working."},
    {k:"B", text:"The whole rule is skipped."},
    {k:"C", text:"Claude Code fails to start until it is corrected."},
    {k:"D", text:"The invalid pattern is treated as matching everything."}
  ],
  correct:["A"],
  explain:{
    why:"An unparseable pattern simply matches nothing, and the rule's remaining patterns continue to function, so a typo degrades coverage rather than breaking the session.",
    distractors:{
      B:"The rule remains active through its valid patterns.",
      C:"Startup is not blocked by a bad glob.",
      D:"Matching everything would be the dangerous failure mode; it does the opposite."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.3-q", domain:3, ts:"3.3", scenario:5, type:"single",
  stem:"A CI job edits only Terraform files. Which rules load?",
  options:[
    {k:"A", text:"Unconditional rules, plus any whose `paths` match those files."},
    {k:"B", text:"All rules in the directory, since CI loads everything."},
    {k:"C", text:"Only rules whose `paths` match; unconditional ones are skipped."},
    {k:"D", text:"No rules, since CI runs non-interactively."}
  ],
  correct:["A"],
  explain:{
    why:"Unconditional rules always load, and path-scoped ones load when a matching file is read. CI behaves the same way as an interactive session in this respect.",
    distractors:{
      C:"Unconditional rules are not skipped; absence of `paths` means always.",
      B:"Rules for unrelated file types do not load just because the run is automated.",
      D:"Non-interactive mode does not disable rule loading."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.3-r", domain:3, ts:"3.3", scenario:2, type:"single",
  stem:"A developer puts a rules file in `~/.claude/rules/` expecting the team to get it. What is wrong?",
  options:[
    {k:"A", text:"User-level rules are personal and are not shared."},
    {k:"B", text:"User-level rules are unsupported and never load."},
    {k:"C", text:"User-level rules load only in projects without their own rules."},
    {k:"D", text:"User-level rules require a matching project rule to activate."}
  ],
  correct:["A"],
  explain:{
    why:"Rules in the home directory apply to every project on that machine and are never committed, so nobody else receives them.",
    distractors:{
      B:"They are supported and load before project rules.",
      C:"They load regardless of what the project defines.",
      D:"No pairing with a project rule is needed."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.3-s", domain:3, ts:"3.3", scenario:4, type:"single",
  stem:"Why might a path-scoped rule be preferable to a subdirectory CLAUDE.md even when the files are all in one directory today?",
  options:[
    {k:"A", text:"The rule keeps working when the files move or spread."},
    {k:"B", text:"Rules load faster than CLAUDE.md files."},
    {k:"C", text:"Rules can be excluded per developer; CLAUDE.md cannot."},
    {k:"D", text:"Rules take precedence over any CLAUDE.md."}
  ],
  correct:["A"],
  explain:{
    why:"A pattern follows the file type, so reorganising directories or adding a second location does not silently drop the conventions.",
    distractors:{
      B:"Load performance is not a meaningful difference between them.",
      C:"Both can be excluded through settings.",
      D:"An unconditional rule sits at the same priority as the project CLAUDE.md rather than above it."
    }
  },
  refs:[R_MEM] },

{ id:"d3-3.3-t", domain:3, ts:"3.3", scenario:6, type:"single",
  stem:"A team asks whether to use `.claude/rules/` or skills for their per-language style guides. Which consideration decides it?",
  options:[
    {k:"A", text:"Whether it should apply automatically or on request."},
    {k:"B", text:"Whether the guidance exceeds 200 lines."},
    {k:"C", text:"Whether the languages are compiled or interpreted."},
    {k:"D", text:"Whether the team uses a monorepo."}
  ],
  correct:["A"],
  explain:{
    why:"Rules load by themselves when a matching file is touched; skills wait to be invoked. Style guides should apply whenever the file type is being edited, which points to rules.",
    distractors:{
      B:"Length affects how you organise the content rather than which mechanism applies it.",
      C:"Language implementation has no bearing on the loading mechanism.",
      D:"Repository layout matters for path patterns but does not decide between the two."
    }
  },
  refs:[R_MEM] },
