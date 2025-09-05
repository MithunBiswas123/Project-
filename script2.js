
const input = {  
  "keys": { "n": 10, "k": 7 },  
  "1": { "base": "6", "value": "13444211440455345511" },  
  "2": { "base": "15", "value": "aed7015a346d635" },  
  "3": { "base": "15", "value": "6aeeb69631c227c" },  
  "4": { "base": "16", "value": "e1b5e05623d881f" },  
  "5": { "base": "8", "value": "316034514573652620673" },  
  "6": { "base": "3", "value": "2122212201122002221120200210011020220200" },  
  "7": { "base": "3", "value": "20120221122211000100210021102001201112121" },  
  "8": { "base": "6", "value": "20220554335330240002224253" },  
  "9": { "base": "12", "value": "45153788322a1255483" },  
  "10": { "base": "7", "value": "1101613130313526312514143" }  
};

// Step 1: convert a string in base b (2..36) to BigInt
function fromBaseBigInt(str, baseStr) {
  const b = parseInt(baseStr, 10);
  if (!Number.isFinite(b) || b < 2 || b > 36) throw new Error(`Invalid base ${baseStr}`);
  const s = String(str).toLowerCase().trim().replace(/[^0-9a-z]/g, "");
  if (s.length === 0) return 0n;
  let val = 0n, B = BigInt(b);
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const digit = (ch >= '0' && ch <= '9')
      ? ch.charCodeAt(0) - 48
      : 10 + (ch.charCodeAt(0) - 'a'.charCodeAt(0));
    if (digit >= b) throw new Error(`Digit '${ch}' out of range for base ${baseStr}`);
    val = val * B + BigInt(digit);
  }
  return val;
}

// Step 2: collect numeric-keyed entries in increasing key order
function collectRoots(obj) {
  const keys = Object.keys(obj).filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
  const roots = [];
  for (const k of keys) {
    const { base, value } = obj[k];
    roots.push(fromBaseBigInt(value, base));
  }
  return roots;
}

// Step 3: polynomial helpers using BigInt
function polyMulBigInt(p, q) {
  const res = Array(p.length + q.length - 1).fill(0n);
  for (let i = 0; i < p.length; i++) {
    for (let j = 0; j < q.length; j++) {
      res[i + j] += p[i] * q[j];
    }
  }
  return res;
}

function polyFromRootsBigInt(roots) {
  let poly = [1n]; // constant 1
  for (const r of roots) {
    poly = polyMulBigInt(poly, [-r, 1n]); // multiply by (x - r)
  }
  return poly; // ascending powers: c0 + c1 x + ... + cn x^n
}

// Step 4: run and print results
(function main() {
  const rootsAll = collectRoots(input);
  const k = Number(input.keys.k);
  const rootsFirstK = rootsAll.slice(0, k);

  console.log("All parsed roots (1..10):");
  console.log(rootsAll.map(x => x.toString()));

  console.log("\nFirst k=7 roots (answer used):");
  console.log(rootsFirstK.map(x => x.toString()));

  // Expand polynomial for the first k roots
  const coeffsAsc = polyFromRootsBigInt(rootsFirstK);
  const coeffsDesc = [...coeffsAsc].reverse();

  console.log("\nPolynomial coefficients (ascending c0..c7):");
  console.log(coeffsAsc.map(c => c.toString()));

  console.log("\nPolynomial coefficients (descending c7..c0):");
  console.log(coeffsDesc.map(c => c.toString()));
})();
