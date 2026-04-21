import { DEFAULT_PALETTE, type Palette } from './types';

const WORKER_TIMEOUT_MS = 3000;

type PaletteCallback = (palette: Palette) => void;

let worker: Worker | null = null;
const callbacks: Map<string, PaletteCallback> = new Map();

const getWorker = (): Worker => {
  if (worker) return worker;

  worker = new Worker('/workers/palette.worker.js');

  worker.onmessage = ({ data: { type, palette, id } }: MessageEvent) => {
    if (type !== 'palette') return;
    callbacks.get(id)?.(palette);
    callbacks.delete(id);
  };

  worker.onerror = () => {
    // Воркер упал — резолвим все pending колбэки дефолтом и пересоздаём
    callbacks.forEach((cb) => cb(DEFAULT_PALETTE));
    callbacks.clear();
    worker = null;
  };

  return worker;
};

export const analyzeImageBitmap = (bitmap: ImageBitmap): Promise<Palette> => {
  return new Promise((resolve) => {
    const id = Math.random().toString(36).slice(2, 9);

    const timeout = setTimeout(() => {
      callbacks.delete(id);
      resolve(DEFAULT_PALETTE);
    }, WORKER_TIMEOUT_MS);

    callbacks.set(id, (palette) => {
      clearTimeout(timeout);
      resolve(palette);
    });

    const w = getWorker();
    w.postMessage({ type: 'analyze', imageBitmap: bitmap, id }, [bitmap]);
  });
};
