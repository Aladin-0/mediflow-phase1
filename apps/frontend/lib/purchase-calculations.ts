import { PurchaseItemFormData } from '../types';

export function calculatePurchaseItem(item: {
  qty: number
  freeQty: number
  purchaseRate: number
  discountPct: number
  gstRate: number
  mrp: number
  saleRate: number
}): {
  effectiveQty: number
  taxableAmount: number
  gstAmount: number
  totalAmount: number
  marginPct: number
  freeGoodsValue: number
} {
  const effectiveQty = item.qty + item.freeQty
  const baseAmount = item.qty * item.purchaseRate
  const discountAmount = baseAmount * (item.discountPct / 100)
  const taxableAmount = baseAmount - discountAmount
  const gstAmount = taxableAmount * (item.gstRate / 100)
  const totalAmount = taxableAmount + gstAmount

  const marginPct = item.saleRate > 0
    ? ((item.saleRate - item.purchaseRate) / item.purchaseRate) * 100
    : 0

  const freeGoodsValue = item.freeQty * item.purchaseRate

  return {
    effectiveQty,
    taxableAmount,
    gstAmount,
    totalAmount,
    marginPct,
    freeGoodsValue,
  }
}

export function calculatePurchaseTotals(
  items: PurchaseItemFormData[]
): {
  itemCount: number
  totalQty: number
  subtotal: number
  totalDiscount: number
  taxableAmount: number
  cgstAmount: number
  sgstAmount: number
  grandTotal: number
  freeGoodsValue: number
} {
  let subtotal = 0;
  let totalDiscount = 0;
  let taxableAmount = 0;
  let gstAmount = 0;
  let totalQty = 0;
  let freeGoodsValue = 0;

  items.forEach(item => {
    const calc = calculatePurchaseItem(item);
    subtotal += item.qty * item.purchaseRate;
    totalDiscount += (item.qty * item.purchaseRate) * (item.discountPct / 100);
    taxableAmount += calc.taxableAmount;
    gstAmount += calc.gstAmount;
    totalQty += item.qty;
    freeGoodsValue += calc.freeGoodsValue;
  });

  const cgstAmount = gstAmount / 2;
  const sgstAmount = gstAmount / 2;
  const grandTotal = taxableAmount + gstAmount;

  return {
    itemCount: items.length,
    totalQty,
    subtotal,
    totalDiscount,
    taxableAmount,
    cgstAmount,
    sgstAmount,
    grandTotal,
    freeGoodsValue,
  };
}
