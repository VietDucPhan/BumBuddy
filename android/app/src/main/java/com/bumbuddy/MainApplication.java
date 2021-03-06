package com.bumbuddy;

import android.app.Application;

import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.reactnative.photoview.PhotoViewPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.admob.RNFirebaseAdMobPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.shahenlibrary.RNVideoProcessingPackage;

import java.util.Arrays;
import java.util.List;

import co.apptailor.googlesignin.RNGoogleSigninPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }
    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
            new PhotoViewPackage(),
            new RNCWebViewPackage(),
            new RNFetchBlobPackage(),
              new RNFirebasePackage(),
              new RNGoogleSigninPackage(),
              new FBSDKPackage(mCallbackManager),
              new MapsPackage(),
              new ImagePickerPackage(),
              new RNFirebaseMessagingPackage(),
              new RNFirebaseAdMobPackage(),
              new RNFirebaseNotificationsPackage(),
              new RNVideoProcessingPackage()
      );
    }



    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
