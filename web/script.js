/* ============================================================
   ÉLEV — Interactive presentation scripts
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const hasGSAP = !!(window.gsap && window.ScrollTrigger);
    if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

    // ---------- Hero background video ----------
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        if (reduceMotion) {
            heroVideo.pause();
        } else {
            heroVideo.play().catch(() => {});
            // pause playback while the hero is off-screen
            new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) heroVideo.play().catch(() => {});
                else heroVideo.pause();
            }, { threshold: 0.05 }).observe(heroVideo);
        }
    }

    // ---------- Navigation ----------
    const nav = document.getElementById('main-nav');
    const menuBtn = document.getElementById('nav-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50), { passive: true });
    menuBtn?.addEventListener('click', () => mobileMenu.classList.toggle('active'));
    mobileMenu?.querySelectorAll('a').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('active')));

    // ---------- Word-by-word reveal (GSAP) ----------
    function splitWords(el) {
        const walk = node => {
            [...node.childNodes].forEach(child => {
                if (child.nodeType === 3) {
                    const frag = document.createDocumentFragment();
                    child.textContent.split(/(\s+)/).forEach(tok => {
                        if (!tok) return;
                        if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
                        const w = document.createElement('span'); w.className = 'wr-word';
                        const inner = document.createElement('span'); inner.className = 'wr-inner';
                        inner.textContent = tok; w.appendChild(inner); frag.appendChild(w);
                    });
                    node.replaceChild(frag, child);
                } else if (child.nodeType === 1 && child.tagName !== 'BR') {
                    walk(child);
                }
            });
        };
        walk(el);
        el.classList.add('word-reveal');
        return el.querySelectorAll('.wr-inner');
    }
    if (hasGSAP && !reduceMotion) {
        document.querySelectorAll('.section-title, .manifesto-text').forEach(el => {
            el.removeAttribute('data-animate'); // handled by GSAP, skip the IO fade
            const words = splitWords(el);
            if (!words.length) return;
            gsap.fromTo(words,
                { yPercent: 115, opacity: 0 },
                {
                    yPercent: 0, opacity: 1, duration: .9, ease: 'power4.out', stagger: .05,
                    scrollTrigger: { trigger: el, start: 'top 86%', once: true }
                });
        });
    }

    // ---------- Reveal on scroll ----------
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 90);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));

    // ============================================================
    // DECOMPOSE — scroll-driven exploded view
    // ============================================================
    const decompose = document.querySelector('.decompose');
    if (decompose) {
        const layers = [...document.querySelectorAll('.explode-layer')];
        const stage = document.getElementById('stage-layers');
        const bar = document.getElementById('decompose-bar');
        const hint = document.getElementById('stage-hint');
        const listItems = [...document.querySelectorAll('#part-list li')];
        // top -> bottom along the assembly axis
        const order = ['coperchio', 'tappo', 'tirante', 'colonna', 'supporto', 'base', 'piedini'];

        let lastP = 0;
        function renderAt(p) {
            lastP = p;
            const H = stage.clientHeight || 1;

            layers.forEach(l => {
                const f = parseFloat(l.dataset.explode);
                const ty = f * H * p;
                const sc = 1 + 0.018 * p;
                if (hasGSAP) gsap.set(l, { y: ty, scale: sc });
                else l.style.transform = `translateY(${ty}px) scale(${sc})`;
            });

            if (bar) bar.style.width = (p * 100).toFixed(1) + '%';

            const idx = Math.min(Math.floor(p * order.length + 0.0001), order.length - 1);
            listItems.forEach(li => {
                const k = order.indexOf(li.dataset.part);
                li.classList.toggle('active', p > 0.02 && k <= idx);
            });
            const cur = order[idx];
            layers.forEach(l => l.classList.toggle('focus', p > 0.04 && p < 0.99 && l.dataset.part === cur));

            if (hint) {
                if (p < 0.03) hint.textContent = 'assemblato';
                else if (p > 0.97) hint.textContent = 'esploso · 8 componenti';
                else hint.textContent = 'scomposizione ' + Math.round(p * 100) + '%';
            }
        }

        if (hasGSAP && !reduceMotion) {
            // ScrollTrigger with scrub smoothing for a fluid, inertial explosion
            ScrollTrigger.create({
                trigger: decompose,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.7,
                onUpdate: self => renderAt(self.progress),
                onRefresh: self => renderAt(self.progress)
            });
            window.addEventListener('resize', () => renderAt(lastP));
        } else {
            let ticking = false;
            function render() {
                ticking = false;
                const rect = decompose.getBoundingClientRect();
                const travel = decompose.offsetHeight - window.innerHeight;
                renderAt(travel > 0 ? clamp(-rect.top / travel, 0, 1) : 0);
            }
            function onScroll() {
                if (!ticking) { ticking = true; requestAnimationFrame(render); }
            }
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', render);
            render();
        }
    }

    // ============================================================
    // Gallery
    // ============================================================
    const galleryData = {
        main: [
            { src: 'images/render_open_hero.jpg', label: 'Meccanismo elevato — vista 3/4' },
            { src: 'images/render_open_dramatic.jpg', label: 'Apertura completa — colonna estesa' },
            { src: 'images/render_open_angled.jpg', label: 'Coperchio sollevato — vista angolare' },
            { src: 'images/render_front_spring.jpg', label: 'Molla di compressione frontale' },
            { src: 'images/render_lid_top.jpg', label: 'Coperchio in ottone — vista zenitale' },
            { src: 'images/render_open_floating.jpg', label: 'Meccanismo sospeso' },
            { src: 'images/render_exploded_front.jpg', label: 'Esploso tecnico — frontale' },
            { src: 'images/render_exploded_angled.jpg', label: 'Esploso tecnico — angolare' },
        ],
        components: [
            { src: 'images/parts/coperchio.png', label: 'S_03 — Coperchio in Ottone OT58' },
            { src: 'images/parts/supporto.png', label: 'S_02 — Supporto Rotante in Acciaio C45' },
            { src: 'images/parts/colonna.png', label: 'S_05 — Colonna Centrale in PLA' },
            { src: 'images/parts/tirante.png', label: 'S_07 — Tirante in Alluminio 6082' },
            { src: 'images/parts/base.png', label: 'S_01 — Base in Alluminio Anodizzato' },
            { src: 'images/parts/tappo.png', label: 'S_06/08 — Tappi in PLA (Lavorazione in coppia)' },
            { src: 'images/parts/piedini.png', label: 'S_09 — Piedini in TPU (×4)' },
            { src: 'images/parts/assembled.png', label: 'Assieme completo del meccanismo' },
        ],
        details: [
            { src: 'images/acquisti_1.png', label: 'Molla di Compressione in Acciaio' },
            { src: 'images/acquisti_2.png', label: 'Cuscinetto Reggispinta NTN 51124' },
            { src: 'images/acquisti_3.png', label: 'Magnete Neodimio N52' },
            { src: 'images/acquisti_4.png', label: 'O-Ring di Tenuta NBR' },
            { src: 'images/minuteria_1.png', label: 'Viti e Minuteria di Collegamento' },
        ]
    };

    const galleryGrid = document.getElementById('gallery-grid');
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    let currentImages = [];

    function renderGallery(tab) {
        const items = galleryData[tab] || [];
        currentImages = items;
        galleryGrid.innerHTML = '';
        items.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.innerHTML = `<img src="${item.src}" alt="${item.label}" loading="lazy"><div class="gallery-item-label">${item.label}</div>`;
            div.addEventListener('click', () => openLightbox(i));
            galleryGrid.appendChild(div);
        });
    }
    galleryTabs.forEach(tab => tab.addEventListener('click', () => {
        galleryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderGallery(tab.dataset.tab);
    }));
    renderGallery('main');

    // ---------- Lightbox ----------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    let lbIndex = 0;
    function showLb() {
        const item = currentImages[lbIndex];
        lightboxImg.src = item.src; lightboxImg.alt = item.label; lightboxCaption.textContent = item.label;
    }
    function openLightbox(i) { lbIndex = i; showLb(); lightbox.classList.add('active'); document.body.style.overflow = 'hidden'; }
    function closeLightbox() { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
    function navLb(d) { lbIndex = (lbIndex + d + currentImages.length) % currentImages.length; showLb(); }
    document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev')?.addEventListener('click', () => navLb(-1));
    document.getElementById('lightbox-next')?.addEventListener('click', () => navLb(1));
    lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navLb(-1);
        if (e.key === 'ArrowRight') navLb(1);
    });

    // ---------- Accordion ----------
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.accordion-item').forEach(ai => ai.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });

    // ---------- Counters ----------
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseFloat(el.dataset.target);
            const isFloat = target % 1 !== 0;
            const dur = 1800; const step = target / (dur / 16); let cur = 0;
            const timer = setInterval(() => {
                cur += step;
                if (cur >= target) { cur = target; clearInterval(timer); }
                el.textContent = isFloat ? cur.toFixed(1) : Math.floor(cur).toLocaleString('it-IT');
            }, 16);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));

    // ---------- 3D Tilt with dynamic glare (GSAP) ----------
    const tiltEnabled = hasGSAP && !reduceMotion && window.matchMedia('(pointer: fine)').matches;
    function addTilt(el) {
        if (!tiltEnabled || el.classList.contains('tilt')) return;
        el.classList.add('tilt');
        const glare = document.createElement('div');
        glare.className = 'tilt-glare';
        el.appendChild(glare);

        gsap.set(el, { transformPerspective: 1000 });
        const rotX = gsap.quickTo(el, 'rotationX', { duration: .55, ease: 'power3.out' });
        const rotY = gsap.quickTo(el, 'rotationY', { duration: .55, ease: 'power3.out' });
        const lift = gsap.quickTo(el, 'scale', { duration: .55, ease: 'power3.out' });
        const MAX = 7; // degrees

        el.addEventListener('pointermove', e => {
            const r = el.getBoundingClientRect();
            const px = clamp((e.clientX - r.left) / r.width, 0, 1);
            const py = clamp((e.clientY - r.top) / r.height, 0, 1);
            rotY((px - .5) * 2 * MAX);
            rotX((.5 - py) * 2 * MAX);
            lift(1.015);
            el.style.setProperty('--glare-x', (px * 100).toFixed(1) + '%');
            el.style.setProperty('--glare-y', (py * 100).toFixed(1) + '%');
        });
        el.addEventListener('pointerleave', () => { rotX(0); rotY(0); lift(1); });
    }
    document.querySelectorAll('.feature-card, .plate, .gallery-item').forEach(addTilt);
    // gallery items are re-created on tab switch
    if (galleryGrid) {
        new MutationObserver(() =>
            galleryGrid.querySelectorAll('.gallery-item').forEach(addTilt)
        ).observe(galleryGrid, { childList: true });
    }

    // ---------- Smooth anchor scroll ----------
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if (id.length < 2) return;
            const t = document.querySelector(id);
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });

    // ---------- Order buttons ----------
    document.getElementById('order-btn')?.addEventListener('click', () => alert('Grazie per il tuo interesse in ÉLEV.\nConfigurazione ordine — demo di presentazione.'));
    document.getElementById('contact-btn')?.addEventListener('click', () => { location.href = '#order'; });

    // ============================================================
    // Charts
    // ============================================================
    if (window.Chart) {
        Chart.defaults.color = '#b6b3ac';
        Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
        Chart.defaults.font.family = "'Manrope', sans-serif";
        const tooltip = { backgroundColor: 'rgba(20,20,23,0.96)', titleColor: '#f4f2ee', bodyColor: '#b6b3ac', borderColor: 'rgba(201,169,110,0.25)', borderWidth: 1, cornerRadius: 12, padding: 14 };

        const bomCtx = document.getElementById('bom-chart');
        if (bomCtx) {
            new Chart(bomCtx, {
                type: 'doughnut',
                data: { labels: ['Semilavorati (S)', 'Commerciali (C)', 'Minuteria (M)'], datasets: [{ data: [192.04, 171.00, 1.86], backgroundColor: ['rgba(224,166,74,.85)', 'rgba(107,168,255,.85)', 'rgba(74,208,127,.85)'], borderColor: ['#e0a64a', '#6ba8ff', '#4ad07f'], borderWidth: 2, hoverOffset: 14 }] },
                options: { responsive: true, maintainAspectRatio: false, cutout: '66%', plugins: { legend: { display: false }, tooltip: { ...tooltip, callbacks: { label: c => `${c.label}: €${c.parsed.toFixed(2)}` } } } }
            });
            const leg = document.getElementById('bom-legend');
            [['#e0a64a', 'Semilavorati (S): €192,04'], ['#6ba8ff', 'Commerciali (C): €171,00'], ['#4ad07f', 'Minuteria (M): €1,86']].forEach(([c, t]) => { const d = document.createElement('div'); d.className = 'chart-legend-item'; d.innerHTML = `<span class="chart-legend-dot" style="background:${c}"></span>${t}`; leg.appendChild(d); });
        }

        const prodCtx = document.getElementById('production-chart');
        if (prodCtx) {
            new Chart(prodCtx, {
                type: 'doughnut',
                data: { labels: ['Materie Prime (BOM)', 'Manodopera Diretta', 'Ammortamenti', 'Costi Fissi'], datasets: [{ data: [364.90, 113.75, 190.50, 17.00], backgroundColor: ['rgba(201,169,110,.85)', 'rgba(168,130,200,.85)', 'rgba(224,90,90,.85)', 'rgba(120,130,150,.85)'], borderColor: ['#c9a96e', '#a882c8', '#e05a5a', '#788296'], borderWidth: 2, hoverOffset: 14 }] },
                options: { responsive: true, maintainAspectRatio: false, cutout: '66%', plugins: { legend: { display: false }, tooltip: { ...tooltip, callbacks: { label: c => `${c.label}: €${c.parsed.toFixed(2)}` } } } }
            });
            const leg = document.getElementById('production-legend');
            [['#c9a96e', 'Materie Prime: €364,90'], ['#a882c8', 'Manodopera: €113,75'], ['#e05a5a', 'Ammortamenti: €190,50'], ['#788296', 'Costi Fissi: €17,00']].forEach(([c, t]) => { const d = document.createElement('div'); d.className = 'chart-legend-item'; d.innerHTML = `<span class="chart-legend-dot" style="background:${c}"></span>${t}`; leg.appendChild(d); });
        }

        const bepCtx = document.getElementById('bep-chart');
        if (bepCtx) {
            const units = [], rev = [], tot = [], fix = [];
            const cf = 1606250, cv = 364.90, price = 1106.55;
            for (let q = 0; q <= 5000; q += 100) { units.push(q); rev.push(price * q); tot.push(cf + cv * q); fix.push(cf); }
            new Chart(bepCtx, {
                type: 'line',
                data: { labels: units, datasets: [
                    { label: 'Ricavi', data: rev, borderColor: '#4ad07f', fill: false, pointRadius: 0, borderWidth: 2.5 },
                    { label: 'Costi Totali', data: tot, borderColor: '#e05a5a', fill: false, pointRadius: 0, borderWidth: 2.5 },
                    { label: 'Costi Fissi', data: fix, borderColor: 'rgba(120,130,150,.6)', borderDash: [8, 4], fill: false, pointRadius: 0, borderWidth: 1.5 }
                ] },
                options: { responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: 'index' },
                    plugins: { legend: { position: 'top', labels: { boxWidth: 12, boxHeight: 12, borderRadius: 6, useBorderRadius: true, padding: 18 } }, tooltip: { ...tooltip, callbacks: { title: i => `${i[0].label} unità`, label: c => `${c.dataset.label}: €${(c.parsed.y / 1000).toFixed(0)}k` } } },
                    scales: { x: { title: { display: true, text: 'Unità Prodotte', color: '#6f6c66' }, grid: { display: false }, ticks: { callback: (v, i) => i % 5 === 0 ? units[i] : '', maxRotation: 0 } }, y: { title: { display: true, text: 'Euro (€)', color: '#6f6c66' }, ticks: { callback: v => `€${(v / 1e6).toFixed(1)}M` }, grid: { color: 'rgba(255,255,255,0.04)' } } } }
            });
        }

        const weightCtx = document.getElementById('weight-chart');
        if (weightCtx) {
            const comps = ['Base\n(Al 6082)', 'Supporto\n(C45)', 'Coperchio\n(OT58)', 'Tirante\n(Al 6082)', 'Colonna\n(PLA)', 'Tappi S06/S08\n(Coppia PLA)', 'Piedino\n(TPU)'];
            new Chart(weightCtx, {
                type: 'bar',
                data: { labels: comps, datasets: [
                    { label: 'Peso Grezzo (kg)', data: [12.83, 21.71, 9.69, 1.13, 0.061, 0.060, 0.011], backgroundColor: 'rgba(201,169,110,.6)', borderColor: '#c9a96e', borderWidth: 1, borderRadius: 6 },
                    { label: 'Peso Finito (kg)', data: [4.97, 9.48, 4.00, 1.08, 0.061, 0.030, 0.011], backgroundColor: 'rgba(107,168,255,.6)', borderColor: '#6ba8ff', borderWidth: 1, borderRadius: 6 }
                ] },
                options: { responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', labels: { boxWidth: 12, boxHeight: 12, borderRadius: 6, useBorderRadius: true, padding: 18 } }, tooltip: { ...tooltip, callbacks: { label: c => `${c.dataset.label}: ${c.parsed.y.toFixed(3)} kg` } } },
                    scales: { x: { grid: { display: false }, ticks: { maxRotation: 0, font: { size: 11 } } }, y: { title: { display: true, text: 'Peso (kg)', color: '#6f6c66' }, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: v => `${v} kg` } } } }
            });
        }
    }
});
