import Phaser from 'phaser';

function loadSavedVolumes() {
  try {
    const raw = localStorage.getItem('game_settings');
    if (!raw) return { musicVolume: 0.7, sfxVolume: 0.7 };
    const json = JSON.parse(raw);
    // Backward compatibility: if only `volume` exists, use for both
    const base = Number(json.volume);
    const music = Number(json.musicVolume);
    const sfx = Number(json.sfxVolume);
    const musicVolume = Number.isFinite(music) ? music : (Number.isFinite(base) ? base : 0.7);
    const sfxVolume = Number.isFinite(sfx) ? sfx : (Number.isFinite(base) ? base : 0.7);
    return {
      musicVolume: Phaser.Math.Clamp(musicVolume, 0, 1),
      sfxVolume: Phaser.Math.Clamp(sfxVolume, 0, 1)
    };
  } catch (_) {
    return { musicVolume: 0.7, sfxVolume: 0.7 };
  }
}

function saveVolumes({ musicVolume, sfxVolume }) {
  try {
    const payload = { musicVolume, sfxVolume };
    localStorage.setItem('game_settings', JSON.stringify(payload));
  } catch (_) {}
}

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
    this.musicVolume = 0.7;
    this.sfxVolume = 0.7;
  }

  preload() {
    this.load.image('fondoM', '/imagenes/logoSinFondo.png');
    this.load.image('boton', '/imagenes/botonTexto.png');
    this.load.audio('hover', '/sounds/hover.mp3');
  }

  create() {
    // Fondo
    this.add.image(500, 350, 'fondoM').setScale(0.8);

    // Cargar volúmenes guardados
    const { musicVolume, sfxVolume } = loadSavedVolumes();
    this.musicVolume = musicVolume;
    this.sfxVolume = sfxVolume;

    // Panel base
    this.add.rectangle(500, 280, 1000, 560, 0x000000).setAlpha(0.6).setDepth(-1);

    this.add.text(500, 110, 'Ajustes', {
      fontSize: '48px',
      fontFamily: 'Tagesschrift',
      color: '#4bffabff',
    }).setOrigin(0.5);

    // Sección Música
    this.add.text(500, 170, 'Música', {
      fontSize: '28px',
      fontFamily: 'Tagesschrift',
      color: '#ffffff',
    }).setOrigin(0.5);
    this.musicValueText = this.add.text(500, 205, this.fmtPct(this.musicVolume), {
      fontSize: '20px', fontFamily: 'Tagesschrift', color: '#ffffff'
    }).setOrigin(0.5);
    this.musicSlider = this.createSlider(500, 240, this.musicVolume, (v) => {
      this.musicVolume = v;
      this.musicValueText.setText(this.fmtPct(v));
      saveVolumes({ musicVolume: this.musicVolume, sfxVolume: this.sfxVolume });
      // Actualizar música en reproducción (menú/bgm) si existen
      try {
        const gm = this.game?.sound;
        if (gm && Array.isArray(gm.sounds)) {
          gm.sounds.forEach(s => {
            if (!s || !s.key) return;
            if (s.key === 'musicaMenu' || s.key === 'bgm') {
              s.setVolume(this.musicVolume);
            }
          });
        }
      } catch (_) {}
    });

    // Sección SFX
    this.add.text(500, 300, 'Efectos (SFX)', {
      fontSize: '28px',
      fontFamily: 'Tagesschrift',
      color: '#ffffff',
    }).setOrigin(0.5);
    this.sfxValueText = this.add.text(500, 335, this.fmtPct(this.sfxVolume), {
      fontSize: '20px', fontFamily: 'Tagesschrift', color: '#ffffff'
    }).setOrigin(0.5);
    this.sfxSlider = this.createSlider(500, 370, this.sfxVolume, (v) => {
      this.sfxVolume = v;
      this.sfxValueText.setText(this.fmtPct(v));
      saveVolumes({ musicVolume: this.musicVolume, sfxVolume: this.sfxVolume });
      // Actualizar loops SFX (por ejemplo, caminar) si existen
      try {
        const gm = this.game?.sound;
        if (gm && Array.isArray(gm.sounds)) {
          gm.sounds.forEach(s => {
            if (!s || !s.key) return;
            if (s.key === 'walk') s.setVolume(0.3 * this.sfxVolume);
          });
        }
        // Feedback de sonido al mover (click ligero)
        this.sound.play('hover', { volume: 0.5 * this.sfxVolume });
      } catch (_) {}
    });

    // Botón volver
    const backBg = this.add.image(500, 440, 'boton').setScale(0.1);
    const backBtn = this.add.text(500, 440, 'Volver', {
      fontSize: '24px',
      fontFamily: 'Tagesschrift',
      color: '#000000ff',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    backBtn.on('pointerover', () => { backBtn.setStyle({ fill: '#4bffabff' }); this.playHover(); });
    backBtn.on('pointerout', () => backBtn.setStyle({ fill: '#000000ff' }));
    backBtn.on('pointerdown', () => {
      this.scene.stop();
      this.scene.start('MenuScene');
    });
  }

  fmtPct(v) { return `${Math.round(v * 100)}%`; }

  playHover() {
    try { this.sound.play('hover', { volume: 0.5 * this.sfxVolume }); } catch(_) {}
  }

  createSlider(x, y, initialValue, onChange) {
    const width = 300;
    const height = 8;
    const left = x - width / 2;

    // Track
    const track = this.add.rectangle(x, y, width, height, 0xffffff).setAlpha(0.3);
    // Fill
    const fill = this.add.rectangle(left, y, width * initialValue, height, 0x4bffab).setOrigin(0, 0.5);
    // Handle
    const handle = this.add.circle(left + width * initialValue, y, 10, 0x4bffab).setStrokeStyle(2, 0xffffff);
    handle.setInteractive({ useHandCursor: true, draggable: true });
    this.input.setDraggable(handle, true);

    const setFromPointer = (pointerX) => {
      const clamped = Phaser.Math.Clamp((pointerX - left) / width, 0, 1);
      const value = Math.round(clamped * 100) / 100; // 2 decimales
      fill.width = width * value;
      handle.x = left + width * value;
      onChange(value);
    };

    // Click en el track
    track.setInteractive({ useHandCursor: true });
    track.on('pointerdown', (p) => setFromPointer(p.worldX));
    fill.setInteractive({ useHandCursor: true });
    fill.on('pointerdown', (p) => setFromPointer(p.worldX));

    // Drag del handle
    this.input.on('drag', (_pointer, gameObject, dragX) => {
      if (gameObject !== handle) return;
      setFromPointer(dragX);
    });

    return { track, fill, handle };
  }
}
