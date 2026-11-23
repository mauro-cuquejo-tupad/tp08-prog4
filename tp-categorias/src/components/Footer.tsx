// pie de página simple
interface FooterProps {
    autor?: string
    anio?: number
}

export function Footer({ autor = "Tecnicatura Universitaria en Programación a Distancia", anio = 2026 }: FooterProps) {
    return (
        <footer className="flex flex-col bg-slate-900 border-t border-slate-800 text-slate-400 py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-col items-center justify-between gap-4 text-sm">
                <p className="">© {anio} Gestor de Productos. Todos los derechos reservados.</p>
                <p className="text-slate-500 text-xs">
                    {autor}
                </p>
            </div>
        </footer>
    )
}