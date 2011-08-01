package org.jboss.seam.xwidgets.action;

import org.jboss.seam.remoting.annotations.WebRemote;
import org.jboss.seam.security.Credentials;
import org.jboss.seam.security.Identity;
import org.jboss.seam.security.external.openid.OpenIdAjaxAuthenticator;
import org.jboss.seam.security.external.openid.providers.CustomOpenIdProvider;
import org.picketlink.idm.impl.api.PasswordCredential;

import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Instance;
import javax.enterprise.inject.spi.BeanManager;
import javax.inject.Inject;

/**
 * 
 * @author Shane Bryzak
 *
 */
public @RequestScoped class IdentityAction {

    @Inject Credentials credentials;
    @Inject Identity identity;
    @Inject BeanManager beanManager;
    
    @Inject Instance<OpenIdAjaxAuthenticator> openIdAuthenticator;
    @Inject Instance<CustomOpenIdProvider> customProvider;
    
    @WebRemote
    public String openIdLogin(String provider, String openIdUrl) {
        OpenIdAjaxAuthenticator authenticator = openIdAuthenticator.get();
        
        if (provider != null) {
            authenticator.setProviderCode(provider);
        }
        
        if (openIdUrl != null) {
            CustomOpenIdProvider custom = customProvider.get();
            custom.setUrl(openIdUrl);
            authenticator.setProviderCode(custom.getCode());
        }
        
        identity.setAuthenticatorClass(OpenIdAjaxAuthenticator.class);
        identity.login();
        
        return authenticator.getRedirectUrl();
    }
    
    @WebRemote
    public String login(String username, String password) {
        credentials.setUsername(username);
        credentials.setCredential(new PasswordCredential(password));
        
        return identity.login();
    }
    
    @WebRemote
    public void logout() {
        identity.logout();        
    }
}
