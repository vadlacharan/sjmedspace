import prisma from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/dist/server/api-utils"

import { NextResponse } from "next/server"

export async function GET(request,response){
    const supabase = await createClient()

    const { data: { user }} = await supabase.auth.getUser()

    const relatedPublications = await prisma.saved_publications.findMany({
        where:{
            user_id: user.id
        },
        include:{
            publications: true
        }
    })


    

    return NextResponse.json({"savedpublications": relatedPublications})
}





export async function POST(request,response){

    const { id } = await request.json()
    const supabase = await createClient()
    const { data: { user }} = await supabase.auth.getUser()

        const isalreadysaved = await prisma.saved_publications.findFirst({
            where:{
                user_id: user.id,
                publication_id: parseInt(id)
            }
        })

        if(!isalreadysaved){
            const savedPublication = await prisma.saved_publications.create({
                data:{
                    user_id: user.id,
                    publication_id: parseInt(id)
                }
            })
            
           
        }

        const { link} = await prisma.publications.findUnique({
            where:{
                id: parseInt(id)
            }
        })
      
        return NextResponse.json({"link": link})
   
}

export async function PUT(request,response){
    const { id } = await request.json()

    const supabase = await createClient()
    const { data: { user }} = await supabase.auth.getUser()
    
    const presentstatus = await prisma.saved_publications.findFirst({
        where:{
            user_id: user.id,
            publication_id: parseInt(id)
        }
    })


    const updatedSavedPublication = await prisma.saved_publications.update({
        where:{
            id: presentstatus.id
        },
        data:{
            favourite:{
                set: !presentstatus.favourite
            }
        }
    })  

    return NextResponse.json({ "message": "Publication updated successfully"})
}