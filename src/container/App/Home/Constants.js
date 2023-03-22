import {images} from '../../../res/images';
import Strings from '../../../string_key/Strings';

const MENU_ITEMS: string[] = [
  Strings.my_missions,
  Strings.my_wallet,
  // 'Events',
  // 'My Orders',
  // 'Hub',
  // 'Campaigns',
  // 'Leaderboard',
  Strings.buy_coins,
  Strings.add_friends,
  // 'My Livestreams',
  Strings.market_place,
  Strings.contributors,

  // 'Categories',

  // 'Share Profile',
];

function getTabIcon(index) {
  let icon;
  switch (index) {
    case 0:
      icon = images.home_ic;
      break;
    case 1:
      icon = images.call_ic;
      break;
    case 3:
      icon = images.chat_ic;
      break;
    case 4:
      icon = images.network_ic;
      break;
    case 9:
      icon = images.market_place;
      break;
    case 10:
      icon = images.market_place;
      break;

    default:
      return images.ic_add;
  }

  return icon;
}

export {getTabIcon, MENU_ITEMS};
