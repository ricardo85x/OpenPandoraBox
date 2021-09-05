package com.openpandorabox;

import com.facebook.react.ReactActivity;

import android.view.KeyEvent; 
import com.github.kevinejohn.keyevent.KeyEventModule; 
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "OpenPandoraBox";
  }

  @Override 
  public boolean onKeyDown(int keyCode, KeyEvent event) {
   // uncomment if you want to prevent long press 
   // if (event.getRepeatCount() == 0) {
        KeyEventModule.getInstance().onKeyDownEvent(keyCode, event);
   // }
    super.onKeyDown(keyCode, event);
    return true;
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
  
}
