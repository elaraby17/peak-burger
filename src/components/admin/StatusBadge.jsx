import Badge from "../ui/Badge";

const toneMap = {
  pending: "outline",
  confirmed: "primary",
  preparing: "primary",
  out_for_delivery: "secondary",
  delivered: "ink",
  cancelled: "outline",
  active: "primary",
  inactive: "outline",
  approved: "primary",
  hidden: "outline",
  paid: "primary",
  failed: "secondary",
  refunded: "outline",
};

export default function StatusBadge({ status, label }) {
  return <Badge tone={toneMap[status] || "outline"}>{label || status}</Badge>;
}
