export function Loader() {
    return (
        <div className='flex flex-col items-center space-y-4'>
            <div className='relative'>
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-full animate-pulse"></div>
                </div>
            </div>
            <p className="text-white font-medium">Buscando Pokémon...</p>
        </div>
    )
}