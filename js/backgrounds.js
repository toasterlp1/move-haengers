/* =============================================
   GAMING HUB — ATMOSPHERIC BACKGROUNDS
   ============================================= */

const Backgrounds = (() => {

  const deco = document.getElementById('bg-deco');
  let currentBg = null;
  let animFrames = [];

  const themes = {

    rooftop: {
      bodyClass: 'bg-rooftop',
      build() {
        // City lights in the distance
        for (let i = 0; i < 80; i++) {
          const dot = document.createElement('div');
          dot.className = 'city-light';
          const size = Math.random() * 3 + 1;
          const colors = ['#ffb84d','#ff8800','#cc44ff','#4488ff','#ffffff','#ffee44'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          dot.style.cssText = `
            width:${size}px; height:${size}px;
            left:${Math.random()*100}%;
            top:${30 + Math.random()*50}%;
            background:${color};
            box-shadow:0 0 ${size*3}px ${color};
            animation-duration:${2 + Math.random()*4}s;
            animation-delay:${Math.random()*3}s;
            opacity:${0.4 + Math.random()*0.6};
          `;
          deco.appendChild(dot);
        }
        // Distant building silhouettes as SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('viewBox','0 0 1440 900');
        svg.style.cssText = 'position:absolute;bottom:0;left:0;width:100%;height:60%;opacity:0.15;';
        svg.innerHTML = `
          <rect x="0" y="400" width="80" height="500" fill="#0a0a14"/>
          <rect x="60" y="300" width="60" height="600" fill="#0c0c18"/>
          <rect x="110" y="350" width="90" height="550" fill="#080810"/>
          <rect x="190" y="250" width="50" height="650" fill="#0a0a14"/>
          <rect x="230" y="380" width="120" height="520" fill="#0c0c18"/>
          <rect x="340" y="200" width="70" height="700" fill="#080810"/>
          <rect x="400" y="320" width="100" height="580" fill="#0a0a14"/>
          <rect x="490" y="280" width="60" height="620" fill="#0c0c18"/>
          <rect x="540" y="150" width="80" height="750" fill="#080810"/>
          <rect x="610" y="350" width="110" height="550" fill="#0a0a14"/>
          <rect x="710" y="220" width="90" height="680" fill="#0c0c18"/>
          <rect x="790" y="300" width="70" height="600" fill="#080810"/>
          <rect x="850" y="180" width="120" height="720" fill="#0a0a14"/>
          <rect x="960" y="270" width="80" height="630" fill="#0c0c18"/>
          <rect x="1030" y="350" width="100" height="550" fill="#080810"/>
          <rect x="1120" y="200" width="60" height="700" fill="#0a0a14"/>
          <rect x="1170" y="300" width="90" height="600" fill="#0c0c18"/>
          <rect x="1250" y="250" width="80" height="650" fill="#080810"/>
          <rect x="1320" y="380" width="120" height="520" fill="#0a0a14"/>
        `;
        deco.appendChild(svg);
      }
    },

    autumn: {
      bodyClass: 'bg-autumn',
      build() {
        const leafShapes = ['M10,0 Q20,5 15,15 Q10,25 0,20 Q-5,10 5,5 Z',
          'M0,10 Q10,0 20,8 Q15,20 5,18 Z',
          'M8,0 Q18,8 12,18 Q2,15 0,5 Z'];
        const leafColors = ['#c84800','#e06000','#d03000','#b84000','#ff6600','#993000'];

        function spawnLeaf() {
          const leaf = document.createElement('div');
          leaf.className = 'leaf';
          const color = leafColors[Math.floor(Math.random() * leafColors.length)];
          const size = 12 + Math.random() * 16;
          leaf.style.cssText = `
            left:${Math.random()*110-5}%;
            top:-30px;
            width:${size}px; height:${size}px;
            background:${color};
            clip-path:polygon(50% 0%, 80% 20%, 100% 50%, 80% 80%, 50% 100%, 20% 80%, 0% 50%, 20% 20%);
            animation-duration:${6 + Math.random()*8}s;
            animation-delay:${Math.random()*4}s;
            opacity:0.7;
          `;
          deco.appendChild(leaf);
          setTimeout(() => leaf.remove(), (14 + Math.random()*8)*1000);
        }

        for (let i = 0; i < 15; i++) setTimeout(() => spawnLeaf(), i * 400);
        const iv = setInterval(spawnLeaf, 600);
        animFrames.push(iv);

        // Street lamp glow
        const lamp = document.createElement('div');
        lamp.style.cssText = `
          position:absolute; bottom:0; right:15%;
          width:4px; height:60vh;
          background:linear-gradient(180deg,rgba(255,180,60,0.8),rgba(255,120,0,0.2),transparent);
        `;
        deco.appendChild(lamp);
        const glow = document.createElement('div');
        glow.style.cssText = `
          position:absolute; bottom:40vh; right:calc(15% - 40px);
          width:88px; height:88px;
          border-radius:50%;
          background:radial-gradient(circle,rgba(255,200,80,0.25),transparent 70%);
          animation:cityFlicker 3s ease-in-out infinite;
        `;
        deco.appendChild(glow);
      }
    },

    forest: {
      bodyClass: 'bg-forest',
      build() {
        // Fireflies
        for (let i = 0; i < 25; i++) {
          const ff = document.createElement('div');
          ff.className = 'firefly';
          ff.style.cssText = `
            left:${10 + Math.random()*80}%;
            top:${20 + Math.random()*70}%;
            --fx:${(Math.random()-0.5)*60}px;
            --fy:${(Math.random()-0.5)*60}px;
            animation-duration:${4 + Math.random()*6}s;
            animation-delay:${Math.random()*5}s;
          `;
          deco.appendChild(ff);
        }
        // Tree silhouettes
        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('viewBox','0 0 1440 900');
        svg.style.cssText = 'position:absolute;bottom:0;left:0;width:100%;height:80%;opacity:0.4;';
        const treeFill = '#010801';
        svg.innerHTML = `
          <polygon points="0,900 60,500 120,900" fill="${treeFill}"/>
          <polygon points="40,900 100,400 160,900" fill="${treeFill}"/>
          <polygon points="120,900 180,520 240,900" fill="${treeFill}"/>
          <polygon points="200,900 260,450 320,900" fill="${treeFill}"/>
          <polygon points="280,900 340,480 400,900" fill="${treeFill}"/>
          <polygon points="360,900 420,420 480,900" fill="${treeFill}"/>
          <polygon points="440,900 500,460 560,900" fill="${treeFill}"/>
          <polygon points="900,900 960,440 1020,900" fill="${treeFill}"/>
          <polygon points="980,900 1040,480 1100,900" fill="${treeFill}"/>
          <polygon points="1060,900 1120,420 1180,900" fill="${treeFill}"/>
          <polygon points="1140,900 1200,460 1260,900" fill="${treeFill}"/>
          <polygon points="1220,900 1280,500 1340,900" fill="${treeFill}"/>
          <polygon points="1300,900 1360,440 1420,900" fill="${treeFill}"/>
          <polygon points="1360,900 1420,480 1480,900" fill="${treeFill}"/>
          <!-- sun glow -->
          <ellipse cx="720" cy="600" rx="120" ry="80" fill="rgba(255,160,30,0.08)"/>
          <ellipse cx="720" cy="620" rx="60" ry="40" fill="rgba(255,180,60,0.1)"/>
        `;
        deco.appendChild(svg);
      }
    },

    library: {
      bodyClass: 'bg-library',
      build() {
        // Dust motes floating in warm light
        for (let i = 0; i < 30; i++) {
          const mote = document.createElement('div');
          mote.className = 'dust-mote';
          mote.style.cssText = `
            left:${20 + Math.random()*60}%;
            top:${20 + Math.random()*60}%;
            --dx:${(Math.random()-0.5)*40}px;
            --dy:${(Math.random()-0.5)*40}px;
            animation-duration:${6 + Math.random()*8}s;
            animation-delay:${Math.random()*6}s;
          `;
          deco.appendChild(mote);
        }
        // Warm light rays from top
        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('viewBox','0 0 1440 900');
        svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;opacity:1;';
        svg.innerHTML = `
          <defs>
            <linearGradient id="ray1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(255,180,60,0.08)"/>
              <stop offset="100%" stop-color="rgba(255,160,40,0)"/>
            </linearGradient>
            <linearGradient id="ray2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(255,200,80,0.06)"/>
              <stop offset="100%" stop-color="rgba(255,180,60,0)"/>
            </linearGradient>
          </defs>
          <polygon points="300,0 500,0 800,900 100,900" fill="url(#ray1)"/>
          <polygon points="800,0 950,0 1400,900 1200,900" fill="url(#ray2)"/>
          <!-- bookshelf lines -->
          <line x1="0" y1="300" x2="200" y2="300" stroke="rgba(180,120,40,0.15)" stroke-width="2"/>
          <line x1="0" y1="450" x2="200" y2="450" stroke="rgba(180,120,40,0.12)" stroke-width="2"/>
          <line x1="0" y1="600" x2="200" y2="600" stroke="rgba(180,120,40,0.1)" stroke-width="2"/>
          <line x1="1240" y1="280" x2="1440" y2="280" stroke="rgba(180,120,40,0.15)" stroke-width="2"/>
          <line x1="1240" y1="430" x2="1440" y2="430" stroke="rgba(180,120,40,0.12)" stroke-width="2"/>
          <line x1="1240" y1="580" x2="1440" y2="580" stroke="rgba(180,120,40,0.1)" stroke-width="2"/>
        `;
        deco.appendChild(svg);
      }
    },

    neon: {
      bodyClass: 'bg-neon',
      build() {
        // Neon streaks moving across
        const streakColors = ['rgba(180,0,255,0.5)','rgba(0,200,255,0.5)','rgba(255,0,150,0.4)','rgba(0,255,200,0.3)'];
        for (let i = 0; i < 8; i++) {
          const streak = document.createElement('div');
          streak.className = 'neon-streak';
          const color = streakColors[Math.floor(Math.random() * streakColors.length)];
          streak.style.cssText = `
            width:${200 + Math.random()*400}px;
            top:${Math.random()*100}%;
            --streak-color:${color};
            animation-duration:${6 + Math.random()*10}s;
            animation-delay:${Math.random()*6}s;
            opacity:${0.4 + Math.random()*0.4};
          `;
          deco.appendChild(streak);
        }
        // Neon grid lines
        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('viewBox','0 0 1440 900');
        svg.style.cssText = 'position:absolute;bottom:0;left:0;width:100%;height:50%;opacity:1;';
        svg.innerHTML = `
          <defs>
            <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(180,0,255,0.15)"/>
              <stop offset="100%" stop-color="rgba(180,0,255,0.02)"/>
            </linearGradient>
          </defs>
          ${Array.from({length:12},(_,i)=>`<line x1="${i*130}" y1="0" x2="${720+(i-6)*200}" y2="900" stroke="url(#gridFade)" stroke-width="1"/>`).join('')}
          ${Array.from({length:8},(_,i)=>`<line x1="0" y1="${i*130}" x2="1440" y2="${i*130+100}" stroke="rgba(0,200,255,0.05)" stroke-width="1"/>`).join('')}
        `;
        deco.appendChild(svg);
        // Glowing dots
        for (let i = 0; i < 20; i++) {
          const dot = document.createElement('div');
          dot.className = 'city-light';
          const colors = ['#cc00ff','#00ccff','#ff0088'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          const size = 2 + Math.random() * 4;
          dot.style.cssText = `
            width:${size}px; height:${size}px;
            left:${Math.random()*100}%;
            top:${Math.random()*100}%;
            background:${color};
            box-shadow:0 0 ${size*4}px ${color}, 0 0 ${size*8}px ${color}44;
            animation-duration:${1+Math.random()*3}s;
            animation-delay:${Math.random()*2}s;
          `;
          deco.appendChild(dot);
        }
      }
    },

    blood: {
      bodyClass: 'bg-blood',
      build() {
        // Blood drips from top
        for (let i = 0; i < 12; i++) {
          const drip = document.createElement('div');
          drip.className = 'blood-drip';
          const h = 40 + Math.random() * 120;
          drip.style.cssText = `
            left:${Math.random()*100}%;
            --drip-h:${h}px;
            animation-duration:${4 + Math.random()*6}s;
            animation-delay:${Math.random()*5}s;
          `;
          deco.appendChild(drip);
        }
        // Crack lines SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('viewBox','0 0 1440 900');
        svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;opacity:1;';
        svg.innerHTML = `
          <line x1="200" y1="0" x2="350" y2="300" stroke="rgba(150,0,0,0.2)" stroke-width="1.5"/>
          <line x1="350" y1="300" x2="280" y2="600" stroke="rgba(120,0,0,0.15)" stroke-width="1"/>
          <line x1="350" y1="300" x2="450" y2="500" stroke="rgba(120,0,0,0.12)" stroke-width="1"/>
          <line x1="1100" y1="0" x2="980" y2="250" stroke="rgba(150,0,0,0.2)" stroke-width="1.5"/>
          <line x1="980" y1="250" x2="1050" y2="500" stroke="rgba(120,0,0,0.15)" stroke-width="1"/>
          <line x1="980" y1="250" x2="880" y2="450" stroke="rgba(120,0,0,0.12)" stroke-width="1"/>
          <!-- blood pool at bottom -->
          <ellipse cx="720" cy="920" rx="600" ry="80" fill="rgba(120,0,0,0.12)"/>
        `;
        deco.appendChild(svg);
      }
    },

    graffiti: {
      bodyClass: 'bg-graffiti',
      build() {
        // Abstract graffiti tag lines
        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('viewBox','0 0 1440 900');
        svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
        const tagColors = ['rgba(255,220,0,0.07)','rgba(0,200,100,0.06)','rgba(255,50,50,0.06)','rgba(0,150,255,0.05)','rgba(255,100,200,0.05)'];
        let paths = '';
        for (let i = 0; i < 8; i++) {
          const color = tagColors[Math.floor(Math.random()*tagColors.length)];
          const x = Math.random()*1200;
          const y = Math.random()*700;
          const w = 80 + Math.random()*200;
          const h = 30 + Math.random()*80;
          // Wavy graffiti path
          paths += `<path d="M${x},${y} C${x+w*0.2},${y-h} ${x+w*0.5},${y+h} ${x+w},${y-h*0.3} S${x+w*1.5},${y+h*0.5} ${x+w*1.8},${y}" stroke="${color}" stroke-width="${2+Math.random()*3}" fill="none"/>`;
        }
        // Brick texture lines
        for (let row = 0; row < 20; row++) {
          const y = row * 46;
          const offset = (row % 2) * 70;
          paths += `<line x1="0" y1="${y}" x2="1440" y2="${y}" stroke="rgba(255,255,255,0.015)" stroke-width="1"/>`;
          for (let col = -1; col < 11; col++) {
            paths += `<line x1="${offset + col*140}" y1="${y}" x2="${offset + col*140}" y2="${y+46}" stroke="rgba(255,255,255,0.015)" stroke-width="1"/>`;
          }
        }
        svg.innerHTML = paths;
        deco.appendChild(svg);
        // Street lamp light
        const lampGlow = document.createElement('div');
        lampGlow.style.cssText = `
          position:absolute; top:0; left:8%;
          width:200px; height:200px;
          border-radius:50%;
          background:radial-gradient(circle,rgba(255,240,150,0.12),transparent 70%);
          animation:cityFlicker 4s ease-in-out infinite;
        `;
        deco.appendChild(lampGlow);
      }
    },

    void: {
      bodyClass: 'bg-void',
      build() {
        // Just a few distant stars
        for (let i = 0; i < 40; i++) {
          const star = document.createElement('div');
          star.className = 'city-light';
          const size = Math.random() * 1.5 + 0.5;
          star.style.cssText = `
            width:${size}px; height:${size}px;
            left:${Math.random()*100}%;
            top:${Math.random()*100}%;
            background:rgba(255,255,255,${0.3+Math.random()*0.4});
            box-shadow:0 0 ${size*2}px rgba(255,255,255,0.3);
            animation-duration:${3+Math.random()*5}s;
            animation-delay:${Math.random()*4}s;
          `;
          deco.appendChild(star);
        }
      }
    }
  };

  function clear() {
    // Remove body classes
    Object.values(themes).forEach(t => document.body.classList.remove(t.bodyClass));
    // Clear deco
    while (deco && deco.firstChild) deco.removeChild(deco.firstChild);
    // Clear intervals
    animFrames.forEach(id => clearInterval(id));
    animFrames = [];
  }

  function apply(name) {
    clear();
    currentBg = name;
    const theme = themes[name] || themes.rooftop;
    document.body.classList.add(theme.bodyClass);
    if (theme.build) theme.build();
  }

  return { apply, clear };
})();
