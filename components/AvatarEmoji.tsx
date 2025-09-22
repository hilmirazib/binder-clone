type Props = {
  emoji?: string;
  bg?: string; //bg-*
};

export default function AvatarEmoji({
  emoji = "😄",
  bg = "bg-yellow-200",
}: Props) {
  return (
    <div
      className={`w-14 h-14 rounded-full ${bg} flex items-center justify-center`}
    >
      <span className="text-2xl leading-none">{emoji}</span>
    </div>
  );
}
