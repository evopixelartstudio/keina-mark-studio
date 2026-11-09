/**
 * Keina Mark Studio — Painel Administrativo Oficial
 * Lógica Completa de Gestão em Vanilla JavaScript
 */

const KM_ADMIN = (function() {
  let products = [];
  let categories = [];
  let collections = [];
  let customers = [];
  let addresses = [];

  let filterSearch = "";
  let filterCategory = "all";

  function formatMoney(value) {
    if (value === null || value === undefined || isNaN(value)) {
      return "Sob Consulta";
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  }

  function showToast(msg) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<span>${msg}</span>`;
    container.appendChild(t);

    setTimeout(() => {
      t.style.opacity = "0";
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }

  function fixImagePath(path) {
    if (!path) return "public/products/banco-rustico-madeira-metal.png";
    if (path.startsWith("/")) return path.substring(1);
    return path;
  }

  function init() {
    // Verificação estrita de papel administrativo (RBAC)
    if (!window.KM_AUTH || !window.KM_AUTH.isAdmin()) {
      window.location.replace("index.html?access_denied=1");
      return;
    }

    const user = window.KM_AUTH.getCurrentUser();
    const adminNameEl = document.getElementById("adminUserName");
    if (adminNameEl && user) {
      adminNameEl.textContent = user.name;
    }

    loadData();
    populateCategorySelectors();
    updateMetrics();
    renderProductsTable();
    renderCategoriesAndCollections();
    renderCustomersTable();
    loadSettingsForm();
  }

  function logout() {
    if (window.KM_AUTH) {
      window.KM_AUTH.logout();
    }
    window.location.replace("index.html");
  }

  function loadData() {
    if (!window.KM_STORE) return;
    products = window.KM_STORE.getProducts() || [];
    categories = window.KM_STORE.getCategories() || [];
    collections = window.KM_STORE.getCollections() || [];
    customers = window.KM_STORE.getCustomers() || [];
    addresses = window.KM_STORE.getAddresses() || [];
  }

  function updateMetrics() {
    const total = products.length;
    const published = products.filter(p => p.status === "published").length;
    const drafts = products.filter(p => p.status === "draft").length;
    const inquiry = products.filter(p => p.price === null || p.price === undefined || Number(p.price) <= 0).length;
    const bulky = products.filter(p => p.is_bulky_furniture).length;

    document.getElementById("metricTotal").textContent = total;
    document.getElementById("metricPublished").textContent = published;
    document.getElementById("metricDrafts").textContent = drafts;
    document.getElementById("metricInquiry").textContent = inquiry;
    document.getElementById("metricBulky").textContent = bulky;
    document.getElementById("metricCustomers").textContent = customers.length;
  }

  function populateCategorySelectors() {
    const selectFilter = document.getElementById("adminCategoryFilter");
    const selectForm = document.getElementById("prodCategory");
    if (!selectFilter || !selectForm) return;

    selectFilter.innerHTML = `<option value="all">Todas as Categorias</option>` +
      categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");

    selectForm.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
  }

  function switchTab(tab) {
    const tabs = ["products", "categories", "customers", "settings"];
    tabs.forEach(t => {
      const sec = document.getElementById(`section${t.charAt(0).toUpperCase() + t.slice(1)}`);
      const btn = document.getElementById(`tabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
      if (sec) sec.style.display = (t === tab) ? "block" : "none";
      if (btn) {
        if (t === tab) btn.classList.add("active");
        else btn.classList.remove("active");
      }
    });
  }

  function renderProductsTable() {
    const tbody = document.getElementById("productsTableBody");
    if (!tbody) return;

    let filtered = products.slice();

    if (filterCategory !== "all") {
      filtered = filtered.filter(p => p.category_id === filterCategory);
    }

    if (filterSearch.trim() !== "") {
      const term = filterSearch.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        (p.sku || "").toLowerCase().includes(term) ||
        (p.materials || "").toLowerCase().includes(term)
      );
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--color-grafite-muted);">
            Nenhum produto encontrado com os filtros aplicados.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(p => {
      const cat = categories.find(c => c.id === p.category_id || c.slug === p.category_id);
      const catName = cat ? cat.name : "Geral";
      const hasPrice = p.price !== null && p.price !== undefined && Number(p.price) > 0;
      const isPublished = p.status === "published";
      const imageSrc = fixImagePath(p.primary_image_url);

      return `
        <tr>
          <td>
            <img src="${imageSrc}" alt="${p.name}" class="table-thumb">
          </td>
          <td>
            <strong style="display: block; font-family: var(--font-serif); font-size: 1.05rem;">${p.name}</strong>
            <span style="font-size: 0.75rem; color: var(--color-grafite-muted);">SKU: ${p.sku || "N/A"}</span>
          </td>
          <td>
            <span class="badge badge-areia" style="font-size: 0.7rem;">${catName}</span>
          </td>
          <td>
            <span style="font-weight: 600; color: ${hasPrice ? 'var(--color-grafite)' : 'var(--color-couro)'};">
              ${formatMoney(p.price)}
            </span>
          </td>
          <td>
            <span style="font-size: 0.85rem;">${p.inventory_quantity ?? 0} un.</span>
          </td>
          <td>
            <button class="badge ${isPublished ? 'badge-oliva' : 'badge-danger'}" onclick="KM_ADMIN.toggleStatus('${p.id}')" title="Clique para alterar status" style="cursor: pointer; border: none;">
              ${isPublished ? 'Publicado' : 'Rascunho'}
            </button>
          </td>
          <td style="text-align: right;">
            <div style="display: flex; gap: 6px; justify-content: flex-end;">
              <button class="btn btn-secondary btn-sm" onclick="KM_ADMIN.openEditProductModal('${p.id}')" style="padding: 5px 10px;">Editar</button>
              <button class="btn btn-secondary btn-sm" onclick="KM_ADMIN.duplicateProduct('${p.id}')" style="padding: 5px 10px;">Duplicar</button>
              <button class="btn btn-secondary btn-sm" onclick="KM_ADMIN.deleteProduct('${p.id}')" style="padding: 5px 10px; color: var(--color-danger); border-color: rgba(163,58,58,0.3);">Excluir</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function handleSearch(term) {
    filterSearch = term;
    renderProductsTable();
  }

  function handleCategoryFilter(catId) {
    filterCategory = catId;
    renderProductsTable();
  }

  function toggleStatus(productId) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    p.status = (p.status === "published") ? "draft" : "published";
    window.KM_STORE.saveProducts(products);
    updateMetrics();
    renderProductsTable();
    showToast(`Status de "${p.name}" alterado para ${p.status === 'published' ? 'Publicado' : 'Rascunho'}.`);
  }

  function duplicateProduct(productId) {
    const original = products.find(p => p.id === productId);
    if (!original) return;

    const copy = JSON.parse(JSON.stringify(original));
    copy.id = "prod-" + Date.now();
    copy.name = `${original.name} (Cópia)`;
    copy.slug = `${original.slug}-copia-${Date.now().toString().slice(-4)}`;
    copy.sku = `${original.sku || 'KM'}-COP`;
    copy.status = "draft";

    products.unshift(copy);
    window.KM_STORE.saveProducts(products);
    updateMetrics();
    renderProductsTable();
    showToast(`Peça duplicada como rascunho com sucesso.`);
  }

  function deleteProduct(productId) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    if (!confirm(`Tem certeza de que deseja remover a peça "${p.name}"?`)) {
      return;
    }

    products = products.filter(prod => prod.id !== productId);
    window.KM_STORE.saveProducts(products);
    updateMetrics();
    renderProductsTable();
    showToast(`Peça "${p.name}" removida.`);
  }

  // =========================================================================
  // MODAL DE CADASTRO E EDIÇÃO
  // =========================================================================

  function openNewProductModal() {
    document.getElementById("modalTitle").textContent = "Novo Produto";
    document.getElementById("prodEditId").value = "";
    document.getElementById("prodName").value = "";
    document.getElementById("prodSku").value = `KM-${Math.floor(1000 + Math.random() * 9000)}`;
    document.getElementById("prodPrice").value = "";
    document.getElementById("prodStock").value = "5";
    document.getElementById("prodStatus").value = "published";
    document.getElementById("prodLeadTime").value = "0";
    document.getElementById("prodDimensions").value = "";
    document.getElementById("prodWeight").value = "";
    document.getElementById("prodIsBulky").checked = false;
    document.getElementById("prodMaterials").value = "";
    document.getElementById("prodShortDesc").value = "";
    document.getElementById("prodDesc").value = "";
    document.getElementById("prodImageSelect").value = "public/products/banco-rustico-madeira-metal.png";
    document.getElementById("prodImageCustom").value = "";

    document.getElementById("productModalBackdrop").classList.add("open");
  }

  function openEditProductModal(productId) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    document.getElementById("modalTitle").textContent = "Editar Produto";
    document.getElementById("prodEditId").value = p.id;
    document.getElementById("prodName").value = p.name || "";
    document.getElementById("prodCategory").value = p.category_id || categories[0]?.id || "";
    document.getElementById("prodSku").value = p.sku || "";
    document.getElementById("prodPrice").value = p.price !== null && p.price !== undefined ? p.price : "";
    document.getElementById("prodStock").value = p.inventory_quantity ?? 5;
    document.getElementById("prodStatus").value = p.status || "published";
    document.getElementById("prodLeadTime").value = p.lead_time_days || 0;
    document.getElementById("prodDimensions").value = p.dimensions || "";
    document.getElementById("prodWeight").value = p.weight_kg || "";
    document.getElementById("prodIsBulky").checked = !!p.is_bulky_furniture;
    document.getElementById("prodMaterials").value = p.materials || "";
    document.getElementById("prodShortDesc").value = p.short_description || "";
    document.getElementById("prodDesc").value = p.description || "";
    
    const imgPath = p.primary_image_url || "";
    document.getElementById("prodImageCustom").value = imgPath;
    const select = document.getElementById("prodImageSelect");
    if (select) {
      const opt = Array.from(select.options).find(o => o.value === imgPath || o.value.includes(imgPath));
      if (opt) select.value = opt.value;
    }

    document.getElementById("productModalBackdrop").classList.add("open");
  }

  function handleImageSelect(val) {
    document.getElementById("prodImageCustom").value = val;
  }

  function closeModal() {
    document.getElementById("productModalBackdrop").classList.remove("open");
  }

  function saveProduct(event) {
    event.preventDefault();

    const editId = document.getElementById("prodEditId").value;
    const name = document.getElementById("prodName").value.trim();
    const category_id = document.getElementById("prodCategory").value;
    const sku = document.getElementById("prodSku").value.trim();
    const rawPrice = document.getElementById("prodPrice").value.trim();
    const price = rawPrice !== "" ? parseFloat(rawPrice) : null;
    const inventory_quantity = parseInt(document.getElementById("prodStock").value, 10) || 0;
    const status = document.getElementById("prodStatus").value;
    const lead_time_days = parseInt(document.getElementById("prodLeadTime").value, 10) || 0;
    const dimensions = document.getElementById("prodDimensions").value.trim();
    const weight_kg = parseFloat(document.getElementById("prodWeight").value) || null;
    const is_bulky_furniture = document.getElementById("prodIsBulky").checked;
    const materials = document.getElementById("prodMaterials").value.trim();
    const short_description = document.getElementById("prodShortDesc").value.trim();
    const description = document.getElementById("prodDesc").value.trim();
    const primary_image_url = document.getElementById("prodImageCustom").value.trim() || document.getElementById("prodImageSelect").value;

    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    if (editId) {
      // Edição
      const index = products.findIndex(p => p.id === editId);
      if (index > -1) {
        products[index] = {
          ...products[index],
          name,
          slug,
          category_id,
          sku,
          price,
          inventory_quantity,
          status,
          lead_time_days,
          dimensions,
          weight_kg,
          is_bulky_furniture,
          materials,
          short_description,
          description,
          primary_image_url
        };
        showToast("Produto atualizado com sucesso.");
      }
    } else {
      // Criação
      const newProduct = {
        id: "prod-" + Date.now(),
        name,
        slug,
        category_id,
        sku,
        price,
        inventory_quantity,
        status,
        lead_time_days,
        dimensions,
        weight_kg,
        is_bulky_furniture,
        materials,
        short_description,
        description,
        primary_image_url
      };
      products.unshift(newProduct);
      showToast("Novo produto cadastrado com sucesso!");
    }

    window.KM_STORE.saveProducts(products);
    updateMetrics();
    renderProductsTable();
    closeModal();
  }

  function resetDefaultCatalog() {
    if (confirm("Deseja restaurar o catálogo oficial inicial com as 12 peças originais? Quaisquer alterações locais serão revertidas.")) {
      products = window.KM_STORE.resetProducts();
      updateMetrics();
      renderProductsTable();
      showToast("Catálogo oficial restaurado com sucesso!");
    }
  }

  // =========================================================================
  // CATEGORIAS, CLIENTES E CONFIGURAÇÕES
  // =========================================================================

  function renderCategoriesAndCollections() {
    const catList = document.getElementById("adminCategoriesList");
    if (catList) {
      catList.innerHTML = categories.map(c => `
        <div style="display: flex; gap: 14px; align-items: center; padding: 12px; border: 1px solid var(--color-areia-border); border-radius: var(--radius-sm);">
          <img src="${fixImagePath(c.image_url)}" alt="${c.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm);">
          <div style="flex: 1;">
            <strong style="font-family: var(--font-serif); font-size: 1.15rem;">${c.name}</strong>
            <p style="font-size: 0.8rem; color: var(--color-grafite-muted);">${c.description || ""}</p>
          </div>
          <span class="badge badge-oliva">Ativa</span>
        </div>
      `).join("");
    }

    const colList = document.getElementById("adminCollectionsList");
    if (colList) {
      colList.innerHTML = collections.map(col => `
        <div style="border: 1px solid var(--color-areia-border); padding: 16px; border-radius: var(--radius-sm);">
          <span class="badge badge-areia" style="margin-bottom: 8px;">Destaque Home</span>
          <h4 style="font-size: 1.35rem; margin-top: 4px;">${col.name}</h4>
          <p style="font-size: 0.85rem; color: var(--color-grafite-muted); margin-top: 6px;">${col.subtitle || col.description}</p>
        </div>
      `).join("");
    }
  }

  function renderCustomersTable() {
    const tbody = document.getElementById("customersTableBody");
    if (!tbody) return;

    const defaultAddr = addresses[0] || {};
    const addrString = defaultAddr.street 
      ? `${defaultAddr.street}, ${defaultAddr.number} — ${defaultAddr.city}/${defaultAddr.state} (CEP ${defaultAddr.cep})`
      : "Endereço a definir";

    tbody.innerHTML = customers.map(c => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.email}</td>
        <td><span class="badge ${c.role === 'admin' ? 'badge-grafite' : 'badge-areia'}">${c.role.toUpperCase()}</span></td>
        <td>${c.createdAt || '2026-11-01'}</td>
        <td style="font-size: 0.8rem; color: var(--color-grafite-soft);">${addrString}</td>
      </tr>
    `).join("");
  }

  function loadSettingsForm() {
    const settings = window.KM_STORE.getSettings();
    const appearance = window.KM_STORE.getAppearance();

    if (settings) {
      document.getElementById("settingStoreName").value = settings.store_name || "Keina Mark Studio";
      document.getElementById("settingContactEmail").value = settings.contact_email || "contato@keinamark.com.br";
      document.getElementById("settingInstagram").value = settings.instagram_url || "@keinamarkstudio";
      document.getElementById("settingOriginCep").value = settings.origin_postal_code || "69000-000";
    }

    if (appearance) {
      document.getElementById("settingHeroTitle").value = appearance.hero_title || "";
      document.getElementById("settingHeroSubtitle").value = appearance.hero_subtitle || "";
      document.getElementById("settingEssenceText").value = appearance.essence_text || "";
    }
  }

  function saveSettingsForm(event) {
    event.preventDefault();

    const store_name = document.getElementById("settingStoreName").value.trim();
    const contact_email = document.getElementById("settingContactEmail").value.trim();
    const instagram_url = document.getElementById("settingInstagram").value.trim();
    const origin_postal_code = document.getElementById("settingOriginCep").value.trim();

    const hero_title = document.getElementById("settingHeroTitle").value.trim();
    const hero_subtitle = document.getElementById("settingHeroSubtitle").value.trim();
    const essence_text = document.getElementById("settingEssenceText").value.trim();

    window.KM_STORE.saveSettings({
      store_name,
      contact_email,
      instagram_url,
      origin_postal_code
    });

    window.KM_STORE.saveAppearance({
      hero_title,
      hero_subtitle,
      essence_text
    });

    showToast("Configurações salvas com sucesso!");
  }

  return {
    init,
    switchTab,
    handleSearch,
    handleCategoryFilter,
    toggleStatus,
    duplicateProduct,
    deleteProduct,
    openNewProductModal,
    openEditProductModal,
    handleImageSelect,
    closeModal,
    saveProduct,
    resetDefaultCatalog,
    saveSettingsForm,
    logout
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  KM_ADMIN.init();
});
