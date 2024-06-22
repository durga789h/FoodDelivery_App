import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { Chat } from '../../../lib/database/models/chat-model';
import { verifyToken } from '../../../lib/utils/auth/auth';

const connectionStr = process.env.MONGODB_URL;

async function connectToDatabase() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(connectionStr, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();

        const user = await verifyToken(req);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized Access',
            }, { status: 401 });
        }

        const { content, recipientId } = await req.json();

        const message = new Chat({
            senderId: user._id,
            receiverId: recipientId,
            message: content,
            timestamp: new Date(),
        });

        await message.save();

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully',
            data: message,
        }, { status: 200 });
    } catch (error) {
        console.error('Error sending message:', error);

        return NextResponse.json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        }, { status: 500 });
    }
}

