// A cart line is one item + chosen variant + chosen add-ons. Two different choices of the same
// item are two lines, so the id encodes the choice.
export function buildLine(item, variant, addons) {
  const addonIds = addons.map((a) => a.id).sort((a, b) => a - b);
  const variantId = variant ? variant.id : 0;
  const base = variant ? variant.pricePaise : item.pricePaise;
  return {
    id: `${item.id}:${variantId}:${addonIds.join(',')}`,
    itemId: item.id,
    variantId,
    addonIds,
    name: item.name,
    variantName: variant ? variant.name : '',
    addons: addons.map(({ id, name, pricePaise }) => ({ id, name, pricePaise })),
    unitPricePaise: base + addons.reduce((sum, a) => sum + a.pricePaise, 0),
    image: item.imageUrl,
  };
}

// "Large · Extra cheese, Olives"
export function describeLine(line) {
  return [line.variantName, line.addons.map((a) => a.name).join(', ')].filter(Boolean).join(' · ');
}
