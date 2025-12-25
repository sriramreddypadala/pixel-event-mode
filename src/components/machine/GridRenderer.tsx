import { useState } from 'react';
import type { GridTemplate } from '@/types/grid';
import { ImageOff } from 'lucide-react';

interface GridRendererProps {
    template: GridTemplate;
    photos: string[]; // Array of data URLs
    className?: string;
    showOverlay?: boolean;
}

export function GridRenderer({ template, photos, className = '', showOverlay = true }: GridRendererProps) {
    const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

    // Sort slots by zIndex
    const sortedSlots = [...template.slots].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    const handleImageError = (index: number) => {
        setFailedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(index);
            return newSet;
        });
    };

    return (
        <div
            className={`relative overflow-hidden shadow-2xl ${className}`}
            style={{
                aspectRatio: `${template.canvasWidth} / ${template.canvasHeight}`,
                backgroundColor: template.backgroundColor || '#ffffff',
                backgroundImage: template.backgroundImage ? `url(${template.backgroundImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Photos mapped to slots */}
            {sortedSlots.map((slot, index) => {
                const photo = photos[index]; // Map photo to slot by index
                const isError = failedImages.has(index);

                return (
                    <div
                        key={slot.id}
                        className="absolute overflow-hidden"
                        style={{
                            left: `${slot.x}%`,
                            top: `${slot.y}%`,
                            width: `${slot.width}%`,
                            height: `${slot.height}%`,
                            borderRadius: `${slot.radius || 0}px`,
                            zIndex: slot.zIndex || 1,
                        }}
                    >
                        {photo && !isError ? (
                            <img
                                src={photo}
                                alt={`Slot ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={() => handleImageError(index)}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200/80 backdrop-blur-sm flex flex-col items-center justify-center text-gray-400 p-2 text-center">
                                <ImageOff className="w-6 h-6 mb-1 opacity-50" />
                                <span className="text-xs font-medium">
                                    {isError ? 'Preview Error' : 'Empty'}
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Logo Overlay */}
            {template.logo && (
                <div
                    className="absolute z-50 pointer-events-none"
                    style={{
                        left: `${template.logo.x}%`,
                        top: `${template.logo.y}%`,
                        width: `${template.logo.width}%`,
                        height: `${template.logo.height}%`,
                    }}
                >
                    <img
                        src={template.logo.url}
                        alt="Logo"
                        className="w-full h-full object-contain"
                    />
                </div>
            )}

            {/* Optional Gloss/Overlay Effect */}
            {showOverlay && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-50 z-[100]" />
            )}
        </div>
    );
}
