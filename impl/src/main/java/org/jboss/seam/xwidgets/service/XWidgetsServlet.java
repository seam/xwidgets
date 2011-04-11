package org.jboss.seam.xwidgets.service;

import java.io.IOException;

import javax.servlet.Servlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

/**
 * Main entry point for XWidgets service integration
 * 
 * @author Shane Bryzak
 *
 */
public class XWidgetsServlet implements Servlet
{
   public void init(ServletConfig config) throws ServletException
   {
      // TODO Auto-generated method stub
      
   }

   public ServletConfig getServletConfig()
   {
      // TODO Auto-generated method stub
      return null;
   }

   public void service(ServletRequest req, ServletResponse res)
         throws ServletException, IOException
   {
      System.out.println("Received request");
      res.getOutputStream().write("XWidgets Service".getBytes());
      res.getOutputStream().flush();
   }

   public String getServletInfo()
   {
      // TODO Auto-generated method stub
      return null;
   }

   public void destroy()
   {
      // TODO Auto-generated method stub
      
   }

}
