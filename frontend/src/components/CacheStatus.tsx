"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";   
import {RefreshCw, Database, Clock} from "lucide-react";
import { clear } from "console";

interface CacheStatusProps{
    onClearCache: () => void;
}

export default function CacheStatus({onClearCache}:CacheStatusProps) {
    const [cacheInfo, setCacheInfo] = useState <{
        weatherEntries: number;
        pokemonEntries: number;
        totalSize: string;
    }>({
        weatherEntries: 0,
        pokemonEntries: 0,
        totalSize:"0 KB",
    })

    const updateCacheInfo = async () => {
        let weatherCount = 0
        let pokemonCount = 0
        let totalSize = 0

        for (let i = 0; i < localStorage.length; i++){
            const key = localStorage.key(i);
            if (key?.startsWith("cache_weather_")) weatherCount++
            if (key?.startsWith("cache_pokemon_")) pokemonCount++
            if (key?.startsWith("cache_")) {
                const value = localStorage.getItem(key);
                if (value) totalSize += value.length;
            }
        }
        
        setCacheInfo({
            weatherEntries: weatherCount,
            pokemonEntries: pokemonCount,
            totalSize: `${(totalSize / 1024).toFixed(2)} KB`
        })
    }

    useEffect(() => {
        updateCacheInfo();
        const interval = setInterval(updateCacheInfo, 5000)
        return () => clearInterval(interval);
    }, []);

    const handleClearCache = () => {
        const keysToRemove: string[] = [];
        for (let i=0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith("cache_")) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
        updateCacheInfo();
        onClearCache();
    }

    return (
        <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border text-xs">
            <div className="flex items-center space-x-2 mb-2">
                <Database className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">Cache Status</span>
            </div>

            <div className="space-y-1 text-gray-600">
                <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Clima: {cacheInfo.weatherEntries} entradas</span>
                </div>
                <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Pokémon: {cacheInfo.pokemonEntries} entradas</span>
                </div>
                <div className="text-xs text-gray-500">Tamanho: {cacheInfo.totalSize}</div>
            </div>

            <Button onClick={handleClearCache} variant="outline" size="sm" className="w-full mt-2 h-7 text-xs bg-transparent">
                <RefreshCw className="h-3 w-3 mr-1" />
                Limpar Cache
            </Button>
        </div>    
    )

}