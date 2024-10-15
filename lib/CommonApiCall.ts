import { google } from "googleapis";
export const Auth = new google.auth.GoogleAuth({
    // keyFile: "google_credentials.json", // replace with the path to your credentials file
    credentials:{
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY      
      },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const Sheet = google.sheets({ version: "v4", auth: Auth });
export const SpreadsheetId = process.env.GOOGLE_SHEET_ID;
