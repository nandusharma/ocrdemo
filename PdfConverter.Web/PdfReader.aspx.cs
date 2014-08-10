using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace PdfConverter.Web
{
    public partial class PdfReader : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void UploadButton_Click(object sender, EventArgs e)
        {
            if (FileUploadControl.HasFile)
            {
                try
                {
                    if (FileUploadControl.PostedFile.ContentType == "application/pdf")
                    {
                        if (FileUploadControl.PostedFile.ContentLength < 102400)
                        {
                            string filename = Path.GetFileName(FileUploadControl.FileName);
                            string filePath = Server.MapPath("~/") + filename;

                            FileUploadControl.SaveAs(filePath);
                            StatusLabel.Text = "Upload status: File uploaded!";
                        }
                    }
                }
                catch (Exception ex)
                {
                    StatusLabel.Text = "Upload status: The file could not be uploaded. The following error occured: " + ex.Message;
                }
            }
        }

//        using System.Drawing;
//using System.Drawing.Imaging;

//public class MyHandler : IHttpHandler {

//  public void ProcessRequest(HttpContext context) {

//    Image img = Crop(...); // this is your crop function

//    // set MIME type
//    context.Response.ContentType = "image/jpeg";

//    // write to response stream
//    img.Save(context.Response.OutputStream, ImageFormat.Jpeg);

//  }
//}
    }
}