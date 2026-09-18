import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E14" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },

  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 100 },
  loadingText: { color: "#8A93A6", marginTop: 12 },

  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#151A24", alignItems: "center", justifyContent: "center" },
  backText: { color: "#F2F4F8", fontSize: 22, marginTop: -2 },

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
  percentPill: { flex: 1, backgroundColor: "#151A24", borderRadius: 14, paddingVertical: 8, alignItems: "center" },
  percentLabel: { fontSize: 11, color: "#8A93A6", marginBottom: 2 },
  percentValue: { fontSize: 13, fontWeight: "700" },

  estimateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1FA97A",
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  estimateBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  aiIcon: { fontSize: 16 },

  estimationCard: { backgroundColor: "#151A24", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#1FA97A33" },
  estimationHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  estimationTitle: { fontSize: 15, fontWeight: "700", color: "#F2F4F8" },
  estimationConfidence: { fontSize: 12, color: "#2ED9A3" },
  estimationError: { fontSize: 13, color: "#F87171" },
  estimationDirection: { fontSize: 13, fontWeight: "700", color: "#2ED9A3", marginBottom: 4 },
  estimationText: { fontSize: 13, color: "#C7CCDA", marginBottom: 4 },

  rangeToggle: { flexDirection: "row", backgroundColor: "#151A24", borderRadius: 14, padding: 4, marginBottom: 16 },
  rangeBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: "center" },
  rangeBtnActive: { backgroundColor: "#1FA97A33" },
  rangeText: { fontSize: 13, color: "#8A93A6", fontWeight: "600" },
  rangeTextActive: { color: "#2ED9A3" },

  chartCard: { backgroundColor: "#151A24", borderRadius: 20, paddingVertical: 16, alignItems: "center", minHeight: 140, justifyContent: "center" },

  statsRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  statPill: { flex: 1, backgroundColor: "#151A24", borderRadius: 16, padding: 14 },
  statLabel: { fontSize: 12, color: "#8A93A6" },
  statValue: { fontSize: 16, fontWeight: "700", color: "#F2F4F8", marginTop: 4 },
});