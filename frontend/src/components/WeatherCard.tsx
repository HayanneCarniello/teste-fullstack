'use client';

import { Sun, CloudRain} from "lucide-react"

interface weatherCardProps {
    city: string;
    temperature:number;
    isRaining:boolean;
    type: string;
}

export function WeatherCard({city, temperature, isRaining, type}: weatherCardProps) {

    const getWeatherIcon = () => {
        if(isRaining) {
            return {
                text: "Está chovendo",
                icon: <CloudRain className="h-8 w-8 text-blue-500"/>
            }
        }else{
            return{
                text: "Sem chuva",
                icon: <Sun className="h-8 w-8 text-yellow-500"/>
            }
        }
    }
    const weather= getWeatherIcon();
    
    return (
        <div className='bg-white rounded-xl p-6 shadow-lg h-fit'>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">{city}</h3>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex itemns-center space-x-3">
                        {getWeatherIcon().icon}
                        <div>
                            <p className="font-medium text-gray-800">{temperature}°C</p>
                            <p className="text-sm text-gray-600">{weather.text}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Tipo Recomendado</h4>
                    <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{type}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Com base na temperatura de {temperature}°C, o Pokémon do tipo {type} são ideias para esta região.
                    </p>
                </div>
        </div>
    </div>
    )
}