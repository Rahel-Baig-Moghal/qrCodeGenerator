const preview = document.getElementById('preview');
const downloadButton = document.getElementById('downloadButton');
downloadButton.style.display = 'none'; // Hide the download button initially

document.getElementById('submitButton').addEventListener('click', async () => {
  const userId = generateUserId();
  const links = document.getElementById('socialLinks').value.trim();
  const body = JSON.stringify({ userId, links });

  console.log('Request Body:', body); // Log the request body

  try {
    const response = await fetch('https://g2wyhphzc2.execute-api.ap-south-1.amazonaws.com/dev/qrGenerator', {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('Response:', data);

    if (data.message === "QR code uploaded successfully" && data.downloadUrl) {
      const downloadUrl = data.downloadUrl;

      // Display the QR code image in the preview div
      const img = document.createElement('img');
      img.src = downloadUrl;
      preview.appendChild(img);

      // Show the download button
      downloadButton.style.display = 'block';
      downloadButton.addEventListener('click', async () => {
        try {
          const response = await fetch(downloadUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'qr_code.png';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } catch (error) {
          console.error('Failed to download QR code:', error);
        }
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

function generateUserId() {
  return 'user_' + Date.now();
}
