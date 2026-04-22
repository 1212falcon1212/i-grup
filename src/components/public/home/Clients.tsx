import { SectionHeader } from "./SectionHeader";

export interface ClientItem {
  id: string;
  name: string;
}

export function Clients({ clients }: { clients: ClientItem[] }) {
  return (
    <section
      id="referanslar"
      className="container-site"
      style={{ padding: "96px 40px" }}
    >
      <SectionHeader
        eyebrow="Referanslar"
        title="Birlikte çalıştığımız markalar."
        lead="Eczane zincirleri, kozmetik markaları, dağıtıcılar ve kurumsal firmalar."
      />
      <div
        className="rounded-[14px] bg-bg overflow-hidden"
        style={{ border: "1px solid var(--rule)" }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {clients.map((c, i) => {
            const isNotLastCol = (i % 5) !== 4;
            const isFirstRow = i < 5;
            return (
              <div
                key={c.id}
                className="text-center text-[22px] font-bold tracking-[-0.02em] text-ink2 transition-colors cursor-default hover:text-ink hover:bg-bg2"
                style={{
                  padding: "34px 18px",
                  borderRight: isNotLastCol ? "1px solid var(--rule)" : undefined,
                  borderBottom: isFirstRow ? "1px solid var(--rule)" : undefined,
                }}
              >
                {c.name}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
