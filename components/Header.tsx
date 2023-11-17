import useMessageModal from "@/hooks/useMessageModal";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { BiArrowBack } from "react-icons/bi";

interface HeaderProps {
  label: string;
  showBackArrow?: boolean;
  Icon?: React.ElementType;
  onClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  label,
  showBackArrow,
  Icon,
  onClick,
}) => {
  const router = useRouter();
  const messageModal = useMessageModal();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  return (
    <div className=" border-b-[1px] border-neurtal-800 p-5 flex justify-between items-center h-16">
      <div className="flex flex-row items-center gap-2">
        {showBackArrow && (
          <BiArrowBack
            onClick={handleBack}
            size={20}
            color="white"
            className="cursor-pointer hover:opacity-70 transition"
          />
        )}
        <h1 className="text-white text-xl font-semibold">{label}</h1>
      </div>
      {Icon && (
        <Icon
          size={24}
          className="hover:opacity-70 cursor-pointer"
          onClick={onClick}
        />
      )}
    </div>
  );
};

export default Header;
