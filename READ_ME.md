## One's Say (React Native)

> ⚠️ Keep backup of the onesayfe/patches folder all the time ⚠️

### Run the project:

    yarn install && cd ios && pod install && cd .. && yarn start

### Do not forget to run following before adding/removing new libs...

    yarn patch-package @sendbird/calls-react-native
    yarn patch-package @sendbird/uikit-chat-hooks
    yarn patch-package @sendbird/uikit-react-native
    yarn patch-package @sendbird/uikit-react-native-foundation
    yarn patch-package @sendbird/uikit-utils
    yarn patch-package react-native-audio-recorder-player
    yarn patch-package react-native-emoji-board

### Or all in single line...

    yarn patch-package react-native-audio-recorder-player && yarn patch-package @sendbird/calls-react-native && yarn patch-package @sendbird/uikit-chat-hooks && yarn patch-package @sendbird/uikit-react-native && yarn patch-package @sendbird/uikit-react-native-foundation && yarn patch-package @sendbird/uikit-utils

### Single line cmd for @SendBird...

    yarn patch-package @sendbird/calls-react-native && yarn patch-package @sendbird/uikit-chat-hooks && yarn patch-package @sendbird/uikit-react-native && yarn patch-package @sendbird/uikit-react-native-foundation && yarn patch-package @sendbird/uikit-utils
