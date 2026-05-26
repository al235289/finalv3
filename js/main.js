/* ==========================================================================
   C.A.M.E — main.js
   Todos los scripts del sitio consolidados en un solo archivo.
   ========================================================================== */


/* ==========================================================================
   1. CURSOR PERSONALIZADO — pluma de tinta
   ========================================================================== */
(function initCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  document.addEventListener('click', e => {
    const drop = document.createElement('div');
    drop.className = 'ink-drop';
    const size = 20 + Math.random() * 20;
    drop.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;`;
    document.body.appendChild(drop);
    setTimeout(() => drop.remove(), 500);
  });

  document.querySelectorAll('a, button, .enlace-opcion').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-4px,-4px) scale(1.5)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-4px,-4px) scale(1)');
  });
})();


/* ==========================================================================
   2. PANTALLA DE CARGA — PROYECTOR DE CINE MUDO
   ========================================================================== */
(function initLoader() {
  const loader      = document.getElementById('cine-loader');
  if (!loader) return;

  const countNum    = document.getElementById('countNum');
  const ringFill    = document.getElementById('ringFill');
  const loaderFrame = document.getElementById('loaderFrame');
  const sprL        = document.getElementById('sprocketL');
  const sprR        = document.getElementById('sprocketR');

  // Perforaciones de celuloide
  const holeCount = Math.ceil(window.innerHeight / 40);
  for (let i = 0; i < holeCount; i++) {
    [sprL, sprR].forEach(s => {
      if (!s) return;
      const h = document.createElement('div');
      h.className = 'hole';
      s.appendChild(h);
    });
  }

  // Contador de frames
  let lf = 1;
  const lfInterval = setInterval(() => {
    lf++;
    if (loaderFrame) loaderFrame.textContent = 'FRAME ' + String(lf).padStart(3, '0') + ' · 24fps';
  }, 42);

  // Ring SVG — circunferencia 2π × 70 ≈ 440
  const circum = 2 * Math.PI * 70;
  if (ringFill) {
    ringFill.style.strokeDasharray  = circum;
    ringFill.style.strokeDashoffset = 0;
  }

  let count = 3;
  const step = () => {
    if (count <= 0) {
      clearInterval(lfInterval);
      loader.classList.add('loader-exit');
      setTimeout(() => { loader.style.display = 'none'; }, 650);
      return;
    }
    if (countNum) countNum.textContent = count;
    if (ringFill) ringFill.style.strokeDashoffset = circum * (1 - count / 3);
    count--;
    setTimeout(step, 1000);
  };
  setTimeout(step, 400);
})();


/* ==========================================================================
   3. GENERADOR DE ESTRELLAS — parallax header
   ========================================================================== */
(function initStars() {
  const container = document.getElementById('parallaxStars');
  if (!container) return;

  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 3 + 1;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random() * 60}%;
      left:${Math.random() * 100}%;
      --dur:${(Math.random() * 2 + 1).toFixed(1)}s;
      --delay:${(Math.random() * 2).toFixed(1)}s;
      opacity:${Math.random() * 0.7 + 0.3};
    `;
    container.appendChild(s);
  }
})();


/* ==========================================================================
   4. GENERADOR DE NUBES CARTOON
   ========================================================================== */
(function initNubes() {
  const container = document.getElementById('parallaxNubes');
  if (!container) return;

  const nubeConfigs = [
    { w: 120, h: 45, top: '8%',  delay: '0s',   dur: '22s', dy: '0px' },
    { w: 80,  h: 32, top: '18%', delay: '-8s',  dur: '28s', dy: '10px' },
    { w: 160, h: 55, top: '12%', delay: '-14s', dur: '20s', dy: '-5px' },
    { w: 100, h: 38, top: '25%', delay: '-5s',  dur: '35s', dy: '5px' },
    { w: 70,  h: 28, top: '6%',  delay: '-20s', dur: '18s', dy: '0px' },
  ];

  nubeConfigs.forEach(cfg => {
    const n = document.createElement('div');
    n.className = 'nube';
    n.style.cssText = `
      width:${cfg.w}px; height:${cfg.h}px;
      top:${cfg.top};
      --dur:${cfg.dur};
      --dy:${cfg.dy};
      animation-delay:${cfg.delay};
    `;
    container.appendChild(n);
  });
})();


/* ==========================================================================
   5. PARTÍCULAS DE TINTA — CANVAS
   ========================================================================== */
(function initTinta() {
  const canvas = document.getElementById('canvas-tinta');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H * 0.8;
      this.r     = Math.random() * 3 + 1;
      this.vx    = (Math.random() - 0.5) * 0.4;
      this.vy    = (Math.random() - 0.5) * 0.3 - 0.1;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.fade  = Math.random() * 0.003 + 0.001;
      const cols = ['26,26,26', '182,25,25', '101,67,33'];
      this.color = cols[Math.floor(Math.random() * cols.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.fade;
      if (this.alpha <= 0) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  class Drop {
    constructor() { this.reset(); }
    reset() {
      this.x       = Math.random() * W;
      this.y       = -10;
      this.r       = Math.random() * 5 + 2;
      this.vy      = Math.random() * 1.5 + 0.5;
      this.alpha   = Math.random() * 0.4 + 0.2;
      this.life    = 0;
      this.maxLife = Math.random() * 120 + 60;
    }
    update() {
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.r * 0.7, this.r, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(26,26,26,${this.alpha})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: 60 }, () => new Particle());
  const drops     = Array.from({ length: 8  }, () => new Drop());

  const loop = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drops.forEach(d => { d.update(); d.draw(); });
    requestAnimationFrame(loop);
  };
  loop();
})();


/* ==========================================================================
   6. PARALLAX MULTI-CAPA: SCROLL + MOUSE
   ========================================================================== */
(function initParallax() {
  const header     = document.getElementById('parallaxHeader');
  const contenedor = document.getElementById('contenedorBox');
  const stars      = document.getElementById('parallaxStars');
  const nubes      = document.getElementById('parallaxNubes');
  const titulo     = document.getElementById('tituloPelicula');
  const frameHud   = document.getElementById('frameHud');

  if (!header) return;

  let mouseX = 0, mouseY = 0;
  let targetMX = 0, targetMY = 0;
  let frame = 1;

  // Frame counter
  setInterval(() => {
    frame = (frame % 9999) + 1;
    if (frameHud) frameHud.textContent = 'FRAME ' + String(frame).padStart(4, '0');
  }, 42);

  // Mouse tracking
  header.addEventListener('mousemove', e => {
    const rect = header.getBoundingClientRect();
    targetMX = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2;
    targetMY = ((e.clientY - rect.top)   / rect.height - 0.5) * 2;
  });
  header.addEventListener('mouseleave', () => { targetMX = 0; targetMY = 0; });

  const lerp = (a, b, t) => a + (b - a) * t;

  const animLoop = () => {
    mouseX = lerp(mouseX, targetMX, 0.06);
    mouseY = lerp(mouseY, targetMY, 0.06);

    if (stars)     stars.style.transform    = `translate(${mouseX * -8}px, ${mouseY * -5}px)`;
    if (nubes)     nubes.style.transform    = `translate(${mouseX * -15}px, ${mouseY * -8}px)`;
    if (titulo)    titulo.style.transform   = `translateX(calc(-50% + ${mouseX * 12}px)) translateY(${mouseY * 8}px)`;
    if (contenedor) {
      const despl = Math.min(window.scrollY * 0.15, 80);
      contenedor.style.transform = `translate(calc(-50% + ${mouseX * 20}px), calc(-50% + ${despl}px + ${mouseY * 12}px))`;
    }
    requestAnimationFrame(animLoop);
  };
  animLoop();

  // Scroll — capas
  window.addEventListener('scroll', () => {
    const sv = window.scrollY;

    if (stars)  stars.style.transform  = `translateY(${-sv * 0.5}px) translate(${mouseX * -8}px, ${mouseY * -5}px)`;
    if (nubes)  nubes.style.transform  = `translateY(${-sv * 0.3}px) translate(${mouseX * -15}px, ${mouseY * -8}px)`;
    if (titulo) titulo.style.transform = `translateX(calc(-50% + ${mouseX * 12}px)) translateY(${-sv * 0.2 + mouseY * 8}px)`;

    const pincel = document.querySelector('.contenedor-box .item-pincel');
    const regla  = document.querySelector('.contenedor-box .item-regla');
    const compas = document.querySelector('.contenedor-box .item-compas');
    if (pincel) pincel.style.transform = `translate(${-sv * 0.4}px, ${-sv * 0.25}px) rotate(${-sv * 0.08}deg)`;
    if (regla)  regla.style.transform  = `translateY(${-sv * 0.5}px) rotate(${sv * 0.04}deg)`;
    if (compas) compas.style.transform = `translate(${sv * 0.35}px, ${-sv * 0.35}px) rotate(${sv * 0.09}deg)`;
  });
})();


/* ==========================================================================
   7. NAVBAR — FRAME COUNTER + TOGGLER MOBILE
   ========================================================================== */
(function initNavbar() {
  const navFrame   = document.getElementById('navFrame');
  const navToggler = document.getElementById('navToggler');
  const mobileMenu = document.getElementById('mobileNavMenu');

  if (navFrame) {
    let nf = 1;
    setInterval(() => {
      nf = (nf % 9999) + 1;
      navFrame.textContent = 'FRAME ' + String(nf).padStart(3, '0');
    }, 42);
  }

  if (navToggler && mobileMenu) {
    navToggler.addEventListener('click', () => {
      const open = mobileMenu.style.display === 'flex';
      mobileMenu.style.display = open ? 'none' : 'flex';
    });
  }
})();


/* ==========================================================================
   8. HOME.HTML — ÚTILES QUE ASOMAN EN HOVER (menú de opciones)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const enlacesOpciones = document.querySelectorAll('.enlace-opcion');
  if (!enlacesOpciones.length) return;

  const configUtiles = {
    'item-pincel': { topOut: -95,  rotFija: -22 },
    'item-regla':  { topOut: -110, rotFija:   4 },
    'item-compas': { topOut: -90,  rotFija:  25 },
  };

  enlacesOpciones.forEach(enlace => {
    const utils = enlace.querySelectorAll('.objeto-logo');
    if (!utils.length) return;

    utils.forEach(util => {
      const tipo = Object.keys(configUtiles).find(k => util.classList.contains(k));
      const cfg  = configUtiles[tipo] || { topOut: -90, rotFija: 0 };
      util.style.transition = 'none';
      util.style.opacity    = '0';
      util.style.top        = '30px';
      util.style.transform  = `rotate(${cfg.rotFija}deg) scale(0.5)`;
    });

    enlace.addEventListener('mouseenter', () => {
      utils.forEach(util => {
        const tipo     = Object.keys(configUtiles).find(k => util.classList.contains(k));
        const cfg      = configUtiles[tipo] || { topOut: -90, rotFija: 0 };
        const rotExtra = Math.floor(Math.random() * 10) - 5;
        const escala   = (Math.random() * 0.1 + 1.0).toFixed(2);
        util.style.transition = 'top 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)';
        util.style.opacity    = '1';
        util.style.top        = `${cfg.topOut}px`;
        util.style.transform  = `rotate(${cfg.rotFija + rotExtra}deg) scale(${escala})`;
      });
    });

    enlace.addEventListener('mouseleave', () => {
      utils.forEach(util => {
        const tipo = Object.keys(configUtiles).find(k => util.classList.contains(k));
        const cfg  = configUtiles[tipo] || { topOut: -90, rotFija: 0 };
        util.style.transition = 'top 0.18s ease-in, opacity 0.15s ease, transform 0.18s ease-in';
        util.style.opacity    = '0';
        util.style.top        = '30px';
        util.style.transform  = `rotate(${cfg.rotFija}deg) scale(0.5)`;
      });
    });
  });
});


/* ==========================================================================
   9. MODALES — DONAR, ÉXITO Y FORMULARIOS
   ========================================================================== */
(function initModales() {
  const modalDonar     = document.getElementById('modal-donar');
  const modalExito     = document.getElementById('modal-exito');
  const btnNuevaPub    = document.getElementById('btn-nueva-pub');
  const btnCerrarModal = document.getElementById('cerrar-modal');
  const btnEntendido   = document.getElementById('btn-entendido');
  const btnVerPublicacion = document.getElementById('btn-ver-publicacion');
  const formDonacion   = document.getElementById('form-donacion');

  if (btnNuevaPub && modalDonar)
    btnNuevaPub.addEventListener('click', () => { modalDonar.style.display = 'flex'; });

  if (btnCerrarModal && modalDonar)
    btnCerrarModal.addEventListener('click', () => { modalDonar.style.display = 'none'; });

  if (formDonacion && modalDonar && modalExito) {
    formDonacion.addEventListener('submit', e => {
      e.preventDefault();
      modalDonar.style.display = 'none';
      modalExito.style.display = 'flex';
      formDonacion.reset();
      const contenedorPrecio = document.getElementById('contenedor-precio');
      if (contenedorPrecio) contenedorPrecio.style.display = 'none';
    });
  }

  if (btnEntendido && modalExito)
    btnEntendido.addEventListener('click', () => { modalExito.style.display = 'none'; });

  if (btnVerPublicacion && modalExito) {
    btnVerPublicacion.addEventListener('click', () => {
      modalExito.style.display = 'none';
      window.location.href = 'foro.html';
    });
  }

  window.addEventListener('click', e => {
    if (modalDonar && e.target === modalDonar) modalDonar.style.display = 'none';
    if (modalExito && e.target === modalExito) modalExito.style.display = 'none';
  });
})();


/* ==========================================================================
   10. INTERFAZ DINÁMICA — CHECKBOX DE PRECIO
   ========================================================================== */
(function initPrecio() {
  const venderCheck      = document.getElementById('vender-check');
  const contenedorPrecio = document.getElementById('contenedor-precio');
  const inputPrecio      = document.getElementById('precio');

  if (!venderCheck || !contenedorPrecio) return;

  venderCheck.addEventListener('change', () => {
    if (venderCheck.checked) {
      contenedorPrecio.style.display = 'block';
      if (inputPrecio) inputPrecio.required = true;
    } else {
      contenedorPrecio.style.display = 'none';
      if (inputPrecio) { inputPrecio.required = false; inputPrecio.value = ''; }
    }
  });
})();


/* ==========================================================================
   11. AUTENTICACIÓN — LOGIN, REGISTRO Y VERIFICACIÓN
   ========================================================================== */
function redirigirALogin(event) {
  event.preventDefault();
  Swal.fire({
    title: '¡Registro Exitoso!',
    text: 'Hemos enviado un código de verificación a tu correo institucional.',
    icon: 'success',
    confirmButtonColor: '#003CA6',
    confirmButtonText: 'Verificar ahora'
  }).then(result => {
    if (result.isConfirmed) {
      const modalVerificacion = document.getElementById('ventana-verificacion');
      if (modalVerificacion) modalVerificacion.style.display = 'flex';
    }
  });
}

function verificarCodigo(event) {
  event.preventDefault();
  Swal.fire({
    title: '¡Cuenta Activada!',
    text: 'Tu correo institucional ha sido validado correctamente.',
    icon: 'success',
    confirmButtonColor: '#003CA6',
    confirmButtonText: 'Ingresar a C.A.M.E.'
  }).then(result => {
    if (result.isConfirmed) window.location.href = 'incio_sesion.html';
  });
}

function iniciarSesion(event) {
  event.preventDefault();
  window.location.href = 'home.html';
}


/* ==========================================================================
   12. INPUTS DE CÓDIGO DE VERIFICACIÓN (OTP)
   ========================================================================== */
(function initCodigoInputs() {
  const codigosInput = document.querySelectorAll('.codigo-input');
  if (!codigosInput.length) return;

  codigosInput.forEach((input, index) => {
    input.addEventListener('input', () => {
      if (input.value.length === 1 && index < codigosInput.length - 1)
        codigosInput[index + 1].focus();
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && input.value.length === 0 && index > 0)
        codigosInput[index - 1].focus();
    });
  });
})();


/* ==========================================================================
   13. MÓDULO DE ACCIONES — ELIMINAR Y COMENTAR PUBLICACIONES
   ========================================================================== */
(function initAcciones() {
  // Eliminar publicación
  document.querySelectorAll('.btn-eliminar').forEach(boton => {
    boton.addEventListener('click', e => {
      const tarjeta = e.target.closest('.tarjeta-gestion');
      if (!tarjeta) return;
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará permanentemente tu publicación.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff4d4d',
        cancelButtonColor: '#c5c5c5',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          tarjeta.remove();
          const mensajeVacio = document.getElementById('lista-vacia');
          if (!document.querySelector('.tarjeta-gestion') && mensajeVacio)
            mensajeVacio.style.display = 'block';
          Swal.fire({ title: 'Eliminado', text: 'Tu publicación ha sido removida.', icon: 'success', confirmButtonColor: '#003CA6' });
        }
      });
    });
  });

  // Comentar publicación
  document.querySelectorAll('.btn-comentar').forEach(boton => {
    boton.addEventListener('click', () => {
      Swal.fire({
        title: 'Escribe tu comentario',
        input: 'textarea',
        inputPlaceholder: 'Pregunta por el material o inicia una discusión...',
        showCancelButton: true,
        confirmButtonColor: '#003CA6',
        cancelButtonColor: '#c5c5c5',
        confirmButtonText: 'Enviar Comentario',
        cancelButtonText: 'Cancelar'
      }).then(text => {
        if (text.value)
          Swal.fire({ title: '¡Comentario publicado!', text: 'Tu mensaje se ha agregado con éxito.', icon: 'success', confirmButtonColor: '#003CA6' });
      });
    });
  });
})();

/* ==========================================================================
   14. FORO — FILTROS DE CATEGORÍA Y LIKES
   ========================================================================== */
(function initForo() {

  // --- FILTROS ---
  const filtros = document.querySelectorAll('.filtro-btn');
  const tarjetas = document.querySelectorAll('.post-card');

  filtros.forEach(btn => {
    btn.addEventListener('click', () => {
      filtros.forEach(b => b.classList.remove('filtro-activo'));
      btn.classList.add('filtro-activo');

      const filtro = btn.dataset.filtro;
      tarjetas.forEach(card => {
        const cat = card.dataset.categoria;
        card.style.display = (filtro === 'todo' || cat === filtro) ? '' : 'none';
      });
    });
  });

  // --- LIKES ---
  document.querySelectorAll('.btn-like').forEach(btn => {
    btn.addEventListener('click', () => {
      const liked = btn.dataset.liked === 'true';
      const countEl = btn.querySelector('.accion-count');
      const iconEl  = btn.querySelector('.accion-icono');
      const current = parseInt(countEl.textContent, 10);

      if (liked) {
        btn.dataset.liked = 'false';
        btn.classList.remove('liked');
        countEl.textContent = current - 1;
        iconEl.textContent  = '♡';
      } else {
        btn.dataset.liked = 'true';
        btn.classList.add('liked');
        countEl.textContent = current + 1;
        iconEl.textContent  = '♥';
      }
    });
  });

  // --- COMPARTIR ---
  document.querySelectorAll('.btn-compartir').forEach(btn => {
    btn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({ title: 'C.A.M.E — Material estudiantil', url: window.location.href });
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          const count = btn.querySelector('.accion-count');
          const orig  = count.textContent;
          count.textContent = '¡Copiado!';
          setTimeout(() => { count.textContent = orig; }, 1500);
        });
      }
    });
  });

  // --- CONTACTAR ---
  document.querySelectorAll('.btn-contactar').forEach(btn => {
    btn.addEventListener('click', () => {
      Swal && Swal.fire({
        title: '¿Cómo quieres contactar?',
        text: 'El usuario será notificado de tu interés en el material.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#B61919',
        cancelButtonColor: '#1A1A1A',
        confirmButtonText: '✉️ Enviar mensaje',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          Swal.fire({ title: '¡Mensaje enviado!', text: 'El dueño del material recibirá tu solicitud.', icon: 'success', confirmButtonColor: '#B61919' });
        }
      });
    });
  });

})();


/* ==========================================================================
   15. DONAR — PESTAÑAS, GESTIÓN DE TARJETAS Y PREVIEW DE IMAGEN
   ========================================================================== */
(function initDonar() {

  // --- PESTAÑAS ---
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('tab-activo'));
      btn.classList.add('tab-activo');
      const target = btn.dataset.tab;
      tabPanels.forEach(panel => {
        panel.style.display = panel.id === 'tab-' + target ? '' : 'none';
      });
    });
  });

  // --- BOTÓN VACÍO: abre modal ---
  const btnVacio = document.getElementById('btn-nueva-pub-vacio');
  const modalDonar = document.getElementById('modal-donar');
  if (btnVacio && modalDonar) {
    btnVacio.addEventListener('click', () => { modalDonar.style.display = 'flex'; });
  }

  // --- PREVIEW DE IMAGEN EN MODAL ---
  const fileInput   = document.getElementById('foto');
  const previewImg  = document.getElementById('img-preview');
  const placeholder = document.getElementById('img-placeholder');

  if (fileInput && previewImg && placeholder) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        previewImg.src = e.target.result;
        previewImg.style.display = 'block';
        placeholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    });
  }

  // --- MARCAR COMO ENTREGADO ---
  document.querySelectorAll('.tg-btn--entregar').forEach(btn => {
    btn.addEventListener('click', () => {
      const tarjeta = btn.closest('.tarjeta-gestion-nueva');
      if (!tarjeta) return;

      Swal && Swal.fire({
        title: '¿Marcar como entregado?',
        text: 'La publicación se moverá al historial de entregas.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1A1A1A',
        cancelButtonColor: '#c5c5c5',
        confirmButtonText: '✅ Sí, entregar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          tarjeta.style.transition = 'opacity 0.3s, transform 0.3s';
          tarjeta.style.opacity = '0';
          tarjeta.style.transform = 'translateX(20px)';
          setTimeout(() => {
            tarjeta.remove();
            actualizarContador();
            Swal.fire({ title: '¡Entregado!', text: 'Se ha movido a tu historial.', icon: 'success', confirmButtonColor: '#B61919' });
          }, 300);
        }
      });
    });
  });

  // --- ACTUALIZAR CONTADOR DE ACTIVOS ---
  function actualizarContador() {
    const lista = document.getElementById('gestion-lista');
    const statEl = document.getElementById('stat-activos');
    const vacioDom = document.getElementById('lista-vacia');
    if (!lista) return;
    const restantes = lista.querySelectorAll('.tarjeta-gestion-nueva').length;
    if (statEl) statEl.textContent = restantes;
    if (vacioDom) vacioDom.style.display = restantes === 0 ? 'flex' : 'none';
  }

})();