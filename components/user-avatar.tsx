import { Blobatar } from "@/components/ui/blobatar";
import { cn } from "@/lib/utils";

const BLOBATAR_BACKGROUND = "#1e170f";
const BLOBATAR_TONE = 0.55;

interface UserAvatarProps {
  className?: string;
  hideAvatar?: boolean | null;
  image?: string | null;
  name: string;
  standalone?: boolean;
}

export function UserAvatar({
  className,
  hideAvatar = false,
  image,
  name,
  standalone = false,
}: UserAvatarProps) {
  const src = hideAvatar ? undefined : (image ?? undefined);

  return (
    <Blobatar
      blobatar={{
        background: "circle",
        contrast: true,
        palette: { bg: BLOBATAR_BACKGROUND },
        tone: BLOBATAR_TONE,
        ...(standalone ? { title: name } : {}),
      }}
      className={cn("border border-rule-2 bg-bg-3", className)}
      key={src ?? "blobatar"}
      name={name}
      src={src}
    />
  );
}
