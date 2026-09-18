import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E14", paddingHorizontal: 20, paddingTop: 16 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#151A24", alignItems: "center", justifyContent: "center" },
  header: { alignItems: "center", marginTop: 12 },
  logo: { width: 56, height: 56, borderRadius: 28, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: "700", color: "#F2F4F8" },
  symbol: { fontSize: 13, color: "#8A93A6", marginTop: 2, letterSpacing: 0.5 },
  priceBlock: { alignItems: "center", marginTop: 20, marginBottom: 12 },
  price: { fontSize: 38, fontWeight: "800", color: "#F2F4F8" },
  badge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 8 },
  badgeText: { fontSize: 13, fontWeight: "600" },
  trendText: { fontSize: 13, fontWeight: "600", marginTop: 6 },

  percentRow: { flexDirection: "row", justifyContent: "space-between", gap: 8, marginBottom: 16 },
  percentPill: { flex: 1, borderRadius: 14, paddingVertical: 8, alignItems: "center" },
  percentLabel: { fontSize: 11, color: "#8A93A6", marginBottom: 2 },
  percentValueRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  percentValue: { fontSize: 13, fontWeight: "700" },

  rangeToggle: { flexDirection: "row", backgroundColor: "#151A24", borderRadius: 14, padding: 4, marginBottom: 16 },
  rangeBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: "center" },
  rangeBtnActive: { backgroundColor: "#232838" },
  rangeText: { fontSize: 13, color: "#8A93A6", fontWeight: "600" },
  rangeTextActive: { color: "#F2F4F8" },

  chartCard: { backgroundColor: "#151A24", borderRadius: 20, paddingVertical: 16, alignItems: "center" },
  loadingText: { color: "#8A93A6", paddingVertical: 40 },

  statsRow: { flexDirection: "row", marginTop: 20 },
  statPill: { flex: 1, backgroundColor: "#151A24", borderRadius: 16, padding: 14 },
  statLabel: { fontSize: 12, color: "#8A93A6" },
  statValue: { fontSize: 16, fontWeight: "700", color: "#F2F4F8", marginTop: 4 },
});