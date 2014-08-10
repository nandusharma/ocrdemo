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
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OcrDemo
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
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
            dlg.FileName = "Document"; // Default file name 
            //dlg.DefaultExt = ".jpg"; // Default file extension 
            //dlg.Filter = "Images (.jpg)|*.jpg"; // Filter files by extension 
            dlg.DefaultExt = ".tif"; // Default file extension 
            dlg.Filter = "Images (.tif)|*.tif"; // Filter files by extension 

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
            txtScanResult.Text = ReadImage(txtFilePath.Text);
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
                throw new Exception(ex.Message);
            }

            return imageText;
        }
    }
}
