import { useState } from "react";
import "./App.css";

const DOC_TYPES = [
  { key: "cv", label: "CV", group: "resume", price: 1000, blurb: "Professional CV for job applications" },
  { key: "studentcv", label: "Student CV", group: "resume", price: 800, blurb: "For internships & first jobs" },
  { key: "coverletter", label: "Cover Letter", group: "letter", price: 1000, blurb: "Pairs with your CV" },
  { key: "applicationletter", label: "Application Letter", group: "letter", price: 700, blurb: "General job or school application" },
  { key: "businessprofile", label: "Business Profile", group: "business", price: 3000, blurb: "For small businesses" },
];

function emptyForm() {
  return {
    name: "", phone: "", location: "", email: "",
    summary: "", education: "", experience: "", skills: "",
    recipient: "", position: "", body: "",
    businessName: "", ownerName: "", description: "", services: "",
  };
}

export default function App() {
  const [view, setView] = useState("customer"); // customer | admin
  const [step, setStep] = useState("select"); // select | build
  const [docType, setDocType] = useState(null);
  const [template, setTemplate] = useState("classic"); // classic | modern
  const [f, setF] = useState(emptyForm());
  const [ref, setRef] = useState("");
  const [orders, setOrders] = useState([]);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [showTerms, setShowTerms] = useState(false);

  const doc = DOC_TYPES.find((d) => d.key === docType);
  const currentOrder = orders.find((o) => o.id === currentOrderId);
  const isApproved = currentOrder?.status === "approved";

  const update = (key) => (e) => setF({ ...f, [key]: e.target.value });
  const show = (val, fallback) => (val && val.trim() ? val : fallback);

  function chooseDoc(key) {
    setDocType(key);
    setF(emptyForm());
    setRef("");
    setCurrentOrderId(null);
    setStep("build");
  }

  function submitPayment() {
    if (!ref.trim()) return;
    const id = Date.now();
    setOrders([...orders, {
      id, docType, label: doc.label, price: doc.price,
      customer: f.name || "Unnamed", ref: ref.trim(), status: "pending",
    }]);
    setCurrentOrderId(id);
  }

  function approve(id) {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "approved" } : o)));
  }

  if (view === "admin") {
    return (
      <div className="page">
        <TopBar view={view} setView={setView} />
        <main className="admin">
          <h2>Orders</h2>
          <p className="lede">Check the payment reference against your MoMo/Airtel statement before approving.</p>
          {orders.length === 0 && <p className="hint">No orders yet.</p>}
          <table className="orders">
            <thead>
              <tr><th>Customer</th><th>Document</th><th>Price</th><th>Reference</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.customer}</td>
                  <td>{o.label}</td>
                  <td>{o.price} RWF</td>
                  <td>{o.ref}</td>
                  <td><span className={`badge ${o.status}`}>{o.status}</span></td>
                  <td>{o.status === "pending" && <button className="small" onClick={() => approve(o.id)}>Approve</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    );
  }

  if (step === "select") {
    return (
      <div className="page">
        <TopBar view={view} setView={setView} />
        <main className="select">
          <h2>What do you need today?</h2>
          <p className="lede">Pick one — you'll fill a short form and see it build live.</p>
          <div className="cards">
            {DOC_TYPES.map((d) => (
              <button key={d.key} className="doc-card" onClick={() => chooseDoc(d.key)}>
                <span className="doc-label">{d.label}</span>
                <span className="doc-blurb">{d.blurb}</span>
                <span className="doc-price">{d.price} RWF</span>
              </button>
            ))}
          </div>
        </main>
        <Footer setShowTerms={setShowTerms} />
        {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      </div>
    );
  }

  return (
    <div className="page">
      <TopBar view={view} setView={setView} />
      <main className="layout wide">
        <section className="panel">
          <button className="back" onClick={() => setStep("select")}>&larr; Change document type</button>
          <p className="step">{doc.label.toUpperCase()}</p>
          <h2>Enter your details</h2>
          <p className="lede">Your document builds itself on the right as you type.</p>

          {doc.group === "resume" && (
            <>
              <div className="template-toggle">
                <button className={template === "classic" ? "active" : ""} onClick={() => setTemplate("classic")}>Classic</button>
                <button className={template === "modern" ? "active" : ""} onClick={() => setTemplate("modern")}>Modern</button>
              </div>
              <label>Full name</label>
              <input value={f.name} onChange={update("name")} placeholder="e.g. Uwase Diane" />
              <div className="row2">
                <div><label>Phone</label><input value={f.phone} onChange={update("phone")} placeholder="078X XXX XXX" /></div>
                <div><label>City / District</label><input value={f.location} onChange={update("location")} placeholder="Kigali" /></div>
              </div>
              <label>Email (optional)</label>
              <input value={f.email} onChange={update("email")} placeholder="name@email.com" />
              <label>Short summary</label>
              <textarea value={f.summary} onChange={update("summary")} placeholder="One or two sentences about who you are." />
              <label>Education</label>
              <textarea value={f.education} onChange={update("education")} placeholder="School, qualification, year — one line each." />
              <label>Experience</label>
              <textarea value={f.experience} onChange={update("experience")} placeholder="Role, place, dates, one line on what you did." />
              <label>Skills</label>
              <textarea value={f.skills} onChange={update("skills")} placeholder="Communication, Excel, Teamwork" />
            </>
          )}

          {doc.group === "letter" && (
            <>
              <label>Full name</label>
              <input value={f.name} onChange={update("name")} placeholder="e.g. Uwase Diane" />
              <div className="row2">
                <div><label>Phone</label><input value={f.phone} onChange={update("phone")} placeholder="078X XXX XXX" /></div>
                <div><label>Email</label><input value={f.email} onChange={update("email")} placeholder="name@email.com" /></div>
              </div>
              <label>Who is this addressed to?</label>
              <input value={f.recipient} onChange={update("recipient")} placeholder="Hiring Manager, ABC Ltd" />
              <label>Position / reason for writing</label>
              <input value={f.position} onChange={update("position")} placeholder="Sales Assistant role" />
              <label>Main message</label>
              <textarea value={f.body} onChange={update("body")} placeholder="Why you're a good fit, in your own words." />
            </>
          )}

          {doc.group === "business" && (
            <>
              <label>Business name</label>
              <input value={f.businessName} onChange={update("businessName")} placeholder="e.g. Kivu Fresh Foods" />
              <div className="row2">
                <div><label>Owner name</label><input value={f.ownerName} onChange={update("ownerName")} placeholder="Owner's name" /></div>
                <div><label>Phone</label><input value={f.phone} onChange={update("phone")} placeholder="078X XXX XXX" /></div>
              </div>
              <label>Location</label>
              <input value={f.location} onChange={update("location")} placeholder="Kigali" />
              <label>What does the business do?</label>
              <textarea value={f.description} onChange={update("description")} placeholder="Short description of the business." />
              <label>Services / products</label>
              <textarea value={f.services} onChange={update("services")} placeholder="List them, comma-separated." />
            </>
          )}

          <div className="price">
            <div>{doc.label}<br /><small>One-time, no subscription</small></div>
            <div className="amount">{doc.price} RWF</div>
          </div>

          {!currentOrder && (
            <div className="pay-box">
              <p className="pay-instructions">
                Send <strong>{doc.price} RWF</strong> via <strong>MTN Mobile Money</strong> or <strong>Airtel Money</strong> to
                <strong> 0791667329</strong>, then paste the confirmation code you received below.
              </p>
              <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. MP240912.1900.A12345" />
              <button className="primary" onClick={submitPayment}>I've paid — submit reference</button>
            </div>
          )}

          {currentOrder && currentOrder.status === "pending" && (
            <div className="pay-box pending">
              <p>Reference <strong>{currentOrder.ref}</strong> submitted. Waiting for approval — this is usually quick.</p>
            </div>
          )}

          {isApproved && <button className="primary" onClick={() => window.print()}>Download PDF</button>}
        </section>

        <section className="preview">
          <div className="frame">
            <div className="toolbar"><span>LIVE PREVIEW</span>{doc.group === "resume" && <span>{template} template</span>}</div>
            <div id="cv" className={`cv ${doc.group === "resume" ? template : ""}`}>
              {doc.group === "resume" && (
                <>
                  <p className="cvName">{show(f.name, "Your name")}</p>
                  <p className="cvContact">{[f.phone, f.location, f.email].filter(Boolean).join(" · ") || "Phone · City · Email"}</p>
                  <h3>Summary</h3><p className="block">{show(f.summary, "Your short summary will appear here.")}</p>
                  <h3>Education</h3><p className="block">{show(f.education, "Your education will appear here.")}</p>
                  <h3>Experience</h3><p className="block">{show(f.experience, "Your experience will appear here.")}</p>
                  <h3>Skills</h3><p className="block">{show(f.skills, "Your skills will appear here.")}</p>
                </>
              )}
              {doc.group === "letter" && (
                <>
                  <p className="cvContact">{show(f.name, "Your name")} · {show(f.phone, "Phone")} · {show(f.email, "Email")}</p>
                  <p className="block">To: {show(f.recipient, "Recipient name / company")}</p>
                  <p className="block">Re: {show(f.position, "Position or reason for writing")}</p>
                  <h3>Letter</h3>
                  <p className="block">{show(f.body, "Your letter content will appear here.")}</p>
                </>
              )}
              {doc.group === "business" && (
                <>
                  <p className="cvName">{show(f.businessName, "Business name")}</p>
                  <p className="cvContact">{show(f.ownerName, "Owner")} · {show(f.phone, "Phone")} · {show(f.location, "Location")}</p>
                  <h3>About</h3><p className="block">{show(f.description, "Business description will appear here.")}</p>
                  <h3>Services</h3><p className="block">{show(f.services, "Services will appear here.")}</p>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer setShowTerms={setShowTerms} />
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </div>
  );
}

function TopBar({ view, setView }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="mark" />
        <div><h1>QuickDocs Rwanda</h1><span>Build a document in minutes</span></div>
      </div>
      <div className="topbar-right">
        <button className="link" onClick={() => setView(view === "admin" ? "customer" : "admin")}>
          {view === "admin" ? "Back to app" : "Admin"}
        </button>
        <a className="help" href="https://wa.me/250735958276" target="_blank" rel="noreferrer">WhatsApp help</a>
      </div>
    </header>
  );
}

function Footer({ setShowTerms }) {
  return (
    <footer className="footer">
      <button className="link" onClick={() => setShowTerms(true)}>Privacy &amp; Terms</button>
    </footer>
  );
}

function TermsModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Privacy &amp; Terms</h3>
        <p>We only collect the information you type in to build your document. It is used to generate your PDF and is not sold or shared. Payment is verified manually against your MTN Mobile Money or Airtel Money reference code.</p>
        <button className="primary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}