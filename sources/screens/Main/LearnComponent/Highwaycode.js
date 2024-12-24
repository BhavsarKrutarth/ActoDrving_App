import { StyleSheet, Text, View } from "react-native";
import WebView from "react-native-webview";
import { useTheme } from "../../../common/RNThemeContext";
import { useState } from "react";
import { RNContainer, RNLoader } from "../../../common";
import { hp } from "../../../theme";
import { QuestionsReport } from "../../../components";

export default function highwaycode() {
  const { selectedLanguage } = useTheme();
  const [loading, setLoading] = useState(true);
  //console.log(selectedLanguage);

  // {
  //   loading && <RNLoader />;
  // }
  // if (loading === true) {
  //   return <RNLoader visible={loading} />;
  // }
  return (
    <RNContainer isLoading={loading}>
      <WebView
        source={{
          uri: `https://ukdriving.actoscript.com/${
            selectedLanguage === "en" ? "index" : selectedLanguage
          }.html`,
        }}
        //style={{flex: 1}}
        //onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        //onLoadEnd={() => setLoading(false)}
      />
    </RNContainer>
  );
}

const styles = StyleSheet.create({});
