import { FontAwesome } from "@expo/vector-icons"
import { TextInput } from "react-native-web"

export function MyInput({placeholder,iconName,onchange,value}){
    return 
    <>
    <FontAwesome name={iconName}/>
    <TextInput placeholder={placeholder} onChangeText={onchange} value={value}/>

    </>
}