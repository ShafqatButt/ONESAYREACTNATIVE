import {images} from '../../res/images';
import Strings from '../../string_key/Strings';

// const BUTTONS = ['Home', 'Discover', 'Chat', 'Reel', 'Trips', 'Hub', 'Dummy'];
// const TAB_NAMES: string[] = [
//   'Home',
//   'Discover',
//   'Chat',
//   'Reel',
//   'Trips',
//   'Hub',
//   'Dummy',
// ];

// function getTabIcon(index) {
//   let icon;
//   switch (index) {
//     case 0:
//       icon = images.home_ic;
//       break;
//     case 1:
//       icon = images.search_ic;
//       break;
//     case 2:
//       icon = images.chat_ic;
//       break;
//     case 3:
//       icon = images.reels_ic;
//       break;
//     case 4:
//       icon = images.ic_add;
//       break;
//     case 5:
//       icon = images.network_ic;
//       break;
//     default:
//       return images.ic_add;
//   }

//   return icon;
// }

const BUTTONS = [
  Strings.home,
  Strings.chat,
  'PlusButton',
  Strings.trip,
  Strings.hub,
];
const TAB_NAMES = ['Home', 'Chat', 'PlusButton', 'Trip', 'Hub'];

// 'Discover',

function getTabIcon(index) {
  let icon;
  switch (index) {
    case 0:
      icon = images.home_ic;
      break;
    // case 1:
    //   icon = images.search_ic;
    //   break;
    case 1:
      icon = images.chat_ic;
      break;
    case 2:
      icon = images.add_full;
      break;
    case 3:
      icon = images.ic_done;
      break;
    case 4:
      icon = images.network_ic;
      break;
    default:
      return images.ic_add;
  }

  return icon;
}

export {getTabIcon, BUTTONS, TAB_NAMES};
