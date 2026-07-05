import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getPackById } from "@/lib/billing/packs";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const pack = getPackById(body?.pack_id);
  if (!pack) {
    return NextResponse.json({ error: "Pack inválido" }, { status: 400 });
  }

  // Cria registro de invoice no Supabase (status: pending).
  // IMPORTANTE: escrita em invoices é feita com o service role client —
  // a RLS de invoices só permite SELECT ao usuário (ver migration 007).
  // Com o client do usuário o INSERT era negado pela RLS e a compra quebrava com 500.
  const admin = createServiceClient();
  const { data: invoice, error: invoiceErr } = await admin
    .from("invoices")
    .insert({
      user_id: user.id,
      amount_brl: pack.price_brl,
      minutes_purchased: pack.minutes,
      pack_id: pack.id,
      status: "pending",
    })
    .select("id")
    .single();

  if (invoiceErr || !invoice) {
    return NextResponse.json({ error: "Erro ao criar invoice" }, { status: 500 });
  }

  const mp = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
  });

  const preference = new Preference(mp);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const result = await preference.create({
    body: {
      items: [
        {
          id: pack.id,
          title: `${pack.minutes} minutos — Usina de Cortes Virais`,
          quantity: 1,
          unit_price: pack.price_brl,
          currency_id: "BRL",
        },
      ],
      external_reference: JSON.stringify({
        user_id: user.id,
        invoice_id: invoice.id,
        pack_id: pack.id,
      }),
      back_urls: {
        success: `${appUrl}/dashboard/credits?payment=success`,
        failure: `${appUrl}/dashboard/credits?payment=failure`,
        pending: `${appUrl}/dashboard/credits?payment=pending`,
      },
      auto_return: "approved",
      notification_url: `${appUrl}/api/billing/webhook`,
    },
  });

  // Salva preference_id na invoice (service role — RLS de invoices é SELECT-only)
  await admin
    .from("invoices")
    .update({ mp_preference_id: result.id })
    .eq("id", invoice.id);

  return NextResponse.json({ init_point: result.init_point });
}
