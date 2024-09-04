const createEmailTemplate = (fName, lName,) => {


  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Sheria AI</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #DED8C4;
        color: #000;
      }
      .email-container {
        max-width: 600px;
        margin: auto;
        background: #FFF;
        padding: 20px;
        border-radius: 8px;
      }
      .email-header {
        background: #343541;
        color: #DED8C4;
        padding: 10px 20px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      .email-body {
        padding: 20px;
        color: #000;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        margin: 20px 0;
        background: #343541;
        color: #FFF;
        text-decoration: none;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h1>Welcome to Sheria AI</h1>
      </div>
      <div class="email-body">
        <p>Dear ${fName} ${lName},</p>
        <p>Thank you for joining our waitlist. We're excited to have you on board and look forward to introducing you to Sheria AI, a powerful AI-powered legal assistant created by Augmentin AI.</p>
        <p>As a valuable member of our community, we will keep you updated on our progress and notify you as soon as our product is ready for launch.</p>
        <a href="https://augmentinai.com" class="button">Learn More</a>
        
        <!-- Add Twitter and LinkedIn links here -->
        <p>Follow us on social media:</p>
        <a href="https://twitter.com/AugmentinAI" target="_blank">Augmentin on Twitter</a>
        <br>
        <a href="https://www.linkedin.com/company/augmentin-ai" target="_blank">Augmentin on LinkedIn</a>
        
        <p>Warm regards,</p>
        <p>The Augmentin AI Team</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

export default createEmailTemplate;
