import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

import { getDetails, getHistoric } from "../services/apiCrypto";
import {
  getMarketData,
  getMacroContext,
  estimatePrice,
} from "../services/apiIA";

import { styles } from "../Components/mydetailsStyle";

export default function MyDetails({ route, navigation }) {
  const { id, logo } = route.params;

  const [details, setDetails] = useState(null);
  const [historic, setHistoric] = useState(null);
  const [range, setRange] = useState("24h");

  const [estimation, setEstimation] = useState(null);
  const [isEstimating, setIsEstimating] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    loadHistoric();
  }, [id, range]);

  const loadData = async () => {
    try {
      const data = await getDetails(id);
      setDetails(data);
    } catch (error) {
      console.log("Erreur chargement détails :", error);
    }
  };

  const loadHistoric = async () => {
    try {
      const days = range === "24h" ? 1 : range === "7j" ? 7 : 30;
      const data = await getHistoric(id, days);
      setHistoric(data);
    } catch (error) {
      console.log("Erreur chargement historique :", error);
    }
  };

  const handlePrediction = async () => {
    if (!details) return;

    setIsEstimating(true);
    setEstimation(null);

    try {
      console.log("Début prédiction IA pour :", id);

      const marketData = await getMarketData(id);

      if (!marketData) {
        throw new Error("Impossible de récupérer les données du marché.");
      }

      const macroContext = await getMacroContext();
      const result = await estimatePrice(marketData, macroContext);

      setEstimation(result);
    } catch (error) {
      console.log("Erreur prédiction IA :", error);
      setEstimation({
        error: "La prédiction IA est temporairement indisponible. Vérifie la clé API.",
      });
    } finally {
      setIsEstimating(false);
    }
  };

  if (!details) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const priceChange24h = details.priceChange24h ?? 0;
  const priceChange1h = details.priceChange1h ?? 0;
  const priceChange7d = details.priceChange7d ?? 0;
  const isPositive = priceChange24h >= 0;

  const formatPrice = (value) => {
    if (value === null || value === undefined) return "-";
    return `${Number(value).toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} €`;
  };

  const formatPercent = (value) => {
    if (value === null || value === undefined) return "-";
    const number = Number(value);
    return `${number >= 0 ? "+" : ""}${number.toFixed(2)}%`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          {logo ? <Image source={{ uri: logo }} style={styles.logo} /> : null}
          <Text style={styles.name}>{details.name}</Text>
          <Text style={styles.symbol}>{details.symbol?.toUpperCase()}</Text>
        </View>

        <View style={styles.priceBlock}>
          <Text style={styles.price}>{formatPrice(details.currentPrice)}</Text>

          <View
            style={[
              styles.badge,
              { backgroundColor: isPositive ? "#163B2A" : "#3B1B1B" },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: isPositive ? "#4ADE80" : "#F87171" },
              ]}
            >
              {formatPercent(priceChange24h)}
            </Text>
          </View>

          <Text
            style={[
              styles.trendText,
              { color: isPositive ? "#4ADE80" : "#F87171" },
            ]}
          >
            Tendance 24h : {isPositive ? "Hausse" : "Baisse"}
          </Text>
        </View>

        <View style={styles.percentRow}>
          <View style={styles.percentPill}>
            <Text style={styles.percentLabel}>1h</Text>
            <Text
              style={[
                styles.percentValue,
                { color: priceChange1h >= 0 ? "#4ADE80" : "#F87171" },
              ]}
            >
              {formatPercent(priceChange1h)}
            </Text>
          </View>

          <View style={styles.percentPill}>
            <Text style={styles.percentLabel}>24h</Text>
            <Text
              style={[
                styles.percentValue,
                { color: priceChange24h >= 0 ? "#4ADE80" : "#F87171" },
              ]}
            >
              {formatPercent(priceChange24h)}
            </Text>
          </View>

          <View style={styles.percentPill}>
            <Text style={styles.percentLabel}>7j</Text>
            <Text
              style={[
                styles.percentValue,
                { color: priceChange7d >= 0 ? "#4ADE80" : "#F87171" },
              ]}
            >
              {formatPercent(priceChange7d)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.estimateBtn}
          onPress={handlePrediction}
          disabled={isEstimating}
          activeOpacity={0.8}
        >
          {isEstimating ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.estimateBtnText}>Analyse IA en cours...</Text>
            </>
          ) : (
            <>
              <Text style={styles.aiIcon}>🤖</Text>
              <Text style={styles.estimateBtnText}>Prédiction précise avec IA</Text>
            </>
          )}
        </TouchableOpacity>

        {estimation && (
          <View style={styles.estimationCard}>
            <View style={styles.estimationHeader}>
              <Text style={styles.estimationTitle}>🤖 Prédiction IA</Text>
              {estimation.confidence && (
                <Text style={styles.estimationConfidence}>
                  Confiance : {estimation.confidence}
                </Text>
              )}
            </View>

            {estimation.error ? (
              <Text style={styles.estimationError}>{estimation.error}</Text>
            ) : (
              <>
                {estimation.direction && (
                  <Text style={styles.estimationDirection}>
                    Direction : {estimation.direction}
                  </Text>
                )}
                {estimation.prediction && (
                  <Text style={styles.estimationText}>{estimation.prediction}</Text>
                )}
                {estimation.targetPrice && (
                  <Text style={styles.estimationText}>
                    Prix estimé : {formatPrice(estimation.targetPrice)}
                  </Text>
                )}
                {estimation.explanation && (
                  <Text style={styles.estimationText}>{estimation.explanation}</Text>
                )}
              </>
            )}
          </View>
        )}

        <View style={styles.rangeToggle}>
          {["24h", "7j", "30j"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.rangeBtn, range === item && styles.rangeBtnActive]}
              onPress={() => setRange(item)}
            >
              <Text
                style={[styles.rangeText, range === item && styles.rangeTextActive]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.chartCard}>
          {!historic ? (
            <ActivityIndicator size="small" />
          ) : historic.prices?.length ? (
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartText}>📈 Graphique {range}</Text>
              <Text style={styles.chartSubText}>
                {historic.prices.length} points de données
              </Text>
            </View>
          ) : (
            <Text style={styles.loadingText}>Pas de données disponibles.</Text>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Volume 24h</Text>
            <Text style={styles.statValue}>
              {details.volume24h
                ? `${Number(details.volume24h).toLocaleString("fr-FR")} €`
                : "-"}
            </Text>
          </View>

          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Capitalisation</Text>
            <Text style={styles.statValue}>
              {details.marketCap
                ? `${Number(details.marketCap).toLocaleString("fr-FR")} €`
                : "-"}
            </Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}