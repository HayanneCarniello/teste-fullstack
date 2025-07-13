'use client'
import Image from "next/image"
import { SearchBar } from "@/components/SearchBar";
import { PokemonCard } from "@/components/PokemonCard";
import { WeatherCard } from "@/components/WeatherCard";
import { Loader } from "@/components/Loader"
import { useState } from "react";
import api from "@/lib/api";
// import { Pokemon, WeatherData} from "@/types/pokemon";

interface WeatherData{
  city: string;
  temperature: number;
  isRaining: boolean;
  type: string;
}

interface Pokemon {
  id: number;
  name: string;
  types: string;
}

export default function Home() {

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleSearch = async (city: string) => {
    try{
      setIsLoading(true);
      const {data} = await api.get(`/weather?city=${city}`);
      setWeatherData({
        city:data.city,
        temperature: data.temperature,
        isRaining: data.isRaining,
        type: data.pokemonType || '', 
      });
      setPokemons(data.pokemons || []);
      setHasSearched(true);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }finally{
      setIsLoading(false);
    }
  };

  return(
    <div className='min-h-screen bg-gradient-to-br from-cyan-400 via-blue-400 to-blue-600'>

      <div className="container mx-auto px-4 py-8"></div>
      {/*Header Logo*/}
      <div className={`text-center transition-all duration-500 ${hasSearched ? "mb-8" : "mb-16 mt-20"}`}>
        <Image src="/pokehunter-logo.png" alt="Logo Pokehunter" width={300} height={80} className="mx-auto mb-8"/>
      </div>

      {/*Barra de pesquisa*/}
      <div className={`transition-all duration-500 ${hasSearched ? "mb-8" : "mb-20"}`}>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {/*Carregando...*/}
      {isLoading && (
        <div className="flex justify-center mb-8">
          <Loader />
        </div>
      )}

      {/*Resultados*/}
      {hasSearched && !isLoading && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h2 className="text-2x1 font-bold text-gray-800 mb-6">Resultados</h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/*WeatherCard*/}
            <div className="lg:col-span-1">
              {weatherData && (
                <WeatherCard
                  city={weatherData.city}
                  temperature={weatherData.temperature}
                  isRaining={weatherData.isRaining}
                  type={weatherData.type}
                />
              )}
            </div>
            {/*PokemonCard*/}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {pokemons.map((pokemon) => (
                  <PokemonCard 
                  key={pokemon.id} 
                  pokemon={{
                    id: pokemon.id,
                    name: pokemon.name,
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
                    types: pokemon.types.split(",").map((t) => t.trim()),
                  }} 
                  />
                ))}
              </div>
            </div>
          </div>
      </div>
      )}
    </div>
  );
}




