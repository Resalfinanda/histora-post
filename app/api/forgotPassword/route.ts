import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({
        message: "Jika email terdaftar, tautan reset telah dikirim.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: '"Tim Historapost" <historapost@gmail.com>',
      to: email,
      subject: "Permintaan Reset Password - Historapost",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #0f172a; text-align: center;">Reset Password Anda</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            Halo, <br><br>
            Kami menerima permintaan untuk mereset password akun Historapost Anda. Jika Anda merasa tidak melakukan permintaan ini, abaikan saja email ini.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Buat Password Baru
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 14px; text-align: center; margin-top: 20px;">
            Tautan ini hanya berlaku selama 1 jam.<br>
            Jika tombol tidak berfungsi, salin dan tempel tautan berikut ke browser Anda:<br>
            <span style="color: #2563eb;">${resetUrl}</span>
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            &copy; ${new Date().getFullYear()} Historapost. Seluruh hak cipta dilindungi.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "Jika email terdaftar, tautan reset telah dikirim.",
    });
  } catch (error) {
    console.error("Error saat forgot password:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 },
    );
  }
}
