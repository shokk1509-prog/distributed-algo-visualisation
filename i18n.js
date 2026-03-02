(function(global) {
  'use strict';

  const LANGS = {
    'en-GB': {
      dim_1_label: 'Orbital View',
      dim_2_label: 'Trade-off',
      dim_3_label: 'Vector Field',
      dim_4_label: 'State Duality',
      dim_5_label: 'Quantum Orbit',
      info_nodes: 'Nodes',
      info_latency: 'Latency',
      info_fault: 'Fault tol.',
      info_throughput: 'Throughput',
      ctrl_speed: 'Speed (ω)',
      ctrl_nodes: 'Node count',
      ctrl_randomise: '↺ New Initial Values',
    },
    'de-CH': {
      dim_1_label: 'Orbitalsicht',
      dim_2_label: 'Kompromiss',
      dim_3_label: 'Vektorfeld',
      dim_4_label: 'Zustandsdualität',
      dim_5_label: 'Quantenorbital',
      info_nodes: 'Knoten',
      info_latency: 'Latenz',
      info_fault: 'Fehlertoleranz',
      info_throughput: 'Durchsatz',
      ctrl_speed: 'Geschwindigkeit (ω)',
      ctrl_nodes: 'Knotenanzahl',
      ctrl_randomise: '↺ Neue Startwerte',
    },
    'fr-CH': {
      dim_1_label: 'Vue orbitale',
      dim_2_label: 'Compromis',
      dim_3_label: 'Champ vectoriel',
      dim_4_label: 'Dualité d\'état',
      dim_5_label: 'Orbite quantique',
      info_nodes: 'Nœuds',
      info_latency: 'Latence',
      info_fault: 'Tolérance pannes',
      info_throughput: 'Débit',
      ctrl_speed: 'Vitesse (ω)',
      ctrl_nodes: 'Nombre de nœuds',
      ctrl_randomise: '↺ Nouvelles valeurs',
    },
    'fr-QC': {
      dim_1_label: 'Vue orbitale',
      dim_2_label: 'Compromis',
      dim_3_label: 'Champ vectoriel',
      dim_4_label: 'Dualité d\'état',
      dim_5_label: 'Orbite quantique',
      info_nodes: 'Nœuds',
      info_latency: 'Latence',
      info_fault: 'Tolérance aux pannes',
      info_throughput: 'Débit',
      ctrl_speed: 'Vitesse (ω)',
      ctrl_nodes: 'Nombre de nœuds',
      ctrl_randomise: '↺ Nouvelles valeurs initiales',
    },
    'it-CH': {
      dim_1_label: 'Vista orbitale',
      dim_2_label: 'Compromesso',
      dim_3_label: 'Campo vettoriale',
      dim_4_label: 'Dualità di stato',
      dim_5_label: 'Orbita quantistica',
      info_nodes: 'Nodi',
      info_latency: 'Latenza',
      info_fault: 'Tolleranza guasti',
      info_throughput: 'Throughput',
      ctrl_speed: 'Velocità (ω)',
      ctrl_nodes: 'Numero di nodi',
      ctrl_randomise: '↺ Nuovi valori iniziali',
    },
    'rm-CH': {
      dim_1_label: 'Vista orbitala',
      dim_2_label: 'Cumpromiss',
      dim_3_label: 'Camp vectorial',
      dim_4_label: 'Dualitad da stadi',
      dim_5_label: 'Orbita quantistica',
      info_nodes: 'Nuschs',
      info_latency: 'Latenza',
      info_fault: 'Toleranza da fallidas',
      info_throughput: 'Capacitad',
      ctrl_speed: 'Sveltezza (ω)',
      ctrl_nodes: 'Dumber da nuschs',
      ctrl_randomise: '↺ Novas valurs',
    },
    'nl-NL': {
      dim_1_label: 'Orbitaalweergave',
      dim_2_label: 'Afweging',
      dim_3_label: 'Vectorveld',
      dim_4_label: 'Toestandsdualiteit',
      dim_5_label: 'Kwantumbaan',
      info_nodes: 'Knooppunten',
      info_latency: 'Latentie',
      info_fault: 'Fouttolerantie',
      info_throughput: 'Doorvoer',
      ctrl_speed: 'Snelheid (ω)',
      ctrl_nodes: 'Aantal knooppunten',
      ctrl_randomise: '↺ Nieuwe beginwaarden',
    },
    'is-IS': {
      dim_1_label: 'Brautarsýn',
      dim_2_label: 'Málamiðlun',
      dim_3_label: 'Vigursvæði',
      dim_4_label: 'Tvíhyggja ástands',
      dim_5_label: 'Skammtabraut',
      info_nodes: 'Hnútar',
      info_latency: 'Seinkun',
      info_fault: 'Villuviðnám',
      info_throughput: 'Gegnumstreymi',
      ctrl_speed: 'Hraði (ω)',
      ctrl_nodes: 'Fjöldi hnúta',
      ctrl_randomise: '↺ Nýjar upphafsgildi',
    },
  };

  let currentLang = 'en-GB';

  function apply(lang) {
    currentLang = lang;
    const dict = LANGS[lang] || LANGS['en-GB'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) el.textContent = dict[key];
    });
    // 言語ボタンのactive状態
    document.querySelectorAll('.lang-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    localStorage.setItem('lang', lang);
  }

  function init() {
    const saved = localStorage.getItem('lang') || navigator.language || 'en-GB';
    const matched = Object.keys(LANGS).find(k => k === saved) || 'en-GB';
    apply(matched);

    document.querySelectorAll('.lang-tab').forEach(btn => {
      btn.addEventListener('click', () => apply(btn.dataset.lang));
    });
  }

  global.I18n = { init, apply, current: () => currentLang };

})(window);
