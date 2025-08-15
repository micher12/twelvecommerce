"use client"

import { useCallback, useEffect, useState } from "react"
import {
    AlertCircleIcon,
    ImageIcon,
    UploadIcon,
    XIcon,
    PencilIcon,
    ZoomInIcon,
    ZoomOutIcon,
    ArrowLeftIcon,
    Image as LucideImage // Renomeado para evitar conflito com o componente Image do Next/HTML
} from "lucide-react"

import { useFileUpload, formatBytes, FileWithPreview } from "@/hooks/use-file-upload" // Certifique-se que o caminho está correto
import { Button } from "@/components/ui/button"
import {
    Cropper,
    CropperCropArea,
    CropperDescription,
    CropperImage
} from "@/components/ui/cropper"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"

type Area = { x: number; y: number; width: number; height: number }

// Definindo um tipo para o estado da capa para maior clareza
type CapeType = { type: "file" | "url"; identifier: string };

interface ImageUploaderProps {
    setFile: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>
    urls?: string[];
    deleteUrl?: (url: string) => void;
    // O valor do changeCape agora pode ser FileWithPreview ou string
    changeCape?: (item: { type: "file" | "url"; value: FileWithPreview | string }) => void;
    deleteFile?: boolean;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new window.Image()
        image.addEventListener("load", () => resolve(image))
        image.addEventListener("error", (error) => reject(error))
        image.setAttribute("crossOrigin", "anonymous")
        image.src = url
    })

async function getCroppedImg(
    imageSrc: string,
    pixelCrop: Area,
    outputWidth: number = pixelCrop.width,
    outputHeight: number = pixelCrop.height
): Promise<Blob | null> {
    try {
        const image = await createImage(imageSrc)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) return null

        canvas.width = outputWidth
        canvas.height = outputHeight
        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            outputWidth,
            outputHeight
        )

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob)
            }, "image/jpeg")
        })
    } catch (error) {
        console.error("Error in getCroppedImg:", error)
        return null
    }
}

export default function ImageUploaderWithCrop({
    setFile,
    urls = [],
    deleteUrl,
    changeCape,
}: ImageUploaderProps) {
    const maxSizeMB = 1;
    const maxSize = maxSizeMB * 1024 * 1024;
    const maxFiles = 6;

    const [
        { files, isDragging, errors },
        {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
            getInputProps,
            updateFile,
        },
    ] = useFileUpload({
        accept: "image/png,image/jpeg,image/jpg",
        maxSize,
        multiple: true,
        maxFiles,
    });

    const [existingImages, setExistingImages] = useState<string[]>(urls);

    // NOVO: Estado centralizado para controlar a capa
    const [cape, setCape] = useState<CapeType | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [zoom, setZoom] = useState(1);
    const [editingFileId, setEditingFileId] = useState<string | null>(null);

    const previewUrl = files.find((f) => f.id === editingFileId)?.preview || null;

    // Efeito para inicializar a capa a partir das URLs fornecidas
    useEffect(() => {
        // Encontra uma URL inicial que seja a capa (usando sua lógica)
        const initialCapeUrl = urls.find(url => url.includes("capa_"));
        if (initialCapeUrl) {
            setCape({ type: 'url', identifier: initialCapeUrl });
        }
    }, [urls]); // Executa apenas quando as URLs mudam

    useEffect(()=>{
        setFile(files);
    },[files]);


    // NOVO: Função unificada para definir a capa
    const handleSetCape = useCallback((type: "file" | "url", identifier: string) => {
        const newCape: CapeType = { type, identifier };
        setCape(newCape);

        if (changeCape) {
            const value = type === 'file' 
                ? files.find(f => f.id === identifier) 
                : identifier;
            
            if (value) {
                changeCape({ type, value: value});
            }
        }
    }, [changeCape, files]);

    // Efeito para gerenciar a capa quando arquivos são adicionados ou removidos
    useEffect(() => {
        // Se a capa foi removida (ficou null), e ainda existem imagens, precisamos de uma nova capa.
        const capeWasRemoved = !cape;
        const totalImages = existingImages.length + files.length;

        if (capeWasRemoved && totalImages > 0) {
            // Prioriza uma URL existente como capa padrão
            if (existingImages.length > 0) {
                // ALTERADO: Em vez de `setCape`, chamamos `handleSetCape`.
                // Isso garante que a prop `changeCape` seja acionada.
                handleSetCape('url', existingImages[0]);
            } else { // Senão, usa o primeiro arquivo novo
                // ALTERADO: O mesmo aqui.
                handleSetCape('file', files[0].id);
            }
        }
    }, [files, existingImages, cape, handleSetCape]); // 2. Adicionamos handleSetCape às dependências


    const handleCropChange = useCallback((pixels: Area | null) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleEditClick = (fileId: string) => {
        setEditingFileId(fileId);
        setZoom(1);
        setCroppedAreaPixels(null);
        setIsDialogOpen(true);
    };

    const handleApply = async () => {
        if (!previewUrl || !croppedAreaPixels || !editingFileId) return;
        try {
            const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);
            if (!croppedBlob) return;
            const originalFile = files.find((f) => f.id === editingFileId)?.file;
            const newUrl = URL.createObjectURL(croppedBlob);

            updateFile(editingFileId, {
                preview: newUrl,
                file: new File(
                    [croppedBlob],
                    originalFile?.name || "cropped.jpg",
                    { type: "image/jpeg" }
                ),
            });

            setIsDialogOpen(false);
        } catch (error) {
            console.error("Erro ao aplicar crop:", error);
        }
    };

    const handleRemoveExisting = (url: string) => {
        setExistingImages((prev) => prev.filter((img) => img !== url));
        if (deleteUrl) {
            deleteUrl(url);
        }
        
        if (cape?.type === 'url' && cape.identifier === url) {
            setCape(null);
        }
    };

    // ATUALIZADO: Renderização da borda da capa agora usa o estado `cape`
    const isCape = (type: "file" | "url", identifier: string) => {
        return cape?.type === type && cape?.identifier === identifier;
    };


    return (
        <div className="flex flex-col gap-2">
            {/* Área de upload */}
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                data-files={files.length > 0 || existingImages.length > 0 || undefined}
                className="border-input data-[dragging=true]:bg-accent/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center"
            >
                <input {...getInputProps()} className="sr-only" aria-label="Upload image file" />
                {files.length > 0 || existingImages.length > 0 ? (
                    <div className="flex w-full flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="truncate text-sm font-medium">
                                Imagens ({files.length + existingImages.length})
                            </h3>
                            <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={openFileDialog}
                                disabled={files.length + existingImages.length >= maxFiles}
                            >
                                <UploadIcon className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                                Adicionar mais
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {/* Imagens existentes */}
                            {existingImages.map((url) => (
                                <div
                                    key={url}
                                    className={`bg-accent relative aspect-square rounded-md overflow-hidden ${isCape("url", url) ? "border-2 border-primary" : ""}`}
                                >
                                    <img src={url} alt="Imagem existente" className="size-full object-cover" />
                                    <div className="absolute top-1 right-1 flex gap-1">
                                        <Button
                                            onClick={() => handleRemoveExisting(url)}
                                            size="icon"
                                            className="size-6 rounded-full bg-white shadow"
                                            aria-label="Remover imagem"
                                        >
                                            <XIcon className="size-3.5" />
                                        </Button>
                                    </div>
                                    <div className="absolute bottom-1 right-1">
                                        <Button
                                            type="button"
                                            size={"sm"}
                                            onClick={() => handleSetCape("url", url)}
                                            className="text-xs cursor-pointer"
                                            disabled={isCape("url", url)}
                                        >
                                            <LucideImage className="size-3.5" />
                                            {isCape("url", url) ? "Capa" : "Definir capa"}
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {/* Imagens novas */}
                            {files.map((file) => (
                                <div
                                    key={file.id}
                                    className={`bg-accent relative aspect-square rounded-md overflow-hidden ${isCape("file", file.id) ? "border-2 border-primary" : ""}`}
                                >
                                    <img src={file.preview} alt={file.file.name} className="size-full object-cover" />
                                    <div className="absolute top-1 right-1 flex gap-1">
                                        <Button
                                            onClick={() => handleEditClick(file.id)}
                                            size="icon"
                                            type="button"
                                            className="size-6 rounded-full bg-white shadow"
                                            aria-label="Editar imagem"
                                        >
                                            <PencilIcon className="size-3.5" />
                                        </Button>
                                        <Button
                                            onClick={() => removeFile(file.id)}
                                            size="icon"
                                            className="size-6 rounded-full bg-white shadow"
                                            aria-label="Remover imagem"
                                        >
                                            <XIcon className="size-3.5" />
                                        </Button>
                                    </div>
                                    <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                                        {formatBytes(file.file.size)}
                                    </div>
                                    <div className="absolute bottom-1 right-1">
                                        <Button
                                            type="button"
                                            size={"sm"}
                                            onClick={() => handleSetCape("file", file.id)}
                                            className="text-xs cursor-pointer"
                                            disabled={isCape("file", file.id)}
                                        >
                                            <LucideImage className="size-3.5" />
                                            {isCape("file", file.id) ? "Capa" : "Definir capa"}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                        <div className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border">
                            <ImageIcon className="size-4 opacity-60" />
                        </div>
                        <p className="mb-1.5 text-sm font-medium">Arraste suas imagens aqui</p>
                        <p className="text-muted-foreground text-xs">
                            PNG ou JPG (máx. {maxSizeMB}MB)
                        </p>
                        <Button type="button" variant="outline" className="mt-4" onClick={openFileDialog}>
                            <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
                            Selecionar imagens
                        </Button>
                    </div>
                )}
            </div>

            {errors.length > 0 && (
                <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
                    <AlertCircleIcon className="size-3 shrink-0" />
                    <span>{errors[0]}</span>
                </div>
            )}

            {/* Dialog do Cropper */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="gap-0 p-0 sm:max-w-[600px]"> {/* Aumentado para melhor visualização */}
                    <DialogDescription className="sr-only">
                        Crop image dialog
                    </DialogDescription>
                    <DialogHeader className="contents">
                        <DialogTitle className="flex items-center justify-between border-b p-4 pr-10 text-base">
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="-my-1 opacity-60"
                                    onClick={() => setIsDialogOpen(false)}
                                    aria-label="Cancelar"
                                >
                                    <ArrowLeftIcon aria-hidden="true" />
                                </Button>
                                <span>Recortar imagem</span>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    {previewUrl && (
                        <Cropper
                            className="h-96 sm:h-[450px]"
                            image={previewUrl}
                            zoom={zoom}
                            onCropChange={handleCropChange}
                            onZoomChange={setZoom}
                        >
                            <CropperDescription />
                            <CropperImage />
                            <CropperCropArea />
                        </Cropper>
                    )}
                    <DialogFooter className="border-t px-4 py-6 flex-col sm:flex-row sm:justify-between gap-4 sm:gap-8">
                        <div className="mx-auto flex w-full max-w-xs items-center gap-4">
                            <ZoomOutIcon className="opacity-60" size={16} />
                            <Slider
                                value={[zoom]}
                                min={1}
                                max={3}
                                step={0.1}
                                onValueChange={(v) => setZoom(v[0])}
                            />
                            <ZoomInIcon className="opacity-60" size={16} />
                        </div>
                        <Button
                            type="button"
                            className="w-full sm:w-auto"
                            onClick={handleApply}
                            disabled={!previewUrl}
                        >
                            Aplicar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}