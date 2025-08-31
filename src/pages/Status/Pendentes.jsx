import React, { useEffect, useMemo, useState } from "react";

/* [ALTERAÇÃO] Base da API (usa PROD por padrão; mude via .env.local) */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://www.zefrahub.com";

/* Helpers */
const formatCurrencyBR = (v) =>
    Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatDateBR = (s) => {
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("pt-BR");
};
const getTotalFromSummary = (summary = []) =>
    summary.reduce((acc, it) => acc + Number(it?.valor_total || 0), 0);

const COLS_PENDENTES =
    "grid items-center gap-4 " +
    "grid-cols-[15px_170px_100px_minmax(140px,1fr)_120px_minmax(100px,1fr)_180px_240px]";

    

/* Mock offline */
function getMockPendings() {
    return [
        {
            upload_id: 101,
            table_type: "Aquisicao",
            created_at: new Date().toISOString(),
            summary: [
                { cnpj_fundo: "00.000.000/0001-00", valor_total: 12345.67, total_chaves: 5 },
                { cnpj_fundo: "11.111.111/0001-11", valor_total: 890.12, total_chaves: 2 },
            ],
        },
        {
            upload_id: 102,
            table_type: "Liquidacao",
            created_at: new Date(Date.now() - 3600_000).toISOString(),
            summary: [{ cnpj_fundo: "22.222.222/0001-22", valor_total: 4500, total_chaves: 1 }],
        },
    ];
}

/* Ícones */
const IconDownload = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 inline-block align-middle">
        <path d="M12 3v10m0 0 4-4m-4 4-4-4M5 21h14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IconLog = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 inline-block align-middle">
        <path d="M8 6h8M8 10h8M8 14h5M5 4h14v16H5z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IconCheck = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 inline-block align-middle">
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function Pendentes() {
    /* Estados de dados */
    const [pendings, setPendings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isOfflineMock, setIsOfflineMock] = useState(false);

    /* [ALTERAÇÃO] Estados de filtro */
    const [fundoQuery, setFundoQuery] = useState("");
    const [tipo, setTipo] = useState("");          // "" | "Aquisicao" | "Liquidacao"
    const [dtIni, setDtIni] = useState("");        // yyyy-mm-dd
    const [dtFim, setDtFim] = useState("");        // yyyy-mm-dd

    /* Modal de Log */
    const [logOpen, setLogOpen] = useState(false);
    const [logText, setLogText] = useState("");
    const [logTitle, setLogTitle] = useState("");

    /* Buscar pendências (híbrido) */
    const fetchPendings = async () => {
        setLoading(true);
        setFetching(true);
        setErrorMsg("");
        setIsOfflineMock(false);

        const token = localStorage.getItem("token");

        if (!token || (typeof navigator !== "undefined" && navigator.onLine === false)) {
            setErrorMsg(token ? "Você está offline. Mostrando dados mock." : "Token não encontrado. Mostrando dados mock.");
            setPendings(getMockPendings());
            setIsOfflineMock(true);
            setLoading(false);
            setFetching(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/list_pending_uploads/`, {
                headers: { Authorization: `Token ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setPendings(data);
            } else {
                let detail = "";
                try { const err = await response.json(); detail = err?.detail || JSON.stringify(err); }
                catch { detail = await response.text(); }
                setErrorMsg(`Falha ao buscar pendentes (HTTP ${response.status}). ${detail || ""} Mostrando mock.`);
                setPendings(getMockPendings());
                setIsOfflineMock(true);
            }
        } catch (err) {
            console.error("Erro de rede:", err);
            setErrorMsg("Erro de rede. Mostrando mock.");
            setPendings(getMockPendings());
            setIsOfflineMock(true);
        } finally {
            setLoading(false);
            setFetching(false);
        }
    };

    /* Ações */
    const confirmUpload = async (upload_id) => {
        if (isOfflineMock) return alert("Modo offline/mock. Confirmação real só online.");
        const token = localStorage.getItem("token");
        if (!token) return alert("Token não encontrado. Faça login.");
        try {
            const response = await fetch(`${API_BASE}/api/confirm_upload/`, {
                method: "POST",
                headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ upload_id }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(`Upload confirmado com ${data.inserted} registros.`);
                fetchPendings();
            } else {
                alert("Erro ao confirmar: " + (data.detail || "Erro desconhecido"));
            }
        } catch (err) {
            console.error("Erro ao confirmar:", err);
            alert("Erro de rede.");
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
            a.href = url; a.download = `upload_${upload_id}.csv`; document.body.appendChild(a);
            a.click(); a.remove(); URL.revokeObjectURL(url);
        } catch (err) { console.error("Erro no download:", err); alert("Erro de rede no download."); }
    };

    const openLog = async (upload_id) => {
        if (isOfflineMock) {
            setLogTitle(`Log do Upload ${upload_id} (mock)`);
            setLogText("Validando...\nNenhum erro.\nPronto para confirmação.");
            setLogOpen(true);
            return;
        }
        const token = localStorage.getItem("token");
        if (!token) return alert("Token não encontrado. Faça login.");
        try {
            const res = await fetch(`${API_BASE}/api/upload_log/?upload_id=${upload_id}`, {
                headers: { Authorization: `Token ${token}` },
            });
            if (!res.ok) return alert(`Falha ao buscar log (HTTP ${res.status}).`);
            const ct = res.headers.get("content-type") || "";
            if (ct.includes("text/plain")) {
                setLogTitle(`Log do Upload ${upload_id}`);
                setLogText((await res.text()) || "(log vazio)");
                setLogOpen(true);
            } else {
                const data = await res.json().catch(() => null);
                const txt = data?.log || (Array.isArray(data?.lines) ? data.lines.join("\n") : "(log vazio)");
                setLogTitle(`Log do Upload ${upload_id}`); setLogText(txt); setLogOpen(true);
            }
        } catch (err) { console.error("Erro ao buscar log:", err); alert("Erro de rede ao buscar log."); }
    };

    useEffect(() => { fetchPendings(); }, []);

    /* [ALTERAÇÃO] Aplica filtros no front (simples) */
    const filtered = useMemo(() => {
        const ini = dtIni ? new Date(dtIni + "T00:00:00") : null;
        const fim = dtFim ? new Date(dtFim + "T23:59:59") : null;
        return pendings.filter((p) => {
            if (tipo && p.table_type !== tipo) return false;
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
    }, [pendings, tipo, fundoQuery, dtIni, dtFim]);

    return (
        <div>
            {/* [ALTERAÇÃO] Filtros do topo (Pendentes) */}
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
                        onClick={fetchPendings}
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
            {/* Lista com scroll horizontal e largura mínima fixa (igual Finalizados) */}
            <div className="p-3">
                {/* só mostra scroll quando precisa; mantém o layout estável */}
                <div className="w-full overflow-x-auto [scrollbar-gutter:stable]">
                    {/* em telas grandes preencha toda a largura; 
        se quiser forçar scroll apenas abaixo de lg, mantenha um min-w em lg */}
                    <div className="min-w-full lg:min-w-[1200px]">
                        {/* Cabeçalho */}
                        <div className={`${COLS_PENDENTES} text-[13px] font-semibold text-gray-700 bg-gray-100 rounded-md px-4 py-3 border text-center`}>
                            <div>Id</div>
                            <div>Operação</div>
                            <div>Data</div>
                            <div>Fundo</div>
                            <div>Cedente</div>
                            <div>Valor da Remessa</div>
                            <div>Situação</div>
                            <div>Ações</div>
                        </div>



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
                                const cedente = "—";

                                return (
                                    <div
                                        key={p.upload_id}
                                        className={`${COLS_PENDENTES} bg-white rounded-md px-4 py-3 shadow-sm border mt-2`}
                                    >
                                        <span className="text-sky-700 font-small text-sm text-center">{p.upload_id}</span>
                                        <div className="font-medium text-gray-900 text-sm text-center">{operacao}</div>
                                        <div className="text-center text-sm">{formatDateBR(p.created_at)}</div>
                                        <div className="truncate text-center text-sm" title={fundo}>{fundo}</div>
                                        <div className="truncate text-center text-sm" title="Cedente">—</div>
                                        <div className="font-semibold tabular-nums text-center text-sm">{formatCurrencyBR(total)}</div>
                                        <div className="justify-self-center">
                                            <span className="px-2 py-1 rounded text-xs bg-amber-100 text-amber-800 border border-amber-200">
                                                Pendente
                                            </span>
                                        </div>

                                        {/* AÇÕES – última coluna */}
                                        <div className="justify-self-center w-[200px]">
                                            <div className="flex justify-center gap-2 whitespace-nowrap">
                                                <button
                                                    onClick={() => downloadUploadFile(p.upload_id)}
                                                    disabled={isOfflineMock}
                                                    className={`p-2 rounded border ${isOfflineMock
                                                            ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                                                            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm"
                                                        }`}
                                                    title="Baixar arquivo do upload"
                                                >
                                                    <IconDownload />
                                                </button>

                                                <button
  onClick={() => openLog(p.upload_id)}
  className="text-sm px-2 py-2 rounded border bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm"
  title="Ver log do upload"
>
  <IconLog /> <span className="ml-1">Log</span>
</button>

<button
  onClick={() => confirmUpload(p.upload_id)}
  disabled={isOfflineMock}
  className={`text-sm px-3 py-2 min-w-[132px] rounded ${
    isOfflineMock
      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700 text-white shadow-sm"
  }`}
  title="Confirmar upload"
>
  ✓ <span className="ml-1">Confirmar</span>
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

            {/* Modal simples de LOG */}
            {logOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setLogOpen(false)} />
                    <div className="relative z-10 w-[min(900px,92vw)] max-h-[80vh] bg-white rounded-xl shadow-2xl border">
                        <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50 rounded-t-xl">
                            <h3 className="text-lg font-semibold">{logTitle || "Log"}</h3>
                            <button onClick={() => setLogOpen(false)} className="text-sm px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100">Fechar</button>
                        </div>
                        <div className="p-4">
                            <pre className="whitespace-pre-wrap text-sm bg-gray-900 text-gray-100 rounded-lg p-4 max-h-[60vh] overflow-auto">
                                {logText}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
