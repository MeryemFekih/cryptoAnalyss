import { StatusBar, Text, Image, View, TouchableOpacity, SafeAreaView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getHistoric } from "../services/apiCrypto";
import { LineChart } from "react-native-gifted-charts";
import { styles } from "../Components/mydetailsStyle";

function getTrendLabel(value) {
  if (value === undefined || value === null) return null;
  if (value > 1) return "Forte hausse";
  if (value > 0) return "Légère hausse";
  if (value > -1) return "Légère baisse";
  return "Forte baisse";
}

export function MyDetails({ route }) {
  const crypt = route.params.crypto;
  const nav = useNavigation();
  const [dataTime, setdataTime] = useState([]);
  const [range, setRange] = useState("24h"); 
  const isUp = crypt.percent >= 0;
  const accent = isUp ? "#2ED9A3" : "#FF5C7A";

  useEffect(() => {
    init();
  }, [range]);

  async function init() {
    if (range === "24h") {
      const value = await getHistoric(crypt.id, 1); 
      const resulat = (value?.prices || []).map((p) => ({
        label: new Date(p[0]).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        value: p[1],
      }));
      setdataTime(resulat);
    } else {
      const value = await getHistoric(crypt.id, 7); 
      const resulat = (value?.prices || []).map((p) => {
        const price = Number(p[1]);
        const jour = new Date(p[0]);
        const label = jour.toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" });
        return { label, value: price };
      });
      setdataTime(resulat);
    }
  }

  function renderPercentBadge(label, value) {
    if (value === undefined || value === null) return null;
    const up = value >= 0;
    const color = up ? "#2ED9A3" : "#FF5C7A";
    return (
      <View style={[styles.percentPill, { backgroundColor: color + "22" }]}>
        <Text style={styles.percentLabel}>{label}</Text>
        <View style={styles.percentValueRow}>
          <FontAwesome name={up ? "caret-up" : "caret-down"} size={12} color={color} />
          <Text style={[styles.percentValue, { color }]}>{Math.abs(value).toFixed(2)} %</Text>
        </View>
      </View>
    );
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
        <Text style={[styles.trendText, { color: accent }]}>
          Tendance 24h : {getTrendLabel(crypt.percent)}
        </Text>
      </View>

      <View style={styles.percentRow}>
        {renderPercentBadge("1h", crypt.percent1h)}
        {renderPercentBadge("24h", crypt.percent)}
        {renderPercentBadge("7j", crypt.percent7d)}
      </View>

      <View style={styles.rangeToggle}>
        <TouchableOpacity
          style={[styles.rangeBtn, range === "24h" && styles.rangeBtnActive]}
          onPress={() => setRange("24h")}
        >
          <Text style={[styles.rangeText, range === "24h" && styles.rangeTextActive]}>24h</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rangeBtn, range === "7d" && styles.rangeBtnActive]}
          onPress={() => setRange("7d")}
        >
          <Text style={[styles.rangeText, range === "7d" && styles.rangeTextActive]}>7 jours</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartCard}>
        {dataTime.length > 0 ? (
          <LineChart
            key={range + dataTime.length}
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
        ) : (
          <Text style={styles.loadingText}>Chargement du graphique...</Text>
        )}
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