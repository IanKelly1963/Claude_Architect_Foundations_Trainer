
/* ---- Domain 2 expansion: task statements 2.3, 2.4 and 2.5 ---- */

{ id:"d2-2.3-g", domain:2, ts:"2.3", scenario:3, type:"single",
  stem:"A synthesis agent holds 14 tools, of which it uses 3 regularly. Selection errors cluster on the 11 it rarely needs. What is the most direct improvement?",
  options:[
    {k:"A", text:"Remove the rarely used tools from its definition."},
    {k:"B", text:"Improve the descriptions of the 11 so they are chosen more accurately when needed."},
    {k:"C", text:"Add a system prompt listing the three tools it should normally prefer."},
    {k:"D", text:"Split the agent into two, each holding seven tools."}
  ],
  correct:["A"],
  explain:{
    why:"Every additional option makes discrimination harder, and eleven near-unused tools are pure decision cost. Scoping to the three the role needs removes the errors at source.",
    distractors:{
      B:"Better descriptions would help if those tools were genuinely needed, but they are not, so you would be paying tokens to improve rarely-correct choices.",
      C:"A preference hint biases selection without removing the eleven distractors from consideration.",
      D:"Splitting halves the menu but creates a second agent and a routing decision, which is a lot of structure for a scoping problem."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.3-h", domain:2, ts:"2.3", scenario:6, type:"single",
  stem:"You need the model to call `extract_metadata` first, then decide freely among enrichment tools on later turns. Which configuration achieves this?",
  options:[
    {k:"A", text:"Force that tool on the first request, then switch to `auto`."},
    {k:"B", text:"Set `any` on every request so a tool is always called."},
    {k:"C", text:"List `extract_metadata` first and use `auto` throughout."},
    {k:"D", text:"Use `auto` with a system prompt instruction about ordering."}
  ],
  correct:["A"],
  explain:{
    why:"Forced selection guarantees the first call, and relaxing afterwards restores the model's judgement for the enrichment steps. The constraint applies exactly where it is needed.",
    distractors:{
      B:"`any` guarantees some call but not which one, so an enrichment tool could still go first.",
      C:"Array order does not determine call order, so this leaves the first step to chance.",
      D:"A prompt instruction is followed most of the time, which is not a guarantee when a later step depends on it."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.3-i", domain:2, ts:"2.3", scenario:1, type:"single",
  stem:"Your support agent sometimes replies conversationally when it should have looked something up. Which `tool_choice` setting removes that possibility?",
  options:[
    {k:"A", text:"`any`"},
    {k:"B", text:"`auto`"},
    {k:"C", text:"`none`"},
    {k:"D", text:"`{type: 'tool', name: 'get_customer'}`"}
  ],
  correct:["A"],
  explain:{
    why:"`any` requires that some tool be called while leaving the choice open, which is what you want when a lookup is definitely needed but the right one depends on the request.",
    distractors:{
      B:"`auto` is what permits the text-only reply you are trying to eliminate.",
      C:"`none` forbids tools entirely, which is the opposite of the requirement.",
      D:"Forcing one named tool guarantees a call but sends every request to `get_customer`, including ones needing a different lookup."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.3-j", domain:2, ts:"2.3", scenario:1, type:"single",
  stem:"A code agent has both `bash` and a set of narrow tools for reading, writing and searching. It uses `bash` for almost everything. What is the concern?",
  options:[
    {k:"A", text:"A general tool absorbs the work the specific ones were scoped for."},
    {k:"B", text:"`bash` is slower than the narrow tools for equivalent operations."},
    {k:"C", text:"Narrow tools stop being offered once `bash` is present."},
    {k:"D", text:"`bash` output cannot be returned in a `tool_result` block."}
  ],
  correct:["A"],
  explain:{
    why:"A tool that can do anything will be chosen for everything, which discards the guarantees the narrow tools were built to provide, such as validated paths and bounded effects.",
    distractors:{
      B:"Performance is broadly comparable and would not be the architectural objection.",
      C:"All configured tools remain available; the model is simply preferring one.",
      D:"`bash` output is returned like any other tool result."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.3-k", domain:2, ts:"2.3", scenario:3, type:"single",
  stem:"A synthesis agent needs occasional fact verification. Giving it the full research toolset was rejected. Which alternative preserves separation of concerns?",
  options:[
    {k:"A", text:"A single narrow `verify_fact` tool for simple lookups."},
    {k:"B", text:"Permission to invoke the research subagent directly when needed."},
    {k:"C", text:"A cache of everything the research agent retrieved earlier."},
    {k:"D", text:"An instruction to flag unverified claims for the coordinator to check."}
  ],
  correct:["A"],
  explain:{
    why:"One scoped capability covers the common case without turning the synthesis agent into a researcher. The wider toolset stays where it belongs.",
    distractors:{
      B:"Direct peer invocation removes the coordinator's oversight, which is the property hub-and-spoke exists to preserve.",
      C:"A cache only helps if the needed fact happens to be in it, which cannot be predicted in advance.",
      D:"Flagging works but adds a full round trip for every simple date or name check."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.3-l", domain:2, ts:"2.3", scenario:6, type:"single",
  stem:"Several extraction schemas exist and the document type is unknown until the model reads it. Which setting produces structured output without pre-classifying?",
  options:[
    {k:"A", text:"`any`, letting the model pick the schema it judges correct."},
    {k:"B", text:"Forcing the most common schema and correcting mismatches downstream."},
    {k:"C", text:"`auto`, with a prompt instruction to always call an extraction tool."},
    {k:"D", text:"A classification call first, then a forced call to the matching schema."}
  ],
  correct:["A"],
  explain:{
    why:"`any` guarantees a schema-conformant result while leaving the type decision to the model, which is reading the document anyway. One call, no classification step.",
    distractors:{
      D:"Classifying first is a defensible two-step design, but it costs an extra round trip to make a decision the extraction call can make itself.",
      B:"Forcing one schema misclassifies every document that is not that type, and downstream correction cannot recover fields the wrong schema never captured.",
      C:"`auto` permits a text reply, so the guarantee is lost."
    }
  },
  refs:[R_STRUCT] },

{ id:"d2-2.3-m", domain:2, ts:"2.3", scenario:5, type:"single",
  stem:"A CI agent has read-only tools plus `post_comment`. You want it to analyse without commenting during a dry run. What is the cleanest control?",
  options:[
    {k:"A", text:"Omit `post_comment` from the tool set for that run."},
    {k:"B", text:"Keep the tool and set `tool_choice: 'none'` for the run."},
    {k:"C", text:"Keep the tool and instruct the agent not to use it."},
    {k:"D", text:"Keep the tool and discard its output after the run."}
  ],
  correct:["A"],
  explain:{
    why:"A capability that is absent cannot be misused, and the agent's remaining tools still let it do the analysis. Nothing depends on the model's compliance.",
    distractors:{
      B:"`none` blocks every tool, so the analysis cannot run either.",
      C:"An instruction is probabilistic, and a stray comment on a real pull request is visible to the team.",
      D:"Discarding output afterwards does not un-post a comment that has already been created."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.3-n", domain:2, ts:"2.3", scenario:1, type:"single",
  stem:"Which statement about `tool_choice: 'auto'` is correct?",
  options:[
    {k:"A", text:"The model may answer with text instead of calling any tool."},
    {k:"B", text:"The model must call a tool, but may choose which."},
    {k:"C", text:"The model calls tools in the order they are declared."},
    {k:"D", text:"The model may call at most one tool per turn."}
  ],
  correct:["A"],
  explain:{
    why:"`auto` leaves the decision entirely to the model, including the decision not to use a tool at all. That flexibility is useful in conversation and a liability when output must be structured.",
    distractors:{
      B:"That describes `any`, which is the setting that removes the text-only option.",
      C:"Declaration order does not constrain call order under any setting.",
      D:"Multiple tool calls in a single turn are permitted and common."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.3-o", domain:2, ts:"2.3", scenario:1, type:"single",
  stem:"An agent is given `delete_file` for cleanup tasks that occur in roughly 1% of runs. What is the risk-weighted argument against including it by default?",
  options:[
    {k:"A", text:"A rare need does not justify permanent destructive capability."},
    {k:"B", text:"An unused tool measurably slows every request."},
    {k:"C", text:"Deletion tools are unsupported over MCP."},
    {k:"D", text:"The tool would never be selected, making it dead weight."}
  ],
  correct:["A"],
  explain:{
    why:"The cost of a wrong deletion is high and irreversible, while the benefit arrives in one run out of a hundred. Provisioning it on demand keeps the capability without carrying the risk continuously.",
    distractors:{
      D:"It would be selected occasionally, which is precisely the exposure; a tool that never fired would be harmless.",
      B:"One extra definition has a negligible effect on latency, and cost is not the main objection.",
      C:"Deletion tools work over MCP like any other."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.3-p", domain:2, ts:"2.3", scenario:3, type:"single",
  stem:"After scoping each subagent's tools tightly, one subagent begins failing on a legitimate task it can no longer perform. What is the right response?",
  options:[
    {k:"A", text:"Add back the one tool that task needs, not the whole original set."},
    {k:"B", text:"Restore the original toolset, since scoping caused a regression."},
    {k:"C", text:"Route that task to a different subagent that retains the tool."},
    {k:"D", text:"Accept the failure, since the task falls outside the agent's new scope."}
  ],
  correct:["A"],
  explain:{
    why:"Scoping is meant to be tightened iteratively. A single genuine gap is evidence about one tool, not evidence that the whole restriction was wrong.",
    distractors:{
      C:"Rerouting is reasonable if the task genuinely belongs elsewhere, but here it belongs to this agent and only the capability is missing.",
      B:"Restoring everything discards the selection-reliability gains that motivated the change.",
      D:"The task is legitimate work for this agent, so accepting failure is not an option."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.3-q", domain:2, ts:"2.3", scenario:5, type:"multi",
  stem:"Which two are sound reasons to replace a broad tool with a narrower one? (Select 2.)",
  options:[
    {k:"A", text:"The narrow tool can validate its inputs against the intended use."},
    {k:"B", text:"A narrower description gives the model a clearer selection boundary."},
    {k:"C", text:"Narrow tools execute faster than general-purpose ones."},
    {k:"D", text:"Narrow tools are exempt from the agent's tool-count limits."}
  ],
  correct:["A","B"],
  explain:{
    why:"Constraining the contract lets the tool reject misuse at the boundary, and a specific description makes it clearer when the tool applies. Both improve reliability.",
    distractors:{
      C:"Execution speed depends on the work, not the breadth of the interface.",
      D:"There is no such exemption; every tool counts toward the selection burden."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.3-r", domain:2, ts:"2.3", scenario:1, type:"single",
  stem:"A team sets `tool_choice: 'any'` permanently to stop the agent chatting instead of acting. Customers now receive tool output with no explanation. What was overlooked?",
  options:[
    {k:"A", text:"The agent also needs turns where it explains rather than acts."},
    {k:"B", text:"`any` disables the model's ability to format its output."},
    {k:"C", text:"`any` prevents more than one tool call per conversation."},
    {k:"D", text:"`any` applies only to the first request in a conversation."}
  ],
  correct:["A"],
  explain:{
    why:"Forcing a call on every turn removes the model's ability to speak to the customer at all. The setting suits a request where structured output is required, not a whole conversation.",
    distractors:{
      B:"Formatting is unaffected; the model simply never gets a turn in which to write prose.",
      C:"Multiple calls remain possible; the constraint is that every turn must contain at least one.",
      D:"It applies to whichever requests carry it, which here is all of them."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.3-s", domain:2, ts:"2.3", scenario:3, type:"single",
  stem:"An agent with 5 tools is merged with another that has 6, and selection accuracy drops from 94% to 78%. What is the most likely cause?",
  options:[
    {k:"A", text:"Eleven options is a harder discrimination than five."},
    {k:"B", text:"The merged definitions exceeded the maximum payload size."},
    {k:"C", text:"Tool names collided and one set silently overwrote the other."},
    {k:"D", text:"Merged agents lose access to their original system prompts."}
  ],
  correct:["A"],
  explain:{
    why:"Selection reliability falls as the menu grows, particularly when the added tools have adjacent purposes. The merge doubled the decision space without changing any individual description.",
    distractors:{
      C:"A name collision is worth checking and would be a real bug, but it would produce missing tools rather than a broad accuracy decline.",
      B:"Eleven tool definitions is far below any payload limit.",
      D:"System prompts are carried explicitly and are not lost by combining tool sets."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.3-t", domain:2, ts:"2.3", scenario:5, type:"single",
  stem:"You want a CI agent to always produce a structured findings object, never prose. Which combination is correct?",
  options:[
    {k:"A", text:"Force the findings tool by name for that request."},
    {k:"B", text:"Use `auto` and validate the response, retrying on prose."},
    {k:"C", text:"Use `none` and parse the structure out of the text."},
    {k:"D", text:"Use `any` with only that one tool defined, plus a prose fallback tool."}
  ],
  correct:["A"],
  explain:{
    why:"When exactly one shape of output is acceptable, naming the tool removes every other possibility in a single step.",
    distractors:{
      D:"`any` with one tool would work, but adding a prose fallback reintroduces the outcome you are trying to forbid.",
      B:"Retrying on prose wastes calls to eliminate an outcome the setting could have prevented outright.",
      C:"`none` forbids tools, returning you to parsing free text."
    }
  },
  refs:[R_STRUCT] },

{ id:"d2-2.4-g", domain:2, ts:"2.4", scenario:4, type:"single",
  stem:"A teammate clones the repository and the project's MCP server does not appear. `.mcp.json` is committed and correct. What is the most likely explanation?",
  options:[
    {k:"A", text:"They have not yet approved the project-scoped server."},
    {k:"B", text:"Project-scoped servers require a matching entry in their user configuration."},
    {k:"C", text:"`.mcp.json` is ignored unless the repository is a git worktree root."},
    {k:"D", text:"The server must be re-added with `claude mcp add` on every machine."}
  ],
  correct:["A"],
  explain:{
    why:"Servers defined in a committed file run code from the repository, so Claude Code asks for approval before using them. Until that happens they show as pending rather than active.",
    distractors:{
      B:"No user-side entry is needed; that would defeat the purpose of sharing through the project file.",
      C:"The file is read from the project root without any worktree condition.",
      D:"Re-adding would work but is unnecessary, and it is the approval step that is actually outstanding."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.4-h", domain:2, ts:"2.4", scenario:2, type:"single",
  stem:"You want an MCP server available in every project on your own machine, and shared with nobody. Which scope fits?",
  options:[
    {k:"A", text:"User scope."},
    {k:"B", text:"Project scope."},
    {k:"C", text:"Local scope."},
    {k:"D", text:"Managed configuration."}
  ],
  correct:["A"],
  explain:{
    why:"User scope stores the server in your own configuration and makes it available across all your projects, which is exactly the combination described.",
    distractors:{
      C:"Local scope is also private but binds the server to a single project, so it would not appear in the others.",
      B:"Project scope shares the server with everyone through version control.",
      D:"Managed configuration is deployed by an administrator across an organisation."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.4-i", domain:2, ts:"2.4", scenario:4, type:"single",
  stem:"The same MCP server name is defined at local, project and user scope with different endpoints. Which definition is used?",
  options:[
    {k:"A", text:"Local, which takes precedence over project and user."},
    {k:"B", text:"Project, since committed configuration is authoritative."},
    {k:"C", text:"User, since it is the broadest scope."},
    {k:"D", text:"All three connect, and the agent sees three tool sets."}
  ],
  correct:["A"],
  explain:{
    why:"Precedence runs local, then project, then user, and the whole entry from the winning scope is used rather than fields being merged.",
    distractors:{
      B:"Project sits below local, so a local definition of the same name overrides it.",
      C:"Breadth of availability does not confer precedence; user scope is last.",
      D:"Duplicate names resolve to a single connection rather than several."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.4-j", domain:2, ts:"2.4", scenario:4, type:"single",
  stem:"In `.mcp.json` you write `\"command\": \"${TOOL_HOME}/server\"`. On a machine where `TOOL_HOME` is unset, what happens?",
  options:[
    {k:"A", text:"The literal text is used unexpanded and a warning is reported."},
    {k:"B", text:"Claude Code refuses to start until the variable is defined."},
    {k:"C", text:"The variable expands to an empty string and the path becomes relative."},
    {k:"D", text:"The server entry is skipped silently and omitted from the list."}
  ],
  correct:["A"],
  explain:{
    why:"An unset variable with no default leaves the placeholder in place and surfaces a missing-variable warning, which is why supplying a `:-default` is the safer form.",
    distractors:{
      C:"Empty expansion would be a plausible design but is not what happens; the text is left as-is.",
      B:"Startup is not blocked by a single unresolvable server entry.",
      D:"The entry appears with a warning rather than disappearing."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.4-k", domain:2, ts:"2.4", scenario:2, type:"single",
  stem:"Your team's `.mcp.json` needs an API token. Which approach shares the configuration without committing the secret?",
  options:[
    {k:"A", text:"Reference it as `${API_TOKEN}` and have each developer set the variable."},
    {k:"B", text:"Commit the token and rotate it whenever someone leaves the team."},
    {k:"C", text:"Add `.mcp.json` to `.gitignore` and share it over chat."},
    {k:"D", text:"Store the token in `CLAUDE.md`, which is documentation rather than code."}
  ],
  correct:["A"],
  explain:{
    why:"Expansion keeps the shape of the configuration in the repository while the value stays on each machine, which is what makes the file safe to commit.",
    distractors:{
      B:"Rotation limits the damage window but the secret is still in history for anyone with repository access.",
      C:"Gitignoring the file removes the sharing that project scope exists to provide, and chat is not a secret store.",
      D:"CLAUDE.md is committed like any other file, so the token would be just as exposed."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.4-l", domain:2, ts:"2.4", scenario:3, type:"single",
  stem:"A research agent makes 8 exploratory calls to discover which datasets exist before doing any real work. Which MCP capability removes that overhead?",
  options:[
    {k:"A", text:"Resources, which expose the catalogue directly."},
    {k:"B", text:"Prompts, which supply reusable templates."},
    {k:"C", text:"A larger tool output limit."},
    {k:"D", text:"Server-side caching of discovery calls."}
  ],
  correct:["A"],
  explain:{
    why:"Resources exist to publish a content catalogue, so the agent can see what is available without probing for it call by call.",
    distractors:{
      B:"Prompts are reusable instruction templates and carry no data catalogue.",
      C:"A larger limit makes each discovery call return more, which does not remove the need to discover.",
      D:"Caching speeds up repeat discovery while the first pass still costs eight calls."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.4-m", domain:2, ts:"2.4", scenario:1, type:"single",
  stem:"Your team needs Jira integration. A maintained community MCP server exists and covers your workflow. What is the recommended approach?",
  options:[
    {k:"A", text:"Adopt it, and build custom servers only for team-specific workflows."},
    {k:"B", text:"Fork it immediately so you control the release cadence."},
    {k:"C", text:"Build your own, since third-party servers cannot be reviewed."},
    {k:"D", text:"Adopt it but wrap every tool in a proxy with your own descriptions."}
  ],
  correct:["A"],
  explain:{
    why:"Standard integrations are commodity work. Effort is better spent on what is specific to your team, which no community server will ever cover.",
    distractors:{
      B:"Forking is a reasonable hedge if the upstream is unreliable, but it takes on maintenance you have no reason to carry yet.",
      C:"Third-party servers can be read and reviewed like any dependency.",
      D:"A full proxy layer is most of the cost of a custom server plus an extra indirection."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.4-n", domain:2, ts:"2.4", scenario:2, type:"single",
  stem:"An experimental MCP server you added is now interfering with a colleague's session on a shared machine account. Where did you most likely put it?",
  options:[
    {k:"A", text:"User scope, which applies to every project for that account."},
    {k:"B", text:"Local scope, which is bound to a single project."},
    {k:"C", text:"Project scope, which is committed to the repository."},
    {k:"D", text:"Managed configuration, which is deployed organisation-wide."}
  ],
  correct:["A"],
  explain:{
    why:"User scope spans every project for that account, so on a shared account it reaches work you never intended it to touch. Local scope would have confined it.",
    distractors:{
      B:"Local scope binds to one project and would not have appeared elsewhere.",
      C:"Project scope would show up for anyone cloning the repository, but the symptom described is across projects rather than across people.",
      D:"Managed configuration requires administrator deployment, not an individual adding an experiment."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.4-o", domain:2, ts:"2.4", scenario:3, type:"single",
  stem:"When are the tools from a configured MCP server made available to the agent?",
  options:[
    {k:"A", text:"At connection time, alongside every other configured server."},
    {k:"B", text:"On first use, when the agent names a tool from that server."},
    {k:"C", text:"Only after the built-in tools have failed to satisfy the request."},
    {k:"D", text:"At the start of each turn, refreshed from the server."}
  ],
  correct:["A"],
  explain:{
    why:"Capabilities are discovered when the connection is established, so the agent sees the combined tool set from all configured servers at once. That is also why adding servers freely degrades selection.",
    distractors:{
      B:"The agent cannot name a tool it has not been told about, so lazy discovery by name is not possible.",
      C:"There is no fallback tier; built-in and MCP tools compete on equal footing.",
      D:"Servers can notify of changes, but the tool list is not re-fetched every turn as a matter of course."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.4-p", domain:2, ts:"2.4", scenario:3, type:"single",
  stem:"Adding three MCP servers takes the agent from 6 tools to 24, and it starts choosing poorly. What is the appropriate response?",
  options:[
    {k:"A", text:"Configure only the servers each agent role actually needs."},
    {k:"B", text:"Keep all three and improve every tool description."},
    {k:"C", text:"Keep all three and add a system prompt listing preferred tools."},
    {k:"D", text:"Keep all three but disconnect two at the start of each session."}
  ],
  correct:["A"],
  explain:{
    why:"Server configuration is where the tool count is decided. Matching servers to roles keeps each agent's menu short, which is the property that governs selection reliability.",
    distractors:{
      B:"Better descriptions help at the margin but cannot undo the difficulty of choosing among 24 options.",
      C:"A preference list biases the choice without shrinking the space being chosen from.",
      D:"Manual disconnection achieves the same end far less reliably than configuring scope correctly."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.4-q", domain:2, ts:"2.4", scenario:2, type:"multi",
  stem:"Which two statements about MCP configuration scopes are correct? (Select 2.)",
  options:[
    {k:"A", text:"Project scope is shared with the team through version control."},
    {k:"B", text:"User scope makes a server available across all of that user's projects."},
    {k:"C", text:"Local scope is shared with the team but only for the current project."},
    {k:"D", text:"Project scope takes precedence over local scope for duplicate names."}
  ],
  correct:["A","B"],
  explain:{
    why:"Project scope exists to be committed and shared, and user scope makes a private server available everywhere for that account. Those are the two axes that distinguish the scopes.",
    distractors:{
      C:"Local scope is private to you, not shared, though it is indeed limited to one project.",
      D:"Precedence runs local first, so local wins over project rather than the reverse."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.4-r", domain:2, ts:"2.4", scenario:5, type:"single",
  stem:"An MCP tool returns a 60,000-token document and the agent's context is exhausted. Which response addresses the cause rather than the symptom?",
  options:[
    {k:"A", text:"Return an excerpt with a handle for fetching the rest."},
    {k:"B", text:"Raise the maximum MCP output limit to accommodate it."},
    {k:"C", text:"Switch to a model with a larger context window."},
    {k:"D", text:"Call the tool less often."}
  ],
  correct:["A"],
  explain:{
    why:"The tool is returning far more than any single decision needs. Returning a relevant excerpt with a way to retrieve the rest keeps the interface useful without flooding the context.",
    distractors:{
      B:"Raising the cap permits the flood rather than preventing it.",
      C:"A larger window delays exhaustion while every call still wastes most of what it returns.",
      D:"Fewer calls means less work done, and one call can still exhaust the window."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.4-s", domain:2, ts:"2.4", scenario:4, type:"single",
  stem:"A `.mcp.json` entry uses `${API_URL:-https://api.example.com}`. What does the `:-` provide?",
  options:[
    {k:"A", text:"A fallback used when the variable is unset."},
    {k:"B", text:"A validation pattern the variable must match."},
    {k:"C", text:"A comment marking the intended value for readers."},
    {k:"D", text:"An override that takes priority over the environment."}
  ],
  correct:["A"],
  explain:{
    why:"The default form supplies a value when the variable is absent, so the server starts sensibly on a machine that has not set it rather than leaving an unexpanded placeholder.",
    distractors:{
      D:"It is the opposite of an override: the environment wins when the variable is set.",
      B:"No validation is performed on the expanded value.",
      C:"It is functional rather than documentary, and does affect what the server receives."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.4-t", domain:2, ts:"2.4", scenario:5, type:"single",
  stem:"A CI pipeline needs an MCP server, but interactive approval of project-scoped servers cannot happen in an automated run. What is the appropriate handling?",
  options:[
    {k:"A", text:"Pre-approve the server in the CI environment's configuration."},
    {k:"B", text:"Move the server to user scope, which needs no approval."},
    {k:"C", text:"Run the pipeline interactively once so approval persists."},
    {k:"D", text:"Remove the approval requirement globally for all projects."}
  ],
  correct:["A"],
  explain:{
    why:"The approval exists because committed configuration can run code. Recording the decision in the CI environment's own settings keeps that control explicit while letting the run proceed unattended.",
    distractors:{
      B:"Relocating scope to dodge the check also stops the server being shared with the team, which was the reason for project scope.",
      C:"CI environments are typically ephemeral, so an interactive approval would not survive to the next run.",
      D:"Disabling the check everywhere removes a safeguard from every project to solve one pipeline's problem."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.5-g", domain:2, ts:"2.5", scenario:4, type:"single",
  stem:"You need every file that imports `parseConfig`, across a repository with mixed naming conventions. Which approach is correct?",
  options:[
    {k:"A", text:"Grep for the symbol across the repository."},
    {k:"B", text:"Glob for files whose names contain `config`."},
    {k:"C", text:"Read the package manifest to find dependent modules."},
    {k:"D", text:"Glob for all source files, then Read each one."}
  ],
  correct:["A"],
  explain:{
    why:"Imports are content, and content search is what Grep does. Filenames tell you nothing about which files reference the symbol.",
    distractors:{
      B:"Files importing `parseConfig` need not be named anything like it, so this both misses and over-matches.",
      C:"A manifest describes package dependencies rather than which files use a particular symbol.",
      D:"Reading everything would find them but at enormous context cost for a question Grep answers directly."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.5-h", domain:2, ts:"2.5", scenario:4, type:"single",
  stem:"An Edit call fails with a report that the anchor text appears three times. What is the reliable next step?",
  options:[
    {k:"A", text:"Read the file, then Write it back with the change applied."},
    {k:"B", text:"Retry the Edit, since matching is sometimes non-deterministic."},
    {k:"C", text:"Edit each occurrence in turn until the right one changes."},
    {k:"D", text:"Delete the file and recreate it from the intended content."}
  ],
  correct:["A"],
  explain:{
    why:"Edit needs a unique anchor. When uniqueness cannot be achieved, reading the exact current content and writing back the intended result is the documented fallback and is fully deterministic.",
    distractors:{
      C:"Expanding the anchor with surrounding context to make it unique is a legitimate alternative, but blindly editing occurrences in turn risks changing the wrong one.",
      B:"The failure is deterministic; the anchor is still ambiguous on a retry.",
      D:"Recreating from memory risks losing content that was never read into context."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.5-i", domain:2, ts:"2.5", scenario:4, type:"single",
  stem:"You want every Terraform file under `infra/`, including nested modules. Which is correct?",
  options:[
    {k:"A", text:"Glob with `infra/**/*.tf`."},
    {k:"B", text:"Grep for `resource \"` under `infra/`."},
    {k:"C", text:"Glob with `infra/*.tf`."},
    {k:"D", text:"Read `infra/` and enumerate its entries."}
  ],
  correct:["A"],
  explain:{
    why:"This is a path pattern, and `**` is what crosses directory levels, so nested modules are included.",
    distractors:{
      C:"A single `*` matches only the immediate directory, so nested modules are missed.",
      B:"Searching content finds files containing that string, which excludes variable and output files and includes anything quoting it.",
      D:"Reading a directory does not recurse, and enumeration is what Glob already does."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.5-j", domain:2, ts:"2.5", scenario:4, type:"single",
  stem:"An agent must understand how a 2,000-file service handles rate limiting. What is the efficient opening move?",
  options:[
    {k:"A", text:"Grep for rate-limit terms to find entry points."},
    {k:"B", text:"Read the ten largest files, which likely contain core logic."},
    {k:"C", text:"Glob every source file and read them in dependency order."},
    {k:"D", text:"Read the README and stop there."}
  ],
  correct:["A"],
  explain:{
    why:"Content search narrows two thousand files to the handful that mention the concept, and those become the starting points for targeted reading.",
    distractors:{
      B:"File size correlates poorly with relevance, and large files are often generated or vendored.",
      C:"Reading everything exhausts context long before the answer emerges.",
      D:"A README gives useful orientation but rarely documents implementation detail at this level."
    }
  },
  refs:[R_CTX] },

{ id:"d2-2.5-k", domain:2, ts:"2.5", scenario:4, type:"single",
  stem:"A utility is exported under three different names through wrapper modules. Searching the original name finds only its definition. What is the correct approach?",
  options:[
    {k:"A", text:"Find every name it is re-exported under, then search each."},
    {k:"B", text:"Search case-insensitively to catch renamed variants."},
    {k:"C", text:"Search for the file path, since imports reference paths."},
    {k:"D", text:"Read every file that imports from the wrapper directory."}
  ],
  correct:["A"],
  explain:{
    why:"Re-exports rebind the symbol, so callers reference a name the first search never looked for. Enumerating the aliases and searching each follows the actual chain.",
    distractors:{
      C:"Callers usually import from the wrapper path rather than the original, so path search misses the usages you want.",
      B:"Case-insensitivity catches capitalisation differences, not genuinely different identifiers.",
      D:"Importing from that directory does not imply using this particular utility."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.5-l", domain:2, ts:"2.5", scenario:2, type:"single",
  stem:"Which pairing is correct?",
  options:[
    {k:"A", text:"Grep searches contents; Glob matches paths."},
    {k:"B", text:"Grep matches paths; Glob searches contents."},
    {k:"C", text:"Both search contents, differing in regular expression support."},
    {k:"D", text:"Both match paths, differing in recursion depth."}
  ],
  correct:["A"],
  explain:{
    why:"This is the core distinction: one looks inside files, the other at their names and locations.",
    distractors:{
      B:"Exactly inverted, and a common source of wasted calls.",
      C:"Glob has no visibility into file contents whatever pattern it is given.",
      D:"Grep is not a path matcher, so this misdescribes both."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.5-m", domain:2, ts:"2.5", scenario:4, type:"single",
  stem:"An agent reads 40 files before answering a question that turned out to involve 3. What practice would have avoided this?",
  options:[
    {k:"A", text:"Search first, then read only what the search implicates."},
    {k:"B", text:"Read files in alphabetical order and stop when confident."},
    {k:"C", text:"Read only files modified in the last month."},
    {k:"D", text:"Read every file but summarise each to one line."}
  ],
  correct:["A"],
  explain:{
    why:"Search is cheap and narrows the field; reading is expensive and should be reserved for candidates the search has already implicated.",
    distractors:{
      C:"Recency is a weak proxy for relevance and would miss stable code that is central to the question.",
      B:"Alphabetical order bears no relation to relevance, so the stopping point is arbitrary.",
      D:"Summarising still requires reading all 40 files, so the cost is already paid."
    }
  },
  refs:[R_CTX] },

{ id:"d2-2.5-n", domain:2, ts:"2.5", scenario:1, type:"single",
  stem:"When is Write the appropriate tool rather than Edit?",
  options:[
    {k:"A", text:"When creating a file, or when no unique anchor exists."},
    {k:"B", text:"When the change affects more than ten lines."},
    {k:"C", text:"When the file is larger than the context window."},
    {k:"D", text:"When the file has been modified since it was last read."}
  ],
  correct:["A"],
  explain:{
    why:"Write is for producing whole file contents, which is what a new file needs and what an ambiguous anchor forces you back to.",
    distractors:{
      B:"Edit handles multi-line changes perfectly well as long as the anchor is unique.",
      C:"A file too large to hold in context is a poor Write candidate, since you must supply its full contents.",
      D:"External modification calls for re-reading before either tool is used."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.5-o", domain:2, ts:"2.5", scenario:4, type:"single",
  stem:"A search for `handleError` returns 340 matches across the repository. What is the most useful refinement?",
  options:[
    {k:"A", text:"Restrict the search to the relevant directories."},
    {k:"B", text:"Read the first 20 matches and generalise from them."},
    {k:"C", text:"Search for a shorter substring to widen recall."},
    {k:"D", text:"Switch to Glob to find files named after the handler."}
  ],
  correct:["A"],
  explain:{
    why:"Scoping by path cuts a common identifier down to the occurrences that bear on the question, without discarding matches arbitrarily.",
    distractors:{
      B:"The first twenty are ordered by location rather than relevance, so generalising from them is unsound.",
      C:"Widening recall makes an already unmanageable result set larger.",
      D:"Filenames rarely correspond to the functions they contain."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.5-p", domain:2, ts:"2.5", scenario:2, type:"single",
  stem:"An agent needs to confirm a config value is not overridden anywhere. Which combination is soundest?",
  options:[
    {k:"A", text:"Grep for the key across all config formats, then read the hits."},
    {k:"B", text:"Read the primary config file and trust its documented defaults."},
    {k:"C", text:"Glob for files named `config.*` and read each one."},
    {k:"D", text:"Search only the environment files, where overrides normally live."}
  ],
  correct:["A"],
  explain:{
    why:"Proving absence requires searching everywhere the key could appear, then examining each hit in context to see whether it is actually an override.",
    distractors:{
      D:"Environment files are the likeliest place, but restricting the search there assumes the conclusion you are trying to establish.",
      B:"Documented defaults say nothing about whether something overrides them.",
      C:"Overrides frequently live in files not named `config`, so the pattern misses them."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.5-q", domain:2, ts:"2.5", scenario:3, type:"multi",
  stem:"Which two are appropriate uses of Glob rather than Grep? (Select 2.)",
  options:[
    {k:"A", text:"Listing every migration file in a versioned directory."},
    {k:"B", text:"Finding all TypeScript test files across the repository."},
    {k:"C", text:"Locating every call site of a deprecated function."},
    {k:"D", text:"Finding files that import a specific package."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both are questions about filenames and locations, which is exactly what path matching answers.",
    distractors:{
      C:"Call sites are content and appear in files whose names give no clue.",
      D:"Import statements are content; the importing file's name is unrelated to what it imports."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.5-r", domain:2, ts:"2.5", scenario:4, type:"single",
  stem:"An agent edits a file, then Reads it again and reports content that does not include the edit. What is the most likely explanation?",
  options:[
    {k:"A", text:"It answered from the earlier copy still in context."},
    {k:"B", text:"Edits are buffered and not flushed until the session ends."},
    {k:"C", text:"Read returns the version from before the most recent write."},
    {k:"D", text:"The edit silently failed and reported success."}
  ],
  correct:["A"],
  explain:{
    why:"Both versions are now in context, and the stale one usually appears first. Without care the model can answer from the earlier copy, which is why re-reading is not automatically sufficient.",
    distractors:{
      D:"A failed edit is a real possibility worth checking, but it would normally surface an error rather than a silent success.",
      B:"Edits are applied immediately rather than buffered.",
      C:"Read returns current file contents, not a prior revision."
    }
  },
  refs:[R_CTX] },

{ id:"d2-2.5-s", domain:2, ts:"2.5", scenario:4, type:"single",
  stem:"Why is Grep-then-Read preferred over reading a whole directory when tracing a code path?",
  options:[
    {k:"A", text:"Only files on the actual path enter context."},
    {k:"B", text:"Grep results are more accurate than file contents."},
    {k:"C", text:"Reading a directory is not supported by the tool."},
    {k:"D", text:"Grep caches results, making repeat searches free."}
  ],
  correct:["A"],
  explain:{
    why:"Following imports from search hits keeps the context filled with code that bears on the question, which preserves room for the reasoning itself.",
    distractors:{
      B:"Grep returns matching lines rather than a more accurate account of anything; it is a filter, not a better source.",
      C:"Directory enumeration is available; it is simply the wrong strategy here.",
      D:"There is no such caching guarantee, and it would not be the reason to prefer this order."
    }
  },
  refs:[R_CTX] },

{ id:"d2-2.5-t", domain:2, ts:"2.5", scenario:5, type:"single",
  stem:"A CI agent must review only the files a pull request changed. Which approach fits best?",
  options:[
    {k:"A", text:"Take the changed-file list from the pipeline and Read those."},
    {k:"B", text:"Glob the whole repository and filter by modification time."},
    {k:"C", text:"Grep for recent dates in file headers."},
    {k:"D", text:"Read every file and compare against the previous run."}
  ],
  correct:["A"],
  explain:{
    why:"The pipeline already knows exactly which files changed, so taking that list is both precise and free. Rediscovering it from the filesystem is guesswork.",
    distractors:{
      B:"Checkout timestamps often reflect the clone rather than the change, so this over-matches badly.",
      C:"Header dates are conventions many files do not follow and are frequently stale.",
      D:"Reading everything on every run is enormously wasteful and needs state you do not have."
    }
  },
  refs:[R_HEAD] },
