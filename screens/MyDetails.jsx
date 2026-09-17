import { StatusBar, Text, Image, View, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getHistoric } from "../services/apiCrypto";
import { LineChart } from "react-native-gifted-charts";

export function MyDetails({ route }) {
  const crypt = route.params.crypto;
  const nav = useNavigation();
  const [dataTime, setdataTime] = useState([]);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
        <FontAwesome name="chevron-left" size={18} color="#F2F4F8" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Image source={{ uri: crypt.logo }} style={styles.logo} />
        <Text style={styles.name}>{crypt.name}</Text>
        <Text style={styles.symbol}>{crypt.symbol?.toUpperCase()}</Text>
      </View>

      <View style={styles.priceBlock}>
        <Text style={styles.price}>{crypt.price?.toLocaleString("fr-FR")} €</Text>
        <View style={[styles.badge, { backgroundColor: accent + "22" }]}>
          <FontAwesome name={isUp ? "caret-up" : "caret-down"} size={14} color={accent} />
          <Text style={[styles.badgeText, { color: accent }]}>
            {Math.abs(crypt.percent).toFixed(2)} %
          </Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <LineChart
          key={dataTime.length}
          data={dataTime}
          animationDuration={800}
          isAnimated
          width={310}
          height={220}
          thickness={2.5}
          color={accent}
          yAxisLabelSuffix=" €"
          yAxisTextStyle={{ color: "#8A93A6", fontSize: 10 }}
          xAxisLabelTextStyle={{ color: "#8A93A6", fontSize: 9 }}
          rotateLabel
          hideRules
          yAxisColor="transparent"
          xAxisColor="#232838"
          startFillColor={accent}
          endFillColor="#0B0E14"
          startOpacity={0.3}
          endOpacity={0}
          areaChart
        />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Text style={styles.statLabel}>Volume 24h</Text>
          <Text style={styles.statValue}>{crypt.volume?.toLocaleString("fr-FR")} €</Text>
        </View>
      </View>
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
});