(() => {
  const steps = [
    { copy: 'A small, readable source fixture is parsed as syntax — the project does not execute the scanned code.', markup: '<div class="trace-code" aria-label="Sample source file app.py"><span class="code-line"><i>1</i><span>import yaml</span></span><span class="code-line"><i>2</i><span></span></span><span class="code-line"><i>3</i><span><b>def</b> run():</span></span><span class="code-line code-focus"><i>4</i><span>    yaml.load(&quot;payload: true&quot;)</span></span></div>' },
    { copy: 'The call graph makes the route visible: the application entry point reaches yaml.load.', markup: '<div class="trace-flow" aria-label="Call path: entry point to run to yaml.load"><span class="trace-node-box">ENTRY POINT<small>module</small></span><span class="trace-arrow" aria-hidden="true">→</span><span class="trace-node-box">run() → yaml.load<small>app.py:4</small></span></div>' },
    { copy: 'This fixture has a verifiable path, so PyReach reports REACHABLE and keeps the evidence attached.', markup: '<div class="trace-verdict"><i aria-hidden="true"></i> REACHABLE <span>·</span> HIGH EVIDENCE</div><p class="trace-path">run <strong>→</strong> yaml.load · app.py:4</p>' }
  ];
  const explanation = document.querySelector('#trace-explanation');
  const stage = document.querySelector('#trace-stage');
  document.querySelectorAll('.trace-tab').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.step);
      const step = steps[index];
      if (!step) return;
      document.querySelectorAll('.trace-tab').forEach((tab) => {
        const selected = tab === button;
        tab.classList.toggle('is-selected', selected);
        tab.setAttribute('aria-pressed', String(selected));
      });
      stage.dataset.step = String(index);
      stage.querySelector('.trace-code,.trace-flow,.trace-verdict')?.remove();
      stage.insertAdjacentHTML('afterbegin', step.markup);
      explanation.textContent = step.copy;
    });
  });

  const reveal = document.querySelectorAll('.hero-copy,.hero-art,.section-heading,.feature-project,.secondary-project,.practice-grid,.about-main,.toolbelt,.closing');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveal.forEach((item) => observer.observe(item));
  } else {
    reveal.forEach((item) => item.classList.add('is-visible'));
  }
})();
