import { addLocaleData, InjectedIntl } from 'react-intl';
import * as en from 'react-intl/locale-data/en';
import * as zh from 'react-intl/locale-data/zh';

// Default local_lanΩguage
const DEFAULT_LOCALE = 'zh-CN';
// Define user's language
export const language = navigator.language || (navigator as any).browserLanguage || DEFAULT_LOCALE;
// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

export const getLocal = () => {
  let local:any;
  switch (languageWithoutRegionCode) {
    case 'en':
      local = require('i18n/en-US.json');
      break;
    case 'zh':
      local = require('i18n/zh-CN.json');
      break;
    default:
      local = require('i18n/zh-CN.json');
  }
  return local;
};

export const add_local_data = () => {
  addLocaleData([...en, ...zh]);
};


let INTL:InjectedIntl;
export function resolve_intl(intl:InjectedIntl) {
  INTL = intl;
}

export default function intl() {
  return INTL;
}