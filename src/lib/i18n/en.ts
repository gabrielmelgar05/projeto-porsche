/**
 * English — the primary language. `pt.ts` must match this shape exactly
 * (`Dictionary` is derived from this object).
 */
export const en = {
  meta: {
    title: "911 GT3 RS — Concept Experience | Aklio Studio",
    description:
      "An independent editorial concept for the Porsche 911 GT3 RS: aerodynamics, precision and motion. Designed and developed by Aklio Studio.",
  },
  a11y: {
    skip: "Skip to content",
    mainNav: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    languageNames: { en: "English", pt: "Português" },
    loading: "Loading the experience",
    skipIntro: "Skip intro",
    newTab: "opens in a new tab",
    home: "GT3 RS — back to top",
  },
  nav: {
    precision: "Precision",
    aerodynamics: "Aerodynamics",
    showroom: "Showroom",
    details: "Details",
    performance: "Performance",
    interior: "Interior",
  },
  image: {
    pending: "Image pending",
  },
  /** Alt text per image id (see src/data/image-assets.ts). */
  alt: {
    heroCar: "White 911 GT3 RS in front three-quarter view",
    precisionSide: "Side profile of the 911 GT3 RS",
    precisionBrake: "Front wheel and brake calliper",
    precisionWing: "Rear wing silhouette against a low sun",
    aeroWing: "Two-part rear wing and its supports",
    aeroSplitter: "Front splitter and air intakes",
    aeroCarbon: "Exposed carbon-fibre weave",
    performanceTrack: "911 GT3 RS at speed on a circuit",
    interiorCockpit: "Cockpit seen from the passenger side",
    interiorWheel: "Steering wheel with rotary controls",
    interiorSeats: "Full bucket seats",
    interiorClubsport: "Rollover bar and harness behind the seats",
    finaleRear: "911 GT3 RS from the rear three-quarter at dusk",
    detailRearWing: "Rear wing elements and DRS actuator area",
    detailFrontAero: "Front splitter and wing elements",
    detailWheel: "Wheel and six-piston brake calliper",
    detailCarbon: "Carbon-fibre front lid",
    detailDiffuser: "Rear diffuser",
    detailCockpit: "Steering wheel controls",
    detailSeat: "Carbon full bucket seat",
  },
  hero: {
    eyebrow: "992 generation · Concept study",
    headline: "Built where the track sets the rules.",
    lede: "A study in downforce, precision and restraint — the 992 GT3 RS as an editorial experience.",
    cta: "Explore the experience",
    scroll: "Scroll",
  },
  specs: {
    power: "Power",
    sprint: "0–100 km/h",
    topSpeed: "Top speed",
    engine: "Engine",
  },
  precision: {
    eyebrow: "Precision in motion",
    title: "Every millimetre has a job.",
    chapters: [
      {
        label: "Silhouette",
        text: "Low, wide and unmistakable. The profile is shaped by airflow first, and by everything else after.",
      },
      {
        label: "Contact",
        text: "Six-piston front callipers and 408 mm discs turn speed into control, corner after corner.",
      },
      {
        label: "Release",
        text: "At the push of a button, DRS flattens the wing elements to cut drag on the straight.",
      },
    ],
  },
  aero: {
    eyebrow: "Aerodynamics",
    title: "Air, pressed into grip.",
    lede: "Continuously adjustable wing elements at the front and on the two-part rear wing work as one system.",
    concept: "Illustrative airflow — not simulation data",
    facts: {
      wing: {
        title: "Rear wing",
        text: "For the first time on a production Porsche, the upper edge of the rear wing sits higher than the roof.",
      },
      drs: {
        title: "DRS",
        text: "The first production Porsche with a drag reduction system. Under hard braking at high speed, the wing elements go to maximum.",
      },
      downforce: {
        title: "Downforce",
        text: "409 kg at 200 km/h. 860 kg at 285 km/h.",
      },
      carbon: {
        title: "Carbon fibre",
        text: "Doors, front wings, roof and front lid are made from carbon-fibre-reinforced plastic.",
      },
      axle: {
        title: "Front axle",
        text: "Teardrop-profiled wishbones add around 40 kg of front downforce at top speed.",
      },
    },
  },
  showroom: {
    eyebrow: "Interactive showroom",
    title: "Five angles. One silhouette.",
    views: {
      front34: "Front ¾",
      side: "Side profile",
      rear34: "Rear ¾",
      front: "Front",
      rear: "Rear",
    },
    paint: "Paint",
    paints: { white: "White", black: "Black" },
    paintPending: "Imagery in production",
    previous: "Previous view",
    next: "Next view",
    hintKeys: "Use ← → to change the view",
    hintSwipe: "Swipe to change the view",
    viewsLabel: "Views",
    /** `{view}`, `{index}`, `{total}` */
    announce: "{view}, view {index} of {total}",
    alt: "911 GT3 RS in {paint}, {view}",
  },
  hotspots: {
    eyebrow: "Details",
    title: "Look closer.",
    lede: "Select a point on the car to open the detail. Every point is also listed below.",
    scenes: { front34: "Front ¾", rear34: "Rear ¾", cockpit: "Cockpit" },
    scenesLabel: "Viewpoint",
    listTitle: "All details",
    open: "Open detail: {title}",
    close: "Close",
    previous: "Previous detail",
    next: "Next detail",
    /** `{index}`, `{total}` */
    counter: "Detail {index} of {total}",
    items: {
      rearWing: {
        title: "Rear wing & DRS",
        text: "The two-part rear wing rises above the roofline. With DRS, its elements flatten at the push of a button to cut drag; under hard braking at speed they return to maximum.",
      },
      frontAero: {
        title: "Front aerodynamics",
        text: "A splitter replaces the front spoiler, and continuously adjustable wing elements balance the front of the car against the rear wing.",
      },
      wheelsBrakes: {
        title: "Wheels & brakes",
        text: "Six-piston aluminium monobloc callipers with 408 mm discs at the front; four-piston callipers and 380 mm discs at the rear.",
      },
      carbon: {
        title: "Carbon components",
        text: "Doors, front wings, roof and front lid are made from carbon-fibre-reinforced plastic, saving mass where it matters most.",
      },
      diffuser: {
        title: "Rear diffuser",
        text: "The diffuser shapes the air leaving the underbody and works together with the wing above it.",
      },
      cockpit: {
        title: "Cockpit",
        text: "Four rotary controls and a DRS button on the steering wheel keep adjustments at the driver's fingertips.",
      },
      seats: {
        title: "Sports seats",
        text: "Full bucket seats, made partly from carbon-fibre-reinforced plastic, are fitted as standard.",
      },
    },
  },
  performance: {
    eyebrow: "Performance",
    title: "Numbers with a purpose.",
    rows: {
      power: { label: "Power", note: "386 kW" },
      sprint: { label: "0–100 km/h", note: "Seven-speed PDK" },
      topSpeed: { label: "Top speed", note: "Reached in seventh gear" },
      engine: { label: "Engine", note: "Naturally aspirated six-cylinder boxer" },
      weight: { label: "Kerb weight", note: "DIN" },
    },
    source:
      "Manufacturer data for the 992-generation 911 GT3 RS, published at its 2022 world premiere. Figures can vary by market and equipment.",
  },
  interior: {
    eyebrow: "Interior",
    title: "Fewer distractions. More feedback.",
    panels: {
      cockpit: {
        title: "Cockpit",
        text: "Everything faces the driver. Nothing competes with the road ahead.",
      },
      wheel: {
        title: "Steering wheel",
        text: "Four rotary controls and a DRS button, within reach of the thumbs.",
      },
      seats: {
        title: "Full bucket seats",
        text: "Partly carbon-fibre-reinforced plastic, fitted as standard.",
      },
      clubsport: {
        title: "Clubsport package",
        text: "Steel rollover bar, six-point driver belts and a fire extinguisher. Availability varies by market.",
      },
    },
    dragHint: "Scroll to move through the cabin",
  },
  finale: {
    title: "Built for the apex.",
    lede: "An independent study of form, air and motion.",
    ctaShowroom: "Back to the showroom",
    ctaTop: "Back to the top",
  },
  footer: {
    disclaimer:
      "Independent concept developed by Aklio Studio. Not affiliated with, endorsed by or associated with Porsche AG. Porsche, 911 and GT3 RS are trademarks of Dr. Ing. h.c. F. Porsche AG.",
    credit: "Concept, design & development",
    source: "Technical data source",
    sections: "Sections",
  },
};

export type Dictionary = typeof en;
