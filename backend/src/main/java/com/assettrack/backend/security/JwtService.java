package com.assettrack.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expiration-ms}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMs = expirationMs;
    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}


//package com.assettrack.backend.security;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Service;
//
//import javax.crypto.Mac;
//import javax.crypto.spec.SecretKeySpec;
//import java.nio.charset.StandardCharsets;
//import java.util.Base64;
//import java.util.Date;
//
///**
// * Pure-Java JWT implementation using HMAC-SHA256.
// * No external JWT library needed — uses only javax.crypto which is built into the JDK.
// *
// * Token format: base64url(header).base64url(payload).base64url(signature)
// */
//@Service
//public class JwtService {
//
//    @Value("${jwt.secret}")
//    private String secret;
//
//    @Value("${jwt.expiration}")
//    private long expiration; // milliseconds (e.g. 86400000 = 24 hours)
//
//    // ─── Generate Token ───────────────────────────────────────────────────────
//
//    public String generateToken(UserDetails userDetails) {
//        long now = System.currentTimeMillis();
//        long exp = now + expiration;
//
//        String header  = base64Url("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
//        String payload = base64Url(
//                "{\"sub\":\"" + userDetails.getUsername() + "\"," +
//                        "\"iat\":" + (now / 1000) + "," +
//                        "\"exp\":" + (exp / 1000) + "}"
//        );
//
//        String signingInput = header + "." + payload;
//        String signature    = sign(signingInput);
//
//        return signingInput + "." + signature;
//    }
//
//    // ─── Validate Token ───────────────────────────────────────────────────────
//
//    public boolean isTokenValid(String token, UserDetails userDetails) {
//        try {
//            String username = extractUsername(token);
//            return username != null
//                    && username.equals(userDetails.getUsername())
//                    && !isTokenExpired(token);
//        } catch (Exception e) {
//            return false;
//        }
//    }
//
//    // ─── Extract Username (email) ─────────────────────────────────────────────
//
//    public String extractUsername(String token) {
//        try {
//            String payload = decodePayload(token);
//            // Parse "sub":"value" from the JSON string
//            return extractField(payload, "sub");
//        } catch (Exception e) {
//            return null;
//        }
//    }
//
//    // ─── Private Helpers ──────────────────────────────────────────────────────
//
//    private boolean isTokenExpired(String token) {
//        try {
//            String payload = decodePayload(token);
//            String expStr  = extractField(payload, "exp");
//            long   expTime = Long.parseLong(expStr) * 1000L;
//            return new Date().after(new Date(expTime));
//        } catch (Exception e) {
//            return true; // treat as expired if we can't read it
//        }
//    }
//
//    private String decodePayload(String token) {
//        String[] parts       = token.split("\\.");
//        String   payloadB64  = parts[1];
//        // Restore standard Base64 padding
//        int pad = payloadB64.length() % 4;
//        if (pad == 2) payloadB64 += "==";
//        else if (pad == 3) payloadB64 += "=";
//        byte[] decoded = Base64.getUrlDecoder().decode(payloadB64);
//        return new String(decoded, StandardCharsets.UTF_8);
//    }
//
//    /** Minimal JSON field extractor — finds "key":"value" or "key":number */
//    private String extractField(String json, String key) {
//        String search = "\"" + key + "\":";
//        int start = json.indexOf(search);
//        if (start < 0) return null;
//        start += search.length();
//        char first = json.charAt(start);
//        int end;
//        if (first == '"') {
//            // String value
//            start++;
//            end = json.indexOf('"', start);
//            return json.substring(start, end);
//        } else {
//            // Numeric value
//            end = start;
//            while (end < json.length() && (Character.isDigit(json.charAt(end)) || json.charAt(end) == '-')) {
//                end++;
//            }
//            return json.substring(start, end);
//        }
//    }
//
//    private String sign(String data) {
//        try {
//            Mac mac = Mac.getInstance("HmacSHA256");
//            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
//            byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
//            return Base64.getUrlEncoder().withoutPadding().encodeToString(raw);
//        } catch (Exception e) {
//            throw new RuntimeException("JWT signing failed", e);
//        }
//    }
//
//    private String base64Url(String input) {
//        return Base64.getUrlEncoder()
//                .withoutPadding()
//                .encodeToString(input.getBytes(StandardCharsets.UTF_8));
//    }
//}