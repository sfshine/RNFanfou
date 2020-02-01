package com.rnfanfou.rn.module.oauth;

import android.text.TextUtils;
import android.util.Log;
import android.util.Pair;

import org.oauthsimple.builder.ServiceBuilder;
import org.oauthsimple.builder.api.FanfouApi;
import org.oauthsimple.http.OAuthRequest;
import org.oauthsimple.http.Response;
import org.oauthsimple.http.Verb;
import org.oauthsimple.model.OAuthToken;
import org.oauthsimple.model.SignatureType;
import org.oauthsimple.oauth.OAuthService;

import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.net.URI;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static com.facebook.react.common.ReactConstants.TAG;


public final class OAuth {
    private static String API_HOST = "";
    private static String API_KEY = "";
    private static String API_SECRET = "";
    private static String CALLBACK_URL = "";

    private static final boolean DEBUG = true;
    private OAuthService mOAuthService;
    private OAuthToken mAccessToken;

    public OAuth(String apiHost, String apiKey, String apiSecret, String callbackUrl) {
        API_HOST = apiHost;
        API_KEY = apiKey;
        API_SECRET = apiSecret;
        CALLBACK_URL = callbackUrl;
        ServiceBuilder builder = new ServiceBuilder().apiKey(API_KEY)
                .apiSecret(API_SECRET).callback(CALLBACK_URL)
                .provider(FanfouApi.class)
                .signatureType(SignatureType.HEADER_OAUTH);
        if (DEBUG) {
            builder.debug().debugStream(new PrintStream(System.out));
        }
        mOAuthService = builder.build();
    }

    public OAuthToken getOAuthAccessToken(String username, String password)
            throws IOException {
        return mOAuthService.getAccessToken(username, password);
    }

    public void setAccessToken(String token, String secret) {
        if (TextUtils.isEmpty(token) || TextUtils.isEmpty(secret)) {
            Log.e(TAG, "token or secret is null");
            return;
        }
        this.mAccessToken = new OAuthToken(token, secret);
    }


    public String request(String url, String verbStr, List<Pair<String, String>> params, List<Pair<String, String>> fileParams) throws IOException {
        RequestBuilder builder = RequestBuilder.newBuilder();
        builder.url(makeUrl(url)).verb(getVerbFromString(verbStr));
        if (params != null && !params.isEmpty()) {
            for (Pair<String, String> param : params) {
                builder.param(param.first, param.second);
            }
        }
        if (fileParams != null && !fileParams.isEmpty()) {
            File file = new File(URI.create(fileParams.get(0).second));
            if (file.exists()) {
                builder.file(fileParams.get(0).first, file);
            } else {
                Log.e(TAG, "file not exist, ignore : " + fileParams.get(0).second);
            }
        }
        return fetch(builder);
    }

    /**
     * @param builder
     * @return
     */
    private String fetch(final RequestBuilder builder) throws IOException {
        OAuthRequest request = builder.build();
        request.setConnectTimeout(5, TimeUnit.SECONDS);
        request.setReadTimeout(10, TimeUnit.SECONDS);
        if (mAccessToken != null) {
            mOAuthService.signRequest(mAccessToken, request);
        }
        Response response = request.send();
        int statusCode = response.getCode();
        String body = response.getBody();
        if (DEBUG) {
            Log.d(TAG, "fetch() statusCode=" + statusCode + " builder=" + builder);
        }
        if (statusCode >= 200 && statusCode < 300) {
            return body;
        }
        return null;
    }

    // GET, POST, PUT, DELETE, HEAD, OPTIONS, TRACE, PATCH
    private Verb getVerbFromString(String verb) {
        if (TextUtils.equals(verb, "GET")) {
            return Verb.GET;
        } else if (TextUtils.equals(verb, "POST")) {
            return Verb.POST;
        } else if (TextUtils.equals(verb, "PUT")) {
            return Verb.PUT;
        } else if (TextUtils.equals(verb, "DELETE")) {
            return Verb.DELETE;
        } else if (TextUtils.equals(verb, "HEAD")) {
            return Verb.HEAD;
        } else if (TextUtils.equals(verb, "TRACE")) {
            return Verb.TRACE;
        } else if (TextUtils.equals(verb, "PATCH")) {
            return Verb.PATCH;
        }
        throw new RuntimeException("verb: " + verb + " not support!");
    }

    private String makeUrl(String url) {
        return new StringBuilder().append(API_HOST).append(url).append(".json")
                .toString();
    }

}
