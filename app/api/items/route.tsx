import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Fetch all items from the database
        const items = await prisma.item.findMany();

        // Encode the data to base64
        const encodedData = Buffer.from(JSON.stringify(items)).toString('base64');

        // Return the encoded data
        return NextResponse.json(encodedData);
    } catch (error) {
        console.error('Error fetching items:', error);
        return NextResponse.json({ error: 'Error fetching items' }, { status: 500 });
    }
}
