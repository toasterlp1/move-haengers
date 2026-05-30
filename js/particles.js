/* =============================================
   GAMING HUB — PARTICLE SYSTEM
   ============================================= */

const ParticleSystem = (() => {
  let canvas, ctx, particles = [], animId, enabled = true;

  const config = {
    count: 60,
    speed: 0.3,
    maxSize: 2.5,
    connectionDist: 120,
    color: '#00ff88'
  };

  function init() {
    canvas = document.getElementById('particles');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    spawnAll();
    loop();
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function randomParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * config.speed * 2,
      vy: (Math.random() - 0.5) * config.speed * 2,
      size: Math.random() * config.maxSize + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2
    };
  }

  function spawnAll() {
    particles = [];
    for (let i = 0; i < config.count; i++) particles.push(randomParticle());
  }

  function loop() {
    if (!enabled) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const time = Date.now() * 0.001;

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const pulse = Math.sin(p.pulse) * 0.3 + 0.7;
      const op = p.opacity * pulse;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(config.color, op * 0.8);
      ctx.fill();

      // connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.connectionDist) {
          const lineOp = (1 - dist / config.connectionDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = hexToRgba(config.color, lineOp);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    animId = requestAnimationFrame(loop);
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function setColor(hex) {
    config.color = hex;
  }

  function setEnabled(val) {
    enabled = val;
    if (!enabled && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (enabled && !animId) loop();
  }

  return { init, setColor, setEnabled, spawnAll };
})();

document.addEventListener('DOMContentLoaded', () => {
  ParticleSystem.init();
});
