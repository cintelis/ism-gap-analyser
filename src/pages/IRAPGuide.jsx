import { palette } from "../theme.js";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { GlobalStyles } from "../components/GlobalStyles.jsx";

export default function IRAPGuide({ navigate } = {}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: palette.bg,
        color: palette.text,
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <GlobalStyles />
      <Header navigate={navigate} currentPath="/irap-guide" />

      <div className="app-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 32px" }}>
        <PageHero />
        <RegulatoryStack />
        <IRAPStages />
        <ScopeSection />
        <DocumentationRequired />
        <RolesSection />
        <OutputsSection />
        <ImplementationOutcomes />
        <AuthorisationMatrix />
        <RecentChanges />
        <SourcesSection />
        <Footer />
      </div>
    </div>
  );
}

// ─── PAGE HERO ────────────────────────────────────────────────────────

function PageHero() {
  return (
    <Card accent={palette.accent} compact>
      <Eyebrow>Guide</Eyebrow>
      <h2 style={titleStyle}>The IRAP Process</h2>
      <p style={proseStyle}>
        The <strong>Information Security Registered Assessors Program (IRAP)</strong> is an ASD
        program that endorses qualified cyber-security professionals to perform independent
        security assessments of ICT systems against the{" "}
        <Anchor href="https://www.cyber.gov.au/business-government/asds-cyber-security-frameworks/ism">
          Australian Information Security Manual (ISM)
        </Anchor>
        . An IRAP assessment identifies a system&rsquo;s security strengths, weaknesses, and control
        effectiveness so an Authorising Officer can make a risk-based decision to authorise the
        system. An IRAP assessment is <em>not</em> a certification, accreditation, endorsement, or
        approval by ASD.
      </p>
      <p style={{ ...proseStyle, color: palette.textDim, fontSize: 12 }}>
        This guide summarises current (2025–2026) ACSC/ASD guidance including the IRAP Common
        Assessment Framework (April 2025), the IRAP Consumer Guide (July 2025), and the Protective
        Security Policy Framework (PSPF) Release 2025. Always check the authoritative sources
        linked throughout — they are kept up to date by the Commonwealth.
      </p>
    </Card>
  );
}

// ─── REGULATORY STACK ─────────────────────────────────────────────────

function RegulatoryStack() {
  return (
    <Card>
      <Eyebrow>Regulatory stack</Eyebrow>
      <h3 style={h3Style}>How PSPF, ISM and IRAP fit together</h3>
      <p style={proseStyle}>
        Australia&rsquo;s Commonwealth cyber-security posture is a three-layer stack. The PSPF sets
        policy obligations; the ISM is the technical control catalogue; IRAP is the assessment
        mechanism that independently evidences a system meets the ISM.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
          marginTop: 16,
        }}
      >
        <LayerCard
          top="Policy"
          title="PSPF"
          subtitle="Protective Security Policy Framework"
          body="What entities MUST do. Administered by the Department of Home Affairs; mandatory for non-corporate Commonwealth entities under the PGPA Act. Reorganised in 2025 into six domains: Governance, Risk, Information Security, Technology, Personnel, Physical."
          url="https://www.protectivesecurity.gov.au/"
          color={palette.purple}
        />
        <LayerCard
          top="Controls"
          title="ISM"
          subtitle="Information Security Manual"
          body="HOW to do it technically. Owned by ASD. Published quarterly (current: December 2025). Controls now grouped under six functions — Govern, Identify, Protect, Detect, Respond, Recover. PSPF Requirement 0098 mandates alignment with the ISM."
          url="https://www.cyber.gov.au/ism"
          color={palette.blue}
        />
        <LayerCard
          top="Assessment"
          title="IRAP"
          subtitle="Assessment program"
          body="INDEPENDENT assurance that a system meets the ISM. Performed by ASD-endorsed assessors against the latest ISM. Effectively mandatory for Commonwealth consumption of cloud / outsourced ICT up to PROTECTED."
          url="https://www.cyber.gov.au/irap"
          color={palette.accent}
        />
      </div>
    </Card>
  );
}

function LayerCard({ top, title, subtitle, body, url, color }) {
  return (
    <div
      style={{
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 6,
        padding: 14,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 4,
        }}
      >
        {top}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: palette.text, letterSpacing: "-0.01em" }}>
        {title}
      </div>
      <div style={{ fontSize: 11, color: palette.textDim, marginBottom: 8 }}>{subtitle}</div>
      <p style={{ fontSize: 12, color: palette.textMuted, lineHeight: 1.6, margin: 0 }}>{body}</p>
      <Anchor href={url} style={{ fontSize: 12, marginTop: 8, display: "inline-block" }}>
        Official site ↗
      </Anchor>
    </div>
  );
}

// ─── IRAP STAGES ──────────────────────────────────────────────────────

function IRAPStages() {
  const stages = [
    {
      n: 1,
      title: "Plan and prepare",
      body: "Engagement planning, Conflict of Interest declaration to ASD (required ≥7 business days before engagement start, per IRAP-AR-0009), access arrangements for documentation and personnel, methodology decisions.",
    },
    {
      n: 2,
      title: "Define the assessment boundary",
      body: "The assessor and the system owner's delegate agree scope, classification, in/out of scope components, and shared-responsibility inheritance. The assessment boundary can be broader than the authorisation boundary — never the other way around.",
    },
    {
      n: 3,
      title: "Assess the controls",
      body: "Evidence gathered via Examine / Interview / Test against ISM controls. Assessment degree is one of Basic / Focused / Comprehensive. Evidence quality is graded Excellent / Good / Fair / Poor.",
    },
    {
      n: 4,
      title: "Produce the IRAP assessment report",
      body: "Security Assessment Report (SAR) plus Controls Matrix delivered using ASD-provided templates. Assessors do NOT rate risk on behalf of the entity (IRAP-AR-0033).",
    },
  ];

  return (
    <Card>
      <Eyebrow>The process</Eyebrow>
      <h3 style={h3Style}>IRAP assessment stages</h3>
      <p style={proseStyle}>
        The April 2025 IRAP Common Assessment Framework defines four stages. The older &ldquo;Stage 1 /
        Stage 2&rdquo; terminology (design review vs. implementation review) has been superseded.
      </p>
      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        {stages.map((s) => (
          <StageRow key={s.n} n={s.n} title={s.title} body={s.body} />
        ))}
      </div>
      <Anchor
        href="https://www.cyber.gov.au/sites/default/files/2025-04/IRAP%20common%20assessment%20framework.pdf"
        style={{ marginTop: 14, display: "inline-block" }}
      >
        IRAP Common Assessment Framework (April 2025, PDF) ↗
      </Anchor>
    </Card>
  );
}

function StageRow({ n, title, body }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        padding: 12,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 6,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: 18,
          background: palette.accent + "22",
          border: `1px solid ${palette.accent}44`,
          color: palette.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          fontWeight: 700,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {n}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: palette.text, marginBottom: 4 }}>
          {title}
        </div>
        <p style={{ ...proseStyle, margin: 0, fontSize: 13 }}>{body}</p>
      </div>
    </div>
  );
}

// ─── SCOPE ────────────────────────────────────────────────────────────

function ScopeSection() {
  return (
    <Card>
      <Eyebrow>Defining scope</Eyebrow>
      <h3 style={h3Style}>Assessment boundary vs authorisation boundary</h3>
      <p style={proseStyle}>
        Two distinct boundaries apply. The <strong>assessment boundary</strong> covers everything
        the assessor examined — components, specifications, mechanisms, activities, personnel and
        facilities. The <strong>authorisation boundary</strong> is what the Authorising Officer
        actually authorises, and must be equal to or a subset of the assessment boundary. Never
        larger.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 12,
          marginTop: 14,
        }}
      >
        <InfoBox title="Scoping covers">
          <BulletList
            items={[
              "System version and environments (PROD / PRE-PROD / TEST / DEV)",
              "Intended security classification of data",
              "People, processes, technologies, and facilities the system relies on",
              "Shared-responsibility / control inheritance from upstream providers",
              "Data sovereignty, offshore staff, and offshore equipment",
            ]}
          />
        </InfoBox>
        <InfoBox title="Both inclusions and exclusions must be justified">
          <p style={{ ...proseStyle, margin: 0, fontSize: 13 }}>
            The SAR records what was assessed and — equally important — what was deliberately left
            out, with the reasoning. Components excluded from the assessment boundary also fall
            outside any authorisation to operate.
          </p>
        </InfoBox>
      </div>
    </Card>
  );
}

// ─── DOCUMENTATION ────────────────────────────────────────────────────

function DocumentationRequired() {
  const docs = [
    { title: "System Security Plan (SSP)", body: "Describes how ISM controls apply to the system — the primary technical document." },
    { title: "SSP Annex", body: "Control-by-control implementation detail; the basis for the Controls Matrix." },
    { title: "Security Risk Management Plan (SRMP)", body: "Risk context, treatment decisions, and residual risk." },
    { title: "Cyber Security Incident Response Plan (IRP)", body: "Procedures and playbooks for responding to incidents." },
    { title: "Continuous Monitoring Plan (CMP)", body: "How the system's security posture is monitored and reported over time." },
    { title: "System design documents", body: "Architectural diagrams, data-flow diagrams, build and configuration artefacts." },
    { title: "Business Continuity & Disaster Recovery Plans", body: "BCP/DRP — resilience posture." },
    { title: "Policies, processes, SOPs", body: "Operational procedures that support the controls claimed in the SSP." },
  ];

  return (
    <Card>
      <Eyebrow>Required documentation</Eyebrow>
      <h3 style={h3Style}>What you need before Stage 1 begins</h3>
      <p style={proseStyle}>
        The IRAP Consumer Guide (July 2025) and the Common Assessment Framework list the expected
        documentation set. Missing or thin documents will slow the engagement and often produce
        &ldquo;Ineffective&rdquo; or &ldquo;No visibility&rdquo; outcomes against the relevant controls.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 10,
          marginTop: 14,
        }}
      >
        {docs.map((d) => (
          <div
            key={d.title}
            style={{
              background: palette.bg,
              border: `1px solid ${palette.border}`,
              borderRadius: 6,
              padding: 12,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: palette.text, marginBottom: 4 }}>
              {d.title}
            </div>
            <p style={{ ...proseStyle, fontSize: 12, margin: 0 }}>{d.body}</p>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 16,
          padding: 12,
          background: palette.accent + "10",
          border: `1px dashed ${palette.accent}44`,
          borderRadius: 6,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: palette.accent, marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Authorisation package
        </div>
        <p style={{ ...proseStyle, fontSize: 13, margin: 0 }}>
          The final package delivered to the Authorising Officer must, at minimum, contain: SSP,
          Cyber Security IRP, Continuous Monitoring Plan, Security Assessment Report (SAR),
          Controls Matrix, and a Plan of Action and Milestones (if applicable).
        </p>
      </div>
    </Card>
  );
}

// ─── ROLES ────────────────────────────────────────────────────────────

function RolesSection() {
  const roles = [
    { title: "System Owner", body: "Owns the system. Prepares documentation, makes personnel available for interviews, and is the delegate who agrees the assessment boundary.", color: palette.blue },
    { title: "Authorising Officer", body: "Makes the risk-based authority-to-operate decision. For OFFICIAL → SECRET systems this is the Accountable Authority / CISO (or their delegate). For TOP SECRET it's the Director-General ASD (or delegate).", color: palette.purple },
    { title: "IRAP Assessor", body: "ASD-endorsed independent assessor. Plans, scopes, assesses, and produces the SAR + Controls Matrix. Must be independent — cannot have designed, implemented, or advised on the system. Cannot rate risk or recommend authorisation.", color: palette.accent },
    { title: "Entity Assessor", body: "In-house / contracted assessor permitted for ON-PREMISES systems up to SECRET. NOT permitted for outsourced IT / cloud services — those must be IRAP-assessed.", color: palette.cyan },
    { title: "ASD IRAP Administration", body: "Receives the Conflict-of-Interest declaration (≥7 business days before engagement), runs quality assurance sampling of reports, and manages assessor endorsements.", color: palette.textDim },
  ];

  return (
    <Card>
      <Eyebrow>Roles</Eyebrow>
      <h3 style={h3Style}>Who does what</h3>
      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        {roles.map((r) => (
          <div
            key={r.title}
            style={{
              background: palette.bg,
              border: `1px solid ${palette.border}`,
              borderLeft: `3px solid ${r.color}`,
              borderRadius: 6,
              padding: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: r.color, marginBottom: 4 }}>
              {r.title}
            </div>
            <p style={{ ...proseStyle, fontSize: 13, margin: 0 }}>{r.body}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── OUTPUTS ──────────────────────────────────────────────────────────

function OutputsSection() {
  return (
    <Card>
      <Eyebrow>Outputs</Eyebrow>
      <h3 style={h3Style}>Security Assessment Report + Controls Matrix</h3>
      <p style={proseStyle}>
        Assessors deliver two primary artefacts using ASD-provided templates. The SAR is for
        Authorising Officers, system owners, and risk owners. The Controls Matrix is for technical
        personnel and records control-by-control implementation status against the ISM.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
          marginTop: 14,
        }}
      >
        <InfoBox title="SAR contains">
          <BulletList
            items={[
              "Assessment boundary",
              "System and environment overview",
              "Security strengths and weaknesses",
              "Assessment limitations",
              "Implementation status for each control",
              "Evidence gathered and how each control was tested",
              "Vulnerabilities and weaknesses (without a risk rating)",
              "Recommendations and remediation activities",
              "Consumer recommendations where applicable",
            ]}
          />
        </InfoBox>
        <InfoBox title="Templates">
          <p style={{ ...proseStyle, fontSize: 13, margin: "0 0 8px" }}>
            Use the current ASD-provided templates:
          </p>
          <BulletList
            items={[
              <Anchor key="a" href="https://www.cyber.gov.au/sites/default/files/2025-02/IRAP-Assessment-Report-Template-V1.0_2025.docx">
                IRAP Assessment Report Template (Feb 2025) ↗
              </Anchor>,
              <Anchor key="b" href="https://www.cyber.gov.au/sites/default/files/2023-03/Cloud-Security-Assessment-Report-Template-06-July-2022.docx">
                Cloud Security Assessment Report Template ↗
              </Anchor>,
            ]}
          />
        </InfoBox>
      </div>
    </Card>
  );
}

// ─── IMPLEMENTATION OUTCOMES ──────────────────────────────────────────

function ImplementationOutcomes() {
  const outcomes = [
    { id: "Effective", body: "Control is implemented and achieves its intent.", color: palette.green },
    { id: "Ineffective", body: "Control is implemented but does not achieve its intent.", color: palette.red },
    { id: "Alternate control", body: "A different control achieves equivalent risk reduction.", color: palette.cyan },
    { id: "Not implemented", body: "Control is applicable but has not been implemented.", color: palette.red },
    { id: "Not applicable", body: "Control does not apply to the system or its context.", color: palette.textDim },
    { id: "Not assessed", body: "Control was in scope but not assessed (time, sampling, or agreed scope-down).", color: palette.yellow },
    { id: "No visibility", body: "Assessor could not gather evidence to determine the outcome.", color: palette.yellow },
  ];

  return (
    <Card>
      <Eyebrow>Implementation outcomes</Eyebrow>
      <h3 style={h3Style}>The seven assessor outcomes</h3>
      <p style={proseStyle}>
        IRAP assessors classify each applicable ISM control using one of seven standardised
        outcomes (per the April 2025 CAF). Your pre-assessment self-review uses a simpler set —
        Implemented / Alternate Control / Not Implemented / Not Applicable — which maps to these
        outcomes once an independent assessor weighs evidence.
      </p>
      <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
        {outcomes.map((o) => (
          <div
            key={o.id}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "baseline",
              background: palette.bg,
              border: `1px solid ${palette.border}`,
              borderLeft: `3px solid ${o.color}`,
              borderRadius: 6,
              padding: "10px 14px",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: o.color,
                minWidth: 140,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.02em",
              }}
            >
              {o.id}
            </div>
            <div style={{ fontSize: 13, color: palette.textMuted, lineHeight: 1.6 }}>{o.body}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── AUTHORISATION MATRIX ─────────────────────────────────────────────

function AuthorisationMatrix() {
  const rows = [
    ["TOP SECRET", "ASD assessor (or delegate)", "Director-General ASD (or delegate)"],
    ["SECRET (on-premises)", "Entity or IRAP assessor", "Accountable Authority / CISO"],
    ["SECRET (outsourced / cloud)", "IRAP assessor", "Accountable Authority / CISO"],
    ["PROTECTED / OFFICIAL:S / OFFICIAL (on-prem)", "Entity or IRAP assessor", "Accountable Authority / CISO"],
    ["PROTECTED / OFFICIAL:S / OFFICIAL (outsourced / cloud)", "IRAP assessor", "Accountable Authority / CISO"],
    ["Gateways", "IRAP assessor", "Accountable Authority / CISO"],
  ];

  return (
    <Card>
      <Eyebrow>Who can assess, who can authorise</Eyebrow>
      <h3 style={h3Style}>Authorisation matrix</h3>
      <p style={proseStyle}>
        From the July 2025 IRAP Consumer Guide, Table 1. Cloud and outsourced ICT at any classification
        require an <strong>IRAP</strong> assessor — an entity assessor is not sufficient.
      </p>
      <div
        style={{
          overflowX: "auto",
          marginTop: 14,
          border: `1px solid ${palette.border}`,
          borderRadius: 6,
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: palette.surface }}>
              <th style={thStyle}>Classification / type</th>
              <th style={thStyle}>Who can assess</th>
              <th style={thStyle}>Who authorises</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? palette.bg : palette.surface + "80" }}>
                <td style={tdStyle}>{r[0]}</td>
                <td style={tdStyle}>{r[1]}</td>
                <td style={tdStyle}>{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ─── RECENT CHANGES ───────────────────────────────────────────────────

function RecentChanges() {
  const items = [
    {
      date: "December 2025",
      title: "ISM v2025.12.9 released",
      body: "Removal of time-based password-change; new controls for cryptographic bill-of-materials, AI documentation and usage policy, suppression of AI confidence scores in APIs; rescission of fax-related controls; security questions and email no longer acceptable for authentication.",
      url: "https://www.cyber.gov.au/sites/default/files/2025-12/ISM%20December%202025%20changes%20(December%202025).pdf",
    },
    {
      date: "October 2025",
      title: "PSPF Direction 004-2025 issued",
      body: "Binding direction on Commonwealth Technology Management — extends the 2025 PSPF release with specific technology-management obligations.",
      url: "https://www.protectivesecurity.gov.au/system/files/2025-10/PSPF-Direction-004-2025.pdf",
    },
    {
      date: "July 2025",
      title: "PSPF Release 2025",
      body: "Biggest PSPF restructure in years. Four domains → six (Governance, Risk, Information Security, Technology, Personnel, Physical). Individually numbered requirements. Zero Trust embedded. New content on AI, quantum, connected peripherals. Commonwealth Uplift Policy Tranche 2 goes live.",
      url: "https://www.protectivesecurity.gov.au/pspf-annual-release",
    },
    {
      date: "July 2025",
      title: "IRAP Consumer Guide reissued",
      body: "Updated table of Authorising Officers and Assessors by classification. Aligned to the new four-stage process.",
      url: "https://www.cyber.gov.au/sites/default/files/2024-08/IRAP%20consumer%20guide.pdf",
    },
    {
      date: "April 2025",
      title: "IRAP Common Assessment Framework v1.0",
      body: "Replaces the previous IRAP Assessment Process Guide. Introduces 46 numbered IRAP Assessment Requirements across seven quality standards. Codifies the four-stage model, boundary taxonomy, layered cloud assessments, sampling, and evidence quality tiers.",
      url: "https://www.cyber.gov.au/sites/default/files/2025-04/IRAP%20common%20assessment%20framework.pdf",
    },
    {
      date: "February 2025",
      title: "IRAP Assessment Report Template v1.0",
      body: "New template supersedes all prior versions.",
      url: "https://www.cyber.gov.au/sites/default/files/2025-02/IRAP-Assessment-Report-Template-V1.0_2025.docx",
    },
  ];

  return (
    <Card>
      <Eyebrow>Recent changes</Eyebrow>
      <h3 style={h3Style}>What&rsquo;s new in the last 12 months</h3>
      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        {items.map((it) => (
          <div
            key={it.title}
            style={{
              background: palette.bg,
              border: `1px solid ${palette.border}`,
              borderRadius: 6,
              padding: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "baseline",
                marginBottom: 4,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: palette.textDim,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {it.date}
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: palette.text }}>{it.title}</span>
            </div>
            <p style={{ ...proseStyle, fontSize: 13, margin: "4px 0 0" }}>{it.body}</p>
            {it.url && (
              <Anchor href={it.url} style={{ fontSize: 12, marginTop: 6, display: "inline-block" }}>
                Source ↗
              </Anchor>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── SOURCES ──────────────────────────────────────────────────────────

function SourcesSection() {
  const groups = [
    {
      title: "IRAP — ASD",
      links: [
        ["IRAP program page", "https://www.cyber.gov.au/irap"],
        ["IRAP Common Assessment Framework (April 2025)", "https://www.cyber.gov.au/sites/default/files/2025-04/IRAP%20common%20assessment%20framework.pdf"],
        ["IRAP Consumer Guide (July 2025)", "https://www.cyber.gov.au/sites/default/files/2024-08/IRAP%20consumer%20guide.pdf"],
        ["IRAP Policy and Procedures (Dec 2020)", "https://www.cyber.gov.au/sites/default/files/2023-02/IRAP%20Policy%20and%20Procedures.pdf"],
        ["IRAP Assessment Report Template (Feb 2025)", "https://www.cyber.gov.au/sites/default/files/2025-02/IRAP-Assessment-Report-Template-V1.0_2025.docx"],
      ],
    },
    {
      title: "ISM — ASD",
      links: [
        ["Information Security Manual", "https://www.cyber.gov.au/ism"],
        ["Using the ISM (Dec 2025)", "https://www.cyber.gov.au/sites/default/files/2025-12/01.%20ISM%20-%20Using%20the%20Information%20security%20manual%20(December%202025).pdf"],
        ["ISM OSCAL releases", "https://github.com/AustralianCyberSecurityCentre/ism-oscal/releases"],
      ],
    },
    {
      title: "PSPF — Home Affairs",
      links: [
        ["PSPF landing page", "https://www.protectivesecurity.gov.au/"],
        ["PSPF Annual Release", "https://www.protectivesecurity.gov.au/pspf-annual-release"],
        ["PSPF 2025 Release PDF", "https://www.protectivesecurity.gov.au/system/files/2025-07/pspf-release-2025.pdf"],
        ["PSPF 2025 Summary of Changes", "https://www.protectivesecurity.gov.au/publications-library/pspf-release-2025-summary-changes"],
        ["Applying the PSPF (who it covers)", "https://www.protectivesecurity.gov.au/about/applying-protective-security-policy-framework"],
      ],
    },
  ];

  return (
    <Card>
      <Eyebrow>Authoritative sources</Eyebrow>
      <h3 style={h3Style}>Where to go for the canonical answer</h3>
      <p style={proseStyle}>
        This page is a summary. For anything you&rsquo;re going to rely on in an assessment — a scope
        decision, a procurement question, a compliance argument — go to the source below and cite
        it directly.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 12,
          marginTop: 14,
        }}
      >
        {groups.map((g) => (
          <div key={g.title}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: palette.textDim,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              {g.title}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
              {g.links.map(([label, url]) => (
                <li key={url}>
                  <Anchor href={url} style={{ fontSize: 13 }}>
                    {label} ↗
                  </Anchor>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── SHARED BUILDING BLOCKS ───────────────────────────────────────────

function Card({ children, accent = palette.border, compact = false }) {
  return (
    <div
      style={{
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 8,
        padding: compact ? "18px 22px" : "20px 22px",
        marginBottom: 20,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: palette.textDim,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function InfoBox({ title, children }) {
  return (
    <div
      style={{
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 6,
        padding: 14,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: palette.text, marginBottom: 8 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
      {items.map((it, i) => (
        <li
          key={i}
          style={{
            fontSize: 13,
            color: palette.textMuted,
            lineHeight: 1.55,
            paddingLeft: 14,
            position: "relative",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              top: 8,
              width: 4,
              height: 4,
              borderRadius: 2,
              background: palette.accent,
            }}
          />
          {it}
        </li>
      ))}
    </ul>
  );
}

function Anchor({ href, children, style }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: palette.accent,
        textDecoration: "none",
        fontWeight: 500,
        ...style,
      }}
    >
      {children}
    </a>
  );
}

const titleStyle = {
  margin: "0 0 8px",
  fontSize: 26,
  fontWeight: 700,
  color: palette.text,
  letterSpacing: "-0.02em",
};

const h3Style = {
  margin: "0 0 8px",
  fontSize: 17,
  fontWeight: 700,
  color: palette.text,
  letterSpacing: "-0.01em",
};

const proseStyle = {
  fontSize: 14,
  color: palette.textMuted,
  lineHeight: 1.7,
  margin: "8px 0 0",
};

const thStyle = {
  textAlign: "left",
  padding: "10px 12px",
  fontSize: 11,
  fontWeight: 700,
  color: palette.textDim,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  borderBottom: `1px solid ${palette.border}`,
};

const tdStyle = {
  padding: "10px 12px",
  fontSize: 13,
  color: palette.textMuted,
  borderBottom: `1px solid ${palette.border}`,
};
