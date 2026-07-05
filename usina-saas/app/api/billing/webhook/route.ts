import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createServiceClient } from "@/lib/supabase/service";
import { getPackById } from "@/lib/billing/packs";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  // MP envia type=payment quando pagamento é aprovado
  if (!body || body.type !== "payment" || !body.data?.id) {
    return NextResponse.json({ ok: true });
  }

  const paymentId = String(body.data.id);

  let payment;
  try {
    const paymentClient = new Payment(mp);
    payment = await paymentClient.get({ id: paymentId });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar pagamento" }, { status: 500 });
  }

  if (payment.status !== "approved") {
    return NextResponse.json({ ok: true });
  }

  let ref: { user_id: string; invoice_id: string; pack_id: string };
  try {
    ref = JSON.parse(payment.external_reference ?? "{}");
  } catch {
    return NextResponse.json({ error: "external_reference inválido" }, { status: 400 });
  }

  if (!ref.user_id || !ref.invoice_id) {
    return NextResponse.json({ error: "Referência incompleta" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Salva payment_id na invoice
  await supabase
    .from("invoices")
    .update({ mp_payment_id: paymentId })
    .eq("id", ref.invoice_id);

  // Busca minutes/pack da invoice
  const { data: invoice } = await supabase
    .from("invoices")
    .select("minutes_purchased, pack_id")
    .eq("id", ref.invoice_id)
    .single();

  if (!invoice?.minutes_purchased) {
    return NextResponse.json({ error: "Invoice sem minutos" }, { status: 400 });
  }

  // Confere o valor pago contra o preço do pack antes de creditar.
  // Sem isso, um pagamento adulterado (valor menor que o pack) ainda
  // creditaria os minutos cheios. Usa o pack_id gravado na invoice
  // (fonte confiável, definido no server em create-preference).
  const pack = getPackById(invoice.pack_id ?? ref.pack_id);
  if (!pack) {
    return NextResponse.json({ error: "Pack inválido na invoice" }, { status: 400 });
  }

  const paidAmount = Number(payment.transaction_amount);
  if (!Number.isFinite(paidAmount) || Math.abs(paidAmount - pack.price_brl) > 0.01) {
    console.error(
      `Webhook MP: valor divergente. Pago=${payment.transaction_amount} esperado=${pack.price_brl} pack=${pack.id} invoice=${ref.invoice_id}`
    );
    return NextResponse.json({ error: "Valor do pagamento não confere com o pack" }, { status: 400 });
  }

  // Adiciona créditos (idempotente via RPC)
  const { error } = await supabase.rpc("add_purchased_credits", {
    p_user_id: ref.user_id,
    p_minutes: invoice.minutes_purchased,
    p_invoice_id: ref.invoice_id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
