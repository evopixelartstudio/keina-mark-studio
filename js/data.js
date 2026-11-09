// Keina Mark Studio — Catálogo Oficial Baseado Estritamente nos 12 Itens de Assets
const INITIAL_PRODUCTS = [
  {
    "id": "kms-prod-001",
    "name": "Bolsa Estruturada com Ferragens Metálicas",
    "slug": "bolsa-marrom-ferragens-metalicas",
    "sku": "KMS-ACS-001",
    "category_id": "cat-acessorios",
    "price": null,
    "promotional_price": null,
    "inventory_quantity": 3,
    "status": "published",
    "is_made_to_order": true,
    "lead_time_days": 7,
    "dimensions": "32 x 24 x 10 cm",
    "weight_kg": 0.75,
    "is_bulky_furniture": false,
    "materials": "Camurça natural com acabamento aveludado e ferragens em liga metálica escovada",
    "short_description": "Bolsa em tom camurça terroso com ferragens frontais metálicas em formato de bridão e alça a tiracolo.",
    "description": "Peça autoral com silhueta retangular bem delineada e toque tátil acolhedor. As ferragens metálicas frontais dialogam com a rusticidade contemporânea do tom couro.",
    "primary_image_url": "public/products/bolsa-marrom-ferragens-metalicas.png",
    "images": [
      "public/products/bolsa-marrom-ferragens-metalicas.png"
    ],
    "variants": [
      {
        "name": "Tom Couro Terroso",
        "color": "Couro Natural"
      }
    ]
  },
  {
    "id": "kms-prod-002",
    "name": "Kit Presente Caneca & Globo Terrestre",
    "slug": "kit-presente-caneca-globo",
    "sku": "KMS-OBJ-002",
    "category_id": "cat-objetos",
    "price": null,
    "promotional_price": null,
    "inventory_quantity": 5,
    "status": "published",
    "is_made_to_order": false,
    "lead_time_days": 2,
    "dimensions": "Caixa: 24 x 24 x 14 cm",
    "weight_kg": 0.85,
    "is_bulky_furniture": false,
    "materials": "Cerâmica esmaltada fosca, papelão rígido de alta gramatura e polímero metálico",
    "short_description": "Caixa rígida grafite contendo caneca cerâmica com tipografia autoral e mini globo geográfico decorativo.",
    "description": "Conjunto para presente reunido em caixa especial com berço protetor em papel de seda escuro. A caneca traz a identidade gráfica contemporânea e o globo adiciona uma nota de exploração.",
    "primary_image_url": "public/products/kit-presente-caneca-globo.png",
    "images": [
      "public/products/kit-presente-caneca-globo.png"
    ],
    "variants": [
      {
        "name": "Edição Especial",
        "color": "Grafite & Cerâmica"
      }
    ]
  },
  {
    "id": "kms-prod-003",
    "name": "Camiseta Vermelha com Grafismo Geométrico",
    "slug": "camiseta-vermelha-geometrica",
    "sku": "KMS-MOD-003",
    "category_id": "cat-moda",
    "price": null,
    "promotional_price": null,
    "inventory_quantity": 8,
    "status": "published",
    "is_made_to_order": false,
    "lead_time_days": 0,
    "dimensions": "Padrão vestuário unissex (P, M, G, GG)",
    "weight_kg": 0.22,
    "is_bulky_furniture": false,
    "materials": "Meia malha 100% algodão penteado de toque macio e estamparia serigráfica à base d'água",
    "short_description": "Camiseta em tom vermelho terracota com estampa frontal geométrica de colunas contrastantes.",
    "description": "Modelagem contemporânea confortável com gola canelada e caimento fluido. O grafismo frontal explora composições lineares inspiradas na arquitetura e no desenho amazônico.",
    "primary_image_url": "public/products/camiseta-vermelha-geometrica.png",
    "images": [
      "public/products/camiseta-vermelha-geometrica.png"
    ],
    "variants": [
      {
        "name": "P",
        "size": "P"
      },
      {
        "name": "M",
        "size": "M"
      },
      {
        "name": "G",
        "size": "G"
      },
      {
        "name": "GG",
        "size": "GG"
      }
    ]
  },
  {
    "id": "kms-prod-004",
    "name": "Cadeira Dobrável Preta com Três Barras Claras",
    "slug": "cadeira-preta-barras-claras",
    "sku": "KMS-MOB-004",
    "category_id": "cat-mobiliario",
    "price": null,
    "promotional_price": null,
    "inventory_quantity": 2,
    "status": "published",
    "is_made_to_order": true,
    "lead_time_days": 15,
    "dimensions": "46 x 48 x 82 cm",
    "weight_kg": 4.8,
    "is_bulky_furniture": true,
    "materials": "Estrutura em madeira maciça com laca preta acetinada e barras de marchetaria clara",
    "short_description": "Cadeira com estrutura articulável preta e três barras horizontais em madeira clara no encosto.",
    "description": "Design funcional com mecanismo articulado preciso. O contraste entre a estrutura grafite e as barras de madeira clara cria uma peça de forte presença estética.",
    "primary_image_url": "public/products/cadeira-preta-barras-claras.png",
    "images": [
      "public/products/cadeira-preta-barras-claras.png"
    ],
    "variants": [
      {
        "name": "Preto com Madeira Clara",
        "color": "Preto / Natural"
      }
    ]
  },
  {
    "id": "kms-prod-005",
    "name": "Painel Escultural em Madeira e Metal Geométrico",
    "slug": "escultura-madeira-metal",
    "sku": "KMS-OBJ-005",
    "category_id": "cat-objetos",
    "price": null,
    "promotional_price": null,
    "inventory_quantity": 1,
    "status": "published",
    "is_made_to_order": true,
    "lead_time_days": 20,
    "dimensions": "40 x 30 x 8 cm",
    "weight_kg": 3.2,
    "is_bulky_furniture": false,
    "materials": "Bloco de madeira maciça esculpida e chapa metálica vazada com pintura eletrostática",
    "short_description": "Peça artística de mesa ou parede combinando madeira com recortes geométricos em metal.",
    "description": "Objeto tridimensional de caráter escultórico que investiga o equilíbrio entre a densidade orgânica da madeira e a precisão do recorte metálico.",
    "primary_image_url": "public/products/escultura-madeira-metal.png",
    "images": [
      "public/products/escultura-madeira-metal.png"
    ],
    "variants": [
      {
        "name": "Peça Única de Galeria",
        "color": "Madeira Natural / Grafite"
      }
    ]
  },
  {
    "id": "kms-prod-006",
    "name": "Camiseta Cinza Mescla com Grafismo Amarelo",
    "slug": "camiseta-cinza-geometrica-amarela",
    "sku": "KMS-MOD-006",
    "category_id": "cat-moda",
    "price": null,
    "promotional_price": null,
    "inventory_quantity": 6,
    "status": "published",
    "is_made_to_order": false,
    "lead_time_days": 0,
    "dimensions": "Padrão vestuário unissex (P, M, G, GG)",
    "weight_kg": 0.22,
    "is_bulky_furniture": false,
    "materials": "Malha blend algodão mescla e silk screen com pigmentos minerais de alta fixação",
    "short_description": "Camiseta cinza mescla com composição geométrica minimalista em tons de amarelo solar.",
    "description": "Paleta discreta iluminada pelo amarelo que remete à luz solar amazônica. Corte reto com acabamento pespontado de alta resistência.",
    "primary_image_url": "public/products/camiseta-cinza-geometrica-amarela.png",
    "images": [
      "public/products/camiseta-cinza-geometrica-amarela.png"
    ],
    "variants": [
      {
        "name": "P",
        "size": "P"
      },
      {
        "name": "M",
        "size": "M"
      },
      {
        "name": "G",
        "size": "G"
      },
      {
        "name": "GG",
        "size": "GG"
      }
    ]
  },
  {
    "id": "kms-prod-007",
    "name": "Cadeira Dobrável Preta com Grafismo Claro",
    "slug": "cadeira-preta-grafismo-claro",
    "sku": "KMS-MOB-007",
    "category_id": "cat-mobiliario",
    "price": null,
    "promotional_price": null,
    "inventory_quantity": 2,
    "status": "published",
    "is_made_to_order": true,
    "lead_time_days": 15,
    "dimensions": "46 x 48 x 82 cm",
    "weight_kg": 4.8,
    "is_bulky_furniture": true,
    "materials": "Madeira maciça usinada, ferragens de articulação em aço e acabamento acetinado fosco",
    "short_description": "Cadeira articulável grafite com encosto em ripas verticais e linhas gráficas recortadas.",
    "description": "Variação do modelo dobrável com detalhe de grafismo linear estilizado no encosto, trazendo leveza visual e ventilação ao corpo da peça.",
    "primary_image_url": "public/products/cadeira-preta-grafismo-claro.png",
    "images": [
      "public/products/cadeira-preta-grafismo-claro.png"
    ],
    "variants": [
      {
        "name": "Grafite Acetinado",
        "color": "Preto / Madeira Natural"
      }
    ]
  },
  {
    "id": "kms-prod-008",
    "name": "Bolsa Tote em Tecido Estampa Animal Print",
    "slug": "bolsa-tecido-animal-print",
    "sku": "KMS-ACS-008",
    "category_id": "cat-acessorios",
    "price": null,
    "promotional_price": null,
    "inventory_quantity": 4,
    "status": "published",
    "is_made_to_order": false,
    "lead_time_days": 3,
    "dimensions": "42 x 38 x 12 cm",
    "weight_kg": 0.42,
    "is_bulky_furniture": false,
    "materials": "Lona encorpada de algodão com estampa padronizada e alças reforçadas em cadarço grafite",
    "short_description": "Bolsa tipo sacola ampla em tecido estruturado com padronagem animal print e alças grafite.",
    "description": "Amplo espaço interno ideal para uso urbano cotidiano. O contraste entre a textura da estampa e a sobriedade das alças grafite equilibra força e elegância.",
    "primary_image_url": "public/products/bolsa-tecido-animal-print.png",
    "images": [
      "public/products/bolsa-tecido-animal-print.png"
    ],
    "variants": [
      {
        "name": "Estampa Onça",
        "color": "Areia / Grafite / Couro"
      }
    ]
  },
  {
    "id": "kms-prod-009",
    "name": "Camiseta Vinho com Grade Linear Branca",
    "slug": "camiseta-vinho-geometrica-branca",
    "sku": "KMS-MOD-009",
    "category_id": "cat-moda",
    "price": null,
    "promotional_price": null,
    "inventory_quantity": 7,
    "status": "published",
    "is_made_to_order": false,
    "lead_time_days": 0,
    "dimensions": "Padrão vestuário unissex (P, M, G, GG)",
    "weight_kg": 0.22,
    "is_bulky_furniture": false,
    "materials": "100% algodão penteado 30.1 de fiação nobre e estampa frontal em serigrafia de alta definição",
    "short_description": "Camiseta em tom vinho profundo com estampa central de grade geométrica em linhas brancas.",
    "description": "O tom vinho sofisticado serve de fundo para um reticulado gráfico minimalista. Caimento impecável que valoriza a silhueta com extremo conforto térmico.",
    "primary_image_url": "public/products/camiseta-vinho-geometrica-branca.png",
    "images": [
      "public/products/camiseta-vinho-geometrica-branca.png"
    ],
    "variants": [
      {
        "name": "P",
        "size": "P"
      },
      {
        "name": "M",
        "size": "M"
      },
      {
        "name": "G",
        "size": "G"
      },
      {
        "name": "GG",
        "size": "GG"
      }
    ]
  },
  {
    "id": "kms-prod-010",
    "name": "Camiseta Mostarda com Grade Geométrica",
    "slug": "camiseta-mostarda-geometrica-branca",
    "sku": "KMS-MOD-010",
    "category_id": "cat-moda",
    "price": null,
    "promotional_price": null,
    "inventory_quantity": 5,
    "status": "published",
    "is_made_to_order": false,
    "lead_time_days": 0,
    "dimensions": "Padrão vestuário unissex (P, M, G, GG)",
    "weight_kg": 0.22,
    "is_bulky_furniture": false,
    "materials": "100% algodão penteado com tingimento reativo cor mostarda e estampa em toque zero",
    "short_description": "Camiseta em tom ocre mostarda com estampa frontal de grade geométrica em traços brancos.",
    "description": "Cor quente e terrosa que remete à argila e às tardes da floresta. O desenho ortogonal central confere dinamismo e sofisticação à peça.",
    "primary_image_url": "public/products/camiseta-mostarda-geometrica-branca.png",
    "images": [
      "public/products/camiseta-mostarda-geometrica-branca.png"
    ],
    "variants": [
      {
        "name": "P",
        "size": "P"
      },
      {
        "name": "M",
        "size": "M"
      },
      {
        "name": "G",
        "size": "G"
      },
      {
        "name": "GG",
        "size": "GG"
      }
    ]
  },
  {
    "id": "kms-prod-011",
    "name": "Banco Rústico em Madeira Maciça e Metal",
    "slug": "banco-rustico-madeira-metal",
    "sku": "KMS-MOB-011",
    "category_id": "cat-mobiliario",
    "price": null,
    "promotional_price": null,
    "inventory_quantity": 1,
    "status": "published",
    "is_made_to_order": true,
    "lead_time_days": 25,
    "dimensions": "95 x 35 x 45 cm",
    "weight_kg": 14.5,
    "is_bulky_furniture": true,
    "materials": "Pranchão de madeira maciça nobre com veios preservados e base estrutural em aço carbono forjado",
    "short_description": "Banco com prancha escultural em madeira maciça e pés metálicos com reforço industrial e amarração artesanal.",
    "description": "Peça protagonista do mobiliário autoral Keina Mark Studio. Revela a força escultórica da madeira em estado puro unida à rigidez arquitetônica do metal preto fosco.",
    "primary_image_url": "public/products/banco-rustico-madeira-metal.png",
    "images": [
      "public/products/banco-rustico-madeira-metal.png"
    ],
    "variants": [
      {
        "name": "Madeira Maciça Natural",
        "color": "Madeira Nobre / Aço Preto"
      }
    ]
  },
  {
    "id": "kms-prod-012",
    "name": "Boné Preto com Bordado \"PAVING TACTILE\"",
    "slug": "bone-preto-bordado-paving-tactile",
    "sku": "KMS-ACS-012",
    "category_id": "cat-acessorios",
    "price": null,
    "promotional_price": null,
    "inventory_quantity": 6,
    "status": "published",
    "is_made_to_order": false,
    "lead_time_days": 0,
    "dimensions": "Tamanho único ajustável com fecho snapback",
    "weight_kg": 0.14,
    "is_bulky_furniture": false,
    "materials": "Sarja premium de algodão peletizado e bordado em relevo com linhas de poliéster de alto brilho",
    "short_description": "Boné preto clássico com aba curva e bordado frontal multicolorido em tipografia autoral.",
    "description": "Acessório urbano contemporâneo com caimento estruturado e fita interna acolchoada anti-suor. O bordado frontal de alta precisão adiciona vibração cromática elegante.",
    "primary_image_url": "public/products/bone-preto-bordado-paving-tactile.png",
    "images": [
      "public/products/bone-preto-bordado-paving-tactile.png"
    ],
    "variants": [
      {
        "name": "Tamanho Único Ajustável",
        "color": "Preto Fosco"
      }
    ]
  }
];
const INITIAL_CATEGORIES = [
  {
    "id": "cat-moda",
    "name": "Moda",
    "slug": "moda",
    "description": "Vestuário autoral com cortes contemporâneos e grafismos geométricos marcantes.",
    "image_url": "public/products/camiseta-vinho-geometrica-branca.png",
    "order": 1
  },
  {
    "id": "cat-acessorios",
    "name": "Acessórios",
    "slug": "acessorios",
    "description": "Bolsas em materiais nobres, bonés e peças com personalidade tátil para o cotidiano.",
    "image_url": "public/products/bolsa-marrom-ferragens-metalicas.png",
    "order": 2
  },
  {
    "id": "cat-mobiliario",
    "name": "Mobiliário",
    "slug": "mobiliario",
    "description": "Bancos e cadeiras autorais que equilibram madeira maciça e estruturas metálicas.",
    "image_url": "public/products/banco-rustico-madeira-metal.png",
    "order": 3
  },
  {
    "id": "cat-objetos",
    "name": "Objetos e Presentes",
    "slug": "objetos-e-presentes",
    "description": "Kits especiais e objetos escultóricos com expressão artística e afeto.",
    "image_url": "public/products/kit-presente-caneca-globo.png",
    "order": 4
  }
];
const INITIAL_COLLECTIONS = [
  {
    "id": "col-1",
    "name": "Peças com Identidade",
    "slug": "pecas-com-identidade",
    "subtitle": "Seleção curada de peças que unem criatividade, expressão e design contemporâneo.",
    "description": "Uma imersão nas formas, texturas e contrastes que definem o olhar autoral da Keina Mark Studio.",
    "banner_url": "public/products/banco-rustico-madeira-metal.png",
    "productIds": [
      "kms-prod-001",
      "kms-prod-004",
      "kms-prod-005",
      "kms-prod-008",
      "kms-prod-011"
    ],
    "is_featured": true
  }
];
const INITIAL_STORE_SETTINGS = {
  "store_name": "Keina Mark Studio",
  "logo_text": "KEINA MARK STUDIO",
  "contact_email": "contato@keinamark.com.br",
  "contact_phone": "(A definir pela administradora)",
  "instagram_url": "@keinamarkstudio",
  "origin_postal_code": "69000-000",
  "origin_city": "Manaus",
  "origin_state": "AM",
  "payment_configured": false,
  "carrier_configured": false
};
const INITIAL_APPEARANCE_SETTINGS = {
  "hero_title": "Design com origem.\nPeças com identidade.",
  "hero_subtitle": "Uma curadoria de peças que une criatividade, expressão e design contemporâneo. Peças que valorizam matérias-primas nobres e a alma autoral brasileira.",
  "hero_cta": "Explorar Coleção",
  "hero_image_url": "public/Hero.png",
  "essence_title": "A essência da Keina Mark Studio",
  "essence_text": "A Keina Mark Studio propõe um diálogo autoral entre o design contemporâneo e a alma brasileira. Em cada peça — do grafismo geométrico no vestuário ao encontro rústico entre madeira maciça e metal — há um compromisso genuíno com a originalidade, o calor dos materiais naturais e o tempo da boa criação. Não produzimos em massa: criamos objetos com personalidade para quem reconhece a força do design com raiz."
};
const INITIAL_CUSTOMERS = [
  {
    "id": "usr-admin",
    "name": "Keina Mark",
    "email": "keina@keinamark.com.br",
    "role": "admin",
    "createdAt": "2026-11-01"
  },
  {
    "id": "usr-client",
    "name": "Cliente Exemplo",
    "email": "cliente@keinamark.com.br",
    "role": "customer",
    "createdAt": "2026-11-05"
  }
];
const INITIAL_ADDRESSES = [
  {
    "id": "addr-1",
    "title": "Residencial Principal",
    "cep": "69057-002",
    "street": "Av. Djalma Batista",
    "number": "1661",
    "complement": "Apto 804",
    "neighborhood": "Chapada",
    "city": "Manaus",
    "state": "AM",
    "isDefault": true
  }
];

(function() {
  const root = (typeof window !== 'undefined') ? window : globalThis;
  const STORAGE_KEYS = {
    PRODUCTS: 'kms_products_v4_strict12',
    CATEGORIES: 'kms_categories_v4_strict12',
    COLLECTIONS: 'kms_collections_v4_strict12',
    SETTINGS: 'kms_settings_v4_strict12',
    APPEARANCE: 'kms_appearance_v5_hero',
    CUSTOMERS: 'kms_customers_v4_strict12',
    ADDRESSES: 'kms_addresses_v4_strict12',
    CART: 'kms_cart_v4_strict12'
  };

  function getStored(key, fallback) {
    try {
      if (typeof localStorage === 'undefined') return fallback;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function setStored(key, val) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  // Seed sempre inicial com os 12 itens
  if (typeof localStorage !== 'undefined') {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) setStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) setStored(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    if (!localStorage.getItem(STORAGE_KEYS.COLLECTIONS)) setStored(STORAGE_KEYS.COLLECTIONS, INITIAL_COLLECTIONS);
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) setStored(STORAGE_KEYS.SETTINGS, INITIAL_STORE_SETTINGS);
    if (!localStorage.getItem(STORAGE_KEYS.APPEARANCE)) setStored(STORAGE_KEYS.APPEARANCE, INITIAL_APPEARANCE_SETTINGS);
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) setStored(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    if (!localStorage.getItem(STORAGE_KEYS.ADDRESSES)) setStored(STORAGE_KEYS.ADDRESSES, INITIAL_ADDRESSES);
  }

  root.KM_STORE = {
    getProducts: () => getStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS),
    saveProducts: (p) => { setStored(STORAGE_KEYS.PRODUCTS, p); if (root.dispatchEvent) root.dispatchEvent(new Event('kms_products_changed')); },
    resetProducts: () => { setStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS); if (root.dispatchEvent) root.dispatchEvent(new Event('kms_products_changed')); return INITIAL_PRODUCTS; },

    getCategories: () => getStored(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES),
    saveCategories: (c) => setStored(STORAGE_KEYS.CATEGORIES, c),

    getCollections: () => getStored(STORAGE_KEYS.COLLECTIONS, INITIAL_COLLECTIONS),
    saveCollections: (col) => setStored(STORAGE_KEYS.COLLECTIONS, col),

    getSettings: () => getStored(STORAGE_KEYS.SETTINGS, INITIAL_STORE_SETTINGS),
    saveSettings: (s) => setStored(STORAGE_KEYS.SETTINGS, s),

    getAppearance: () => getStored(STORAGE_KEYS.APPEARANCE, INITIAL_APPEARANCE_SETTINGS),
    saveAppearance: (a) => setStored(STORAGE_KEYS.APPEARANCE, a),

    getCustomers: () => getStored(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS),
    saveCustomers: (cu) => setStored(STORAGE_KEYS.CUSTOMERS, cu),

    getAddresses: () => getStored(STORAGE_KEYS.ADDRESSES, INITIAL_ADDRESSES),
    saveAddresses: (ad) => setStored(STORAGE_KEYS.ADDRESSES, ad),

    getCart: () => getStored(STORAGE_KEYS.CART, []),
    saveCart: (cart) => { setStored(STORAGE_KEYS.CART, cart); if (root.dispatchEvent) root.dispatchEvent(new Event('kms_cart_changed')); },
    clearCart: () => { setStored(STORAGE_KEYS.CART, []); if (root.dispatchEvent) root.dispatchEvent(new Event('kms_cart_changed')); }
  };

  root.KM_INITIAL = {
    INITIAL_CATEGORIES,
    INITIAL_COLLECTIONS,
    INITIAL_PRODUCTS,
    INITIAL_STORE_SETTINGS,
    INITIAL_APPEARANCE_SETTINGS,
    INITIAL_CUSTOMERS,
    INITIAL_ADDRESSES
  };
})();
