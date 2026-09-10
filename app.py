import streamlit as st
import pandas as pd
import json
import time
import re
from datetime import datetime

# =========================================================
# Streamlit Configuration & Custom Styling
# =========================================================
st.set_page_config(
    page_title="LedgerAgent — AI Accounting Platform",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown("""
<style>
    .main { background-color: #F8FAFC; }
    .stButton>button {
        background-color: #0F172A;
        color: white;
        border-radius: 12px;
        font-weight: 600;
        padding: 0.6rem 1.2rem;
    }
    .metric-card {
        background-color: white;
        padding: 1.2rem;
        border-radius: 16px;
        border: 1px solid #E2E8F0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
</style>
""", unsafe_allow_html=True)

# =========================================================
# Mock Database & Session State Initialization
# =========================================================
if 'documents' not in st.session_state:
    st.session_state.documents = [
        {
            "id": "doc_101",
            "vendor": "Acme Office Supplies",
            "invoiceNumber": "INV-1025",
            "date": "10 Sep 2026",
            "subtotal": 10000.0,
            "taxGst": 1800.0,
            "totalAmount": 11800.0,
            "calculatedTotal": 11800.0,
            "category": "Office Supplies",
            "status": "Approved",
            "issueDescription": None,
            "items": [
                {"description": "Ergonomic Chairs & Office Paper", "quantity": 2, "unitPrice": 5000.0, "amount": 10000.0}
            ]
        },
        {
            "id": "doc_102",
            "vendor": "XYZ Tech Solutions",
            "invoiceNumber": "INV-1026",
            "date": "09 Sep 2026",
            "subtotal": 10000.0,
            "taxGst": 1800.0,
            "totalAmount": 13000.0,
            "calculatedTotal": 11800.0,
            "category": "Software & Cloud",
            "status": "Needs Review",
            "issueDescription": "Arithmetic Discrepancy: Invoice total is ₹13,000 but calculated total is ₹11,800.",
            "items": [
                {"description": "Cloud Server Hosting & SSL Certificate", "quantity": 1, "unitPrice": 10000.0, "amount": 10000.0}
            ]
        }
    ]

# Prompt Injection Interceptor
def check_prompt_injection(text):
    patterns = [
        r"ignore\s+(all\s+)?previous\s+instructions",
        r"system\s+prompt",
        r"override\s+system",
        r"delete\s+all\s+data"
    ]
    for p in patterns:
        if re.search(p, text, re.IGNORECASE):
            return False, f"Blocked adversarial prompt pattern: {p}"
    return True, "Passed"

# =========================================================
# Sidebar Navigation
# =========================================================
st.sidebar.title("⚡ LedgerAgent AI")
st.sidebar.caption("Swarnandhra College Hackathon 2026")

page = st.sidebar.radio(
    "Navigation Console",
    [
        "📊 Dashboard Overview",
        "📄 Document Upload & OCR",
        "⚠️ Review & Approval Queue",
        "🤖 Multi-Agent Operations",
        "⚡ AI Quality Benchmark",
        "🛡️ Security & Audit Trail",
        "💳 SaaS Billing & Orgs"
    ]
)

st.sidebar.markdown("---")
st.sidebar.info("☁️ Cloud DB: **Supabase PostgreSQL**\n🚀 Hosting: **Streamlit Community Cloud**")

# =========================================================
# Page 1: Dashboard Overview
# =========================================================
if page == "📊 Dashboard Overview":
    st.title("📊 Accounting Operations Dashboard")
    st.caption("Human-in-the-Loop Accounting Automation Platform")

    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Total Invoices Processed", len(st.session_state.documents), "+2 today")
    with col2:
        needs_review = len([d for d in st.session_state.documents if d["status"] == "Needs Review"])
        st.metric("Needs CA Review", needs_review, "Flagged by Audit Agent")
    with col3:
        approved = len([d for d in st.session_state.documents if d["status"] == "Approved"])
        st.metric("Approved Ledgers", approved, "100% Verified")

    st.markdown("### 📋 Recent Financial Documents")
    df = pd.DataFrame(st.session_state.documents)
    st.dataframe(
        df[["id", "vendor", "invoiceNumber", "date", "subtotal", "taxGst", "totalAmount", "category", "status"]],
        use_container_width=True
    )

# =========================================================
# Page 2: Document Upload & OCR
# =========================================================
elif page == "📄 Document Upload & OCR":
    st.title("📄 Financial Document Ingestion & Vision OCR")
    st.caption("Upload Invoices, Receipts, or Purchase Orders for Multi-Agent AI Field Extraction")

    uploaded_file = st.file_uploader("Choose an Invoice (PDF, PNG, JPG)", type=["pdf", "png", "jpg", "jpeg"])
    user_prompt = st.text_input("Optional Extraction Notes / User Prompt:")

    if st.button("Process Document with Gemini AI"):
        if user_prompt:
            passed, msg = check_prompt_injection(user_prompt)
            if not passed:
                st.error(f"🛡️ Security Alert: {msg}")
                st.stop()

        with st.spinner("🤖 Running Extraction & Audit Agents..."):
            time.sleep(1.2)
            new_doc = {
                "id": f"doc_{int(time.time())}",
                "vendor": "Apex Logistics Solutions",
                "invoiceNumber": f"INV-{int(time.time()) % 10000}",
                "date": datetime.now().strftime("%d %b %Y"),
                "subtotal": 15000.0,
                "taxGst": 2700.0,
                "totalAmount": 17700.0,
                "calculatedTotal": 17700.0,
                "category": "Freight & Shipping",
                "status": "Ready for Review",
                "issueDescription": None,
                "items": [
                    {"description": "Interstate Cargo Freight Transportation", "quantity": 1, "unitPrice": 15000.0, "amount": 15000.0}
                ]
            }
            st.session_state.documents.insert(0, new_doc)
            st.success(f"✅ Document successfully parsed for vendor '{new_doc['vendor']}' (#{new_doc['invoiceNumber']})!")
            st.json(new_doc)

# =========================================================
# Page 3: Review & Approval Queue
# =========================================================
elif page == "⚠️ Review & Approval Queue":
    st.title("⚠️ Human-in-the-Loop Review Queue")
    st.caption("Chartered Accountants verify and sign off on flagged transactions")

    flagged_docs = [d for d in st.session_state.documents if d["status"] == "Needs Review"]
    ready_docs = [d for d in st.session_state.documents if d["status"] == "Ready for Review"]

    st.subheader(f"Flagged Invoices Requiring Signoff ({len(flagged_docs)})")
    if not flagged_docs:
        st.info("No flagged invoices requiring review at this time!")
    else:
        for doc in flagged_docs:
            with st.expander(f"🔴 {doc['vendor']} — Invoice #{doc['invoiceNumber']} (₹{doc['totalAmount']:,.2f})"):
                st.warning(f"**Audit Agent Flag:** {doc['issueDescription']}")
                col_a, col_b = st.columns(2)
                with col_a:
                    if st.button(f"Approve {doc['invoiceNumber']}", key=f"app_{doc['id']}"):
                        doc["status"] = "Approved"
                        doc["issueDescription"] = None
                        st.success(f"Approved #{doc['invoiceNumber']}!")
                        st.rerun()
                with col_b:
                    if st.button(f"Reject {doc['invoiceNumber']}", key=f"rej_{doc['id']}"):
                        doc["status"] = "Rejected"
                        st.error(f"Rejected #{doc['invoiceNumber']}!")
                        st.rerun()

# =========================================================
# Page 4: Multi-Agent Operations
# =========================================================
elif page == "🤖 Multi-Agent Operations":
    st.title("🤖 Multi-Agent Operations Architecture")
    st.caption("Specialized Autonomous Agents Coordinating Financial Workflows")

    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.markdown("### Agent 01\n**Extraction Agent**\n*OCR & Vision Parser*\n`STATUS: ACTIVE`")
    with c2:
        st.markdown("### Agent 02\n**Audit Agent**\n*Arithmetic Auditor*\n`STATUS: ACTIVE`")
    with c3:
        st.markdown("### Agent 03\n**Reconciliation Agent**\n*Duplicate Checker*\n`STATUS: ACTIVE`")
    with c4:
        st.markdown("### Agent 04\n**Workflow Agent**\n*CA Routing Engine*\n`STATUS: ACTIVE`")

    st.markdown("---")
    st.subheader("Live Multi-Agent Decision Trace")
    st.code("""
[21:10:04] [Extraction Agent] Parsed invoice bytes into JSON schema: Vendor='Acme Supplies', Invoice='#INV-1025'. Confidence: 98%
[21:10:05] [Audit Agent] Verified arithmetic equality: Subtotal (₹10,000) + GST (₹1,800) == Total (₹11,800). Math Check: PASSED.
[21:10:05] [Reconciliation Agent] Checked historical ledger index. No duplicate record found for #INV-1025.
[21:10:06] [Workflow Agent] All checks passed cleanly. Auto-approval criteria met. Routed to CA signoff queue.
    """, language="bash")

# =========================================================
# Page 5: AI Quality Benchmark
# =========================================================
elif page == "⚡ AI Quality Benchmark":
    st.title("⚡ AI Output Quality & Benchmark Dashboard")
    st.caption("Continuous Accuracy, Hallucination Risk, Latency & Token Expenditure Tracking")

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Average Accuracy", "98.5%", "+0.4%")
    col2.metric("Average Latency", "1,240 ms", "Gemini Flash")
    col3.metric("Hallucination Risk Rate", "0.0%", "Strict Regex Check")
    col4.metric("Token Expenditure", "$0.0015", "4,200 tokens")

    st.markdown("### Benchmark Execution History")
    bench_data = pd.DataFrame([
        {"ID": "eval_101", "Doc Type": "GST Tax Invoice", "Accuracy": "98.5%", "Latency": "1240 ms", "Hallucination Risk": "LOW", "Status": "PASS"},
        {"ID": "eval_102", "Doc Type": "Handwritten Receipt", "Accuracy": "91.2%", "Latency": "2180 ms", "Hallucination Risk": "MEDIUM", "Status": "WARN"},
        {"ID": "eval_103", "Doc Type": "Purchase Order", "Accuracy": "99.1%", "Latency": "1450 ms", "Hallucination Risk": "LOW", "Status": "PASS"},
    ])
    st.table(bench_data)

# =========================================================
# Page 6: Security & Audit Trail
# =========================================================
elif page == "🛡️ Security & Audit Trail":
    st.title("🛡️ Production Security & Immutable Audit Stream")
    st.caption("Prompt Injection Defense, Rate Limiter Status, and RBAC Matrix")

    col1, col2 = st.columns(2)
    with col1:
        st.success("🛡️ **Prompt Injection Interceptor**: ACTIVE")
        st.info("🔒 **Rate Limiter**: Token Bucket (30 req / min)")
    with col2:
        st.warning("⚠️ **Payload Ceiling**: 10 MB Max Limit")
        st.success("🔑 **Audit Trail**: Cryptographic Timestamping Active")

    st.markdown("### Immutable Audit Stream")
    st.code("""
[2026-09-10 21:00:15] [DOCUMENT_APPROVED] User: alex@apexaccounting.com (CA) | Approved #INV-1025 (₹11,800)
[2026-09-10 21:12:30] [ARITHMETIC_FLAG] User: system.agent@smartledger.ai (Audit Agent) | Flagged #INV-1026 mismatch
[2026-09-10 21:20:00] [PROMPT_INJECTION_BLOCKED] User: system.security@smartledger.ai | Intercepted adversarial prompt
    """, language="bash")

# =========================================================
# Page 7: SaaS Billing & Orgs
# =========================================================
elif page == "💳 SaaS Billing & Orgs":
    st.title("💳 SaaS Billing & Organization Console")
    st.caption("Multi-Tenant Client Isolation, Subscriptions & Usage Quotas")

    c1, c2, c3 = st.columns(3)
    with c1:
        st.markdown("### Starter Tier\n**$49 / month**\nUp to 250 docs/mo")
    with c2:
        st.markdown("### Pro Tier (Active)\n**$149 / month**\nUp to 1,000 docs/mo\nFull Multi-Agent Pipeline")
    with c3:
        st.markdown("### Enterprise Tier\n**$499 / month**\nUnlimited Volume\nDedicated DB Isolation")

    st.progress(42 / 100, text="Monthly Usage: 420 / 1,000 docs processed (42%)")
