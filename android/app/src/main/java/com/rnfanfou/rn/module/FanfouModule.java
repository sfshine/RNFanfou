package com.rnfanfou.rn.module;

import android.os.AsyncTask;
import android.text.TextUtils;
import android.util.Log;
import android.util.Pair;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import com.rnfanfou.rn.module.oauth.OAuth;
import org.oauthsimple.model.OAuthToken;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.facebook.react.common.ReactConstants.TAG;

public class FanfouModule extends ReactContextBaseJavaModule {

    private OAuth mXAuth = null;

    public FanfouModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "FanfouModule";
    }

    @ReactMethod
    public void config(ReadableMap map) {
        String apiHost = map.getString("apiHost");
        String apiKey = map.getString("apiKey");
        String apiSecret = map.getString("apiSecret");
        String callbackUrl = map.getString("callbackUrl");
        if (TextUtils.isEmpty(apiHost) || TextUtils.isEmpty(apiKey) || TextUtils.isEmpty(apiSecret) || TextUtils.isEmpty(callbackUrl))
            throw new RuntimeException("config Oatuh failed,check you Oauth configs");
        mXAuth = new OAuth(apiHost, apiKey, apiSecret, callbackUrl);
    }

    @ReactMethod
    public void setToken(String token, String secret) {
        if (mXAuth == null) {
            throw new RuntimeException("not initXAuth");
        }
        mXAuth.setAccessToken(token, secret);
    }

    @ReactMethod
    public void login(final String username, final String password, final Promise promise) {
        if (mXAuth == null) {
            throw new RuntimeException("not initXAuth");
        }
        if (TextUtils.isEmpty(username) || TextUtils.isEmpty(password)) {
            promise.reject("warning", "username or password is empty");
            return;
        }
        new AsyncTask<Void, Void, Void>() {
            @Override
            protected Void doInBackground(Void... voids) {
                OAuthToken token = null;
                try {
                    token = mXAuth.getOAuthAccessToken(username, password);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                Log.d(TAG, "xauth token=" + token);
                if (token != null) {
                    WritableMap map = Arguments.createMap();
                    map.putString("secret", token.getSecret());
                    map.putString("token", token.getToken());
                    promise.resolve(map);
                } else {
                    promise.reject("warning", "token = null");
                }
                return null;
            }
        }.execute();
    }

    @ReactMethod
    public void fetch(final String verbStr, final String url,
                      final ReadableMap params,
                      final ReadableMap fileParams,
                      final Promise promise) {
        if (mXAuth == null) {
            throw new RuntimeException("not initXAuth");
        }
        new AsyncTask<Void, Void, Void>() {
            @Override
            protected Void doInBackground(Void... voids) {
                List<Pair<String, String>> paramsList = getParamList(params);
                List<Pair<String, String>> fileParamsList = getParamList(fileParams);
                try {
                    String result = mXAuth.request(url, verbStr, paramsList, fileParamsList);
                    if (!TextUtils.isEmpty(result)) promise.resolve(result);
                    else promise.reject(new Throwable("操作失败"));
                } catch (Exception e) {
                    e.printStackTrace();
                    promise.reject("warning", Log.getStackTraceString(e));
                }
                return null;
            }
        }.execute();
    }

    private List<Pair<String, String>> getParamList(ReadableMap params) {
        if (params != null) {
            Map map = params.toHashMap();
            List<Pair<String, String>> paramsList = new ArrayList<>();
            for (Object key : map.keySet()) {
                paramsList.add(new Pair<>(String.valueOf(key), String.valueOf(map.get(key))));
            }
            return paramsList;
        }
        return null;
    }
}
