// Sample input parsed as an object (you can replace this with actual JSON parsing)
const input = {
  "keys": { "n": 4, "k": 3 },
  "1": { "base": "10", "value": "4" },
  "2": { "base": "2",  "value": "111" },
  "3": { "base": "10", "value": "12" },
  "6": { "base": "4",  "value": "213" }
};

// Utility: convert string in given base to integer
function fromBase(str, base) {
  const b = parseInt(base, 10);
  return parseInt(str, b);
}

// Collect roots from the provided entries in a consistent order.
// The keys "1","2","3","6" are example labels; we'll sort numerically by the key.
function collectRoots(obj) {
  const keys = Object.keys(obj).filter(k => /^\d+$/.test(k)); // numeric-like keys
  keys.sort((a, b) => Number(a) - Number(b));
  const roots = [];
  for (const k of keys) {
    const entry = obj[k];
    if (!entry || !entry.base || !entry.value) continue;
    const r = fromBase(entry.value, entry.base);
    roots.push(r);
  }
  return roots;
}

// Multiply polynomials represented as arrays of coefficients.
// coeffs[i] is coefficient for x^i. E.g., [a0, a1, a2] => a0 + a1 x + a2 x^2
function polyMul(p, q) {
  const res = new Array(p.length + q.length - 1).fill(0);
  for (let i = 0; i < p.length; i++) {
    for (let j = 0; j < q.length; j++) {
      res[i + j] += p[i] * q[j];
    }
  }
  return res;
}

// Expand monic polynomial with given roots: P(x) = ∏ (x - r_i)
// Returns coefficients in ascending powers: [c0, c1, ..., cn], where P(x) = c0 + c1 x + ... + cn x^n
function polyFromRoots(roots) {
  // Start with P0(x) = 1
  let poly = [1]; // Represents 1
  for (let i = 0; i < roots.length; i++) {
    const r = roots[i];
    // Multiply by (x - r): newPoly = poly * (x - r)
    // (a0 + a1 x + a2 x^2) * (x - r) = (-r*a0) + (a0 - r*a1) x + (a1 - r*a2) x^2 + ... but easier with convolution
    const divisor = [-r, 1]; // (-r) + (1)*x
    poly = polyMul(poly, divisor);
  }
  return poly;
}

// Pretty print polynomial coefficients from ascending to descending powers
function formatPoly(coeffs) {
  // coeffs[0] + coeffs[1] x + ...
  const terms = [];
  for (let i = coeffs.length - 1; i >= 0; i--) {
    const c = coeffs[i];
    if (Math.abs(c) < 1e-12) continue;
    const power = i;
    const term =
      power === 0 ? `${c}` :
      power === 1 ? `${c}*x` :
      `${c}*x^${power}`;
    terms.push(term);
  }
  if (terms.length === 0) return "0";
  return terms.join(" + ").replace(/\+\s-\s/g, "- "); // normalize plus/minus
}

// Main execution
(function main() {
  // Step 1: collect roots from input (convert to numbers)
  const roots = collectRoots(input);
  // Step 2: take first k roots to form polynomial P(x) 
  const k = input.keys && input.keys.k ? Number(input.keys.k) : 3;
  const selectedRoots = roots.slice(0, k);
  // Step 3: form polynomial from roots
  const coeffsAsc = polyFromRoots(selectedRoots); // ascending powers
  // Optional: convert to descending order for conventional display
  const coeffsDesc = coeffsAsc.slice().reverse();

  // Output
  console.log("Selected roots (in order):", selectedRoots);
  console.log("Polynomial coefficients (ascending, c0 + c1 x + ...):", coeffsAsc);
  console.log("Polynomial (descending power order):", coeffsDesc);
  console.log("Polynomial string (descending):");
  console.log(formatPoly(coeffsAsc.map((c, i) => c))); // rebuild string from ascending

  // If you want a JSON-friendly result:
  const result = {
    rootsUsed: selectedRoots,
    coefficientsAscending: coeffsAsc,
    coefficientsDescending: coeffsDesc,
    polynomialStringDescending: formatPoly(coeffsAsc.map((c, i) => c))
  };
  console.log("JSON result:", JSON.stringify(result, null, 2));
})();




