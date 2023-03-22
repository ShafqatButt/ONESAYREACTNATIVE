package com.app.buzzmi;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
  public static final String TAG = MainActivity.class.getName();
  public static final String EVENT_DEEPLINK_CLICKED = "onDeeplinkClicked";
  private static final int CODE_DRAW_OVER_OTHER_APP_PERMISSION = 2084;
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Onessay2";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);  // here
    super.onCreate(savedInstanceState);
    handleIntent();
    requireDrawOverlayPermission();
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
    handleIntent();
    requireDrawOverlayPermission();
  }

  private void handleIntent() {
    // ATTENTION: This was auto-generated to handle app links.
    Intent appLinkIntent = getIntent();
//    String appLinkAction = appLinkIntent.getAction();
    Uri appLinkData = appLinkIntent.getData();
    Log.i(TAG, "referralCode (native) : " + appLinkData);
  //  appLinkData.getQueryParameter("code")
    if (appLinkData != null) {
      String referralCode = appLinkData.getQueryParameter("code");

      Log.i(TAG, "referralCode (native) : " + referralCode);

      WritableMap params = Arguments.createMap();
      params.putString("link", appLinkData.toString());
      params.putString("code", referralCode);
      sendEvent(params);
    }
  }


  //Ask draw overlay permission
  void requireDrawOverlayPermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
      Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + getPackageName()));
      startActivityForResult(intent, CODE_DRAW_OVER_OTHER_APP_PERMISSION);
    } else {
      //TODO: Permission granted
    }
  }


  private void sendEvent(@Nullable WritableMap params) {
    new Handler().postDelayed(() -> {
      ReactInstanceManager reactInstanceManager = getReactNativeHost().getReactInstanceManager();
      ReactContext reactContext = reactInstanceManager.getCurrentReactContext();

      if(reactContext != null) {
        Log.i(TAG, "1. Sending event to react-native...");
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(EVENT_DEEPLINK_CLICKED, params);
      } else {
        Log.i(TAG, "2. Sending event to react-native...");
        reactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
          @Override
          public void onReactContextInitialized(ReactContext context) {
            context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(EVENT_DEEPLINK_CLICKED, params);
            reactInstanceManager.removeReactInstanceEventListener(this);
          }
        });
      }
    }, 4 * 1000);
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the rendered you wish to use (Fabric or the older renderer).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }



    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }
}
