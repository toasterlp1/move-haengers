const Backgrounds = (() => {

  const themes = {
    rooftop: {
      // Person auf Rooftop, Nachtstadt Skyline im Hintergrund, NYC-style
      url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=85&fit=crop&crop=center',
      overlay: 'rgba(3,2,12,0.45)',
    },
    autumn: {
      // Schwarze Katze auf nassem Pflaster mit Herbstblättern — genau dein Foto-Vibe
      url: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1920&q=85&fit=crop&crop=center',
      overlay: 'rgba(8,4,0,0.4)',
    },
    forest: {
      // Dunkler mystischer Wald mit Sonnenlicht durch Bäume
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=85&fit=crop&crop=center',
      overlay: 'rgba(1,6,2,0.45)',
    },
    library: {
      // Alte Bibliothek mit Gewölbe und warmem Licht — genau wie dein Bild
      url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=85&fit=crop&crop=center',
      overlay: 'rgba(6,4,1,0.45)',
    },
    neon: {
      // Nasse Nachtstraße mit Neon-Reflektionen auf dem Asphalt
      url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=1920&q=85&fit=crop&crop=center',
      overlay: 'rgba(2,0,10,0.45)',
    },
    blood: {
      // Dunkle rote Nacht, bedrohlich, leer
      url: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1920&q=85&fit=crop&crop=center',
      overlay: 'rgba(12,0,0,0.55)',
    },
    graffiti: {
      // Jemand sitzt auf einer Mauer mit Graffiti bei Nacht — genau dein Bild
      url: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1920&q=85&fit=crop&crop=center',
      overlay: 'rgba(4,4,6,0.5)',
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
