const Calc = {
  ALGO_PARAMS: {
    pow: {
      label: 'Proof of Work',
      formula: 'β·√r·e^(iθ)',
      nodes: 8,
      beta: 0.42,
      latency: 600,
      faultTol: '< 50%',
      throughput: '~7 tx/s',
      color: 0x4169e1,
      colorHex: '#4169e1',
      orbitScale: 1.2,
      phaseOffset: 0,
    },
  },
  tableRow(n) {
    return {
      n,
      sq:   n * n,
      sqrt: Math.sqrt(n).toFixed(4),
      exp:  Math.exp(n).toExponential(2),
      beta: (1 / (1 + Math.exp(-n * 0.3))).toFixed(4)
    };
  },
};
