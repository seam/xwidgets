package org.jboss.seam.xwidgets.action;

import org.jboss.seam.remoting.annotations.WebRemote;
import org.jboss.seam.security.Credentials;
import org.jboss.seam.security.Identity;
import org.picketlink.idm.impl.api.PasswordCredential;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

/**
 * 
 * @author Shane Bryzak
 *
 */
public @RequestScoped class IdentityAction {

    @Inject Credentials credentials;
    @Inject Identity identity;
    
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
