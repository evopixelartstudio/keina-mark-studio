/**
 * Keina Mark Studio — Frontend Oficial da Loja
 * Arquitetura Vanilla JavaScript Modular
 */

const KM_APP = (function() {
  // Estado local da UI
  let currentCategory = "all";
  let currentSort = "default";
  let productsCache = [];
  let cart = [];
  let activeProductModal = null;

  // Formatação de Moeda BRL
  function formatMoney(value) {
    if (value === null || value === undefined || isNaN(value)) {
      return "Preço sob consulta";
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  }

  // Toasts de Notificação
  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line></svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // Normalização de caminho de imagem
  function fixImagePath(path) {
    if (!path) return "public/products/banco-rustico-madeira-metal.png";
    if (path.startsWith("/")) {
      return path.substring(1);
    }
    return path;
  }

  // Inicialização Geral
  function init() {
    loadSettings();
    renderCategories();
    refreshProducts();
    initCart();
    renderAccountDropdown();
    checkAccessDenied();
    setupEventListeners();
  }

  // Carrega configurações da loja na UI
  function loadSettings() {
    if (!window.KM_STORE) return;
    const settings = window.KM_STORE.getSettings();
    const appearance = window.KM_STORE.getAppearance();

    if (settings) {
      const headerName = document.getElementById("headerStoreName");
      if (headerName && settings.store_name) {
        headerName.textContent = settings.store_name.toUpperCase();
      }
      const footerEmail = document.getElementById("footerEmail");
      if (footerEmail && settings.contact_email) {
        footerEmail.textContent = settings.contact_email;
        footerEmail.href = `mailto:${settings.contact_email}`;
      }
      const footerInsta = document.getElementById("footerInstagram");
      if (footerInsta && settings.instagram_url) {
        footerInsta.textContent = `Instagram: ${settings.instagram_url}`;
      }
    }

    if (appearance) {
      const heroTitle = document.getElementById("heroTitle");
      if (heroTitle && appearance.hero_title) {
        heroTitle.textContent = appearance.hero_title;
      }
      const heroSubtitle = document.getElementById("heroSubtitle");
      if (heroSubtitle && appearance.hero_subtitle) {
        heroSubtitle.textContent = appearance.hero_subtitle;
      }
      const heroImage = document.getElementById("heroImage");
      if (heroImage && appearance.hero_image_url) {
        heroImage.src = fixImagePath(appearance.hero_image_url);
      }
      const essenceTitle = document.getElementById("essenceTitle");
      if (essenceTitle && appearance.essence_title) {
        essenceTitle.textContent = appearance.essence_title;
      }
      const essenceText = document.getElementById("essenceText");
      if (essenceText && appearance.essence_text) {
        essenceText.textContent = appearance.essence_text;
      }
    }
  }

  // Renderiza os 4 blocos de Categorias
  function renderCategories() {
    const grid = document.getElementById("categoryGrid");
    if (!grid || !window.KM_STORE) return;

    const categories = window.KM_STORE.getCategories();
    grid.innerHTML = categories.map(cat => `
      <div class="category-card" onclick="KM_APP.filterCategory('${cat.slug}')" role="button" tabindex="0">
        <div class="category-thumb-wrap">
          <img src="${fixImagePath(cat.image_url)}" alt="${cat.name}" loading="lazy">
        </div>
        <div class="category-info">
          <h3 class="category-name">${cat.name}</h3>
          <p class="category-desc">${cat.description || "Peças autorais com identidade."}</p>
        </div>
      </div>
    `).join("");
  }

  // Recarrega lista de produtos do Store
  function refreshProducts() {
    if (!window.KM_STORE) return;
    productsCache = window.KM_STORE.getProducts();

    // Atualiza contador total no pill
    const countAllEl = document.getElementById("countAll");
    if (countAllEl) {
      countAllEl.textContent = productsCache.length;
    }

    // Atualiza contadores por categoria
    const categories = window.KM_STORE.getCategories();
    categories.forEach(cat => {
      const pill = document.querySelector(`.filter-pill[data-category="${cat.slug}"]`);
      if (pill) {
        const count = productsCache.filter(p => p.category_id === cat.id || p.category_id === cat.slug).length;
        pill.innerHTML = `${cat.name} (${count})`;
      }
    });

    renderProductsGrid();
  }

  // Renderiza a Grade de Produtos com Filtros e Ordenação
  function renderProductsGrid() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    let filtered = productsCache.slice();

    // Filtro por categoria
    if (currentCategory !== "all") {
      filtered = filtered.filter(p => {
        // Encontra o slug da categoria do produto
        const categories = window.KM_STORE.getCategories();
        const cat = categories.find(c => c.id === p.category_id || c.slug === p.category_id);
        const productCatSlug = cat ? cat.slug : "";
        return productCatSlug === currentCategory || p.category_id === currentCategory;
      });
    }

    // Ordenação
    if (currentSort === "price-asc") {
      filtered.sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999));
    } else if (currentSort === "price-desc") {
      filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else if (currentSort === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background-color: var(--color-white); border: 1px solid var(--color-areia-border); border-radius: var(--radius-sm);">
          <h3 style="font-size: 1.8rem; margin-bottom: 8px;">Nenhum produto encontrado</h3>
          <p style="color: var(--color-grafite-muted); margin-bottom: 20px;">Não encontramos itens nesta categoria no momento.</p>
          <button class="btn btn-primary btn-sm" onclick="KM_APP.filterCategory('all')">Ver Todos os Produtos</button>
        </div>
      `;
      return;
    }

    const categories = window.KM_STORE.getCategories();

    grid.innerHTML = filtered.map(product => {
      const categoryObj = categories.find(c => c.id === product.category_id || c.slug === product.category_id);
      const categoryName = categoryObj ? categoryObj.name : "Coleção Studio";
      const hasPrice = product.price !== null && product.price !== undefined && Number(product.price) > 0;
      const isBulky = product.is_bulky_furniture;

      let badgesHtml = "";
      if (!hasPrice) {
        badgesHtml += `<span class="badge badge-areia">Sob Consulta</span>`;
      } else if (product.lead_time_days && product.lead_time_days > 7) {
        badgesHtml += `<span class="badge badge-oliva">Sob Encomenda</span>`;
      } else {
        badgesHtml += `<span class="badge badge-oliva">Pronta Entrega</span>`;
      }

      if (isBulky) {
        badgesHtml += `<span class="badge badge-grafite">Mobiliário</span>`;
      }

      const imageSrc = fixImagePath(product.primary_image_url);

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-media" onclick="KM_APP.openQuickView('${product.id}')">
            <img src="${imageSrc}" alt="${product.name}" loading="lazy">
            <div class="product-badges">
              ${badgesHtml}
            </div>
            <button class="product-quick-btn" type="button" aria-label="Visualizar detalhes">
              Visualizar Peça
            </button>
          </div>
          <div class="product-body">
            <span class="product-category-sub">${categoryName}</span>
            <h3 class="product-name" onclick="KM_APP.openQuickView('${product.id}')">${product.name}</h3>
            <div class="product-meta-row">
              ${hasPrice 
                ? `<div class="product-price">${formatMoney(product.price)}</div>` 
                : `<div class="product-price-inquiry">Preço sob consulta</div>`
              }
              <button class="btn btn-secondary btn-sm" onclick="KM_APP.openQuickView('${product.id}')" style="padding: 6px 12px; font-size: 0.72rem;">
                Detalhes
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  // Filtragem de Categorias
  function filterCategory(categorySlug) {
    currentCategory = categorySlug;

    // Atualiza pills ativos
    document.querySelectorAll(".filter-pill").forEach(pill => {
      if (pill.getAttribute("data-category") === categorySlug) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });

    renderProductsGrid();

    // Rola suavemente até o catálogo
    const catalogEl = document.getElementById("catalogo");
    if (catalogEl && window.scrollY > 400) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Ordenação
  function handleSortChange(sortVal) {
    currentSort = sortVal;
    renderProductsGrid();
  }

  // =========================================================================
  // MODAL DE DETALHES (QUICK VIEW)
  // =========================================================================

  function openQuickView(productId) {
    const product = productsCache.find(p => p.id === productId);
    if (!product) return;

    activeProductModal = product;
    const modalContent = document.getElementById("quickViewContent");
    const categories = window.KM_STORE.getCategories();
    const categoryObj = categories.find(c => c.id === product.category_id || c.slug === product.category_id);
    const categoryName = categoryObj ? categoryObj.name : "Studio";
    const hasPrice = product.price !== null && product.price !== undefined && Number(product.price) > 0;
    const imageSrc = fixImagePath(product.primary_image_url);

    modalContent.innerHTML = `
      <div class="quickview-gallery">
        <img src="${imageSrc}" alt="${product.name}" id="modalMainImg">
      </div>
      <div class="quickview-details">
        <div>
          <span class="product-category-sub">${categoryName}</span>
          <h2 style="font-size: 2.1rem; margin-top: 4px; margin-bottom: 8px;">${product.name}</h2>
          <div style="font-size: 0.75rem; color: var(--color-grafite-muted); margin-bottom: 14px;">
            Código SKU: <strong>${product.sku || "KM-2026"}</strong>
          </div>
          ${hasPrice 
            ? `<div style="font-size: 1.6rem; font-weight: 700; color: var(--color-grafite);">${formatMoney(product.price)}</div>`
            : `<div class="badge badge-areia" style="font-size: 0.88rem; padding: 6px 14px;">Preço sob consulta</div>`
          }
        </div>

        <p style="font-size: 0.92rem; color: var(--color-grafite-soft); line-height: 1.7;">
          ${product.short_description || product.description || "Peça autoral com identidade visual marcante e materiais nobres."}
        </p>

        <!-- Especificações Rápidas -->
        <div style="background-color: var(--color-marfim); padding: 16px; border-radius: var(--radius-sm); font-size: 0.8rem; display: flex; flex-direction: column; gap: 6px;">
          ${product.materials ? `<div><strong>Material:</strong> ${product.materials}</div>` : ""}
          ${product.dimensions ? `<div><strong>Dimensões:</strong> ${product.dimensions}</div>` : ""}
          ${product.weight_kg ? `<div><strong>Peso:</strong> ${product.weight_kg} kg</div>` : ""}
          ${product.lead_time_days ? `<div><strong>Prazo de Produção:</strong> ${product.lead_time_days} dias úteis</div>` : ""}
          ${product.is_bulky_furniture ? `<div style="color: var(--color-couro); font-weight: 600;">⚠️ Peça volumosa: transporte via transportadora especializada.</div>` : ""}
        </div>

        <!-- Ação de Compra -->
        <div style="display: flex; gap: 12px; align-items: center; margin-top: 8px;">
          ${hasPrice ? `
            <div style="display: flex; align-items: center; border: 1px solid var(--color-areia-border); border-radius: var(--radius-sm); height: 46px;">
              <button class="cart-qty-btn" onclick="KM_APP.changeModalQty(-1)" style="width: 36px; height: 100%; font-size: 1rem;">-</button>
              <input type="number" id="modalQtyInput" value="1" min="1" max="${product.inventory_quantity || 10}" style="width: 44px; text-align: center; border: none; font-weight: 600;" readonly>
              <button class="cart-qty-btn" onclick="KM_APP.changeModalQty(1)" style="width: 36px; height: 100%; font-size: 1rem;">+</button>
            </div>
            <button class="btn btn-primary" onclick="KM_APP.addToCart('${product.id}')" style="flex: 1; height: 46px;">
              Adicionar ao Carrinho
            </button>
          ` : `
            <button class="btn btn-couro" onclick="KM_APP.inquireProduct('${product.name}')" style="width: 100%; height: 46px;">
              Consultar Preço no WhatsApp
            </button>
          `}
        </div>

        <!-- Calculadora de Frete no Modal -->
        <div class="freight-box" style="margin-top: 10px;">
          <div style="font-size: 0.74rem; font-weight: 600; text-transform: uppercase;">Calcular Frete deste Produto:</div>
          <div class="freight-input-row">
            <input type="text" id="modalCepInput" class="freight-input" placeholder="00000-000" maxlength="9">
            <button class="btn btn-secondary btn-sm" onclick="KM_APP.calculateModalFreight()">Calcular</button>
          </div>
          <div id="modalFreightResult" style="display: none;"></div>
        </div>
      </div>
    `;

    document.getElementById("quickViewBackdrop").classList.add("open");
  }

  function changeModalQty(delta) {
    const input = document.getElementById("modalQtyInput");
    if (!input) return;
    let val = parseInt(input.value, 10) + delta;
    if (val < 1) val = 1;
    input.value = val;
  }

  function closeModals() {
    document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("open"));
    document.getElementById("cartDrawerBackdrop").classList.remove("open");
    document.getElementById("cartDrawer").classList.remove("open");
    document.getElementById("mobileNavBackdrop").classList.remove("open");
    document.getElementById("mobileNavDrawer").classList.remove("open");
  }

  // =========================================================================
  // GESTÃO DO CARRINHO DE COMPRAS
  // =========================================================================

  function initCart() {
    if (!window.KM_STORE) return;
    cart = window.KM_STORE.getCart() || [];
    updateCartUI();
  }

  function addToCart(productId) {
    const product = productsCache.find(p => p.id === productId);
    if (!product) return;

    if (product.price === null || product.price === undefined || Number(product.price) <= 0) {
      showToast("Este produto está com preço sob consulta e não pode ser comprado diretamente.", "warning");
      return;
    }

    const modalQtyInput = document.getElementById("modalQtyInput");
    const qtyToAdd = modalQtyInput ? parseInt(modalQtyInput.value, 10) : 1;

    const existingIndex = cart.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += qtyToAdd;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        image: fixImagePath(product.primary_image_url),
        isBulky: product.is_bulky_furniture,
        quantity: qtyToAdd
      });
    }

    window.KM_STORE.saveCart(cart);
    updateCartUI();
    closeModals();
    openCart();
    showToast(`"${product.name}" adicionado ao carrinho!`);
  }

  function updateCartQuantity(productId, delta) {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.productId !== productId);
    }

    window.KM_STORE.saveCart(cart);
    updateCartUI();
  }

  function removeCartItem(productId) {
    cart = cart.filter(i => i.productId !== productId);
    window.KM_STORE.saveCart(cart);
    updateCartUI();
    showToast("Item removido do carrinho.");
  }

  function updateCartUI() {
    const counter = document.getElementById("cartCounter");
    const drawerCounter = document.getElementById("cartDrawerItemCount");
    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (counter) counter.textContent = totalQty;
    if (drawerCounter) drawerCounter.textContent = `(${totalQty} ${totalQty === 1 ? "item" : "itens"})`;

    const container = document.getElementById("cartItemsContainer");
    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 16px; color: var(--color-grafite-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px; opacity: 0.5;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line></svg>
          <p style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--color-grafite); margin-bottom: 6px;">Seu carrinho está vazio</p>
          <p style="font-size: 0.85rem;">Explore nossas peças autorais e adicione seus itens favoritos.</p>
        </div>
      `;
      document.getElementById("cartSubtotal").textContent = "R$ 0,00";
      document.getElementById("cartTotal").textContent = "R$ 0,00";
      return;
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
        <div>
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-price">${formatMoney(item.price)}</div>
          <div class="cart-qty-ctrl">
            <button class="cart-qty-btn" onclick="KM_APP.updateCartQuantity('${item.productId}', -1)">&minus;</button>
            <span class="cart-qty-num">${item.quantity}</span>
            <button class="cart-qty-btn" onclick="KM_APP.updateCartQuantity('${item.productId}', 1)">&plus;</button>
          </div>
        </div>
        <button onclick="KM_APP.removeCartItem('${item.productId}')" style="color: var(--color-grafite-muted); font-size: 1.2rem; padding: 4px;" title="Remover">&times;</button>
      </div>
    `).join("");

    document.getElementById("cartSubtotal").textContent = formatMoney(subtotal);
    document.getElementById("cartTotal").textContent = formatMoney(subtotal);
  }

  function openCart() {
    document.getElementById("cartDrawerBackdrop").classList.add("open");
    document.getElementById("cartDrawer").classList.add("open");
  }

  // =========================================================================
  // CÁLCULO DE FRETE REAL (ViaCEP)
  // =========================================================================

  async function calculateCepLookup(rawCep) {
    const cleanCep = rawCep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      throw new Error("Digite um CEP válido com 8 dígitos.");
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!response.ok) {
      throw new Error("Falha ao consultar CEP.");
    }

    const data = await response.json();
    if (data.erro) {
      throw new Error("CEP não encontrado.");
    }

    return data;
  }

  async function calculateCartFreight() {
    const input = document.getElementById("cartCepInput");
    const resultBox = document.getElementById("cartFreightResult");
    if (!input || !resultBox) return;

    const cep = input.value.trim();
    resultBox.style.display = "block";
    resultBox.className = "freight-result";
    resultBox.innerHTML = `<em>Consultando base dos Correios...</em>`;

    try {
      const address = await calculateCepLookup(cep);
      const hasBulky = cart.some(i => i.isBulky);

      let freightEstimate = "";
      if (hasBulky) {
        freightEstimate = `
          <strong>Destino:</strong> ${address.localidade} / ${address.uf} (${address.bairro})<br>
          <span style="color: var(--color-couro); font-weight: 600;">⚠️ Atenção: Há peças de mobiliário no carrinho.</span><br>
          O transporte é realizado por transportadora especializada. O frete final e agendamento de entrega serão confirmados no atendimento.
        `;
      } else {
        freightEstimate = `
          <strong>Destino:</strong> ${address.localidade} / ${address.uf} (${address.bairro})<br>
          <strong>Estimativa Padrão:</strong> R$ 38,00 (PAC 6 a 12 dias úteis)<br>
          <strong>Sedex Expresso:</strong> R$ 74,00 (2 a 4 dias úteis)<br>
          <small style="color: var(--color-grafite-muted);">*Cálculo real de transportadoras será integrado na fase de checkout.</small>
        `;
      }

      resultBox.innerHTML = freightEstimate;
      showToast(`CEP localizado: ${address.localidade}/${address.uf}`);
    } catch (err) {
      resultBox.innerHTML = `<span style="color: var(--color-danger);">${err.message}</span>`;
    }
  }

  async function calculateModalFreight() {
    const input = document.getElementById("modalCepInput");
    const resultBox = document.getElementById("modalFreightResult");
    if (!input || !resultBox) return;

    const cep = input.value.trim();
    resultBox.style.display = "block";
    resultBox.className = "freight-result";
    resultBox.innerHTML = `<em>Consultando CEP...</em>`;

    try {
      const address = await calculateCepLookup(cep);
      const isBulky = activeProductModal?.is_bulky_furniture;

      if (isBulky) {
        resultBox.innerHTML = `
          <strong>Destino:</strong> ${address.localidade} / ${address.uf}<br>
          <span style="color: var(--color-couro); font-weight: 600;">Mobiliário de grande porte:</span> Envio rodoviário/fluvial com proteção especial. Cotação dedicada sob consulta.
        `;
      } else {
        resultBox.innerHTML = `
          <strong>Destino:</strong> ${address.localidade} / ${address.uf}<br>
          <strong>PAC:</strong> ~R$ 38,00 | <strong>Sedex:</strong> ~R$ 74,00
        `;
      }
    } catch (err) {
      resultBox.innerHTML = `<span style="color: var(--color-danger);">${err.message}</span>`;
    }
  }

  // Finalização via WhatsApp (Orçamento / Consulta direta)
  function orderViaWhatsApp() {
    if (cart.length === 0) {
      showToast("Seu carrinho está vazio.", "warning");
      return;
    }

    const itemsSummary = cart.map(i => `• ${i.name} (x${i.quantity}) - ${formatMoney(i.price * i.quantity)}`).join("%0A");
    const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const cep = document.getElementById("cartCepInput")?.value || "Não informado";

    const msg = `Olá! Gostaria de consultar a disponibilidade e solicitar cotação para as peças:%0A%0A${itemsSummary}%0A%0ATotal Estimado: ${formatMoney(subtotal)}%0ACEP de Entrega: ${cep}%0A%0AAguardo informações sobre prazo e pagamento. Obrigado!`;
    const whatsappUrl = `https://wa.me/5592999999999?text=${msg}`;
    window.open(whatsappUrl, "_blank");
  }

  function inquireProduct(productName) {
    const msg = `Olá, Keina Mark Studio! Gostaria de consultar o valor e o prazo de produção da peça: *${productName}*.`;
    window.open(`https://wa.me/5592999999999?text=${encodeURIComponent(msg)}`, "_blank");
  }

  // =========================================================================
  // BUSCA E POLÍTICAS
  // =========================================================================

  function openSearch() {
    document.getElementById("searchBackdrop").classList.add("open");
    const input = document.getElementById("searchInput");
    if (input) {
      input.value = "";
      input.focus();
    }
  }

  function handleSearchInput(query) {
    const container = document.getElementById("searchResults");
    if (!container) return;

    const term = query.trim().toLowerCase();
    if (term.length < 2) {
      container.innerHTML = `<p style="color: var(--color-grafite-muted); font-size: 0.85rem;">Digite pelo menos 2 caracteres para pesquisar...</p>`;
      return;
    }

    const matches = productsCache.filter(p => {
      const matchName = p.name.toLowerCase().includes(term);
      const matchDesc = (p.description || "").toLowerCase().includes(term);
      const matchSku = (p.sku || "").toLowerCase().includes(term);
      const matchMat = (p.materials || "").toLowerCase().includes(term);
      return matchName || matchDesc || matchSku || matchMat;
    });

    if (matches.length === 0) {
      container.innerHTML = `<p style="color: var(--color-grafite-muted); font-size: 0.85rem;">Nenhuma peça encontrada para "${term}".</p>`;
      return;
    }

    container.innerHTML = matches.map(p => `
      <div style="display: flex; gap: 14px; align-items: center; padding: 10px; border: 1px solid var(--color-areia-border); border-radius: var(--radius-sm); cursor: pointer; transition: background 0.15s ease;" onclick="KM_APP.openQuickView('${p.id}'); KM_APP.closeModals();">
        <img src="${fixImagePath(p.primary_image_url)}" alt="${p.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm);">
        <div style="flex: 1;">
          <h4 style="font-family: var(--font-serif); font-size: 1.1rem; line-height: 1.2;">${p.name}</h4>
          <span style="font-size: 0.78rem; color: var(--color-couro); font-weight: 600;">${p.price ? formatMoney(p.price) : "Preço sob consulta"}</span>
        </div>
        <span style="font-size: 0.75rem; color: var(--color-grafite-muted);">&rarr;</span>
      </div>
    `).join("");
  }

  function showPolicy(type) {
    let title = "";
    let content = "";

    switch(type) {
      case "frete":
        title = "Envio e Frete Especial";
        content = "Os envios são despachados a partir de Manaus/AM. Peças leves (moda, acessórios e kits) seguem via Correios (PAC ou Sedex com seguro). Cada item é cuidadosamente embalado para preservar sua integridade.";
        break;
      case "mobiliario":
        title = "Mobiliário e Peças Volumosas";
        content = "Bancos, cadeiras e peças escultóricas em madeira maciça exigem transporte rodoviário ou fluvial com proteção contra impactos e umidade. O frete de peças volumosas é cotado caso a caso.";
        break;
      case "trocas":
        title = "Trocas e Devoluções";
        content = "Seguimos o Código de Defesa do Consumidor, com prazo de até 7 dias corridos após o recebimento para desistência ou troca. Peças sob encomenda personalizada seguem regras informadas no ato da contratação.";
        break;
      case "privacidade":
        title = "Privacidade e LGPD";
        content = "Seus dados cadastrais e de endereço são utilizados unicamente para emissão de notas e despacho de mercadorias. Não comercializamos dados com terceiros.";
        break;
    }

    alert(`${title}\n\n${content}`);
  }

  function closeMobileNav() {
    document.getElementById("mobileNavBackdrop").classList.remove("open");
    document.getElementById("mobileNavDrawer").classList.remove("open");
  }

  // Ouvintes de eventos
  function setupEventListeners() {
    // Botão Carrinho
    const cartBtn = document.getElementById("cartBtn");
    if (cartBtn) cartBtn.addEventListener("click", openCart);

    const closeCartBtn = document.getElementById("closeCartBtn");
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeModals);

    const cartBackdrop = document.getElementById("cartDrawerBackdrop");
    if (cartBackdrop) cartBackdrop.addEventListener("click", closeModals);

    // Botão Busca
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) searchBtn.addEventListener("click", openSearch);

    const closeSearchBtn = document.getElementById("closeSearchBtn");
    if (closeSearchBtn) closeSearchBtn.addEventListener("click", closeModals);

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => handleSearchInput(e.target.value));
    }

    // Botão Conta / Menu de Perfil RBAC
    const accountBtn = document.getElementById("accountBtn");
    if (accountBtn) {
      accountBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleAccountDropdown();
      });
    }

    // Fechar dropdown de conta ao clicar fora
    document.addEventListener("click", (e) => {
      const dropdown = document.getElementById("accountDropdown");
      const btn = document.getElementById("accountBtn");
      if (dropdown && dropdown.classList.contains("open")) {
        if (!dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
          closeAccountDropdown();
        }
      }
    });

    // Fechar Modal QuickView
    const closeQuickViewBtn = document.getElementById("closeQuickViewBtn");
    if (closeQuickViewBtn) closeQuickViewBtn.addEventListener("click", closeModals);

    // Fechar ao clicar fora dos modais
    document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeModals();
      });
    });

    // Mobile Nav
    const menuToggle = document.getElementById("menuToggle");
    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        document.getElementById("mobileNavBackdrop").classList.add("open");
        document.getElementById("mobileNavDrawer").classList.add("open");
      });
    }

    const closeMobileNavBtn = document.getElementById("closeMobileNav");
    if (closeMobileNavBtn) closeMobileNavBtn.addEventListener("click", closeMobileNav);

    const mobileNavBackdrop = document.getElementById("mobileNavBackdrop");
    if (mobileNavBackdrop) mobileNavBackdrop.addEventListener("click", closeMobileNav);

    // Tecla ESC para fechar modais e dropdowns
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModals();
        closeAccountDropdown();
      }
    });

    // Eventos customizados do Store e Auth
    window.addEventListener("kms_products_changed", () => {
      refreshProducts();
    });

    window.addEventListener("kms_cart_changed", () => {
      initCart();
    });

    window.addEventListener("kms_auth_changed", () => {
      renderAccountDropdown();
    });
  }

  // =========================================================================
  // GESTÃO DO MENU DA CONTA & AUTENTICAÇÃO (RBAC SEGURO)
  // =========================================================================

  function renderAccountDropdown() {
    const dropdown = document.getElementById("accountDropdown");
    if (!dropdown || !window.KM_AUTH) return;

    const user = window.KM_AUTH.getCurrentUser();

    if (!user) {
      // Visitante não autenticado (Zero opções administrativas)
      dropdown.innerHTML = `
        <div class="dropdown-guest-box">
          <h4 class="dropdown-guest-title">Sua Conta</h4>
          <p class="dropdown-guest-sub">Acesse para acompanhar seus pedidos e fretes dedicados.</p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button class="btn btn-primary btn-sm" onclick="KM_APP.openAuthModal('login'); KM_APP.closeAccountDropdown();" style="width: 100%;">
              Entrar
            </button>
            <button class="btn btn-secondary btn-sm" onclick="KM_APP.openAuthModal('register'); KM_APP.closeAccountDropdown();" style="width: 100%;">
              Criar Conta
            </button>
          </div>

          <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed var(--color-areia-border);">
            <span style="display: block; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-grafite-muted); margin-bottom: 6px;">
              Simulação de Demonstração
            </span>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary btn-sm" onclick="KM_APP.quickDemoLogin('customer'); KM_APP.closeAccountDropdown();" style="flex: 1; padding: 5px; font-size: 0.7rem;">
                👤 Cliente
              </button>
              <button class="btn btn-secondary btn-sm" onclick="KM_APP.quickDemoLogin('admin'); KM_APP.closeAccountDropdown();" style="flex: 1; padding: 5px; font-size: 0.7rem; color: var(--color-couro); border-color: var(--color-couro);">
                ⚡ Admin
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      const isAdministrator = user.role === "admin";
      const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

      dropdown.innerHTML = `
        <div class="dropdown-user-card">
          <div class="dropdown-avatar">${userInitial}</div>
          <div class="dropdown-user-info">
            <strong class="dropdown-user-name">${user.name}</strong>
            <div>
              <span class="badge ${isAdministrator ? 'badge-grafite' : 'badge-areia'}" style="font-size: 0.62rem; padding: 2px 6px;">
                ${isAdministrator ? 'ADMINISTRADOR' : 'CLIENTE'}
              </span>
            </div>
          </div>
        </div>

        <div class="dropdown-menu-list">
          <button class="dropdown-item" onclick="KM_APP.openAccountDetailsModal(); KM_APP.closeAccountDropdown();">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Minha Conta</span>
          </button>

          ${isAdministrator ? `
            <a href="admin.html" class="dropdown-item dropdown-item-admin" style="text-decoration: none;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span>Gerenciar Loja &rarr;</span>
            </a>
          ` : ''}

          <button class="dropdown-item" onclick="KM_APP.openAddressesModal(); KM_APP.closeAccountDropdown();">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>Meus Endereços</span>
          </button>

          <button class="dropdown-item" onclick="KM_APP.showSettingsNotice(); KM_APP.closeAccountDropdown();">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span>Configurações</span>
          </button>

          <div class="dropdown-divider"></div>

          <button class="dropdown-item" onclick="KM_APP.handleLogout(); KM_APP.closeAccountDropdown();" style="color: var(--color-danger);">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span>Sair da Conta</span>
          </button>
        </div>
      `;
    }

    renderMobileAccountSection();
  }

  function renderMobileAccountSection() {
    const sec = document.getElementById("mobileAccountSection");
    if (!sec || !window.KM_AUTH) return;

    const user = window.KM_AUTH.getCurrentUser();
    if (!user) {
      sec.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-grafite-muted);">Minha Conta</span>
          <button class="btn btn-primary btn-sm" onclick="KM_APP.openAuthModal('login'); KM_APP.closeMobileNav();" style="width: 100%;">
            Entrar / Criar Conta
          </button>
        </div>
      `;
    } else {
      const isAdministrator = user.role === "admin";
      sec.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <strong style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-grafite);">${user.name}</strong>
              <div style="font-size: 0.75rem; color: var(--color-grafite-muted);">${user.email}</div>
            </div>
            <span class="badge ${isAdministrator ? 'badge-grafite' : 'badge-areia'}">${isAdministrator ? 'ADMIN' : 'CLIENTE'}</span>
          </div>

          ${isAdministrator ? `
            <a href="admin.html" class="btn btn-primary btn-sm" style="background-color: var(--color-couro); border-color: var(--color-couro); color: var(--color-white); text-align: center;">
              ⚡ Gerenciar Loja
            </a>
          ` : ''}

          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm" onclick="KM_APP.openAccountDetailsModal(); KM_APP.closeMobileNav();" style="flex: 1;">
              Perfil
            </button>
            <button class="btn btn-secondary btn-sm" onclick="KM_APP.handleLogout(); KM_APP.closeMobileNav();" style="flex: 1; color: var(--color-danger); border-color: rgba(163,58,58,0.3);">
              Sair
            </button>
          </div>
        </div>
      `;
    }
  }

  function toggleAccountDropdown() {
    const dropdown = document.getElementById("accountDropdown");
    const btn = document.getElementById("accountBtn");
    if (!dropdown || !btn) return;

    const isOpen = dropdown.classList.toggle("open");
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  function closeAccountDropdown() {
    const dropdown = document.getElementById("accountDropdown");
    const btn = document.getElementById("accountBtn");
    if (dropdown) dropdown.classList.remove("open");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function openAuthModal(tab = "login") {
    switchAuthTab(tab);
    document.getElementById("authModalBackdrop").classList.add("open");
  }

  function switchAuthTab(tab) {
    const btnLogin = document.getElementById("tabBtnLogin");
    const btnReg = document.getElementById("tabBtnRegister");
    const formLogin = document.getElementById("loginForm");
    const formReg = document.getElementById("registerForm");

    if (tab === "login") {
      btnLogin.style.borderBottomColor = "var(--color-couro)";
      btnLogin.style.color = "var(--color-grafite)";
      btnReg.style.borderBottomColor = "transparent";
      btnReg.style.color = "var(--color-grafite-muted)";
      formLogin.style.display = "block";
      formReg.style.display = "none";
    } else {
      btnReg.style.borderBottomColor = "var(--color-couro)";
      btnReg.style.color = "var(--color-grafite)";
      btnLogin.style.borderBottomColor = "transparent";
      btnLogin.style.color = "var(--color-grafite-muted)";
      formReg.style.display = "block";
      formLogin.style.display = "none";
    }
  }

  function handleLoginForm(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPassword").value;

    const result = window.KM_AUTH.login(email, pass);
    if (!result.success) {
      showToast(result.error, "warning");
      return;
    }

    closeModals();
    renderAccountDropdown();
    showToast(`Bem-vindo(a), ${result.user.name}!`);
  }

  function handleRegisterForm(event) {
    event.preventDefault();
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const pass = document.getElementById("regPassword").value;
    const cep = document.getElementById("regCep").value;

    const result = window.KM_AUTH.register(name, email, pass, cep);
    if (!result.success) {
      showToast(result.error, "warning");
      return;
    }

    closeModals();
    renderAccountDropdown();
    showToast(`Conta criada com sucesso! Olá, ${result.user.name}.`);
  }

  function handleLogout() {
    window.KM_AUTH.logout();
    renderAccountDropdown();
    showToast("Você saiu da sua conta.");
  }

  function quickDemoLogin(role) {
    window.KM_AUTH.loginAsDemo(role);
    closeModals();
    renderAccountDropdown();
    showToast(`Conectado como ${role === 'admin' ? 'Administrador' : 'Cliente'}.`);
  }

  function openAccountDetailsModal() {
    const user = window.KM_AUTH.getCurrentUser();
    if (!user) {
      openAuthModal('login');
      return;
    }

    const container = document.getElementById("accountDetailsContent");
    if (container) {
      container.innerHTML = `
        <div style="background-color: var(--color-marfim); padding: 16px; border-radius: var(--radius-sm); border-left: 3px solid var(--color-couro);">
          <strong style="display: block; font-family: var(--font-serif); font-size: 1.35rem; color: var(--color-grafite);">${user.name}</strong>
          <span style="font-size: 0.85rem; color: var(--color-grafite-muted);">${user.email}</span>
          <div style="margin-top: 8px;">
            <span class="badge ${user.role === 'admin' ? 'badge-grafite' : 'badge-areia'}">Papel: ${user.role.toUpperCase()}</span>
          </div>
        </div>

        <div>
          <label class="form-label">Data de Cadastro:</label>
          <div style="font-size: 0.88rem; color: var(--color-grafite);">${user.createdAt || '2026-11-01'}</div>
        </div>

        <div>
          <label class="form-label">Endereço Principal Salvo:</label>
          <div style="padding: 12px; border: 1px solid var(--color-areia-border); border-radius: var(--radius-sm); font-size: 0.85rem; line-height: 1.6; background-color: var(--color-white);">
            Av. Djalma Batista, 1661, Apto 804<br>
            Chapada — Manaus / AM — CEP 69057-002
          </div>
        </div>

        <div style="display: flex; gap: 12px; margin-top: 12px;">
          ${user.role === 'admin' ? `
            <a href="admin.html" class="btn btn-primary" style="flex: 1; background-color: var(--color-couro); border-color: var(--color-couro); text-align: center;">⚡ Gerenciar Loja</a>
          ` : ''}
          <button class="btn btn-secondary" onclick="KM_APP.handleLogout(); KM_APP.closeModals();" style="flex: 1; color: var(--color-danger); border-color: rgba(163,58,58,0.3);">Sair da Conta</button>
        </div>
      `;
    }

    document.getElementById("accountDetailsModalBackdrop").classList.add("open");
  }

  function openAddressesModal() {
    const container = document.getElementById("addressesModalContent");
    if (container) {
      container.innerHTML = `
        <div style="padding: 16px; border: 1px solid var(--color-areia-border); border-radius: var(--radius-sm); background-color: var(--color-white);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="font-family: var(--font-serif); font-size: 1.15rem;">Residencial Principal</strong>
            <span class="badge badge-oliva" style="font-size: 0.65rem;">Padrão</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--color-grafite-soft); line-height: 1.6;">
            Av. Djalma Batista, 1661, Apto 804<br>
            Bairro Chapada — Manaus / AM<br>
            CEP 69057-002
          </p>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="KM_APP.showToast('Funcionalidade de edição de endereço salva.')" style="margin-top: 8px;">
          + Adicionar Novo Endereço
        </button>
      `;
    }
    document.getElementById("addressesModalBackdrop").classList.add("open");
  }

  function showSettingsNotice() {
    showToast("Preferências da conta salvas.");
  }

  function setActiveNavLink(clickedLink) {
    document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
    if (clickedLink) clickedLink.classList.add("active");
  }

  function checkAccessDenied() {
    if (window.location.search.includes("access_denied=1")) {
      setTimeout(() => {
        showToast("Acesso Negado: O Painel Administrativo é exclusivo para administradores autenticados.", "warning");
      }, 400);
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }

  // API Pública do Módulo
  return {
    init,
    filterCategory,
    handleSortChange,
    openQuickView,
    changeModalQty,
    addToCart,
    updateCartQuantity,
    removeCartItem,
    openCart,
    closeModals,
    closeMobileNav,
    calculateCartFreight,
    calculateModalFreight,
    orderViaWhatsApp,
    inquireProduct,
    showPolicy,
    toggleAccountDropdown,
    closeAccountDropdown,
    renderAccountDropdown,
    openAuthModal,
    switchAuthTab,
    handleLoginForm,
    handleRegisterForm,
    handleLogout,
    quickDemoLogin,
    openAccountDetailsModal,
    openAddressesModal,
    showSettingsNotice,
    setActiveNavLink
  };
})();

// Auto-inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  KM_APP.init();
});
