import type { Dictionary } from "./en";

/** Português do Brasil — escrito para leitores brasileiros, não traduzido palavra por palavra. */
export const pt: Dictionary = {
  meta: {
    title: "911 GT3 RS — Experiência Conceitual | Aklio Studio",
    description:
      "Um conceito editorial independente para o Porsche 911 GT3 RS: aerodinâmica, precisão e movimento. Desenhado e desenvolvido pela Aklio Studio.",
  },
  a11y: {
    skip: "Pular para o conteúdo",
    mainNav: "Navegação principal",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    language: "Idioma",
    languageNames: { en: "English", pt: "Português" },
    loading: "Carregando a experiência",
    skipIntro: "Pular abertura",
    newTab: "abre em uma nova aba",
    home: "GT3 RS — voltar ao topo",
  },
  nav: {
    precision: "Precisão",
    aerodynamics: "Aerodinâmica",
    showroom: "Showroom",
    details: "Detalhes",
    performance: "Desempenho",
    interior: "Interior",
  },
  image: {
    pending: "Imagem pendente",
  },
  alt: {
    heroCar: "911 GT3 RS branco em vista frontal de três quartos",
    precisionSide: "Perfil lateral do 911 GT3 RS",
    precisionBrake: "Roda dianteira e pinça de freio",
    precisionWing: "Silhueta da asa traseira contra o sol baixo",
    aeroWing: "Asa traseira em duas partes e seus suportes",
    aeroSplitter: "Splitter dianteiro e entradas de ar",
    aeroCarbon: "Trama de fibra de carbono aparente",
    performanceTrack: "911 GT3 RS em velocidade num circuito",
    interiorCockpit: "Cockpit visto do lado do passageiro",
    interiorWheel: "Volante com seletores rotativos",
    interiorSeats: "Bancos tipo concha",
    interiorClubsport: "Santo antônio e cintos atrás dos bancos",
    finaleRear: "911 GT3 RS em vista traseira três-quartos ao entardecer",
    detailRearWing: "Elementos da asa traseira e região do atuador do DRS",
    detailFrontAero: "Splitter e elementos aerodinâmicos dianteiros",
    detailWheel: "Roda e pinça de freio de seis pistões",
    detailCarbon: "Capô em fibra de carbono",
    detailDiffuser: "Difusor traseiro",
    detailCockpit: "Comandos do volante",
    detailSeat: "Banco concha em carbono",
  },
  hero: {
    eyebrow: "Geração 992 · Estudo conceitual",
    headline: "Feito onde a pista dita as regras.",
    lede: "Um estudo de downforce, precisão e contenção — o 992 GT3 RS como experiência editorial.",
    cta: "Explorar a experiência",
    scroll: "Role",
  },
  specs: {
    power: "Potência",
    sprint: "0–100 km/h",
    topSpeed: "Velocidade máxima",
    engine: "Motor",
  },
  precision: {
    eyebrow: "Precisão em movimento",
    title: "Cada milímetro tem uma função.",
    chapters: [
      {
        label: "Silhueta",
        text: "Baixo, largo e inconfundível. O perfil nasce do fluxo de ar — e só depois de todo o resto.",
      },
      {
        label: "Contato",
        text: "Pinças dianteiras de seis pistões e discos de 408 mm transformam velocidade em controle, curva após curva.",
      },
      {
        label: "Alívio",
        text: "Com um toque, o DRS achata os elementos da asa para reduzir o arrasto na reta.",
      },
    ],
  },
  aero: {
    eyebrow: "Aerodinâmica",
    title: "Ar transformado em aderência.",
    lede: "Elementos de asa com ajuste contínuo, na dianteira e na asa traseira em duas partes, trabalham como um só sistema.",
    concept: "Fluxo de ar ilustrativo — não são dados de simulação",
    facts: {
      wing: {
        title: "Asa traseira",
        text: "Pela primeira vez num Porsche de produção, a borda superior da asa traseira fica acima do teto.",
      },
      drs: {
        title: "DRS",
        text: "O primeiro Porsche de produção com sistema de redução de arrasto. Em frenagens fortes em alta velocidade, os elementos vão ao ângulo máximo.",
      },
      downforce: {
        title: "Downforce",
        text: "409 kg a 200 km/h. 860 kg a 285 km/h.",
      },
      carbon: {
        title: "Fibra de carbono",
        text: "Portas, para-lamas dianteiros, teto e capô são de plástico reforçado com fibra de carbono.",
      },
      axle: {
        title: "Eixo dianteiro",
        text: "Braços de suspensão com perfil de gota somam cerca de 40 kg de downforce na dianteira, na velocidade máxima.",
      },
    },
  },
  showroom: {
    eyebrow: "Showroom interativo",
    title: "Cinco ângulos. Uma silhueta.",
    views: {
      front34: "Dianteira ¾",
      side: "Perfil lateral",
      rear34: "Traseira ¾",
      front: "Frente",
      rear: "Traseira",
    },
    paint: "Pintura",
    paints: { white: "Branco", black: "Preto" },
    paintPending: "Imagens em produção",
    previous: "Vista anterior",
    next: "Próxima vista",
    hintKeys: "Use ← → para trocar a vista",
    hintSwipe: "Deslize para trocar a vista",
    viewsLabel: "Vistas",
    announce: "{view}, vista {index} de {total}",
    alt: "911 GT3 RS {paint}, {view}",
  },
  hotspots: {
    eyebrow: "Detalhes",
    title: "Olhe de perto.",
    lede: "Selecione um ponto do carro para abrir o detalhe. Todos os pontos também estão listados abaixo.",
    scenes: { front34: "Dianteira ¾", rear34: "Traseira ¾", cockpit: "Cockpit" },
    scenesLabel: "Ponto de vista",
    listTitle: "Todos os detalhes",
    open: "Abrir detalhe: {title}",
    close: "Fechar",
    previous: "Detalhe anterior",
    next: "Próximo detalhe",
    counter: "Detalhe {index} de {total}",
    items: {
      rearWing: {
        title: "Asa traseira e DRS",
        text: "A asa traseira em duas partes passa da linha do teto. Com o DRS, seus elementos se achatam com um toque para reduzir o arrasto; em frenagens fortes em alta velocidade, voltam ao ângulo máximo.",
      },
      frontAero: {
        title: "Aerodinâmica dianteira",
        text: "Um splitter substitui o spoiler dianteiro, e elementos de asa com ajuste contínuo equilibram a frente do carro com a asa traseira.",
      },
      wheelsBrakes: {
        title: "Rodas e freios",
        text: "Pinças monobloco de alumínio com seis pistões e discos de 408 mm na dianteira; pinças de quatro pistões e discos de 380 mm na traseira.",
      },
      carbon: {
        title: "Componentes em carbono",
        text: "Portas, para-lamas dianteiros, teto e capô são de plástico reforçado com fibra de carbono, reduzindo massa onde ela mais pesa.",
      },
      diffuser: {
        title: "Difusor traseiro",
        text: "O difusor organiza o ar que sai por baixo do carro e trabalha em conjunto com a asa logo acima.",
      },
      cockpit: {
        title: "Cockpit",
        text: "Quatro seletores rotativos e um botão de DRS no volante deixam os ajustes na ponta dos dedos de quem pilota.",
      },
      seats: {
        title: "Bancos esportivos",
        text: "Bancos tipo concha, feitos em parte de plástico reforçado com fibra de carbono, vêm de série.",
      },
    },
  },
  performance: {
    eyebrow: "Desempenho",
    title: "Números com propósito.",
    rows: {
      power: { label: "Potência", note: "386 kW" },
      sprint: { label: "0–100 km/h", note: "Câmbio PDK de sete marchas" },
      topSpeed: { label: "Velocidade máxima", note: "Atingida em sétima marcha" },
      engine: { label: "Motor", note: "Seis cilindros boxer aspirado" },
      weight: { label: "Peso em ordem de marcha", note: "Norma DIN" },
    },
    source:
      "Dados do fabricante para o 911 GT3 RS da geração 992, divulgados na estreia mundial em 2022. Os valores podem variar conforme o mercado e os equipamentos.",
  },
  interior: {
    eyebrow: "Interior",
    title: "Menos distração. Mais resposta.",
    panels: {
      cockpit: { title: "Cockpit", text: "Tudo voltado para quem pilota. Nada disputa atenção com a pista." },
      wheel: {
        title: "Volante",
        text: "Quatro seletores rotativos e um botão de DRS ao alcance dos polegares.",
      },
      seats: {
        title: "Bancos tipo concha",
        text: "Em parte de plástico reforçado com fibra de carbono, de série.",
      },
      clubsport: {
        title: "Pacote Clubsport",
        text: "Santo antônio de aço, cintos de seis pontos para o piloto e extintor de incêndio. Disponibilidade varia conforme o mercado.",
      },
    },
    dragHint: "Role para percorrer a cabine",
  },
  finale: {
    title: "Feito para a tangência.",
    lede: "Um estudo independente de forma, ar e movimento.",
    ctaShowroom: "Voltar ao showroom",
    ctaTop: "Voltar ao topo",
  },
  footer: {
    disclaimer:
      "Conceito independente desenvolvido pela Aklio Studio. Sem afiliação, endosso ou associação com a Porsche AG. Porsche, 911 e GT3 RS são marcas registradas da Dr. Ing. h.c. F. Porsche AG.",
    credit: "Conceito, design e desenvolvimento",
    source: "Fonte dos dados técnicos",
    sections: "Seções",
  },
};
