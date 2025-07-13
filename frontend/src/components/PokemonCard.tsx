'use client';

import Image from "next/image";

interface Pokemon{
    id: number;
    name: string;
    image: string;
    types:string[];
}

interface PokemonCardProps{
    pokemon: Pokemon;
}

export function PokemonCard({pokemon}: PokemonCardProps) {
    const getTypeColor = (type: string) => {
        const colors: {[key:string]:string} = {
            fire: "bg-red-100 text-red-800",
            water: "bg-blue-100 text-blue-800",
            grass: "bg-green-100 text-green-800",
            electric: "bg-yellow-100 text-yellow-800",
            ice: "bg-cyan-100 text-cyan-800",
            ground:"bg-amber-100 text-amber-800",
            rock: "bg-gray-100 text-gray-800",
            flying: "bg-indigo-100 text-indigo-800",
            bug: "bg-lime-100 text-lime-800",
            normal: "bg-gray-100 text-gray-800",
        };
        return colors[type.toLocaleLowerCase()] || "bg-gray-100 text-gray-800";
    };

    return(
        <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-x1 transition-shadow">
            <div className="text-center mb-3">
                <h3 className="font-bold text-gray-800 mb-2 capitalize">{pokemon.name}</h3>
                <div className="relative w-32 h-32 mx-auto mb-3">
                    <Image 
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} 
                        alt={pokemon.name} 
                        fill 
                        className="object-contain rounded-lg"
                    />
                </div>
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
                {pokemon.types.map((type) => (
                    <span 
                        key={type.trim()} 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type.trim())}`}
                    >
                        {type.trim()}
                    </span>
                ))}
            </div>
        </div>
    );
}

