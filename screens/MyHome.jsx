import { FlatList, StatusBar, StyleSheet, Text, TextInput, View, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import { getInfos } from '../services/apiCrypto';
import { MyLoading } from '../Components/MyLoading';
import { MyCardCrypto } from '../Components/MyCardCrypto';

export function MyHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [allCryptos, setAllCryptos] = useState([]);
  const [dataCryptos, setDataCryptos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    initialisation();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setDataCryptos(allCryptos);
    } else {
      const filtered = allCryptos.filter((crypto) =>
        crypto.name.toLowerCase().includes(search.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(search.toLowerCase())
      );
      setDataCryptos(filtered);
    }
  }, [search, allCryptos]);

  async function initialisation() {
    const data = await getInfos();
    setAllCryptos(data);
    setDataCryptos(data);
    setIsLoading(false);
  }

  if (isLoading) {
    return <MyLoading />;
  }

  return (
    <ImageBackground style={{flex:1}} source={ImageBack} imageStyle={{opacity:0.5}}>
      <View style={{marginBottom:60}}/>
      <TextInput style={{borderRadius:20}} placeholder='Entre votre crypto' i/>
      
      <FlatList
        data={dataCryptos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => <MyCardCrypto crypto={item} />}
        ListEmptyComponent={<Text style={styles.empty}>Aucun résultat</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E14", paddingHorizontal: 20, paddingTop: 16 },
  title: { fontSize: 26, fontWeight: "800", color: "#F2F4F8", marginBottom: 16 },
  searchWrapper: { marginBottom: 16 },
  searchInput: {
    backgroundColor: "#151A24",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#F2F4F8",
  },
  empty: { color: "#8A93A6", textAlign: "center", marginTop: 40 },
});