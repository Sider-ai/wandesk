import { wallpaperList } from "../data/wallpapers";
import { setWallpaper, useAppearance } from "../stores/appearance";

export default function WallpaperPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { wallpaperId } = useAppearance();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[400]" onClick={onClose}>
      <div className="absolute left-1/2 top-1/2 w-[720px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/20 bg-black/35 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 text-[13px] font-semibold text-white/90">Wallpaper</div>
        <div className="grid grid-cols-4 gap-3">
          {wallpaperList.map((wallpaper) => (
            <button
              key={wallpaper.id}
              className={`${wallpaper.id} h-24 rounded-[14px] border transition active:scale-[0.98] ${wallpaper.id === wallpaperId ? "border-[#e08850] shadow-[0_0_0_3px_rgba(224,136,80,0.15)]" : "border-white/18"}`}
              onClick={() => {
                setWallpaper(wallpaper.id);
                onClose();
              }}
              title={wallpaper.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
