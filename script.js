// Sample test case (as provided)
const input = {
  "keys": { "n": 4, "k": 3 },
  "1": { "base": "10", "value": "4" },
  "2": { "base": "2",  "value": "111" },
  "3": { "base": "10", "value": "12" },
  "6": { "base": "4",  "value": "213" }
};

// Base conversion (BigInt)
function fromBaseBigInt(str, baseStr) {
  const b = parseInt(baseStr, 10);
  const s = String(str).toLowerCase().trim();
  let val = 0n, B = BigInt(b);
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const d = (ch >= '0' && ch <= '9') ? (ch.charCodeAt(0) - 48) : 10 + (ch.charCodeAt(0) - 97);
    val = val * B + BigInt(d);
  }
  return val;
}

// Collect roots by sorted numeric keys
function collectRoots(obj) {
  return Object.keys(obj)
    .filter(k => /^\d+$/.test(k))
    .sort((a, b) => Number(a) - Number(b))
    .map(k => fromBaseBigInt(obj[k].value, obj[k].base));
}

// Polynomial helpers (BigInt)
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
  let poly = [1n]; // monic
  for (const r of roots) poly = polyMulBigInt(poly, [-r, 1n]); // (x - r)
  return poly; // ascending powers
}
function evalPolyAt(coeffs, x) {
  let acc = 0n;
  for (let i = coeffs.length - 1; i >= 0; i--) acc = acc * x + coeffs[i];
  return acc;
}

// Run
const rootsAll = collectRoots(input);                 // [4, 7, 12, 39]
const k = Number(input.keys.k);
const rootsFirstK = rootsAll.slice(0, k);            // [4, 7, 12]
const coeffsAsc = polyFromRootsBigInt(rootsFirstK);  // [-336, 160, -23, 1]
const coeffsDesc = [...coeffsAsc].reverse();         // [1, -23, 160, -336]

// Verify P(r) == 0 for all selected roots
const allZero = rootsFirstK.every(r => evalPolyAt(coeffsAsc, r) === 0n);

// Output
console.log("Parsed roots (sorted keys):", rootsAll.map(String));         // [ '4','7','12','39' ]
console.log("First k=3 roots:", rootsFirstK.map(String));                 // [ '4','7','12' ]
console.log("Coefficients ascending (c0..c3):", coeffsAsc.map(String));   // [ '-336','160','-23','1' ]
console.log("Coefficients descending (c3..c0):", coeffsDesc.map(String)); // [ '1','-23','160','-336' ]
console.log("P(r_i) == 0 for all selected roots:", allZero);              // true




