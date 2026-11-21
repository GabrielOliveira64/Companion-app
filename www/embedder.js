// Carrega o modelo de embeddings multilíngue (paraphrase-multilingual-MiniLM-L12-v2, treinado com pt/pt-br)
// via Transformers.js. Usa os arquivos locais em www/models (offline). Se não existirem, baixa uma vez do
// Hugging Face e guarda no cache do aparelho.
import { pipeline, env } from "./vendor/transformers.min.js";

export const MODEL_ID = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";
const base = new URL("./", location.href).href;
let ext = null;
export let local = false;

async function hasLocal() {
  try {
    const r = await fetch(`${base}models/${MODEL_ID}/READY.json`);
    if (!r.ok) return false;
    await r.json();
    return true;
  } catch (e) { return false; }
}

export async function init(onProgress) {
  local = await hasLocal();
  env.allowLocalModels = true;
  env.localModelPath = base + "models/";
  env.allowRemoteModels = !local;     // com o modelo no app, nunca vai à internet
  env.useBrowserCache = !local;       // evita guardar uma 2ª cópia de 118 MB
  env.backends.onnx.wasm.wasmPaths = base + "vendor/";
  env.backends.onnx.wasm.numThreads = 1;
  ext = await pipeline("feature-extraction", MODEL_ID, {
    quantized: true,
    progress_callback: p => {
      if (onProgress && p && p.status === "progress" && /onnx/.test(p.file || "")) onProgress(Math.round(p.progress || 0));
    }
  });
}

// Retorna vetores normalizados (norma 1): cosseno = produto escalar.
export async function embed(texts) {
  if (!ext) throw new Error("Modelo não carregado");
  const out = [];
  for (let i = 0; i < texts.length; i += 4) {
    const t = await ext(texts.slice(i, i + 4), { pooling: "mean", normalize: true });
    const [n, d] = t.dims;
    for (let j = 0; j < n; j++) out.push(Array.from(t.data.slice(j * d, (j + 1) * d)));
    if (texts.length > 4) await new Promise(r => setTimeout(r, 0));
  }
  return out;
}
