"use client"

import type React from "react"
import {
    useCallback,
    useRef,
    useState,
    type ChangeEvent,
    type DragEvent,
    type InputHTMLAttributes,
} from "react"

export type FileMetadata = {
    name: string
    size: number
    type: string
    url: string
    id: string
}

export type FileWithPreview = {
    file: File | FileMetadata
    id: string
    preview?: string
    capa: boolean,
}

export type FileUploadOptions = {
    maxFiles?: number
    maxSize?: number
    accept?: string
    multiple?: boolean
    initialFiles?: FileMetadata[]
    onFilesChange?: (files: FileWithPreview[]) => void
    onFilesAdded?: (addedFiles: FileWithPreview[]) => void
}

export type FileUploadState = {
    files: FileWithPreview[]
    isDragging: boolean
    errors: string[]
}

export type FileUploadActions = {
    addFiles: (files: FileList | File[]) => void
    removeFile: (id: string) => void
    clearFiles: () => void
    clearErrors: () => void
    handleDragEnter: (e: DragEvent<HTMLElement>) => void
    handleDragLeave: (e: DragEvent<HTMLElement>) => void
    handleDragOver: (e: DragEvent<HTMLElement>) => void
    handleDrop: (e: DragEvent<HTMLElement>) => void
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
    openFileDialog: () => void
    getInputProps: (
        props?: InputHTMLAttributes<HTMLInputElement>
    ) => InputHTMLAttributes<HTMLInputElement> & {
        ref: React.Ref<HTMLInputElement>
    }
    updateFile: (fileId: string, updates: Partial<{ preview: string; file: File }>) => void;
    // REMOVIDO: A função `setCapa` não é mais exportada ou necessária aqui
    setCapa: (id: string | null) => void
}

export const useFileUpload = (
    options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] => {
    const {
        maxFiles = Infinity,
        maxSize = Infinity,
        accept = "*",
        multiple = false,
        initialFiles = [],
        onFilesChange,
        onFilesAdded,
    } = options

    const [state, setState] = useState<FileUploadState>({
        files: initialFiles.map((file) => ({
            file,
            id: file.id,
            preview: file.url,
            capa: false,
        })),
        isDragging: false,
        errors: [],
    })

    const inputRef = useRef<HTMLInputElement>(null)

    const validateFile = useCallback(
        (file: File | FileMetadata): string | null => {
            // (sem alterações nesta função)
            if (file.size > maxSize) {
                return `O arquivo "${file.name}" excede o tamanho máximo de ${formatBytes(maxSize)}.`;
            }
            if (accept !== "*") {
                const acceptedTypes = accept.split(",").map((type) => type.trim());
                const fileType = file.type || "";
                const fileExtension = `.${file.name.split(".").pop()}`;
                const isAccepted = acceptedTypes.some((type) => {
                    if (type.startsWith(".")) return fileExtension.toLowerCase() === type.toLowerCase();
                    if (type.endsWith("/*")) return fileType.startsWith(`${type.slice(0, -1)}`);
                    return fileType === type;
                });
                if (!isAccepted) return `O arquivo "${file.name}" não é um tipo de arquivo aceito.`;
            }
            return null;
        },
        [accept, maxSize]
    );

    const createPreview = useCallback(
        (file: File | FileMetadata): string | undefined => {
            if (file instanceof File) {
                return URL.createObjectURL(file)
            }
            return file.url
        },
        []
    )

    const generateUniqueId = useCallback((file: File | FileMetadata): string => {
        if (file instanceof File) {
            return `${file.name}-${file.lastModified}-${Math.random().toString(36).substring(2, 9)}`
        }
        return file.id
    }, [])

    const clearFiles = useCallback(() => {
        setState((prev) => {
            prev.files.forEach((file) => {
                if (file.preview && file.file instanceof File) {
                    URL.revokeObjectURL(file.preview)
                }
            })
            if (inputRef.current) {
                inputRef.current.value = ""
            }
            const newState = { ...prev, files: [], errors: [] }
            onFilesChange?.(newState.files)
            return newState
        })
    }, [onFilesChange])

    const addFiles = useCallback((newFiles: FileList | File[]) => {
        if (!newFiles || newFiles.length === 0) return

        const newFilesArray = Array.from(newFiles)
        const errors: string[] = []

        setState((prev) => ({ ...prev, errors: [] }))

        if (!multiple) {
            clearFiles()
        }

        if (multiple && maxFiles !== Infinity && state.files.length + newFilesArray.length > maxFiles) {
            errors.push(`Você pode enviar no máximo ${maxFiles} imagens.`)
            setState((prev) => ({ ...prev, errors }))
            return
        }

        const validFiles: FileWithPreview[] = []
        newFilesArray.forEach((file) => {
            if (multiple) {
                const isDuplicate = state.files.some(f => f.file.name === file.name && f.file.size === file.size);
                if (isDuplicate) return
            }

            const error = validateFile(file)
            if (error) {
                errors.push(error)
            } else {
                validFiles.push({
                    file,
                    id: generateUniqueId(file),
                    preview: createPreview(file),
                    capa: false,
                })
            }
        })

        if (validFiles.length > 0) {
            onFilesAdded?.(validFiles);
            setState((prev) => {
                const newFileArray = !multiple ? validFiles : [...prev.files, ...validFiles];
                onFilesChange?.(newFileArray);
                return { ...prev, files: newFileArray, errors };
            });
        }

        if (inputRef.current) {
            inputRef.current.value = ""
        }
    },
        [state.files, maxFiles, multiple, validateFile, createPreview, generateUniqueId, clearFiles, onFilesChange, onFilesAdded]
    )

    const updateFile = useCallback((fileId: string, updates: Partial<{ preview: string; file: File }>) => {
        setState((prev) => {
            const updatedFiles = prev.files.map((file) => {
                if (file.id === fileId) {
                    const updatedFile = { ...file, ...updates };
                    if (updates.file) {
                        // Limpa o preview antigo antes de criar um novo, se aplicável
                        if (file.preview && file.file instanceof File) URL.revokeObjectURL(file.preview);
                        updatedFile.preview = createPreview(updates.file);
                        updatedFile.file = updates.file;
                    }
                    return updatedFile;
                }
                return file
            })
            onFilesChange?.(updatedFiles)
            return { ...prev, files: updatedFiles }
        })
    }, [createPreview, onFilesChange])

    const removeFile = useCallback((id: string) => {
        console.log("CHAMEI");
        setState((prev) => {
            const fileToRemove = prev.files.find((file) => file.id === id)
            if (fileToRemove?.preview && fileToRemove.file instanceof File) {
                URL.revokeObjectURL(fileToRemove.preview)
            }
            const newFiles = prev.files.filter((file) => file.id !== id)
            onFilesChange?.(newFiles)
            return { ...prev, files: newFiles, errors: [] }
        })
    }, [onFilesChange])

    const setCapa = useCallback((id: string | null) => {
        setState((prev) => {
            const updatedFiles = prev.files.map((file) => ({
                ...file,
                capa: file.id === id
            }));
            onFilesChange?.(updatedFiles);
            return {
                ...prev,
                files: updatedFiles
            };
        });
    }, [onFilesChange]);

    // (As funções de drag-and-drop e de input não precisam de alteração)
    const clearErrors = useCallback(() => setState((prev) => ({ ...prev, errors: [] })), []);
    const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); setState((prev) => ({ ...prev, isDragging: true })); }, []);
    const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); if (e.currentTarget.contains(e.relatedTarget as Node)) return; setState((prev) => ({ ...prev, isDragging: false })); }, []);
    const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); }, []);
    const handleDrop = useCallback((e: DragEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); setState((prev) => ({ ...prev, isDragging: false })); if (inputRef.current?.disabled) return; if (e.dataTransfer.files?.length) { addFiles(e.dataTransfer.files); } }, [addFiles]);
    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => { if (e.target.files?.length) { addFiles(e.target.files); } }, [addFiles]);
    const openFileDialog = useCallback(() => inputRef.current?.click(), []);
    const getInputProps = useCallback((props: InputHTMLAttributes<HTMLInputElement> = {}) => ({ ...props, type: "file" as const, onChange: handleFileChange, accept, multiple, ref: inputRef }), [accept, multiple, handleFileChange]);

    // REMOVIDO: Função setCapa foi completamente removida.

    return [
        state,
        {
            addFiles,
            removeFile,
            clearFiles,
            clearErrors,
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            handleFileChange,
            openFileDialog,
            getInputProps,
            updateFile,
            setCapa,
        },
    ]
}

export const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}