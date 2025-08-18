import Image from "next/image";
import { Card } from "../ui/card";

const Brands = () => {
  return (
    <div className="hidden md:block">
      <div className="px-5 py-6">
        <div className="text-2xl font-bold">Marcas Parceiras</div>
      </div>
      <div className="grid grid-cols-7 grid-rows-1 gap-4 px-5">
        <div>
          <Card className="flex min-h-32 items-center justify-center">
            <Image
              src="/simple-icons_nike.png"
              alt="Leve uma vida com estilo"
              height={50}
              width={50}
              sizes="100vw"
              className=""
            />
          </Card>
          <h3 className="py-2 text-center font-semibold">Nike</h3>
        </div>
        <div>
          <Card className="flex min-h-32 items-center justify-center">
            <Image
              src="/simple-icons_adidas.png"
              alt="Leve uma vida com estilo"
              height={50}
              width={50}
              sizes="100vw"
              className=""
            />
          </Card>
          <h3 className="py-2 text-center font-semibold">Adidas</h3>
        </div>
        <div>
          <Card className="flex min-h-32 items-center justify-center">
            <Image
              src="/simple-icons_puma.png"
              alt="Leve uma vida com estilo"
              height={50}
              width={50}
              sizes="100vw"
              className=""
            />
          </Card>
          <h3 className="py-2 text-center font-semibold">Puma</h3>
        </div>
        <div>
          <Card className="flex min-h-32 items-center justify-center">
            <Image
              src="/simple-icons_newbalance.png"
              alt="Leve uma vida com estilo"
              height={50}
              width={50}
              sizes="100vw"
              className=""
            />
          </Card>
          <h3 className="py-2 text-center font-semibold">New Balance</h3>
        </div>
        <div>
          <Card className="flex min-h-32 items-center justify-center">
            <Image
              src="/simple-icons_converse.png"
              alt="Leve uma vida com estilo"
              height={50}
              width={50}
              sizes="100vw"
              className=""
            />
          </Card>
          <h3 className="py-2 text-center font-semibold">Converse</h3>
        </div>
        <div>
          <Card className="flex min-h-32 items-center justify-center">
            <Image
              src="/simple-icons_polo.png"
              alt="Leve uma vida com estilo"
              height={50}
              width={26}
              sizes="100vw"
              className=""
            />
          </Card>
          <h3 className="py-2 text-center font-semibold">Polo</h3>
        </div>
        <div>
          <Card className="flex min-h-32 items-center justify-center">
            <Image
              src="/simple-icons_zara.png"
              alt="Leve uma vida com estilo"
              height={50}
              width={50}
              sizes="100vw"
              className=""
            />
          </Card>
          <h3 className="py-2 text-center font-semibold">Zara</h3>
        </div>
      </div>
    </div>
  );
};

export default Brands;
