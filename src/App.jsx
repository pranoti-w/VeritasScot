import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

// --- Smarter mock data with tags ---
const MOCK_SOURCES = [
  {
    id: 1,
    title: "Affordable Housing Supply Programme 2023–2026",
    url: "https://www.gov.scot/publications/affordable-housing-supply-programme/",
    summary: "Government initiative funding affordable and social housing units.",
    tags: ["housing", "home", "affordable", "rent", "construction"]
  },
  {
    id: 2,
    title: "Scottish Child Payment Expansion Policy",
    url: "https://www.gov.scot/policies/social-security/child-benefit/",
    summary: "Expands child payment support and family benefit access in Scotland.",
    tags: ["child", "family", "benefit", "support", "welfare"]
  },
  {
    id: 3,
    title: "National Planning Framework 4 (NPF4)",
    url: "https://www.gov.scot/publications/national-planning-framework-4/",
    summary: "Sets national priorities for housing, infrastructure, and sustainability.",
    tags: ["planning", "infrastructure", "housing", "policy"]
  },
  {
    id: 4,
    title: "Climate Change Plan 2028–2032",
    url: "https://www.gov.scot/policies/climate-change/",
    summary: "Scotland’s strategy to reduce carbon emissions and promote green energy.",
    tags: ["climate", "environment", "emissions", "net zero", "green"]
  },
  {
    id: 5,
    title: "Health and Social Care Integration Framework",
    url: "https://www.gov.scot/policies/health-and-social-care/",
    summary: "Framework for improving coordination between health and social care services.",
    tags: ["health", "care", "NHS", "social", "wellbeing"]
  },
  {
    id: 6,
    title: "Education Reform Consultation 2024",
    url: "https://www.gov.scot/policies/education-reform/",
    summary: "Consultation outlining Scotland’s education reform strategy and funding.",
    tags: ["education", "school", "university", "students", "learning"]
  }
];

// --- Generate a unique case ID ---
let nextCaseId = 1001;
function generateCaseId() { return `VS-${nextCaseId++}`; }

// --- Top Navigation ---
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

// --- Home Page ---
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

// --- Smarter Verify Page ---
function Verify({ onCreateCase }) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);

  // --- Smarter matching function ---
  function findRelevantSources(claimText) {
    const claim = claimText.toLowerCase();
    const matches = MOCK_SOURCES.filter(source =>
      source.tags.some(tag => claim.includes(tag))
    );

    if (matches.length === 0) {
      // fallback if nothing matches
      return MOCK_SOURCES.slice(0, 2);
    }

    return matches;
  }

  function submitClaim(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setStatus('verifying');
    setResult(null);

    setTimeout(() => {
      const evidence = findRelevantSources(input);
      const verdicts = ['True', 'Partly true', 'Unsupported', 'False'];
      const verdict = verdicts[Math.floor(Math.random() * verdicts.length)];
      const confidence = Math.round(60 + Math.random() * 40);

      setResult({
        claim: input,
        verdict,
        confidence,
        evidence,
        timestamp: new Date().toISOString()
      });

      setStatus('done');
    }, 1000 + Math.random() * 1000);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold">Verify a claim</h2>
      <p className="mt-2 text-slate-600">Paste text, a URL, or upload a screenshot (mock). The demo performs a simulated verification and returns an evidence card.</p>

      <form onSubmit={submitClaim} className="mt-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          className="w-full border rounded-md p-3"
          placeholder="e.g. 'The council has abolished emergency housing support'"
        />
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

// --- Evidence Card ---
function EvidenceCard({ result, onCreateCase }) {
  const [creating, setCreating] = useState(false);

  function raiseConcern() {
    setCreating(true);
    setTimeout(() => {
      const caseObj = {
        id: generateCaseId(),
        claim: result.claim,
        verdict: result.verdict,
        confidence: result.confidence,
        evidence: result.evidence,
        createdAt: new Date().toISOString(),
        status: 'Open',
        assignedTo: 'Constituency Office'
      };
      onCreateCase(caseObj);
      setCreating(false);
      alert(`Concern raised — case ${caseObj.id} created and routed to ${caseObj.assignedTo}`);
    }, 800 + Math.random() * 400);
  }

  return (
    <div className="p-5 bg-white border rounded-lg mt-6">
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
          {result.evidence.map(ev => {
            // find tags that match this claim
            const matchedTags = ev.tags.filter(tag => result.claim.toLowerCase().includes(tag));
            return (
              <li key={ev.id} className="p-3 border rounded-md">
                <a href={ev.url} target="_blank" rel="noreferrer" className="font-medium text-scotblue">{ev.title}</a>
                <div className="text-sm text-slate-600 mt-1">{ev.summary}</div>
                {matchedTags.length > 0 && (
                  <div className="mt-1 text-xs text-green-600">Matched tags: {matchedTags.join(", ")}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={raiseConcern} disabled={creating} className="px-4 py-2 rounded-md bg-rose-600 text-white">Raise concern</button>
      </div>
    </div>
  );
}

// --- Raise Concern Page ---
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

// --- Dashboard Page ---
function Dashboard({ cases }) {
  const total = cases.length;
  const open = cases.filter(c => c.status === 'Open').length;
  const resolved = cases.filter(c => c.status === 'Resolved').length;
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="text-slate-600 mt-2">Overview of recent cases and simple analytics for demo purposes.</p>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatCard title="Total cases" value={total} />
        <StatCard title="Open" value={open} />
        <StatCard title="Resolved" value={resolved} />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="p-4 bg-white border rounded-lg">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [cases, setCases] = useState([]);

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
        </Routes>
      </div>
    </Router>
  );
}
