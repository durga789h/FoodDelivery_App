import { NextResponse } from 'next/server';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
import Redis from 'ioredis';

const phoneUtil = PhoneNumberUtil.getInstance();
const redis = new Redis(process.env.REDIS_URL);

export async function POST(req) {
  try {
    const body = await req.json(); // Parses JSON body
    const { mobile, otp } = body;

    if (!mobile || !otp) {
      return NextResponse.json({ error: "Mobile number or OTP is missing" }, { status: 400 });
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

    // Retrieve OTP data from Redis
    const otpDataString = await redis.get(formattedMobile);
    //console.log(otpDataString);
    if (!otpDataString) {
      return NextResponse.json({ error: "OTP not found" }, { status: 404 });
    }

    const otpData = JSON.parse(otpDataString);
  
    const { otp: storedOtp, expirationTime } = otpData;

    if (Date.now() > expirationTime) {
      await redis.del(formattedMobile);
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    if (String(storedOtp) !== otp.trim()) {
    
      //console.log(otp.trim());
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // OTP is valid
    await redis.del(formattedMobile); // Optionally delete OTP after successful verification

    return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error in verifying OTP", error: error.message }, { status: 500 });
  }
}