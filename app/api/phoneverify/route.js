import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
import Redis from 'ioredis';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const phoneUtil = PhoneNumberUtil.getInstance();
const redis = new Redis(process.env.REDIS_URL);

export async function POST(req) {
  try {
    const body = await req.json(); // Parses JSON body
    const { mobile } = body;

    if (!mobile) {
      return NextResponse.json({ error: "Mobile number is not added" }, { status: 400 });
    }

    // Validate and format the phone number to E.164 format
    let formattedMobile;
    try {
      const number = phoneUtil.parse(mobile);
      if (!phoneUtil.isValidNumber(number)) {
        throw new Error('Invalid phone number');
      }
      formattedMobile = phoneUtil.format(number, PhoneNumberFormat.E164);
    } catch (e) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
  
    // Set OTP expiration time (current time + 5 minutes)
    const expirationTime = Date.now() + 5 * 60 * 1000;
    const otpData = { otp, expirationTime };
    await redis.set(formattedMobile, JSON.stringify(otpData), 'EX', 300); // 300 seconds = 5 minutes

    // Send OTP using Twilio
    await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedMobile
    });
  
    return NextResponse.json({ message: "OTP sent successfully", otp }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error in sending OTP", error: error.message }, { status: 500 });
  }
}