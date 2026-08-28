/* ============================================================================
   CCAR-F Architect Trainer
   Standalone study + assessment app for the Claude Certified Architect
   Foundations exam. No network calls; all content is inline. Progress is
   persisted to localStorage and can be exported/imported as JSON.
   ============================================================================ */

"use strict";

/* --- Blueprint taxonomy (from the official exam guide, v1.0 July 2026) --- */

const DOMAINS = [
  { d:1, name:"Agentic Architecture & Orchestration", weight:27, exam:16 },
  { d:2, name:"Tool Design & MCP Integration",        weight:18, exam:11 },
  { d:3, name:"Claude Code Configuration & Workflows",weight:20, exam:12 },
  { d:4, name:"Prompt Engineering & Structured Output",weight:20, exam:12 },
  { d:5, name:"Context Management & Reliability",     weight:15, exam:9  }
];

const TASKS = [
  { ts:"1.1", d:1, name:"Design and implement agentic loops" },
  { ts:"1.2", d:1, name:"Orchestrate coordinator-subagent systems" },
  { ts:"1.3", d:1, name:"Subagent invocation, context passing, spawning" },
  { ts:"1.4", d:1, name:"Multi-step workflows: enforcement and handoff" },
  { ts:"1.5", d:1, name:"Agent SDK hooks for interception and normalisation" },
  { ts:"1.6", d:1, name:"Task decomposition strategies" },
  { ts:"1.7", d:1, name:"Session state, resumption, and forking" },
  { ts:"2.1", d:2, name:"Tool interfaces, descriptions, and boundaries" },
  { ts:"2.2", d:2, name:"Structured error responses for MCP tools" },
  { ts:"2.3", d:2, name:"Tool distribution and tool_choice configuration" },
  { ts:"2.4", d:2, name:"Integrating MCP servers into Claude Code" },
  { ts:"2.5", d:2, name:"Selecting built-in tools effectively" },
  { ts:"3.1", d:3, name:"CLAUDE.md hierarchy, scoping, modular organisation" },
  { ts:"3.2", d:3, name:"Custom slash commands and skills" },
  { ts:"3.3", d:3, name:"Path-specific rules for conditional loading" },
  { ts:"3.4", d:3, name:"Plan mode vs direct execution" },
  { ts:"3.5", d:3, name:"Iterative refinement techniques" },
  { ts:"3.6", d:3, name:"Claude Code in CI/CD pipelines" },
  { ts:"4.1", d:4, name:"Explicit criteria to reduce false positives" },
  { ts:"4.2", d:4, name:"Few-shot prompting for consistency" },
  { ts:"4.3", d:4, name:"Structured output via tool use and JSON schemas" },
  { ts:"4.4", d:4, name:"Validation, retry, and feedback loops" },
  { ts:"4.5", d:4, name:"Efficient batch processing strategies" },
  { ts:"4.6", d:4, name:"Multi-instance and multi-pass review architectures" },
  { ts:"5.1", d:5, name:"Managing conversation context over long interactions" },
  { ts:"5.2", d:5, name:"Escalation and ambiguity resolution" },
  { ts:"5.3", d:5, name:"Error propagation across multi-agent systems" },
  { ts:"5.4", d:5, name:"Context in large codebase exploration" },
  { ts:"5.5", d:5, name:"Human review workflows and confidence calibration" },
  { ts:"5.6", d:5, name:"Provenance and uncertainty in multi-source synthesis" }
];

const SCENARIOS = {
  1:{ t:"Customer Support Resolution Agent",
      b:"You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom Model Context Protocol (MCP) tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate." },
  2:{ t:"Code Generation with Claude Code",
      b:"You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution." },
  3:{ t:"Multi-Agent Research System",
      b:"You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialised subagents: one searches the web, one analyses documents, one synthesises findings, and one generates reports. The system researches topics and produces comprehensive, cited reports." },
  4:{ t:"Developer Productivity with Claude",
      b:"You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol (MCP) servers." },
  5:{ t:"Claude Code for Continuous Integration",
      b:"You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimise false positives." },
  6:{ t:"Structured Data Extraction",
      b:"You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems." }
};

const BLUEPRINT = { 1:16, 2:11, 3:12, 4:12, 5:9 };
const GATE = 0.85;          /* mastery threshold, per task statement */
const WINDOW_TS = 12;       /* recency window, task statement */
const WINDOW_D  = 25;       /* recency window, domain */
const DECAY = 0.85;         /* recency weight base */
const MIN_ATTEMPTS = 10;    /* attempts needed before mastery can be awarded */
const MIN_DISTINCT = 8;     /* distinct questions needed before mastery */
/* Raised from 6/4 when the bank grew to 20 questions per task statement.
   Against a 6-item pool, 4 distinct was two thirds of the material; against
   20 it would have been a fifth, so "mastered" could have been awarded on a
   narrow slice. 8 of 20 keeps the guarantee proportionate. */
