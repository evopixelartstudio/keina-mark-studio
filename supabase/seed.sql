-- ==============================================================================
-- KEINA MARK STUDIO — SEED DATA (PROVISIONAL REAL CATALOG)
-- ==============================================================================

-- 1. CATEGORIES
insert into public.categories (id, name, slug, description, image_url, display_order, is_active)
values
  ('11111111-1111-1111-1111-111111111101', 'Moda', 'moda', 'Vestuário autoral com recortes e grafismos contemporâneos.', '/products/camiseta-vinho-geometrica-branca.png', 1, true),
  ('11111111-1111-1111-1111-111111111102', 'Acessórios', 'acessorios', 'Bolsas, bonés e peças com texturas naturais e materiais selecionados.', '/products/bolsa-marrom-ferragens-metalicas.png', 2, true),
  ('11111111-1111-1111-1111-111111111103', 'Mobiliário', 'mobiliario', 'Cadeiras e bancos de design artesanal e formas estruturais.', '/products/cadeira-artesanal-madeira-metal.png', 3, true),
  ('11111111-1111-1111-1111-111111111104', 'Objetos e Presentes', 'objetos-e-presentes', 'Objetos expressivos, kits especiais e elementos de destaque.', '/products/kit-presente-caneca-globo.png', 4, true)
on conflict (id) do nothing;

-- 2. COLLECTIONS
insert into public.collections (id, name, slug, title, subtitle, description, banner_url, display_order, is_active)
values
  ('22222222-2222-2222-2222-222222222201', 'Peças com Identidade', 'pecas-com-identidade', 'Design com Origem', 'Uma curadoria de peças que une criatividade, expressão e design contemporâneo.', 'Seleção editorial inaugural com peças táteis, linhas orgânicas e contrastes precisos.', '/products/bolsa-marrom-ferragens-metalicas.png', 1, true)
on conflict (id) do nothing;

-- 3. STORE SETTINGS
insert into public.store_settings (key, value)
values
  ('general', '{"store_name": "Keina Mark Studio", "tagline": "Design com origem. Peças com identidade.", "contact_email": "contato@keinamarkstudio.com", "instagram": "@keinamarkstudio", "payment_status": "Não configurado", "checkout_enabled": false}'::jsonb),
  ('appearance', '{"hero_title": "Design com origem.\nPeças com identidade.", "hero_subtitle": "Uma curadoria de peças que une criatividade, expressão e design contemporâneo.", "hero_cta": "Explorar coleção", "essence_title": "A essência da Keina Mark Studio", "essence_p1": "Criada sob a inspiração de formas naturais, texturas vivas e a sofisticação da identidade amazônica, a Keina Mark Studio transcende tendências passageiras.", "essence_p2": "Cada objeto, peça de vestuário e mobiliário carrega uma narrativa própria — unindo o trabalho manual com a precisão do design contemporâneo."}'::jsonb)
on conflict (key) do update set value = excluded.value;

-- 4. SHIPPING SETTINGS
insert into public.shipping_settings (id, origin_postal_code, origin_street, origin_number, origin_neighborhood, origin_city, origin_state, provider, api_key_configured, status_message)
values
  ('33333333-3333-3333-3333-333333333301', '69900-000', 'Centro', '100', 'Centro', 'Rio Branco', 'AC', 'custom', false, 'Integração de frete preparada (Melhor Envio / Correios). Aguardando credenciais de API.')
on conflict (id) do nothing;

-- 5. INITIAL REAL PRODUCTS (12 Items)
-- Note: As stated in the briefing, client has not yet supplied final prices, confirmed weights/dimensions.
-- Therefore, is_price_on_request is true or price is null/provisional, and status is 'published' or 'draft'.

insert into public.products (
  id, name, slug, sku, category_id, price, promotional_price, is_price_on_request,
  short_description, description, material, dimensions, weight_kg, height_cm, width_cm, length_cm,
  is_bulky, stock_quantity, track_stock, is_made_to_order, production_days, status, is_featured, care_instructions
) values
  (
    '00000000-0000-0000-0000-000000000001',
    'Bolsa Estruturada com Ferragens Metálicas',
    'bolsa-marrom-ferragens-metalicas',
    'KMS-ACS-001',
    '11111111-1111-1111-1111-111111111102',
    null, null, true,
    'Bolsa em acabamento camurçado tom couro terroso com ferragens metálicas frontais em formato de bridão.',
    'Peça autoral com corte geométrico retangular, alça a tiracolo ajustável e ferragens em aço escovado com amarração tátil. Design sofisticado e atemporal com materiais nobres.',
    'Camurça natural e ferragens em liga metálica escovada',
    'A confirmar', null, null, null, null,
    false, 3, true, true, 7, 'published', true,
    'Armazenar em saco de algodão respirável, longe de umidade direta. Limpeza com escova macia específica para camurça.'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Kit Presente AC-BR Caneca & Globo Terrestre',
    'kit-presente-caneca-globo',
    'KMS-OBJ-002',
    '11111111-1111-1111-1111-111111111104',
    null, null, true,
    'Caixa rígida grafite contendo caneca cerâmica com tipografia AC-BR e mini globo geográfico decorativo.',
    'Curadoria de objetos expressivos reunidos em embalagem de alta gramatura. A caneca traz a identidade gráfica contemporânea com códigos territoriais e o globo adiciona uma nota lúdica de exploração.',
    'Cerâmica esmaltada, papelão rígido e polímero metálico',
    'Caixa: 22 x 22 x 12 cm (aprox.)', 0.850, 14, 24, 24,
    false, 5, true, false, null, 'published', true,
    'Caneca própria para micro-ondas e lava-louças. Globo decorativo para higienização a seco.'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Camiseta Vermelha com Grafismo Colunar',
    'camiseta-vermelha-geometrica',
    'KMS-MOD-003',
    '11111111-1111-1111-1111-111111111101',
    null, null, true,
    'Camiseta em algodão encorpado vermelho escarlate com serigrafia geométrica frontal contrastante.',
    'Modelagem clássica com gola canelada e estampa autoral de barras verticais e círculos pretos, evocando ritmo visual e arquitetura modernista.',
    '100% Algodão penteado sustentável',
    'Tamanhos P, M, G, GG', 0.220, 2, 25, 30,
    false, 10, true, false, null, 'published', true,
    'Lavar do avesso com água fria. Não passar ferro diretamente sobre a serigrafia.'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Cadeira Dobrável Preta com Grafismo Três Barras',
    'cadeira-preta-barras-claras',
    'KMS-MOB-004',
    '11111111-1111-1111-1111-111111111103',
    null, null, true,
    'Cadeira dobrável com estrutura metálica preta e encosto em lona técnica com grafismo de três barras.',
    'Peça versátil e com forte presença gráfica, unindo a praticidade do mobiliário dobrável à expressividade visual minimalista.',
    'Estrutura em tubo de aço com pintura eletrostática a pó e lona sintética de alta densidade',
    'A confirmar', 3.200, 80, 55, 50,
    true, 4, true, true, 10, 'published', true,
    'Limpar com pano levemente umedecido em água e sabão neutro. Guardar em local seco quando dobrada.'
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'Painel Escultural em Madeira e Metal Geométrico',
    'painel-madeira-metal-geometrico',
    'KMS-OBJ-005',
    '11111111-1111-1111-1111-111111111104',
    null, null, true,
    'Objeto de parede autoral com moldura metálica retangular e placa de madeira nobre recortada.',
    'Composição tridimensional com silhueta curvilínea vazada e linhas estruturais horizontais em metal escuro. Peça de forte apelo tátil e arquitetônico.',
    'Madeira maciça com acabamento em óleo natural e estrutura de ferro com acabamento fosco',
    'A confirmar', 2.800, 60, 40, 6,
    false, 2, true, true, 15, 'published', true,
    'Limpar com flanela seca. Evitar incidência solar direta prolongada para preservar a tonalidade natural da madeira.'
  ),
  (
    '00000000-0000-0000-0000-000000000006',
    'Camiseta Grafite Mescla Grafismo LRV',
    'camiseta-cinza-geometrica-amarela',
    'KMS-MOD-006',
    '11111111-1111-1111-1111-111111111101',
    null, null, true,
    'Camiseta cinza mescla com grafismo diagonal geométrico e polígono amarelo luminoso.',
    'Peça de toque macio e caimento fluido com estampa conceitual técnica "Saving Paint LRV", refletindo precisão gráfica e contraste contemporâneo.',
    'Algodão com mescla refinada',
    'Tamanhos P, M, G, GG', 0.210, 2, 25, 30,
    false, 8, true, false, null, 'published', true,
    'Lavar à máquina em ciclo suave. Secar à sombra.'
  ),
  (
    '00000000-0000-0000-0000-000000000007',
    'Cadeira Dobrável Preta com Geometria Angular',
    'cadeira-preta-grafismo-claro',
    'KMS-MOB-007',
    '11111111-1111-1111-1111-111111111103',
    null, null, true,
    'Cadeira dobrável em tubo preto fosco com recorte de grafismo angular em tonalidade areia no encosto.',
    'Linhas puras e contraste audacioso. O encosto em lona têxtil resistente recebe estampa serigráfica de polígono chanfrado.',
    'Aço com pintura epóxi fosca e tecido de alta tenacidade',
    'A confirmar', 3.200, 80, 55, 50,
    true, 3, true, true, 10, 'published', true,
    'Limpar com esponja macia umedecida. Não utilizar produtos abrasivos.'
  ),
  (
    '00000000-0000-0000-0000-000000000008',
    'Bolsa Tote Estampa Onça com Alça Grafite',
    'bolsa-tecido-animal-print',
    'KMS-ACS-008',
    '11111111-1111-1111-1111-111111111102',
    null, null, true,
    'Bolsa formato tote em tecido encorpado com padronagem animal print e alças em gorgurão preto.',
    'Amplo espaço interno com estrutura reforçada e detalhe de etiqueta tátil em destaque. Peça ideal para o dia a dia contemporâneo com personalidade marcante.',
    'Sarja pesada estampada e fitas de alta resistência',
    'A confirmar', 0.380, 45, 42, 10,
    false, 6, true, false, null, 'published', true,
    'Lavagem manual com sabão neutro. Não centrifugar em altas rotações.'
  ),
  (
    '00000000-0000-0000-0000-000000000009',
    'Camiseta Vinho com Grade Linear Horizontal',
    'camiseta-vinho-geometrica-branca',
    'KMS-MOD-009',
    '11111111-1111-1111-1111-111111111101',
    null, null, true,
    'Camiseta em tonalidade vinho profundo com grafismo frontal de pentagrama minimalista e pequenos marcadores.',
    'Corte confortável, gola fechada e estampa de precisão em branco ótico. A tonalidade bordô profunda harmoniza com a paleta terrosa da marca.',
    '100% Algodão sustentável fio 30.1',
    'Tamanhos P, M, G, GG', 0.220, 2, 25, 30,
    false, 7, true, false, null, 'published', true,
    'Lavar separadamente nas primeiras lavagens para preservação da intensidade da cor.'
  ),
  (
    '00000000-0000-0000-0000-000000000010',
    'Camiseta Mostarda Ocre com Grade Linear',
    'camiseta-mostarda-geometrica-branca',
    'KMS-MOD-010',
    '11111111-1111-1111-1111-111111111101',
    null, null, true,
    'Camiseta em tonalidade ocre/mostarda solar com estampa de linhas horizontais e pequenos blocos laterais.',
    'Tonalidade quente que remete à luminosidade amazônica e ao calor da terra. Malha de toque aveludado e acabamento primoroso.',
    '100% Algodão penteado com tingimento especial',
    'Tamanhos P, M, G, GG', 0.220, 2, 25, 30,
    false, 5, true, false, null, 'published', true,
    'Lavar à mão ou máquina no ciclo delicado com sabão neutro.'
  ),
  (
    '00000000-0000-0000-0000-000000000011',
    'Banco Escultural com Assento de Madeira Maciça',
    'cadeira-artesanal-madeira-metal',
    'KMS-MOB-011',
    '11111111-1111-1111-1111-111111111103',
    null, null, true,
    'Cadeira/banco artesanal com assento feito de tora maciça de madeira de origem e encosto em grade de ferro.',
    'Objeto de arte e mobiliário funcional. Cada corte de madeira preserva os veios, anéis de crescimento e casca natural, apoiado em base geométrica de metal preto com linhas desconstruídas.',
    'Tora de madeira maciça tratada e estrutura de vergalhão de aço carbono com pintura preta acetinada',
    'A confirmar (peça de grandes dimensões / frete especial)', 11.500, 85, 48, 48,
    true, 1, true, true, 20, 'published', true,
    'Hidratar periodicamente a madeira com cera de abelha ou óleo mineral puro.'
  ),
  (
    '00000000-0000-0000-0000-000000000012',
    'Boné Trucker Preto Bordado Paving Tactile',
    'bone-preto-bordado-paving-tactile',
    'KMS-ACS-012',
    '11111111-1111-1111-1111-111111111102',
    null, null, true,
    'Boné modelo trucker preto com tela traseira respirável e bordado de alto relevo frontal.',
    'O bordado traz a iconografia "Paving Tactile" em listras amarelas com barra vermelha, além de tag lateral em couro gravado a laser.',
    'Sarja de algodão, tela de poliéster e detalhe em couro natural',
    'Ajustável', 0.120, 12, 20, 22,
    false, 12, true, false, null, 'published', true,
    'Limpeza a seco ou pano úmido. Não torcer ou lavar em máquina.'
  )
on conflict (id) do nothing;

-- 6. PRODUCT IMAGES (Associated to each product)
insert into public.product_images (product_id, url, alt_text, display_order, is_primary)
values
  ('00000000-0000-0000-0000-000000000001', '/products/bolsa-marrom-ferragens-metalicas.png', 'Bolsa marrom com ferragens metálicas Keina Mark Studio', 1, true),
  ('00000000-0000-0000-0000-000000000002', '/products/kit-presente-caneca-globo.png', 'Kit presente com caneca AC-BR e globo terrestre Keina Mark Studio', 1, true),
  ('00000000-0000-0000-0000-000000000003', '/products/camiseta-vermelha-geometrica.png', 'Camiseta vermelha com estampa geométrica Keina Mark Studio', 1, true),
  ('00000000-0000-0000-0000-000000000004', '/products/cadeira-preta-barras-claras.png', 'Cadeira dobrável preta com três barras claras Keina Mark Studio', 1, true),
  ('00000000-0000-0000-0000-000000000005', '/products/painel-madeira-metal-geometrico.png', 'Painel escultural em madeira e metal Keina Mark Studio', 1, true),
  ('00000000-0000-0000-0000-000000000006', '/products/camiseta-cinza-geometrica-amarela.png', 'Camiseta cinza mescla com estampa amarela Keina Mark Studio', 1, true),
  ('00000000-0000-0000-0000-000000000007', '/products/cadeira-preta-grafismo-claro.png', 'Cadeira dobrável preta com grafismo claro Keina Mark Studio', 1, true),
  ('00000000-0000-0000-0000-000000000008', '/products/bolsa-tecido-animal-print.png', 'Bolsa de tecido estampa animal print Keina Mark Studio', 1, true),
  ('00000000-0000-0000-0000-000000000009', '/products/camiseta-vinho-geometrica-branca.png', 'Camiseta vinho com estampa geométrica Keina Mark Studio', 1, true),
  ('00000000-0000-0000-0000-000000000010', '/products/camiseta-mostarda-geometrica-branca.png', 'Camiseta mostarda com estampa geométrica Keina Mark Studio', 1, true),
  ('00000000-0000-0000-0000-000000000011', '/products/cadeira-artesanal-madeira-metal.png', 'Cadeira artesanal com assento de madeira e metal Keina Mark Studio', 1, true),
  ('00000000-0000-0000-0000-000000000012', '/products/bone-preto-bordado-paving-tactile.png', 'Boné preto com bordado Paving Tactile Keina Mark Studio', 1, true)
on conflict do nothing;

-- 7. ASSOCIATE PRODUCTS TO FEATURED COLLECTION
insert into public.collection_products (collection_id, product_id, display_order)
values
  ('22222222-2222-2222-2222-222222222201', '00000000-0000-0000-0000-000000000001', 1),
  ('22222222-2222-2222-2222-222222222201', '00000000-0000-0000-0000-000000000011', 2),
  ('22222222-2222-2222-2222-222222222201', '00000000-0000-0000-0000-000000000005', 3),
  ('22222222-2222-2222-2222-222222222201', '00000000-0000-0000-0000-000000000008', 4),
  ('22222222-2222-2222-2222-222222222201', '00000000-0000-0000-0000-000000000004', 5),
  ('22222222-2222-2222-2222-222222222201', '00000000-0000-0000-0000-000000000012', 6)
on conflict do nothing;
