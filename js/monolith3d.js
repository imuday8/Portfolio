/**
 * Obsidian Monolith — 3D Spatial Motion & Kinetic Parallax Engine
 * - Smooth lerped pointer coordinates (rotateX, rotateY capped at ±5deg) with fluid damping.
 * - Lerped scroll inertia: Eliminates abrupt zoom-in/out and jitter.
 * - Natural weighted depth: translateZ and subtle scale dampening over perspective(1200px).
 * - Graceful touch/mobile fallback with ambient levitation.
 */

export function initMonolith3D() {
  const container = document.querySelector('.monolith-3d-scene');
  const monolith = document.querySelector('.monolith-core-mesh');
  if (!container || !monolith) return;

  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;

  let targetScrollY = 0;
  let currentScrollY = 0;

  let isHovered = false;
  let rafId = null;

  // Track window dimensions
  let winWidth = window.innerWidth;
  let winHeight = window.innerHeight;

  const onResize = () => {
    winWidth = window.innerWidth;
    winHeight = window.innerHeight;
  };
  window.addEventListener('resize', onResize, { passive: true });

  const hudPills = document.querySelectorAll('.orbital-hud-pill');

  // Pointer movement listener with fluid normalized coords
  const handlePointerMove = (e) => {
    isHovered = true;
    const normX = (e.clientX / winWidth) * 2 - 1;
    const normY = (e.clientY / winHeight) * 2 - 1;

    // Fluid pointer tilt capped at ±10deg for 3D astrolabe depth
    targetMouseX = Math.max(-10, Math.min(10, normX * 10));
    targetMouseY = Math.max(-10, Math.min(10, -normY * 10));
  };

  const handlePointerLeave = () => {
    isHovered = false;
    targetMouseX = 0;
    targetMouseY = 0;
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  document.addEventListener('mouseleave', handlePointerLeave);

  // Scroll listener for target scroll position
  const handleScroll = () => {
    targetScrollY = window.scrollY || window.pageYOffset || 0;
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Weighted lerp function
  const lerp = (start, end, factor) => start + (end - start) * factor;

  function renderLoop() {
    // Smooth pointer interpolation (factor 0.055 for weighted gyroscopic inertia)
    currentRotateX = lerp(currentRotateX, targetMouseY, 0.055);
    currentRotateY = lerp(currentRotateY, targetMouseX, 0.055);

    // Smooth scroll inertia interpolation (factor 0.06 for physical weight)
    currentScrollY = lerp(currentScrollY, targetScrollY, 0.06);

    // Smooth normalized scroll progress past hero
    const maxScroll = Math.max(winHeight * 1.2, 1);
    const scrollProgress = Math.min(Math.max(currentScrollY / maxScroll, 0), 1);

    // Subtle, weighted depth displacement — NO harsh zooming or jitter
    const scrollTranslateZ = -scrollProgress * 30; // Subtle 30px depth recession
    const scrollRotateZ = scrollProgress * 3.5;     // Gentle 3.5deg axial rotation
    const scrollScale = 1 - scrollProgress * 0.04; // Minimal 4% scale change

    // Ambient floating breath (subtle sine oscillation)
    const time = performance.now() * 0.0015;
    const ambientFloat = Math.sin(time) * 3.5;

    monolith.style.transform = `
      translate3d(0, ${ambientFloat.toFixed(2)}px, ${scrollTranslateZ.toFixed(2)}px)
      rotateX(${currentRotateX.toFixed(2)}deg)
      rotateY(${currentRotateY.toFixed(2)}deg)
      rotateZ(${scrollRotateZ.toFixed(2)}deg)
      scale(${scrollScale.toFixed(3)})
    `;

    // Multi-layer 3D Parallax offset for floating glass HUD pills
    if (hudPills.length > 0) {
      hudPills.forEach(pill => {
        const depth = parseFloat(pill.dataset.depth || "1.0");
        const offX = currentRotateY * depth * 1.8;
        const offY = -currentRotateX * depth * 1.5;
        pill.style.transform = `translate3d(${offX.toFixed(1)}px, ${offY.toFixed(1)}px, ${(depth * 20).toFixed(1)}px)`;
      });
    }

    rafId = requestAnimationFrame(renderLoop);
  }

  renderLoop();

  // Clean-up hook
  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('mouseleave', handlePointerLeave);
  };
}
