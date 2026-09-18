import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";

export function MyCardCrypto({ crypto }) {
  const nav = useNavigation();
  const isPositif = crypto.percent >= 0;
  const accent = isPositif ? "#2ED9A3" : "#FF5C7A";

  const priceLisible = (crypto.price ?? 0).toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const lisibleNombre = (crypto.volume ?? 0).toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const formatPercent = (crypto.percent ?? 0).toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <TouchableOpacity
      onPress={() =>
        nav.navigate("detail", { id: crypto.id, logo: crypto.logo })
      }
    >
      <View style={styles.card}>
        <View style={styles.left}>
          <Image source={{ uri: crypto.logo }} style={styles.logo} />
          <View>
            <Text style={styles.name}>{crypto.name}</Text>
            <Text style={styles.symbol}>{crypto.symbol?.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.right}>
          <Text style={styles.price}>{priceLisible} €</Text>
          <Text style={styles.volume}>Vol. {lisibleNombre}</Text>
          <View style={[styles.badge, { backgroundColor: accent + "22" }]}>
            <FontAwesome name={isPositif ? "caret-up" : "caret-down"} size={12} color={accent} />
            <Text style={[styles.badgeText, { color: accent }]}>{formatPercent} %</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#151A24",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1 },
  logo: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  name: { fontSize: 15, fontWeight: "700", color: "#F2F4F8" },
  symbol: { fontSize: 12, color: "#8A93A6", marginTop: 2 },
  right: { alignItems: "flex-end" },
  price: { fontSize: 15, fontWeight: "700", color: "#F2F4F8" },
  volume: { fontSize: 11, color: "#8A93A6", marginTop: 2 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 4,
  },
  badgeText: { fontSize: 11, fontWeight: "600" },
});