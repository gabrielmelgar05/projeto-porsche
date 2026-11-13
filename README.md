# AKLIO Studio — 911 GT3 RS

One-page automotiva editorial e interativa, criada do zero com Next.js 16.4.6, React 19, TypeScript, Tailwind CSS, GSAP, `@gsap/react`, `next-intl` e Lucide. Conceito independente, sem afiliação ou endosso da Porsche AG. Não há 3D, WebGL, backend ou banco de dados.

## Executar

Requisitos: Node.js 20.9 ou superior e NPM. A implementação foi validada com Node.js 24.22.2.

```bash
npm ci
npm run dev
```

Abra o endereço impresso pelo Next.js, normalmente `http://localhost:3000`. Se já houver um servidor antigo aberto, reinicie-o para aplicar a configuração atual.

Para produção:

```bash
npm run build
npm run start
```

Defina `NEXT_PUBLIC_SITE_URL=https://seu-dominio` no ambiente de build para que os metadados sociais usem o endereço de publicação. O fallback de desenvolvimento é `http://localhost:3000`. A implementação permanece neste repositório; não foi realizada publicação externa.

## Experiência implementada

1. **Preloader e hero:** identificação tipográfica, sequência GSAP breve, hero com `100svh`, composições próprias para desktop e mobile e CTA para o showroom.
2. **The art of precision:** layout assimétrico, fotografia arquitetônica e tipografia editorial.
3. **Showroom:** visualizador 2D, cinco perspectivas externas, quatro pinturas reais no catálogo, três vistas internas, navegação por setas, miniaturas e modal acessível.
4. **Engineered to perform:** imagem escura, aerodinâmica e especificações do GT3 RS modelo 2024, com link para a fonte oficial.
5. **Details that define it:** composição variável com fotografias de aerodinâmica, roda e carroceria.
6. **Interior experience:** cockpit em grande escala, bancos e CTA que abre o interior no showroom.
7. **Final showcase e rodapé:** encerramento cinematográfico, retorno ao showroom, crédito da AKLIO e identificação das imagens conceituais.

Header fixo com âncoras, menu mobile, fechamento por Escape, contenção de foco e retorno ao botão de origem. EN/PT completos; inglês na primeira visita, escolha persistida em `localStorage`, atualização de `html[lang]` e alternativa em memória quando o armazenamento estiver bloqueado.

## Showroom

O catálogo tipado em `src/config/vehicle.ts` contém somente arquivos existentes:

- **Pinturas:** Ice Grey Metallic, White, Black e Guards Red — opções visuais deste conceito, sem promessa de disponibilidade comercial.
- **Perspectivas externas:** dianteira ¾, perfil lateral, traseira ¾, dianteira e traseira. São 20 combinações de imagem.
- **Interior:** cockpit, bancos esportivos e detalhes. Um acabamento preto com costuras vermelhas.
- **Rodas:** um acabamento preto acetinado. O card apresenta o equipamento efetivamente fotografado; não há opções falsas de troca.

Trocar a pintura preserva a perspectiva. Entrar no interior preserva cor e último ângulo exterior. O retorno restaura esses dois valores. O CTA da seção editorial abre o cockpit sem desmontar o showroom.

`VehicleImage` mantém a imagem anterior até a próxima ser carregada e decodificada. A troca usa duas camadas e crossfade curto; a limpeza do efeito impede que solicitações antigas sobrescrevam a seleção mais recente. Falhas apresentam mensagem traduzida e nova tentativa sem apagar o último quadro válido.

O cache compartilhado armazena promessas por URL; erros são removidos para permitir retry. O visualizador é ativado próximo ao viewport. Pré-carregamento adicional limitado ao próximo ângulo e às opções focadas/apontadas. Miniaturas usam lazy loading. O conjunto completo de pinturas não é baixado ao abrir a página.

O modal usa `<dialog>`, foco inicial, ciclo de Tab/Shift+Tab, Escape, setas de teclado e restauração de foco. A galeria principal também aceita setas quando focada.

## Assets e origem

Foram feitas **32 gerações/edições com a ferramenta integrada `image_gen`**, com **31 imagens finais mantidas** no repositório. Uma primeira hero mobile foi substituída após a revisão de enquadramento. As quatro pinturas derivam das mesmas cinco imagens cinzas; não há recoloração CSS.

| Diretório                         | Quantidade | Finalidade                           |
| --------------------------------- | ---------: | ------------------------------------ |
| `public/assets/images/hero/`      |          2 | Hero desktop e hero mobile refinada  |
| `public/assets/images/editorial/` |          3 | Precision, engenharia e encerramento |
| `public/assets/images/details/`   |          3 | Aerofólio, roda e carroceria         |
| `public/assets/images/interior/`  |          3 | Cockpit, bancos e detalhe interno    |
| `public/assets/cars/gt3rs/`       |         20 | Quatro pinturas × cinco ângulos      |

As imagens finais foram inspecionadas e comprimidas em WebP. O manifesto informa o tamanho medido de cada arquivo. São representações conceituais criadas com IA; pequenos detalhes de geometria, acabamentos e marca podem diferir do automóvel de produção. Não são fotografias oficiais.

- [Manifesto completo dos assets](docs/generated-assets.json)
- [Prompts e processo de produção](docs/image-prompts.md)
- [Análise das cinco imagens, dois vídeos e páginas oficiais](docs/art-direction.md)

As referências originais não são utilizadas na produção. Geist e Geist Mono são servidas localmente e sua licença SIL OFL está em `public/assets/fonts/OFL.txt`.

## Movimento e responsividade

GSAP controla a abertura, entrada sequencial da hero, reveals de texto, máscaras de imagem, stagger dos controles, entrada do showroom e parallax discreto no desktop. As animações têm escopo e cleanup com `useGSAP` e `gsap.matchMedia`. Redimensionar a janela não reinicia o preloader. Não há scroll hijacking, pinning ou espera artificial por todas as imagens.

Com `prefers-reduced-motion`, o preloader e o movimento são dispensados e o conteúdo fica imediatamente disponível. Sem JavaScript, o conteúdo editorial inicial continua visível; os controles do showroom exigem JavaScript.

No desktop o showroom tem visualizador e painel lateral. No tablet os cards passam para uma faixa; no telefone, a imagem, miniaturas roláveis e controles têm composição própria. A hero mobile usa fotografia com espaço de segurança para recorte. As seções editoriais têm alturas proporcionais ao conteúdo e o header respeita os destinos das âncoras.

## Performance

- `next/image`, dimensões ou contêineres com proporção definida e `sizes` responsivos.
- WebP local e negociação AVIF/WebP no otimizador do Next.js.
- Hero antecipada; imagens editoriais e miniaturas com carregamento preguiçoso.
- Showroom com WebP já otimizado, `next/image unoptimized` e cache de decodificação: o preload e a imagem exibida usam a mesma URL, sem download duplicado entre original e variante otimizada.
- Fontes locais, sem dependência de requisição externa no build ou na visita.
- Nenhuma biblioteca de estado global; animações priorizam transform/opacity e reduzem custo no mobile.
- Página inicial pré-renderizada estaticamente pelo Next.js.

Não foram atribuídos scores de Lighthouse nem valores de LCP, CLS ou INP sem medição.

## Verificação

```bash
npm run typecheck
npm run lint
npm run check:assets
npm run build
```

A suíte de navegador usa Playwright e axe-core:

```bash
npx playwright install chromium
npm run test:e2e
```

Para testar um servidor de produção já iniciado:

```bash
QA_BASE_URL=http://127.0.0.1:3000 npm run test:e2e
```

Se for usado um Chrome já instalado, `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` aceita o caminho do executável. Isso é opcional e não é usado pela aplicação.

São 28 cenários, incluindo oito larguras (320, 375, 390, 430, 768, 1024, 1440 e 1920 px) em EN/PT, vinte combinações externas, interior, fullscreen, teclado, preferência de idioma, cliques concorrentes, erro/retry de imagem, carregamento seletivo, reduced motion, conteúdo sem JS e auditoria automatizada WCAG 2.2 AA. Resultados efetivamente executados constam em [docs/validation.md](docs/validation.md).

## Organização

```text
src/app/                       App Router, metadados, fontes e estilos
src/components/sections/       Seções editoriais
src/components/showroom/       Galeria, cores, interior, imagem e modal
src/components/layout/         Navegação e idioma
src/components/animations/     Orquestração GSAP / ScrollTrigger
src/config/vehicle.ts          Catálogo tipado
src/i18n/ + src/messages/      Provider next-intl e mensagens EN/PT
src/hooks/use-dialog.ts        Foco, scroll lock e ciclo de teclado
src/lib/image-cache.ts         Preload e cache de imagens
public/assets/                 Imagens e fontes efetivamente utilizadas
tests/                        Cenários de navegador
scripts/check-assets.mjs       Integridade dos assets e traduções
docs/                         Referências, geração e validação
```

## Expansões que dependem de novos assets

A troca de rodas e de estofamento exige novas matrizes fotográficas coerentes. Essas variantes não são expostas na interface atual. Para ampliar o catálogo, produza e revise os arquivos correspondentes antes de adicionar estados e controles.
