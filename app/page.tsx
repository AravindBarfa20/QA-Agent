import { getSetupStatus } from "../lib/setup-status";

function State({ value }: { value: "configured" | "needs_configuration" }) {
  return <span className={value === "configured" ? "state ready" : "state pending"}>{value === "configured" ? "Connected" : "Setup needed"}</span>;
}

export default function Home() {
  const setup = getSetupStatus(process.env);
  const ready = setup.githubApp === "configured" && setup.runner === "configured";

  return <main>
    <nav><a href="#top" className="logo">WATCHER <em>QA</em></a><span>Human-approved engineering agents</span></nav>
    <section id="top" className="hero">
      <p className="eyebrow">AUTONOMOUS QA · HUMAN AUTHORITY</p>
      <h1>Find bugs. Prove fixes. Open a PR only when you approve.</h1>
      <p className="lede">Watcher QA runs repository checks in an isolated worker, turns evidence into a proposed patch, and keeps every write action behind an explicit human decision.</p>
      <div className="actions"><a className="primary" href="#setup">Configure production connections</a><a className="secondary" href="#workflow">See workflow</a></div>
    </section>
    <section className="grid" aria-label="Product capabilities">
      <article><b>01</b><h2>Repository intelligence</h2><p>GitHub App installation grants a short-lived, scoped token for the selected repository.</p></article>
      <article><b>02</b><h2>Isolated investigation</h2><p>Each job is pinned to an immutable commit and starts read-only with restricted networking.</p></article>
      <article><b>03</b><h2>Human approval</h2><p>A patch cannot become a branch or pull request until a named reviewer approves the exact proposal.</p></article>
    </section>
    <section id="workflow" className="workflow"><p className="eyebrow">WORKFLOW</p><div><span>Connect</span><i>→</i><span>Audit</span><i>→</i><span>Evidence</span><i>→</i><strong>Approve fix</strong><i>→</i><span>Pull request</span><i>→</i><span>CI verify</span></div></section>
    <section id="setup" className="setup"><div><p className="eyebrow">PRODUCTION READINESS</p><h2>{ready ? "Watcher QA is ready to receive audited repositories." : "Connect the two production services."}</h2><p>Secrets stay server-side; this screen exposes only connection state.</p></div><dl><div><dt>GitHub App</dt><dd><State value={setup.githubApp}/></dd></div><div><dt>Sandbox runner</dt><dd><State value={setup.runner}/></dd></div></dl></section>
    <section className="guardrails"><p className="eyebrow">NON-NEGOTIABLE GUARDRAILS</p><ul><li>Immutable commit SHA, non-root runner, resource limits</li><li>Read-only checkout and restricted network during investigation</li><li>Exact proposed patch reviewed before branch/PR creation</li><li>CI evidence retained with the approval decision</li></ul></section>
  </main>;
}
