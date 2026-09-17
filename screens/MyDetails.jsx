import { ImageBackground, Text, Image, View, TouchableOpacity, Dimensions } from "react-native";
import background from "../assets/background.png"
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getHistoric, getDetails } from "../services/apiCrypto";
import { LineChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

export function MyDetails({route}){
    const crypt = route.params.crypto;
    const nav = useNavigation();
    const [dataTime, setdataTime] = useState([]);
    const [details, setDetails] = useState(null);
    const [tendance, setTendance] = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(()=>{
        init();
    },[])

    async function init(){
        const value = await getHistoric(crypt.id);
        if (!value) return;

        const resultat = value.prices.map((p) => {
            const price = Number(p[1]);
            const jour = new Date(p[0]);
            const label = jour.toLocaleDateString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
            });
            return { label, value: price };
        });

        // calcul de tendance sur la période récupérée
        const first = value.prices[0][1];
        const last = value.prices[value.prices.length - 1][1];
        const variation = ((last - first) / first) * 100;
        setTendance(variation);

        setdataTime(resultat);
        setDetails(await getDetails(crypt.id));
        setIsReady(true);
    }

    return(
        <ImageBackground source={background} style={{flex:1,paddingTop:60,paddingHorizontal:10}} imageStyle={{opacity:0.6}}>
            <TouchableOpacity onPress={()=> nav.goBack()}>
                <FontAwesome name="chevron-left" size={20}/>
            </TouchableOpacity>

            <View style={{alignItems:"center"}}>
                <Image source={{uri:crypt.logo}} style={{height:70,width:70}}/>
                <Text style={{fontSize:25,fontWeight:"bold"}}>{crypt.name}</Text>
            </View>

            {isReady ? (
                <LineChart
                    key={dataTime.length}
                    data={dataTime}
                    animationDuration={800}
                    width={screenWidth - 40}
                    height={250}
                    yAxisLabelSuffix=" €"
                    rotateLabel={true}
                    xAxisLabelTextStyle={{fontSize:9}}
                    yAxisTextStyle={{fontSize:10}}
                    isAnimated={true}
                    thickness={2}
                />
            ) : (
                <Text style={{textAlign:"center", marginTop:20}}>Chargement du graphique...</Text>
            )}

            {details && (
                <View style={{alignItems:"center", marginTop:10}}>
                    <Text style={{fontSize:16}}>{details.symbol?.toUpperCase()}</Text>
                    <Text style={{fontSize:20,fontWeight:"600"}}>{details.currentPrice} €</Text>
                    <Text style={{color: details.priceChange24h >= 0 ? "green" : "red"}}>
                        {details.priceChange24h?.toFixed(2)} % (24h)
                    </Text>
                    <Text style={{fontSize:12}}>Volume 24h : {details.volume24h?.toLocaleString("fr-FR")} €</Text>

                    {tendance !== null && (
                        <Text style={{marginTop:6, fontWeight:"600", color: tendance >= 0 ? "green" : "red"}}>
                            Tendance sur la période : {tendance >= 0 ? "Hausse" : "Baisse"} ({tendance.toFixed(2)} %)
                        </Text>
                    )}
                </View>
            )}
        </ImageBackground>
    )
}