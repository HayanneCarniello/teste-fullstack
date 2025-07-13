'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {Search} from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading:boolean
}

export function SearchBar({onSearch, isLoading}:SearchBarProps){
    const [city, setCity] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (city.trim()) {
            onSearch(city.trim());
        }
    };

    return (
        <div className='max-w-md mx-auto'>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 z-10'></Search>
                    <Input
                        type='text'
                        placeholder='Digite o nome da cidade...'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className='pl-10 h-12 text-lg bg-white/90 backdrop-blur-sm border-0 shadow-1g rounded-full'
                        disabled={isLoading}
                    />              
                </div>
                <Button 
                    type='submit' 
                    disabled = {!city.trim() || isLoading}
                    className='w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg'
                >
                    {isLoading ? 'Buscando...' : 'Buscar Pokémon'}
                </Button>
            </form>
        </div>
    )
}

