import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

// Mock sources
const MOCK_SOURCES = [
  { id: "govscot-1", title: "Scottish Government Guidance: Local Housing Policy (2024)", url: "https://www.gov.scot/publications/local-housing-policy-2024", excerpt: "Local authorities should consider flexible tenancy arrangements in certain circumstances..." },
  { id: "legislation-1", title: "Housing (Scotland) Act 1987 — Section 4", url: "https://www.legislation.gov.uk/ukpga/1987/26/section/4", excerpt: "Local authority duties include accommodation for those in priority need..." },
  { id: "ons-1", title: "ONS: Household projections 2023", url: "https://www.ons.gov.uk/householdprojections2023", excerpt: "Projected increase in single-occupancy households across Scotland by 2030..." },
];

let nextCaseId = 1001;
function generateCaseId() { return `VS-${nextCaseId++}`; }

function TopNav() {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-semibold text-slate-800">VeritasScot</Link>
          <span className="text-sm text-slate-500">Fìor-fhiosrachadh — Trusted civic information for every Scot</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/verify" className="px-3 py-2 rounded-md bg-scotblue text-white text-sm">Verify a claim</Link>
          <Link to="/raise" className="px-3 py-2 rounded-md border text-sm">Raise a concern</Link>
          <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}

function Home() {
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="rounded-2xl bg-gradient-to-r from-white to-slate-50 p-8 shadow-lg">
        <h1 className="text-3xl font-bold">VeritasScot — Fìor-fhiosrachadh</h1>
        <p className="mt-3 text-slate-700">Paste a claim or URL, get an evidence card referencing primary sources, then choose to get help from your MP, council or regulator with one click.</p>

        <div className="mt-6 flex gap-3">
          <button onClick={() => navigate('/verify')} className="px-5 py-3 rounded-md bg-scotblue text-white">Try it now — verify a claim</button>
          <button onClick={() => navigate('/raise')} className="px-5 py-3 rounded-md border">Raise a concern</button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <Feature title="Authoritative sources">Scotland-first source index (legislation, guidance, datasets)</Feature>
          <Feature title="Evidence cards">Short verdicts with primary-document links</Feature>
          <Feature title="One-click action">Pre-filled reports routed to the right office</Feature>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Demo walkthrough</h2>
        <ol className="list-decimal ml-6 mt-3 text-slate-700">
          <li>Paste a claim into the Verify page.</li>
          <li>The system runs a mocked verification (NLP + source matching simulation).</li>
          <li>View the evidence card; if you want action, click Raise Concern.</li>
          <li>Dashboard lets MPs/staff view cases and trends.</li>
        </ol>
      </section>
    </div>
  );
}

function Feature({ title, children }) {
  return (
    <div className="p-4 bg-white rounded-lg border">
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-slate-600 mt-2">{children}</p>
    </div>
  );
}

function Verify({ onCreateCase }) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);

  function submitClaim(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setStatus('verifying');
    setResult(null);

    setTimeout(() => {
      const verdicts = ['True', 'Partly true', 'Unsupported', 'False'];
      const verdict = verdicts[Math.floor(Math.random() * verdicts.length)];
      const matched = MOCK_SOURCES.slice(0, Math.ceil(Math.random() * MOCK_SOURCES.length));
      const evidence = matched.map(s => ({ ...s, relevance: Math.round(Math.random() * 100) }));
      const confidence = Math.round(60 + Math.random() * 40);
      const res = { claim: input, verdict, confidence, evidence, timestamp: new Date().toISOString() };
      setResult(res);
      setStatus('done');
    }, 1500 + Math.random() * 1200);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold">Verify a claim</h2>
      <p className="mt-2 text-slate-600">Paste text, a URL, or upload a screenshot (mock). The demo performs a simulated verification and returns an evidence card.</p>

      <form onSubmit={submitClaim} className="mt-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5} className="w-full border rounded-md p-3" placeholder="e.g. 'The council has abolished emergency housing support'"></textarea>
        <div className="mt-3 flex gap-3">
          <button type="submit" className="px-4 py-2 rounded-md bg-scotblue text-white">Run verification</button>
          <button type="button" onClick={() => { setInput(''); setResult(null); setStatus('idle'); }} className="px-4 py-2 rounded-md border">Reset</button>
        </div>
      </form>

      <div className="mt-6">
        {status === 'verifying' && (
          <div className="p-4 bg-white border rounded-md flex items-center gap-4">
            <div className="animate-pulse w-10 h-10 bg-slate-200 rounded-full" />
            <div>
              <div className="font-medium">Verifying claim...</div>
              <div className="text-sm text-slate-500">Matching against legislation, guidance and datasets</div>
            </div>
          </div>
        )}

        {status === 'done' && result && (
          <EvidenceCard result={result} onCreateCase={onCreateCase} />
        )}
      </div>
    </div>
  );
}

function EvidenceCard({ result, onCreateCase }) {
  const [creating, setCreating] = useState(false);

  function raiseConcern() {
    setCreating(true);
    setTimeout(() => {
      const caseObj = { id: generateCaseId(), claim: result.claim, verdict: result.verdict, confidence: result.confidence, evidence: result.evidence, createdAt: new Date().toISOString(), status: 'Open', assignedTo: 'Constituency Office' };
      onCreateCase(caseObj);
      setCreating(false);
      alert(`Concern raised — case ${caseObj.id} created and routed to ${caseObj.assignedTo}`);
    }, 800 + Math.random() * 400);
  }

  return (
    <div className="p-5 bg-white border rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">Verdict</div>
          <div className="mt-1 text-2xl font-bold">{result.verdict}</div>
          <div className="text-sm text-slate-600">Confidence: {result.confidence}%</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500">Time</div>
          <div className="mt-1 text-sm text-slate-600">{new Date(result.timestamp).toLocaleString()}</div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-medium">Primary sources matched</h4>
        <ul className="mt-2 space-y-2">
          {result.evidence.map(ev => (
            <li key={ev.id} className="p-3 border rounded-md">
              <a href={ev.url} target="_blank" rel="noreferrer" className="font-medium text-scotblue">{ev.title}</a>
              <div className="text-sm text-slate-600 mt-1">{ev.excerpt}</div>
              <div className="text-xs text-slate-500 mt-1">Relevance: {ev.relevance}%</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={raiseConcern} disabled={creating} className="px-4 py-2 rounded-md bg-rose-600 text-white">Raise concern</button>
        <a href="#" onClick={(e) => e.preventDefault()} className="px-4 py-2 rounded-md border">Share</a>
        <a href="#" onClick={(e) => e.preventDefault()} className="px-4 py-2 rounded-md border">Download evidence</a>
      </div>
    </div>
  );
}

function RaiseConcern({ prefill, onCreateCase }) {
  const [form, setForm] = useState({ name: '', email: '', constituency: 'Your constituency', claim: prefill?.claim || '', details: '' });

  function submit(e) {
    e.preventDefault();
    const c = { id: generateCaseId(), claim: form.claim, details: form.details, createdAt: new Date().toISOString(), status: 'Open', assignedTo: 'Constituency Office', reporter: { name: form.name, email: form.email } };
    onCreateCase(c);
    alert(`Concern submitted — case ${c.id}`);
    setForm({ name: '', email: '', constituency: 'Your constituency', claim: '', details: '' });
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold">Raise a concern</h2>
      <p className="text-slate-600 mt-2">This demo pre-fills the claim when you come from a verified result. Cases are routed automatically and receive a public case number.</p>

      <form onSubmit={submit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm text-slate-600">Your name</label>
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm text-slate-600">Your email</label>
          <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm text-slate-600">Claim</label>
          <textarea value={form.claim} onChange={e => setForm({...form, claim: e.target.value})} className="w-full border rounded-md p-2" rows={3} />
        </div>
        <div>
          <label className="block text-sm text-slate-600">Details (what outcome do you want?)</label>
          <textarea value={form.details} onChange={e => setForm({...form, details: e.target.value})} className="w-full border rounded-md p-2" rows={4} />
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-md bg-scotblue text-white">Submit concern</button>
          <button type="button" onClick={() => setForm({ name: '', email: '', constituency: 'Your constituency', claim: '', details: '' })} className="px-4 py-2 rounded-md border">Reset</button>
        </div>
      </form>
    </div>
  );
}

function Dashboard({ cases }) {
  const total = cases.length;
  const open = cases.filter(c => c.status === 'Open').length;
  const resolved = cases.filter(c => c.status === 'Resolved').length;
  const byDay = cases.reduce((acc, c) => { const d = new Date(c.createdAt).toISOString().slice(0,10); acc[d] = (acc[d] || 0) + 1; return acc; }, {});
  const days = Object.keys(byDay).sort();
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="text-slate-600 mt-2">Overview of recent cases and simple analytics for demo purposes.</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatCard title="Total cases" value={total} />
        <StatCard title="Open" value={open} />
        <StatCard title="Resolved" value={resolved} />
      </div>

      <div className="mt-6 bg-white border rounded-lg p-4">
        <h3 className="font-medium">Cases</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-sm text-slate-500 border-b">
              <tr>
                <th className="py-2">Case</th>
                <th>Claim</th>
                <th>Assigned</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {cases.map(c => (
                <tr key={c.id} className="border-b text-sm">
                  <td className="py-2 font-medium">{c.id}</td>
                  <td className="max-w-xl truncate">{c.claim}</td>
                  <td>{c.assignedTo}</td>
                  <td>{c.status}</td>
                  <td className="text-xs text-slate-500">{new Date(c.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-white border rounded-lg p-4">
        <h3 className="font-medium">Recent trend (cases per day)</h3>
        <div className="mt-4">
          <MiniBarChart data={days.map(d => ({ day: d, value: byDay[d] }))} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) { return (<div className="p-4 bg-white border rounded-lg"><div className="text-sm text-slate-500">{title}</div><div className="mt-2 text-2xl font-bold">{value}</div></div>); }

function MiniBarChart({ data }) {
  const max = Math.max(1, ...data.map(d => d.value));
  return (
    <div className="flex items-end gap-2 h-36">
      {data.map(d => (
        <div key={d.day} className="flex-1 text-center">
          <div style={{ height: `${(d.value/max) * 100}%` }} className="mx-auto w-6 rounded-t-md bg-slate-800" />
          <div className="text-xs mt-2">{d.day.slice(5)}</div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [cases, setCases] = useState([
    { id: generateCaseId(), claim: 'Council reduced emergency housing support in April', status: 'Open', assignedTo: 'Housing Team', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    { id: generateCaseId(), claim: 'New guidance requires all local authorities to adopt flexible tenancies', status: 'Resolved', assignedTo: 'Constituency Office', createdAt: new Date().toISOString() },
  ]);

  function addCase(c) { setCases(prev => [c, ...prev]); }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <TopNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verify" element={<Verify onCreateCase={addCase} />} />
          <Route path="/raise" element={<RaiseConcern onCreateCase={addCase} prefill={null} />} />
          <Route path="/dashboard" element={<Dashboard cases={cases} />} />
          <Route path="*" element={<Home />} />
        </Routes>

        <footer className="mt-8 border-t bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500">Demo — VeritasScot prototype • Not for production • Data is mocked for the pitch</div>
        </footer>
      </div>
    </Router>
  );
}
