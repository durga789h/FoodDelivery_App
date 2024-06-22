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

export async function GET(req) {
    try {
        await connectToDatabase();

        const user = await verifyToken(req);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized Access',
            }, { status: 401 });
        }

        let messages;
        if (user.role === 1) {
            messages = await Chat.find();
        } else {
            messages = await Chat.find({ $or: [{ senderId: user._id }, { receiverId: user._id }] });
        }

        return NextResponse.json({
            success: true,
            messages,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        }, { status: 500 });
    }
}
