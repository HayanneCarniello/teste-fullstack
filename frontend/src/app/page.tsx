'use client'
import Image from "next/image"
import { SearchBar } from "@/components/SearchBar";
import { PokemonCard } from "@/components/PokemonCard";
import { WeatherCard } from "@/components/WeatherCard";
import { Loader } from "@/components/Loader"
import { useState, useEffect } from "react";
import api from "@/lib/api";
import FavoritesModal from "@/components/FavoritesModal";
import CacheStatus from "@/components/CacheStatus";
import HistoryModal from "@/components/HistoryModal";
import { Button } from "@/components/ui/button";
import { History, Heart } from "lucide-react";
import ErrorCard from "@/components/ErrorCard"
import { Pokemon, WeatherData } from "@/types/pokemon";

interface SearchHistory {
  id: string;
  city: string;
  temperature: number;
  isRaining: boolean;
  timestamp: string;
  pokemonCount: number;
  type: string;
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [favorites, setFavorites] = useState<Pokemon[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  interface CacheData {
    data: any;
    timestamp: number;
    expiresIn: number; // minutos
  }

  const CACHE_DURATION = {
    WEATHER: 30,
    POKEMON: 60,
  }

  const getFromCache = (key: string): any | null => {
    try {
      const cached = localStorage.getItem(`cache_${key}`)
      if (!cached) return null

      const cacheData: CacheData = JSON.parse(cached)
      const now = Date.now()
      const expirationTime = cacheData.timestamp + cacheData.expiresIn * 60 * 1000

      if (now > expirationTime) {
        localStorage.removeItem(`cache_${key}`)
        return null
      }

      return cacheData.data
    } catch {
      return null
    }
  }

  const setCache = (key: string, data: any, expiresInMinutes: number) => {
    try {
      const cacheData: CacheData = {
        data,
        timestamp: Date.now(),
        expiresIn: expiresInMinutes,
      }
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData))
    } catch (error) {
      console.warn("Erro ao salvar cache:", error)
    }
  }

  useEffect(() => {
    const savedHistory = localStorage.getItem("pokemon-search-history")
    const savedFavorites = localStorage.getItem("pokemon-favorites")

    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
    if (savedFavorites) {
      const favoritesFromStorage = JSON.parse(savedFavorites);
      setFavorites(
        favoritesFromStorage.map((p: any) => ({
          ...p,
          image: p.image || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`,
          types: Array.isArray(p.types)
            ? p.types
            : (p.types ?? "").split(",").map((t: string) => t.trim()),
        }))
      );
    }

    // if (savedFavorites) {
    //   setFavorites(JSON.parse(savedFavorites))
    // }
  }, [])

  const saveToHistory = (city: string, weather: WeatherData, pokemonCount: number) => {
    const newEntry: SearchHistory = {
      id: Date.now().toString(),
      city: weather.city,
      temperature: weather.temperature,
      isRaining: weather.isRaining,
      timestamp: new Date().toISOString(),
      pokemonCount,
      type: weather.type
    }

    const updatedHistory = [newEntry, ...searchHistory.slice(0, 9)]
    setSearchHistory(updatedHistory)
    localStorage.setItem("pokemon-search-history", JSON.stringify(updatedHistory))
  }

  const handleSearch = async (city: string) => {
    const cacheKey = city.toLowerCase().trim();
    const cachedWeather = getFromCache(`weather_${cacheKey}`);
    const cachedPokemons = getFromCache(`pokemon_${cacheKey}`);

    if (cachedWeather && cachedPokemons) {
      setWeatherData(cachedWeather);
      setPokemons(cachedPokemons);
      setHasSearched(true);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null); 

      const { data } = await api.get(`/weather?city=${encodeURIComponent(city)}`);

      const weatherData = {
        city: data.city,
        temperature: data.temperature,
        isRaining: data.isRaining,
        type: data.pokemonType || '',
      };
      const pokemons = data.pokemons || [];

      setWeatherData(weatherData);
      setPokemons(
        pokemons.map((p: any) => ({
          id: p.id,
          name: p.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`,
          types: p.types.split(",").map((t: string) => t.trim()),
        }))
      );
      setHasSearched(true);

      setCache(`weather_${cacheKey}`, weatherData, CACHE_DURATION.WEATHER);
      setCache(`pokemon_${cacheKey}`, pokemons, CACHE_DURATION.POKEMON);

      saveToHistory(city, weatherData, pokemons.length);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);

      setHasSearched(true);
      setWeatherData(null);
      setPokemons([]);
      setError("Cidade não encontrada ou servidor fora do ar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleHistorySelect = (historyItem: SearchHistory) => {
  const weatherResult: WeatherData = {
    city: historyItem.city,
    temperature: historyItem.temperature,
    isRaining: historyItem.isRaining,
    type: historyItem.type,
  }

  const cacheKey = historyItem.city.toLowerCase().trim()
  const cachedPokemons = getFromCache(`pokemon_${cacheKey}`)

  setWeatherData(weatherResult)

  if (cachedPokemons) {
    setPokemons(
      cachedPokemons.map((p: any) => ({
        id: p.id,
        name: p.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`,
        types: p.types.split(",").map((t: string) => t.trim()),
      }))
    )
  } else {
    setPokemons([])
  }

  setHasSearched(true)
  setError(null)
  setShowHistory(false)
}


  const toggleFavorite = (pokemon: Pokemon) => {
    const isFavorite = favorites.some((fav) => fav.id === pokemon.id)
    let updatedFavorites

    if (isFavorite) {
      updatedFavorites = favorites.filter((fav) => fav.id !== pokemon.id)
    } else {
      updatedFavorites = [...favorites, pokemon]
    }

    setFavorites(updatedFavorites)
    localStorage.setItem("pokemon-favorites", JSON.stringify(updatedFavorites))
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-cyan-400 via-blue-400 to-blue-600'>
      <div className="container mx-auto px-4 py-8">
        {/* Header com logo e botões */}
        <div className={`text-center transition-all duration-500 ${hasSearched ? "mb-8" : "mb-16 mt-20"}`}>
          <Image src="/pokehunter-logo.png" alt="Logo Pokehunter" width={300} height={80} className="mx-auto mb-8" />
        </div>

        {/* Botões de ação */}
        <div className="flex justify-center gap-4 mb-4">
          <Button
            onClick={() => setShowHistory(true)}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <History className="h-4 w-4 mr-2" />
            Histórico ({searchHistory.length})
          </Button>

          <Button
            onClick={() => setShowFavorites(true)}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <Heart className="h-4 w-4 mr-2" />
            Favoritos ({favorites.length})
          </Button>
        </div>
      </div>

      {/* Barra de busca */}
      <div className={`transition-all duration-500 ${hasSearched ? "mb-8" : "mb-20"}`}>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {/* Carregando... */}
      {isLoading && (
        <div className="flex justify-center mb-8">
          <Loader />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="max-w-md mx-auto mb-8">
          <ErrorCard message={error} onRetry={() => setError(null)} />
        </div>
      )}

      {/* Resultados */}
      {hasSearched && !isLoading && !error && (weatherData || pokemons.length > 0) && (
        // <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Resultados</h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Weather Card */}
            <div className="lg:col-span-1">
              {weatherData && <WeatherCard {...weatherData} />}
            </div>

            {/* Pokemon Cards */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {pokemons.map((pokemon) => (
                  <PokemonCard 
                    key={pokemon.id} 
                    pokemon={pokemon}
                    isFavorite={favorites.some((fav) => fav.id === pokemon.id)}
                    onToggleFavorite={() => toggleFavorite(pokemon)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Histórico */}
      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={searchHistory}
        onSelectHistory={handleHistorySelect}
        onClearHistory={() => {
          setSearchHistory([])
          localStorage.removeItem("pokemon-search-history")
        }}
      />

      {/* Modal de Favoritos */}
      <FavoritesModal
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        favorites={favorites}
        onRemoveFavorite={(pokemonId) => {
          const updatedFavorites = favorites.filter((fav) => fav.id !== pokemonId)
          setFavorites(updatedFavorites)
          localStorage.setItem("pokemon-favorites", JSON.stringify(updatedFavorites))
        }}
        onClearFavorites={() => {
          setFavorites([])
          localStorage.removeItem("pokemon-favorites")
        }}
      />

      {/* Cache Status (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === "development" && (
        <CacheStatus
          onClearCache={() => {
            console.log("Cache limpo!")
          }}
        />
      )}
    </div>
  )
}
