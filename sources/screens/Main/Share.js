import {useNetInfo} from "@react-native-community/netinfo";
import {View, Text} from "react-native";
import { Colors } from "../../theme";

export default function Share() {
  const netInfo = useNetInfo();
console.log('netInfo.isConnected', netInfo.isConnected);
  
  return (
    <View>
      <Text style={{color: Colors.Black}}>Type: {netInfo.type}</Text>
      <Text style={{color: Colors.Black}}>Is Connected? {netInfo.isConnected}</Text>
    </View>
  );
}

