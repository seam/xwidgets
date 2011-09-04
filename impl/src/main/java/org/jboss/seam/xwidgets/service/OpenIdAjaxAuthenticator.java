package org.jboss.seam.xwidgets.service;

import java.io.Serializable;

import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import org.jboss.seam.security.Authenticator;
import org.jboss.seam.security.external.openid.OpenIdAuthenticator;

/**
 * Basically the same as OpenIdAuthenticator, however this one captures the URL that the
 * user would be typically redirected to to authenticate.
 * 
 * @author Shane Bryzak
 *
 */
public @SessionScoped class OpenIdAjaxAuthenticator extends OpenIdAuthenticator implements Authenticator, Serializable {
    private static final long serialVersionUID = 7737243244817530552L;
    
    @Inject private HttpServletResponse httpResponse;
    
    private MockResponse mockResponse;
    
    private String redirectUrl;
    
    private class MockResponse extends HttpServletResponseWrapper {
        
        public MockResponse(HttpServletResponse response) {
            super(response);
        }

        private String redirectUrl;
        
        @Override
        public void sendRedirect(String url) {
            this.redirectUrl = url;
        }
        
        public String getRedirectUrl() {
            return redirectUrl;
        }
    }
    
    public void authenticate() {
        this.mockResponse = new MockResponse(httpResponse);
        super.authenticate();
        this.redirectUrl = mockResponse.getRedirectUrl();
    }
    
    @Override 
    public HttpServletResponse getResponse() {
        return this.mockResponse;
    }
    
    public String getRedirectUrl() {
        return this.redirectUrl;
    }

}
