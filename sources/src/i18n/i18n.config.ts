import i18next from 'i18next';
import { initReactI18next } from "react-i18next";
import {en ,gu, hi, zh, fr, ur,es, pa} from './Translations/index';

const resources = {
    en: { translation: en },
    gu: { translation: gu },
    hi: { translation: hi },
    zh: { translation: zh },
    fr: { translation: fr },
    ur: { translation: ur },
    es: { translation: es },
    pa: { translation: pa },
};

i18next.use(initReactI18next).init({
    debug: true,
    lng: 'en',
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    resources,
})

export default i18next;