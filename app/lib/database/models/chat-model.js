import mongoose from 'mongoose';

const { Schema } = mongoose;

const chatSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export { Chat };
