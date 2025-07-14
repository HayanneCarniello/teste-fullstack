"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, MapPin, Thermometer, Calendar } from "lucide-react"

interface SearchHistory{
    id:string;
    city: string;
    temperature: number;
    isRaining: boolean;
    timestamp: string;
    type: string;
    pokemonCount: number;
}

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: SearchHistory[];
    onSelectHistory: (item:SearchHistory) => void;
    onClearHistory: () => void;
}

export default function HistoryModal({isOpen, onClose, history, onSelectHistory, onClearHistory}: HistoryModalProps) {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        }).format(new Date(date))
    }
    
    return(
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
                <span>Histórico de Buscas</span>
                {history.length > 0 && (
                <Button
                    onClick={onClearHistory}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar
                </Button>
                )}
            </DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto max-h-[60vh]">
            {history.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma busca realizada ainda</p>
                <p className="text-sm">Suas buscas aparecerão aqui</p>
                </div>
            ) : (
                <div className="space-y-3">
                {history.map((item) => (
                    <div
                    key={item.id}
                    onClick={() => onSelectHistory(item)}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <h3 className="font-semibold text-gray-800 capitalize">{item.city}</h3>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                            <Thermometer className="h-4 w-4" />
                            <span>{item.temperature}°C</span>
                            </div>

                            <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            {/* <span>{formatDate(item.timestamp)}</span> */}
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                            {/* {item.pokemonCount} Pokémon encontrados • {item.condition} */}
                        </p>
                        </div>

                        <div className="text-right">
                        <Button variant="ghost" size="sm">
                            Ver resultados
                        </Button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
            </div>
        </DialogContent>
        </Dialog>
    )
}