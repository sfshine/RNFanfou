package com.rnfanfou.rn.module.oauth;

import android.text.TextUtils;

import org.oauthsimple.http.OAuthRequest;
import org.oauthsimple.http.Parameter;
import org.oauthsimple.http.Verb;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

final class RequestBuilder {
    private List<Parameter> params;
    private String url;
    private String fileName;
    private File file;
    private Verb verb;

    public RequestBuilder() {
        params = new ArrayList<Parameter>();
        verb = Verb.GET;
    }

    public static RequestBuilder newBuilder() {
        return new RequestBuilder();
    }

    public RequestBuilder url(String url) {
        this.url = url;
        return this;
    }

    public RequestBuilder verb(Verb verb) {
        if (verb != null) {
            this.verb = verb;
        }
        return this;
    }

    public RequestBuilder param(String name, String value) {
        if (!TextUtils.isEmpty(name) && !TextUtils.isEmpty(value)) {
            this.params.add(new Parameter(name, value));
        }
        return this;
    }

    public RequestBuilder file(String name, File value) {
        if (!TextUtils.isEmpty(name) && value != null) {
            this.fileName = name;
            this.file = value;
        }
        return this;
    }

    @Override
    public String toString() {
        final int maxLen = 5;
        StringBuilder builder = new StringBuilder();
        builder.append("RequestBuilder [params=");
        builder.append(params != null ? params.subList(0,
                Math.min(params.size(), maxLen)) : null);
        builder.append(", headers=");
        builder.append(", url=");
        builder.append(url);
        builder.append(", fileName=");
        builder.append(fileName);
        builder.append(", file=");
        builder.append(file);
        builder.append(", verb=");
        builder.append(verb);
        builder.append("]");
        return builder.toString();
    }

    public OAuthRequest build() {
        OAuthRequest request = new OAuthRequest(verb, url);
        if (Verb.GET == verb || Verb.DELETE == verb) {
            for (Parameter param : params) {
                request.addParameter(param);
            }
        } else {
            for (Parameter param : params) {
                request.addParameter(param);
            }
            if (fileName != null && file != null) {
                request.addBody(fileName, file);
            }
        }
        return request;
    }

}
