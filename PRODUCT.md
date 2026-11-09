# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router), React 19 / 18, TypeScript, Tailwind CSS, Lucide React, Radix UI primitives, Supabase (Auth, PostgreSQL with Row Level Security, Storage), Zod, React Hook Form. Prepared for Vercel deployment.

## Users

1. **Visitantes e Compradores:** Pessoas interessadas em design contemporâneo autoral, peças com identidade, moda, mobiliário e objetos com alma brasileira e referências amazônicas sutis. Buscam uma experiência de boutique sofisticada, navegação fluida, catálogo editorial e carrinho de compras funcional.
2. **Administradora (Keina Mark):** Proprietária da marca que precisa gerenciar com facilidade e autonomia o catálogo de produtos (rascunhos, publicação, fotos, dimensões para frete, variações), categorias, coleções editoriais, clientes cadastrados, pedidos futuros e configurações da loja sem necessidade de conhecimentos técnicos profundos.

## Product Purpose

Loja virtual autoral e catálogo interativo para a marca Keina Mark Studio com painel administrativo completo, cadastro/autenticação de clientes, gestão de endereços, carrinho de compras com persistência e arquitetura extensível para cálculo de frete (ViaCEP + adaptadores logísticos). Nesta etapa inicial, o pagamento online permanece intencionalmente desativado ("Em breve") enquanto o catálogo é exposto com fidelidade aos produtos reais.

## Positioning

Boutique de design contemporâneo com identidade amazônica, minimalismo sofisticado, calor e naturalidade. Não é um marketplace genérico nem artesanato folclórico/turístico caricato. Valoriza a matéria-prima, o traço autoral e as peças com personalidade única.

## Operating Context

- Aplicação web moderna, rápida e responsiva para desktop e dispositivos móveis.
- Exposição com alto protagonismo fotográfico, espaço negativo generoso e tipografia editorial.
- Operação em ambiente de produção (Vercel + Supabase Cloud) com fallback gracioso local para testes e demonstração imediata.

## Capabilities and Constraints

- **Catálogo Autoral:** Exibição dinâmica dos 12 produtos reais das fotografias do workspace (Bolsas, Camisetas, Cadeiras/Bancos artesanais, Boné, Kits de presente e Peça escultórica em madeira/metal).
- **Dados Incompletos Suportados:** Produtos podem ser salvos como rascunho com dados pendentes. Produtos sem preço cadastrado mostram "Preço sob consulta" e não permitem compra.
- **Carrinho de Compras:** Adição, remoção, alteração de quantidades, persistência no localStorage e associação de usuário, cálculo de subtotal.
- **Frete Real:** Consulta automática de CEP via ViaCEP, estrutura para cálculo de frete com dados de cubagem/peso por produto e configuração de CEP de expedição de origem; status explícito de pendência quando credenciais de transportadora não estiverem preenchidas.
- **Autenticação e Perfis:** Supabase Auth com rotas `/entrar`, `/cadastro`, `/minha-conta`, `/recuperar-senha` e gestão de múltiplos endereços de entrega.
- **Painel Administrativo (`/admin`):** Acesso restrito a administradores, dashboard com contadores reais (sem métricas financeiras inventadas), CRUD de produtos, upload/ordenação de fotos, categorias, coleções, clientes e configurações da loja.
- **Sem Pagamento Online Fictício:** Checkout financeiro não ativado; não inventar transações ou pedidos pagos fictícios.

## Brand Commitments

- **Nome Oficial:** Keina Mark Studio
- **Paleta Oficial Proposta:**
  - Marfim (`#F5F1E9` - 60% fundo principal)
  - Grafite (`#242522` - 25% textos e contrastes)
  - Couro (`#87563B` - 10% elementos secundários)
  - Verde-oliva (`#70775E` - acentos naturais discretos)
  - Areia (`#C4A476` - 5% detalhes e superfícies)
- **Tipografia Oficial:**
  - Títulos: Cormorant Garamond (elegante, editorial, serifada)
  - Textos, botões, UI e preços: Manrope (geométrica, moderna, legível)
- **Mensagem Editorial:** "Design com origem. Peças com identidade." / "Uma curadoria de peças que une criatividade, expressão e design contemporâneo."

## Evidence on Hand

- Fotografias reais em alta resolução localizadas em `assets/`:
  1. `assets/Imagem ChatGPT 8_11_2026, 17_35_35-1.png`: Bolsa marrom com ferragens metálicas
  2. `assets/Imagem ChatGPT 8_11_2026, 17_35_35-2.png`: Kit presente com caneca e globo terrestre
  3. `assets/Imagem ChatGPT 8_11_2026, 17_35_36-3.png`: Camiseta vermelha com estampa geométrica
  4. `assets/Imagem ChatGPT 8_11_2026, 17_35_37-4.png`: Cadeira preta com três barras claras no encosto
  5. `assets/Imagem ChatGPT 8_11_2026, 17_35_44-5.png`: Peça em madeira e metal com recorte geométrico
  6. `assets/Imagem ChatGPT 8_11_2026, 17_35_45-6.png`: Camiseta cinza com estampa geométrica amarela
  7. `assets/Imagem ChatGPT 8_11_2026, 17_35_48-7.png`: Cadeira preta com desenho geométrico claro
  8. `assets/Imagem ChatGPT 8_11_2026, 17_35_49-8.png`: Bolsa de tecido com estampa animal print
  9. `assets/Imagem ChatGPT 8_11_2026, 17_35_50-9.png`: Camiseta vinho com estampa geométrica branca
  10. `assets/Imagem ChatGPT 8_11_2026, 17_35_51-10.png`: Camiseta mostarda com estampa geométrica branca
  11. `assets/Banco rústico de madeira e metal.png`: Cadeira artesanal com assento de madeira e estrutura metálica
  12. `assets/Boné Preto com Bordado “PAVING TACTILE”.png`: Boné preto com bordado colorido

## Product Principles

1. **Autenticidade e Respeito aos Fatos:** Não inventar preços, avaliações, prazos de entrega ou depoimentos fictícios. Se a informação não foi fornecida, o sistema exibe estados elegantes de rascunho ou "Preço sob consulta".
2. **Experiência Editorial e Minimalista:** O design deve respirar com grandes áreas de respiro, fotografia com protagonismo absoluto e microinterações táteis e suaves.
3. **Robustez de Engenharia:** Código modular, TypeScript estrito, arquitetura desacoplada (catálogo, carrinho, frete, admin), esquemas de banco com Row Level Security e performance impecável.
4. **Prontidão Operacional:** Painel intuitivo para que a designer administre sua própria marca sem fricção técnica.
