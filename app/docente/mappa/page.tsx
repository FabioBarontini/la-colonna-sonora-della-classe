"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Music2, Users, X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

type Song = {
  id: string;
  studente_id: string | null;
  student_name: string;
  classe: string;
  titolo: string;
  artista: string;
};

type Pair = {
  a: string;
  b: string;
  n: number;
  titles: string[];
};

type Position = {
  n: string;
  x: number;
  y: number;
};

function norm(value: string | null | undefined) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function createLayout(names: string[], pairs: Pair[]): Position[] {
  const count = names.length;
  if (!count) return [];
  if (count === 1) return [{ n: names[0], x: 50, y: 50 }];

  // A wider, more open grid avoids the old "spaghetti" effect.
  const columns = Math.max(2, Math.ceil(Math.sqrt(count * 1.15)));
  const rows = Math.ceil(count / columns);

  const left = 10;
  const right = 90;
  const top = 10;
  const bottom = 90;

  const positions: Position[] = names.map((name, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    const items =
      row === rows - 1 ? count - row * columns : columns;

    const rowWidth = items <= 1 ? 0 : (right - left) / (items - 1);
    const y =
      rows === 1
        ? 50
        : top + (bottom - top) * (row / Math.max(1, rows - 1));

    const x = items <= 1 ? 50 : left + col * rowWidth;

    // Alternate the rows slightly so vertical connections don't pile up.
    const stagger = row % 2 === 0 ? -1.5 : 1.5;

    return {
      n: name,
      x: Math.max(7, Math.min(93, x + stagger)),
      y: Math.max(8, Math.min(92, y)),
    };
  });

  const edges = new Map<string, number>();
  pairs.forEach((p) => {
    edges.set(`${p.a}|||${p.b}`, p.n);
    edges.set(`${p.b}|||${p.a}`, p.n);
  });

  // Small repulsion pass.
  for (let it = 0; it < 55; it++) {
    const force = positions.map(() => ({ x: 0, y: 0 }));

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const a = positions[i];
        const b = positions[j];

        let dx = a.x - b.x;
        let dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.01;

        const minDistance = 13;

        if (d < minDistance) {
          const strength = ((minDistance - d) / minDistance) * 0.75;
          dx /= d;
          dy /= d;

          force[i].x += dx * strength;
          force[i].y += dy * strength;
          force[j].x -= dx * strength;
          force[j].y -= dy * strength;
        }

        // Connected nodes can stay a little closer, but never force them
        // together aggressively.
        const common = edges.get(`${a.n}|||${b.n}`) || 0;
        if (common > 0 && d > 24) {
          const strength = Math.min(common, 4) * 0.006;
          force[i].x += (b.x - a.x) * strength;
          force[i].y += (b.y - a.y) * strength;
          force[j].x += (a.x - b.x) * strength;
          force[j].y += (a.y - b.y) * strength;
        }
      }
    }

    positions.forEach((p, i) => {
      p.x = Math.max(7, Math.min(93, p.x + force[i].x));
      p.y = Math.max(8, Math.min(92, p.y + force[i].y));
    });
  }

  return positions;
}

export default function MapPage() {
  const searchParams = useSearchParams();
  const selectedClass = searchParams.get("classe")?.trim() || "";

  const [songs, setSongs] = useState<Song[]>([]);
  const [
    selected,
    setSelected,
  ] = useState<
    { name: string; songs: string[] } |
    { a: string; b: string; titles: string[] } |
    null
  >(null);

  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!selectedClass) {
      setSongs([]);
      return;
    }

    fetch(
      `/api/class/songs?classe=${encodeURIComponent(selectedClass)}`,
      { cache: "no-store" }
    )
      .then((r) => r.json())
      .then((d) => setSongs(Array.isArray(d.songs) ? d.songs : []))
      .catch(() => setSongs([]));
  }, [selectedClass]);

  const names = useMemo(
    () =>
      [...new Set(
        songs
          .map((s) => (s.student_name || "").trim())
          .filter(Boolean)
      )],
    [songs]
  );

  const pairs = useMemo<Pair[]>(() => {
    const out: Pair[] = [];

    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        const a = songs.filter(
          (s) => s.student_name === names[i]
        );
        const b = songs.filter(
          (s) => s.student_name === names[j]
        );

        const bm = new Map(
          b
            .filter((s) => s.titolo)
            .map((s) => [norm(s.titolo), s.titolo])
        );

        const common = [
          ...new Set(
            a
              .map((s) => bm.get(norm(s.titolo)))
              .filter(Boolean) as string[]
          ),
        ];

        if (common.length) {
          out.push({
            a: names[i],
            b: names[j],
            n: common.length,
            titles: common,
          });
        }
      }
    }

    return out;
  }, [songs, names]);

  const positions = useMemo(
    () => createLayout(names, pairs),
    [names, pairs]
  );

  const getPos = (name: string) =>
    positions.find((p) => p.n === name);

  const songsFor = (name: string) =>
    songs.filter((s) => s.student_name === name);

  function path(
    A: Position,
    B: Position,
    index: number
  ) {
    const dx = B.x - A.x;
    const dy = B.y - A.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;

    const nx = -dy / d;
    const ny = dx / d;

    const curve =
      Math.min(5.5, d * 0.11) *
      (index % 2 === 0 ? 1 : -1);

    const cx = (A.x + B.x) / 2 + nx * curve;
    const cy = (A.y + B.y) / 2 + ny * curve;

    return `M ${A.x} ${A.y} Q ${cx} ${cy} ${B.x} ${B.y}`;
  }

  return (
    <main className="min-h-screen py-8 md:py-10">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="eyebrow">
            Area docente · Mappa musicale
          </div>

          <div className="flex items-center gap-2">
            {selectedClass && (
              <div className="pill">
                <Users size={13} />
                {selectedClass}
              </div>
            )}

            <Link
              href={
                selectedClass
                  ? `/docente/classe?classe=${encodeURIComponent(selectedClass)}`
                  : "/docente/classe"
              }
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm muted hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft size={15} />
              Dashboard
            </Link>
          </div>
        </div>

        {!selectedClass ? (
          <div className="glass mt-8 p-8">
            <div className="eyebrow">Nessuna classe</div>
            <h1 className="mt-2 text-3xl font-bold">
              Seleziona una classe
            </h1>
            <p className="mt-3 muted">
              Torna al dashboard docente e scegli la classe da analizzare.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 flex flex-wrap items-end justify-between gap-5">
              <div>
                <div className="eyebrow">
                  Connessioni · {selectedClass}
                </div>

                <h1 className="mt-2 text-5xl font-black tracking-[-.05em]">
                  <span className="gradient-text">
                    Mappa musicale
                  </span>
                </h1>

                <p className="mt-3 max-w-2xl muted">
                  Ogni punto è una persona. Ogni linea racconta
                  una somiglianza: più brani condivisi, più forte è
                  il legame.
                </p>
              </div>

              <div className="pill">
                <Users size={13} />
                {names.length} persone · {pairs.length} connessioni
              </div>
            </div>

            <div className="glass mt-8 overflow-hidden p-2 md:p-4">
              <div className="relative overflow-hidden rounded-3xl bg-[#090a12]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(155,124,255,.12),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(84,214,255,.08),transparent_30%)]" />

                <div className="absolute right-5 top-5 z-20 flex gap-2">
                  <button
                    onClick={() =>
                      setZoom((v) => Math.min(1.45, v + 0.15))
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-white/80 backdrop-blur hover:bg-white/10"
                    title="Ingrandisci"
                  >
                    <ZoomIn size={16} />
                  </button>

                  <button
                    onClick={() =>
                      setZoom((v) => Math.max(0.8, v - 0.15))
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-white/80 backdrop-blur hover:bg-white/10"
                    title="Riduci"
                  >
                    <ZoomOut size={16} />
                  </button>

                  <button
                    onClick={() => setZoom(1)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-white/80 backdrop-blur hover:bg-white/10"
                    title="Centra"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>

                <div className="relative min-h-[620px] w-full md:min-h-[760px]">
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid meet"
                    className="absolute inset-0 h-full w-full transition-transform duration-300"
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: "center",
                    }}
                  >
                    <g>
                      {pairs.map((pair, index) => {
                        const A = getPos(pair.a);
                        const B = getPos(pair.b);

                        if (!A || !B) return null;

                        const width = Math.min(
                          1.05,
                          0.22 + pair.n * 0.18
                        );

                        const opacity = Math.min(
                          0.68,
                          0.22 + pair.n * 0.1
                        );

                        const mx = (A.x + B.x) / 2;
                        const my = (A.y + B.y) / 2;

                        return (
                          <g
                            key={`${pair.a}-${pair.b}`}
                            className="cursor-pointer"
                            onClick={() =>
                              setSelected({
                                a: pair.a,
                                b: pair.b,
                                titles: pair.titles,
                              })
                            }
                          >
                            <path
                              d={path(A, B, index)}
                              fill="none"
                              stroke={`rgba(160,140,255,${opacity})`}
                              strokeWidth={width}
                              strokeLinecap="round"
                            />

                            <circle
                              cx={mx}
                              cy={my}
                              r="1.8"
                              fill="#11111d"
                              stroke="rgba(160,140,255,.4)"
                              strokeWidth=".3"
                            />

                            <text
                              x={mx}
                              y={my + 0.7}
                              fontSize="1.7"
                              textAnchor="middle"
                              fill="#c8c0ff"
                              fontWeight="600"
                            >
                              {pair.n}
                            </text>
                          </g>
                        );
                      })}
                    </g>

                    <g>
                      {positions.map((p) => {
                        const ss = songsFor(p.n);

                        return (
                          <g
                            key={p.n}
                            className="cursor-pointer"
                            onClick={() =>
                              setSelected({
                                name: p.n,
                                songs: ss.map((s) => s.titolo),
                              })
                            }
                          >
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r="5"
                              fill="#11121e"
                              stroke="rgba(255,255,255,.2)"
                              strokeWidth=".55"
                            />

                            <circle
                              cx={p.x}
                              cy={p.y}
                              r="3.4"
                              fill="rgba(155,124,255,.13)"
                            />

                            <circle
                              cx={p.x}
                              cy={p.y}
                              r="1.15"
                              fill="rgba(155,124,255,.65)"
                            />

                            <text
                              x={p.x}
                              y={p.y + 0.65}
                              fontSize="1.55"
                              textAnchor="middle"
                              fill="#f5f3ff"
                              fontWeight="600"
                            >
                              {p.n.split(" ")[0].slice(0, 13)}
                            </text>

                            <text
                              x={p.x}
                              y={p.y + 7.5}
                              fontSize="1.25"
                              textAnchor="middle"
                              fill="#777a91"
                            >
                              {ss.length} brani
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  </svg>

                  <div className="absolute bottom-5 left-5 z-10 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur">
                    <div className="flex items-center gap-3 text-xs text-white/55">
                      <span className="h-2 w-2 rounded-full bg-violet-300" />
                      <span>Numero = brani condivisi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selected && (
              <div className="glass mt-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="eyebrow">Dettaglio</div>

                    <h2 className="mt-2 text-2xl font-bold">
                      {"b" in selected
                        ? `${selected.a} ↔ ${selected.b}`
                        : selected.name}
                    </h2>

                    <p className="mt-1 muted">
                      {"b" in selected
                        ? `${selected.titles.length} canzoni in comune`
                        : `${selected.songs.length} canzoni nella playlist`}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelected(null)}
                    className="rounded-xl p-2 text-[#898b9e] hover:bg-white/7"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {("b" in selected
                    ? selected.titles
                    : selected.songs
                  ).map((title, index) => (
                    <div
                      key={`${title}-${index}`}
                      className="music-card flex items-center gap-3 p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                        <Music2 size={15} />
                      </div>

                      <span className="text-sm">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
