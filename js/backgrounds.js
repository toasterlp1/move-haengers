const Backgrounds = (() => {

  const themes = {
    rooftop: {
      url: 'assets/rooftop.jpg',
      overlay: 'rgba(3,2,12,0.35)',
    },
    autumn: {
      url: 'assets/autumn.jpg',
      overlay: 'rgba(8,4,0,0.3)',
    },
    forest: {
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=85&fit=crop',
      overlay: 'rgba(1,6,2,0.45)',
    },
    library: {
      url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=85&fit=crop',
      overlay: 'rgba(6,4,1,0.45)',
    },
    neon: {
      url: 'assets/neon.jpg',
      overlay: 'rgba(2,0,10,0.3)',
    },
    blood: {
      url: 'assets/blood.jpg',
      overlay: 'rgba(5,0,0,0.3)',
    },
    graffiti: {
      url: 'assets/graffiti.jpg',
      overlay: 'rgba(4,2,4,0.35)',
    },
    void: {
      url: null,
      overlay: null,
    }
  };

  const bgOverlay = document.getElementById('bg-overlay');

  function clear() {
    document.body.style.backgroundImage = '';
    document.body.style.backgroundColor = '';
    if (bgOverlay) bgOverlay.style.background = '';
  }

  function apply(name) {
    clear();
    const theme = themes[name] || themes.rooftop;

    if (name === 'void') {
      document.body.style.backgroundColor = '#000';
      if (bgOverlay) bgOverlay.style.background = 'radial-gradient(ellipse 40% 40% at 50% 50%, rgba(20,0,40,0.5), transparent)';
      return;
    }

    document.body.style.backgroundImage = `url('${theme.url}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundColor = '#05050f';

    if (bgOverlay) bgOverlay.style.background = theme.overlay;
  }

  return { apply, clear };
})();
