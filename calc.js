// calc.js — mathjs calculations

const Calc = {

  beta(n) {
    return 1 / (1 + Math.exp(-n * 0.3));
  },

  sqrtDist(r) {
    return Math.sqrt(r);
  },

  eulerPoint(r, theta, tilt = 0) {
    const rho = Calc.beta(r) * Math.sqrt(Math.max(r, 0.001));
    return {
      x: rho * Math.cos(theta),
      y: rho * Math.sin(theta) * Math.sin(tilt),
      z: rho * Math.sin(theta) * Math.cos(tilt)
    };
  },

  poly4(p, x) {
    return p.a * Math.pow(x, 4)
         + p.b * Math.pow(x, 3)
         + p.c * Math.pow(x, 2)
         + p.d * x
         + p.e;
  },

  vectorField(x, z, t) {
    const theta = (x + z) * 0.02 + t;
    return {
      x: Math.cos(theta) * 15,
      y: Math.abs(Math.sin(theta)) * 15 + 2,
      z: Math.sin(theta) * 8
    };
  },

  gossipSIR(N, beta, lambda, t) {
    return N * (1 - Math.exp(-beta * lambda * t));
  },

  casperFinality(votes, validators) {
    return votes > (2 / 3) * validators;
  },

  powDifficulty(zeros) {
    return Math.pow(16, zeros);
  },

  tableRow(n) {
    return {
      n,
      sq:   n * n,
      sqrt: Math.sqrt(n).toFixed(4),
      exp:  Math.exp(n).toExponential(2),
      beta: Calc.beta(n).toFixed(4)
    };
  },

  orbitalDensity(type, theta, phi) {
    switch(type) {
      case 's': return 1.0;
      case 'p': return Math.abs(Math.cos(theta));
      case 'd': return Math.abs(Math.cos(2 * theta));
      default:  return 1.0;
    }
  },

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
    pbft: {
      label: 'PBFT',
      formula: 'β·n²·e^(iθ)',
      nodes: 16,
      beta: 0.67,
      latency: 120,
      faultTol: '< 33%',
      throughput: '~10k tx/s',
      color: 0x4169e1,
      colorHex: '#4169e1',
      orbitScale: 0.8,
      phaseOffset: Math.PI / 4,
    },
    raft: {
      label: 'Raft',
      formula: 'β·√n·e^(iωt)',
      nodes: 5,
      beta: 0.55,
      latency: 80,
      faultTol: '< 50%',
      throughput: '~50k tx/s',
      color: 0x4169e1,
      colorHex: '#4169e1',
      orbitScale: 0.6,
      phaseOffset: Math.PI / 3,
    },
    casper: {
      label: 'Casper FFG',
      formula: 'β·eⁿ·|ψ|²',
      nodes: 32,
      beta: 0.79,
      latency: 200,
      faultTol: '< 33%',
      throughput: '~1k tx/s',
      color: 0x4169e1,
      colorHex: '#4169e1',
      orbitScale: 1.5,
      phaseOffset: Math.PI / 6,
    },
    gossip: {
      label: 'Gossip Protocol',
      formula: 'β·log(n)·e^(iθ)',
      nodes: 24,
      beta: 0.33,
      latency: 400,
      faultTol: 'Eventual',
      throughput: '~100k msg/s',
      color: 0x4169e1,
      colorHex: '#4169e1',
      orbitScale: 1.8,
      phaseOffset: Math.PI / 2,
    },
  },
};
