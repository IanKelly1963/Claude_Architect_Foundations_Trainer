
/* ---- Domain 2 expansion: task statements 2.1 and 2.2 ---- */

{ id:"d2-2.1-g", domain:2, ts:"2.1", scenario:1, type:"single",
  stem:"Your `refund_order` description reads 'Issues a refund for an order.' The agent calls it for exchanges, store credit and partial adjustments. What should the description add?",
  options:[
    {k:"A", text:"The boundary: what it does not cover, and which tool handles those cases."},
    {k:"B", text:"A worked example showing the exact JSON payload the tool expects."},
    {k:"C", text:"The average latency and the backend service it calls."},
    {k:"D", text:"A warning that misuse may result in incorrect financial transactions."}
  ],
  correct:["A"],
  explain:{
    why:"The agent is reaching for this tool because nothing tells it where the tool stops. Naming the excluded cases and where they belong turns an open-ended description into a decision boundary.",
    distractors:{
      B:"A payload example helps the agent call the tool correctly once chosen, but the failure here is choosing it at all.",
      C:"Latency and backend details are operational trivia that consume description tokens without informing the choice.",
      D:"A severity warning may make the agent hesitate, but hesitation is not the same as knowing which alternative to use."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.1-h", domain:2, ts:"2.1", scenario:3, type:"single",
  stem:"Two tools, `search_code` and `find_symbol`, both search a repository. The agent picks between them at roughly chance. Their descriptions are each one sentence and accurate. What is the most likely remaining problem?",
  options:[
    {k:"A", text:"Neither description says when to prefer it over the other."},
    {k:"B", text:"The two tool names are too similar and should be renamed."},
    {k:"C", text:"Two search tools is inherently ambiguous and one should be removed."},
    {k:"D", text:"The descriptions are too short to be parsed reliably."}
  ],
  correct:["A"],
  explain:{
    why:"Accuracy is not the same as differentiation. Both descriptions can be true while leaving the model no basis for choosing, which is what an explicit comparison against the named alternative supplies.",
    distractors:{
      B:"Renaming helps when names actively mislead, but these names are already distinct and reasonably descriptive.",
      C:"Two search tools with genuinely different behaviour is a sound design; the problem is that the difference is not written down.",
      D:"Length is not the issue. A single well-aimed sentence naming the boundary would resolve it."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.1-i", domain:2, ts:"2.1", scenario:3, type:"single",
  stem:"A `fetch_source` tool accepts URLs, local paths and document IDs. Its description lists all three. The agent frequently passes the wrong kind of identifier. What would help most?",
  options:[
    {k:"A", text:"Splitting it into separate tools, one per identifier kind."},
    {k:"B", text:"Adding a `type` parameter the agent must set alongside the identifier."},
    {k:"C", text:"Accepting all three and detecting the kind inside the tool."},
    {k:"D", text:"Listing the three forms in the description with example values for each."}
  ],
  correct:["A"],
  explain:{
    why:"One tool covering three input kinds forces the agent to make a classification decision on every call. Separate tools move that decision into tool selection, where the description can make it explicit.",
    distractors:{
      D:"Examples do reduce the error rate and are worth adding, but the agent still has to classify correctly on every call rather than being guided by the choice of tool.",
      B:"A `type` parameter relocates the same classification into an argument the agent may also get wrong.",
      C:"Silent detection hides errors rather than preventing them, and an ambiguous identifier will be resolved the wrong way without anyone noticing."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.1-j", domain:2, ts:"2.1", scenario:6, type:"single",
  stem:"An extraction agent has `parse_invoice` and `parse_receipt`. Documents that are arguably either are routed inconsistently. What is the most useful addition to the descriptions?",
  options:[
    {k:"A", text:"A rule for the ambiguous case, stating which tool wins and why."},
    {k:"B", text:"A statement noting that the two tools have overlapping applicability."},
    {k:"C", text:"An instruction to try one and fall back to the other on failure."},
    {k:"D", text:"A confidence threshold below which the agent should not call either."}
  ],
  correct:["A"],
  explain:{
    why:"Genuine ambiguity in the domain does not go away, so the description has to decide it. A stated tie-break makes routing deterministic for exactly the documents that were varying.",
    distractors:{
      B:"Acknowledging overlap describes the problem to the model without resolving it.",
      C:"Try-and-fall-back doubles cost on ambiguous documents and relies on the first attempt failing loudly, which parsing often does not.",
      D:"An abstention threshold sends genuinely processable documents to a human and leaves the routing rule undefined."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.1-k", domain:2, ts:"2.1", scenario:1, type:"single",
  stem:"After rewriting tool descriptions, selection improves from 60% to 85% but plateaus. The remaining errors all involve one tool whose description is thorough. What should you examine next?",
  options:[
    {k:"A", text:"The system prompt, for wording that pulls the agent toward that tool."},
    {k:"B", text:"The tool's input schema, which may be rejecting valid calls."},
    {k:"C", text:"The order of tools in the request payload."},
    {k:"D", text:"The model temperature, which may be too high for consistent selection."}
  ],
  correct:["A"],
  explain:{
    why:"Descriptions are the primary signal but not the only one. A system prompt instruction that mentions the same concept can create an association strong enough to override a well-written description.",
    distractors:{
      B:"Schema rejections surface as tool errors after selection, not as the wrong tool being chosen.",
      C:"Ordering within the tools array is not a reliable selection mechanism and is unlikely to explain a concentrated pattern.",
      D:"Temperature adds variance across the board rather than a bias toward one particular tool."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.1-l", domain:2, ts:"2.1", scenario:1, type:"single",
  stem:"Which description would most reliably steer an agent away from a tool it should not use for a given request?",
  options:[
    {k:"A", text:"'Use for X. Do not use for Y; use `tool_y` instead.'"},
    {k:"B", text:"'Use for X. This tool is not suitable for all cases.'"},
    {k:"C", text:"'Handles X requests efficiently and accurately.'"},
    {k:"D", text:"'Use for X. Consider whether another tool may be more appropriate.'"}
  ],
  correct:["A"],
  explain:{
    why:"An explicit exclusion paired with the named alternative gives the model somewhere to go. It converts 'not this' into 'that', which is what makes the redirection actually happen.",
    distractors:{
      D:"Inviting consideration is better than silence, but it leaves the alternative unnamed and the decision unresolved.",
      B:"An unspecified unsuitability tells the model a boundary exists without saying where it is.",
      C:"Praise for the tool's qualities adds no boundary at all and may make over-selection more likely."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.1-m", domain:2, ts:"2.1", scenario:3, type:"single",
  stem:"A team writes 400-word descriptions for each of their 12 tools, covering history, implementation notes and edge cases. Selection accuracy does not improve and token cost rises sharply. What went wrong?",
  options:[
    {k:"A", text:"Length was added without adding discriminating information."},
    {k:"B", text:"Descriptions over 200 words are truncated before reaching the model."},
    {k:"C", text:"Twelve tools is beyond the point where descriptions have any effect."},
    {k:"D", text:"Implementation notes are not permitted in tool descriptions."}
  ],
  correct:["A"],
  explain:{
    why:"What improves selection is information that distinguishes this tool from its neighbours. History and implementation notes are true but shared or irrelevant, so they cost tokens on every request and change nothing.",
    distractors:{
      B:"Descriptions are not truncated at a word count; the whole text is sent.",
      C:"Twelve tools is a size where good descriptions still help considerably, though selection does get harder as the set grows.",
      D:"Nothing forbids implementation notes; they are simply the wrong content for the job."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.1-n", domain:2, ts:"2.1", scenario:1, type:"single",
  stem:"Your `escalate_to_human` tool is described as 'Escalates the conversation to a human agent.' The agent calls it whenever a customer sounds annoyed. Which change addresses this most directly?",
  options:[
    {k:"A", text:"State the conditions that warrant escalation, and that sentiment is not one."},
    {k:"B", text:"Add a required `reason` parameter the agent must fill in."},
    {k:"C", text:"Rename the tool to `escalate_policy_exception`."},
    {k:"D", text:"Remove the tool and have the coordinator decide escalation centrally."}
  ],
  correct:["A"],
  explain:{
    why:"The description says what the tool does but nothing about when it applies, so the agent supplies its own criterion. Naming the legitimate triggers and ruling out sentiment corrects it at the point of decision.",
    distractors:{
      B:"A reason field records the justification without constraining it, so the agent writes 'customer frustrated' and proceeds.",
      C:"A narrower name helps, but it also implies policy exceptions are the only trigger, which excludes a direct customer request.",
      D:"Centralising the decision is a defensible architecture, but it is a large change to fix a description that never stated its criteria."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.1-o", domain:2, ts:"2.1", scenario:6, type:"multi",
  stem:"Which two changes are most likely to improve selection between two similar extraction tools? (Select 2.)",
  options:[
    {k:"A", text:"Naming, in each description, the case that belongs to the other tool."},
    {k:"B", text:"Adding two or three example inputs to each description."},
    {k:"C", text:"Increasing the number of tools so each is narrower."},
    {k:"D", text:"Making both tools return an identical output schema."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both give the model a basis for discriminating: an explicit boundary tells it where one tool ends, and concrete examples let it match a real request against the intended use.",
    distractors:{
      C:"More tools makes the overall selection problem harder, even if each individual tool is easier to describe.",
      D:"A shared output schema simplifies downstream handling but removes a cue that helped distinguish the tools."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.1-p", domain:2, ts:"2.1", scenario:4, type:"single",
  stem:"An MCP tool `semantic_search` is well described and genuinely better than Grep for the task, but the agent still reaches for Grep. Descriptions have been checked. What else should you consider?",
  options:[
    {k:"A", text:"Whether the description says what it does that Grep cannot."},
    {k:"B", text:"Whether MCP tools are given a lower selection priority than the built-in tools."},
    {k:"C", text:"Whether Grep should be removed from this agent's tool set."},
    {k:"D", text:"Whether the MCP server is connected at the time of selection."}
  ],
  correct:["A"],
  explain:{
    why:"A description can be thorough about the tool in isolation and still not explain why it beats the familiar alternative. The comparison is what changes the choice.",
    distractors:{
      C:"Removing Grep would force the issue, but it is a blunt fix that also removes a tool with legitimate uses.",
      B:"There is no built-in priority ordering; both are candidates on the same footing.",
      D:"A disconnected server would mean the tool was absent entirely rather than passed over."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.1-q", domain:2, ts:"2.1", scenario:3, type:"single",
  stem:"A tool's description promises 'returns relevant excerpts', but it actually returns whole documents. Agents built on it consistently overrun their context. Where is the defect?",
  options:[
    {k:"A", text:"In the description, which misstates what the tool returns."},
    {k:"B", text:"In the agent, which should trim results after receiving them."},
    {k:"C", text:"In the context window, which should be enlarged to accommodate the output."},
    {k:"D", text:"In the coordinator, which should invoke the tool less frequently."}
  ],
  correct:["A"],
  explain:{
    why:"Descriptions set expectations for both selection and downstream design. A tool that returns far more than it claims will be chosen in situations it cannot serve, and every consumer plans around the wrong output size.",
    distractors:{
      B:"Trimming afterwards is a reasonable mitigation and worth doing, but it is compensating for a contract that is simply inaccurate.",
      C:"Enlarging the window accommodates the surprise rather than removing it, and the cost recurs on every call.",
      D:"Calling it less often reduces exposure while leaving the misleading contract in place for everyone else."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.1-r", domain:2, ts:"2.1", scenario:1, type:"single",
  stem:"You are writing a description for `get_customer`, which accepts an email, a phone number or an account ID. What belongs in it?",
  options:[
    {k:"A", text:"The accepted identifier forms, and what happens when several customers match."},
    {k:"B", text:"The database table it queries and its indexing strategy."},
    {k:"C", text:"A note that customer data is sensitive and should be handled carefully."},
    {k:"D", text:"The historical reason the tool accepts three identifier types."}
  ],
  correct:["A"],
  explain:{
    why:"The agent needs to know what it may pass in and what an ambiguous result means, because multiple matches require asking for another identifier rather than guessing.",
    distractors:{
      C:"Sensitivity is a real concern, but it belongs in policy and enforcement rather than in the text that drives tool selection.",
      B:"Storage details are invisible to the agent and cannot inform any decision it makes.",
      D:"History explains the design to maintainers and costs tokens on every request to the model."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.1-s", domain:2, ts:"2.1", scenario:5, type:"single",
  stem:"A CI agent has `run_tests`, `run_lint` and `run_build`. It occasionally calls `run_build` when asked to check for type errors. Which description change is most targeted?",
  options:[
    {k:"A", text:"That `run_lint` covers type checking and `run_build` does not."},
    {k:"B", text:"Merging the three into one `run_checks` tool with a mode parameter."},
    {k:"C", text:"Adding a system prompt rule that type errors are always a lint concern."},
    {k:"D", text:"Reordering the tools so `run_lint` appears first."}
  ],
  correct:["A"],
  explain:{
    why:"The confusion is about which tool owns type checking, and that is a boundary question. Saying so in both descriptions resolves it from either direction.",
    distractors:{
      B:"Merging removes the choice but replaces it with a mode argument the agent can get equally wrong.",
      C:"A prompt rule can work, but it puts tool-boundary knowledge somewhere other than the tool definitions, where it is easy to lose.",
      D:"Position in the array is not a reliable selection signal."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.1-t", domain:2, ts:"2.1", scenario:3, type:"single",
  stem:"Why are tool descriptions described as the primary mechanism for selection, rather than tool names?",
  options:[
    {k:"A", text:"A name is a label; the description states applicability and boundaries."},
    {k:"B", text:"Names are not sent to the model, only descriptions are."},
    {k:"C", text:"Names are limited in length and cannot be made descriptive."},
    {k:"D", text:"Names are used only for logging and are ignored during inference."}
  ],
  correct:["A"],
  explain:{
    why:"A good name narrows the space, but only the description can say what the tool handles, what it excludes and how it differs from a neighbour. That is the information a choice requires.",
    distractors:{
      B:"Names are sent and do contribute; they are simply too compressed to carry a boundary.",
      C:"Names can be quite descriptive, though a name long enough to express a boundary would be unwieldy.",
      D:"Names are very much used during inference; the model calls the tool by name."
    }
  },
  refs:[R_TOVR] },

{ id:"d2-2.2-g", domain:2, ts:"2.2", scenario:1, type:"single",
  stem:"A refund tool returns `isError: true` with the message 'Refund failed: customer not eligible'. The agent retries three times before telling the customer there was a system problem. What is missing?",
  options:[
    {k:"A", text:"A category and retryable flag."},
    {k:"B", text:"A longer, more descriptive error message."},
    {k:"C", text:"A retry limit configured in the agent loop."},
    {k:"D", text:"An error code the agent can look up in documentation."}
  ],
  correct:["A"],
  explain:{
    why:"'Failed' covers both a policy decision and a broken backend, and the agent has to choose between retrying and explaining. Category and retryability make that choice deterministic.",
    distractors:{
      B:"Better prose helps the customer-facing explanation but still leaves the retry decision to inference.",
      C:"A limit stops the loop after three attempts, which is what already happened; the customer still gets the wrong explanation.",
      D:"A lookup code moves the classification into documentation the agent has not been given."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.2-h", domain:2, ts:"2.2", scenario:3, type:"single",
  stem:"A search tool returns `isError: true` when a query legitimately matches nothing. What is the consequence for a research coordinator?",
  options:[
    {k:"A", text:"A definitive negative result is treated as a failure and retried pointlessly."},
    {k:"B", text:"The coordinator terminates the whole workflow on the first empty topic."},
    {k:"C", text:"The result is silently dropped and never reaches the coordinator."},
    {k:"D", text:"The search tool is disabled for the remainder of the session."}
  ],
  correct:["A"],
  explain:{
    why:"'No matches' is a valid, informative answer. Dressing it as an error invites retries that will keep returning nothing, and may push the coordinator to fabricate coverage from another source.",
    distractors:{
      B:"Terminating everything is one possible coordinator policy, but the general and more common consequence is wasted retries.",
      C:"An error result is delivered to the coordinator rather than dropped; the problem is how it is labelled.",
      D:"Nothing disables a tool on error; it remains available for the next call."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.2-i", domain:2, ts:"2.2", scenario:1, type:"single",
  stem:"Classify this failure: an MCP tool call fails because the upstream service returned HTTP 503.",
  options:[
    {k:"A", text:"Transient, retryable with backoff."},
    {k:"B", text:"Validation, non-retryable until the input changes."},
    {k:"C", text:"Business, non-retryable and explainable to the customer."},
    {k:"D", text:"Permission, non-retryable until access is granted."}
  ],
  correct:["A"],
  explain:{
    why:"A 503 says the service is temporarily unable to handle the request. The request itself was fine, so backing off and retrying is the appropriate response.",
    distractors:{
      B:"Validation failures come from the request being malformed, which a 503 does not indicate.",
      C:"A business error is a policy outcome about the operation rather than an availability problem.",
      D:"Permission failures return 401 or 403 and would not resolve on retry with the same credentials."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.2-j", domain:2, ts:"2.2", scenario:6, type:"single",
  stem:"An extraction tool rejects a document because a required field is missing from the request. Your error response marks it retryable. What happens?",
  options:[
    {k:"A", text:"The agent retries an identical malformed call until it gives up."},
    {k:"B", text:"The agent corrects the request automatically on the second attempt."},
    {k:"C", text:"The tool queues the request until the missing field becomes available."},
    {k:"D", text:"The retry succeeds, since transient classification triggers a different code path."}
  ],
  correct:["A"],
  explain:{
    why:"Retryable tells the agent the same call may succeed later. A malformed request will fail identically every time, so the flag converts a fixable mistake into a loop.",
    distractors:{
      B:"Nothing in a retryable flag prompts correction; if anything it signals that no change is needed.",
      C:"Queueing is not implied by retryability and is not a behaviour the tool provides here.",
      D:"Classification is metadata for the agent, not a switch that alters how the tool executes."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.2-k", domain:2, ts:"2.2", scenario:1, type:"single",
  stem:"A business-rule rejection returns `retriable: false` and the message 'Policy violation, code RF-17'. The agent relays that verbatim to the customer. What should the response also carry?",
  options:[
    {k:"A", text:"A customer-friendly explanation the agent can pass on directly."},
    {k:"B", text:"The full policy text so the agent can quote the relevant clause."},
    {k:"C", text:"A link to the internal policy management system."},
    {k:"D", text:"The identity of the rule author for follow-up questions."}
  ],
  correct:["A"],
  explain:{
    why:"The agent is the last hop before the customer, so the error has to contain something a customer can understand. Otherwise an internal code reaches them unchanged.",
    distractors:{
      B:"Full policy text is a lot of context per error and invites the agent to interpret clauses it should not be interpreting.",
      C:"An internal link is meaningless to the customer and a small information leak.",
      D:"Rule ownership matters for internal escalation, not for the reply the customer receives."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.2-l", domain:2, ts:"2.2", scenario:3, type:"single",
  stem:"A subagent's tool times out. The subagent retries twice, succeeds, and returns results. What should it tell the coordinator about the timeouts?",
  options:[
    {k:"A", text:"Nothing; the failure was resolved locally and needs no coordinator decision."},
    {k:"B", text:"The full retry log, so the coordinator has complete visibility."},
    {k:"C", text:"A warning, so the coordinator can decide whether to trust the results."},
    {k:"D", text:"An error alongside the results, so the run is marked degraded."}
  ],
  correct:["A"],
  explain:{
    why:"Propagate what the coordinator must act on. A resolved transient failure requires no decision, and reporting it spends context on noise while inviting unnecessary recovery.",
    distractors:{
      C:"The results are complete and correct, so trust is not in question; the retries succeeded.",
      B:"Retry detail belongs in telemetry, where it supports operational analysis without consuming the coordinator's context.",
      D:"Marking a successful run degraded would misrepresent its coverage in the final report."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.2-m", domain:2, ts:"2.2", scenario:1, type:"single",
  stem:"A file-read tool returns the same generic error for 'file not found', 'permission denied' and 'path is a directory'. How does this affect the agent?",
  options:[
    {k:"A", text:"It cannot choose between fixing the path, escalating, or listing."},
    {k:"B", text:"It stops using the tool entirely after the first failure."},
    {k:"C", text:"It treats the file as empty and proceeds without noticing."},
    {k:"D", text:"It retries indefinitely, since no error is marked terminal."}
  ],
  correct:["A"],
  explain:{
    why:"Each of those three causes has a different remedy, and all three are recoverable. A single message collapses them, so the agent guesses which recovery to attempt.",
    distractors:{
      D:"Retrying is one guess it might make, but the general problem is that no recovery can be chosen on the information given.",
      B:"Abandoning the tool is unusual behaviour and not the typical consequence of an ambiguous error.",
      C:"An explicit error, however vague, is not the same as an empty result, so the agent knows something failed."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.2-n", domain:2, ts:"2.2", scenario:5, type:"single",
  stem:"Which error response best supports an agent deciding what to do next?",
  options:[
    {k:"A", text:"`{errorCategory, isRetryable, message}`"},
    {k:"B", text:"`{error: 'Request could not be completed at this time'}`"},
    {k:"C", text:"`{error: true, code: 5031, trace: '...'}`"},
    {k:"D", text:"`{status: 'failed', retry: 'maybe'}`"}
  ],
  correct:["A"],
  explain:{
    why:"It answers the three questions the agent has: what kind of failure, whether another attempt could succeed, and what actually happened. Each field maps onto a decision.",
    distractors:{
      B:"Polite and human-readable, but it conveys neither category nor retryability, so the agent still has to guess.",
      C:"A numeric code and stack trace serve an engineer reading logs, not an agent choosing a recovery.",
      D:"'Maybe' is not a decision the agent can act on, and no category is given."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.2-o", domain:2, ts:"2.2", scenario:1, type:"multi",
  stem:"Which two error categories should normally be marked non-retryable? (Select 2.)",
  options:[
    {k:"A", text:"A business-rule violation, such as a refund outside the return window."},
    {k:"B", text:"A validation failure caused by a malformed argument."},
    {k:"C", text:"A gateway timeout from an overloaded upstream service."},
    {k:"D", text:"A rate limit response asking the caller to slow down."}
  ],
  correct:["A","B"],
  explain:{
    why:"Both fail deterministically. The policy will still be violated and the argument will still be malformed on a second identical attempt, so retrying spends calls to reach the same answer.",
    distractors:{
      C:"An overloaded service is the archetypal transient failure and often succeeds after a short backoff.",
      D:"A rate limit is explicitly an invitation to retry later, provided the caller backs off."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.2-p", domain:2, ts:"2.2", scenario:3, type:"single",
  stem:"A subagent cannot reach a source repository at all. It returns `{results: [], status: 'ok'}`. What is the consequence for the final report?",
  options:[
    {k:"A", text:"The topic appears researched and empty, when it was never actually searched."},
    {k:"B", text:"The coordinator retries the subagent repeatedly until it returns a non-empty result set."},
    {k:"C", text:"The synthesis step raises an error on receiving an empty result set."},
    {k:"D", text:"The report is annotated as having incomplete coverage for that topic."}
  ],
  correct:["A"],
  explain:{
    why:"Reporting failure as success is the most dangerous of the error anti-patterns, because it removes any chance of recovery and produces a report that silently claims coverage it does not have.",
    distractors:{
      B:"A success status gives the coordinator no reason to retry anything.",
      C:"An empty result is a legitimate outcome, so synthesis has no basis for treating it as an error.",
      D:"Coverage annotation requires knowing the topic failed, which this response conceals."
    }
  },
  refs:[R_SUB] },

{ id:"d2-2.2-q", domain:2, ts:"2.2", scenario:5, type:"single",
  stem:"A CI tool returns an error when the linter finds violations. The agent reports 'the linter failed to run'. What is the design mistake?",
  options:[
    {k:"A", text:"Findings are being signalled as tool failure rather than as results."},
    {k:"B", text:"The linter should not be exposed as a tool at all."},
    {k:"C", text:"The error message is not detailed enough about the violations."},
    {k:"D", text:"The agent should simply be instructed that linter errors always mean violations."}
  ],
  correct:["A"],
  explain:{
    why:"A linter that finds problems has done its job. Returning that as an error conflates 'the tool did not work' with 'the tool worked and found something', which is exactly the distinction the error flag exists to preserve.",
    distractors:{
      C:"More detail in the message would help the report read better while leaving the category wrong.",
      D:"A special-case instruction papers over a contract that is simply inverted, and every new consumer has to learn the same exception.",
      B:"Exposing a linter as a tool is entirely reasonable; the problem is what it returns."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.2-r", domain:2, ts:"2.2", scenario:3, type:"single",
  stem:"An engineer proposes that the MCP server retry internally on transient failures, so the agent never sees them. What is the trade-off?",
  options:[
    {k:"A", text:"It simplifies the agent but hides latency and removes its options."},
    {k:"B", text:"It violates the MCP specification, which forbids server-side retries."},
    {k:"C", text:"It has no downside and should always be preferred."},
    {k:"D", text:"It prevents the agent from ever receiving any successful results."}
  ],
  correct:["A"],
  explain:{
    why:"Internal retries are often the right call for brief blips. The cost is that a call may now block for a long time, and the agent loses the option to try a different source instead of waiting.",
    distractors:{
      C:"Silent retries have a real cost in latency and lost optionality, so 'always' is too strong.",
      B:"Nothing in the protocol forbids a server retrying its own upstream.",
      D:"Successful results are returned normally; only the intermediate failures are hidden."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.2-s", domain:2, ts:"2.2", scenario:1, type:"single",
  stem:"Why does a uniform 'Operation failed' response prevent good agent behaviour, even when it is accurate?",
  options:[
    {k:"A", text:"Recovery depends on the failure kind, which the message omits."},
    {k:"B", text:"The agent cannot parse failure messages that lack structured fields."},
    {k:"C", text:"Uniform messages are rejected by the MCP transport layer."},
    {k:"D", text:"The agent will interpret any unstructured failure message as a success and continue."}
  ],
  correct:["A"],
  explain:{
    why:"Truthfulness is not the issue; usefulness is. Retry, correct-and-resubmit, explain-to-the-customer and escalate are four different responses, and choosing between them requires knowing which failure occurred.",
    distractors:{
      B:"The agent reads prose perfectly well; the message simply does not contain the distinguishing information.",
      C:"The transport carries whatever content the server returns.",
      D:"An error flag is still set, so the agent knows the call failed."
    }
  },
  refs:[R_MCP] },

{ id:"d2-2.2-t", domain:2, ts:"2.2", scenario:6, type:"single",
  stem:"An extraction subagent fails on 3 of 50 documents and returns only the 47 successes. The coordinator reports 100% completion. What should the subagent have returned?",
  options:[
    {k:"A", text:"The 47 results plus an explicit record of the 3 failures and why."},
    {k:"B", text:"An error for the whole batch, since it did not fully succeed."},
    {k:"C", text:"The 47 results, with the remaining 3 retried silently until they succeed."},
    {k:"D", text:"Placeholder records for the 3, so downstream counts stay consistent."}
  ],
  correct:["A"],
  explain:{
    why:"Partial success is the normal outcome of batch work, and it is only usable if the gaps are visible. Naming the three and the reason lets the coordinator decide between retrying, escalating and proceeding.",
    distractors:{
      B:"Failing the whole batch discards 47 good extractions over 3 problems.",
      C:"Indefinite silent retries block the batch on documents that may never succeed.",
      D:"Placeholders keep the arithmetic tidy while corrupting the data, which is worse than a visible gap."
    }
  },
  refs:[R_MCP] },
