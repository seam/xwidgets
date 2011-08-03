package org.jboss.seam.xwidgets.service;

import java.io.IOException;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jboss.seam.security.Identity;
import org.jboss.seam.security.external.openid.OpenIdAuthenticator;
import org.jboss.seam.security.external.openid.providers.CustomOpenIdProvider;

/**
 * 
 * @author Shane Bryzak
 *
 */
public class OpenIdServlet extends HttpServlet {
    private static final long serialVersionUID = 452757481741970216L;
    
    private static final String REQUEST_PATH_LOGIN = "/login";
    private static final String REQUEST_PATH_CALLBACK = "/callback";
    
    private static final byte[] CALLBACK_CONTENT = ("<html><head></head>" +
      "<body onload=\"window.opener.xwHandleOpenIdResponse((window.location+'').split('?')[1]);window.close();\">" +
      "</body></html>").getBytes();
    
    public static final String PARAM_PROVIDER = "provider";
    public static final String PARAM_OPENID_URL = "openIdUrl";
    
    private ServletConfig servletConfig;
    
    @Inject Identity identity;
    @Inject OpenIdAjaxAuthenticator authenticator;
    @Inject Instance<CustomOpenIdProvider> customProvider;
    
    public void init(ServletConfig config) throws ServletException {
        this.servletConfig = config;
    }    
    
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) 
       throws ServletException, IOException
    {
        String pathInfo = request.getPathInfo();

        // Nothing to do
        if (pathInfo == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "No path information provided");
            return;
        }

        if (pathInfo.startsWith(servletConfig.getServletContext().getContextPath())) {
            pathInfo = pathInfo.substring(servletConfig.getServletContext().getContextPath().length());
        }

        if (REQUEST_PATH_LOGIN.equals(pathInfo)) {        
            
            if (request.getParameter(PARAM_PROVIDER) != null) {
                authenticator.setProviderCode(request.getParameter(PARAM_PROVIDER));
            } else if (request.getParameter(PARAM_OPENID_URL) != null) {
                CustomOpenIdProvider custom = customProvider.get();
                custom.setUrl(request.getParameter(PARAM_OPENID_URL));
                authenticator.setProviderCode(custom.getCode());
            }
            
            identity.setAuthenticatorClass(OpenIdAuthenticator.class);
            identity.login();
        } else if (REQUEST_PATH_CALLBACK.equals(pathInfo)) {
            response.getOutputStream().write(CALLBACK_CONTENT);
            response.getOutputStream().flush();            
        }
    }
}
