import {
  StatusBar,
  Text,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

import {
  getHistoric,
  getMarketData,
} from "../services/apiCrypto";

import { getMacroContext } from "../services/apiMacro";
import { estimatePrice } from "../services/apiIA";

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

  // Graph data
  const [dataTime, setDataTime] = useState([]);

  // Range du graphique
  const [range, setRange] = useState("24h");

  // AI estimation
  const [estimation, setEstimation] = useState(null);
  const [isEstimating, setIsEstimating] = useState(false);

  // Crypto price direction
  const isUp = crypt.percent >= 0;
  const accent = isUp ? "#2ED9A3" : "#FF5C7A";


  useEffect(() => {
    init();
  }, [range]);


  // =========================
  // GRAPH DATA
  // =========================

  async function init() {
    try {
      if (range === "24h") {
        const value = await getHistoric(crypt.id, 1);

        const result = (value?.prices || []).map((p) => ({
          label: new Date(p[0]).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          value: p[1],
        }));

        setDataTime(result);
      } else {
        const value = await getHistoric(crypt.id, 7);

        const result = (value?.prices || []).map((p) => {
          const price = Number(p[1]);
          const jour = new Date(p[0]);

          const label = jour.toLocaleDateString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return {
            label,
            value: price,
          };
        });

        setDataTime(result);
      }
    } catch (error) {
      console.log("Erreur chargement historique :", error);
      setDataTime([]);
    }
  }


  // =========================
  // PERCENT BADGE
  // =========================

  function renderPercentBadge(label, value) {
    if (value === undefined || value === null) return null;

    const up = value >= 0;
    const color = up ? "#2ED9A3" : "#FF5C7A";

    return (
      <View
        style={[
          styles.percentPill,
          {
            backgroundColor: color + "22",
          },
        ]}
      >
        <Text style={styles.percentLabel}>
          {label}
        </Text>

        <View style={styles.percentValueRow}>
          <FontAwesome
            name={up ? "caret-up" : "caret-down"}
            size={12}
            color={color}
          />

          <Text
            style={[
              styles.percentValue,
              {
                color,
              },
            ]}
          >
            {Math.abs(value).toFixed(2)} %
          </Text>
        </View>
      </View>
    );
  }


  // =========================
  // AI ESTIMATION
  // =========================

  async function handleEstimation() {
    setIsEstimating(true);
    setEstimation(null);

    try {
      const marketData = await getMarketData(crypt.id);

      const macroContext = await getMacroContext();

      const result = await estimatePrice(
        marketData,
        macroContext
      );

      setEstimation(result);
    } catch (error) {
      console.log(
        "Erreur handleEstimation :",
        error
      );
    } finally {
      setIsEstimating(false);
    }
  }


  // =========================
  // UI
  // =========================

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar barStyle="light-content" />


      {/* BACK BUTTON */}

      <TouchableOpacity
        onPress={() => nav.goBack()}
        style={styles.backBtn}
      >
        <FontAwesome
          name="chevron-left"
          size={18}
          color="#F2F4F8"
        />
      </TouchableOpacity>


      {/* HEADER */}

      <View style={styles.header}>

        <Image
          source={{
            uri: crypt.logo,
          }}
          style={styles.logo}
        />

        <Text style={styles.name}>
          {crypt.name}
        </Text>

        <Text style={styles.symbol}>
          {crypt.symbol?.toUpperCase()}
        </Text>

      </View>


      {/* PRICE */}

      <View style={styles.priceBlock}>

        <Text style={styles.price}>
          {crypt.price?.toLocaleString("fr-FR")} €
        </Text>


        <View
          style={[
            styles.badge,
            {
              backgroundColor: accent + "22",
            },
          ]}
        >

          <FontAwesome
            name={
              isUp
                ? "caret-up"
                : "caret-down"
            }
            size={14}
            color={accent}
          />

          <Text
            style={[
              styles.badgeText,
              {
                color: accent,
              },
            ]}
          >
            {Math.abs(crypt.percent).toFixed(2)} %
          </Text>

        </View>


        <Text
          style={[
            styles.trendText,
            {
              color: accent,
            },
          ]}
        >
          Tendance 24h :{" "}
          {getTrendLabel(crypt.percent)}
        </Text>

      </View>


      {/* PERCENTAGES */}

      <View style={styles.percentRow}>

        {renderPercentBadge(
          "1h",
          crypt.percent1h
        )}

        {renderPercentBadge(
          "24h",
          crypt.percent
        )}

        {renderPercentBadge(
          "7j",
          crypt.percent7d
        )}

      </View>


      {/* RANGE BUTTONS */}

      <View style={styles.rangeToggle}>

        <TouchableOpacity
          style={[
            styles.rangeBtn,
            range === "24h" &&
              styles.rangeBtnActive,
          ]}
          onPress={() =>
            setRange("24h")
          }
        >
          <Text
            style={[
              styles.rangeText,
              range === "24h" &&
                styles.rangeTextActive,
            ]}
          >
            24h
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={[
            styles.rangeBtn,
            range === "7d" &&
              styles.rangeBtnActive,
          ]}
          onPress={() =>
            setRange("7d")
          }
        >
          <Text
            style={[
              styles.rangeText,
              range === "7d" &&
                styles.rangeTextActive,
            ]}
          >
            7 jours
          </Text>
        </TouchableOpacity>

      </View>


      {/* CHART */}

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
            yAxisTextStyle={{
              color: "#8A93A6",
              fontSize: 10,
            }}
            xAxisLabelTextStyle={{
              color: "#8A93A6",
              fontSize: 9,
            }}
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

          <Text style={styles.loadingText}>
            Chargement du graphique...
          </Text>

        )}

      </View>


      {/* VOLUME */}

      <View style={extraStyles.statsRow}>

        <View style={extraStyles.statPill}>

          <Text style={extraStyles.statLabel}>
            Volume 24h
          </Text>

          <Text style={extraStyles.statValue}>
            {crypt.volume?.toLocaleString("fr-FR")} €
          </Text>

        </View>

      </View>


      {/* AI ESTIMATION BUTTON */}

      <TouchableOpacity
        style={extraStyles.estimateBtn}
        onPress={handleEstimation}
        disabled={isEstimating}
      >

        {isEstimating ? (

          <ActivityIndicator
            color="#0B0E14"
          />

        ) : (

          <Text
            style={
              extraStyles.estimateBtnText
            }
          >
            Estimer l'évolution (24h)
          </Text>

        )}

      </TouchableOpacity>


      {/* AI ESTIMATION RESULT */}

      {estimation && (

        <View
          style={
            extraStyles.estimationCard
          }
        >

          <View
            style={
              extraStyles.estimationHeader
            }
          >

            <FontAwesome
              name={
                estimation.direction ===
                "hausse"
                  ? "arrow-up"
                  : estimation.direction ===
                    "baisse"
                  ? "arrow-down"
                  : "minus"
              }
              size={16}
              color={accent}
            />


            <Text
              style={[
                extraStyles.estimationDirection,
                {
                  color: accent,
                },
              ]}
            >
              {estimation.direction?.toUpperCase()}
            </Text>


            <Text
              style={
                extraStyles.estimationConfidence
              }
            >
              Confiance :{" "}
              {estimation.confiance}
            </Text>

          </View>


          <Text
            style={
              extraStyles.estimationText
            }
          >
            {estimation.explication}
          </Text>

        </View>

      )}

    </SafeAreaView>
  );
}


// ========================================
// STYLES AJOUTÉS POUR L'ESTIMATION
// ========================================

const extraStyles = StyleSheet.create({

  statsRow: {
    flexDirection: "row",
    marginTop: 20,
  },

  statPill: {
    flex: 1,
    backgroundColor: "#151A24",
    borderRadius: 16,
    padding: 14,
  },

  statLabel: {
    fontSize: 12,
    color: "#8A93A6",
  },

  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F2F4F8",
    marginTop: 4,
  },

  estimateBtn: {
    backgroundColor: "#2ED9A3",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },

  estimateBtnText: {
    color: "#0B0E14",
    fontWeight: "700",
    fontSize: 15,
  },

  estimationCard: {
    backgroundColor: "#151A24",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },

  estimationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  estimationDirection: {
    fontWeight: "700",
    fontSize: 14,
  },

  estimationConfidence: {
    color: "#8A93A6",
    fontSize: 12,
    marginLeft: "auto",
  },

  estimationText: {
    color: "#F2F4F8",
    fontSize: 13,
    lineHeight: 19,
  },

});