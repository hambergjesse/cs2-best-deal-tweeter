import got from "got";
import crypto from "crypto";
import OAuth from "oauth-1.0a";
import qs from "querystring";
import readline from "readline";
import dotenv from "dotenv";
dotenv.config();

const { createInterface } = readline;

const consumer_key = process.env.CONSUMER_KEY;
const consumer_secret = process.env.CONSUMER_SECRET;
const accessTokenURL = "https://api.twitter.com/oauth/access_token";
const endpointURL = "https://api.twitter.com/2/tweets";

console.log(consumer_key);
console.log(consumer_secret);

const oauth = OAuth({
  consumer: {
    key: consumer_key,
    secret: consumer_secret,
  },
  signature_method: "HMAC-SHA1",
  hash_function: (baseString, key) =>
    crypto.createHmac("sha1", key).update(baseString).digest("base64"),
});

async function input(prompt) {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function requestToken() {
  const authHeader = oauth.toHeader(
    oauth.authorize({
      url: "https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write",
      method: "POST",
    })
  );
  const response = await got.post({
    url: "https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write",
    headers: { Authorization: authHeader["Authorization"] },
  });
  return qs.parse(response.body);
}

async function accessToken(oAuthRequestToken, verifier) {
  const authHeader = oauth.toHeader(
    oauth.authorize({
      url: accessTokenURL,
      method: "POST",
    })
  );
  const response = await got.post(
    `${accessTokenURL}?oauth_verifier=${verifier}&oauth_token=${oAuthRequestToken.oauth_token}`,
    {
      headers: { Authorization: authHeader["Authorization"] },
    }
  );
  return qs.parse(response.body);
}

async function tweetBestDeal(tweetData) {
  const { oauth_token, oauth_token_secret } = getStoredAccessTokens();
  const token = {
    key: oauth_token,
    secret: oauth_token_secret,
  };
  const authHeader = oauth.toHeader(
    oauth.authorize(
      {
        url: endpointURL,
        method: "POST",
      },
      token
    )
  );
  const response = await got.post(endpointURL, {
    json: tweetData,
    responseType: "json",
    headers: {
      Authorization: authHeader["Authorization"],
      "user-agent": "v2CreateTweetJS",
      "content-type": "application/json",
      accept: "application/json",
    },
  });
  return response.body;
}

function hasStoredAccessTokens() {
  return process.env.ACCESS_TOKEN && process.env.ACCESS_TOKEN_SECRET;
}

function getStoredAccessTokens() {
  return {
    oauth_token: process.env.ACCESS_TOKEN,
    oauth_token_secret: process.env.ACCESS_TOKEN_SECRET,
  };
}

export async function createTweet(data) {
  try {
    let oAuthAccessToken;
    if (hasStoredAccessTokens()) {
      oAuthAccessToken = getStoredAccessTokens();
    } else {
      const oAuthRequestToken = await requestToken();
      const authorizeURL = new URL("https://api.twitter.com/oauth/authorize");
      authorizeURL.searchParams.append(
        "oauth_token",
        oAuthRequestToken.oauth_token
      );
      console.log("Please go here and authorize:", authorizeURL.href);
      const pin = await input("Paste the PIN here: ");
      oAuthAccessToken = await accessToken(oAuthRequestToken, pin.trim());
    }
    const response = await tweetBestDeal(data);
    console.dir(response, { depth: null });
    return response;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
