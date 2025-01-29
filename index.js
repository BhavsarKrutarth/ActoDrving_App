/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./sources/App";
import { name as appName } from "./app.json";
import { Text, TextInput } from "react-native";
import "./sources/src/i18n/i18n.config";

if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;
}

AppRegistry.registerComponent(appName, () => App);
