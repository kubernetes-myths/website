import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import styles from './index.module.css';



export default function Home(): JSX.Element {
  return (
    <Layout
      title="Kubernetes Myths"
      description="Debunking Kubernetes misconceptions with proofs, experiments, and real-world cluster validation."
    >

      <header
        style={{
          padding: "6rem 1rem",
          textAlign: "center",
          background: "linear-gradient(180deg, #ffffff 0%, #f3f7fc 100%)",
        }}
      >
        <div className="container">
          <img
            src="/img/kubernetesmyths.png"   // ← put your logo here
            alt="Kubernetes Myths Logo"
            className={styles.heroLogo}
          />

          {/* TITLE */}
          <h1 className={styles.heroTitle} style={{
            fontSize: "3.8rem",
            fontWeight: 800,
            marginBottom: "1.2rem",
            background: "linear-gradient(90deg, #0052cc, #2684ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Kubernetes Myths
          </h1>

          {/* SHORT SUBTITLE */}
          <p className={styles.heroSubtitle}
            style={{
              fontSize: "1.45rem",
              maxWidth: "780px",
              margin: "0.5rem auto 0 auto",
              lineHeight: "1.7",
              color: "#333",
            }}
          >
            Debunking Kubernetes misconceptions with proofs, experiments, and real-world validation.
          </p>

          {/* CTA BUTTONS */}
          <div className={styles.heroButtons} style={{ marginTop: "2.5rem" }}>
            <Link
              className="button button--primary button--lg margin-right--md"
              style={{ padding: "0.9rem 2rem", fontSize: "1.1rem", borderRadius: "8px" }}
              to="kubernetes-myths"
            >
              Explore All Myths
            </Link>

            <Link
              className="button button--secondary button--lg"
              style={{
                padding: "0.9rem 2rem",
                fontSize: "1.1rem",
                borderRadius: "8px",
                border: "1px solid #0052cc",
              }}
              to="/category/architecture-myths"
            >
              Start Myth-Busting
            </Link>
          </div>
          {/* VISITOR COUNTER - PLACE IT HERE */}

        </div>
      </header>

      <section
        style={{
          padding: "2rem 0",
          textAlign: "center",
          background: "#f0f4ff",
          borderRadius: "12px",
          margin: "2rem auto",
          maxWidth: "900px",
        }}
      >
        <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          Community Impact
        </h2>
        <p style={{ fontSize: "1rem", marginBottom: "1.5rem", color: "#555" }}>
          Stats from LinkedIn highlighting the reach of Kubernetes Myths
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "2rem",
            fontSize: "1.2rem",
            alignItems: "center",
          }}
        >
          {/* LinkedIn Likes */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "#ffffff",
              padding: "0.4rem 0.8rem",
              borderRadius: "8px",
              border: "1px solid #d0ddff",
            }}
          >
            👁️ Impressions: 445,037

          </div>

          {/* LinkedIn Saves */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "#ffffff",
              padding: "0.4rem 0.8rem",
              borderRadius: "8px",
              border: "1px solid #d0ddff",
            }}
          >
            🌐 Members reached: 97,168

          </div>

          {/* LinkedIn Impressions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "#ffffff",
              padding: "0.4rem 0.8rem",
              borderRadius: "8px",
              border: "1px solid #d0ddff",
            }}
          >
            👍 Reactions: 4,584
          </div>

          {/* Total Visitors */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.4rem 0.8rem",
              borderRadius: "8px",
              background: "#ffffff",
              border: "1px solid #d0ddff",
            }}
          >
            💾 Total Saves: 2,246

          </div>
        </div>
      </section>




      {/* WHY SECTION */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", fontSize: "2.2rem", fontWeight: 700 }}>
            Why Kubernetes Myths Spread
          </h2>

          <p
            style={{
              textAlign: "center",
              maxWidth: "800px",
              margin: "1rem auto",
              fontSize: "1.2rem",
              lineHeight: "1.7",
            }}
          >
            Most Kubernetes misunderstandings come from outdated blogs,
            oversimplified diagrams, interview shortcuts, and “heard it
            somewhere” knowledge. This project validates everything with real
            code, YAML, logs, and Kubernetes source truth.
          </p>
        </div>
      </section>

      {/* FEATURED MYTHS SECTION */}
      {/* FEATURED MYTHS / LINKEDIN POST SECTION */}
      <section style={{ padding: "4rem 0", background: "#f9f9f9" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", fontSize: "2.2rem", fontWeight: 700 }}>
            Featured Myths & Highlights
          </h2>

          <div style={{ position: "relative", marginTop: "2rem" }}>
            {/* Back Button */}
            <button
              onClick={() => {
                const row = document.getElementById("linkedinRow");
                if (row) row.scrollBy({ left: -520, behavior: "smooth" });
              }}
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "#0052cc",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
              }}
            >
              ◀
            </button>

            {/* Scrollable Row */}
            <div
              id="linkedinRow"
              style={{
                display: "flex",
                overflowX: "scroll",      // enable horizontal scrolling
                gap: "16px",
                scrollBehavior: "smooth",
                padding: "0 50px",
                msOverflowStyle: "none", // hide scrollbar for IE/Edge
                scrollbarWidth: "none",  // hide scrollbar for Firefox
              }}
            >
              {/* Chrome/Safari/Opera scrollbar hide */}
              <style>
                {`
            #linkedinRow::-webkit-scrollbar {
              display: none;
            }
          `}
              </style>

              <iframe
                src="https://www.linkedin.com/embed/feed/update/urn:li:share:7400729978826465281?collapsed=1"
                height="504"
                width="504"
                frameBorder="0"
                allowFullScreen
                title="LinkedIn Post 1"
                style={{ flex: "0 0 auto" }}
              ></iframe>

              <iframe
                src="https://www.linkedin.com/embed/feed/update/urn:li:share:7399993523107676161?collapsed=1"
                height="504"
                width="504"
                frameBorder="0"
                allowFullScreen
                title="LinkedIn Post 2"
                style={{ flex: "0 0 auto" }}
              ></iframe>

              <iframe
                src="https://www.linkedin.com/embed/feed/update/urn:li:share:7402910569961271297?collapsed=1"
                height="504"
                width="504"
                frameBorder="0"
                allowFullScreen
                title="LinkedIn Post 3"
                style={{ flex: "0 0 auto" }}
              ></iframe>

              <iframe
                src="https://www.linkedin.com/embed/feed/update/urn:li:share:7400373322091249664?collapsed=1"
                height="504"
                width="504"
                frameBorder="0"
                allowFullScreen
                title="LinkedIn Post 4"
                style={{ flex: "0 0 auto" }}
              ></iframe>


            </div>

            {/* Next Button */}
            <button
              onClick={() => {
                const row = document.getElementById("linkedinRow");
                if (row) row.scrollBy({ left: 520, behavior: "smooth" });
              }}
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "#0052cc",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
              }}
            >
              ▶
            </button>
          </div>
        </div>
      </section>






      {/* ABOUT SECTION 
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", fontSize: "2.2rem", fontWeight: 700 }}>
            About This Project
          </h2>

          <p
            style={{
              maxWidth: "800px",
              margin: "1rem auto",
              textAlign: "center",
              fontSize: "1.2rem",
              lineHeight: "1.7",
            }}
          >
            Kubernetes Myths is an open project by <strong>Rajesh
            Deshpande</strong> to bring clarity, correctness, and real technical
            truth to the Kubernetes community.  
            No theory. No fluff. Only real experiments and validated behavior.
          </p>

  
        </div>
      </section>*/}

      {/* FOOTER CTA */}
      <section style={{ background: "#1a1a1a", padding: "4rem 0", color: "#fff" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>
            Stop believing. Start understanding.
          </h2>
          <p style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
            Explore the myths and strengthen your Kubernetes fundamentals.
          </p>

          <Link
            className="button button--primary button--lg"
            to="/category/architecture-myths"
            style={{ marginTop: "1.5rem" }}
          >
            Start Reading →
          </Link>
        </div>
      </section>
    </Layout>
  );
}
