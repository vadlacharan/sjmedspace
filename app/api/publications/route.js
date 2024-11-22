import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request){
    const publications = await prisma.publications.findMany()
    
    return NextResponse.json({"publications": publications})
}



