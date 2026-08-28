
/* ---------------- Domain 2: Tool Design & MCP Integration ---------------- */

{ id:"d2-2.1-a", domain:2, ts:"2.1", scenario:1, type:"single",
  stem:"Production logs show the agent frequently calls `get_customer` when users ask about orders (for example 'check my order #12345') instead of `lookup_order`. Both tools have minimal descriptions ('Retrieves customer information' / 'Retrieves order details') and accept similar identifier formats. What is the most effective first step?",
  options:[
    {k:"A", text:"Expand each tool's description with input formats, example queries, edge cases and boundaries."},
    {k:"B", text:"Add 5-8 few-shot examples to the system prompt demonstrating order-related queries routing to `lookup_order`."},
    {k:"C", text:"Implement a routing layer that parses user input before each turn and pre-selects the tool from detected keywords, identifier patterns and message structure."},
    {k:"D", text:"Consolidate both tools into a single `lookup_entity` tool that accepts any identifier and internally decides which backend to query."}
  ],
  correct:["A"],
  explain:{
    why:"Tool descriptions are the primary mechanism the model uses to select a tool. When they are two-word summaries, the model has nothing to differentiate on. Expanding them is the direct, low-effort, high-leverage fix for the actual root cause.",
    distractors:{
      B:"Few-shot examples add token overhead to every request and paper over the ambiguity rather than removing it. They are a reasonable second step, not the first.",
      C:"Keyword routing is over-engineered for this, and it discards the model's language understanding in favour of brittle pattern matching.",
      D:"Consolidation is a defensible architecture but far more work than a first step warrants when the immediate defect is inadequate descriptions."
    }
  },
  refs:[{label:"API: Tool use overview", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"}] },

{ id:"d2-2.1-b", domain:2, ts:"2.1", scenario:3, type:"single",
  stem:"Your research system has `analyze_content` ('Analyses content and returns insights') and `analyze_document` ('Analyses documents and returns insights'). The agent routes web search results to `analyze_document` about half the time. What is the best remedy?",
  options:[
    {k:"A", text:"Rename `analyze_content` to `extract_web_results` with a web-specific description and boundary."},
    {k:"B", text:"Remove `analyze_content` entirely and route everything through `analyze_document`."},
    {k:"C", text:"Add a required `source_type` parameter to both tools so the agent must explicitly declare what kind of content it is passing in on every call."},
    {k:"D", text:"Reorder the tool definitions so `analyze_content` appears first in the tools array."}
  ],
  correct:["A"],
  explain:{
    why:"The two descriptions are near-identical, so a coin flip is the expected outcome. Renaming to something functionally specific and describing the boundary gives the model an unambiguous basis for choosing.",
    distractors:{
      B:"This discards a genuinely distinct capability. Web results and documents have different structures and warrant different handling.",
      C:"The agent that cannot tell which tool to use will not reliably populate a parameter describing which case it is in. It moves the same ambiguity one level down.",
      D:"Ordering within the tools array is not a reliable selection mechanism and does nothing about the underlying ambiguity."
    }
  },
  refs:[{label:"API: Tool use overview", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"}] },

{ id:"d2-2.1-c", domain:2, ts:"2.1", scenario:3, type:"single",
  stem:"A generic `analyze_document` tool is used for three different purposes and returns inconsistent output shapes depending on what the agent asked for. What is the recommended restructuring?",
  options:[
    {k:"A", text:"Split it into purpose-specific tools: `extract_data_points`, `summarize_content` and `verify_claim_against_source`."},
    {k:"B", text:"Keep one tool but add a `mode` enum parameter with three values, documented in the description."},
    {k:"C", text:"Keep the single tool and require the agent to specify the exact output schema it expects in a free-text parameter that is supplied separately on each call to the tool."},
    {k:"D", text:"Keep one tool and post-process the varying outputs into a common shape with a PostToolUse hook."}
  ],
  correct:["A"],
  explain:{
    why:"Three purposes with three different output shapes are three tools. Splitting gives each a clear description that drives correct selection, and a stable contract that downstream code can rely on.",
    distractors:{
      B:"A mode enum keeps the description generic, so the model still has to work out which mode applies, and the output shape still varies by mode.",
      C:"Free-text schema specification is the least reliable option available; it invites inconsistency rather than removing it.",
      D:"A hook can normalise shape but cannot make one vague description select correctly among three distinct jobs."
    }
  },
  refs:[{label:"API: Tool use overview", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"}] },

{ id:"d2-2.1-d", domain:2, ts:"2.1", scenario:1, type:"single",
  stem:"You rewrite two overlapping tool descriptions carefully, but misrouting persists. Your system prompt contains the line: 'When a customer mentions any account detail, always start by retrieving their customer record.' What should you suspect?",
  options:[
    {k:"A", text:"Keyword-sensitive system prompt wording is creating unintended tool associations."},
    {k:"B", text:"The tool descriptions are cached from the previous session and need a cache invalidation."},
    {k:"C", text:"System prompts always take absolute precedence over tool descriptions, so descriptions cannot influence selection."},
    {k:"D", text:"The tools array exceeds the recommended size, so descriptions beyond the first few are ignored."}
  ],
  correct:["A"],
  explain:{
    why:"An instruction to 'always start by retrieving their customer record' whenever an account detail is mentioned will fire on order queries too, because an order number reads as an account detail. The prompt is competing with the descriptions you just fixed.",
    distractors:{
      B:"Tool definitions are sent with each request; there is no stale description cache to invalidate.",
      C:"Both influence selection. Descriptions are the primary mechanism; the prompt biases it rather than overriding it absolutely.",
      D:"Two tools is nowhere near a size where crowding matters, and descriptions are not silently dropped."
    }
  },
  refs:[{label:"API: Tool use overview", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"}] },

{ id:"d2-2.1-e", domain:2, ts:"2.1", scenario:1, type:"multi",
  stem:"Which two elements most improve a tool description's ability to drive correct selection among similar tools? (Select 2.)",
  options:[
    {k:"A", text:"An explicit boundary statement saying when to use this tool rather than a named alternative."},
    {k:"B", text:"Example queries showing the kinds of request the tool is intended to serve."},
    {k:"C", text:"Implementation details about which backend service the tool calls and its latency profile."},
    {k:"D", text:"A statement of how frequently the tool is expected to be used relative to others."}
  ],
  correct:["A","B"],
  explain:{
    why:"Selection is a disambiguation problem. An explicit boundary tells the model where one tool's remit ends and another's begins, and concrete example queries let it pattern-match a real request against the intended use.",
    distractors:{
      C:"Backend and latency details are operational concerns. They consume description tokens without helping the model decide which request belongs here.",
      D:"Expected frequency is not a selection criterion, and biasing towards a commonly-used tool would make rare-but-correct selections worse."
    }
  },
  refs:[{label:"API: Tool use overview", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"}] },

{ id:"d2-2.1-f", domain:2, ts:"2.1", scenario:4, type:"single",
  stem:"Your agent has a well-described MCP tool `search_code_semantic` that outperforms plain text search, yet the agent almost always reaches for the built-in Grep instead. What is the most likely cause?",
  options:[
    {k:"A", text:"The MCP tool description does not explain its capabilities in enough detail to compete."},
    {k:"B", text:"Built-in tools always take precedence over MCP tools in the selection order."},
    {k:"C", text:"MCP tools are only offered to the model when built-in tools return no results."},
    {k:"D", text:"Grep is cheaper to call, and the model optimises for token cost when it is choosing between the tools available to it in a given session."}
  ],
  correct:["A"],
  explain:{
    why:"MCP tools compete with built-ins on description quality alone. If the description does not make clear what the tool can do that Grep cannot, the model has no reason to prefer it, and the documentation specifically recommends enhancing descriptions for exactly this symptom.",
    distractors:{
      B:"There is no hard precedence rule favouring built-ins. All available tools are candidates.",
      C:"MCP tools are discovered at connection time and available simultaneously with built-ins, not as a fallback tier.",
      D:"The model does not select tools by token cost. It selects on the descriptions and the task."
    }
  },
  refs:[{label:"Claude Code: MCP", url:"https://code.claude.com/docs/en/mcp"}] },

{ id:"d2-2.2-a", domain:2, ts:"2.2", scenario:1, type:"single",
  stem:"All four of your MCP tools return the string 'Operation failed' on any error. The agent retries timeouts (good), but also retries invalid-input errors indefinitely and tells customers that policy violations are 'temporary system issues'. What is the fix?",
  options:[
    {k:"A", text:"Return structured error metadata: an `errorCategory`, an `isRetryable` boolean and a description."},
    {k:"B", text:"Cap retries at two attempts per tool call so indefinite retry loops cannot occur."},
    {k:"C", text:"Instruct the agent in the system prompt to retry an operation at most once before escalating it."},
    {k:"D", text:"Return HTTP status codes as the error message so the agent can infer the failure category from the numeric code it receives."}
  ],
  correct:["A"],
  explain:{
    why:"The agent cannot make an appropriate recovery decision from a uniform message. Categorising the error and stating explicitly whether it is retryable gives it the information to retry a timeout, correct and resubmit a validation error, and explain a policy violation to the customer.",
    distractors:{
      B:"A retry cap stops the infinite loop but leaves the agent still misinformed, so it retries validation errors twice and still describes policy violations as system issues.",
      C:"This is the same fix in prompt form, and it is still guessing, because the agent has no reliable basis for classifying the failure.",
      D:"Status codes are a partial signal at best, and they do not carry the customer-friendly explanation a business-rule violation needs."
    }
  },
  refs:[{label:"Claude Code: MCP", url:"https://code.claude.com/docs/en/mcp"}] },

{ id:"d2-2.2-b", domain:2, ts:"2.2", scenario:1, type:"single",
  stem:"A refund request violates a business rule: the item is outside the 30-day return window. What should the tool return?",
  options:[
    {k:"A", text:"An error marked non-retryable, carrying a customer-friendly explanation the agent can relay."},
    {k:"B", text:"A transient error, so the agent retries in case the policy engine was temporarily out of date."},
    {k:"C", text:"A successful response with a refund amount of zero, letting the agent infer the refusal."},
    {k:"D", text:"A generic failure, so that the agent escalates to a human who can explain the policy properly."}
  ],
  correct:["A"],
  explain:{
    why:"A business-rule violation is deterministic: it will fail identically on every retry. Marking it non-retryable prevents wasted attempts, and a customer-friendly explanation lets the agent resolve the contact by explaining the policy rather than escalating.",
    distractors:{
      B:"Classifying a permanent rule violation as transient guarantees pointless retries and delays the customer's answer.",
      C:"Reporting failure as success is the classic silent-suppression anti-pattern. A zero-value refund is ambiguous and easily misread as completed.",
      D:"Escalating a clear, explainable policy outcome wastes human capacity on a case the agent could close itself."
    }
  },
  refs:[{label:"Claude Code: MCP", url:"https://code.claude.com/docs/en/mcp"}] },

{ id:"d2-2.2-c", domain:2, ts:"2.2", scenario:3, type:"single",
  stem:"A document-analysis subagent queries a source repository and gets back nothing. Why does it matter whether this is reported as an access failure or as a valid empty result?",
  options:[
    {k:"A", text:"They demand opposite responses: an access failure may warrant a retry, an empty result does not."},
    {k:"B", text:"Only access failures are billable, so the distinction matters for cost accounting."},
    {k:"C", text:"Empty results must always be retried, whereas access failures should always be propagated to the coordinator immediately without any local retry attempt being made first."},
    {k:"D", text:"There is no practical difference, since in both cases the subagent has no data to return."}
  ],
  correct:["A"],
  explain:{
    why:"Conflating them destroys the coordinator's ability to respond. If a timeout is reported as 'no results', a whole topic area is silently dropped as though it had been researched. If an empty result is reported as a failure, the system retries a query that will always return nothing.",
    distractors:{
      B:"Cost accounting is not the concern; the recovery decision is.",
      C:"This is inverted. Empty results should not be retried, and access failures are precisely what may benefit from a retry or an alternative.",
      D:"The difference is the entire point. One means 'we could not look', the other means 'we looked and there is nothing'."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d2-2.2-d", domain:2, ts:"2.2", scenario:1, type:"single",
  stem:"Which MCP mechanism communicates to the agent that a tool call failed, as distinct from returning a normal result?",
  options:[
    {k:"A", text:"The `isError` flag on the tool result."},
    {k:"B", text:"Raising an exception in the server, which the client converts into a retry."},
    {k:"C", text:"Returning `null` as the tool result content."},
    {k:"D", text:"Setting `stop_reason` to `error` on the response."}
  ],
  correct:["A"],
  explain:{
    why:"MCP provides `isError` specifically so a failure is distinguishable from a normal result. The agent then knows execution failed and can reason about recovery rather than treating the payload as data.",
    distractors:{
      B:"An uncaught exception risks crashing the server and gives the model nothing to reason about. The guidance is to return a structured error instead.",
      C:"A null result is indistinguishable from a legitimately empty answer, which is exactly the ambiguity to avoid.",
      D:"`stop_reason` describes why the model stopped generating. It is not a channel for tool-level failures."
    }
  },
  refs:[{label:"Claude Code: MCP", url:"https://code.claude.com/docs/en/mcp"}] },

{ id:"d2-2.2-e", domain:2, ts:"2.2", scenario:1, type:"single",
  stem:"Match the error to its category: a call fails because the caller's token lacks the required scope. How should it be classified and handled?",
  options:[
    {k:"A", text:"A permission error, non-retryable, with a description stating which access is missing."},
    {k:"B", text:"A transient error, retryable with exponential backoff, since tokens are often refreshed automatically."},
    {k:"C", text:"A validation error, non-retryable, since the request was malformed."},
    {k:"D", text:"A business error, retryable once, since access policies sometimes change between attempts."}
  ],
  correct:["A"],
  explain:{
    why:"Insufficient scope is a permission problem, and retrying with the same token will fail identically. Naming the missing access lets the agent explain the situation or route to someone who can grant it.",
    distractors:{
      B:"Scope is not a transient condition. Backoff and retry burn attempts on a failure that cannot resolve itself.",
      C:"The request was well-formed; the caller simply is not authorised. Calling it a validation error would send the agent to fix its arguments.",
      D:"Business errors are policy outcomes about the operation, not about the caller's authorisation, and this one is not retryable."
    }
  },
  refs:[{label:"Claude Code: MCP", url:"https://code.claude.com/docs/en/mcp"}] },

{ id:"d2-2.2-f", domain:2, ts:"2.2", scenario:3, type:"single",
  stem:"A search subagent hits a transient network error, retries twice with backoff, and succeeds on the third attempt. What should it report to the coordinator?",
  options:[
    {k:"A", text:"The successful results, having resolved the transient failure locally without escalating it."},
    {k:"B", text:"The results plus a full log of both failed attempts, so the coordinator has complete visibility."},
    {k:"C", text:"A structured error describing the two failures, since the coordinator owns all error handling."},
    {k:"D", text:"Nothing until the coordinator asks, to avoid unsolicited status messages."}
  ],
  correct:["A"],
  explain:{
    why:"Subagents should recover locally from transient failures and propagate only what they cannot resolve. The failure was handled, the data is complete, and burdening the coordinator with resolved noise is exactly what local recovery is meant to prevent.",
    distractors:{
      B:"Detailed logs of resolved retries consume coordinator context to no decision-making purpose. Observability of this belongs in telemetry, not in the agent's context window.",
      C:"There is no error to report. The operation succeeded, and reporting an error would trigger unnecessary coordinator recovery.",
      D:"Withholding completed results stalls the pipeline; the coordinator is waiting on this."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d2-2.3-a", domain:2, ts:"2.3", scenario:3, type:"single",
  stem:"Your synthesis agent needs to verify claims while combining findings. Currently it returns control to the coordinator, which invokes the web search agent, then re-invokes synthesis. This adds 2-3 round trips per task and 40% latency. Evaluation shows 85% of verifications are simple fact-checks (dates, names, statistics) and 15% need deeper investigation. What is the most effective approach?",
  options:[
    {k:"A", text:"Give the synthesis agent a scoped `verify_fact` tool, routing complex cases via the coordinator."},
    {k:"B", text:"Have the synthesis agent accumulate all verification needs and return them as one batch to the coordinator at the end of its pass."},
    {k:"C", text:"Give the synthesis agent access to all web search tools so it can handle any verification directly."},
    {k:"D", text:"Have the web search agent proactively cache extra context around each source, anticipating what synthesis might need."}
  ],
  correct:["A"],
  explain:{
    why:"This applies least privilege precisely: the synthesis agent gets exactly the capability the 85% case needs, and the existing coordination path is preserved for the 15% that genuinely needs investigation.",
    distractors:{
      B:"Batching creates blocking dependencies, because later synthesis steps often depend on facts verified earlier. You cannot defer a verification whose answer changes what you write next.",
      C:"Handing over the full search toolset over-provisions the agent and breaks separation of concerns; a synthesis agent with search tools starts doing research instead of synthesising.",
      D:"Speculative caching cannot reliably predict which claims will need checking, so it fetches a great deal that is never used and still misses what is."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d2-2.3-b", domain:2, ts:"2.3", scenario:3, type:"single",
  stem:"An agent that previously had 4 tools now has 18 after a merge of several capability sets. Tool selection accuracy has dropped noticeably. What principle explains this?",
  options:[
    {k:"A", text:"Selection reliability degrades as the tool set grows and decision complexity increases."},
    {k:"B", text:"Tool definitions beyond the first ten are truncated from the request payload."},
    {k:"C", text:"Larger tool sets require proportionally larger context windows, and the available context window has now been exhausted by them."},
    {k:"D", text:"Tools added after initialisation are not indexed for selection until the session restarts."}
  ],
  correct:["A"],
  explain:{
    why:"Choosing correctly among 18 options is a harder discrimination problem than choosing among 4, particularly when several have adjacent purposes. Scoping each agent to the tools its role actually needs is the standard remedy.",
    distractors:{
      B:"Tool definitions are not silently truncated. All of them are sent.",
      C:"Eighteen tool definitions are small relative to a context window; this is a discrimination problem, not a capacity one.",
      D:"There is no such indexing delay; tools are available once configured and discovered."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d2-2.3-c", domain:2, ts:"2.3", scenario:6, type:"single",
  stem:"You have several extraction schemas and do not know which document type will arrive. You need the model to always produce structured output rather than conversational text. Which `tool_choice` setting fits?",
  options:[
    {k:"A", text:"`\"any\"`, which requires a tool call but lets the model choose which schema fits."},
    {k:"B", text:"`\"auto\"`, which lets the model decide whether a tool call is warranted."},
    {k:"C", text:"`{\"type\":\"tool\",\"name\":\"extract_invoice\"}`, forcing the most common schema on every document."},
    {k:"D", text:"`\"none\"`, which returns plain text that you then parse into the appropriate schema yourself."}
  ],
  correct:["A"],
  explain:{
    why:"`any` guarantees a tool call, so you always get schema-conformant structured output, while leaving the choice of which extraction schema to the model, which is what you want when the document type is unknown.",
    distractors:{
      B:"`auto` permits a plain text response, which is exactly the outcome you are trying to eliminate.",
      C:"Forcing one named schema misclassifies every document that is not that type, and forcing an invoice schema onto a contract produces garbage.",
      D:"`none` forbids tool calls entirely, returning you to parsing free text, which is the problem structured output solves."
    }
  },
  refs:[{label:"API: Tool use overview", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"}] },

{ id:"d2-2.3-d", domain:2, ts:"2.3", scenario:6, type:"single",
  stem:"Your pipeline must always run `extract_metadata` before any enrichment tool. Which `tool_choice` configuration guarantees the first call is that tool?",
  options:[
    {k:"A", text:"`{\"type\":\"tool\",\"name\":\"extract_metadata\"}` on the first request, then a looser setting on follow-up turns."},
    {k:"B", text:"`\"any\"` on the first request, since it forces a tool call and metadata extraction is the obvious first step."},
    {k:"C", text:"`\"auto\"` with a system prompt instruction that metadata extraction must always come first."},
    {k:"D", text:"Listing `extract_metadata` first in the tools array, since the model calls tools in declaration order."}
  ],
  correct:["A"],
  explain:{
    why:"Forced tool selection names the exact tool the model must call, which is the only configuration that guarantees a specific tool runs first. Subsequent steps then proceed in follow-up turns with a less restrictive setting.",
    distractors:{
      B:"`any` guarantees some tool is called but not which one, so an enrichment tool could still run first.",
      C:"This is prompt-based guidance for something that needs a guarantee, and carries the usual non-zero failure rate.",
      D:"Declaration order does not determine call order. The model chooses based on the task and descriptions."
    }
  },
  refs:[{label:"API: Tool use overview", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"}] },

{ id:"d2-2.3-e", domain:2, ts:"2.3", scenario:3, type:"single",
  stem:"A document-analysis subagent has a general-purpose `fetch_url` tool and has begun pulling in blog posts and forum threads alongside the peer-reviewed sources it was meant to analyse. What is the cleanest correction?",
  options:[
    {k:"A", text:"Replace `fetch_url` with a constrained `load_document`."},
    {k:"B", text:"Add a system prompt rule listing domains the subagent is not allowed to fetch from."},
    {k:"C", text:"Keep `fetch_url` and filter low-quality sources out of the synthesis step instead."},
    {k:"D", text:"Remove the tool entirely and have the coordinator fetch every document on the subagent's behalf."}
  ],
  correct:["A"],
  explain:{
    why:"Replacing an over-broad tool with a constrained one that validates its input enforces the boundary at the point of use. The subagent keeps the capability it needs and structurally cannot reach beyond its remit.",
    distractors:{
      B:"A denylist is unbounded and always incomplete; the next unlisted forum passes straight through.",
      C:"Filtering downstream means you have already paid to fetch and analyse material you will discard, and low-quality sources may still influence the analysis.",
      D:"Routing every fetch through the coordinator adds a round trip to a high-frequency operation the subagent legitimately needs."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d2-2.3-f", domain:2, ts:"2.3", scenario:2, type:"single",
  stem:"Which `tool_choice` value allows the model to respond with plain text instead of calling a tool?",
  options:[
    {k:"A", text:"`\"auto\"`"},
    {k:"B", text:"`\"any\"`"},
    {k:"C", text:"`{\"type\":\"tool\",\"name\":\"...\"}`"},
    {k:"D", text:"All three permit a plain text response."}
  ],
  correct:["A"],
  explain:{
    why:"`auto` leaves the decision to the model, so it may answer conversationally when it judges no tool is needed. That flexibility is useful in chat, and a liability when you require structured output.",
    distractors:{
      B:"`any` requires that some tool be called, so a plain text response is not an option.",
      C:"Forced selection requires that specific tool be called; text-only is not permitted.",
      D:"Only `auto` permits it, which is the distinction the question turns on."
    }
  },
  refs:[{label:"API: Tool use overview", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"}] },

{ id:"d2-2.4-a", domain:2, ts:"2.4", scenario:4, type:"single",
  stem:"Your team needs a shared MCP server available to everyone who clones the repository, authenticating with a token that must not be committed. How should you configure it?",
  options:[
    {k:"A", text:"In project-scoped `.mcp.json`, referencing the token as `${GITHUB_TOKEN}` via expansion."},
    {k:"B", text:"In each developer's `~/.claude.json`, with the token pasted in directly, since that file is never committed to the repository."},
    {k:"C", text:"In project-scoped `.mcp.json` with the token inline, adding `.mcp.json` to `.gitignore`."},
    {k:"D", text:"In a `.env` file at the repository root, which Claude Code reads automatically for MCP configuration."}
  ],
  correct:["A"],
  explain:{
    why:"Project scope in `.mcp.json` is what shares a server with the team through version control, and environment variable expansion keeps the secret out of the committed file. `${VAR}` and `${VAR:-default}` are both supported.",
    distractors:{
      B:"Per-developer configuration is not shared, so every new team member must set the server up by hand, and the token still sits in plaintext.",
      C:"Gitignoring `.mcp.json` defeats its purpose entirely; the file exists to be committed so the team gets the same tools.",
      D:"A `.env` file at the repository root is not a Claude Code MCP configuration mechanism."
    }
  },
  refs:[{label:"Claude Code: MCP", url:"https://code.claude.com/docs/en/mcp"}] },

{ id:"d2-2.4-b", domain:2, ts:"2.4", scenario:4, type:"single",
  stem:"A developer wants to try an experimental MCP server on their own machine without affecting teammates. Where should it go?",
  options:[
    {k:"A", text:"In their own user configuration in `~/.claude.json`, which is private to them."},
    {k:"B", text:"In the project's `.mcp.json`, with a comment marking it as experimental."},
    {k:"C", text:"In `.claude/settings.json`, which is the designated location for personal and experimental MCP server definitions."},
    {k:"D", text:"In the project's `CLAUDE.md`, documented as an optional server teammates may skip."}
  ],
  correct:["A"],
  explain:{
    why:"Personal and experimental servers belong in the developer's own configuration, which is private and not distributed to the team.",
    distractors:{
      B:"Anything in `.mcp.json` is committed and reaches everyone, and JSON has no comment syntax anyway.",
      C:"`.claude/settings.json` is for project settings, not personal MCP server definitions, and it is typically committed.",
      D:"CLAUDE.md is instructional context. It does not configure servers."
    }
  },
  note:"The exam frames this as project versus user scope. Current Claude Code documents three scopes, and the default for a personal server added with `claude mcp add` is actually **local** scope, stored per-project inside `~/.claude.json`. **User** scope, also in `~/.claude.json`, makes it available across all your projects. Both are private to you, which is the distinction being tested.",
  refs:[{label:"Claude Code: MCP", url:"https://code.claude.com/docs/en/mcp"}] },

{ id:"d2-2.4-c", domain:2, ts:"2.4", scenario:4, type:"single",
  stem:"Your agent burns many tool calls exploring which issues exist in a tracker before it can act on any of them. What MCP capability reduces this exploratory overhead?",
  options:[
    {k:"A", text:"MCP resources, which expose a content catalogue of what is available."},
    {k:"B", text:"MCP prompts, which pre-fill the agent's system prompt with the current issue list each time it connects."},
    {k:"C", text:"Increasing `MAX_MCP_OUTPUT_TOKENS` so each exploratory call returns more per request."},
    {k:"D", text:"Caching tool results locally so repeated exploration of the same tracker is free."}
  ],
  correct:["A"],
  explain:{
    why:"Resources are designed to expose content catalogues, such as issue summaries, documentation hierarchies or database schemas, giving the agent visibility into what exists without a sequence of discovery calls.",
    distractors:{
      B:"MCP prompts are reusable prompt templates, not a mechanism for injecting a live data catalogue.",
      C:"Raising the output cap makes each exploratory call larger, which consumes more context rather than removing the exploration.",
      D:"Caching helps on repeats within the same data, but the first exploration still costs full price and stale caches introduce their own problems."
    }
  },
  refs:[{label:"Claude Code: MCP", url:"https://code.claude.com/docs/en/mcp"}] },

{ id:"d2-2.4-d", domain:2, ts:"2.4", scenario:3, type:"single",
  stem:"You need Jira integration for your agent. A well-maintained community MCP server for Jira exists. What is the recommended approach?",
  options:[
    {k:"A", text:"Use the existing community server, reserving custom builds for team-specific workflows."},
    {k:"B", text:"Build a custom server, since community servers cannot be trusted with production credentials."},
    {k:"C", text:"Build a custom server, since community tool descriptions are never detailed enough for reliable selection."},
    {k:"D", text:"Use the community server but wrap every one of its tools in your own proxy tools with your own descriptions."}
  ],
  correct:["A"],
  explain:{
    why:"For standard integrations, an existing server is the pragmatic choice. Custom effort is better spent on workflows specific to your team, which no community server will cover.",
    distractors:{
      B:"Credential handling is a matter of review and configuration, not a reason to rebuild every standard integration from scratch.",
      C:"If a description is thin you can improve how the tool is presented; that does not justify reimplementing the whole server.",
      D:"A full proxy layer is most of the work of a custom server, with an extra indirection to maintain on top."
    }
  },
  refs:[{label:"Claude Code: MCP", url:"https://code.claude.com/docs/en/mcp"}] },

{ id:"d2-2.4-e", domain:2, ts:"2.4", scenario:2, type:"single",
  stem:"You have three MCP servers configured across different scopes. When are their tools available to the agent?",
  options:[
    {k:"A", text:"Tools from all of the configured servers are discovered at connection time and are available at once."},
    {k:"B", text:"Only the highest-precedence scope's servers connect; the others are ignored."},
    {k:"C", text:"Servers connect lazily, one at a time, when the agent first requests a tool whose name matches that server."},
    {k:"D", text:"Only servers explicitly enabled in the current session's settings connect."}
  ],
  correct:["A"],
  explain:{
    why:"Configured servers connect and their tools are discovered at connection time, so the agent sees the full combined tool set at once. This is also why over-provisioning servers degrades tool selection.",
    distractors:{
      B:"Scope precedence resolves duplicate server names; it does not suppress servers from other scopes.",
      C:"Discovery happens at connection, not on demand by name.",
      D:"Configured servers connect by default; project-scoped ones require a one-time approval, not per-session enabling."
    }
  },
  refs:[{label:"Claude Code: MCP", url:"https://code.claude.com/docs/en/mcp"}] },

{ id:"d2-2.4-f", domain:2, ts:"2.4", scenario:4, type:"single",
  stem:"In `.mcp.json`, you write `\"url\": \"${API_BASE_URL}/mcp\"` but `API_BASE_URL` is not set on a teammate's machine. What happens, and what is the better practice?",
  options:[
    {k:"A", text:"It still loads with a missing-variable warning and the literal text unexpanded; add a fallback."},
    {k:"B", text:"Claude Code refuses to start until the variable is set, which is the intended forcing function."},
    {k:"C", text:"The variable expands to an empty string silently, producing a relative URL that resolves against the project root instead of the intended remote host."},
    {k:"D", text:"Environment variable expansion is not supported in the `url` field, only in `env`, so the server is skipped."}
  ],
  correct:["A"],
  explain:{
    why:"An unset variable with no default leaves the placeholder text in place and surfaces a warning rather than failing hard. The `${VAR:-default}` form gives a sensible fallback so the server starts with the value you intended.",
    distractors:{
      B:"Claude Code does not refuse to start; it warns and carries on.",
      C:"It does not expand to empty. The unexpanded `${VAR}` text is used as-is.",
      D:"Expansion is supported in `url`, `command`, `args`, `env` and `headers`."
    }
  },
  refs:[{label:"Claude Code: MCP", url:"https://code.claude.com/docs/en/mcp"}] },

{ id:"d2-2.5-a", domain:2, ts:"2.5", scenario:4, type:"single",
  stem:"You need to find every call site of a function named `calculateTax` across an unfamiliar TypeScript repository. Which built-in tool is the right starting point?",
  options:[
    {k:"A", text:"Grep, which searches file contents for the pattern."},
    {k:"B", text:"Glob, which matches file paths against a supplied pattern."},
    {k:"C", text:"Read, applied to each file in the repository in turn."},
    {k:"D", text:"Bash, running a recursive directory listing to locate candidate files."}
  ],
  correct:["A"],
  explain:{
    why:"The target is content: an identifier appearing inside files. Grep searches file contents, which is exactly the operation needed to locate callers.",
    distractors:{
      B:"Glob matches filenames and paths. It cannot see inside a file, and the function name has no relationship to the filenames.",
      C:"Reading every file exhausts context and is enormously slower than a content search.",
      D:"A directory listing enumerates paths, not contents, so it does not answer the question either."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d2-2.5-b", domain:2, ts:"2.5", scenario:4, type:"single",
  stem:"You want to locate every React test file in a codebase where tests sit beside the components they cover. Which tool and pattern?",
  options:[
    {k:"A", text:"Glob with the pattern `**/*.test.tsx`, which matches at any directory depth."},
    {k:"B", text:"Grep for the string `describe(` across the repository."},
    {k:"C", text:"Glob with `tests/**/*`, since test files live in a tests directory."},
    {k:"D", text:"Read on the project configuration to find the configured test directory."}
  ],
  correct:["A"],
  explain:{
    why:"This is a filename pattern problem, which is what Glob is for, and `**/*.test.tsx` matches the naming convention at any depth regardless of which component directory a test sits in.",
    distractors:{
      B:"Searching for `describe(` finds files containing that call, which will include helpers and miss tests using other structures. Filename matching is both more precise and cheaper here.",
      C:"The premise states tests sit beside their components, so a `tests/` directory pattern matches almost nothing.",
      D:"Configuration may name a pattern, but reading it is an extra step that still leaves you needing Glob to enumerate the matches."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d2-2.5-c", domain:2, ts:"2.5", scenario:4, type:"single",
  stem:"An Edit call fails because the anchor text appears four times in the file. What is the reliable fallback?",
  options:[
    {k:"A", text:"Read the full file, then Write it back with the modification applied."},
    {k:"B", text:"Retry the same Edit; the failure is usually a transient matching issue."},
    {k:"C", text:"Use Bash with `sed -i` to perform the replacement on the first occurrence."},
    {k:"D", text:"Delete the file and Write a fresh version from memory of its contents."}
  ],
  correct:["A"],
  explain:{
    why:"Edit relies on a unique text match. When uniqueness cannot be achieved, Read followed by Write is the documented fallback: you have the exact current contents and write back exactly what you intend.",
    distractors:{
      B:"The failure is deterministic. The anchor is still ambiguous on retry.",
      C:"Editing the first occurrence blindly is likely to change the wrong one of the four, and sidesteps the tooling's safety.",
      D:"Writing from memory rather than from an actual Read risks losing content that was never in context."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d2-2.5-d", domain:2, ts:"2.5", scenario:4, type:"single",
  stem:"An agent asked to understand how authentication works in a 4,000-file repository begins by reading every file under `src/`. It exhausts its context before reaching any conclusion. What is the correct strategy?",
  options:[
    {k:"A", text:"Grep for entry points, then Read selectively to follow imports and trace the flow."},
    {k:"B", text:"Read all of the files but summarise each one to a single line before moving on to the next."},
    {k:"C", text:"Read the files in alphabetical order and stop as soon as the context window reaches 80% of capacity."},
    {k:"D", text:"Request a larger context window model and repeat the same exhaustive read."}
  ],
  correct:["A"],
  explain:{
    why:"Understanding is built incrementally. Grep locates the entry points, then targeted reads follow the actual import chain, so only files on the relevant path enter context.",
    distractors:{
      B:"Reading everything still costs the full read, and summarising as you go loses the detail you will need when tracing a specific flow.",
      C:"Alphabetical order has no relationship to relevance, so you fill context with whatever happens to sort first.",
      D:"A bigger window postpones exhaustion without making the approach any less wasteful, and dilutes attention across thousands of irrelevant files."
    }
  },
  refs:[{label:"API: Context windows", url:"https://platform.claude.com/docs/en/build-with-claude/context-windows"}] },

{ id:"d2-2.5-e", domain:2, ts:"2.5", scenario:4, type:"single",
  stem:"A utility is re-exported through several wrapper modules, so searching for its original name finds only the definition. How should you trace its real usage?",
  options:[
    {k:"A", text:"First identify all the names it is re-exported under, then search for each one."},
    {k:"B", text:"Search for the original name with a case-insensitive flag to catch any renamed or re-cased variants of it."},
    {k:"C", text:"Read every file that imports from the wrapper module's directory."},
    {k:"D", text:"Search for the file path of the original definition, since imports reference paths."}
  ],
  correct:["A"],
  explain:{
    why:"Re-exports rename the binding, so callers reference a name the original search never looked for. Enumerating the export names first and then searching for each one follows the actual chain.",
    distractors:{
      B:"Case-insensitivity catches capitalisation differences, not genuinely different identifiers introduced by a re-export.",
      C:"Importing from that directory does not imply using this particular utility, so this both over-matches and misses transitive re-exports.",
      D:"Callers typically import from the wrapper's path, not the original definition's, so path search misses exactly the usages you want."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },

{ id:"d2-2.5-f", domain:2, ts:"2.5", scenario:4, type:"multi",
  stem:"Which two statements about the built-in file tools are correct? (Select 2.)",
  options:[
    {k:"A", text:"Grep searches file contents; Glob matches file paths."},
    {k:"B", text:"Edit requires a unique text match to locate the change site."},
    {k:"C", text:"Glob searches file contents when given a regular expression."},
    {k:"D", text:"Write requires that the target file already exist."}
  ],
  correct:["A","B"],
  explain:{
    why:"These are the core distinctions. Grep is a content search and Glob is a path matcher, and Edit anchors on text that must be unique within the file or the operation fails.",
    distractors:{
      C:"Glob only ever matches paths. It has no visibility into file contents whatever pattern you give it.",
      D:"Write creates a new file when none exists; that is how new files get made."
    }
  },
  refs:[{label:"Agent SDK: Subagents", url:"https://code.claude.com/docs/en/agent-sdk/subagents"}] },
