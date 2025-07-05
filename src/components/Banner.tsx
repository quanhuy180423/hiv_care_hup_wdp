import { Assets } from "@/assets";

const Banner = () => {
  return (
    <div className="relative w-full flex items-center justify-center my-4">
      <img
        src={Assets.banner_home}
        alt="Banner"
        className="w-full object-cover h-[700px] "
      />
    </div>
  );
};

export default Banner;
