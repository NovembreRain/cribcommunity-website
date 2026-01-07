import Image from "next/image"

export default function Loading() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#FDF8F5] z-[100] fixed inset-0">
      <div className="relative">
        {/* Breathing Animation Wrapper */}
        <div className="animate-[pulse_3s_ease-in-out_infinite] flex flex-col items-center gap-6">
          
          {/* Logo Container */}
          <div className="relative w-24 h-24">
             <Image 
               src="/logo/logo.png" 
               alt="Loading..." 
               fill 
               className="object-contain"
               priority
             />
          </div>
          
          {/* Text */}
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-[#4A3B32] tracking-tight">
              Crib<span className="font-light">Community</span>
            </h2>
            <p className="text-xs text-[#8C7A6B] mt-2 uppercase tracking-widest animate-pulse">
              Loading Sanctuary...
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}