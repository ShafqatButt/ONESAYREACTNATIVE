import {Platform, Dimensions} from 'react-native';

const d = Dimensions.get('window');
export const IS_IPHONE_X = !!(
  Platform.OS === 'ios' &&
  (d.height > 800 || d.width > 800)
);

export const DEFAULT_HEADER_HEIGHT = Platform.select({
  ios: 44,
  default: 56,
});
