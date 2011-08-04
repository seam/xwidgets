package org.jboss.seam.xwidgets.dto;

import java.util.HashMap;
import java.util.Map;

import javax.enterprise.context.RequestScoped;

/**
 * Used to transfer authentication related data back to the client
 * 
 * @author Shane Bryzak
 *
 */
public @RequestScoped class AuthResult {
    
    private boolean success;
    private Map<String,Object> attributes;
    
    public AuthResult() {
        attributes = new HashMap<String,Object>();
    }
    
    public void setSuccess(boolean value) {
        this.success = value;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public Map<String,Object> getAttributes() {
        return attributes;
    }
    
    public void setAttribute(String name, Object value) {
        attributes.put(name, value);
    }
    
    
}
