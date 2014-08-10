using Cyotek.GhostScript;
using Cyotek.GhostScript.PdfConversion;
using System;
using System.Collections.Generic;
using System.Drawing;
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
    /// Interaction logic for ReadPdf.xaml
    /// </summary>
    public partial class ReadPdf : Window
    {
        public ReadPdf()
        {
            InitializeComponent();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            txtFilePath.Text = SelectFileToScan();
        }

        private string SelectFileToScan()
        {
            string filename = string.Empty;
            // Configure open file dialog box 
            Microsoft.Win32.OpenFileDialog dlg = new Microsoft.Win32.OpenFileDialog();
            //dlg.DefaultExt = ".jpg"; // Default file extension 
            //dlg.Filter = "Images (.jpg)|*.jpg"; // Filter files by extension 
            dlg.DefaultExt = ".pdf"; // Default file extension 
            dlg.Filter = "Portable Document Format (.pdf)|*.pdf"; // Filter files by extension 

            // Show open file dialog box 
            Nullable<bool> result = dlg.ShowDialog();

            // Process open file dialog box results 
            if (result == true)
            {
                // Open document 
                filename = dlg.FileName;
            }

            return filename;
        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            //txtScanResult.Text = ReadImage(txtFilePath.Text);
            Pdf2ImageSettings settings;

            settings = new Pdf2ImageSettings();
            settings.AntiAliasMode = AntiAliasMode.High;
            settings.Dpi = 300;
            settings.GridFitMode = GridFitMode.Topological;
            settings.ImageFormat = ImageFormat.Png24;
            settings.TrimMode = PdfTrimMode.CropBox;

            Bitmap firstPage = new Pdf2Image(txtFilePath.Text).GetImage(1);

            string outputfilePath = System.IO.Path.Combine(@"D:\temp\", System.IO.Path.GetFileNameWithoutExtension(txtFilePath.Text));

            firstPage.Save(outputfilePath, System.Drawing.Imaging.ImageFormat.Jpeg);
        }

    }
}
