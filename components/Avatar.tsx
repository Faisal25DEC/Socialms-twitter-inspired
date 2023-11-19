import useUser from "@/hooks/useUser";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback } from "react";

interface AvatarProps {
  userId: string;
  isLarge?: boolean;
  hasBorder?: boolean;
  size?: string;
  src?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  userId,
  isLarge,
  hasBorder,
  size,
  src,
}) => {
  const { data: fetchedUser } = useUser(userId);
  const router = useRouter();
  const onClick = useCallback(
    (event: any) => {
      event.stopPropagation();
      const url = `/users/${userId}`;
      router.push(url);
    },
    [router, userId]
  );

  return (
    <div
      className={`${hasBorder ? "border-4 border-black" : ""}
        ${isLarge ? "h-28" : "h-12"}
        ${isLarge ? "w-28" : "w-12"}
        ${size === "sm" ? "w-8" : "w-12"}
        ${size === "sm" ? "h-8" : "h-12"}
        rounded-full
        object-cover
        hover:opacity-90
        transition
        cursor-pointer
        relative`}
    >
      <Image
        fill
        style={{
          objectFit: "cover",
          borderRadius: "100%",
        }}
        alt="Avatar"
        onClick={onClick}
        src={src ? src : fetchedUser?.profileImage || "/images/placeholder.png"}
      />
    </div>
  );
};

export default Avatar;
