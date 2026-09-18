import { StatusBar, Text, Image, View, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getHistoric, getMarketData } from "../services/apiCrypto";
import { getMacroContext } from "../services/apiMacro";
import { estimatePrice } from "../services/apiIA";
import { LineChart } from "react-native-gifted-charts";

export function MyDetails({ route }) {
  const crypt = route.params.crypto;
  const nav = useNavigation();
  const [dataTime, setdataTime] = useState([]);
  const [estimation, setEstimation] = useState(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const isUp = crypt.percent >= 0;
  const accent = isUp ? "#2ED9A3" : "#FF5C7A";

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const value = await getHistoric(crypt.id);
    const resulat = value.market_caps.map((p) => {
      const price = Number(p[1]);
      const jour = new Date(p[0]);
      const label = jour.toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" });
      return { label, value: price };
    });
    setdataTime(resulat);
  }

  async function handleEstimation() {
    setIsEstimating(true);
    setEstimation(null);
    try {
      const marketData = await getMarketData(crypt.id);
      const macroContext = await getMacroContext();
      const result = await estimatePrice(marketData, macroContext);
      setEstimation(result);
    } catch (e) {
      console.log("erreur handleEstimation :", e);
    } finally {
      setIsEstimating(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ... header, priceBlock, chartCard inchangés ... */}

      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Text style={styles.statLabel}>Volume 24h</Text>
          <Text style={styles.statValue}>{crypt.volume?.toLocaleString("fr-FR")} €</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.estimateBtn}
        onPress={handleEstimation}
        disabled={isEstimating}
      >
        {isEstimating ? (
          <ActivityIndicator color="#0B0E14" />
        ) : (
          <Text style={styles.estimateBtnText}>Estimer l'évolution (24h)</Text>
        )}
      </TouchableOpacity>

      {estimation && (
        <View style={styles.estimationCard}>
          <View style={styles.estimationHeader}>
            <FontAwesome
              name={estimation.direction === "hausse" ? "arrow-up" : estimation.direction === "baisse" ? "arrow-down" : "minus"}
              size={16}
              color={accent}
            />
            <Text style={[styles.estimationDirection, { color: accent }]}>
              {estimation.direction.toUpperCase()}
            </Text>
            <Text style={styles.estimationConfidence}>Confiance : {estimation.confiance}</Text>
          </View>
          <Text style={styles.estimationText}>{estimation.explication}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E14", paddingHorizontal: 20, paddingTop: 16 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#151A24", alignItems: "center", justifyContent: "center" },
  header: { alignItems: "center", marginTop: 12 },
  logo: { width: 56, height: 56, borderRadius: 28, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: "700", color: "#F2F4F8" },
  symbol: { fontSize: 13, color: "#8A93A6", marginTop: 2, letterSpacing: 0.5 },
  priceBlock: { alignItems: "center", marginTop: 20, marginBottom: 24 },
  price: { fontSize: 38, fontWeight: "800", color: "#F2F4F8" },
  badge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 8 },
  badgeText: { fontSize: 13, fontWeight: "600" },
  chartCard: { backgroundColor: "#151A24", borderRadius: 20, paddingVertical: 16, alignItems: "center" },
  statsRow: { flexDirection: "row", marginTop: 20 },
  statPill: { flex: 1, backgroundColor: "#151A24", borderRadius: 16, padding: 14 },
  statLabel: { fontSize: 12, color: "#8A93A6" },
  statValue: { fontSize: 16, fontWeight: "700", color: "#F2F4F8", marginTop: 4 },
  estimateBtn: {
  backgroundColor: "#2ED9A3",
  borderRadius: 14,
  paddingVertical: 14,
  alignItems: "center",
  marginTop: 20,
},
estimateBtnText: { color: "#0B0E14", fontWeight: "700", fontSize: 15 },
estimationCard: {
  backgroundColor: "#151A24",
  borderRadius: 16,
  padding: 16,
  marginTop: 16,
},
estimationHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
estimationDirection: { fontWeight: "700", fontSize: 14 },
estimationConfidence: { color: "#8A93A6", fontSize: 12, marginLeft: "auto" },
estimationText: { color: "#F2F4F8", fontSize: 13, lineHeight: 19 },
});