/**
 * Obsidian Monolith — Dynamic Content Renderer
 * Editorial rendering for Competitive Programming & Academic Telemetry (with animated counter hooks),
 * MedMatch AI Case Study Spread, Capabilities Matrix, and Contact Dispatch.
 */

import { portfolioData } from './data.js';
import { copyToClipboard } from './toast.js';

export function renderCompetitiveTelemetry() {
  const container = document.getElementById('telemetry-ledger-container');
  if (!container) return;

  const cf = portfolioData.cpProfiles.codeforces;
  const lc = portfolioData.cpProfiles.leetcode;
  const m = portfolioData.metrics;

  container.innerHTML = `
    <!-- Card A: Codeforces -->
    <div class="monolith-stat-card cp-card">
      <div class="card-meta">
        <span class="meta-platform font-mono">${cf.platform.toUpperCase()}</span>
        <span class="meta-badge badge-orange">${cf.tierLabel}</span>
      </div>
      <div class="card-title-group">
        <h3 class="card-heading">${cf.domain}</h3>
        <span class="card-handle font-mono">@${cf.handle}</span>
      </div>
      
      <div class="stat-metrics-row">
        <div class="metric-cell">
          <span class="metric-label font-mono">CURRENT RATING</span>
          <span class="metric-value font-mono accent-orange" data-counter-target="${m.codeforcesCurrent.value}" data-counter-decimals="0" data-counter-suffix="">${m.codeforcesCurrent.value}</span>
          <span class="metric-footnote">Active Competition Rating</span>
        </div>
        <div class="metric-cell">
          <span class="metric-label font-mono">MAX RATING</span>
          <span class="metric-value font-mono" data-counter-target="${m.codeforcesMax.value}" data-counter-decimals="0" data-counter-suffix="">${m.codeforcesMax.value}</span>
          <span class="metric-footnote">Peak Rating Archive</span>
        </div>
      </div>

      <div class="card-action-bar">
        <a href="${cf.profileUrl}" target="_blank" rel="noopener noreferrer" class="monolith-link-btn font-mono" aria-label="Verify Codeforces Profile for Imuday08_ in a new tab">
          <span>Verify on Codeforces</span>
          <span class="link-arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </div>

    <!-- Card B: LeetCode -->
    <div class="monolith-stat-card cp-card">
      <div class="card-meta">
        <span class="meta-platform font-mono">${lc.platform.toUpperCase()}</span>
        <span class="meta-badge badge-amber">102 Days Streak</span>
      </div>
      <div class="card-title-group">
        <h3 class="card-heading">${lc.domain}</h3>
        <span class="card-handle font-mono">@${lc.handle}</span>
      </div>

      <div class="stat-metrics-row">
        <div class="metric-cell">
          <span class="metric-label font-mono">TOTAL SUBMISSIONS</span>
          <span class="metric-value font-mono accent-orange" data-counter-target="${m.leetcodeSubmissions.value}" data-counter-decimals="0" data-counter-suffix="${m.leetcodeSubmissions.suffix}">${m.leetcodeSubmissions.value}${m.leetcodeSubmissions.suffix}</span>
          <span class="metric-footnote">450+ Total Submissions Evaluated</span>
        </div>
        <div class="metric-cell">
          <span class="metric-label font-mono">ACTIVE STREAK</span>
          <span class="metric-value font-mono accent-amber" data-counter-target="${m.leetcodeStreak.value}" data-counter-decimals="0" data-counter-suffix="${m.leetcodeStreak.suffix}">102 Days</span>
          <span class="metric-footnote">102 Days Streak · Daily Practice</span>
        </div>
      </div>

      <div class="card-action-bar">
        <a href="${lc.profileUrl}" target="_blank" rel="noopener noreferrer" class="monolith-link-btn font-mono" aria-label="Verify LeetCode Profile for Imuday08__ in a new tab">
          <span>Verify on LeetCode</span>
          <span class="link-arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  `;
}

export function renderCaseStudy() {
  const container = document.getElementById('case-study-container');
  if (!container) return;

  const cs = portfolioData.caseStudy;

  container.innerHTML = `
    <article class="monolith-case-spread" aria-labelledby="case-study-title">
      <!-- Case Meta Header -->
      <div class="case-spread-header">
        <div class="header-badge-group">
          <span class="case-id font-mono">${cs.index} // ${cs.team}</span>
          <span class="case-status-badge font-mono">${cs.status}</span>
        </div>
        <span class="case-domain font-mono">${cs.domain}</span>
      </div>

      <!-- Case Content Grid -->
      <div class="case-spread-grid">
        <!-- Narrative Column -->
        <div class="case-content-col">
          <h3 id="case-study-title" class="case-title-main">${cs.title}</h3>
          
          <div class="case-narrative-block">
            <h4 class="case-subheading font-mono">Problem Statement</h4>
            <p class="case-text">${cs.problemStatement}</p>
          </div>

          <div class="case-narrative-block">
            <h4 class="case-subheading font-mono">Architectural Scope</h4>
            <p class="case-text">${cs.scopeStatement}</p>
          </div>

          <div class="case-narrative-block">
            <h4 class="case-subheading font-mono">Intended Capabilities</h4>
            <ul class="case-list">
              ${cs.capabilities.map(c => `
                <li class="case-list-item">
                  <span class="list-marker" aria-hidden="true">▸</span>
                  <span>${c}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="case-tech-group">
            <span class="tech-group-label font-mono">Technology Stack:</span>
            <div class="tech-tags-row font-mono">
              ${cs.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
          </div>

          <div class="case-cta-container">
            <a href="${cs.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-monolith-primary font-mono" aria-label="Launch MedMatch AI Live Prototype in a new tab">
              <span>View Live Demo</span>
              <span class="btn-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <!-- Schematic Visual Column -->
        <div class="case-schematic-col" aria-label="MedMatch AI workflow schematic">
          <div class="schematic-board">
            <div class="schematic-header">
              <span class="schematic-title font-mono">Workflow Architecture Schematic</span>
              <span class="schematic-mode font-mono">Prototype UI Flow</span>
            </div>

            <!-- Workflow Stage Blocks -->
            <div class="schematic-flow-list">
              <div class="workflow-card active">
                <span class="card-num font-mono">01</span>
                <div class="card-details">
                  <strong class="card-title font-mono">SOS Trigger</strong>
                  <span class="card-desc">Rapid emergency state declaration &amp; triage</span>
                </div>
              </div>

              <div class="flow-arrow" aria-hidden="true">↓</div>

              <div class="workflow-card">
                <span class="card-num font-mono">02</span>
                <div class="card-details">
                  <strong class="card-title font-mono">Resource Filtering</strong>
                  <span class="card-desc">Bed, ICU, Ventilator, Specialty &amp; Distance</span>
                </div>
              </div>

              <div class="flow-arrow" aria-hidden="true">↓</div>

              <div class="workflow-card">
                <span class="card-num font-mono">03</span>
                <div class="card-details">
                  <strong class="card-title font-mono">Ranked Discovery</strong>
                  <span class="card-desc">Distance &amp; facility readiness prioritization</span>
                </div>
              </div>

              <div class="flow-arrow" aria-hidden="true">↓</div>

              <div class="workflow-card">
                <span class="card-num font-mono">04</span>
                <div class="card-details">
                  <strong class="card-title font-mono">Transfer Coordination</strong>
                  <span class="card-desc">Direct facility intake coordination</span>
                </div>
              </div>
            </div>

            <div class="schematic-footer font-mono">
              Concept prototype. No live ambulance dispatch or real-time clinical database integration claimed.
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

export function renderCapabilitiesMatrix() {
  const container = document.getElementById('capabilities-matrix-container');
  if (!container) return;

  const matrix = portfolioData.capabilitiesMatrix;

  container.innerHTML = matrix.map(col => `
    <div class="matrix-column-card">
      <div class="matrix-card-header">
        <span class="matrix-index font-mono">${col.index}</span>
        <h4 class="matrix-title">${col.category}</h4>
      </div>
      <ul class="matrix-skills-list">
        ${col.skills.map(s => `
          <li class="skill-item">
            <span class="skill-dot" aria-hidden="true"></span>
            <span>${s}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

export function initContactAndDispatch() {
  const copyBtn = document.getElementById('btn-copy-email');
  if (copyBtn) {
    copyBtn.onclick = async (e) => {
      e.preventDefault();
      const email = portfolioData.personalInfo.email;
      await copyToClipboard(email, 'Email address copied to clipboard');
    };
  }
}
