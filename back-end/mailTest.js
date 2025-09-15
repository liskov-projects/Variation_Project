import nodemailer from "nodemailer";
import {config} from "dotenv";

config();

const transporter = nodemailer.createTransport({
    host: "smtp-relay.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.NOREPLY_APP_PASSWORD
    }
})

async function testEmail(){
    try {
        if(!process.env.MAIL_AUTH_USER || !process.env.NOREPLY_APP_PASSWORD) {
            throw new Error("Missing email credentials - check your .env file");
        }
        await transporter.sendMail({
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDR}>`,
            to: "verrafalenko@gmail.com",
            subject: "Test email config",
            html: "<p>Email config is working<p>"
        });
    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Email failed:", error);
  }
}

testEmail();