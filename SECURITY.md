# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.1.x   | :white_check_mark: |
| < 1.1   | :x:                |

## Security Features

MaxiEditor includes multiple layers of security protection:

### 1. XSS Protection

**DOMPurify Integration:**
- Primary sanitization using DOMPurify library
- Whitelist-based tag and attribute filtering
- Automatic removal of dangerous protocols (javascript:, data:, vbscript:)
- Custom fallback sanitizer for environments without DOMPurify

**Configuration:**
```javascript
const editor = MaxiEditor.set('#editor', {
  sanitize: true, // Enabled by default
  // Custom sanitizer options
  sanitizerOptions: {
    allowedTags: ['p', 'b', 'i', 'u', 'a'],
    allowedAttributes: {
      'a': ['href', 'title']
    }
  }
});
```

### 2. Input Validation

All user inputs are validated:
- **URLs:** Blocked dangerous protocols (javascript:, data:, vbscript:, file:)
- **Numbers:** Range validation for table dimensions, etc.
- **Files:** Type and size validation for uploads
- **Colors:** Format validation for color inputs

### 3. Content Security Policy (CSP)

**Recommended CSP Headers:**

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  img-src 'self' data: https:;
  font-src 'self' https://cdn.jsdelivr.net;
  connect-src 'self';
```

**Explanation:**
- `script-src`: Allows scripts from same origin and CDN (for Bootstrap Icons)
- `style-src`: Allows styles from same origin and CDN
- `img-src`: Allows images from same origin, data URLs, and HTTPS
- `font-src`: Allows fonts from CDN
- `unsafe-inline`: Required for dynamically generated styles (can be removed with nonce-based CSP)

**Stricter CSP (Recommended for Production):**

```
Content-Security-Policy:
  default-src 'none';
  script-src 'self' 'nonce-{RANDOM}';
  style-src 'self' 'nonce-{RANDOM}';
  img-src 'self' data: https:;
  font-src 'self' https://cdn.jsdelivr.net;
```

### 4. Paste Sanitization

All pasted content is automatically sanitized:
```javascript
// Automatically enabled
editor._handlePaste(event); // Sanitizes HTML before insertion
```

### 5. Attribute Sanitization

Special handling for dangerous attributes:
- Event handlers (`onclick`, `onerror`, etc.) are removed
- `href` and `src` attributes are validated
- Style properties are whitelisted

## Reporting a Vulnerability

If you discover a security vulnerability in MaxiEditor, please report it by:

1. **DO NOT** open a public issue
2. Email the maintainer at: [security contact email]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

**Response Time:**
- Initial response: Within 48 hours
- Fix timeline: Depends on severity
  - Critical: 1-7 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-90 days

## Security Best Practices

### For Developers

1. **Always Enable Sanitization:**
   ```javascript
   const editor = MaxiEditor.set('#editor', {
     sanitize: true // Default, but be explicit
   });
   ```

2. **Validate Server-Side:**
   ```javascript
   // Client-side sanitization is not enough!
   // Always validate and sanitize on the server
   ```

3. **Use HTTPS:**
   - Always serve MaxiEditor over HTTPS
   - Prevents man-in-the-middle attacks

4. **Implement CSP:**
   - Add Content-Security-Policy headers
   - Use nonce-based CSP for stricter security

5. **Keep Dependencies Updated:**
   ```bash
   npm audit
   npm update
   ```

6. **Limit Allowed Tags:**
   ```javascript
   const editor = MaxiEditor.set('#editor', {
     sanitizerOptions: {
       allowedTags: ['p', 'b', 'i', 'u'] // Minimal set
     }
   });
   ```

### For Users

1. **Don't Trust User Input:**
   - Always sanitize content from untrusted sources
   - Validate on both client and server

2. **Regular Updates:**
   - Keep MaxiEditor updated to latest version
   - Subscribe to security advisories

3. **Monitor Content:**
   - Implement content moderation
   - Log suspicious activities

## Known Security Considerations

### 1. `contentEditable` Limitations

The editor uses `contentEditable`, which has some inherent limitations:
- Browser inconsistencies in handling
- Potential for DOM clobbering attacks (mitigated by sanitization)

**Mitigation:** All content is sanitized before insertion and on paste.

### 2. Third-Party Dependencies

**DOMPurify:**
- Well-maintained, security-focused library
- Regularly audited
- Recommended for production use

**Bootstrap Icons:**
- Loaded from CDN
- Only CSS, no JavaScript
- Low security risk

### 3. Local Storage

MaxiEditor does not use local storage by default. If you implement auto-save:
- Sanitize before storing
- Sanitize after retrieving
- Consider encryption for sensitive content

## Security Checklist

Before deploying MaxiEditor in production:

- [ ] Sanitization enabled (`sanitize: true`)
- [ ] CSP headers configured
- [ ] HTTPS enabled
- [ ] Server-side validation implemented
- [ ] Dependencies updated (`npm audit`)
- [ ] Allowed tags/attributes reviewed
- [ ] Input validation for all user inputs
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Security testing performed

## Security Testing

### XSS Testing

Test with these payloads (should all be sanitized):

```javascript
// Script injection
'<script>alert("XSS")</script>'

// Event handler
'<img src=x onerror=alert("XSS")>'

// JavaScript protocol
'<a href="javascript:alert(\'XSS\')">Click</a>'

// Data URL
'<a href="data:text/html,<script>alert(\'XSS\')</script>">Click</a>'

// Style injection
'<div style="background:url(javascript:alert(\'XSS\'))">Test</div>'
```

All should be sanitized to safe HTML.

### Automated Testing

```bash
# Run security audit
npm audit

# Run tests
npm test

# Check for vulnerabilities
npm run test:security
```

## Updates and Patches

Security updates are released as:
- **Patch versions** (x.x.X) for security fixes
- **Minor versions** (x.X.x) for security enhancements
- **Major versions** (X.x.x) may include breaking security changes

Subscribe to releases on GitHub to stay informed.

## Additional Resources

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Web Security Basics](https://developer.mozilla.org/en-US/docs/Web/Security)

## License

This security policy is part of the MaxiEditor project and is licensed under the MIT License.
