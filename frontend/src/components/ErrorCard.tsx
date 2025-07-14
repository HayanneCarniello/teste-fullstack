"use client";

import {AlertCircle, RotateCcw} from "lucide-react";
import {Button} from "@/components/ui/button";

interface ErrorCardProps {
    message: string;
    onRetry: () => void;
}

export default function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-l-4 border-red-500">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Cidade não encontrada</h3>
          <p className="text-gray-600 mb-4">{message}</p>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Dicas:</p>
            <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                <li>Verifique a ortografia da cidade</li>
                <li>Tente usar o nome completo da cidade</li>
                <li>Certifique-se de que a cidade existe</li>
            </ul>
          </div>

          <Button onClick={onRetry} variant="outline" className="mt-4 bg-transparent">
            <RotateCcw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    </div>
  )
}
