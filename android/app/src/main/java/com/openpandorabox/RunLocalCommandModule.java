package com.openpandorabox;

import android.util.Log;
import android.content.Intent;
import android.content.ComponentName;
import android.content.Context;
import android.net.Uri;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.HashMap;
import java.util.Map;
import java.io.File;



public class RunLocalCommandModule extends ReactContextBaseJavaModule {

  ReactContext _context;
  RunLocalCommandModule(ReactApplicationContext context) {
    super(context);
    _context = context;
  }

  @Override
  public String getName() {
    return "RunLocalCommandModule";
  }


  @ReactMethod
  public void openDrastic(String rom){
    Intent requestedIntent = new Intent("android.intent.action.MAIN");

    if (requestedIntent != null) {

      //am start --user 0 -n com.dsemu.drastic/.DraSticActivity -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -e GAMEPATH "/sdcard/$FILENAME"
     // am start --user 0 -n org.ppsspp.ppsspp/.PpssppActivity -a android.intent.action.MAIN -e org.ppsspp.ppsspp.Shortcuts "/sdcard/$FILENAME"

      ComponentName componentName = new ComponentName("com.dsemu.drastic", "com.dsemu.drastic.DraSticActivity");

      requestedIntent.setComponent(componentName);
      requestedIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

      requestedIntent.putExtra("GAMEPATH", rom );

      
      _context.startActivity(requestedIntent);

    } else {
      Log.d(
        "ERROR",
        "Error no intent com.dsemu.drastic found"
      );
    }
  }


  @ReactMethod
  public void openPPSSPP(String rom){
    Intent requestedIntent = new Intent("android.intent.action.MAIN");

    if (requestedIntent != null) {

      ComponentName componentName = new ComponentName("org.ppsspp.ppsspp", "org.ppsspp.ppsspp.PpssppActivity");

      requestedIntent.setComponent(componentName);
      requestedIntent.putExtra("org.ppsspp.ppsspp.Shortcut", rom);

      requestedIntent.setData(Uri.parse(new File(rom).toString()));
      requestedIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      
      _context.startActivity(requestedIntent);

    } else {
      Log.d(
        "ERROR",
        "Error no intent org.ppsspp.ppsspp found"
      );
    }
  }

  @ReactMethod
  public void openMupenPlusFZ(String rom){
    Intent requestedIntent = new Intent("android.intent.action.VIEW");

    if (requestedIntent != null) {

      ComponentName componentName = new ComponentName("org.mupen64plusae.v3.fzurita", "paulscode.android.mupen64plusae.SplashActivity");

      requestedIntent.setComponent(componentName);
      requestedIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

      requestedIntent.setData(Uri.parse(new File(rom).toString()));
      
      _context.startActivity(requestedIntent);

    } else {
      Log.d(
        "ERROR",
        "Error no intent org.mupen64plusae.v3.fzurita found"
      );
    }
  }

  @ReactMethod
  public void runRetroArch(String retroArchPackageId, String corePath, String configPath, String romPath){
    // Intent retroArchIntent = getActivity().getPackageManager().getLaunchIntentForPackage(retroArchPackageId);
    Intent retroArchIntent = new Intent("android.intent.category.LAUNCHER");


    if (retroArchIntent != null) {

      ComponentName componentName = new ComponentName(retroArchPackageId, "com.retroarch.browser.retroactivity.RetroActivityFuture");

      retroArchIntent.setComponent(componentName);
      retroArchIntent.putExtra("LIBRETRO",corePath );
      retroArchIntent.putExtra("CONFIGFILE",configPath );
      retroArchIntent.putExtra("ROM",romPath );
      retroArchIntent.putExtra("IME","com.android.inputmethod.latin/.LatinIME" );

      retroArchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

      Log.d(
        "RETRO",
        "Running " + romPath
      );
      
      _context.startActivity(retroArchIntent);

    } else {
      Log.d(
        "RETRO",
        "Error no RetroArch intent found"
      );
    }
  }
}
