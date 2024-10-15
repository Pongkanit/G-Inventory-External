import { authOptions } from "@/lib/auth";
import ImageKit from "imagekit";
import { getServerSession } from "next-auth/next";

export async function POST(request: Request): Promise<Response> {
    const session = await getServerSession(authOptions);

    if (session) {
        try {
            const {
                IMAGEKIT_PUBLIC_KEY,
                IMAGEKIT_PRIVATE_KEY,
                IMAGEKIT_URL_ENDPOINT,
            } = process.env;
            if (
                IMAGEKIT_PUBLIC_KEY &&
                IMAGEKIT_PRIVATE_KEY &&
                IMAGEKIT_URL_ENDPOINT
            ) {
                console.log("Environment variables are set");

                const { file, fileName } = await request.json(); // Assuming the body is JSON

                if (!file) {
                    return new Response(
                        JSON.stringify({ error: "No file provided" }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" },
                        }
                    );
                }

                const imagekit = new ImageKit({
                    publicKey: IMAGEKIT_PUBLIC_KEY,
                    privateKey: IMAGEKIT_PRIVATE_KEY,
                    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
                });

                console.log("Initializing ImageKit");

                const uploadResult = await new Promise<any>(
                    (resolve, reject) => {
                        imagekit.upload(
                            {
                                file,
                                folder: "/g-inventory/" + process.env.GOOGLE_SHEET_ID,
                                fileName: fileName,
                                useUniqueFileName: false
                            },
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );
                    }
                );
                const detail = await imagekit.getFileDetails(uploadResult.fileId)
                const result = {
                    url: detail.url + "?updatedAt=" + (new Date(detail.updatedAt)).getTime()
                }
                return new Response(JSON.stringify({ result: result }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            } else {
                return new Response(
                    JSON.stringify({
                        error: `Method ${request.method} not allowed`,
                    }),
                    {
                        status: 405,
                        headers: {
                            Allow: "POST",
                            "Content-Type": "application/json",
                        },
                    }
                );
            }
        } catch (err) {
            return new Response(
                JSON.stringify({ error: "Failed to upload file" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
    } else {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
}
