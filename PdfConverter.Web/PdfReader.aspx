<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PdfReader.aspx.cs" Inherits="PdfConverter.Web.PdfReader" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:FileUpload ID="FileUploadControl" runat="server" />
            <asp:Button runat="server" ID="UploadButton" Text="Upload" OnClick="UploadButton_Click" />
            <br />
            <br />
            <asp:Label runat="server" ID="StatusLabel" Text="Upload status: " />
        </div>
    </form>
</body>
</html>
