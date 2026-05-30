/* =============================================
   GAMING HUB — PHOTO BACKGROUNDS
   ============================================= */

const Backgrounds = (() => {

  // Unsplash direct URLs — kostenlos & keine Attribution nötig
  const themes = {
    rooftop: {
      url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80&fit=crop',
      overlay: 'rgba(5,3,15,0.55)',
      bodyClass: 'bg-photo'
    },
    autumn: {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80&fit=crop',
      overlay: 'rgba(10,5,0,0.5)',
      bodyClass: 'bg-photo'
    },
    forest: {
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80&fit=crop',
      overlay: 'rgba(2,10,4,0.5)',
      bodyClass: 'bg-photo'
    },
    library: {
      url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80&fit=crop',
      overlay: 'rgba(8,5,2,0.5)',
      bodyClass: 'bg-photo'
    },
    neon: {
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&q=80&fit=crop',
      overlay: 'rgba(3,0,15,0.5)',
      bodyClass: 'bg-photo'
    },
    blood: {
      url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1920&q=80&fit=crop',
      overlay: 'rgba(15,0,0,0.6)',
      bodyClass: 'bg-photo'
    },
    graffiti: {
      url: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1920&q=80&fit=crop',
      overlay: 'rgba(5,5,8,0.55)',
      bodyClass: 'bg-photo'
    },
    void: {
      url: null,
      overlay: null,
      bodyClass: 'bg-void'
    }
  };

  const overlay = document.getElementById('bg-overlay');
  const deco = document.getElementById('bg-deco');

  function clear() {
    document.body.style.backgroundImage = '';
    document.body.style.backgroundColor = '';
    if (overlay) overlay.style.background = '';
    if (deco) deco.innerHTML = '';
    document.body.className = document.body.className
      .split(' ').filter(c => !c.startsWith('bg-')).join(' ');
  }

  function apply(name) {
    clear();
    const theme = themes[name] || themes.rooftop;

    if (name === 'void') {
      document.body.style.backgroundColor = '#000';
      document.body.classList.add('bg-void');
      if (overlay) overlay.style.background = 'radial-gradient(ellipse 40% 40% at 50% 50%, rgba(20,0,40,0.5), transparent)';
      return;
    }

    document.body.style.backgroundImage = `url('${theme.url}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';

    if (overlay) overlay.style.background = theme.overlay;
  }

  return { apply, clear };
})();
