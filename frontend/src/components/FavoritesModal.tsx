"use client"

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button"
import {Trash2,Heart, X} from "lucide-react";
import Image from "next/image";
import {useState} from "react";

interface Pokemon{
    id: number;
    name: string;
    image: string;
    types: string[];
}

interface FavoritesModalProps {
    isOpen: boolean;
    onClose: () => void;
    favorites: Pokemon[];
    onRemoveFavorite: (pokemonId: number) => void;
    onClearFavorites: () => void;
}

export default function FavoritesModal({
    isOpen,
    onClose,
    favorites,
    onRemoveFavorite,
    onClearFavorites
}: FavoritesModalProps) {
    const getTypeColor = (type:string) => {
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
            normal: "bg-gray-100 text-gray-800"
        };
        return colors[type.toLowerCase()] || "bg-gray-100 text-gray-800";
    }

    return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span>Pokémon Favoritos</span>
            </div>
            {favorites.length > 0 && (
                <Button
                onClick={onClearFavorites}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 bg-transparent"
                >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar todos
                </Button>
            )}
            </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh]">
            {favorites.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
                <Heart className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">Nenhum favorito ainda</h3>
                <p className="text-sm">Clique no coração dos Pokémons para adicioná-los aos favoritos</p>
            </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((pokemon) => (
                <div key={pokemon.id} className="bg-white rounded-xl p-4 shadow-lg border relative">
                    {/* Botão de remover */}
                    <Button
                    onClick={() => onRemoveFavorite(pokemon.id)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 p-1 h-auto text-gray-400 hover:text-red-500"
                    >
                    <X className="h-4 w-4" />
                    </Button>

                    <div className="text-center mb-3">
                        <div className="relative w-24 h-24 mx-auto mb-3">
                            <Image
                                src={pokemon.image} 
                                alt={pokemon.name} 
                                fill 
                                className="object-contain rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-bold text-lg text-gray-800 text-center">{pokemon.name}</h4>

                        <div className="flex flex-wrap gap-1 justify-center">
                            {pokemon.types.map((type) => (
                            <span key={type} className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
                                {type}
                            </span>
                            ))}
                        </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>

        {favorites.length > 0 && (
            <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Total: {favorites.length} Pokémon favoritos</span>
                <span>Clique no X para remover da lista</span>
            </div>
            </div>
        )}
        </DialogContent>
    </Dialog>
    )
}
