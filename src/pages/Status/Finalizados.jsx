import React, { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://www.zefrahub.com";

const formatCurrencyBR = (v) =>
    Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatDateBR = (s) => {
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("pt-BR");
};
const getTotalFromSummary = (summary = []) =>
    summary.reduce((acc, it) => acc + Number(it?.valor_total || 0), 0);

const COLS =
    "grid items-center gap-4 " +
    "grid-cols-[15px_170px_100px_minmax(140px,1fr)_120px_minmax(100px,1fr)_180px_150px]";

/* Mock de finalizados */
function getMockFinalizados() {
    return [
        {
            upload_id: 201,
            table_type: "Aquisicao",
            created_at: new Date(Date.now() - 86_400_000 * 2).toISOString(),
            result: "Sucesso", // ou "Erro"
            summary: [{ cnpj_fundo: "00.000.000/0001-00", valor_total: 8000, total_chaves: 4 }],
        },
        {
            upload_id: 202,
            table_type: "Liquidacao",
            created_at: new Date(Date.now() - 86_400_000 * 7).toISOString(),
            result: "Erro",
            summary: [{ cnpj_fundo: "22.222.222/0001-22", valor_total: 1500, total_chaves: 1 }],
        },
    ];
}

const IconDownload = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 inline-block align-middle">
        <path
            d="M12 3v10m0 0 4-4m-4 4-4-4M5 21h14"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
const IconLog = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 inline-block align-middle">
        <path
            d="M8 6h8M8 10h8M8 14h5M5 4h14v16H5z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default function Finalizados() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isOfflineMock, setIsOfflineMock] = useState(false);

    /* Filtros do topo (Finalizados) */
    const [fundoQuery, setFundoQuery] = useState("");
    const [tipo, setTipo] = useState("");
    const [resultado, setResultado] = useState(""); // "" | "Sucesso" | "Erro"
    const [dtIni, setDtIni] = useState("");
    const [dtFim, setDtFim] = useState("");

    const fetchFinalizados = async () => {
        setLoading(true);
        setFetching(true);
        setErrorMsg("");
        setIsOfflineMock(false);

        const token = localStorage.getItem("token");

        if (!token || (typeof navigator !== "undefined" && navigator.onLine === false)) {
            setErrorMsg(
                token ? "Você está offline. Mostrando dados mock." : "Token não encontrado. Mostrando dados mock."
            );
            setItems(getMockFinalizados());
            setIsOfflineMock(true);
            setLoading(false);
            setFetching(false);
            return;
        }

        try {
            // Ajuste este endpoint de acordo com seu backend
            const response = await fetch(`${API_BASE}/api/list_finalized_uploads/`, {
                headers: { Authorization: `Token ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setItems(data);
            } else {
                let detail = "";
                try {
                    const err = await response.json();
                    detail = err?.detail || JSON.stringify(err);
                } catch {
                    detail = await response.text();
                }
                setErrorMsg(
                    `Falha ao buscar finalizados (HTTP ${response.status}). ${detail || ""} Mostrando mock.`
                );
                setItems(getMockFinalizados());
                setIsOfflineMock(true);
            }
        } catch (err) {
            console.error("Erro de rede:", err);
            setErrorMsg("Erro de rede. Mostrando mock.");
            setItems(getMockFinalizados());
            setIsOfflineMock(true);
        } finally {
            setLoading(false);
            setFetching(false);
        }
    };

    const downloadUploadFile = async (upload_id) => {
        if (isOfflineMock) return alert("Modo offline: simulando download.");
        const token = localStorage.getItem("token");
        if (!token) return alert("Token não encontrado. Faça login.");
        try {
            const res = await fetch(`${API_BASE}/api/download_upload_file/?upload_id=${upload_id}`, {
                headers: { Authorization: `Token ${token}` },
            });
            if (!res.ok) return alert(`Falha no download (HTTP ${res.status}).`);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `upload_${upload_id}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Erro no download:", err);
            alert("Erro de rede no download.");
        }
    };

    const openLog = async (upload_id) => {
        if (isOfflineMock) {
            alert(`(mock) Log do upload ${upload_id}`);
            return;
        }
        const token = localStorage.getItem("token");
        if (!token) return alert("Token não encontrado. Faça login.");
        try {
            const res = await fetch(`${API_BASE}/api/upload_log/?upload_id=${upload_id}`, {
                headers: { Authorization: `Token ${token}` },
            });
            if (!res.ok) return alert(`Falha ao buscar log (HTTP ${res.status}).`);
            const txt = await res.text();
            alert(txt || "(log vazio)"); // simples; se quiser, reuse um modal como no Pendentes
        } catch (err) {
            console.error("Erro ao buscar log:", err);
            alert("Erro de rede ao buscar log.");
        }
    };

    useEffect(() => {
        fetchFinalizados();
    }, []);

    /* aplica filtros */
    const filtered = useMemo(() => {
        const ini = dtIni ? new Date(dtIni + "T00:00:00") : null;
        const fim = dtFim ? new Date(dtFim + "T23:59:59") : null;
        return items.filter((p) => {
            if (tipo && p.table_type !== tipo) return false;
            if (resultado && (p.result || p.status) !== resultado) return false;
            if (fundoQuery) {
                const f = p?.summary?.[0]?.cnpj_fundo || "";
                if (!String(f).toLowerCase().includes(fundoQuery.toLowerCase())) return false;
            }
            if (ini || fim) {
                const dt = new Date(p.created_at);
                if (ini && dt < ini) return false;
                if (fim && dt > fim) return false;
            }
            return true;
        });
    }, [items, tipo, resultado, fundoQuery, dtIni, dtFim]);

    return (
        <div>
            {/* Filtros do topo (Finalizados) — tema dark tipo "Remessas" */}
            <div className="flex flex-wrap items-end gap-3 p-3 bg-[#4B8C8F] border-b border-neutral-300">
                <div>
                    <label className="block text-xs text-white mb-1 font-bold">Fundo</label>
                    <input
                        value={fundoQuery}
                        onChange={(e) => setFundoQuery(e.target.value)}
                        placeholder="00.000.000/0001-00"
                        className="border rounded px-2 py-1 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs text-white mb-1 font-bold">Tipo</label>
                    <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                    >
                        <option value="">Todos</option>
                        <option value="Aquisicao">Aquisição</option>
                        <option value="Liquidacao">Liquidação</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-white mb-1 font-bold">Resultado</label>
                    <select
                        value={resultado}
                        onChange={(e) => setResultado(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                    >
                        <option value="">Todos</option>
                        <option value="Sucesso">Sucesso</option>
                        <option value="Erro">Erro</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-white mb-1 font-bold">De</label>
                    <input
                        type="date"
                        value={dtIni}
                        onChange={(e) => setDtIni(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs text-white mb-1 font-bold">Até</label>
                    <input
                        type="date"
                        value={dtFim}
                        onChange={(e) => setDtFim(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                    />
                </div>

                <div className="ml-auto">
                    <button
                        onClick={fetchFinalizados}
                        className="text-sm px-3 py-2 rounded-md bg-neutral-700 text-white border border-neutral-500 hover:bg-neutral-600"
                    >
                        Atualizar
                    </button>
                </div>
            </div>



            {fetching && <div className="h-2 w-full bg-orange-500 animate-pulse"></div>}

            {errorMsg && (
                <div className="m-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
                    {errorMsg} {isOfflineMock && <strong>(mock)</strong>}
                </div>
            )}

            {/* Lista com scroll horizontal e largura mínima fixa */}
            <div className="p-3">
                {/* só mostra scroll quando precisa; mantém o layout estável */}
                <div className="w-full overflow-x-auto">
                    {/* padding aqui */}
                    <div className="min-w-max px-4">
                        {/* Cabeçalho */}
                        <div className={`${COLS} text-[13px] font-semibold text-gray-700 bg-gray-100 rounded-md px-4 py-3 border text-center`}>
                            <div>Id</div>
                            <div>Operação</div>
                            <div>Data</div>
                            <div>Fundo</div>
                            <div>Cedente</div>
                            <div>Valor da Remessa</div>
                            <div>Resultado</div>
                            <div>Ações</div>
                        </div>

                        {/* Linhas */}
                        {/* Linhas */}
                        {loading ? (
                            <p className="px-4 py-3 text-gray-600">Carregando...</p>
                        ) : filtered.length === 0 ? (
                            <p className="px-4 py-3 text-gray-600">Nada encontrado com os filtros.</p>
                        ) : (
                            filtered.map((p) => {
                                const total = getTotalFromSummary(p.summary);
                                const operacao =
                                    p.table_type === "Aquisicao"
                                        ? "Aquisição"
                                        : p.table_type === "Liquidacao"
                                            ? "Liquidação"
                                            : p.table_type || "—";
                                const fundo = p?.summary?.[0]?.cnpj_fundo || "—";
                                const result = p.result || p.status || "Sucesso";
                                const cedente =
                                    p?.cedente ??
                                    p?.assignor ??
                                    p?.summary?.[0]?.cedente ??
                                    "—";

                                const badge =
                                    result === "Erro"
                                        ? "bg-red-100 text-red-800 border-red-200"
                                        : "bg-emerald-100 text-emerald-800 border-emerald-200";

                                return (
                                    <div
                                        key={p.upload_id}
                                        className={`${COLS} bg-white rounded-md px-4 py-3 shadow-sm border mt-2`}
                                    >
                                        <span className="text-sky-700 font-medium text-sm text-center">{p.upload_id}</span>
                                        <div className="font-medium text-gray-900 text-sm text-center">{operacao}</div>
                                        <div className="text-center text-sm">{formatDateBR(p.created_at)}</div>
                                        <div className="truncate text-center text-sm" title={fundo}>{fundo}</div>
                                          <div className="truncate text-center text-sm" title={cedente}>{cedente}</div>
                                        <div className="font-semibold tabular-nums text-center text-sm">
                                            {formatCurrencyBR(total)}
                                        </div>
                                        <div className="justify-self-center">
                                            <span className={`px-2 py-1 rounded text-xs border ${badge}`}>
                                                {result}
                                            </span>
                                        </div>

                                        {/* Ações – mesma coluna, alinhada à direita */}
                                        <div className="justify-self-center w-[260px]">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => downloadUploadFile(p.upload_id)}
                                                    disabled={isOfflineMock}
                                                    className={`text-sm px-3 py-2 min-w-[44px] rounded border ${isOfflineMock
                                                        ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                                                        : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm"
                                                        }`}
                                                    title="Download"
                                                >
                                                    <IconDownload />
                                                </button>

                                                <button
                                                    onClick={() => openLog(p.upload_id)}
                                                    className="text-sm px-2 py-2 min-w-[64px] rounded border bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm"
                                                    title="Log"
                                                >
                                                    <IconLog /> <span className="ml-1">Log</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
