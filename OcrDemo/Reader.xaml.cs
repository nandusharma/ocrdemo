using Ghostscript.NET;
using Ghostscript.NET.Processor;
using Ghostscript.NET.Viewer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace OcrDemo
{
    /// <summary>
    /// Interaction logic for Reader.xaml
    /// </summary>
    public partial class Reader : Window
    {
        private GhostscriptViewer _viewer;
        private GhostscriptVersionInfo _gsVersion = GhostscriptVersionInfo.GetLastInstalledVersion();

        public Reader()
        {
            InitializeComponent();

            _viewer = new GhostscriptViewer();

            _viewer.DisplaySize += new GhostscriptViewerViewEventHandler(_viewer_DisplaySize);
            _viewer.DisplayUpdate += new GhostscriptViewerViewEventHandler(_viewer_DisplayUpdate);
            _viewer.DisplayPage += new GhostscriptViewerViewEventHandler(_viewer_DisplayPage);
        }

        private void _viewer_DisplayPage(object sender, GhostscriptViewerViewEventArgs e)
        {
            throw new NotImplementedException();
        }

        private void _viewer_DisplayUpdate(object sender, GhostscriptViewerViewEventArgs e)
        {
            throw new NotImplementedException();
        }

        private void _viewer_DisplaySize(object sender, GhostscriptViewerViewEventArgs e)
        {
            throw new NotImplementedException();
        }


        private void SaveImage()
        {
            GhostscriptVersionInfo _gs_version_info = GhostscriptVersionInfo.GetLastInstalledVersion(GhostscriptLicense.GPL | GhostscriptLicense.AFPL, GhostscriptLicense.GPL);
            GhostscriptProcessor processor = new GhostscriptProcessor(_gs_version_info, true);

            List<string> switches = new List<string>();
            switches.Add("-empty");
            switches.Add("-dQUIET");
            switches.Add("-dSAFER");
            switches.Add("-dBATCH");
            switches.Add("-dNOPAUSE");
            switches.Add("-dEPSCrop");
            switches.Add("-sDEVICE=pdfwrite");
           // switches.Add("-sOutputFile=" + variantPath);
            switches.Add("-f");
            //switches.Add(originalPath);
            processor.StartProcessing(switches.ToArray(), null);
        }
    }
}
