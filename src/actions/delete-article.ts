"use server"

import { prisma } from "@/lib/prisma";
import { articlesDeleted } from "@/lib/metrics";
import { revalidatePath } from "next/cache";
 
export const deleteArticle = async (articleId: string) => {

    await prisma.articles.delete({
        where: {
            id: articleId,
        },
    });
    articlesDeleted.inc();
    revalidatePath("/dashboard");
}