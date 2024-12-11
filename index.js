/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './sources/App';
import {name as appName} from './app.json';
import './sources/src/i18n/i18n.config';

AppRegistry.registerComponent(appName, () => App);
