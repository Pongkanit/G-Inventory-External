// pages/upload.js
import { ChangeEvent, SetStateAction, useState } from "react";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import React from "react";
import { Input } from "@/components/ui/input";

type ImageDivProps = {
    image: string | undefined;
    setImage: (imageUrl: string) => void;
    isUploading: (isUploading: boolean) => void;
    sku: string | undefined
    disabled: boolean
};
export default function ImageDiv({
    image,
    setImage,
    isUploading,
    disabled,
    sku
}: ImageDivProps) {
    const [imageUrl, setimageUrl] = useState<string | undefined>(undefined);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [error, setError] = useState<string | undefined>(undefined);
    React.useEffect(() => {
        setimageUrl(image);
    }, [image]);
    // Handle image
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        setSelectedFiles(files);
    };
    const uploadFile = async () => {
        if (selectedFiles && selectedFiles.length > 0) {
            isUploading(true);
            setError(undefined);
            const file = selectedFiles[0]
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                try {
                    const response = await fetch("/api/upload", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ file: reader.result, fileName: sku + "." + file.type.split("/")[1] }),
                    });

                    const data = await response.json();
                    if (response.ok) {
                        setImage(data.result.url);
                        setimageUrl(data.result.url);
                    } else {
                        setError(data.error);
                    }
                } catch (error) {
                    setError((error as Error).message);
                } finally {
                    isUploading(false);
                    const inputElement =
                        document.querySelector<HTMLInputElement>(
                            'input[name="imageUploadder"]'
                        );
                    if (inputElement) {
                        inputElement.value = "";
                        setimageUrl(undefined);
                    }
                }
            };
        }
    };

    return (
        <div className="flex flex-col w-full gap-4">
            <Label className="flex justify-center items-center">
                {imageUrl ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-center w-auto h-60 object-contain">
                            <Image
                                src={imageUrl}
                                alt="Kanban"
                                width={0}
                                height={0}
                                sizes="50vw"
                                style={{
                                    width: "auto",
                                    height: "100%",
                                }}
                            />
                        </div>
                        <div className="w-full h-10">
                            <Input
                                name="imageUploadder"
                                type="file"
                                onChange={handleFileChange}
                                disabled={disabled}
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-64">
                        <Input
                            name="imageUploadder"
                            type="file"
                            onChange={handleFileChange}
                            disabled={disabled}
                            className="w-full h-full"
                        />
                    </div>
                )}
            </Label>
            <Button
                type="button"
                onClick={uploadFile}
                disabled={!selectedFiles}
            >
                upload
            </Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
