using Cyotek.GhostScript;
using Cyotek.GhostScript.PdfConversion;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace PdfConverter.Mvc.Controllers
{
    public class HomeController : ApiController
    {
        /*[HttpPost]
        public ActionResult Index(HttpPostedFileBase file)
        {
            byte[] imageBytes = null;
            string response = null;
            string prefix = "data:image/png;base64,";
            if (file.ContentLength > 0)
            {
                var fileName = Path.GetFileName(file.FileName);
                var path = Path.Combine(CurrentContext.Server.MapPath("~/App_Data/uploads"), fileName);
                file.SaveAs(path);

                Pdf2ImageSettings settings;

                settings = new Pdf2ImageSettings();
                settings.AntiAliasMode = AntiAliasMode.High;
                settings.Dpi = 300;
                settings.GridFitMode = GridFitMode.Topological;
                settings.ImageFormat = ImageFormat.Png24;
                settings.TrimMode = PdfTrimMode.CropBox;

                Bitmap firstPage = new Pdf2Image(path).GetImage(1);

                //var jpegFilePath = Path.Combine(Server.MapPath("~/App_Data/uploads"), fileName);

                //jpegFilePath = Path.GetFileNameWithoutExtension(jpegFilePath) + DateTime.Now.Ticks + ".jpeg";

                //firstPage.Save(jpegFilePath, System.Drawing.Imaging.ImageFormat.Jpeg);

                ImageConverter converter = new ImageConverter();
                imageBytes = (byte[])converter.ConvertTo(firstPage, typeof(byte[]));
                response = Convert.ToBase64String(imageBytes);
            }

            //return base.File(imageBytes, "image/jpeg");
            return Content(prefix + response);
        }*/

        [System.Web.Mvc.HttpPost]
        public async Task<IHttpActionResult> Upload(string project)
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            string temp = HttpContext.Current.Server.MapPath("~/Uploads/Temp");
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
                        //var file = provider.FileData[0];
                        //var raw = file.LocalFileName;
                        //var extension = file.Headers.ContentDisposition.FileName.Substring(file.Headers.ContentDisposition.FileName.LastIndexOf('.')).TrimEnd('\"');
                        //var index = raw.IndexOf("Uploads");
                        //var filename = raw.Substring(index) + extension;
                        //Directory.CreateDirectory(CurrentContext.Server.MapPath("~/Uploads") + "/" + ownerType + "/" + ownerId);
                        //string newLocation = CurrentContext.Server.MapPath("~/Uploads/" + ownerType + "/" + ownerId);
                        //var guid = Guid.NewGuid();
                        //string newFullPath = "Uploads/" + ownerType + "/" + ownerId + "/" + guid;
                        //Bitmap img = new Bitmap(raw);
                        //Rectangle srcRect = new Rectangle(cropx, cropy, cropx2 - cropx, cropy2 - cropy);
                        //Bitmap cropped = (Bitmap)img.Clone(srcRect, img.PixelFormat);
                        //cropped.Save(newLocation + "/" + guid + extension);
                        //img.Dispose();
                        //cropped.Dispose();

                        //if (ownerId != 0)
                        //{
                        //    switch (ownerType.ToUpper())
                        //    {
                        //        case "HOTEL":
                        //            var hotel = Uow.Hotels.Find(ownerId);
                        //            if (hotel == null)
                        //                throw new ArgumentException("ownerId not a valid hotel", "ownerId");
                        //            hotel.LogoUrlRaw = newFullPath + extension;
                        //            break;
                        //        case "AIRLINE":
                        //            var airline = Uow.Airlines.Find(ownerId);
                        //            if (airline == null)
                        //                throw new ArgumentException("ownerId not a valid airline", "ownerId");
                        //            airline.LogoUrlRaw = newFullPath + extension;
                        //            break;
                        //        case "HANDLER":
                        //            var handler = Uow.Handlers.Find(ownerId);
                        //            if (handler == null)
                        //                throw new ArgumentException("ownerId not a valid handler", "ownerId");
                        //            handler.LogoUrlRaw = newFullPath + extension;
                        //            break;
                        //        default:
                        //            throw new ArgumentException("OwnerType not recognised", "ownerType");
                        //    }

                        //    Uow.Commit(User.Identity.GetUserId());

                        //    string cacheKey = "PROFILE" + ownerType + ownerId;
                        //    imageCache.Remove(cacheKey);
                        //}

                        return Ok("");
                    }
                    else
                    {
                        return BadRequest();
                    }
                });

            return task;
        }
    }
}
