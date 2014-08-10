using Cyotek.GhostScript;
using Cyotek.GhostScript.PdfConversion;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace PdfConverter.Api.Controllers
{
    [EnableCors(origins: "http://localhost:22611", headers: "*", methods: "*")]
    public class ProjectController : ApiController
    {
        [HttpPost]
        public async Task<IHttpActionResult> Upload(string project)
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            string temp = HttpContext.Current.Server.MapPath("~/App_Data/uploads");
            var provider = new MultipartFormDataStreamProvider(temp);
            var CurrentContext = HttpContext.Current;
            var task = await Request.Content.ReadAsMultipartAsync(provider).
                ContinueWith<IHttpActionResult>(t =>
                {
                    if (t.IsFaulted || t.IsCanceled)
                    {
                        Request.CreateErrorResponse(HttpStatusCode.InternalServerError, t.Exception);
                    }

                    if (provider.FileData.Count > 0)
                    {
                        var file = provider.FileData[0];
                        var raw = file.LocalFileName;
                        var guid = Guid.NewGuid();

                        int pageCount = 0;

                        var path = Path.Combine(CurrentContext.Server.MapPath("~/App_Data/uploads"), file.LocalFileName);

                        var imageString = GetPage(project, path, 1, out pageCount);

                        return Ok(new { imageData = imageString, pageCount = pageCount, localFileName = file.LocalFileName });
                    }
                    else
                    {
                        return BadRequest();
                    }
                });

            return task;
        }

        private string GetPage(string projectName, string pdfPath, int pageNumber, out int pageCount)
        {
            byte[] imageBytes = null;
            string response = null;
            string prefix = "data:image/png;base64,";

            Pdf2ImageSettings settings;

            settings = new Pdf2ImageSettings();
            settings.AntiAliasMode = AntiAliasMode.High;
            settings.Dpi = 300;
            settings.GridFitMode = GridFitMode.Topological;
            settings.ImageFormat = ImageFormat.Png24;
            settings.TrimMode = PdfTrimMode.CropBox;

            if (File.Exists(pdfPath))
            {
                var converter = new Pdf2Image(pdfPath);

                Bitmap pageImage = converter.GetImage(pageNumber);

                pageCount = converter.PageCount;

                var jpegFilePath = Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/pages"), projectName + pageNumber + ".jpg");

                pageImage.Save(jpegFilePath, System.Drawing.Imaging.ImageFormat.Jpeg);

                ImageConverter imgConverter = new ImageConverter();
                imageBytes = (byte[])imgConverter.ConvertTo(pageImage, typeof(byte[]));
                response = Convert.ToBase64String(imageBytes);

                return prefix + response;
            }

            // if the file path is invalid set the page count to zero
            pageCount = 0;

            return "";
        }

        [HttpPost]
        public IHttpActionResult GetPdfPage(string project, int pageNumber, string localFileName)
        {
            int pageCount = 0;

            var imageString = GetPage(project, localFileName, pageNumber, out pageCount);

            return Ok(new { imageData = imageString });
                    
        }

        [HttpPost]
        public IHttpActionResult ImageToText(string project, int pageNumber, int x1, int y1, int x2, int y2)
        {
            var result = string.Empty;
            var jpegFilePath = Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/pages"), project + pageNumber + ".jpg");

            if (File.Exists(jpegFilePath))
            {
                var newLocation = Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/pages"), project + DateTime.Now.Ticks + ".jpg");

                Bitmap img = new Bitmap(jpegFilePath);
                Rectangle srcRect = new Rectangle(x1, y1, x2 - x1, y2 - y1);
                Bitmap cropped = (Bitmap)img.Clone(srcRect, img.PixelFormat);
                //cropped.SetResolution(300, 300);
                cropped.Save(newLocation);
                img.Dispose();
                cropped.Dispose();

                result = ReadImage(newLocation);

            }

            return Ok(result);
        }

        private string ReadImage(string imagePath)
        {
            string imageText = string.Empty;
            try
            {
                // Grab Text From Image
                MODI.Document ModiObj = new MODI.Document();
                ModiObj.Create(imagePath);
                ModiObj.OCR(MODI.MiLANGUAGES.miLANG_ENGLISH, true, true);

                //Retrieve the text gathered from the image
                MODI.Image ModiImageObj = (MODI.Image)ModiObj.Images[0];

                //System.Console.WriteLine(ModiImageObj.Layout.Text);

                imageText = ModiImageObj.Layout.Text;

                ModiObj.Close();
            }
            catch (Exception ex)
            {
                imageText = "** Unable to read text from the image **";
                //throw new Exception(ex.Message);
            }

            return imageText;
        }
    }
}
