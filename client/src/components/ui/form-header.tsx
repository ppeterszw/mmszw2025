import logoUrl from "@assets/eaclogo_1756763778691.png";

interface FormHeaderProps {
  title: string;
  subtitle?: string;
}

export function FormHeader({ title, subtitle }: FormHeaderProps) {
  return (
    <div className="gradient-bg py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2">
            <img src={logoUrl} alt="Estate Agents Council Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-white">
            <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-blue-100 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}