package org.jboss.seam.xwidgets.action;

import java.net.URLDecoder;

import javax.enterprise.context.RequestScoped;
import javax.enterprise.event.Event;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.jboss.seam.remoting.annotations.WebRemote;
import org.jboss.seam.security.Credentials;
import org.jboss.seam.security.Identity;
import org.jboss.seam.security.events.DeferredAuthenticationEvent;
import org.jboss.seam.security.external.api.ResponseHolder;
import org.jboss.seam.security.external.dialogues.DialogueFilter;
import org.jboss.seam.security.external.dialogues.api.DialogueManager;
import org.jboss.seam.security.external.openid.OpenIdRpAuthenticationService;
import org.jboss.seam.security.external.openid.api.OpenIdPrincipal;
import org.jboss.seam.security.external.openid.providers.CustomOpenIdProvider;
import org.jboss.seam.security.external.spi.OpenIdRelyingPartySpi;
import org.jboss.seam.xwidgets.service.OpenIdAjaxAuthenticator;
import org.openid4java.message.MessageException;
import org.openid4java.message.ParameterList;
import org.picketlink.idm.impl.api.PasswordCredential;

/**
 * 
 * @author Shane Bryzak
 *
 */
public @RequestScoped class IdentityAction implements OpenIdRelyingPartySpi {

    @Inject Credentials credentials;
    @Inject Identity identity;
    
    @Inject Instance<OpenIdAjaxAuthenticator> openIdAuthenticator;
    @Inject Instance<CustomOpenIdProvider> customProvider;
    @Inject Instance<OpenIdRpAuthenticationService> authService;
    
    @Inject
    Event<DeferredAuthenticationEvent> deferredAuthentication;    
    
    @Inject
    private DialogueManager manager;
    
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
    public void processOpenIdResponse(String params) throws MessageException {
        
        ParameterList paramList = ParameterList.createFromQueryString(params);
        String dialogueId = paramList.getParameterValue(DialogueFilter.DIALOGUE_ID_PARAM);
        if (dialogueId != null) {
            if (!manager.isExistingDialogue(dialogueId)) {
                // TODO return an error code here
                
                //((HttpServletResponse) response).sendError(HttpServletResponse.SC_BAD_REQUEST, "dialogue " + dialogueId + " does not exist");
                return;
            }
            manager.attachDialogue(dialogueId);
        }        
        
        authService.get().processIncomingMessage(paramList, params, null);
        
        if (manager.isAttached()) {
            manager.detachDialogue();
        }        
    }
    
    public void loginSucceeded(OpenIdPrincipal principal, ResponseHolder responseHolder) {
        openIdAuthenticator.get().success(principal);
        deferredAuthentication.fire(new DeferredAuthenticationEvent());
    }

    public void loginFailed(String message, ResponseHolder responseHolder) {

           // responseHolder.getResponse().sendRedirect(servletContext.getContextPath() + "/AuthenticationFailed.jsf");

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
