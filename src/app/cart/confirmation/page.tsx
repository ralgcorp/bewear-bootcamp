import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";
import { formatAddress } from "../helpers/address";
import FinishOrderButton from "./components/finish-order-button";
import StepBar from "@/components/common/stepbar";

const ConfirmationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("/");
  }
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
  if (!cart || cart?.items.length === 0) {
    redirect("/");
  }
  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );
  if (!cart.shippingAddress) {
    redirect("/cart/identification");
  }
  return (
    <>
      <StepBar step={"STEP2"} />
      <div>
        <div className="grid gap-4 md:grid-cols-5">
          <div className="p-4 md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Card>
                  <CardContent>
                    <p className="text-sm font-semibold">
                      {formatAddress(cart.shippingAddress)}
                    </p>
                  </CardContent>
                </Card>
                <FinishOrderButton />
              </CardContent>
            </Card>
          </div>
          <div className="p-4 md:col-span-2">
            <CartSummary
              subtotalInCents={cartTotalInCents}
              totalInCents={cartTotalInCents}
              products={cart.items.map((item) => ({
                id: item.productVariant.id,
                name: item.productVariant.product.name,
                variantName: item.productVariant.name,
                quantity: item.quantity,
                priceInCents: item.productVariant.priceInCents,
                imageUrl: item.productVariant.imageUrl,
              }))}
            />
          </div>
        </div>
        <div className="mt-12"></div>
      </div>
    </>
  );
};

export default ConfirmationPage;
