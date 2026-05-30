/* ============================================
   ÉLEV — Interactive Landing Page Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // Navigation
    // =========================
    const nav = document.getElementById('main-nav');
    const menuBtn = document.getElementById('nav-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    menuBtn?.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    mobileMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('active'));
    });

    // =========================
    // Scroll Animations
    // =========================
    const animateElements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(el => observer.observe(el));

    // =========================
    // Gallery
    // =========================
    const galleryData = {
        main: [
            { src: 'images/chiuso_penne.png', label: 'Vista Chiusa con Stilografiche' },
            { src: 'images/chiuso.png', label: 'Espositore Chiuso' },
            { src: 'images/aperto.png', label: 'Espositore Aperto' },
            { src: 'images/estruso.png', label: 'Vista Esplosa' },
        ],
        components: [
            { src: 'images/semilavorati_5.png', label: 'S_01 — Base in Alluminio 6082' },
            { src: 'images/semilavorati_7.png', label: 'S_02 — Supporto Rotante in Acciaio C45' },
            { src: 'images/semilavorati_1.png', label: 'S_03 — Coperchio in Ottone OT58' },
            { src: 'images/semilavorati_3.png', label: 'S_05 — Colonna in PLA' },
            { src: 'images/semilavorati_4.png', label: 'S_06 — Tappo in PLA' },
            { src: 'images/semilavorati_2.png', label: 'S_07 — Tirante in Alluminio' },
            { src: 'images/semilavorati_6.png', label: 'S_08 — Tappo in PLA' },
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
    let currentGalleryImages = [];
    let currentLightboxIndex = 0;

    function renderGallery(tab) {
        const items = galleryData[tab] || [];
        currentGalleryImages = items;
        galleryGrid.innerHTML = '';
        items.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.style.animationDelay = `${i * 80}ms`;
            div.innerHTML = `
                <img src="${item.src}" alt="${item.label}" loading="lazy">
                <div class="gallery-item-label">${item.label}</div>
            `;
            div.addEventListener('click', () => openLightbox(i));
            galleryGrid.appendChild(div);
        });
    }

    galleryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            galleryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderGallery(tab.dataset.tab);
        });
    });

    renderGallery('main');

    // =========================
    // Lightbox
    // =========================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    function openLightbox(index) {
        currentLightboxIndex = index;
        const item = currentGalleryImages[index];
        lightboxImg.src = item.src;
        lightboxImg.alt = item.label;
        lightboxCaption.textContent = item.label;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(dir) {
        currentLightboxIndex = (currentLightboxIndex + dir + currentGalleryImages.length) % currentGalleryImages.length;
        const item = currentGalleryImages[currentLightboxIndex];
        lightboxImg.src = item.src;
        lightboxImg.alt = item.label;
        lightboxCaption.textContent = item.label;
    }

    document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev')?.addEventListener('click', () => navigateLightbox(-1));
    document.getElementById('lightbox-next')?.addEventListener('click', () => navigateLightbox(1));
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // =========================
    // Accordion
    // =========================
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.accordion-item').forEach(ai => ai.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });

    // =========================
    // Video Controls
    // =========================
    const video = document.getElementById('product-video');
    const playBtn = document.getElementById('video-play-btn');

    playBtn?.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            video.muted = false;
        } else {
            video.pause();
        }
    });

    // =========================
    // Counter Animation
    // =========================
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.target);
                const isFloat = target % 1 !== 0;
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();
                }, 16);

                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // =========================
    // Particle Background
    // =========================
    const particleContainer = document.getElementById('hero-particles');
    if (particleContainer) {
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        particleContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedY = -Math.random() * 0.3 - 0.1;
                this.speedX = (Math.random() - 0.5) * 0.2;
                this.opacity = Math.random() * 0.3 + 0.05;
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                if (this.y < -10) this.reset();
                if (this.y < -10) this.y = canvas.height + 10;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 169, 110, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // =========================
    // Charts (Chart.js)
    // =========================
    const chartDefaults = {
        color: '#a1a1aa',
        borderColor: 'rgba(255,255,255,0.06)',
    };

    Chart.defaults.color = chartDefaults.color;
    Chart.defaults.borderColor = chartDefaults.borderColor;
    Chart.defaults.font.family = "'Inter', sans-serif";

    // --- BOM Doughnut Chart ---
    const bomCtx = document.getElementById('bom-chart');
    if (bomCtx) {
        const bomData = {
            labels: ['Semilavorati (S)', 'Commerciali (C)', 'Minuteria (M)'],
            datasets: [{
                data: [192.04, 171.00, 1.86],
                backgroundColor: [
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(74, 158, 255, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                ],
                borderColor: [
                    'rgba(245, 158, 11, 1)',
                    'rgba(74, 158, 255, 1)',
                    'rgba(34, 197, 94, 1)',
                ],
                borderWidth: 2,
                hoverOffset: 12,
            }]
        };

        new Chart(bomCtx, {
            type: 'doughnut',
            data: bomData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(22, 22, 24, 0.95)',
                        titleColor: '#f5f5f7',
                        bodyColor: '#a1a1aa',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        cornerRadius: 12,
                        padding: 14,
                        callbacks: {
                            label: (ctx) => `${ctx.label}: €${ctx.parsed.toFixed(2)}`
                        }
                    }
                }
            }
        });

        // Custom Legend
        const bomLegend = document.getElementById('bom-legend');
        const bomColors = ['#f59e0b', '#4a9eff', '#22c55e'];
        const bomLabels = ['Semilavorati (S): €192.04', 'Commerciali (C): €171.00', 'Minuteria (M): €1.86'];
        bomLabels.forEach((label, i) => {
            const item = document.createElement('div');
            item.className = 'chart-legend-item';
            item.innerHTML = `<span class="chart-legend-dot" style="background:${bomColors[i]}"></span>${label}`;
            bomLegend.appendChild(item);
        });
    }

    // --- Production Cost Doughnut Chart ---
    const prodCtx = document.getElementById('production-chart');
    if (prodCtx) {
        const prodData = {
            labels: ['Materie Prime (BOM)', 'Manodopera Diretta', 'Ammortamenti', 'Costi Fissi'],
            datasets: [{
                data: [364.90, 113.75, 190.50, 17.00],
                backgroundColor: [
                    'rgba(201, 169, 110, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(100, 116, 139, 0.8)',
                ],
                borderColor: [
                    'rgba(201, 169, 110, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(100, 116, 139, 1)',
                ],
                borderWidth: 2,
                hoverOffset: 12,
            }]
        };

        new Chart(prodCtx, {
            type: 'doughnut',
            data: prodData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(22, 22, 24, 0.95)',
                        titleColor: '#f5f5f7',
                        bodyColor: '#a1a1aa',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        cornerRadius: 12,
                        padding: 14,
                        callbacks: {
                            label: (ctx) => `${ctx.label}: €${ctx.parsed.toFixed(2)}`
                        }
                    }
                }
            }
        });

        const prodLegend = document.getElementById('production-legend');
        const prodColors = ['#c9a96e', '#a855f7', '#ef4444', '#64748b'];
        const prodLabels = ['Materie Prime: €364.90', 'Manodopera: €113.75', 'Ammortamenti: €190.50', 'Costi Fissi: €17.00'];
        prodLabels.forEach((label, i) => {
            const item = document.createElement('div');
            item.className = 'chart-legend-item';
            item.innerHTML = `<span class="chart-legend-dot" style="background:${prodColors[i]}"></span>${label}`;
            prodLegend.appendChild(item);
        });
    }

    // --- Break-Even Chart ---
    const bepCtx = document.getElementById('bep-chart');
    if (bepCtx) {
        const units = [];
        const revenues = [];
        const totalCosts = [];
        const fixedCosts = [];

        const cfTot = 1606250;
        const cvUnit = 364.90;
        const priceUnit = 1106.55;

        for (let q = 0; q <= 5000; q += 100) {
            units.push(q);
            revenues.push(priceUnit * q);
            totalCosts.push(cfTot + cvUnit * q);
            fixedCosts.push(cfTot);
        }

        new Chart(bepCtx, {
            type: 'line',
            data: {
                labels: units,
                datasets: [
                    {
                        label: 'Ricavi',
                        data: revenues,
                        borderColor: 'rgba(34, 197, 94, 1)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        fill: false,
                        tension: 0,
                        pointRadius: 0,
                        borderWidth: 2.5,
                    },
                    {
                        label: 'Costi Totali',
                        data: totalCosts,
                        borderColor: 'rgba(239, 68, 68, 1)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: false,
                        tension: 0,
                        pointRadius: 0,
                        borderWidth: 2.5,
                    },
                    {
                        label: 'Costi Fissi',
                        data: fixedCosts,
                        borderColor: 'rgba(100, 116, 139, 0.5)',
                        borderDash: [8, 4],
                        fill: false,
                        tension: 0,
                        pointRadius: 0,
                        borderWidth: 1.5,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            useBorderRadius: true,
                            padding: 20,
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(22, 22, 24, 0.95)',
                        titleColor: '#f5f5f7',
                        bodyColor: '#a1a1aa',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        cornerRadius: 12,
                        padding: 14,
                        callbacks: {
                            title: (items) => `${items[0].label} unità`,
                            label: (ctx) => `${ctx.dataset.label}: €${(ctx.parsed.y / 1000).toFixed(0)}k`
                        }
                    },
                    annotation: undefined
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Unità Prodotte',
                            color: '#63636e',
                            font: { size: 12 }
                        },
                        grid: { display: false },
                        ticks: {
                            callback: (val, i) => i % 5 === 0 ? units[i] : '',
                            maxRotation: 0,
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Euro (€)',
                            color: '#63636e',
                            font: { size: 12 }
                        },
                        ticks: {
                            callback: (val) => `€${(val / 1000000).toFixed(1)}M`
                        },
                        grid: {
                            color: 'rgba(255,255,255,0.04)',
                        }
                    }
                }
            }
        });
    }

    // --- Weight Comparison Bar Chart ---
    const weightCtx = document.getElementById('weight-chart');
    if (weightCtx) {
        const components = ['Base\n(Al 6082)', 'Supporto\n(C45)', 'Coperchio\n(OT58)', 'Tirante\n(Al 6082)', 'Colonna\n(PLA)', 'Tappo S06\n(PLA)', 'Tappo S08\n(PLA)', 'Piedino\n(TPU)'];
        const rawWeights = [12.83, 21.71, 9.69, 1.13, 0.061, 0.030, 0.030, 0.011];
        const finWeights = [4.97, 9.48, 4.00, 1.08, 0.061, 0.030, 0.030, 0.011];

        new Chart(weightCtx, {
            type: 'bar',
            data: {
                labels: components,
                datasets: [
                    {
                        label: 'Peso Grezzo (kg)',
                        data: rawWeights,
                        backgroundColor: 'rgba(201, 169, 110, 0.6)',
                        borderColor: 'rgba(201, 169, 110, 1)',
                        borderWidth: 1,
                        borderRadius: 6,
                    },
                    {
                        label: 'Peso Finito (kg)',
                        data: finWeights,
                        backgroundColor: 'rgba(74, 158, 255, 0.6)',
                        borderColor: 'rgba(74, 158, 255, 1)',
                        borderWidth: 1,
                        borderRadius: 6,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            useBorderRadius: true,
                            padding: 20,
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(22, 22, 24, 0.95)',
                        titleColor: '#f5f5f7',
                        bodyColor: '#a1a1aa',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        cornerRadius: 12,
                        padding: 14,
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(3)} kg`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { maxRotation: 0, font: { size: 11 } }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Peso (kg)',
                            color: '#63636e',
                            font: { size: 12 }
                        },
                        grid: {
                            color: 'rgba(255,255,255,0.04)',
                        },
                        ticks: {
                            callback: (val) => `${val} kg`
                        }
                    }
                }
            }
        });
    }

    // =========================
    // Smooth scroll for nav links
    // =========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
