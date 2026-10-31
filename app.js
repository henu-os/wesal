document.addEventListener("DOMContentLoaded", () => {
    // 0. Dynamic renaming of footer headings
    const footerCols = document.querySelectorAll(".footer-col");
    if (footerCols.length >= 4) {
        const ecoHeader = Array.from(footerCols).find(col => col.querySelector("h4") && col.querySelector("h4").textContent.trim().toLowerCase() === "ecosystem");
        if (ecoHeader) {
            const h4 = ecoHeader.querySelector("h4");
            if (h4) h4.textContent = "Development";
        }

        const compHeader = Array.from(footerCols).find(col => col.querySelector("h4") && col.querySelector("h4").textContent.trim().toLowerCase() === "company");
        if (compHeader) {
            const h4 = compHeader.querySelector("h4");
            if (h4) h4.textContent = "Growth & Legal";
        }
    }

    // 1. Loading Screen fade out (with minimum delay for dragon animation)
    const loader = document.getElementById("loader");
    if (loader) {
        // Create canvas container for loader dragon
        const canvasContainer = document.createElement("div");
        canvasContainer.className = "three-loader-canvas";
        loader.appendChild(canvasContainer);

        loadThreeJS(() => {
            initLoaderDragon(canvasContainer);
        });

        const pageStartTime = Date.now();
        window.addEventListener("load", () => {
            const timeElapsed = Date.now() - pageStartTime;
            const remainingTime = Math.max(3200 - timeElapsed, 500); // Minimum 3.2s load screen to show dragon

            setTimeout(() => {
                loader.style.opacity = "0";
                loader.style.visibility = "hidden";
                // Cleanup ThreeJS resources after fadeout
                setTimeout(() => {
                    if (canvasContainer && typeof canvasContainer.cleanup === "function") {
                        canvasContainer.cleanup();
                        canvasContainer.remove();
                    }
                }, 1000);
            }, remainingTime);
        });
    }

    // 2. Parallax background tracking (HEKO at 12% opacity in background)
    const parallaxBg = document.getElementById("parallax-bg-container");
    if (parallaxBg) {
        window.addEventListener("mousemove", (e) => {
            const factor = 30;
            const x = (window.innerWidth / 2 - e.clientX) / factor;
            const y = (window.innerHeight / 2 - e.clientY) / factor;
            parallaxBg.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        });
    }



    // 4. 3D Card Tilt Effect
    const tiltCards = document.querySelectorAll("[data-tilt]");
    tiltCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const normX = x / rect.width - 0.5;
            const normY = y / rect.height - 0.5;

            const maxTilt = 8;
            const tiltX = -normY * maxTilt;
            const tiltY = normX * maxTilt;

            card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
            card.style.setProperty("--x", `${x}px`);
            card.style.setProperty("--y", `${y}px`);
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        });
    });

    // 5. Active Nav Highlights
    const currentPath = window.location.pathname.split("/").pop();
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
        const itemHref = item.getAttribute("href");
        if (itemHref === currentPath) {
            navItems.forEach(n => n.classList.remove("active"));
            item.classList.add("active");
        }
    });

    // 6. Occasional Fading Speech Bubble for Sardu
    const heroBubble = document.getElementById("hero-bubble");
    const heroBubbleText = document.getElementById("hero-bubble-text");
    const mascotCard = document.getElementById("mascot-hero-card");

    const guideTips = [
        "Welcome! I'll show you around.",
        "Most businesses save 20+ hours/week with automation.",
        "This is our AI ecosystem.",
        "Ready to build your next project?"
    ];
    let tipIdx = 0;

    // Initially fade out speech bubble after 5 seconds
    if (heroBubble) {
        setTimeout(() => {
            heroBubble.style.opacity = "0";
            heroBubble.style.pointerEvents = "none";
        }, 5000);
    }

    // Clicking Sardu card triggers new tips and shows bubble
    if (mascotCard && heroBubble && heroBubbleText) {
        mascotCard.addEventListener("click", () => {
            tipIdx = (tipIdx + 1) % guideTips.length;
            heroBubbleText.textContent = guideTips[tipIdx];
            heroBubble.style.opacity = "1";
            heroBubble.style.pointerEvents = "auto";

            // Auto fade out again after 4 seconds
            setTimeout(() => {
                heroBubble.style.opacity = "0";
                heroBubble.style.pointerEvents = "none";
            }, 4000);
        });
    }

    // 7. Contact Form Handling & Success Modal popup
    const contactForm = document.getElementById("contactForm");
    const successModal = document.getElementById("successModal");
    const closeModalBtn = document.getElementById("closeModal");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector(".submit-btn");
            const btnSpan = submitBtn ? submitBtn.querySelector("span") : null;
            const originalText = btnSpan ? btnSpan.textContent : "Submit Inquiry";
            
            if (submitBtn) {
                submitBtn.disabled = true;
                if (btnSpan) btnSpan.textContent = "Sending...";
            }

            const name = document.getElementById("name") ? document.getElementById("name").value : "";
            const email = document.getElementById("email") ? document.getElementById("email").value : "";
            const phone = document.getElementById("phone") ? document.getElementById("phone").value : "";
            const service = document.getElementById("service") ? document.getElementById("service").value : "";
            const message = document.getElementById("message") ? document.getElementById("message").value : "";

            const scriptURL = "https://script.google.com/macros/s/AKfycbyAz8CLg1wBwISV1IPtRRf2Owhw3UePVrNapYYFLmUSW0hz6ZRr7TFqLbG6ymrpWL1a/exec";
            
            const formData = new URLSearchParams();
            formData.append("formType", "contact");
            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("service", service);
            formData.append("message", message);
            formData.append("timestamp", new Date().toLocaleString());

            fetch(scriptURL, {
                method: "POST",
                body: formData,
                mode: "no-cors"
            })
            .then(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (btnSpan) btnSpan.textContent = originalText;
                }
                if (successModal) {
                    successModal.classList.add("active");
                }
                // Trigger 3D dragon flight animation
                if (typeof window.triggerInquiryDragon === "function") {
                    window.triggerInquiryDragon();
                }
            })
            .catch((error) => {
                console.error("Error submitting contact form:", error);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (btnSpan) btnSpan.textContent = originalText;
                }
                // Fallback: still show modal
                if (successModal) {
                    successModal.classList.add("active");
                }
                // Trigger 3D dragon flight animation as fallback
                if (typeof window.triggerInquiryDragon === "function") {
                    window.triggerInquiryDragon();
                }
            });
        });
    }

    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener("click", () => {
            successModal.classList.remove("active");
            if (contactForm) {
                contactForm.reset();
            }
        });
    }

    if (successModal) {
        successModal.addEventListener("click", (e) => {
            if (e.target === successModal) {
                successModal.classList.remove("active");
                if (contactForm) {
                    contactForm.reset();
                }
            }
        });
    }

    // Navbar scroll indicator class update
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 40) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    // ── SERVICES DATA & DYNAMIC DRAWER CONTROLLER ──
    const SERVICES_DATA = [
        {
            name: "AI Automation & Intelligent Business Systems",
            tag: "01 / Capabilities",
            solutions: [
                {
                    index: "SOLUTION 01",
                    icon: "🤖",
                    title: "AI Finance Automation",
                    what: "Auto expense tracking, GST reports, invoice gen",
                    clients: "CA firms, SMEs, freelancers",
                    tech: ["Claude API", "Make.com", "Glide", "Twilio"],
                    time: "5–10 days",
                    demand: "Very High"
                },
                {
                    index: "SOLUTION 02",
                    icon: "⚙️",
                    title: "AI Business Operations",
                    what: "HR automation, approval flows, vendor AI",
                    clients: "Retail chains, manufacturing, logistics",
                    tech: ["n8n", "Claude API", "Notion", "Airtable"],
                    time: "10–15 days",
                    demand: "High"
                },
                {
                    index: "SOLUTION 03",
                    icon: "🎯",
                    title: "AI Sales Automation",
                    what: "Lead scoring, auto follow-ups, proposal AI",
                    clients: "Real estate, EdTech, insurance, B2B sales",
                    tech: ["HubSpot/Zoho", "Claude API", "Apollo", "Make"],
                    time: "7–12 days",
                    demand: "Very High"
                },
                {
                    index: "SOLUTION 04",
                    icon: "💬",
                    title: "AI Customer Support",
                    what: "WhatsApp bot, ticket system, FAQ AI",
                    clients: "E-commerce, SaaS, D2C brands",
                    tech: ["Botpress", "Claude API", "Twilio", "WATI"],
                    time: "4–8 days",
                    demand: "Easiest to close"
                },
                {
                    index: "SOLUTION 05",
                    icon: "📄",
                    title: "AI Document Analyzer",
                    what: "Policy reading, contract review, compliance AI",
                    clients: "Law firms, insurance, fintech, HR teams",
                    tech: ["Claude API (PDF)", "Next.js", "Typebot", "Vercel"],
                    time: "8–14 days",
                    demand: "Premium"
                },
                {
                    index: "SOLUTION 06",
                    icon: "🎙️",
                    title: "AI Meeting Assistant",
                    what: "Transcription, action items, follow-up emails",
                    clients: "Startups, consultants, remote teams",
                    tech: ["Fireflies.ai", "Claude API", "Notion", "Make"],
                    time: "3–6 days",
                    demand: "Fastest build"
                },
                {
                    index: "SOLUTION 07",
                    icon: "🏠",
                    title: "AI Interior Design",
                    what: "Room redesign AI, 5 styles, before/after",
                    clients: "Real estate agents, interior designers, builders",
                    tech: ["Replicate.com", "Stable Diffusion", "Tally", "Razorpay", "Canva"],
                    customLabel: "Viral demo potential",
                    customVal: "Extremely High",
                    demand: "High"
                }
            ]
        },
        {
            name: "Custom Software Development",
            tag: "02 / Capabilities",
            solutions: [
                {
                    index: "SOLUTION 01",
                    icon: "📦",
                    title: "Cloud-Based ERP System",
                    what: "Resource planning, multi-warehouse inventory, purchase workflows",
                    clients: "Wholesale distributors, manufacturers, mid-size enterprises",
                    tech: ["Node.js", "PostgreSQL", "AWS", "React"],
                    time: "20–30 days",
                    demand: "High"
                },
                {
                    index: "SOLUTION 02",
                    icon: "🏥",
                    title: "Healthcare EHR/EMR System",
                    what: "Patient files, schedule management, HIPAA-compliant messaging",
                    clients: "Private clinics, diagnostic centers, healthcare startups",
                    tech: ["Python", "PostgreSQL", "AWS", "React Native"],
                    time: "25–40 days",
                    demand: "Very High"
                },
                {
                    index: "SOLUTION 03",
                    icon: "🚚",
                    title: "Custom Logistics & Fleet Tracker",
                    what: "Real-time routing, driver dispatch panels, fuel metrics",
                    clients: "Logistics companies, delivery networks, trucking fleets",
                    tech: ["Go", "React", "Google Maps API", "Docker"],
                    time: "15–25 days",
                    demand: "High"
                },
                {
                    index: "SOLUTION 04",
                    icon: "👥",
                    title: "Corporate HR & Payroll System",
                    what: "Employee onboarding, salary disbursement, automatic taxes",
                    clients: "Corporates, call centers, scaling firms",
                    tech: ["Next.js", "PostgreSQL", "Node.js", "AWS"],
                    time: "15–20 days",
                    demand: "Medium"
                },
                {
                    index: "SOLUTION 05",
                    icon: "📊",
                    title: "Inventory & Order Management",
                    what: "Real-time stock alerts, barcode scanning, omnichannel sync",
                    clients: "Omnichannel retailers, warehouse hubs, e-commerce brands",
                    tech: ["NestJS", "PostgreSQL", "React", "AWS"],
                    time: "12–20 days",
                    demand: "Very High"
                }
            ]
        },
        {
            name: "Premium Website & Web Applications",
            tag: "03 / Capabilities",
            solutions: [
                {
                    index: "SOLUTION 01",
                    icon: "⚡",
                    title: "High-Conversion SaaS Landing Page",
                    what: "Optimized sales page, interactive layouts, loading speed optimization",
                    clients: "SaaS startups, tech products, agency firms",
                    tech: ["HTML5", "CSS3", "Vanilla JS", "GSAP"],
                    time: "4–7 days",
                    demand: "Very High"
                },
                {
                    index: "SOLUTION 02",
                    icon: "🛍️",
                    title: "Headless E-Commerce Platform",
                    what: "Ultra-fast product listings, secure Stripe cart, inventory sync",
                    clients: "D2C brands, boutique shops, digital goods sellers",
                    tech: ["Next.js", "Shopify SDK", "Stripe", "Vercel"],
                    time: "10–18 days",
                    demand: "High"
                },
                {
                    index: "SOLUTION 03",
                    icon: "🔑",
                    title: "Real Estate Listings Portal",
                    what: "Interactive listings filter, map lookup, client-agent chat",
                    clients: "Real estate brokers, agency networks",
                    tech: ["React", "Node.js", "Mapbox", "PostgreSQL"],
                    time: "12–20 days",
                    demand: "High"
                },
                {
                    index: "SOLUTION 04",
                    icon: "📅",
                    title: "Online Booking & Appointment System",
                    what: "Service calendar slots, auto-reminders, checkout payment gateways",
                    clients: "Salons, dental clinics, tutoring networks",
                    tech: ["React", "Node.js", "Twilio", "Stripe"],
                    time: "6–10 days",
                    demand: "Very High"
                },
                {
                    index: "SOLUTION 05",
                    icon: "📰",
                    title: "Multi-Author Editorial Portal",
                    what: "Rich editor dashboard, SEO metrics, ad network layout",
                    clients: "Digital magazines, news sites, content bloggers",
                    tech: ["Next.js", "Sanity.io", "Vercel"],
                    time: "7–12 days",
                    demand: "Medium"
                }
            ]
        },
        {
            name: "Mobile Apps for Modern Businesses",
            tag: "04 / Capabilities",
            solutions: [
                {
                    index: "SOLUTION 01",
                    icon: "🍔",
                    title: "On-Demand Delivery Application",
                    what: "Customer checkout app, driver GPS map app, kitchen status admin",
                    clients: "Restaurants, local grocers, logistics networks",
                    tech: ["Flutter", "Firebase", "Google Maps API"],
                    time: "15–25 days",
                    demand: "Very High"
                },
                {
                    index: "SOLUTION 02",
                    icon: "💪",
                    title: "Fitness & Workout Tracker",
                    what: "Exercise video streaming player, metrics tracking, calendar plans",
                    clients: "Gym complexes, personal training instructors, sports brands",
                    tech: ["React Native", "Node.js", "AWS S3", "MongoDB"],
                    time: "12–20 days",
                    demand: "High"
                },
                {
                    index: "SOLUTION 03",
                    icon: "🧹",
                    title: "Service Booking Mobile App",
                    what: "Dynamic home cleaning/repair bookings, driver map track, push notifications",
                    clients: "Plumbing services, cleaning agencies, local directory startups",
                    tech: ["Flutter", "Node.js", "Firebase"],
                    time: "14–22 days",
                    demand: "High"
                },
                {
                    index: "SOLUTION 04",
                    icon: "🎓",
                    title: "EdTech & E-Learning App",
                    what: "Video class player, dynamic quizzes, scorecards, course certificates",
                    clients: "Tutors, colleges, training centers",
                    tech: ["React Native", "PostgreSQL", "AWS", "Twilio"],
                    time: "15–25 days",
                    demand: "Very High"
                },
                {
                    index: "SOLUTION 05",
                    icon: "💬",
                    title: "Community & Networking App",
                    what: "User feed board, group threads, direct private chats",
                    clients: "Alumni associations, niche hobby clubs, startup cohorts",
                    tech: ["Flutter", "Firebase", "Twilio"],
                    time: "10–18 days",
                    demand: "Medium"
                }
            ]
        },
        {
            name: "Digital Growth & Performance Marketing",
            tag: "05 / Capabilities",
            solutions: [
                {
                    index: "SOLUTION 01",
                    icon: "📢",
                    title: "Paid Ads Funnel Optimization",
                    what: "Conversion-optimized landing pages, Meta Pixel setup, retargeting ad copy",
                    clients: "D2C brands, local service businesses, online agencies",
                    tech: ["Meta Ads", "Google Analytics", "GTM", "Hotjar"],
                    time: "3–5 days",
                    demand: "Very High"
                },
                {
                    index: "SOLUTION 02",
                    icon: "📍",
                    title: "Local SEO Acceleration Package",
                    what: "Google Business Profile optimization, local listings directory, review automation",
                    clients: "Local dentists, lawyers, clinics, retail shops",
                    tech: ["Google Business", "SEO Tools", "Schema Markup"],
                    time: "5–10 days",
                    demand: "Very High"
                },
                {
                    index: "SOLUTION 03",
                    icon: "✉️",
                    title: "Email Marketing & Lead Nurture Systems",
                    what: "Abandoned cart automation flows, weekly newsletters, B2B cold email templates",
                    clients: "E-commerce stores, SaaS companies, online service coaches",
                    tech: ["Klaviyo", "Mailchimp", "ActiveCampaign"],
                    time: "4–7 days",
                    demand: "High"
                },
                {
                    index: "SOLUTION 04",
                    icon: "📈",
                    title: "Social Media Growth System",
                    what: "Short-form video scripts, posting schedules, auto-response flows",
                    clients: "Creators, startup founders, B2B executives",
                    tech: ["ManyChat", "Buffer", "Notion", "Canva"],
                    time: "5–8 days",
                    demand: "High"
                },
                {
                    index: "SOLUTION 05",
                    icon: "🔄",
                    title: "Conversion Rate Optimization (CRO)",
                    what: "A/B visual testing, checkout page friction reduction, speed audits",
                    clients: "SaaS providers, Shopify stores",
                    tech: ["Optimizely", "VWO", "WebPageTest"],
                    time: "4–8 days",
                    demand: "Medium"
                }
            ]
        },
        {
            name: "Startup & Digital Transformation",
            tag: "06 / Capabilities",
            solutions: [
                {
                    index: "SOLUTION 01",
                    icon: "🚀",
                    title: "MVP Prototype Development",
                    what: "Working database logic web app, interactive interface mockups, Stripe payment",
                    clients: "Startup founders, corporate concept testing, venture raising",
                    tech: ["Bubble", "Glide", "Figma", "Webflow"],
                    time: "5–10 days",
                    demand: "Very High"
                },
                {
                    index: "SOLUTION 02",
                    icon: "🎨",
                    title: "Brand Identity & Digital Asset Kit",
                    what: "Custom logo files, typography choices, vector brand books, social page graphics",
                    clients: "Early-stage startups, rebranding local shops",
                    tech: ["Figma", "Illustrator", "Photoshop"],
                    time: "4–7 days",
                    demand: "High"
                },
                {
                    index: "SOLUTION 03",
                    icon: "⚖️",
                    title: "Legal Compliance & Registration Kit",
                    what: "Company structure registration, tax ID setup, standard NDA & contract templates",
                    clients: "Traditional partnerships, early-stage creators",
                    tech: ["Government Portals", "Legal Kits", "DocuSign"],
                    time: "7–12 days",
                    demand: "Medium"
                },
                {
                    index: "SOLUTION 04",
                    icon: "💰",
                    title: "Funding Proposal & Pitch Deck Kit",
                    what: "Investor slide decks, financial model templates, target investor research",
                    clients: "Seed-stage founders looking to pitch angels and VCs",
                    tech: ["Figma", "Google Sheets", "PowerPoint"],
                    time: "5–10 days",
                    demand: "High"
                },
                {
                    index: "SOLUTION 05",
                    icon: "💻",
                    title: "Business Process Digitalization",
                    what: "Paper workflows migration to cloud tools, custom dashboards, team logins",
                    clients: "Offline stores, local distribution networks, traditional agents",
                    tech: ["Notion", "Airtable", "Google Workspace"],
                    time: "6–12 days",
                    demand: "High"
                }
            ]
        }
    ];

    const serviceCards = document.querySelectorAll(".service-card[data-service-index]");
    const servicesGrid = document.querySelector(".services-grid");

    if (serviceCards.length && servicesGrid) {
        // Create global drawer overlay once in DOM
        const servicesOverlay = document.createElement("div");
        servicesOverlay.className = "services-drawer-overlay";
        servicesOverlay.id = "services-drawer-overlay";
        servicesOverlay.innerHTML = `
            <div class="services-drawer-backdrop" id="services-drawer-backdrop"></div>
            <div class="services-side-drawer" id="services-side-drawer">
                <button class="drawer-close-btn" aria-label="Close drawer">&times;</button>
                <div class="drawer-content-wrapper" id="drawer-content-wrapper"></div>
            </div>
        `;
        document.body.appendChild(servicesOverlay);

        const drawer = servicesOverlay.querySelector("#services-side-drawer");
        const backdrop = servicesOverlay.querySelector("#services-drawer-backdrop");
        const contentWrapper = servicesOverlay.querySelector("#drawer-content-wrapper");
        const closeBtn = servicesOverlay.querySelector(".drawer-close-btn");

        let activeCard = null;

        function openOrbitalModal(card, idx) {
            const data = SERVICES_DATA[idx];
            if (!data) return;

            activeCard = card;

            // 1. Set up slide direction class
            if (idx < 3) {
                drawer.className = "services-side-drawer drawer-right";
            } else {
                drawer.className = "services-side-drawer drawer-left";
            }

            // 2. Populate service title, logo, and vertical roadmap cards
            const iconHtml = card.querySelector(".service-icon-wrapper").innerHTML;
            const titleText = card.querySelector(".service-name").textContent;

            let solutionsHtml = "";
            data.solutions.forEach((sol) => {
                let techChips = sol.tech.map(t => `<span class="tech-chip">${t}</span>`).join("");
                solutionsHtml += `
                    <div class="drawer-sol-card">
                        <div class="drawer-sol-header">
                            <span class="drawer-sol-index">${sol.index}</span>
                            <span class="drawer-sol-demand">${sol.demand}</span>
                        </div>
                        <h4 class="drawer-sol-title">${sol.title}</h4>
                        <div class="drawer-sol-body">
                            <div class="detail-line-stacked">
                                <span class="detail-label">What it does</span>
                                <span class="detail-val">${sol.what}</span>
                            </div>
                            <div class="detail-line-stacked">
                                <span class="detail-label">Target clients</span>
                                <span class="detail-val">${sol.clients}</span>
                            </div>
                            <div class="detail-line-stacked">
                                <span class="detail-label">Tech Stack</span>
                                <div class="tech-chips-row">${techChips}</div>
                            </div>
                        </div>
                        <div class="drawer-sol-time-row">
                            <span>Timeframe</span>
                            <strong>${sol.time}</strong>
                        </div>
                    </div>
                `;
            });

            contentWrapper.innerHTML = `
                <div class="drawer-brand-header">
                    <span class="drawer-brand-icon">${iconHtml}</span>
                    <h3 class="drawer-brand-title">${titleText}</h3>
                </div>
                <div class="drawer-solutions-list">
                    ${solutionsHtml}
                </div>
            `;

            // Make original card transparent to simulate transition
            card.style.opacity = "0";

            // Open overlay and drawer
            servicesOverlay.classList.add("active");
            drawer.classList.add("active");
            document.body.style.overflow = "hidden"; // block background scroll
        }

        function closeOrbitalModal() {
            if (!activeCard) return;

            servicesOverlay.classList.remove("active");
            drawer.classList.remove("active");
            document.body.style.overflow = ""; // restore scrolling

            // Restore original grid card opacity
            const cardToRestore = activeCard;
            setTimeout(() => {
                if (cardToRestore) {
                    cardToRestore.style.opacity = "1";
                    cardToRestore.classList.remove("expanded");
                    servicesGrid.classList.remove("has-active-card");
                }
            }, 300);

            activeCard = null;
        }

        // Close listeners
        if (closeBtn) {
            closeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                closeOrbitalModal();
            });
        }

        if (backdrop) {
            backdrop.addEventListener("click", (e) => {
                e.stopPropagation();
                closeOrbitalModal();
            });
        }

        // Close modal on ESC key
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                closeOrbitalModal();
            }
        });

        // Click service cards
        serviceCards.forEach((card) => {
            card.addEventListener("click", (e) => {
                if (e.target.closest("a") || e.target.closest("button")) {
                    return;
                }

                const idx = parseInt(card.getAttribute("data-service-index"), 10);

                serviceCards.forEach(c => c.classList.remove("expanded"));
                card.classList.add("expanded");
                servicesGrid.classList.add("has-active-card");

                openOrbitalModal(card, idx);
            });
        });
    }

    // 6. Mobile Footer Accordion Toggles
    const footerInner = document.querySelector(".footer-inner");
    if (footerInner) {
        footerInner.addEventListener("click", (e) => {
            if (window.innerWidth > 768) return;
            
            const header = e.target.closest(".footer-col h4");
            if (!header) return;

            const col = header.parentElement;
            if (col) {
                col.classList.toggle("active");
            }
        });
    }
});

// ── THREE.JS DRAGON ANIMATIONS ──

// Global dynamic CDN loader for Three.js & GLTFLoader
function loadThreeJS(callback) {
    if (window.THREE && window.THREE.GLTFLoader) {
        callback();
        return;
    }
    if (!window.THREE) {
        const threeScript = document.createElement("script");
        threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
        document.head.appendChild(threeScript);
        threeScript.onload = () => {
            loadGLTFLoader(callback);
        };
    } else {
        loadGLTFLoader(callback);
    }
}

function loadGLTFLoader(callback) {
    if (THREE.GLTFLoader) {
        callback();
        return;
    }
    const loaderScript = document.createElement("script");
    loaderScript.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js";
    document.head.appendChild(loaderScript);
    loaderScript.onload = callback;
}

// 1. Loading Screen Dragon
function initLoaderDragon(container) {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x8a2be2, 5, 20);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    const loader = new THREE.GLTFLoader();
    let dragonModel;
    let mixer;
    const clock = new THREE.Clock();

    loader.load(
        "wyvern-dragon.glb",
        (gltf) => {
            dragonModel = gltf.scene;
            scene.add(dragonModel);

            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(dragonModel);
                let clip = gltf.animations.find(
                    (c) => c.name.toLowerCase().includes("fly") || c.name.toLowerCase().includes("wing")
                );
                if (!clip) clip = gltf.animations[0];
                mixer.clipAction(clip).play();
            }

            dragonModel.position.set(0, 0, 3);
            dragonModel.rotation.set(0.2, Math.PI, 0); // Face camera
            dragonModel.scale.set(2, 2, 2);

            let startTime = Date.now();

            function animate() {
                if (!container.parentNode) return;
                requestAnimationFrame(animate);

                const delta = clock.getDelta();
                if (mixer) mixer.update(delta);

                const elapsed = (Date.now() - startTime) / 1000;

                if (elapsed < 1.5) {
                    const t = elapsed / 1.5;
                    const easeT = t * t * (3 - 2 * t);
                    dragonModel.position.z = THREE.MathUtils.lerp(3, -1, easeT);
                    dragonModel.scale.setScalar(THREE.MathUtils.lerp(2, 1.2, easeT));
                    dragonModel.rotation.y = Math.PI + Math.sin(elapsed * 2) * 0.2;
                } else {
                    const circleTime = elapsed - 1.5;
                    dragonModel.scale.setScalar(1.2);
                    
                    const radius = 2.0;
                    const speed = 1.2;
                    dragonModel.position.x = Math.sin(circleTime * speed) * radius;
                    dragonModel.position.y = Math.cos(circleTime * speed) * 0.8;
                    dragonModel.position.z = -1 + Math.sin(circleTime * speed * 2) * 0.5;

                    dragonModel.rotation.y = Math.atan2(Math.cos(circleTime * speed) * radius, -Math.sin(circleTime * speed) * radius) + Math.PI / 2;
                    dragonModel.rotation.x = Math.sin(circleTime * speed * 2) * 0.2;
                }

                renderer.render(scene, camera);
            }
            animate();
        },
        undefined,
        (error) => {
            console.error("Error loading dragon model for loader:", error);
        }
    );

    function onResize() {
        if (!container || !container.parentNode) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    container.cleanup = () => {
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        scene.clear();
    };
}

// 2. Inquiry Success Dragon
window.triggerInquiryDragon = function() {
    const container = document.createElement("div");
    container.className = "three-flight-canvas";
    document.body.appendChild(container);

    loadThreeJS(() => {
        initFlightDragon(container);
    });
};

function initFlightDragon(container) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(-5, 10, 5);
    scene.add(dirLight);

    const purpleLight = new THREE.PointLight(0x8a2be2, 3, 10);
    scene.add(purpleLight);

    const loader = new THREE.GLTFLoader();
    let dragonModel;
    let mixer;
    const clock = new THREE.Clock();

    const aspect = width / height;
    const visibleHeight = 2 * 10 * Math.tan((45 * Math.PI) / 360);
    const visibleWidth = visibleHeight * aspect;

    const startX = -visibleWidth / 2 - 12.5;
    const startY = -visibleHeight / 2 - 12.5;
    const endX = visibleWidth / 2 + 12.5;
    const endY = visibleHeight / 2 + 12.5;

    loader.load(
        "wyvern-dragon.glb",
        (gltf) => {
            dragonModel = gltf.scene;
            scene.add(dragonModel);

            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(dragonModel);
                let clip = gltf.animations.find(
                    (c) => c.name.toLowerCase().includes("fly") || c.name.toLowerCase().includes("wing")
                );
                if (!clip) clip = gltf.animations[0];
                mixer.clipAction(clip).play();
            }

            dragonModel.scale.setScalar(4.5); // Extremely massive size!
            dragonModel.position.set(startX, startY, 0);

            const angle = Math.atan2(endY - startY, endX - startX);
            dragonModel.rotation.y = angle + Math.PI / 2;
            dragonModel.rotation.x = 0.2;

            const duration = 3.5;
            const startTime = Date.now();

            function animate() {
                if (!container.parentNode) return;
                
                const elapsed = (Date.now() - startTime) / 1000;
                if (elapsed >= duration) {
                    renderer.dispose();
                    scene.clear();
                    container.remove();
                    return;
                }

                requestAnimationFrame(animate);

                const delta = clock.getDelta();
                if (mixer) mixer.update(delta);

                const t = elapsed / duration;
                
                dragonModel.position.x = THREE.MathUtils.lerp(startX, endX, t);
                dragonModel.position.y = THREE.MathUtils.lerp(startY, endY, t) + Math.sin(t * Math.PI) * 1.5;
                dragonModel.position.z = Math.sin(t * Math.PI * 2) * 1.0;

                purpleLight.position.copy(dragonModel.position);

                renderer.render(scene, camera);
            }
            animate();
        },
        undefined,
        (error) => {
            console.error("Error loading dragon model for flight:", error);
            container.remove();
        }
    );
}
