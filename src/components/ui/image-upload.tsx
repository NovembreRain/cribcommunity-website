"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { createBrowserClient } from '@supabase/ssr' // Changed import
import { ImagePlus, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  onRemove: (value: string) => void
  maxFiles?: number
}

export function ImageUpload({
  value = [],
  onChange,
  onRemove,
  maxFiles = 1
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  // Initialize Authenticated Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsUploading(true)
      const newUrls: string[] = []

      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('crib-assets')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('crib-assets')
          .getPublicUrl(filePath)

        newUrls.push(publicUrl)
      }

      onChange([...value, ...newUrls])
      toast.success("Image uploaded")

    } catch (error: any) {
      toast.error("Upload failed", { description: error.message })
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }, [value, onChange, supabase]) // Added dependency

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: maxFiles - value.length,
    disabled: isUploading || value.length >= maxFiles
  })

  return (
    <div className="space-y-4">
      <div className={cn("grid gap-4", value.length > 0 ? "grid-cols-2 md:grid-cols-4 mb-4" : "hidden")}>
        {value.map((url) => (
          <div key={url} className="relative aspect-video rounded-lg overflow-hidden border border-stone-200 group">
            {/* FIX: Added sizes prop for performance */}
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button type="button" onClick={() => onRemove(url)} className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {value.length < maxFiles && (
        <div {...getRootProps()} className={cn("relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2 text-center", isDragActive ? "border-primary bg-primary/5" : "border-stone-200 hover:border-primary/50 hover:bg-stone-50", isUploading && "opacity-50 cursor-not-allowed")}>
          <input {...getInputProps()} />
          <div className="p-4 rounded-full bg-stone-100 mb-2">
            {isUploading ? <Loader2 className="h-6 w-6 animate-spin text-stone-400" /> : <ImagePlus className="h-6 w-6 text-stone-400" />}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-stone-700">{isUploading ? "Uploading..." : "Click or drag images here"}</p>
          </div>
        </div>
      )}
    </div>
  )
}