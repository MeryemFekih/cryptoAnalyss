import { ImageBackground, Text,Image, View, TouchableOpacity } from "react-native";
import background from "../assets/background.png"
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getHistoric } from "../services/apiCrypto";
import { LineChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

export function MyDetails({route}){
    const crypt = route.params.crypto;
    const nav = useNavigation();
    const [dataTime,setdataTime]= useState([]);
    const [details,setDetails] = useState([])

    useEffect(()=>{
        init();

    },[])

     async function init(){
        const value = await getHistoric(crypt.id);
        console.log(value);
        const resulat = value.market_caps.map((p)=>{
            const price = Number(p[1]);
            const jour = new Date(p[0]);
            const label = jour.toLocaleDateString("fr-FR",{
                //day :"2-digit",
                //month :"2-digit",
                hour :"2-digit",
                minute :"2-digit",
                

            });
            return {label : label, value :price}
           

        });
         setdataTime(resulat);
         setDetails(await getDetails(crypt.id));
     }
 
    return(
        <ImageBackground source={background} style={{flex:1,paddingTop:60,paddingHorizontal:10}} imageStyle={{opacity:0.6}}>
            <TouchableOpacity onPress={()=>{
                nav.goBack();

            }}>
                    <FontAwesome name="chevron-left" size={20}/>

            </TouchableOpacity>
        
            <View style={{alignItems:"center"}}>
                <Image source={{uri:crypt.logo}} style={{height : 70,width:70}}/>
            <Text style={{fontSize:25,fontWeight:"bold",}}>{crypt.name}</Text>

            </View>
            <LineChart
            key={dataTime.length}
            data={dataTime}
            animationDuration={10000}
            width={500}
            height={300}
            yAxisLabelSuffix=" €"
            rotateLabel = {true}
            xAxisLabelTexts={{fontSize:10}}
            yAxisLabelTexts={{fontSize : 10}}
            isAnimated ={true}
            
            
            />
             {details && (
            <View style={{alignItems:"center", marginTop:10}}>
                <Text style={{fontSize:16}}>{details.symbol?.toUpperCase()}</Text>
                <Text style={{fontSize:20,fontWeight:"600"}}>{details.currentPrice} €</Text>
                <Text style={{color: details.priceChange24h >= 0 ? "green" : "red"}}>
                    {details.priceChange24h?.toFixed(2)} %
                </Text>
                <Text style={{fontSize:12}}>Volume 24h : {details.volume24h}</Text>
            </View>
        )}
           
            

        </ImageBackground>
        
    )
}
