import Image from "next/image";

const Showcase = () => {
  return (
    <div className="grid grid-cols-5 grid-rows-2 gap-4">
      <div className="col-span-2 col-start-1 row-start-1 px-3">
        <Image
          src="/Showcase-01.png"
          alt="Leve uma vida com estilo"
          height={0}
          width={0}
          sizes="100vw"
          className="hidden h-auto w-full md:block"
        />
      </div>
      <div className="col-span-2 col-start-1 row-start-2 px-3">
        <Image
          src="/Showcase-02.png"
          alt="Leve uma vida com estilo"
          height={0}
          width={0}
          sizes="100vw"
          className="hidden h-auto w-full md:block"
        />
      </div>
      <div className="col-span-3 col-start-3 row-span-2 row-start-1">
        <Image
          src="/Showcase-03.png"
          alt="Leve uma vida com estilo"
          height={0}
          width={0}
          sizes="100vw"
          className="hidden h-auto w-full md:block"
        />
      </div>
    </div>
  );
};

export default Showcase;
