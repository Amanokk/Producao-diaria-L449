import { useEffect, useState } from "react";
import { CalendarDays, ClipboardList, HardHat, ChartColumn, MessageSquareText } from "lucide-react";
import { hydrateDiario, useDiario } from "@/lib/producao/store";
import { DayScreen } from "./day-screen";
import { DaysScreen } from "./days-screen";
import { TextScreen } from "./text-screen";
import { TotalsScreen } from "./totals-screen";

type Tab = "dia" | "texto" | "totais" | "dias";

const TABS: { id: Tab; label: string; icon: typeof ClipboardList }[] = [
  { id: "dia", label: "Dia", icon: ClipboardList },
  { id: "texto", label: "Texto", icon: MessageSquareText },
  { id: "totais", label: "Totais", icon: ChartColumn },
  { id: "dias", label: "Dias", icon: CalendarDays },
];

export function ProducaoApp() {
  const ready = useDiario((s) => s.ready);
  const [tab, setTab] = useState<Tab>("dia");

  useEffect(() => {
    hydrateDiario();
  }, []);

  return (
    <div className="min-h-dvh overflow-x-hidden bg-bg text-ink">
      <div className="h-1.5 bg-primary" />
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-ink text-primary">
            <HardHat className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-lg font-semibold leading-none">Produção do dia</p>
            <p className="mt-1 text-sm text-muted">Diário da obra</p>
          </div>
        </div>
        <nav className="hidden gap-1 lg:flex" aria-label="Seções">
          {TABS.map((item) => (
            <TabButton key={item.id} item={item} active={tab === item.id} onClick={() => setTab(item.id)} />
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-28 lg:px-8 lg:pb-16">
        {!ready ? (
          <p className="py-16 text-center text-base text-muted">Abrindo o diário…</p>
        ) : tab === "dia" ? (
          <DayScreen
            onOpenText={(date) => {
              useDiario.getState().select(date);
              setTab("texto");
            }}
          />
        ) : tab === "texto" ? (
          <TextScreen />
        ) : tab === "totais" ? (
          <TotalsScreen />
        ) : (
          <DaysScreen onOpen={() => setTab("dia")} />
        )}
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper lg:hidden" aria-label="Seções">
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`flex h-16 w-full flex-col items-center justify-center gap-1 text-xs font-semibold ${active ? "text-primary" : "text-muted"}`}
                >
                  <Icon className="size-5" aria-hidden />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function TabButton({
  item,
  active,
  onClick,
}: {
  item: (typeof TABS)[number];
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold ${active ? "bg-ink text-paper" : "text-muted hover:bg-soft"}`}
    >
      <Icon className="size-4" aria-hidden />
      {item.label}
    </button>
  );
}
