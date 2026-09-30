/* Ndimbal — maquette statique : donnees de demonstration et interactions */

/* Comptes clients de demonstration (fictifs).
   ATTENTION : dans cette maquette statique, les mots de passe et toutes les donnees
   sont dans le navigateur. Ce n'est PAS une securite reelle : en production,
   l'authentification et l'isolement des donnees se font cote serveur
   (Supabase Auth + Row Level Security, voir supabase/schema.sql). */
const CLIENTS = [
  { id: "c01", nom: "Mame Diarra Sarr", telephone: "771234567", motDePasse: "ndimbal2026" },
  { id: "c02", nom: "Awa Ndiaye",       telephone: "772345678", motDePasse: "ndimbal2026" },
  { id: "c03", nom: "Fatou Diop",       telephone: "763456789", motDePasse: "ndimbal2026" },
];

const CONTRATS = [
  { clientId: "c01", police: "POL009", assure: "Mame Diarra Sarr", zone: "Grand Yoff, Dakar",   produit: "NSIA Études",   produitSlug: "etudes",   prime: 35000, solde: 35000, statut: "retard" },
  { clientId: "c01", police: "POL010", assure: "Mame Diarra Sarr", zone: "Grand Yoff, Dakar",   produit: "NSIA Épargne",  produitSlug: "epargne",  prime: 15000, solde: 0,     statut: "ajour" },
  { clientId: "c02", police: "POL001", assure: "Awa Ndiaye",    zone: "Parcelles Assainies, Dakar", produit: "NSIA Retraite", produitSlug: "retraite", prime: 25000, solde: 50000, statut: "retard" },
  { clientId: "c03", police: "POL002", assure: "Fatou Diop",     zone: "Sacré-Cœur 3, Dakar",        produit: "NSIA Études",   produitSlug: "etudes",   prime: 30000, solde: 0,     statut: "ajour" },
  { clientId: "c04", police: "POL003", assure: "Mariama Fall",   zone: "Keur Massar",                produit: "NSIA Épargne",  produitSlug: "epargne",  prime: 20000, solde: 0,     statut: "ajour" },
  { clientId: "c05", police: "POL004", assure: "Khady Sow",      zone: "Médina, Dakar",              produit: "NSIA Études",   produitSlug: "etudes",   prime: 40000, solde: 80000, statut: "retard" },
  { clientId: "c06", police: "POL007", assure: "Adama Diallo",   zone: "Randoulène, Thiès",          produit: "NSIA Retraite", produitSlug: "retraite", prime: 50000, solde: 0,     statut: "ajour" },
  { clientId: "c07", police: "POL008", assure: "Rokhaya Fall",   zone: "Darou Khoudoss, Touba",      produit: "NSIA Épargne",  produitSlug: "epargne",  prime: 20000, solde: 60000, statut: "retard" },
];

/* ---------- session client (connexion simulee) ---------- */

const SESSION_KEY = "ndimbal_session";
const SESSION_DUREE_MAX = 15 * 60 * 1000; // deconnexion apres 15 min d'inactivite

function lireSession() {
  try {
    const s = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    if (!s || !s.clientId) return null;
    if (Date.now() - s.derniereActivite > SESSION_DUREE_MAX) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return s;
  } catch (e) {
    return null;
  }
}

function ecrireSession(clientId) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ clientId, derniereActivite: Date.now() }));
  } catch (e) { /* stockage indisponible : la session ne survivra pas au changement de page */ }
}

function fermerSession(motif) {
  try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
  const url = "connexion.html" + (motif ? "?motif=" + motif : "");
  window.location.href = url;
}

function clientConnecte() {
  const s = lireSession();
  return s ? CLIENTS.find((c) => c.id === s.clientId) || null : null;
}

/* Contrats visibles : UNIQUEMENT ceux du client connecte */
function contratsDuClient() {
  const client = clientConnecte();
  return client ? CONTRATS.filter((c) => c.clientId === client.id) : [];
}

function initSession() {
  const protege = document.body.hasAttribute("data-protege");
  const client = clientConnecte();

  if (protege && !client) {
    const page = window.location.pathname.split("/").pop() || "index.html";
    window.location.replace("connexion.html?suite=" + encodeURIComponent(page));
    return false;
  }

  if (!client) return true;

  // bouton « Se deconnecter » dans l'en-tete et le menu mobile
  const actions = document.querySelector(".header-actions");
  if (actions && !actions.querySelector("[data-logout]")) {
    const btn = document.createElement("button");
    btn.className = "btn btn-ghost btn-sm btn-logout";
    btn.setAttribute("data-logout", "");
    btn.textContent = "Se déconnecter";
    actions.insertBefore(btn, actions.querySelector(".burger"));
  }
  const panel = document.querySelector(".mobile-menu__panel");
  if (panel && !panel.querySelector("[data-logout]")) {
    const btn = document.createElement("button");
    btn.className = "btn btn-ghost";
    btn.setAttribute("data-logout", "");
    btn.textContent = "Se déconnecter";
    panel.appendChild(btn);
  }
  document.querySelectorAll("[data-logout]").forEach((b) => b.addEventListener("click", () => fermerSession("deconnexion")));

  // suivi de l'activite + deconnexion automatique
  let dernierEnregistrement = 0;
  const activite = () => {
    const now = Date.now();
    if (now - dernierEnregistrement > 5000) {
      dernierEnregistrement = now;
      ecrireSession(client.id);
    }
  };
  ["click", "keydown", "scroll", "touchstart", "mousemove"].forEach((ev) =>
    window.addEventListener(ev, activite, { passive: true })
  );
  activite();
  setInterval(() => {
    if (!lireSession()) fermerSession("expiree");
  }, 30000);

  return true;
}

function initConnexion() {
  const form = document.querySelector("#connexion-form");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const suite = params.get("suite");
  const destination = suite && /^[a-z-]+\.html$/.test(suite) ? suite : "cotisations.html";
  const info = document.querySelector("#connexion-info");
  const erreur = document.querySelector("#connexion-erreur");

  if (clientConnecte()) {
    window.location.replace(destination);
    return;
  }

  const motif = params.get("motif");
  if (info && motif === "expiree") info.textContent = "Votre session a expiré après 15 minutes d'inactivité. Reconnectez-vous.";
  else if (info && motif === "deconnexion") info.textContent = "Vous êtes bien déconnecté(e).";
  else if (info && suite) info.textContent = "Connectez-vous pour voir vos contrats et vos cotisations.";
  if (info && info.textContent) info.hidden = false;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const tel = form.querySelector("#connexion-tel").value.replace(/\D/g, "").replace(/^221/, "");
    const mdp = form.querySelector("#connexion-mdp").value;
    const client = CLIENTS.find((c) => c.telephone === tel && c.motDePasse === mdp);
    if (!client) {
      erreur.hidden = false;
      form.querySelector("#connexion-mdp").value = "";
      form.querySelector("#connexion-mdp").focus();
      return;
    }
    ecrireSession(client.id);
    window.location.href = destination;
  });
}

const PRODUIT_IMG = {
  etudes: { src: "assets/img/produit-etudes.svg", alt: "Emplacement de l'image du produit NSIA Études" },
  retraite: { src: "assets/img/produit-retraite.svg", alt: "Emplacement de l'image du produit NSIA Retraite" },
  epargne: { src: "assets/img/produit-epargne.svg", alt: "Emplacement de l'image du produit NSIA Épargne" },
};

function formatFCFA(n) {
  return n.toLocaleString("fr-FR").replace(/ /g, " ") + " FCFA";
}

/* ---------- en-tete : bordure au defilement ---------- */

function initHeaderScroll() {
  const header = document.querySelector("header.site");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 4);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- menu mobile ---------- */

function initMobileMenu() {
  const menu = document.querySelector(".mobile-menu");
  const openBtn = document.querySelector(".burger");
  if (!menu || !openBtn) return;
  const closeBtn = menu.querySelector(".mobile-menu__close");
  const backdrop = menu.querySelector(".mobile-menu__backdrop");
  const links = menu.querySelectorAll("a");

  const open = () => menu.classList.add("is-open");
  const close = () => menu.classList.remove("is-open");

  openBtn.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);
  links.forEach((a) => a.addEventListener("click", close));
}

/* ---------- apparition au defilement ---------- */

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------- compteurs chiffres cles ---------- */

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1000;
  const start = performance.now();
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    el.textContent = target + suffix;
    return;
  }

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(progress * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const els = document.querySelectorAll("[data-count]");
  if (!els.length) return;
  if (!("IntersectionObserver" in window)) {
    els.forEach(animateCounter);
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- toast ---------- */

function showToast(message) {
  let layer = document.querySelector(".toast-layer");
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "toast-layer";
    document.body.appendChild(layer);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  layer.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("is-visible"));

  setTimeout(() => {
    toast.classList.remove("is-visible");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ---------- modale generique ---------- */

function buildModalLayer() {
  let layer = document.querySelector(".modal-layer");
  if (layer) return layer;
  layer = document.createElement("div");
  layer.className = "modal-layer";
  layer.innerHTML = '<div class="modal-backdrop"></div><div class="modal-box" role="dialog" aria-modal="true"></div>';
  document.body.appendChild(layer);
  layer.querySelector(".modal-backdrop").addEventListener("click", closeModal);
  return layer;
}

function closeModal() {
  const layer = document.querySelector(".modal-layer");
  if (layer) layer.classList.remove("is-open");
}

function openPayerModal(contrat) {
  const layer = buildModalLayer();
  const box = layer.querySelector(".modal-box");
  box.innerHTML = `
    <h3>Paiement — ${contrat.police}</h3>
    <p>${contrat.assure} · ${contrat.produit}</p>
    <p>Solde dû : <span class="amount" style="color:#B91C1C;font-weight:600">${formatFCFA(contrat.solde)}</span></p>
    <p>Ceci est un prototype académique. Aucun vrai paiement n'est effectué et aucun code secret n'est demandé.</p>
    <div class="modal-actions">
      <button class="btn btn-ghost" data-close>Fermer</button>
      <button class="btn btn-primary" data-confirm>Confirmer (démo)</button>
    </div>
  `;
  box.querySelector("[data-close]").addEventListener("click", closeModal);
  box.querySelector("[data-confirm]").addEventListener("click", () => {
    closeModal();
    showToast(`Paiement simulé enregistré pour ${contrat.police}`);
  });
  layer.classList.add("is-open");
}

function openPromesseModal(contrat) {
  const layer = buildModalLayer();
  const box = layer.querySelector(".modal-box");
  box.innerHTML = `
    <h3>Promettre une date — ${contrat.police}</h3>
    <p>${contrat.assure} · ${contrat.produit} · Solde dû : <span class="amount">${formatFCFA(contrat.solde)}</span></p>
    <div class="modal-field">
      <label for="promesse-date">Date de paiement prévue</label>
      <input type="date" id="promesse-date">
    </div>
    <p>Un conseiller peut vous recontacter avant cette date.</p>
    <div class="modal-actions">
      <button class="btn btn-ghost" data-close>Fermer</button>
      <button class="btn btn-primary" data-confirm>Confirmer la promesse</button>
    </div>
  `;
  const dateInput = box.querySelector("#promesse-date");
  box.querySelector("[data-close]").addEventListener("click", closeModal);
  box.querySelector("[data-confirm]").addEventListener("click", () => {
    if (!dateInput.value) {
      dateInput.style.borderColor = "#B91C1C";
      dateInput.focus();
      return;
    }
    const d = new Date(dateInput.value);
    const formatted = d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    closeModal();
    showToast(`Promesse de paiement enregistrée pour le ${formatted}`);
  });
  layer.classList.add("is-open");
}

/* ---------- page mes cotisations ---------- */

function renderCotisations() {
  const tbody = document.querySelector("#contrats-table tbody");
  const cardsWrap = document.querySelector("#contrats-cards");
  const countLabel = document.querySelector("#filters-count");
  if (!tbody || !cardsWrap) return;

  const filterButtons = document.querySelectorAll(".filter-btn");
  let currentFilter = "tous";

  const client = clientConnecte();
  const MES_CONTRATS = contratsDuClient();
  const note = document.querySelector(".demo-note");
  if (note && client) note.textContent = `Connecté(e) : ${client.nom} · données de démonstration`;

  function statutPill(statut) {
    return statut === "ajour"
      ? '<span class="status-pill ok"><span class="dot"></span>À jour</span>'
      : '<span class="status-pill late"><span class="dot"></span>En retard</span>';
  }

  function render() {
    const list = MES_CONTRATS.filter((c) => currentFilter === "tous" || c.produitSlug === currentFilter);
    const img = (slug) => PRODUIT_IMG[slug];

    tbody.innerHTML = list
      .map((c) => {
        const soldeClass = c.solde > 0 ? "danger" : "neutre";
        const actions =
          c.statut === "retard"
            ? `<div class="actions-cell">
                 <button class="btn btn-primary btn-sm" data-payer="${c.police}">Payer</button>
                 <button class="link-promesse" data-promesse="${c.police}">Promettre une date</button>
               </div>`
            : '<span class="actions-tiret">—</span>';
        const pImg = img(c.produitSlug);
        return `<tr class="fade-in">
          <td>${c.police}</td>
          <td>${c.assure}</td>
          <td>${c.zone}</td>
          <td><div class="produit-cell"><img src="${pImg.src}" alt="${pImg.alt}" loading="lazy">${c.produit}</div></td>
          <td class="num"><span class="amount">${formatFCFA(c.prime)}</span></td>
          <td class="num"><span class="amount solde ${soldeClass}">${formatFCFA(c.solde)}</span></td>
          <td class="centre">${statutPill(c.statut)}</td>
          <td class="num">${actions}</td>
        </tr>`;
      })
      .join("");

    cardsWrap.innerHTML = list
      .map((c) => {
        const soldeClass = c.solde > 0 ? "danger" : "neutre";
        const pImg = img(c.produitSlug);
        const actions =
          c.statut === "retard"
            ? `<div class="contrat-card__actions">
                 <button class="btn btn-primary btn-sm" data-payer="${c.police}">Payer</button>
                 <button class="btn btn-outline btn-sm" data-promesse="${c.police}">Promettre une date</button>
               </div>`
            : "";
        return `<article class="contrat-card fade-in">
          <div class="contrat-card__head">
            <span class="nom">${c.assure}</span>
            ${statutPill(c.statut)}
          </div>
          <div class="contrat-card__meta"><img src="${pImg.src}" alt="${pImg.alt}" loading="lazy">${c.police} · ${c.produit}</div>
          <div class="contrat-card__grid">
            <div><span class="label">Zone</span><br>${c.zone}</div>
            <div><span class="label">Prime</span><br><span class="amount">${formatFCFA(c.prime)}</span></div>
            <div><span class="label">Solde dû</span><br><span class="amount ${soldeClass}">${formatFCFA(c.solde)}</span></div>
          </div>
          ${actions}
        </article>`;
      })
      .join("");

    countLabel.textContent = `${list.length} contrat${list.length > 1 ? "s" : ""}`;

    tbody.querySelectorAll("[data-payer]").forEach((btn) =>
      btn.addEventListener("click", () => openPayerModal(MES_CONTRATS.find((c) => c.police === btn.dataset.payer)))
    );
    tbody.querySelectorAll("[data-promesse]").forEach((btn) =>
      btn.addEventListener("click", () => openPromesseModal(MES_CONTRATS.find((c) => c.police === btn.dataset.promesse)))
    );
    cardsWrap.querySelectorAll("[data-payer]").forEach((btn) =>
      btn.addEventListener("click", () => openPayerModal(MES_CONTRATS.find((c) => c.police === btn.dataset.payer)))
    );
    cardsWrap.querySelectorAll("[data-promesse]").forEach((btn) =>
      btn.addEventListener("click", () => openPromesseModal(MES_CONTRATS.find((c) => c.police === btn.dataset.promesse)))
    );
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  const enRetard = MES_CONTRATS.filter((c) => c.statut === "retard").length;
  const aJour = MES_CONTRATS.filter((c) => c.statut === "ajour").length;
  const totalDu = MES_CONTRATS.reduce((sum, c) => sum + c.solde, 0);
  const elAJour = document.querySelector("#resume-ajour");
  const elRetard = document.querySelector("#resume-retard");
  const elTotal = document.querySelector("#resume-total");
  if (elAJour) elAJour.textContent = aJour;
  if (elRetard) elRetard.textContent = enRetard;
  if (elTotal) elTotal.innerHTML = `<span class="amount">${formatFCFA(totalDu)}</span>`;

  render();
}

/* ---------- formulaire contact ---------- */

function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Votre demande a été enregistrée. Un conseiller vous recontacte prochainement.");
    form.reset();
  });
}

/* ---------- espace agent ---------- */

const ACTIONS_AGENT = [
  { date: "2026-09-29", heure: "09:12", police: "POL001", client: "Awa Ndiaye",    type: "consultation", detail: "Consultation de la situation" },
  { date: "2026-09-29", heure: "09:40", police: "POL004", client: "Khady Sow",     type: "payer",         detail: "Clic sur « Payer »" },
  { date: "2026-09-28", heure: "17:05", police: "POL008", client: "Rokhaya Fall",  type: "promesse",      detail: "Promesse de paiement", promesse: "2026-10-05" },
  { date: "2026-09-28", heure: "11:22", police: "POL001", client: "Awa Ndiaye",    type: "contact",       detail: "Demande de contact (vocal wolof)", statut: "a-traiter" },
  { date: "2026-09-27", heure: "14:50", police: "POL003", client: "Mariama Fall",  type: "consultation", detail: "Consultation de la situation" },
  { date: "2026-09-26", heure: "10:03", police: "POL004", client: "Khady Sow",     type: "promesse",      detail: "Promesse de paiement", promesse: "2026-09-20" },
  { date: "2026-09-25", heure: "16:18", police: "POL002", client: "Fatou Diop",    type: "contact",       detail: "Demande de contact (e-mail)", statut: "en-cours" },
  { date: "2026-09-24", heure: "08:47", police: "POL008", client: "Rokhaya Fall",  type: "payer",         detail: "Clic sur « Payer »" },
  { date: "2026-09-23", heure: "13:30", police: "POL007", client: "Adama Diallo",  type: "contact",       detail: "Demande de contact (appel)", statut: "traitee" },
  { date: "2026-09-22", heure: "09:15", police: "POL001", client: "Awa Ndiaye",    type: "payer",         detail: "Clic sur « Payer »" },
].map((a, i) => ({ ...a, index: i }));

const TYPE_LABEL = {
  consultation: "Consultation",
  payer: "Clic « Payer »",
  promesse: "Promesse",
  contact: "Demande de contact",
};

const STATUT_LABEL = { "a-traiter": "À traiter", "en-cours": "En cours", traitee: "Traitée" };

function initAgentLogin() {
  const form = document.querySelector("#agent-login-form");
  const loginScreen = document.querySelector("#agent-login-screen");
  const dashboard = document.querySelector("#agent-dashboard");
  if (!form || !loginScreen || !dashboard) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    loginScreen.style.display = "none";
    dashboard.style.display = "block";
    initAgentDashboard();
  });

  const logout = document.querySelector("#agent-logout");
  logout?.addEventListener("click", () => {
    dashboard.style.display = "none";
    loginScreen.style.display = "flex";
    form.reset();
  });
}

function initAgentDashboard() {
  const tbody = document.querySelector("#agent-table tbody");
  if (!tbody || tbody.dataset.ready) return;
  tbody.dataset.ready = "1";

  const typeFilter = document.querySelector("#agent-filter-type");
  const policeFilter = document.querySelector("#agent-filter-police");
  const periodeFilter = document.querySelector("#agent-filter-periode");

  const uniquePolices = [...new Set(ACTIONS_AGENT.map((a) => a.police))].sort();
  uniquePolices.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    policeFilter.appendChild(opt);
  });

  function withinPeriode(dateStr, periode) {
    if (periode === "tout") return true;
    const days = periode === "7" ? 7 : 30;
    const ref = new Date("2026-09-29T23:59:59");
    const d = new Date(dateStr);
    const diff = (ref - d) / (1000 * 60 * 60 * 24);
    return diff <= days;
  }

  function render() {
    const list = ACTIONS_AGENT.filter((a) => {
      if (typeFilter.value !== "tous" && a.type !== typeFilter.value) return false;
      if (policeFilter.value !== "toutes" && a.police !== policeFilter.value) return false;
      if (!withinPeriode(a.date, periodeFilter.value)) return false;
      return true;
    }).sort((a, b) => (a.date + a.heure < b.date + b.heure ? 1 : -1));

    tbody.innerHTML = list
      .map((a) => {
        const dateFr = new Date(a.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
        let extra = "—";
        if (a.type === "promesse") extra = new Date(a.promesse).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
        let statutCell = "—";
        if (a.type === "contact") {
          statutCell = `<select data-statut-index="${a.index}">
            <option value="a-traiter" ${a.statut === "a-traiter" ? "selected" : ""}>À traiter</option>
            <option value="en-cours" ${a.statut === "en-cours" ? "selected" : ""}>En cours</option>
            <option value="traitee" ${a.statut === "traitee" ? "selected" : ""}>Traitée</option>
          </select>`;
        }
        return `<tr class="fade-in">
          <td>${dateFr} ${a.heure}</td>
          <td>${a.client}</td>
          <td>${a.police}</td>
          <td><span class="type-tag">${TYPE_LABEL[a.type]}</span></td>
          <td>${a.detail}</td>
          <td>${extra}</td>
          <td>${statutCell}</td>
        </tr>`;
      })
      .join("");

    tbody.querySelectorAll("select[data-statut-index]").forEach((sel) => {
      sel.addEventListener("change", () => {
        const item = ACTIONS_AGENT[parseInt(sel.dataset.statutIndex, 10)];
        if (item) item.statut = sel.value;
        updateCounters();
        showToast("Statut de la demande mis à jour");
      });
    });

    updateVisibleForExport(list);
  }

  function updateCounters() {
    const aTraiter = ACTIONS_AGENT.filter((a) => a.type === "contact" && a.statut === "a-traiter").length;
    const enCours = ACTIONS_AGENT.filter((a) => a.type === "promesse").length;
    const ref = new Date("2026-09-29T23:59:59");
    const depassees = ACTIONS_AGENT.filter((a) => a.type === "promesse" && new Date(a.promesse) < ref).length;
    const clicsSemaine = ACTIONS_AGENT.filter((a) => a.type === "payer" && withinPeriode(a.date, "7")).length;

    document.querySelector("#compteur-a-traiter").textContent = aTraiter;
    document.querySelector("#compteur-en-cours").textContent = enCours;
    document.querySelector("#compteur-depassees").textContent = depassees;
    document.querySelector("#compteur-clics").textContent = clicsSemaine;
  }

  let currentExportList = [];
  function updateVisibleForExport(list) {
    currentExportList = list;
  }

  document.querySelector("#agent-export")?.addEventListener("click", () => {
    const header = ["Date", "Heure", "Client", "Police", "Type", "Détail", "Info", "Statut"];
    const rows = currentExportList.map((a) => [
      a.date,
      a.heure,
      a.client,
      a.police,
      TYPE_LABEL[a.type],
      a.detail,
      a.type === "promesse" ? a.promesse : "",
      a.statut ? STATUT_LABEL[a.statut] : "",
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ndimbal-actions-clients.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Export CSV généré");
  });

  [typeFilter, policeFilter, periodeFilter].forEach((el) => el.addEventListener("change", render));

  render();
  updateCounters();
}

document.addEventListener("DOMContentLoaded", () => {
  if (!initSession()) return;
  initConnexion();
  initHeaderScroll();
  initMobileMenu();
  initReveal();
  initCounters();
  renderCotisations();
  initContactForm();
  initAgentLogin();
});
