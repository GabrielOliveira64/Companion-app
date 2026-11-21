// Prepara os arquivos de execução do modelo dentro de www/ (rode antes de `npx cap sync`).
//   npm install && npm run setup
// --vendor-only : só copia a biblioteca (sem baixar o modelo).
import { mkdirSync, copyFileSync, existsSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const vendorOnly = process.argv.includes("--vendor-only");
const dist = "node_modules/@xenova/transformers/dist";
const MODEL = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";
const HF = process.env.HF_BASE || "https://huggingface.co";

mkdirSync("www/vendor", { recursive: true });
for (const f of ["transformers.min.js", "ort-wasm-simd.wasm", "ort-wasm.wasm"]) {
  if (!existsSync(join(dist, f))) throw new Error(`Não achei ${join(dist, f)} (rode npm install).`);
  copyFileSync(join(dist, f), join("www/vendor", f));
  console.log("vendor:", f);
}
if (vendorOnly) process.exit(0);

const files = [
  ["config.json", true, 100],
  ["tokenizer.json", true, 1e6],
  ["tokenizer_config.json", false, 2],
  ["onnx/model_quantized.onnx", true, 50e6],
];
for (const [f, required, minBytes] of files) {
  const dest = join("www/models", MODEL, f);
  if (existsSync(dest) && statSync(dest).size >= minBytes) { console.log("ok (já existe):", f); continue; }
  mkdirSync(dirname(dest), { recursive: true });
  const url = `${HF}/${MODEL}/resolve/main/${f}`;
  const r = await fetch(url, { redirect: "follow" });
  if (!r.ok) {
    if (required) throw new Error(`Falha ao baixar ${url}: HTTP ${r.status}`);
    console.warn("opcional, ignorado:", f, r.status); continue;
  }
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < minBytes) throw new Error(`${f} veio pequeno demais (${buf.length} bytes) — download inválido.`);
  writeFileSync(dest, buf);
  console.log("baixado:", f, (buf.length / 1e6).toFixed(1) + " MB");
}

// Marcador: só existe se TODOS os arquivos obrigatórios estão completos (o app confere isso).
writeFileSync(join("www/models", MODEL, "READY.json"), JSON.stringify({ model: MODEL, at: new Date().toISOString() }));
console.log("modelo pronto.");
