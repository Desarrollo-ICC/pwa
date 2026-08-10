
interface ServiceCardProps {
  name: string;
  description?: string | null;
  duration?: string | null;
  price?: string | null;
}

export default function ServiceCard({ name, description, duration, price }: ServiceCardProps) {
  return (
    <div className="bg-[#F3ECE4] rounded-2xl p-4 shadow-sm border border-[#EDE6D8]">
      <h3 className="font-semibold text-[#1B4332] text-[15px] mb-1">{name}</h3>
      {description && (
        <p className="text-[#6B6B6B] text-[13px] leading-relaxed mb-3">{description}</p>
      )}
      <div className="flex items-center gap-4">
        {duration && duration !== "--" && (
          <div className="flex items-center gap-1.5 text-[#7B6354]">
            <i className="fi-rs-clock-three" style={{ fontSize: 13 }} />
            <span className="text-[12px] font-medium">{duration}</span>
          </div>
        )}
        {price && (
          <div className="flex items-center gap-1.5 text-[#1B4332]">
            <i className="fi-rs-usd-circle" style={{ fontSize: 13 }} />
            <span className="text-[12px] font-semibold">{price}</span>
          </div>
        )}
      </div>
    </div>
  );
}
