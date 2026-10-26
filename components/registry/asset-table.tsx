import { Chip } from "@/components/ui/chip";
import type { AssetRecord } from "@/lib/types";

type AssetTableProps = {
  rows: AssetRecord[];
};

function toneForStatus(status: AssetRecord["status"]) {
  if (status === "protected") {
    return "success" as const;
  }

  return "warning" as const;
}

export function AssetTable({ rows }: AssetTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--stroke)]">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-[var(--surface-1)] text-[var(--text-soft)]">
          <tr>
            <th className="px-3 py-2.5 font-medium">Asset</th>
            <th className="px-3 py-2.5 font-medium">Type</th>
            <th className="px-3 py-2.5 font-medium">Distribution</th>
            <th className="px-3 py-2.5 font-medium">Status</th>
            <th className="px-3 py-2.5 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--stroke)] bg-[var(--surface-2)] text-[var(--text-muted)]">
          {rows.map((asset) => (
            <tr key={asset.id}>
              <td className="px-3 py-3 align-top">
                <p className="font-medium text-[var(--text-strong)]">{asset.title}</p>
                <p className="text-xs text-[var(--text-soft)]">{asset.id}</p>
              </td>
              <td className="px-3 py-3 uppercase">{asset.kind}</td>
              <td className="px-3 py-3">{asset.distributedTo}</td>
              <td className="px-3 py-3">
                <Chip
                  label={asset.status === "protected" ? "Protected" : "Fingerprinting"}
                  tone={toneForStatus(asset.status)}
                />
              </td>
              <td className="px-3 py-3">{asset.lastUpdated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
